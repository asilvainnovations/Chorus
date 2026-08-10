/*
# Drop all BIRD survey tables and functions

This migration removes all tables, functions, triggers, and views created by the
previous BIRD validation survey schema (migrations 001-004). This clears the database
so the Chorus Comprehensive Database Schema can be applied cleanly.

All BIRD tables are dropped with CASCADE to remove dependent objects.
*/

-- Drop BIRD tables (CASCADE removes dependent indexes, triggers, policies)
DROP TABLE IF EXISTS survey_iterations CASCADE;
DROP TABLE IF EXISTS survey_analytics CASCADE;
DROP TABLE IF EXISTS email_invitations CASCADE;
DROP TABLE IF EXISTS deployments CASCADE;
DROP TABLE IF EXISTS answers CASCADE;
DROP TABLE IF EXISTS responses CASCADE;
DROP TABLE IF EXISTS respondents CASCADE;
DROP TABLE IF EXISTS question_options CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS survey_sections CASCADE;
DROP TABLE IF EXISTS survey_versions CASCADE;
DROP TABLE IF EXISTS surveys CASCADE;

-- Drop BIRD functions and triggers
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS update_conversation_timestamp() CASCADE;

-- Drop any remaining BIRD views (just in case)
DROP VIEW IF EXISTS conversation_with_context CASCADE;
DROP VIEW IF EXISTS user_message_statistics CASCADE;