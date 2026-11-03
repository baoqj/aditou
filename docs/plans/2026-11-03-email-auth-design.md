# Aditou account email design

Resend organization and verified studyai.now domain are shared with StudyAI.now. The Aditou Worker uses its own sending-only key scoped to studyai.now. From: Aditou <aditou@studyai.now>; Reply-To: studyainow@mail.com. StudyAI.now credentials are not modified.

New password registrations are held outside accounts until email verification. Email links use random tokens with only SHA-256 digests stored in D1. Verification expires after 24 hours and password resets after 30 minutes. Links place tokens in fragments, not server logs; opening the page does not consume them. Users must explicitly confirm. Verification creates the account and optional learner in one transaction and requires normal login afterward. Google verified identities retain the existing OAuth login flow and receive an idempotent welcome message.

Password reset uses a generic request response to avoid revealing registered email addresses. New credentials, one-time token claims, deletion of all sibling reset links and revocation of all sessions commit together. Passwords remain PBKDF2-SHA256, 100000 iterations, salted. Anonymous sending endpoints are limited per IP and recipient. Verification delivery failures leave the registration pending and surface a resend path. Password reset failures are recorded without exposing account existence. Delivery audit stores recipient, template, locale, subject, accepted/failed state and Resend ID, but never message bodies or raw link tokens. Resend accepted status is not treated as proof of inbox delivery.

Five template types have French and English versions, published in Resend: verification, welcome, password-reset, progress and notification. Production uses the published aliases; source/HTML previews and the repeatable operator sync tool are in the repository folder. Variables: USER_NAME, ACTION_URL, MESSAGE. Keep ACTION_URL on https://aditou.studyai.now. Code validates the action URL and escapes inline preview content.

User decision: progress reminders are template-only; do not add a cron or automation. Notification template is used for a password-reset security notice. No broadcast or general notification campaign is scheduled.

Existing accounts remain usable; Google-linked identities are backfilled as email verified. Legacy password accounts are not falsely marked verified, and their password login remains available. A completed reset proves mailbox ownership. This migration does not force existing users through new verification.

Validation inventory: pending accounts cannot log in; verification success/replay/expiry; resend rotation; welcome idempotency; forgot/reset success, expired/replayed links and session revocation; Google login regression; invalid role rejection; FR/EN templates and UI; provider failure; rate limits; HTTPS redirects; desktop/mobile layout; production Resend and inbox acceptance.
