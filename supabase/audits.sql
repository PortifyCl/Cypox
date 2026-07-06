CREATE TABLE IF NOT EXISTS audits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  overall INTEGER NOT NULL DEFAULT 0,
  scores JSONB NOT NULL DEFAULT '{}',
  details JSONB NOT NULL DEFAULT '{}',
  prospect_id BIGINT REFERENCES prospects(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audits_url ON audits(url);
CREATE INDEX idx_audits_created_at ON audits(created_at DESC);
CREATE INDEX idx_audits_prospect_id ON audits(prospect_id);

ALTER TABLE audits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on audits"
  ON audits
  FOR ALL
  USING (true)
  WITH CHECK (true);
