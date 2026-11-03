CREATE TABLE email_registrations_new (
 email TEXT PRIMARY KEY, account_id TEXT NOT NULL UNIQUE, name TEXT NOT NULL,
 role TEXT NOT NULL CHECK(role IN ('student','teacher','parent')),
 grade INTEGER NOT NULL CHECK(grade BETWEEN 1 AND 4), password_hash TEXT NOT NULL DEFAULT '',salt TEXT NOT NULL DEFAULT '',
 locale TEXT NOT NULL CHECK(locale IN ('fr','en')),token_hash TEXT NOT NULL UNIQUE,expires_at INTEGER NOT NULL,created_at INTEGER NOT NULL
);
INSERT INTO email_registrations_new SELECT * FROM email_registrations;
DROP TABLE email_registrations;
ALTER TABLE email_registrations_new RENAME TO email_registrations;
CREATE TABLE google_oauth_states_new(state_hash TEXT PRIMARY KEY,binding_hash TEXT NOT NULL,verifier TEXT NOT NULL,next_path TEXT,role TEXT NOT NULL CHECK(role IN ('student','teacher','parent')),grade INTEGER NOT NULL,signup INTEGER NOT NULL DEFAULT 0,expires_at INTEGER NOT NULL);
INSERT INTO google_oauth_states_new SELECT * FROM google_oauth_states;
DROP TABLE google_oauth_states;
ALTER TABLE google_oauth_states_new RENAME TO google_oauth_states;
CREATE INDEX google_oauth_states_expiry ON google_oauth_states(expires_at);
ALTER TABLE accounts ADD COLUMN self_registered INTEGER NOT NULL DEFAULT 0;
ALTER TABLE questions ADD COLUMN owner_id TEXT REFERENCES accounts(id);
CREATE TABLE organizations(id TEXT PRIMARY KEY,name TEXT NOT NULL,owner_id TEXT NOT NULL UNIQUE REFERENCES accounts(id),created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
