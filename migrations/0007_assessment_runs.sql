CREATE TABLE assessment_runs(id TEXT PRIMARY KEY,learner_id TEXT NOT NULL REFERENCES learners(id),mode TEXT NOT NULL CHECK(mode IN ('exam','homework')),assignment_id TEXT REFERENCES assignments(id),title TEXT NOT NULL,question_ids TEXT NOT NULL,snapshots TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','submitted','graded')),revision INTEGER NOT NULL DEFAULT 0,last_write_id TEXT,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,submitted_at TEXT);
CREATE UNIQUE INDEX homework_one_run ON assessment_runs(learner_id,assignment_id) WHERE assignment_id IS NOT NULL;
CREATE INDEX assessment_owner ON assessment_runs(learner_id,created_at);
CREATE TABLE assessment_run_answers(run_id TEXT NOT NULL REFERENCES assessment_runs(id),question_id TEXT NOT NULL REFERENCES questions(id),answer TEXT NOT NULL,audio_source TEXT NOT NULL DEFAULT 'none',PRIMARY KEY(run_id,question_id));
ALTER TABLE attempts ADD COLUMN run_id TEXT REFERENCES assessment_runs(id);
CREATE INDEX attempt_run ON attempts(run_id);
