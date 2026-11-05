CREATE TABLE school_suggestions (
  id TEXT PRIMARY KEY,
  campus_id TEXT NOT NULL REFERENCES school_campuses(id),
  sender TEXT NOT NULL,
  account_id TEXT REFERENCES accounts(id) ON DELETE SET NULL,
  username TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  source_url TEXT NOT NULL,
  locale TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','reviewed')),
  created_at INTEGER NOT NULL,
  confirmation_id TEXT,
  notification_id TEXT
);
CREATE INDEX school_suggestions_sender ON school_suggestions(sender,created_at);
CREATE INDEX school_suggestions_email ON school_suggestions(email,created_at);
