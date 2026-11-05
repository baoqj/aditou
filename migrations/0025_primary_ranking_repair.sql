ALTER TABLE school_rank_series ADD COLUMN dimension TEXT NOT NULL DEFAULT 'competence'
  CHECK(dimension IN ('competence', 'programme'));

CREATE TABLE school_primary_repairs (
  pdf_sha256 TEXT NOT NULL,
  pdf_page INTEGER NOT NULL,
  pdf_row INTEGER NOT NULL,
  school_code TEXT NOT NULL,
  authority_code TEXT NOT NULL,
  year TEXT NOT NULL,
  grade INTEGER NOT NULL,
  code TEXT NOT NULL,
  visibility TEXT NOT NULL CHECK(visibility IN ('named_group_only','internal_review')),
  data TEXT NOT NULL CHECK(json_valid(data)),
  PRIMARY KEY (pdf_sha256,pdf_page,pdf_row)
);
CREATE INDEX school_primary_review_school
  ON school_primary_repairs(school_code,authority_code,year,grade,code);

CREATE TABLE school_primary_result_meta (
  series_id TEXT NOT NULL,
  year TEXT NOT NULL,
  unit_id TEXT NOT NULL,
  source_row INTEGER NOT NULL,
  reported_label TEXT NOT NULL,
  count_text TEXT NOT NULL,
  small_group INTEGER NOT NULL CHECK(small_group IN (0,1)),
  display_scope TEXT NOT NULL CHECK(display_scope IN ('school','campus','programme')),
  PRIMARY KEY(series_id,year,unit_id),
  FOREIGN KEY(series_id,year,unit_id) REFERENCES school_rank_scores(series_id,year,unit_id)
);
