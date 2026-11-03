CREATE TABLE question_tts_settings (
  question_id TEXT PRIMARY KEY REFERENCES questions(id),
  model TEXT NOT NULL,
  voice TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
