# Admin users and organizations

Admin-only navigation adds Users and Organization with restrained table layouts, top search and filters, and 25-row server pagination. No statistics cards are needed. Existing four-language UI and native language names are preserved.

Users can be searched by name/email and filtered by role/account status. Admin can edit display names, disable and restore access. Disabling revokes existing sessions; authenticated API requests and password/Google sign-in reject disabled accounts. Self-disable is prohibited. Roles and email addresses remain unchanged to preserve the existing teacher/student relationship model.

Organizations list every organization with its owner and creation date. Search matches organization/owner name/email; owner and owner-account-status filters are available. Admin can rename organizations. Organization names and user data remain in their original language.

`/api/admin/users` and `/api/admin/organizations` enforce the persisted admin role on the server for both reads and writes, return explicit safe columns, use parameterized search and updates, and disable response caching. Migration 0015 adds account status. The requested admin@gmail.com account was verified to already have admin role; no role elevation was necessary.

Verification: build plus 22 targeted tests (including non-admin rejection, name edits, session revocation, self-disable protection, filters and non-overlapping pages), four-language browser checks with mocked APIs, and desktop/mobile layout inspection. Browser mock tests do not establish live admin-session acceptance. Production data was not renamed or disabled during validation.
