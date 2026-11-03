# Signup role cards and password setup

User requirements: no password on /signup; email link opens a two-password setup form; Teacher and Student role cards; no workspace dropdown; Google color icon and light-blue hover; no arrow in the header Sign Up button. The sample Flaticon pages were visual references. Local original SVG school/student icons are used, with no third-party image redistribution.

Registration now stores pending name/email/role and no password. POST /api/auth/verify-email requires a password and matching confirmation and atomically creates the account with its chosen credentials, consumes the token and sends the welcome email. Existing pending links continue to work with this password setup screen. Legacy parent accounts remain usable, while new public registrations expose only Teacher and Student. Google signup accepts the same role choices and preserves existing users' roles.

Teacher accounts created through public signup are marked self_registered. They can create an institution profile through My account -> My organization. This is an owner-bound organization profile, not a multi-user institution administration system. The teacher's existing classes remain teacher-scoped. Public teachers can read the shared published platform bank and their own content, but cannot edit platform or other teachers' questions, settings or unpublished audio. The platform admin remains distinct.

Migration 0013 widens pending-role/state constraints, adds the self-registration flag, question ownership and organizations. No existing roles are changed.

Validation: TypeScript/Vite build, email-auth, signup-role ownership, Google state, localization and routing checks. Live browser regression uses mocked registration/verification to avoid creating real accounts or sending extra mail. Desktop/mobile signup screenshots stored in artifacts/signup-teacher-desktop.png and artifacts/signup-teacher-mobile.png. Confirmed zero initial password fields, no workspace dropdown, two square cards, selected Teacher in Google URL, Google SVG and hover rgb(232,241,255), header signup with no SVG, double password setup, mismatch protection, explicit activation and no mobile horizontal overflow.

Deployment: 95cd3091-c48e-46fa-91bf-35ce2f2f9b23. Remote migration 0013 applied. Earlier API/email acceptance remains documented in EMAIL_AUTH_VALIDATION_2026-11-03.md; that report's original upfront-password flow is superseded by this change. No new live mailbox-delivery acceptance is claimed for this UI iteration.
