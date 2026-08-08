/*
# BIRD Validation Survey Platform — Core Survey Structure

## Overview
This migration creates the foundational schema for the Bangsamoro Investment Roadmap (BIRD)
validation survey platform. It establishes the survey architecture that supports interactive
question types (scales, word clouds, pin-on-image, 2x2 grids, ranking, 100-point allocation),
multi-version surveys, and organized sections.

## New Tables

### 1. surveys
The top-level survey entity. Each survey represents a validation instrument for a specific
BIRD roadmap component (e.g., infrastructure, agriculture, tourism investment priorities).
- `id` — UUID primary key
- `title` — survey display title
- `description` — purpose and context of the survey
- `roadmap_component` — which part of the BIRD roadmap this validates (e.g., 'infrastructure', 'agriculture')
- `status` — lifecycle status: draft, active, paused, archived, completed
- `version` — integer version number for iteration tracking (starts at 1)
- `language` — primary language code (default 'en')
- `estimated_minutes` — estimated completion time shown to respondents
- `dpa_consent_text` — Data Privacy Act 2012 consent statement shown to respondents
- `dpa_data_purpose` — stated purpose for data collection per DPA 2012
- `created_at` / `updated_at` — timestamps

### 2. survey_versions
Tracks each iteration of a survey. When a survey is refined based on analysis, a new version
row is created so prior versions remain auditable and comparable.
- `id` — UUID primary key
- `survey_id` — FK to surveys
- `version` — integer version number
- `change_summary` — what changed from the previous version
- `created_at` — when this version was published

### 3. survey_sections
Groups related questions within a survey (e.g., "Demographics", "Investment Priorities", "Feedback").
- `id` — UUID primary key
- `survey_id` — FK to surveys
- `title` — section heading
- `description` — instructions or context for the section
- `display_order` — ordering within the survey
- `created_at` — timestamp

### 4. questions
Individual questions within a section. Supports all BIRD interactive question types.
- `id` — UUID primary key
- `section_id` — FK to survey_sections
- `survey_id` — FK to surveys (denormalized for easier querying)
- `question_text` — the question prompt
- `question_type` — one of: 'likert_scale', 'rating_scale', 'word_cloud', 'pin_on_image',
  'two_by_two_grid', 'ranking', 'point_allocation', 'multiple_choice', 'open_ended',
  'yes_no', 'dropdown', 'multi_select', 'image_choice'
- `required` — whether the respondent must answer
- `display_order` — ordering within the section
- `config` — JSONB column holding type-specific configuration:
  - likert_scale: { scale_min, scale_max, scale_labels: [] }
  - rating_scale: { max_rating, icon: 'star'|'dot' }
  - word_cloud: { max_words, min_words, prompt }
  - pin_on_image: { image_url, max_pins, pin_colors: [] }
  - two_by_two_grid: { x_axis_label, y_axis_label, x_low_label, x_high_label, y_low_label, y_high_label }
  - ranking: { max_items, min_items }
  - point_allocation: { total_points, max_per_item }
  - multiple_choice: { allow_other: boolean }
  - image_choice: { images: [{ url, label }] }
- `created_at` / `updated_at` — timestamps

### 5. question_options
Predefined choices for multiple_choice, dropdown, ranking, point_allocation, and similar types.
- `id` — UUID primary key
- `question_id` — FK to questions
- `option_text` — display label for the option
- `option_value` — stored value (may differ from display)
- `display_order` — ordering of options
- `metadata` — JSONB for extra context (e.g., image URL for image_choice options)
- `created_at` — timestamp

## Security
- RLS enabled on all tables.
- This is a single-tenant platform (survey links are shared publicly; respondents don't sign in).
- Policies allow both `anon` and `authenticated` roles to read survey structure (questions, sections, options)
  so the frontend can render the survey via the anon key.
- Write operations (creating/editing surveys) are restricted to `authenticated` users (platform administrators).
*/

-- ============================================================
-- 1. surveys
-- ============================================================
CREATE TABLE IF NOT EXISTS surveys (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title           text NOT NULL,
    description     text,
    roadmap_component text NOT NULL DEFAULT 'general',
    status          text NOT NULL DEFAULT 'draft'
                    CHECK (status IN ('draft', 'active', 'paused', 'archived', 'completed')),
    version         integer NOT NULL DEFAULT 1,
    language        text NOT NULL DEFAULT 'en',
    estimated_minutes integer NOT NULL DEFAULT 10,
    dpa_consent_text text,
    dpa_data_purpose text,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_surveys" ON surveys;
CREATE POLICY "read_surveys"
ON surveys FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "insert_surveys" ON surveys;
CREATE POLICY "insert_surveys"
ON surveys FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "update_surveys" ON surveys;
CREATE POLICY "update_surveys"
ON surveys FOR UPDATE
TO authenticated
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_surveys" ON surveys;
CREATE POLICY "delete_surveys"
ON surveys FOR DELETE
TO authenticated
USING (true);

-- ============================================================
-- 2. survey_versions
-- ============================================================
CREATE TABLE IF NOT EXISTS survey_versions (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id       uuid NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
    version         integer NOT NULL,
    change_summary  text,
    created_at      timestamptz NOT NULL DEFAULT now(),
    UNIQUE (survey_id, version)
);

ALTER TABLE survey_versions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_survey_versions" ON survey_versions;
CREATE POLICY "read_survey_versions"
ON survey_versions FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "insert_survey_versions" ON survey_versions;
CREATE POLICY "insert_survey_versions"
ON survey_versions FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "update_survey_versions" ON survey_versions;
CREATE POLICY "update_survey_versions"
ON survey_versions FOR UPDATE
TO authenticated
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_survey_versions" ON survey_versions;
CREATE POLICY "delete_survey_versions"
ON survey_versions FOR DELETE
TO authenticated
USING (true);

-- ============================================================
-- 3. survey_sections
-- ============================================================
CREATE TABLE IF NOT EXISTS survey_sections (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id       uuid NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
    title           text NOT NULL,
    description     text,
    display_order   integer NOT NULL DEFAULT 0,
    created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE survey_sections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_survey_sections" ON survey_sections;
CREATE POLICY "read_survey_sections"
ON survey_sections FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "insert_survey_sections" ON survey_sections;
CREATE POLICY "insert_survey_sections"
ON survey_sections FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "update_survey_sections" ON survey_sections;
CREATE POLICY "update_survey_sections"
ON survey_sections FOR UPDATE
TO authenticated
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_survey_sections" ON survey_sections;
CREATE POLICY "delete_survey_sections"
ON survey_sections FOR DELETE
TO authenticated
USING (true);

-- ============================================================
-- 4. questions
-- ============================================================
CREATE TABLE IF NOT EXISTS questions (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id      uuid NOT NULL REFERENCES survey_sections(id) ON DELETE CASCADE,
    survey_id       uuid NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
    question_text   text NOT NULL,
    question_type   text NOT NULL
                    CHECK (question_type IN (
                        'likert_scale', 'rating_scale', 'word_cloud', 'pin_on_image',
                        'two_by_two_grid', 'ranking', 'point_allocation', 'multiple_choice',
                        'open_ended', 'yes_no', 'dropdown', 'multi_select', 'image_choice'
                    )),
    required        boolean NOT NULL DEFAULT false,
    display_order   integer NOT NULL DEFAULT 0,
    config          jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_questions" ON questions;
CREATE POLICY "read_questions"
ON questions FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "insert_questions" ON questions;
CREATE POLICY "insert_questions"
ON questions FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "update_questions" ON questions;
CREATE POLICY "update_questions"
ON questions FOR UPDATE
TO authenticated
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_questions" ON questions;
CREATE POLICY "delete_questions"
ON questions FOR DELETE
TO authenticated
USING (true);

-- ============================================================
-- 5. question_options
-- ============================================================
CREATE TABLE IF NOT EXISTS question_options (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id     uuid NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    option_text     text NOT NULL,
    option_value    text,
    display_order   integer NOT NULL DEFAULT 0,
    metadata        jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE question_options ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_question_options" ON question_options;
CREATE POLICY "read_question_options"
ON question_options FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "insert_question_options" ON question_options;
CREATE POLICY "insert_question_options"
ON question_options FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "update_question_options" ON question_options;
CREATE POLICY "update_question_options"
ON question_options FOR UPDATE
TO authenticated
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_question_options" ON question_options;
CREATE POLICY "delete_question_options"
ON question_options FOR DELETE
TO authenticated
USING (true);

-- ============================================================
-- Indexes for performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_survey_versions_survey_id ON survey_versions(survey_id);
CREATE INDEX IF NOT EXISTS idx_survey_sections_survey_id ON survey_sections(survey_id);
CREATE INDEX IF NOT EXISTS idx_questions_section_id ON questions(section_id);
CREATE INDEX IF NOT EXISTS idx_questions_survey_id ON questions(survey_id);
CREATE INDEX IF NOT EXISTS idx_question_options_question_id ON question_options(question_id);
CREATE INDEX IF NOT EXISTS idx_surveys_status ON surveys(status);