CREATE TABLE school_profile_revisions (
  campus_id TEXT NOT NULL REFERENCES school_campuses(id),
  version INTEGER NOT NULL,
  fields TEXT NOT NULL CHECK(json_valid(fields)),
  source_url TEXT NOT NULL,
  reason TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY(campus_id,version)
);

CREATE VIEW school_campus_profiles AS
SELECT c.id,
  json_patch(c.record,COALESCE((SELECT r.fields FROM school_profile_revisions r
    WHERE r.campus_id=c.id ORDER BY r.version DESC LIMIT 1),'{}')) AS record,
  c.facts,
  CASE WHEN trim(COALESCE(json_extract(c.record,'$."主管机构编号"'),'')) <> ''
    AND trim(COALESCE(json_extract(c.record,'$."官方学校编号"'),'')) <> ''
    THEN 'school:' || json_extract(c.record,'$."主管机构编号"') || ':' || json_extract(c.record,'$."官方学校编号"')
    ELSE 'campus:' || c.id END AS school_key
FROM school_campuses c;

CREATE TABLE school_reviews (
  id TEXT PRIMARY KEY,
  school_key TEXT NOT NULL,
  campus_id TEXT NOT NULL REFERENCES school_campuses(id),
  author_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  latest_id TEXT NOT NULL,
  public_id TEXT,
  status TEXT NOT NULL CHECK(status IN ('pending','published','returned','rejected','withdrawn','hidden','deleted')),
  etag TEXT NOT NULL,
  reason TEXT,
  updated_at INTEGER NOT NULL,
  published_at INTEGER,
  UNIQUE(school_key,author_id)
);
CREATE INDEX school_reviews_public ON school_reviews(school_key,published_at DESC,id) WHERE public_id IS NOT NULL;
CREATE INDEX school_reviews_queue ON school_reviews(status,updated_at DESC,id);

CREATE TABLE school_review_versions (
  id TEXT PRIMARY KEY,
  review_id TEXT NOT NULL REFERENCES school_reviews(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
  teaching INTEGER CHECK(teaching BETWEEN 1 AND 5),
  environment INTEGER CHECK(environment BETWEEN 1 AND 5),
  support INTEGER CHECK(support BETWEEN 1 AND 5),
  communication INTEGER CHECK(communication BETWEEN 1 AND 5),
  relationship TEXT,
  experience_year TEXT,
  locale TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE INDEX school_review_versions_history ON school_review_versions(review_id,created_at DESC);
CREATE INDEX school_review_versions_rate ON school_review_versions(actor_id,created_at);

ALTER TABLE school_suggestions ADD COLUMN reviewed_by TEXT;
ALTER TABLE school_suggestions ADD COLUMN reviewed_at INTEGER;
ALTER TABLE school_suggestions ADD COLUMN review_note TEXT;
CREATE INDEX school_suggestions_queue ON school_suggestions(campus_id,status,created_at DESC);

CREATE TABLE school_score_revisions (
  id TEXT PRIMARY KEY,
  base_release TEXT NOT NULL REFERENCES school_rank_releases(id),
  series_id TEXT NOT NULL,
  year TEXT NOT NULL,
  unit_id TEXT NOT NULL,
  score INTEGER NOT NULL CHECK(score BETWEEN 0 AND 1000),
  source_url TEXT NOT NULL,
  reason TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  published_release TEXT REFERENCES school_rank_releases(id),
  FOREIGN KEY(series_id,year,unit_id) REFERENCES school_rank_scores(series_id,year,unit_id)
);
CREATE INDEX school_score_revisions_key ON school_score_revisions(series_id,year,unit_id,created_at DESC);

CREATE TABLE school_rank_score_overrides (
  release_id TEXT NOT NULL REFERENCES school_rank_releases(id),
  series_id TEXT NOT NULL,
  year TEXT NOT NULL,
  unit_id TEXT NOT NULL,
  revision_id TEXT NOT NULL REFERENCES school_score_revisions(id),
  PRIMARY KEY(release_id,series_id,year,unit_id),
  FOREIGN KEY(series_id,year,unit_id) REFERENCES school_rank_scores(series_id,year,unit_id)
);

CREATE TABLE school_review_moderation (
  id TEXT PRIMARY KEY,
  review_id TEXT NOT NULL REFERENCES school_reviews(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL,
  action TEXT NOT NULL,
  reason TEXT NOT NULL,
  version_id TEXT NOT NULL REFERENCES school_review_versions(id) ON DELETE CASCADE,
  created_at INTEGER NOT NULL
);
CREATE INDEX school_review_moderation_history ON school_review_moderation(review_id,created_at DESC);

CREATE TABLE school_rank_release_restores (
  id TEXT PRIMARY KEY,
  from_release TEXT NOT NULL REFERENCES school_rank_releases(id),
  to_release TEXT NOT NULL REFERENCES school_rank_releases(id),
  actor_id TEXT NOT NULL,
  reason TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
