ALTER TABLE accounts ADD COLUMN email_verified_at TEXT;
ALTER TABLE accounts ADD COLUMN email_locale TEXT NOT NULL DEFAULT 'fr' CHECK(email_locale IN ('fr','en'));
UPDATE accounts SET email_verified_at=CURRENT_TIMESTAMP WHERE id IN (SELECT account_id FROM google_oauth_accounts);
CREATE TABLE email_registrations (
 email TEXT PRIMARY KEY, account_id TEXT NOT NULL UNIQUE, name TEXT NOT NULL, role TEXT NOT NULL CHECK(role IN ('student','parent')),
 grade INTEGER NOT NULL CHECK(grade BETWEEN 1 AND 4), password_hash TEXT NOT NULL, salt TEXT NOT NULL,
 locale TEXT NOT NULL CHECK(locale IN ('fr','en')), token_hash TEXT NOT NULL UNIQUE, expires_at INTEGER NOT NULL, created_at INTEGER NOT NULL
);
CREATE TABLE password_reset_tokens(token_hash TEXT PRIMARY KEY,account_id TEXT NOT NULL REFERENCES accounts(id),expires_at INTEGER NOT NULL);
CREATE INDEX password_reset_expiry ON password_reset_tokens(expires_at);
CREATE TABLE email_deliveries (
 id TEXT PRIMARY KEY,account_id TEXT,recipient TEXT NOT NULL,template TEXT NOT NULL,locale TEXT NOT NULL,
 subject TEXT NOT NULL,idempotency_key TEXT NOT NULL UNIQUE,status TEXT NOT NULL CHECK(status IN ('sending','accepted','failed')),
 resend_id TEXT,error_code TEXT,created_at INTEGER NOT NULL,updated_at INTEGER NOT NULL
);
CREATE TABLE email_token_claims(token_hash TEXT PRIMARY KEY);
