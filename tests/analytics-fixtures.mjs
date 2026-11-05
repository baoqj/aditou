// Local-only fixtures. Never run this SQL against a remote database.
import { writeFileSync } from "node:fs";
import { pbkdf2Sync, randomUUID } from "node:crypto";
const quote = (s) => "'" + String(s).replaceAll("'", "''") + "'";
const sql = [];
for (const [id, email, name, role, pw] of [
  [
    "analytics-teacher",
    "teacher@gmail.com",
    "Teacher Analytics",
    "teacher",
    "Teacher1234",
  ],
  [
    "analytics-student",
    "student@gmail.com",
    "Student Analytics",
    "student",
    "Student1234",
  ],
  [
    "analytics-school",
    "school@gmail.com",
    "School Analytics",
    "admin",
    "School1234",
  ],
]) {
  const salt = randomUUID(),
    hash = pbkdf2Sync(pw, salt, 100000, 32, "sha256").toString("hex");
  sql.push(
    `INSERT OR IGNORE INTO accounts(id,email,name,role,password_hash,salt,email_verified_at) VALUES(${[id, email, name, role, hash, salt, "2026-11-01"].map(quote).join(",")});`,
  );
}
sql.push(
  "INSERT OR IGNORE INTO learners(id,account_id,alias,grade) VALUES('analytics-learner','analytics-student','Alex',1);",
);
sql.push(
  "INSERT OR IGNORE INTO classes VALUES('analytics-class','Groupe des explorateurs',1,'fr-CA','analytics-teacher');INSERT OR IGNORE INTO enrollments VALUES('analytics-class','analytics-learner');INSERT OR IGNORE INTO organizations(id,name,owner_id) VALUES('analytics-org','École Aditou','analytics-school');INSERT OR IGNORE INTO organization_class_grants VALUES('analytics-org','analytics-class','analytics-teacher',CURRENT_TIMESTAMP);",
);
writeFileSync("artifacts/analytics-local-fixtures.sql", sql.join("\n"));
