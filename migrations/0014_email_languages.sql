-- Preserve the legacy fr/en column without rebuilding referenced account rows.
ALTER TABLE accounts ADD COLUMN preferred_locale TEXT NOT NULL DEFAULT 'fr' CHECK(preferred_locale IN ('fr','en','es','zh'));
UPDATE accounts SET preferred_locale=email_locale;
CREATE TABLE email_registrations_new (
 email TEXT PRIMARY KEY,account_id TEXT NOT NULL UNIQUE,name TEXT NOT NULL,role TEXT NOT NULL CHECK(role IN ('student','teacher','parent')),
 grade INTEGER NOT NULL CHECK(grade BETWEEN 1 AND 4),password_hash TEXT NOT NULL DEFAULT '',salt TEXT NOT NULL DEFAULT '',
 locale TEXT NOT NULL CHECK(locale IN ('fr','en','es','zh')),token_hash TEXT NOT NULL UNIQUE,expires_at INTEGER NOT NULL,created_at INTEGER NOT NULL
);
INSERT INTO email_registrations_new SELECT * FROM email_registrations;
DROP TABLE email_registrations;
ALTER TABLE email_registrations_new RENAME TO email_registrations;
ALTER TABLE google_oauth_states ADD COLUMN locale TEXT NOT NULL DEFAULT 'fr' CHECK(locale IN ('fr','en','es','zh'));
ALTER TABLE password_reset_tokens ADD COLUMN locale TEXT NOT NULL DEFAULT 'fr' CHECK(locale IN ('fr','en','es','zh'));
