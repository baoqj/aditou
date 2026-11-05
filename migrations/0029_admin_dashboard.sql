CREATE TABLE system_configuration (
 id INTEGER PRIMARY KEY CHECK(id=1),
 registration_open INTEGER NOT NULL DEFAULT 1 CHECK(registration_open IN (0,1)),
 tts_model TEXT,
 tts_voice TEXT,
 version INTEGER NOT NULL DEFAULT 0,
 updated_at INTEGER,
 updated_by TEXT
);
INSERT INTO system_configuration(id) VALUES(1);
CREATE TRIGGER guard_public_registration BEFORE INSERT ON accounts
WHEN NEW.self_registered=1 AND (SELECT registration_open FROM system_configuration WHERE id=1)=0
BEGIN
 SELECT RAISE(ABORT,'registration_paused');
END;

ALTER TABLE feedback_messages ADD COLUMN category TEXT NOT NULL DEFAULT 'contact' CHECK(category IN ('contact','issue'));
ALTER TABLE feedback_messages ADD COLUMN submitted_path TEXT;
ALTER TABLE feedback_messages ADD COLUMN locale TEXT;
CREATE INDEX feedback_category_time ON feedback_messages(category,created_at DESC,id);

CREATE TABLE visitor_pages (
 id TEXT PRIMARY KEY,
 visitor_key TEXT NOT NULL,
 ownership_hash TEXT NOT NULL,
 account_id TEXT REFERENCES accounts(id) ON DELETE SET NULL,
 ip TEXT NOT NULL,
 path TEXT NOT NULL,
 started_at INTEGER NOT NULL,
 started_day TEXT NOT NULL,
 started_week TEXT NOT NULL,
 duration_ms INTEGER NOT NULL DEFAULT 0 CHECK(duration_ms>=0),
 updated_at INTEGER NOT NULL
);
CREATE INDEX visitor_pages_time ON visitor_pages(started_at DESC,id DESC);
CREATE INDEX visitor_pages_day ON visitor_pages(started_day,visitor_key);
CREATE INDEX visitor_pages_week ON visitor_pages(started_week,visitor_key);
CREATE INDEX visitor_pages_rate ON visitor_pages(visitor_key,started_at);
CREATE INDEX visitor_pages_ip_rate ON visitor_pages(ip,started_at);
