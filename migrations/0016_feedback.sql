CREATE TABLE feedback_messages (
 id TEXT PRIMARY KEY, sender TEXT NOT NULL, account_id TEXT,
 name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL, message TEXT NOT NULL,
 status TEXT NOT NULL CHECK(status IN ('pending','accepted')), provider_id TEXT, created_at INTEGER NOT NULL
);
CREATE INDEX feedback_sender_time ON feedback_messages(sender,created_at);
