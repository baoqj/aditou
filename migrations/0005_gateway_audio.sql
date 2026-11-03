ALTER TABLE audio_assets ADD COLUMN provider TEXT;
ALTER TABLE audio_assets ADD COLUMN model TEXT;
ALTER TABLE audio_assets ADD COLUMN voice TEXT;
ALTER TABLE audio_assets ADD COLUMN locale TEXT;
ALTER TABLE audio_assets ADD COLUMN checksum TEXT;
CREATE UNIQUE INDEX audio_assets_object ON audio_assets(r2_key);
CREATE TABLE tts_locks(cache_key TEXT PRIMARY KEY,expires_at INTEGER NOT NULL);
