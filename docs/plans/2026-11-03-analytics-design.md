# Aditou learning analytics
Source: PRD/Visualization student, teacher and institution v1.0.

Implement role-specific overview plus time/performance/skills/assignments/teaching/content/quality details, shared metric_version and numerator/denominator aggregates, server-side scope, local-calendar date filters (Toronto default), accessible charts and equivalent tables, detail drawers and scoped/audited exports. Default one content language and target grade; no synthetic progress/comparability claims.

Existing D1 submissions and latest grades are authoritative. Use immutable question snapshots. First submission is determined across full retained history before date/context filtering, keyed learner + logical item + language (cosmetic versions do not reset). Independence is unknown for historical data; never call unknown-help results independent. Separate objective accuracy from earned/possible for graded responses. Respect homework whole-run release and classroom answer release in student reports.

New facts: frozen assignment/classroom target snapshots (legacy snapshots explicitly marked reconstructed), foreground activity intervals with 30-second heartbeats/90-second idle cap and cross-device union, actual audio progress (no duration proxy), teacher-confirmed teaching intervals and grading revisions. Missing historical telemetry stays incomplete. No inference of attendance or planned delivery without corresponding facts.

Institution data requires an owned organization plus explicit class grant by the responsible teacher; platform admin role alone does not expose every institution. Private practices never enter staff queries. Teachers can grant/revoke their classes to named institutions; revocation applies to all subsequent queries/exports. No public share links or student rankings. Institution reports are authorized operational reports, not anonymous public statistics; no anonymous export promised.

Advanced calibrated progress, fixed-cohort causal inference, attendance, scheduling, paper self-report and sharing-family workflows require data not currently present. Show explicit availability/quality states; do not fabricate values. P0 plus supported P1 views implemented; report actual remaining boundaries.
