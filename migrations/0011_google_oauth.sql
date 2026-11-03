CREATE TABLE google_oauth_states(state_hash TEXT PRIMARY KEY,binding_hash TEXT NOT NULL,verifier TEXT NOT NULL,next_path TEXT,role TEXT NOT NULL CHECK(role IN ('student','parent')),grade INTEGER NOT NULL,signup INTEGER NOT NULL DEFAULT 0,expires_at INTEGER NOT NULL);
CREATE INDEX google_oauth_states_expiry ON google_oauth_states(expires_at);
CREATE TABLE google_oauth_accounts(subject TEXT PRIMARY KEY,account_id TEXT NOT NULL UNIQUE REFERENCES accounts(id));
