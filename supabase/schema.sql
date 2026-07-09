-- RADSEA Database Schema for Supabase
-- Paste this into Supabase SQL Editor and run

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Prospects table
CREATE TABLE IF NOT EXISTS prospects (
  id BIGSERIAL PRIMARY KEY,
  nom TEXT NOT NULL,
  secteur TEXT NOT NULL,
  ville TEXT NOT NULL,
  telephone TEXT,
  email TEXT,
  site_web TEXT,
  fiche_google BOOLEAN DEFAULT false,
  score INT DEFAULT 0,
  statut TEXT DEFAULT 'Nouveau',
  date_decouverte TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Agents table
CREATE TABLE IF NOT EXISTS agents (
  id TEXT PRIMARY KEY,
  nom TEXT NOT NULL,
  role TEXT NOT NULL,
  statut TEXT DEFAULT 'Actif',
  traite INT DEFAULT 0,
  erreurs INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Audits table
CREATE TABLE IF NOT EXISTS audits (
  id BIGSERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  overall INT NOT NULL,
  scores JSONB DEFAULT '{}'::jsonb,
  details JSONB DEFAULT '{}'::jsonb,
  prospect_id BIGINT REFERENCES prospects(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_prospects_statut ON prospects(statut);
CREATE INDEX IF NOT EXISTS idx_prospects_secteur ON prospects(secteur);
CREATE INDEX IF NOT EXISTS idx_prospects_ville ON prospects(ville);
CREATE INDEX IF NOT EXISTS idx_prospects_score ON prospects(score DESC);
CREATE INDEX IF NOT EXISTS idx_audits_url ON audits(url);
CREATE INDEX IF NOT EXISTS idx_audits_prospect ON audits(prospect_id);

-- RLS policies — service_role only (RADSEA access via /api/radsea/* endpoints)
ALTER TABLE prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON prospects
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access" ON agents
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access" ON audits
  FOR ALL USING (auth.role() = 'service_role');

-- Seed agents
INSERT INTO agents (id, nom, role, statut, traite, erreurs) VALUES
  ('radar', 'Radar', 'Détecte les entreprises', 'Actif', 156, 3),
  ('collect', 'Collect', 'Rassemble les informations', 'Actif', 142, 5),
  ('analyzer', 'Analyzer', 'Évalue la présence numérique', 'Actif', 128, 4),
  ('opportunity', 'Opportunity', 'Calcule le potentiel commercial', 'Actif', 119, 2),
  ('writer', 'Writer', 'Prépare l''audit et le message', 'En veille', 67, 3),
  ('designer', 'Designer', 'Génère une proposition visuelle', 'En veille', 35, 1),
  ('crm', 'CRM', 'Assure le suivi des prospects', 'Actif', 94, 2),
  ('analytics', 'Analytics', 'Mesure les performances', 'Actif', 108, 1)
ON CONFLICT (id) DO UPDATE SET
  nom = EXCLUDED.nom,
  role = EXCLUDED.role,
  statut = EXCLUDED.statut;
