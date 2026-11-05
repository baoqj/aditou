CREATE TABLE school_campus_supplements (
  campus_id TEXT PRIMARY KEY REFERENCES school_campuses(id),
  data TEXT NOT NULL CHECK(json_valid(data)),
  remote INTEGER NOT NULL DEFAULT 0 CHECK(remote IN (0, 1))
);

CREATE TABLE school_rank_sources (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  source_hash TEXT NOT NULL
);

CREATE TABLE school_rank_units (
  id TEXT PRIMARY KEY,
  scope TEXT NOT NULL CHECK(scope IN ('school','campus'))
);

CREATE TABLE school_rank_unit_campuses (
  unit_id TEXT NOT NULL REFERENCES school_rank_units(id),
  campus_id TEXT NOT NULL REFERENCES school_campuses(id),
  PRIMARY KEY (unit_id,campus_id)
);
CREATE INDEX school_rank_campus ON school_rank_unit_campuses(campus_id,unit_id);

CREATE TABLE school_rank_series (
  id TEXT PRIMARY KEY,
  level TEXT NOT NULL CHECK(level IN ('primary','secondary')),
  grade INTEGER NOT NULL,
  code TEXT NOT NULL,
  label TEXT NOT NULL,
  sector TEXT NOT NULL,
  network TEXT NOT NULL,
  exam_language TEXT NOT NULL,
  metric TEXT NOT NULL,
  source_id TEXT NOT NULL REFERENCES school_rank_sources(id)
);

CREATE TABLE school_rank_scores (
  series_id TEXT NOT NULL REFERENCES school_rank_series(id),
  year TEXT NOT NULL,
  unit_id TEXT NOT NULL REFERENCES school_rank_units(id),
  score INTEGER NOT NULL CHECK(score BETWEEN 0 AND 1000),
  participants INTEGER,
  provisional INTEGER NOT NULL CHECK(provisional IN (0,1)),
  source_page INTEGER,
  eligible INTEGER NOT NULL CHECK(eligible IN (0,1)),
  PRIMARY KEY (series_id,year,unit_id)
);
CREATE INDEX school_rank_scores_unit ON school_rank_scores(unit_id,series_id,year);

CREATE TABLE school_rank_releases (
  id TEXT PRIMARY KEY,
  method TEXT NOT NULL,
  current INTEGER NOT NULL CHECK(current IN (0,1))
);
CREATE UNIQUE INDEX school_rank_current_release ON school_rank_releases(current) WHERE current=1;

CREATE TABLE school_rank_snapshots (
  release_id TEXT NOT NULL REFERENCES school_rank_releases(id),
  series_id TEXT NOT NULL REFERENCES school_rank_series(id),
  year TEXT NOT NULL,
  ranked_count INTEGER NOT NULL,
  provisional INTEGER NOT NULL,
  comparison TEXT NOT NULL CHECK(comparison IN ('available','missing','unverified')),
  PRIMARY KEY (release_id,series_id,year)
);

CREATE TABLE school_rank_entries (
  release_id TEXT NOT NULL,
  series_id TEXT NOT NULL,
  year TEXT NOT NULL,
  unit_id TEXT NOT NULL,
  rank INTEGER NOT NULL,
  PRIMARY KEY (release_id,series_id,year,unit_id),
  FOREIGN KEY (release_id,series_id,year) REFERENCES school_rank_snapshots(release_id,series_id,year),
  FOREIGN KEY (series_id,year,unit_id) REFERENCES school_rank_scores(series_id,year,unit_id)
);
