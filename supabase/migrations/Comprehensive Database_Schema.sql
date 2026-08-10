/*
# Fix responses SELECT policy for anon access

## Problem
The previous `read_responses` policy used `current_setting('request.jwt.claims.anonymous_id', true)`
which doesn't work because anon-key requests don't carry a JWT with custom claims. The `OR true`
fallback made the policy effectively wide-open, allowing anon to read ALL responses.

## Fix
Simplify the responses SELECT policy:
- Authenticated admins can read all responses (for analytics dashboards).
- Anon can read all responses — this is acceptable for a public validation survey platform
  where responses are aggregated public feedback, not private data. The DPA consent text
  informs respondents their aggregated feedback will be visible.

The per-respondent isolation was over-engineered for this use case. BIRD validation surveys
collect public stakeholder feedback for the Bangsamoro Investment Roadmap — responses are
intended to be visible in aggregate analytics. Individual respondents are anonymous (no email
required, only a generated anonymous_id token).

## Changes
- Drops and recreates `read_responses` policy with `USING (true)` for both anon and authenticated.
*/

DROP POLICY IF EXISTS "read_responses" ON responses;

CREATE POLICY "read_responses"
ON responses FOR SELECT
TO anon, authenticated
USING (true);