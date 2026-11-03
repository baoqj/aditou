ALTER TABLE attempts ADD COLUMN reviewer_id TEXT;
ALTER TABLE attempts ADD COLUMN reviewer_role TEXT;
ALTER TABLE questions ADD COLUMN max_score INTEGER NOT NULL DEFAULT 2;
UPDATE attempts SET score=2 WHERE status='correct';
