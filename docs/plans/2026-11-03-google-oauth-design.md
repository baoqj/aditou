# Aditou Google OAuth

Use the existing Google Cloud project school-management-system-baoqj (display name studyainow) with an independent Aditou Production Web OAuth client. The canonical callback is https://aditou.studyai.now/api/auth/google/callback. The shared external consent application stays in production and requests only openid/email/profile.

Aditou maintains its own accounts, Google subject mapping, D1 state and host-only sessions. A ten-minute state is hashed, bound to a secure HttpOnly browser cookie, and consumed atomically. PKCE protects authorization-code exchange. Only verified Google email addresses are accepted. Existing email accounts keep their roles; registration can create only students or parents. New student registrations create a learner record atomically. Login with an unknown Google identity directs the user to registration so they can choose a role. Role-aware redirects use the existing authDestination function.

The Google button is available in French and English on login and registration; registration includes the selected role and grade. Credentials are Cloudflare Worker secrets and are never bundled into the browser. Migration 0011 adds independent Google identity and state tables.

Validation: TypeScript/Vite build; OAuth state/PKCE/role and callback rejection unit checks; existing routing and locale tests; live browser Google authorization and session checks.

Production acceptance: deployed Worker version 9c6ac9b1-f8c1-4ec6-aa09-58502ffc3baa. Eight focused tests passed. Live Google login for an unknown account redirected to role selection, Google parent registration created the QJ BAO parent account, and a logout/relogin returned to /family with role preserved. /api/auth/me returned 200; session cookie was host-only on aditou.studyai.now with Secure and HttpOnly. HTTP OAuth entry redirected to HTTPS. StudyAI.now Google entry remained a 302 to Google. Mobile 390x844 login had no horizontal overflow.
