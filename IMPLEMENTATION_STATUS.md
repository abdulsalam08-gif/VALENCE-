# VALENCE: Master Implementation Status & Phase Tracker

- **Platform:** VALENCE (*Vita sine litteris mors est.*), Independent, brand-neutral national platform
- **Theme:** Dark Fintech (`#0B0E11` bg, `#11161C` / `#161D26` surface, `#16C784` positive green, `#EA3943` loss/alert red, `Space Grotesk` + `Inter`)
- **Stack:** React 18 + Vite + JavaScript + Tailwind CSS + Supabase (Auth, Postgres, RLS, Storage, Realtime, Edge Functions) + Vercel + Paystack (exclusive online checkout) + Google Workspace connectors + Server-Side OpenAI + WebRTC

---

## Phase Roadmap & Status

| Phase | Scope | Status |
|---|---|---|
| **Phase 1** | **Project architecture, dark fintech design system, VALENCE logo, PWA install support (`manifest.webmanifest`, `sw.js`, iOS/Android icons), slow context-aware top ticker (`WisdomTicker`: 30 general life & wisdom quotes on Home, route-specific ongoing ICAN/ATSWA registration & field notices across all 18 page groups, zero overlap), solid opaque dropdown menus, official VALENCE WhatsApp Channel (`https://whatsapp.com/channel/0029VbDLZl4J93wMoS0biE1o`), 20 public routes incl. Paystack/NDPA Legal Policies (`/legal/:section`), gated ₦3,000 level cost unlock (in-app online tuition + centre-specific physical tuition cost implications set by advertising tuition centres), VALENCE National Inter-School Challenge (accounting & related fields questions + ₦220,000 podium prize pool: ₦100,000 1st / ₦70,000 2nd / ₦50,000 3rd, only 4 competitors per school, winners featured on school profiles as Top VALENCE Students), 466 embedded Nigerian institutions (206 universities + 156 polytechnics + 104 colleges), Central Exam Authority timetables & 30-day result countdowns, 45-item per-course store with 42 distinct course covers, same-day Lagos / 1-day outside Lagos Past Question delivery, Admin-updated live Study Pack availability status (delivered when available), in-app ATSWA guidance, in-app store/delivery desk, in-app VALENCE ADVERTISE at ₦10,000/week (physical centres publishing fee schedules + textbook authors/vendors with Option B in-app enquiries & optional checkout), zero fake listings, zero em-dashes & 24/7 support** | **Completed** |
| **Phase 2** | **Fresh dedicated Supabase project provisioned (`valence-platform`, ref `gdgeogzmrvxtwdqtlwbu`, `eu-west-1`), 6 atomic migrations deploying 100 RLS-enabled tables (0 unprotected tables, 233 RLS policies, 14 domain enums, anti-escalation & auth profile triggers), 6 Storage buckets (3 public + 3 private with folder RLS), 10 Realtime tables, full authentic seed data (466 Nigerian institutions: 206 universities + 156 polytechnics + 104 colleges, 6 levels, 27 revised courses, 5 exam diets & 13 timetables, 45 store items with 42 unique covers, live Admin Study Pack availability & same-day Lagos / 1-day outside Lagos Past Question delivery, 10 delivery zones, 30 life & wisdom quotes, 18-route page tickers, 14 FAQs, 4 NDPA/Paystack legal docs, 12 forum categories, 6 competition divisions + VALENCE National Inter-School Challenge & 5 stages with the ₦100,000 / ₦70,000 / ₦50,000 podium pool, the strictly-4-competitors-per-school trigger and the RLS-enabled `school_top_valence_students` table syncing winners onto school profiles as Top VALENCE Students, 9 ad placements, 0 fake listings, 0 em-dashes), plus live client-safe frontend hydration, Realtime sync & DB-backed in-app ticket persistence** | **Completed** |
| **Phase 3** | **Authentication, onboarding for all 7 user types (with 466-institution Nigerian university/polytechnic/college picker), student portal shell, avatar crop, storage-backed captioned photo gallery, privacy settings, notifications & role guards** | **Next** |
| **Phase 4** | **ATSWA & ICAN gated ₦3,000 tuition-only level unlocks, unlocked cost-implication calculator (25% off ≥2 ATSWA / ≥3 ICAN), in-app ATSWA document upload & registration guidance workflow, Central Exam Authority timetables, live 30-day result countdowns & ICAN Exemption Guide DB wiring** | Pending |
| **Phase 5** | **45-item per-course bookstore ordering flow (single course or full level past questions + study packs), server-synced cart, 9%/5%/6%/7% automatic discounts, 6 free Lagos pickups + state delivery zones, in-app study material & delivery enquiry desk, Paystack checkout & receipts** | Pending |
| **Phase 6** | **Tutor application, private-storage certificate uploads (AAT for ATSWA; AAT + ACA for ICAN), manual verification, 20-Q / 45-min timed qualification exam & tutor workspace** | Pending |
| **Phase 7** | **Study tools suite (all 15 student tools) & server-side AI Accounting Tutor (`OPENAI_API_KEY` server-only, 7-step response format, quotas & logs)** | Pending |
| **Phase 8** | **Paystack payment engine, server-side verification, signed webhook handling, idempotency, receipts, level-unlock locks, tuition enrolment & Google Meet access control** | Pending |
| **Phase 9** | **Community features: discovery, follows, study groups, 12 subject forums, mentorship & events** | Pending |
| **Phase 10** | **Official vs Community Announcements system (drafts, uploads, links, 7 backend-enforced audience visibility scopes, likes, comments, reposts, bookmarks, reporting & admin moderation)** | Pending |
| **Phase 11** | **Direct 1:1 & group messaging (Supabase Realtime, attachments, voice notes, read receipts, mute, block & report)** | Pending |
| **Phase 12** | **Real WebRTC direct audio & video calling (ICE/STUN/TURN signaling, ring/accept/decline/end, permission checks, privacy controls & call logs)** | Pending |
| **Phase 13** | **Competition system: school registration across all Nigerian universities/polytechnics/centres, 6 divisions, configurable ATSWA & ICAN timed exams, auto + human rubric grading, 6 leaderboards, Monthly League, 1v1/2v2 Arena, certificates, appeals, Hall of Fame & audited ₦220,000 podium post-competition reward disbursement (₦100,000 / ₦70,000 / ₦50,000) with Top VALENCE Students school-profile display and the strictly-4-competitors-per-school cap** | Pending |
| **Phase 14** | **Scholarships, internships, graduate jobs, CPE/CPD webinars & VALENCE PRO verified professional hub** | Pending |
| **Phase 15** | **VALENCE ADVERTISE & Verified Partner Directory, strictly for (1) Physical Tuition Centres, (2) Accounting Textbook Authors, and (3) Verified Textbook Vendors at ₦10,000/week in-app with Paystack billing (online tuition delivered solely in-app by VALENCE-verified tutors), 9 `Sponsored`-labelled placements, anti-piracy/venue verification queue & live CTR analytics** | Pending |
| **Phase 16** | **Full 8-role RBAC Admin Portal & Live Platform CMS (update all per-course store prices/discounts, delivery zones, ₦10,000/week ad rate, ATSWA guidance, in-app material/delivery & ad queues, Central Exam Authority date/timetable/result-delay console, ₦220,000 competition podium payout ledger, FAQs & announcements), verification queues, moderation, audit logs, security hardening, Google Workspace automation & Vercel deployment** | Pending |

---

## Environment Variables (Required Across Backend Phases)

### Client-Safe (Vite)
- `VITE_SUPABASE_URL`: Provisioned automatically via Supabase connector in Phase 2
- `VITE_SUPABASE_ANON_KEY`: Provisioned automatically via Supabase connector in Phase 2
- `VITE_PAYSTACK_PUBLIC_KEY`: Supplied by project owner for Paystack inline/redirect checkout (Phase 5 & 8)

### Server-Only (Supabase Edge Functions / Vercel Serverless, NEVER exposed in frontend)
- `SUPABASE_SERVICE_ROLE_KEY`: Server-side privileged verification & webhook writes
- `PAYSTACK_SECRET_KEY`: Server-side transaction verification & webhook HMAC validation
- `OPENAI_API_KEY`: Server-side AI Accounting Tutor endpoint (Phase 7)
- `TURN_SERVER_URL` / `TURN_USERNAME` / `TURN_CREDENTIAL`: Production NAT traversal relay for WebRTC voice/video calls (Phase 12)
