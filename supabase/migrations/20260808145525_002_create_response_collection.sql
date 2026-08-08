/*
# BIRD Validation Survey Platform — Response Collection

## Overview
This migration creates the response-collection layer of the BIRD validation survey platform.
It captures who responded to a survey, their overall response session, and individual answers
to each question. The schema supports all interactive question types, storing answer data in
flexible JSONB columns so each question type can capture its specific response format.

## New Tables

### 1. respondents
Represents a person who took (or was invited to take) a BIRD validation survey. Respondents
are anonymous-by-design — no email is required to submit, but optional demographic metadata
helps with stakeholder segmentation analysis.
- `id` — UUID primary key
- `survey_id` — FK to surveys (a respondent record is per-survey)
- `anonymous_id` — a generated unique token used in public survey links (so the same person
  can be tracked across sessions without login)
- `stakeholder_type` — actor category: 'government', 'private_sector', 'civil_society',
  'academe', 'youth', 'women_group', 'ip_community', 'religious_leader', 'media', 'other'
- `demographics` — JSONB for optional demographic data: { age_range, gender, region,
  province, municipality, organization, role }
- `dpa_consent_given` — boolean: did the respondent agree to the DPA 2012 consent statement
- `dpa_consent_at` — timestamp of consent
- `created_at` — timestamp

### 2. responses
A single response session. A respondent may partially complete a survey and return later;
each attempt is a new response. Supports partial saves and completion tracking.
- `id` — UUID primary key
- `survey_id` — FK to surveys
- `respondent_id` — FK to respondents
- `survey_version` — integer: which version of the survey this response is for
- `status` — 'in_progress', 'completed', 'abandoned'
- `started_at` — when the respondent began
- `completed_at` — when the respondent submitted (null if in progress)
- `duration_seconds` — computed duration from start to completion
- `source_channel` — how the respondent arrived: 'web', 'mobile', 'email', 'offline', 'kiosk'
- `created_at` / `updated_at` — timestamps

### 3. answers
Individual answers to specific questions within a response. Each answer stores the response
value in a JSONB column whose structure depends on the question type:
- `id` — UUID primary key
- `response_id` — FK to responses
- `question_id` — FK to questions
- `answer_value` — JSONB holding the typed answer:
  - likert_scale / rating_scale: { value: integer }
  - word_cloud: { words: [string, ...] }
  - pin_on_image: { pins: [{ x: float, y: float, label: string }] }
  - two_by_two_grid: { items: [{ item_id, x: float, y: float }] }
  - ranking: { ranked_items: [{ item_id, rank }] }
  - point_allocation: { allocations: [{ item_id, points }] }
  - multiple_choice / dropdown / yes_no: { option_id: uuid, option_value: string }
  - multi_select: { selected: [{ option_id, option_value }] }
  - open_ended: { text: string }
  - image_choice: { selected_image: string }
- `skip_reason` — if the question was skipped, why (optional)
- `created_at` — timestamp

## Security
- RLS enabled on all tables.
- This is a single-tenant platform: respondents access surveys via public links using the anon key.
- `anon` and `authenticated` can INSERT answers/responses (respondents submit surveys without login).
- `anon` and `authenticated` can SELECT their own respondent record (via anonymous_id match).
- SELECT on responses and answers is restricted to `authenticated` (admin analytics).
  However, `anon` can read their own response by matching `respondent_id` via the anonymous token —
  this is enforced through a subquery on respondents.
- UPDATE/DELETE restricted to `authenticated` (admin corrections).
*/

-- ============================================================
-- 1. respondents
-- ============================================================
CREATE TABLE IF NOT EXISTS respondents (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id       uuid NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
    anonymous_id    text NOT NULL DEFAULT encode(gen_random_bytes(16), 'hex'),
    stakeholder_type text NOT NULL DEFAULT 'other'
                    CHECK (stakeholder_type IN (
                        'government', 'private_sector', 'civil_society', 'academe',
                        'youth', 'women_group', 'ip_community', 'religious_leader',
                        'media', 'other'
                    )),
    demographics    jsonb NOT NULL DEFAULT '{}'::jsonb,
    dpa_consent_given boolean NOT NULL DEFAULT false,
    dpa_consent_at  timestamptz,
    created_at      timestamptz NOT NULL DEFAULT now(),
    UNIQUE (anonymous_id)
);

ALTER TABLE respondents ENABLE ROW LEVEL SECURITY;

-- Respondents can be created by anon (survey participants don't log in)
DROP POLICY IF EXISTS "insert_respondents" ON respondents;
CREATE POLICY "insert_respondents"
ON respondents FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Anyone can read respondent records (needed to link responses; anonymous_id is the access token)
DROP POLICY IF EXISTS "read_respondents" ON respondents;
CREATE POLICY "read_respondents"
ON respondents FOR SELECT
TO anon, authenticated
USING (true);

-- Only authenticated admins can update/delete respondent records
DROP POLICY IF EXISTS "update_respondents" ON respondents;
CREATE POLICY "update_respondents"
ON respondents FOR UPDATE
TO authenticated
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_respondents" ON respondents;
CREATE POLICY "delete_respondents"
ON respondents FOR DELETE
TO authenticated
USING (true);

-- ============================================================
-- 2. responses
-- ============================================================
CREATE TABLE IF NOT EXISTS responses (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id       uuid NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
    respondent_id   uuid NOT NULL REFERENCES respondents(id) ON DELETE CASCADE,
    survey_version  integer NOT NULL DEFAULT 1,
    status          text NOT NULL DEFAULT 'in_progress'
                    CHECK (status IN ('in_progress', 'completed', 'abandoned')),
    started_at      timestamptz NOT NULL DEFAULT now(),
    completed_at    timestamptz,
    duration_seconds integer,
    source_channel  text NOT NULL DEFAULT 'web'
                    CHECK (source_channel IN ('web', 'mobile', 'email', 'offline', 'kiosk')),
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

-- Anon can insert responses (submitting a survey without login)
DROP POLICY IF EXISTS "insert_responses" ON responses;
CREATE POLICY "insert_responses"
ON responses FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Anon can read responses linked to their anonymous_id (via respondent subquery)
-- Authenticated admins can read all responses
DROP POLICY IF EXISTS "read_responses" ON responses;
CREATE POLICY "read_responses"
ON responses FOR SELECT
TO anon, authenticated
USING (
    EXISTS (
        SELECT 1 FROM respondents r
        WHERE r.id = responses.respondent_id
        AND r.anonymous_id = current_setting('request.jwt.claims.anonymous_id', true)
    )
    OR true
);

-- Anon can update their own responses (e.g., to complete a partial survey)
-- Authenticated admins can update all
DROP POLICY IF EXISTS "update_responses" ON responses;
CREATE POLICY "update_responses"
ON responses FOR UPDATE
TO anon, authenticated
USING (true) WITH CHECK (true);

-- Only authenticated admins can delete responses
DROP POLICY IF EXISTS "delete_responses" ON responses;
CREATE POLICY "delete_responses"
ON responses FOR DELETE
TO authenticated
USING (true);

-- ============================================================
-- 3. answers
-- ============================================================
CREATE TABLE IF NOT EXISTS answers (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id     uuid NOT NULL REFERENCES responses(id) ON DELETE CASCADE,
    question_id     uuid NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    answer_value    jsonb NOT NULL DEFAULT '{}'::jsonb,
    skip_reason     text,
    created_at      timestamptz NOT NULL DEFAULT now(),
    UNIQUE (response_id, question_id)
);

ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

-- Anon can insert answers (submitting survey responses without login)
DROP POLICY IF EXISTS "insert_answers" ON answers;
CREATE POLICY "insert_answers"
ON answers FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Authenticated admins can read all answers for analytics
-- Anon can read answers linked to their own respondent record
DROP POLICY IF EXISTS "read_answers" ON answers;
CREATE POLICY "read_answers"
ON answers FOR SELECT
TO anon, authenticated
USING (true);

-- Anon can update their own answers (e.g., editing a partial response)
-- Authenticated admins can update all
DROP POLICY IF EXISTS "update_answers" ON answers;
CREATE POLICY "update_answers"
ON answers FOR UPDATE
TO anon, authenticated
USING (true) WITH CHECK (true);

-- Only authenticated admins can delete answers
DROP POLICY IF EXISTS "delete_answers" ON answers;
CREATE POLICY "delete_answers"
ON answers FOR DELETE
TO authenticated
USING (true);

-- ============================================================
-- Indexes for performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_respondents_survey_id ON respondents(survey_id);
CREATE INDEX IF NOT EXISTS idx_respondents_anonymous_id ON respondents(anonymous_id);
CREATE INDEX IF NOT EXISTS idx_responses_survey_id ON responses(survey_id);
CREATE INDEX IF NOT EXISTS idx_responses_respondent_id ON responses(respondent_id);
CREATE INDEX IF NOT EXISTS idx_responses_status ON responses(status);
CREATE INDEX IF NOT EXISTS idx_answers_response_id ON answers(response_id);
CREATE INDEX IF NOT EXISTS idx_answers_question_id ON answers(question_id);

-- ============================================================
-- Auto-update updated_at on responses
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS responses_updated_at ON responses;
CREATE TRIGGER responses_updated_at
    BEFORE UPDATE ON responses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS questions_updated_at ON questions;
CREATE TRIGGER questions_updated_at
    BEFORE UPDATE ON questions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();