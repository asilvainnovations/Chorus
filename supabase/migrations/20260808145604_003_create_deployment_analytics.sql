/*
# BIRD Validation Survey Platform — Deployment, Invitations & Analytics

## Overview
This migration creates the deployment and analytics layer of the BIRD validation survey
platform. It supports multi-channel survey distribution (web links, email invitations,
mobile, kiosk), tracks invitation status and response rates, and provides an analytics
store for aggregated survey results and influence scoring.

## New Tables

### 1. deployments
Records each deployment event — when a survey version was published to a specific channel
and who initiated it.
- `id` — UUID primary key
- `survey_id` — FK to surveys
- `survey_version` — which version was deployed
- `channel` — 'web', 'email', 'mobile', 'kiosk', 'offline'
- `status` — 'scheduled', 'active', 'paused', 'completed', 'failed'
- `public_url` — the shared survey link (for web/mobile channels)
- `scheduled_at` — when the deployment was scheduled to go live
- `activated_at` — when it actually went live
- `completed_at` — when the deployment period ended
- `target_count` — number of intended recipients (for email campaigns)
- `response_count` — number of responses received through this deployment (cached for dashboards)
- `config` — JSONB for channel-specific settings (email subject, kiosk location, etc.)
- `created_at` / `updated_at` — timestamps

### 2. email_invitations
Individual email invitations sent as part of an email deployment. Tracks delivery and
response status per invitee for DPA 2012 compliance and response rate analytics.
- `id` — UUID primary key
- `deployment_id` — FK to deployments
- `survey_id` — FK to surveys
- `recipient_email` — invitee email address
- `recipient_name` — optional name
- `stakeholder_type` — actor category (same enum as respondents)
- `status` — 'pending', 'sent', 'delivered', 'opened', 'responded', 'bounced', 'unsubscribed'
- `sent_at` — when the email was sent
- `opened_at` — when the email was first opened (email tracking pixel)
- `responded_at` — when the recipient submitted a response
- `anonymous_id` — links to the respondents table so the invitation can be correlated
  with the actual survey response without requiring login
- `created_at` — timestamp

### 3. survey_analytics
Aggregated analytics snapshots for each survey. Updated periodically (or on trigger) to
provide dashboard data without recomputing from raw answers on every page load.
- `id` — UUID primary key
- `survey_id` — FK to surveys (unique — one analytics row per survey)
- `total_responses` — count of completed responses
- `completion_rate` — percentage of started surveys that were completed
- `avg_duration_seconds` — average time to complete
- `stakeholder_breakdown` — JSONB: { government: N, private_sector: N, ... }
- `question_summaries` — JSONB array of per-question aggregated results:
  - likert/rating: { question_id, avg, distribution: { 1: N, 2: N, ... } }
  - word_cloud: { question_id, word_frequency: { word: count, ... } }
  - pin_on_image: { question_id, pin_count, heatmap_data: [...] }
  - ranking: { question_id, avg_ranks: [{ item_id, avg_rank }] }
  - point_allocation: { question_id, avg_allocations: [{ item_id, avg_points }] }
  - multiple_choice: { question_id, option_counts: [{ option_id, count }] }
- `influence_scores` — JSONB: per-stakeholder-group influence scores derived from responses
  (how much each group's answers align with or diverge from the overall pattern)
- `calculated_at` — when this analytics row was last computed
- `created_at` / `updated_at` — timestamps

### 4. survey_iterations
Records each iteration cycle — when survey results were analyzed and the survey was refined.
This supports the continuous improvement loop central to the BIRD survey lifecycle.
- `id` — UUID primary key
- `survey_id` — FK to surveys
- `from_version` — previous version number
- `to_version` — new version number
- `analysis_summary` — what the analysis revealed
- `changes_made` — what questions were added, removed, or modified
- `rationale` — why the changes were made (informed by analytics)
- `created_at` — timestamp

## Security
- RLS enabled on all tables.
- Deployment and analytics data is admin-only (authenticated) for reads and writes.
- Email invitations contain personal data (email addresses) and are strictly authenticated-only.
- The anon role has NO access to deployments, email invitations, analytics, or iterations —
  these are administrative functions.
*/

-- ============================================================
-- 1. deployments
-- ============================================================
CREATE TABLE IF NOT EXISTS deployments (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id       uuid NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
    survey_version  integer NOT NULL DEFAULT 1,
    channel         text NOT NULL DEFAULT 'web'
                    CHECK (channel IN ('web', 'email', 'mobile', 'kiosk', 'offline')),
    status          text NOT NULL DEFAULT 'scheduled'
                    CHECK (status IN ('scheduled', 'active', 'paused', 'completed', 'failed')),
    public_url      text,
    scheduled_at    timestamptz,
    activated_at    timestamptz,
    completed_at    timestamptz,
    target_count    integer NOT NULL DEFAULT 0,
    response_count  integer NOT NULL DEFAULT 0,
    config          jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE deployments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_deployments" ON deployments;
CREATE POLICY "read_deployments"
ON deployments FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "insert_deployments" ON deployments;
CREATE POLICY "insert_deployments"
ON deployments FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "update_deployments" ON deployments;
CREATE POLICY "update_deployments"
ON deployments FOR UPDATE
TO authenticated
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_deployments" ON deployments;
CREATE POLICY "delete_deployments"
ON deployments FOR DELETE
TO authenticated
USING (true);

-- ============================================================
-- 2. email_invitations
-- ============================================================
CREATE TABLE IF NOT EXISTS email_invitations (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    deployment_id   uuid NOT NULL REFERENCES deployments(id) ON DELETE CASCADE,
    survey_id       uuid NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
    recipient_email text NOT NULL,
    recipient_name  text,
    stakeholder_type text NOT NULL DEFAULT 'other'
                    CHECK (stakeholder_type IN (
                        'government', 'private_sector', 'civil_society', 'academe',
                        'youth', 'women_group', 'ip_community', 'religious_leader',
                        'media', 'other'
                    )),
    status          text NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'sent', 'delivered', 'opened', 'responded', 'bounced', 'unsubscribed')),
    sent_at         timestamptz,
    opened_at       timestamptz,
    responded_at    timestamptz,
    anonymous_id    text,
    created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE email_invitations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_email_invitations" ON email_invitations;
CREATE POLICY "read_email_invitations"
ON email_invitations FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "insert_email_invitations" ON email_invitations;
CREATE POLICY "insert_email_invitations"
ON email_invitations FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "update_email_invitations" ON email_invitations;
CREATE POLICY "update_email_invitations"
ON email_invitations FOR UPDATE
TO authenticated
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_email_invitations" ON email_invitations;
CREATE POLICY "delete_email_invitations"
ON email_invitations FOR DELETE
TO authenticated
USING (true);

-- ============================================================
-- 3. survey_analytics
-- ============================================================
CREATE TABLE IF NOT EXISTS survey_analytics (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id       uuid NOT NULL UNIQUE REFERENCES surveys(id) ON DELETE CASCADE,
    total_responses integer NOT NULL DEFAULT 0,
    completion_rate numeric(5,2) NOT NULL DEFAULT 0,
    avg_duration_seconds integer,
    stakeholder_breakdown jsonb NOT NULL DEFAULT '{}'::jsonb,
    question_summaries jsonb NOT NULL DEFAULT '[]'::jsonb,
    influence_scores jsonb NOT NULL DEFAULT '{}'::jsonb,
    calculated_at   timestamptz,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE survey_analytics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_survey_analytics" ON survey_analytics;
CREATE POLICY "read_survey_analytics"
ON survey_analytics FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "insert_survey_analytics" ON survey_analytics;
CREATE POLICY "insert_survey_analytics"
ON survey_analytics FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "update_survey_analytics" ON survey_analytics;
CREATE POLICY "update_survey_analytics"
ON survey_analytics FOR UPDATE
TO authenticated
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_survey_analytics" ON survey_analytics;
CREATE POLICY "delete_survey_analytics"
ON survey_analytics FOR DELETE
TO authenticated
USING (true);

-- ============================================================
-- 4. survey_iterations
-- ============================================================
CREATE TABLE IF NOT EXISTS survey_iterations (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id       uuid NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
    from_version    integer NOT NULL,
    to_version      integer NOT NULL,
    analysis_summary text,
    changes_made    text,
    rationale       text,
    created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE survey_iterations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_survey_iterations" ON survey_iterations;
CREATE POLICY "read_survey_iterations"
ON survey_iterations FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "insert_survey_iterations" ON survey_iterations;
CREATE POLICY "insert_survey_iterations"
ON survey_iterations FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "update_survey_iterations" ON survey_iterations;
CREATE POLICY "update_survey_iterations"
ON survey_iterations FOR UPDATE
TO authenticated
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_survey_iterations" ON survey_iterations;
CREATE POLICY "delete_survey_iterations"
ON survey_iterations FOR DELETE
TO authenticated
USING (true);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_deployments_survey_id ON deployments(survey_id);
CREATE INDEX IF NOT EXISTS idx_deployments_status ON deployments(status);
CREATE INDEX IF NOT EXISTS idx_deployments_channel ON deployments(channel);
CREATE INDEX IF NOT EXISTS idx_email_invitations_deployment_id ON email_invitations(deployment_id);
CREATE INDEX IF NOT EXISTS idx_email_invitations_survey_id ON email_invitations(survey_id);
CREATE INDEX IF NOT EXISTS idx_email_invitations_status ON email_invitations(status);
CREATE INDEX IF NOT EXISTS idx_email_invitations_email ON email_invitations(recipient_email);
CREATE INDEX IF NOT EXISTS idx_survey_iterations_survey_id ON survey_iterations(survey_id);

-- ============================================================
-- Triggers for updated_at
-- ============================================================
DROP TRIGGER IF EXISTS deployments_updated_at ON deployments;
CREATE TRIGGER deployments_updated_at
    BEFORE UPDATE ON deployments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS survey_analytics_updated_at ON survey_analytics;
CREATE TRIGGER survey_analytics_updated_at
    BEFORE UPDATE ON survey_analytics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();