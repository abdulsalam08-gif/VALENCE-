# VALENCE — Master Implementation Status & Phase Tracker

- **Platform:** VALENCE (*Vita sine litteris mors est.*) — Independent, brand-neutral national platform
- **Theme:** Dark Fintech (`#0B0E11` bg, `#11161C` / `#161D26` surface, `#16C784` positive green, `#EA3943` loss/alert red, `Space Grotesk` + `Inter`)
- **Stack:** React 18 + Vite + JavaScript + Tailwind CSS + Supabase (Auth, Postgres, RLS, Storage, Realtime, Edge Functions) + Vercel + Paystack (exclusive online checkout) + Google Workspace connectors + Server-Side OpenAI + WebRTC

---

## Phase Roadmap & Status

| Phase | Scope | Status |
|---|---|---|
| **Phase 1** | **Project architecture, dark fintech design system, VALENCE logo integration, responsive layout, 12-item glassy navbar, mobile bottom nav, brand-neutral homepage (all 19 sections), full public multi-page tree (18 routes), gated ₦3,000 tuition-only cost implication rule, embedded NUC-accredited Nigerian universities directory (Federal, State & Private across all 36 states + FCT), ₦50,000 post-competition cash reward rule, Central Examination Authority diet schedule/timetable/7-day cutoff/30-day result countdown engine, WhatsApp enquiry widget, store cart engine & role portal gateways** | **Completed** |
| **Phase 2** | **Fresh Supabase database provisioning (~95+ tables incl. `nigerian_universities`, `exam_diet_schedules`, `exam_timetables`, `exam_result_releases`, `competition_rewards`, `student_fee_unlocks`), enums, triggers, RLS policies, private/public Storage buckets & seed data** | Next |
| **Phase 3** | **Authentication, onboarding for all 7 user types (with Nigerian university picker), student portal shell, avatar crop, storage-backed captioned photo gallery, privacy settings, notifications & role guards** | Pending |
| **Phase 4** | **ATSWA & ICAN gated ₦3,000 tuition-only level unlocks, unlocked cost-implication calculator (25% off ≥2 ATSWA / ≥3 ICAN), Central Exam Authority timetables & live 30-day result countdowns, diet isolation & ICAN Exemption Guide DB wiring** | Pending |
| **Phase 5** | **Bookstore & study materials ordering flow, server-synced cart, 9%/5%/6%/7% automatic discounts, 6 free Lagos pickups + state delivery zones, Paystack checkout & receipts** | Pending |
| **Phase 6** | **Tutor application, private-storage certificate uploads (AAT for ATSWA; AAT + ACA for ICAN), manual verification, 20-Q / 45-min timed qualification exam & tutor workspace** | Pending |
| **Phase 7** | **Study tools suite (all 15 student tools) & server-side AI Accounting Tutor (`OPENAI_API_KEY` server-only, 7-step response format, quotas & logs)** | Pending |
| **Phase 8** | **Paystack payment engine, server-side verification, signed webhook handling, idempotency, receipts, level-unlock locks, tuition enrolment & Google Meet access control** | Pending |
| **Phase 9** | **Community features: discovery, follows, study groups, 12 subject forums, mentorship & events** | Pending |
| **Phase 10** | **Official vs Community Announcements system (drafts, uploads, links, 7 backend-enforced audience visibility scopes, likes, comments, reposts, bookmarks, reporting & admin moderation)** | Pending |
| **Phase 11** | **Direct 1:1 & group messaging (Supabase Realtime, attachments, voice notes, read receipts, mute, block & report)** | Pending |
| **Phase 12** | **Real WebRTC direct audio & video calling (ICE/STUN/TURN signaling, ring/accept/decline/end, permission checks, privacy controls & call logs)** | Pending |
| **Phase 13** | **Competition system: school registration across all Nigerian universities/polytechnics/centres, 6 divisions, configurable ATSWA & ICAN timed exams, auto + human rubric grading, 6 leaderboards, Monthly League, 1v1/2v2 Arena, certificates, appeals, Hall of Fame & audited ₦50,000 post-competition learner reward disbursement** | Pending |
| **Phase 14** | **Scholarships, internships, graduate jobs, CPE/CPD webinars & VALENCE PRO verified professional hub** | Pending |
| **Phase 15** | **Approved Tuition Centres directory, VALENCE ADVERTISE self-serve packages, 9 `Sponsored`-labelled ad placements, approval queue & live impression/click/CTR analytics** | Pending |
| **Phase 16** | **Full 8-role RBAC Admin Panel (incl. Central Examination Authority date/timetable/result-delay console & ₦50,000 competition payout ledger), verification queues, moderation, audit logs, security hardening, performance polish, Google Workspace automation & fresh Vercel production deployment** | Pending |

---

## Environment Variables (Required Across Backend Phases)

### Client-Safe (Vite)
- `VITE_SUPABASE_URL` — Provisioned automatically via Supabase connector in Phase 2
- `VITE_SUPABASE_ANON_KEY` — Provisioned automatically via Supabase connector in Phase 2
- `VITE_PAYSTACK_PUBLIC_KEY` — Supplied by project owner for Paystack inline/redirect checkout (Phase 5 & 8)

### Server-Only (Supabase Edge Functions / Vercel Serverless — NEVER exposed in frontend)
- `SUPABASE_SERVICE_ROLE_KEY` — Server-side privileged verification & webhook writes
- `PAYSTACK_SECRET_KEY` — Server-side transaction verification & webhook HMAC validation
- `OPENAI_API_KEY` — Server-side AI Accounting Tutor endpoint (Phase 7)
- `TURN_SERVER_URL` / `TURN_USERNAME` / `TURN_CREDENTIAL` — Production NAT traversal relay for WebRTC voice/video calls (Phase 12)
