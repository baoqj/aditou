-- A source group without a verified building belongs to the shared school profile.
CREATE TABLE school_primary_group_schools (
  unit_id TEXT PRIMARY KEY REFERENCES school_rank_units(id),
  school_code TEXT NOT NULL,
  authority_code TEXT NOT NULL
);
CREATE INDEX school_primary_group_school_code ON school_primary_group_schools(school_code,authority_code);

INSERT INTO school_primary_group_schools
SELECT DISTINCT u.id,p.school_code,p.authority_code
FROM school_primary_repairs p JOIN school_rank_units u
  ON u.id='primary-r2-group-' || replace(json_extract(p.data,'$.reported_unit_key'),'_','-')
WHERE p.visibility='named_group_only' AND json_extract(p.data,'$.directory_building_hint')='';

DELETE FROM school_rank_unit_campuses
WHERE unit_id IN (SELECT unit_id FROM school_primary_group_schools);
