/*
# Chorus: Strategic Foresight Platform — Comprehensive Database Schema

## Overview
This migration creates the complete database schema for the Chorus strategic foresight platform,
matching the supabase/migrations/Comprehensive_Database_Schema.sql file exactly.

## Tables Created (22 total)
1. users — User accounts and authentication
2. domains — 10 interconnected global challenge domains
3. domain_frameworks — Domain-specific frameworks (UN SDGs, UNDRR Sendai, etc.)
4. domain_resources — Case studies, research, tools, initiatives per domain
5. domain_connections — Interconnections between domains
6. domain_suggested_queries — Suggested queries per domain
7. conversations — Chat conversations with domain context
8. messages — Individual messages within conversations
9. message_metadata — Streaming status, errors, etc.
10. message_sources — Source citations for messages
11. search_results — Web search results tracking
12. user_settings — User preferences and settings
13. user_model_preferences — Model access and favorites
14. user_api_keys — Encrypted API keys for BYOK
15. ai_models — Available AI models catalog
16. usage_analytics — Usage event tracking
17. daily_usage_summary — Aggregated daily analytics
18. system_config — System configuration key-value store
19. audit_log — Audit trail for sensitive operations
20. message_feedback — Message ratings and feedback
21. conversation_ratings — Conversation quality ratings
22. conversation_shares — Sharing & collaboration (future)
23. data_exports — Data export tracking

## Views Created (4)
- conversation_with_context
- user_message_statistics
- domain_popularity
- message_source_effectiveness

## Functions Created (3)
- update_conversation_timestamp() — trigger function
- track_message_usage() — trigger function
- calculate_conversation_cost(UUID) — cost calculation

## Triggers Created (2)
- trigger_update_conversation_timestamp
- trigger_track_message_usage

## Seed Data
- 10 Chorus domains inserted

## Security
- No RLS policies in original schema file. This is a multi-user schema that references
  auth.users via a custom users table. RLS is not enabled per the original file spec.
*/

-- ========================================================================
-- 1. USERS & AUTHENTICATION
-- ========================================================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(128) UNIQUE,
  full_name VARCHAR(255),
  avatar_url VARCHAR(500),
  auth_provider VARCHAR(50) NOT NULL DEFAULT 'email',
  auth_id VARCHAR(255),
  password_hash VARCHAR(255),
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_auth_provider_auth_id ON users(auth_provider, auth_id);

-- ========================================================================
-- 2. DOMAINS & FRAMEWORKS
-- ========================================================================

CREATE TABLE IF NOT EXISTS domains (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(150) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon VARCHAR(50),
  color VARCHAR(20),
  background_color VARCHAR(20),
  order_index INTEGER,
  system_prompt_addendum TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS domain_frameworks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_id VARCHAR(50) NOT NULL REFERENCES domains(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  url VARCHAR(500),
  type VARCHAR(50),
  organization VARCHAR(200),
  year_published INTEGER,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_domain_frameworks_domain_id ON domain_frameworks(domain_id);

CREATE TABLE IF NOT EXISTS domain_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_id VARCHAR(50) NOT NULL REFERENCES domains(id) ON DELETE CASCADE,
  title VARCHAR(300) NOT NULL,
  url VARCHAR(500) NOT NULL,
  type VARCHAR(50) NOT NULL,
  description TEXT,
  organization VARCHAR(200),
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_domain_resources_domain_id ON domain_resources(domain_id);
CREATE INDEX IF NOT EXISTS idx_domain_resources_type ON domain_resources(type);

CREATE TABLE IF NOT EXISTS domain_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_id_1 VARCHAR(50) NOT NULL REFERENCES domains(id) ON DELETE CASCADE,
  domain_id_2 VARCHAR(50) NOT NULL REFERENCES domains(id) ON DELETE CASCADE,
  relationship_type VARCHAR(100),
  description TEXT,
  strength INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(domain_id_1, domain_id_2),
  CHECK (domain_id_1 < domain_id_2)
);

CREATE INDEX IF NOT EXISTS idx_domain_connections_domain_id_1 ON domain_connections(domain_id_1);
CREATE INDEX IF NOT EXISTS idx_domain_connections_domain_id_2 ON domain_connections(domain_id_2);

CREATE TABLE IF NOT EXISTS domain_suggested_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_id VARCHAR(50) NOT NULL REFERENCES domains(id) ON DELETE CASCADE,
  query_text TEXT NOT NULL,
  category VARCHAR(100),
  order_index INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_domain_suggested_queries_domain_id ON domain_suggested_queries(domain_id);

-- ========================================================================
-- 3. CONVERSATIONS & MESSAGES
-- ========================================================================

CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(300),
  active_domain_id VARCHAR(50) REFERENCES domains(id) ON DELETE SET NULL,
  mode VARCHAR(50) DEFAULT 'chat',
  model_id VARCHAR(100),
  search_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_message_at TIMESTAMP WITH TIME ZONE,
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_active_domain_id ON conversations(active_domain_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at);
CREATE INDEX IF NOT EXISTS idx_conversations_user_id_created_at ON conversations(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  role VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  content_type VARCHAR(50) DEFAULT 'text',
  model_id VARCHAR(100),
  domain_id VARCHAR(50) REFERENCES domains(id) ON DELETE SET NULL,
  search_query VARCHAR(500),
  search_performed BOOLEAN DEFAULT FALSE,
  tokens_used INTEGER,
  latency_ms INTEGER,
  is_edited BOOLEAN DEFAULT FALSE,
  edited_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_role ON messages(role);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_domain_id ON messages(domain_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id_created_at ON messages(conversation_id, created_at);

CREATE TABLE IF NOT EXISTS message_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL UNIQUE REFERENCES messages(id) ON DELETE CASCADE,
  is_streaming BOOLEAN DEFAULT FALSE,
  stream_status VARCHAR(50),
  error_message TEXT,
  error_code VARCHAR(50),
  retry_count INTEGER DEFAULT 0,
  api_request_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ========================================================================
-- 4. SOURCES & CITATIONS
-- ========================================================================

CREATE TABLE IF NOT EXISTS message_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  source_url VARCHAR(500) NOT NULL,
  source_title VARCHAR(300),
  source_domain VARCHAR(150),
  snippet TEXT,
  position_in_message INTEGER,
  relevance_score NUMERIC(3,2),
  source_type VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_message_sources_message_id ON message_sources(message_id);
CREATE INDEX IF NOT EXISTS idx_message_sources_source_url ON message_sources(source_url);

CREATE TABLE IF NOT EXISTS search_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  query VARCHAR(500) NOT NULL,
  result_url VARCHAR(500),
  result_title VARCHAR(300),
  result_snippet TEXT,
  result_domain VARCHAR(150),
  position INTEGER,
  search_provider VARCHAR(50) DEFAULT 'tavily',
  relevance_score NUMERIC(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_search_results_message_id ON search_results(message_id);
CREATE INDEX IF NOT EXISTS idx_search_results_query ON search_results(query);
CREATE INDEX IF NOT EXISTS idx_search_results_created_at ON search_results(created_at);

-- ========================================================================
-- 5. USER PREFERENCES & SETTINGS
-- ========================================================================

CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  theme VARCHAR(50) DEFAULT 'auto',
  default_model_id VARCHAR(100),
  search_enabled BOOLEAN DEFAULT TRUE,
  auto_cite_sources BOOLEAN DEFAULT TRUE,
  show_domain_suggestions BOOLEAN DEFAULT TRUE,
  language VARCHAR(10) DEFAULT 'en',
  notifications_enabled BOOLEAN DEFAULT TRUE,
  beta_features_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_model_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  model_id VARCHAR(100) NOT NULL,
  is_favorite BOOLEAN DEFAULT FALSE,
  use_frequency INTEGER DEFAULT 0,
  last_used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, model_id)
);

CREATE INDEX IF NOT EXISTS idx_user_model_preferences_user_id ON user_model_preferences(user_id);

CREATE TABLE IF NOT EXISTS user_api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL,
  key_name VARCHAR(100),
  key_encrypted VARCHAR(500) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  last_used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, provider)
);

-- ========================================================================
-- 6. AVAILABLE AI MODELS
-- ========================================================================

CREATE TABLE IF NOT EXISTS ai_models (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  provider VARCHAR(50) NOT NULL,
  version VARCHAR(50),
  description TEXT,
  max_tokens INTEGER,
  input_cost_per_1k NUMERIC(10,6),
  output_cost_per_1k NUMERIC(10,6),
  is_available BOOLEAN DEFAULT TRUE,
  capabilities TEXT[],
  supported_modalities TEXT[],
  context_window INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ========================================================================
-- 7. ANALYTICS & USAGE TRACKING
-- ========================================================================

CREATE TABLE IF NOT EXISTS usage_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,
  message_id UUID REFERENCES messages(id) ON DELETE SET NULL,
  event_type VARCHAR(50) NOT NULL,
  domain_id VARCHAR(50) REFERENCES domains(id) ON DELETE SET NULL,
  model_id VARCHAR(100),
  tokens_used INTEGER,
  latency_ms INTEGER,
  cost NUMERIC(10,6),
  session_id VARCHAR(255),
  ip_address INET,
  user_agent VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_usage_analytics_user_id ON usage_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_analytics_created_at ON usage_analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_usage_analytics_event_type ON usage_analytics(event_type);

CREATE TABLE IF NOT EXISTS daily_usage_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  total_conversations INTEGER DEFAULT 0,
  total_messages INTEGER DEFAULT 0,
  total_tokens_used INTEGER DEFAULT 0,
  total_cost NUMERIC(12,6) DEFAULT 0,
  unique_domains_accessed INTEGER DEFAULT 0,
  avg_latency_ms INTEGER,
  search_queries_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(date, user_id)
);

CREATE INDEX IF NOT EXISTS idx_daily_usage_summary_date ON daily_usage_summary(date);
CREATE INDEX IF NOT EXISTS idx_daily_usage_summary_user_id ON daily_usage_summary(user_id);

-- ========================================================================
-- 8. SYSTEM & CONFIGURATION
-- ========================================================================

CREATE TABLE IF NOT EXISTS system_config (
  id VARCHAR(100) PRIMARY KEY,
  value_json JSONB,
  value_text TEXT,
  value_number NUMERIC,
  value_boolean BOOLEAN,
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id VARCHAR(255),
  changes_before JSONB,
  changes_after JSONB,
  ip_address INET,
  user_agent VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_log_resource_type ON audit_log(resource_type);

-- ========================================================================
-- 9. FEEDBACK & RATINGS
-- ========================================================================

CREATE TABLE IF NOT EXISTS message_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER,
  feedback_text TEXT,
  is_helpful BOOLEAN,
  is_accurate BOOLEAN,
  is_grounded BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(message_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_message_feedback_message_id ON message_feedback(message_id);
CREATE INDEX IF NOT EXISTS idx_message_feedback_user_id ON message_feedback(user_id);

CREATE TABLE IF NOT EXISTS conversation_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  overall_rating INTEGER,
  relevance_rating INTEGER,
  clarity_rating INTEGER,
  usefulness_rating INTEGER,
  source_quality_rating INTEGER,
  comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(conversation_id, user_id)
);

-- ========================================================================
-- 10. SHARING & COLLABORATION (Future Feature)
-- ========================================================================

CREATE TABLE IF NOT EXISTS conversation_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  owner_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  shared_with_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  share_token VARCHAR(255) UNIQUE,
  is_public BOOLEAN DEFAULT FALSE,
  access_level VARCHAR(50) DEFAULT 'view',
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_conversation_shares_conversation_id ON conversation_shares(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversation_shares_owner_user_id ON conversation_shares(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_shares_share_token ON conversation_shares(share_token);

-- ========================================================================
-- 11. DATA MIGRATION & BACKUP
-- ========================================================================

CREATE TABLE IF NOT EXISTS data_exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  export_type VARCHAR(50) NOT NULL,
  file_url VARCHAR(500),
  file_size_bytes INTEGER,
  format VARCHAR(20),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE
);

-- ========================================================================
-- 12. VIEWS FOR COMMON QUERIES
-- ========================================================================

CREATE OR REPLACE VIEW conversation_with_context AS
SELECT
  c.id,
  c.user_id,
  c.title,
  c.active_domain_id,
  d.name AS domain_name,
  c.mode,
  c.model_id,
  c.search_enabled,
  COUNT(m.id) AS message_count,
  MAX(m.created_at) AS last_message_at,
  c.created_at
FROM conversations c
LEFT JOIN domains d ON c.active_domain_id = d.id
LEFT JOIN messages m ON c.id = m.conversation_id
WHERE c.deleted_at IS NULL
GROUP BY c.id, d.id;

CREATE OR REPLACE VIEW user_message_statistics AS
SELECT
  u.id AS user_id,
  u.email,
  COUNT(DISTINCT c.id) AS total_conversations,
  COUNT(DISTINCT m.id) AS total_messages,
  COUNT(DISTINCT CASE WHEN m.role = 'user' THEN m.id END) AS user_messages,
  COUNT(DISTINCT CASE WHEN m.role = 'assistant' THEN m.id END) AS assistant_messages,
  MAX(m.created_at) AS last_activity,
  COUNT(DISTINCT m.domain_id) AS unique_domains_explored
FROM users u
LEFT JOIN conversations c ON u.id = c.user_id AND c.deleted_at IS NULL
LEFT JOIN messages m ON c.id = m.conversation_id
GROUP BY u.id;

CREATE OR REPLACE VIEW domain_popularity AS
SELECT
  d.id,
  d.name,
  COUNT(DISTINCT c.id) AS conversation_count,
  COUNT(DISTINCT m.id) AS message_count,
  COUNT(DISTINCT c.user_id) AS unique_users,
  AVG(EXTRACT(EPOCH FROM (m.updated_at - m.created_at))) AS avg_response_time_seconds
FROM domains d
LEFT JOIN conversations c ON d.id = c.active_domain_id AND c.deleted_at IS NULL
LEFT JOIN messages m ON c.id = m.conversation_id AND m.domain_id = d.id
GROUP BY d.id
ORDER BY conversation_count DESC;

CREATE OR REPLACE VIEW message_source_effectiveness AS
SELECT
  s.source_domain,
  COUNT(DISTINCT s.message_id) AS citations_count,
  AVG(s.relevance_score) AS avg_relevance,
  COUNT(DISTINCT sf.user_id) AS users_who_rated,
  AVG(CASE WHEN sf.is_accurate THEN 1 ELSE 0 END) AS accuracy_rate
FROM message_sources s
LEFT JOIN message_feedback sf ON s.message_id = sf.message_id
GROUP BY s.source_domain
ORDER BY citations_count DESC;

-- ========================================================================
-- 13. INDEXES FOR PERFORMANCE
-- ========================================================================

CREATE INDEX IF NOT EXISTS idx_messages_conversation_domain_created ON messages(
  conversation_id, domain_id, created_at DESC
);

CREATE INDEX IF NOT EXISTS idx_conversations_user_domain_active ON conversations(
  user_id, active_domain_id, deleted_at
);

CREATE INDEX IF NOT EXISTS idx_usage_analytics_user_date ON usage_analytics(
  user_id, created_at DESC
);

CREATE INDEX IF NOT EXISTS idx_message_content_fts ON messages USING GIN (
  to_tsvector('english', content)
);

CREATE INDEX IF NOT EXISTS idx_conversation_title_fts ON conversations USING GIN (
  to_tsvector('english', COALESCE(title, ''))
);

-- ========================================================================
-- 14. FUNCTIONS FOR COMMON OPERATIONS
-- ========================================================================

CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET updated_at = CURRENT_TIMESTAMP,
      last_message_at = CURRENT_TIMESTAMP
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_conversation_timestamp ON messages;
CREATE TRIGGER trigger_update_conversation_timestamp
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION update_conversation_timestamp();

CREATE OR REPLACE FUNCTION track_message_usage()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role = 'assistant' THEN
    INSERT INTO usage_analytics (
      conversation_id, message_id, event_type, domain_id,
      model_id, tokens_used
    ) VALUES (
      NEW.conversation_id, NEW.id, 'message_created',
      NEW.domain_id, NEW.model_id, NEW.tokens_used
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_track_message_usage ON messages;
CREATE TRIGGER trigger_track_message_usage
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION track_message_usage();

CREATE OR REPLACE FUNCTION calculate_conversation_cost(
  p_conversation_id UUID
) RETURNS NUMERIC AS $$
DECLARE
  v_total_cost NUMERIC := 0;
BEGIN
  SELECT COALESCE(SUM(
    COALESCE(m.tokens_used, 0) * (
      CASE
        WHEN m.role = 'user' THEN 0
        ELSE COALESCE(am.output_cost_per_1k, 0) / 1000
      END
    )
  ), 0)
  INTO v_total_cost
  FROM messages m
  LEFT JOIN ai_models am ON m.model_id = am.id
  WHERE m.conversation_id = p_conversation_id;

  RETURN v_total_cost;
END;
$$ LANGUAGE plpgsql;

-- ========================================================================
-- 15. SAMPLE DATA SEEDS
-- ========================================================================

INSERT INTO domains (id, name, description, icon, color, background_color, order_index) VALUES
('sustainable-development', 'Sustainable Development', 'UN SDGs and Paris Agreement frameworks for global development', '🌍', '#0069a8', '#e8f4f8', 1),
('green-economy', 'Green Economy', 'Clean growth, sustainable transitions, and economic transformation', '💚', '#0f7d51', '#e8f8f3', 2),
('circular-economy', 'Circular Economy', 'Resource efficiency, regenerative design, and closed-loop systems', '♻️', '#8a6d00', '#fef9e8', 3),
('resilience', 'Resilience', 'Adaptive capacity, system strength, and recovery from shocks', '🛡️', '#c62828', '#ffe8e8', 4),
('disaster-risk-reduction', 'Disaster Risk Reduction', 'UNDRR Sendai Framework and hazard risk management', '⚠️', '#407d52', '#e8f5e9', 5),
('systems-thinking', 'Systems Thinking', 'Causal loops, leverage points, and systemic change', '🔗', '#5b34c9', '#f3e8ff', 6),
('inclusivity', 'Inclusivity & Social Equity', 'Leave No One Behind, social justice, and equity frameworks', '🤝', '#00579c', '#e3f2fd', 7),
('well-being', 'Well-Being', 'Human and planetary health, MHPSS, and quality of life', '💙', '#0d7c6f', '#e0f5f4', 8),
('real-time-leadership', 'Real-Time Leadership', 'Adaptive leadership, scenario planning, and agile strategy', '👥', '#5d4e37', '#f5f1e8', 9),
('innovation', 'Innovations in Global Challenges', 'Solutions, technologies, and breakthrough approaches', '💡', '#f57f17', '#fff3e0', 10)
ON CONFLICT (id) DO NOTHING;

-- ========================================================================
-- END OF SCHEMA
-- ========================================================================