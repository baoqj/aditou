ALTER TABLE attempts ADD COLUMN answers_revealed INTEGER NOT NULL DEFAULT 0;
UPDATE attempts SET answers_revealed=1 WHERE context='classroom' AND EXISTS (SELECT 1 FROM classrooms c WHERE c.id=attempts.context_id AND c.round=attempts.round AND c.phase='revealed');
