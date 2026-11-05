CREATE TABLE organization_student_status (
  org_id TEXT NOT NULL REFERENCES organizations(id),
  learner_id TEXT NOT NULL REFERENCES learners(id),
  active INTEGER NOT NULL CHECK(active IN (0, 1)),
  PRIMARY KEY (org_id, learner_id)
);
