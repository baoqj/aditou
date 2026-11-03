# Aditou support coffee

Public navigation includes a localized support button (coffee icon at narrow widths) opening an accessible native dialog. Chinese title: 支持 Aditou ☕ 我会更优秀！ Equivalent English/French/Spanish copy follows the selected interface language, including error/status messages, QR alternative text, payment notes and amounts. The prompt opens only on explicit action.

Reuses StudyAI's existing WeChat/Alipay QR images, copied without modification, and its existing 2/5/10 USD one-time Stripe checkout. Aditou's public POST /api/support/checkout validates amount and maps zh to zh-CN before calling the fixed https://studyai.now/api/donations/checkout endpoint through the Cloudflare STUDYAI service binding to studyainow-web, avoiding public same-zone Worker fetch restrictions. The gateway forwards no user cookies, credentials or identity. Only HTTPS checkout.stripe.com redirect URLs are returned, with no-store caching and localized failures. Same-origin mutation protections remain in the main Worker.

No new Stripe account, keys, products, webhook or donation database. Stripe payment confirmation and cancellation return to StudyAI using its existing flow; this is explained in the dialog. StudyAI's existing source attribution remains unchanged, so these shared payments are not separately tagged as Aditou transactions. No payment success is inferred in Aditou.

Validation: TypeScript/Vite build; 11 targeted tests for translations, navigation, permissions and checkout validation/errors; mocked browser checks in en/fr/es/zh at 1440/768/390/320px, QR assets, failure handling and Escape dismissal. Live StudyAI checkout API returned a Stripe-hosted checkout URL for a 2 USD session; no payment submitted.
