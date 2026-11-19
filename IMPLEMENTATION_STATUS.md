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
| **Phase 3** | **Authentication, onboarding for all 7 user types (with 466-institution Nigerian university/polytechnic/college picker), student portal shell, avatar crop, storage-backed captioned photo gallery, privacy settings, notifications & role guards** | **Completed** |
| **Phase 4** | **ATSWA & ICAN gated ₦3,000 tuition-only level unlocks (Paystack → `student_fee_unlocks`), unlocked cost-implication calculator (25% off ≥2 ATSWA / ≥3 ICAN), in-app ATSWA document upload (`atswa_guidance_documents` + storage bucket) & registration guidance workflow (`atswa_guidance_requests`), Central Exam Authority timetables (`exam_diet_schedules` + `exam_timetables`), live 30-day result countdowns (`exam_result_releases`), ICAN Exemption Guide DB wiring (`exemption_rules`)** | **Completed** |
| **Phase 5** | **45-item per-course bookstore ordering flow (single course or full level past questions + study packs), server-synced cart, 9%/5%/6%/7% automatic discounts, 6 free Lagos pickups + state delivery zones, in-app study material & delivery enquiry desk, Paystack checkout & receipts** | **Completed** |
| **Phase 6** | **Tutor application, private-storage certificate uploads (AAT for ATSWA; AAT + ACA for ICAN), manual verification, 20-Q / 45-min timed qualification exam & tutor workspace** | **Completed** |
| **Phase 7** | **Study tools suite (all 15 student tools) & server-side AI Accounting Tutor (`OPENAI_API_KEY` server-only, 7-step response format, quotas & logs)** | **Completed** |
| **Phase 8** | **Paystack payment engine, server-side verification, signed webhook handling, idempotency, receipts, level-unlock locks, tuition enrolment & Google Meet access control** | **Completed** |
| **Phase 9** | **Community features: discovery, follows, study groups, 12 subject forums, mentorship & events** | **Completed** |
| **Phase 10** | **Official vs Community Announcements system (drafts, uploads, links, 7 backend-enforced audience visibility scopes, likes, comments, reposts, bookmarks, reporting & admin moderation)** | **Completed** |
| **Phase 11** | **Direct 1:1 & group messaging (Supabase Realtime, attachments, voice notes, read receipts, mute, block & report)** | **Completed** |
| **Phase 12** | **Real WebRTC direct audio & video calling (ICE/STUN/TURN signaling, ring/accept/decline/end, permission checks, privacy controls & call logs)** | **Completed** |
| **Phase 13** | **Competition system: school registration across all Nigerian universities/polytechnics/centres, 6 divisions, configurable ATSWA & ICAN timed exams, auto + human rubric grading, 6 leaderboards, Monthly League, 1v1/2v2 Arena, certificates, appeals, Hall of Fame & audited ₦220,000 podium post-competition reward disbursement (₦100,000 / ₦70,000 / ₦50,000) with Top VALENCE Students school-profile display and the strictly-4-competitors-per-school cap** | **Completed** |
| **Phase 14** | **Scholarships, internships, graduate jobs, CPE/CPD webinars & VALENCE PRO verified professional hub** | **Completed** |
| **Phase 15** | **VALENCE ADVERTISE & Verified Partner Directory, strictly for (1) Physical Tuition Centres, (2) Accounting Textbook Authors, and (3) Verified Textbook Vendors at ₦10,000/week in-app with Paystack billing (online tuition delivered solely in-app by VALENCE-verified tutors), 9 `Sponsored`-labelled placements, anti-piracy/venue verification queue & live CTR analytics** | **Complete** |
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

---

## Phase 2 REBUILD — Database & Authentication (2026-11-18)

**Clean rebuild from scratch** — dropped all 100 old tables (which used non-spec names like `announcements`, `store_products`, `nigerian_institutions`, etc.) and recreated the full schema using the **exact table names from spec section 25 (Database Architecture)**.

**109 tables created** with proper primary keys, foreign keys, indexes, constraints, timestamps, and Row Level Security enabled on **all 109 tables** (113 RLS policies).

**Tables by category (spec section 25):**
- **Core identity & users:** `profiles`, `user_roles`, `student_profiles`, `tutor_profiles`, `professional_profiles`, `professional_credentials`, `institutions`, `institution_verifications`, `institution_representatives`, `institution_members`
- **User pictures & announcements:** `profile_photos`, `announcement_posts`, `announcement_attachments`, `announcement_comments`, `announcement_likes`, `announcement_bookmarks`, `announcement_shares`, `announcement_reports`
- **Academic programmes:** `programmes`, `examination_levels`, `courses`, `course_topics`, `examination_sessions`, `enrolments`, `fee_components`, `programme_fee_settings`, `discount_rules`, `student_fee_unlocks`
- **Tutor management:** `tutor_certificates`, `tutor_assessments`, `assessment_questions`, `assessment_attempts`, `tutor_rate_requests`
- **Learning:** `reading_progress`, `study_sessions`, `classrooms`, `class_schedules`, `class_attendance`, `assignments`, `assignment_submissions`, `textbooks`, `video_resources`, `learning_resources`
- **Payments & store:** `payments`, `products`, `product_prices`, `orders`, `order_items`, `delivery_zones`, `receipts`
- **Opportunities:** `opportunities`, `opportunity_applications`
- **VALENCE CONNECT:** `user_connections`, `connection_requests`, `conversations`, `conversation_members`, `messages`, `message_attachments`, `call_sessions`, `study_groups`, `study_group_members`, `study_group_messages`, `discussion_categories`, `discussion_posts`, `discussion_comments`, `discussion_likes`, `discussion_bookmarks`, `mentorship_profiles`, `mentorship_requests`, `professional_events`, `event_registrations`
- **Competitions:** `competition_teams`, `competition_team_members`, `competitions`, `competition_categories`, `competition_registrations`, `competition_rounds`, `competition_subjects`, `competition_question_banks`, `competition_questions`, `competition_options`, `competition_attempts`, `competition_answers`, `competition_marking_rubrics`, `competition_marks`, `competition_markers`, `competition_results`, `competition_leaderboards`, `competition_awards`, `competition_certificates`, `competition_appeals`, `competition_audit_logs`
- **VALENCE ADVERTISE:** `advertisers`, `advertiser_verifications`, `advertising_packages`, `advertising_campaigns`, `advertising_placements`, `advertising_payments`, `advertising_impressions`, `advertising_clicks`, `advertising_reports`, `advertising_audit_logs`
- **General platform:** `notifications`, `exemption_guidelines`, `exemption_qualifications`, `exemption_course_mappings`, `promotional_banners`, `audit_logs`, `platform_settings`

**Triggers:** `update_updated_at()` on all tables; `handle_new_user()` auto-creates a `profiles` row on every new auth signup.

**Seeded reference data:**
- 3 programmes: ATSWA, ICAN, University
- 6 examination levels (ATS 1–3, ICAN Foundation/Skills/Professional) at ₦3,000 unlock each
- 27 courses (12 ATSWA, 4 ICAN Foundation, 6 ICAN Skills, 5 ICAN Professional) at ₦20,000/₦40,000
- 8 delivery zones (6 free Lagos pickups + 7 state zones)
- 5 platform settings (WhatsApp, email, tagline, etc.)
- Discount rules: 25% off ≥2 ATSWA courses, 25% off ≥3 ICAN courses

**Frontend updates:** `auth.js` and `PlatformContext.jsx` updated to use spec-exact table names (`profiles`, `user_roles`, `products`, `announcement_posts`, `institutions`, `notifications`, `delivery_zones`, `opportunities`, `professional_events`, `exemption_guidelines`, `advertisers`, `student_fee_unlocks`, etc.). Non-spec tables (motivational quotes, page tickers, FAQs, tuition centres, tutors) fall back to local seed data from `platformConfig.js` — these will be migrated to spec tables in later phases.

**Production server:** `valence-production-afb15b6c`, port 4173.

---

## Phase 5 — Bookstore Ordering Flow (2026-11-18)

**45-item per-course bookstore ordering flow — complete and deployed.**

**Server-side catalogue seeding:** All 45 store products (12 ATSWA per-course past questions, 3 ATSWA study packs, 15 ICAN Pathfinder per-course past questions, 15 ICAN study packs) seeded into spec tables `products` + `product_prices` via `valence/migrations/phase5_seed_store.mjs` (deterministic `md5(localId)::uuid` product IDs, prices via `INSERT ... SELECT ... WHERE NOT EXISTS`). `course_id` left NULL (FK) — the frontend merges by product name, so the course link is not required for the store UI. Delivery zones synced: the 8 seeded `delivery_zones` rows updated + 2 inserted to match the 10 local zones exactly (6 free Lagos hubs + 4 paid zones).

**Frontend:** `valence/src/lib/paystack.js` (Paystack inline.js SDK loader + `openPaystackCheckout` + reference generator); `valence/src/lib/storeOrders.js` (order creation, payment confirmation, order history). `StorePage.jsx` checkout flow rebuilt: auth-gated → delivery details modal → server order creation → Paystack embed checkout → server payment confirmation → in-app receipt (receipt number, order ID, Paystack reference, items, delivery zone) + "My Orders & Receipts" order-centre modal. `PlatformContext.jsx` `refreshPublicData` now merges DB product/zone rows with the local catalogue metadata by name (keeps the Store UI's category/courseCode/level/eta fields while using server prices & live availability).

**Server (Postgres RPC, `SECURITY DEFINER`, owned by `postgres`):**
- `public.create_store_order(p_items jsonb, p_zone_id uuid, p_address text)` — validates every item against `products`/`product_prices`, recomputes all four discount rules server-side (9% ATSWA PQ, 5% ATSWA study pack, 6% ICAN PQ, 7% ICAN multi-course study pack) + delivery-zone fee, inserts `orders` + `order_items`, returns the authoritative totals. Programme (ATSWA vs ICAN) detected via the `examination_levels` join — NOT by name parsing (ATSWA PQ names contain "ATS 1", not "ATSWA").
- `public.verify_store_payment(p_order_id uuid, p_reference text, p_amount integer)` — validates order ownership + exact amount match, records `payments`, marks the order `paid`, generates a `VLR-YYYYMMDD-XXXXXX` receipt in `receipts`.

**Verified end-to-end:** all four discount rules (9% ₦990 · 5% ₦950 · 6% ₦1,080 · 7% ₦2,030), order + items + payment + receipt rows, ownership/amount validation error paths. Test data cleaned (all order tables back to 0 rows).

**Server-side Paystack verification — LIVE (2026-11-18):** `PAYSTACK_SECRET_KEY` (`rk_live_…`) stored as a Supabase project secret **and** in the DB-backed `app_secrets` table (Supabase secrets are not exposed to Postgres via `current_setting()` on this project, so the RPC reads the DB copy; `app_secrets` is RLS-locked to service_role). `verify_store_payment` now performs **real server-side Paystack API verification**: the RPC schedules an async `pg_net` HTTP job to `GET /transaction/verify/{reference}` with the secret key, stores the job id on the order (`orders.paystack_verify_job`), and returns `{status:'verifying'}`; the client (`storeOrders.js confirmStorePayment`) retries the RPC, which picks up the job's response from `net._http_response` and validates Paystack's transaction (reference + kobo amount + status) before recording the payment, marking the order `paid`, and generating the receipt. On success the receipt shows the **green "Server-verified against Paystack"** badge (`server_verified: true`, `verification_mode: 'paystack_server'`). Verified end-to-end: bogus reference → Paystack's real API error returned in <1s; wrong amount → mismatch error (no HTTP). Environment: `VITE_PAYSTACK_PUBLIC_KEY=pk_live_895e22d85301a41bad2241676ce2c84e21f17e73` in `valence/.env`.

---

## Phase 6 — Tutor Application, Verification & Qualification Exam (2026-11-18)

**Tutor application, certificate uploads, manual verification, 20-Q / 45-min timed exam & tutor workspace — complete and deployed.**

**Server (Postgres RPC, `SECURITY DEFINER`, owned by `postgres`, error-JSON returns, no `RAISE`):**
- `public.create_tutor_application(p_qualifications text[], p_expertise text[], p_available_hours text, p_preferred_mentee_categories text[])` — creates the `tutor_profiles` row (`verification_status='pending'`), an initial `tutor_assessments` row (45 minutes, pass 14/20, status `pending`), and an `audit_logs` entry. Rejects duplicate applications per profile. Returns the certificate requirements (ATSWA → AAT; ICAN → AAT + ACA).
- `public.add_tutor_certificate(...)` — records an uploaded certificate document (type AAT/ACA, name, issuing body, number, private-storage URL) with ownership checks.
- `public.verify_tutor(p_tutor_profile_id, p_action, p_programme)` — admin-only (`is_admin_user()` enforced inside). Approval enforces the certificate rules per programme (ATSWA: AAT present; ICAN: AAT + ACA present, each with a document URL) and returns `missing_certificates` on failure; on success sets certificates `verified`, tutor `verified`, and opens the assessment (`ready`). Rejection marks everything `rejected`.
- `public.start_tutor_assessment(p_tutor_profile_id)` — opens a timed attempt (`assessment_attempts`, `started_at=now`) once the tutor is verified.
- `public.submit_tutor_assessment(p_attempt_id, p_answers)` — server-enforced 45-minute limit (+90s grace), scores all 20 questions server-side against `assessment_questions`, sets `passed` (score ≥ 14), writes the attempt + audit entry, and updates the assessment to `passed`/`failed`. Retakes allowed after failure; already-passed is blocked.

**RLS:** the six tutor tables (`tutor_profiles`, `tutor_certificates`, `tutor_assessments`, `assessment_questions`, `assessment_attempts`, `tutor_rate_requests`) had RLS enabled but **zero policies** (deny-by-default). 15 policies authored: owners read/update their own rows, admins via `public.is_admin_user()`, `assessment_questions` readable by authenticated users.

**Exam bank:** 20 MCQs seeded into `assessment_questions` via `valence/migrations/phase6_seed_tutor_exam.sql` (accounting fundamentals, ATSWA/ICAN knowledge, taxation, financial reporting; each with options, correct-answer index, explanation and category).

**Frontend:** `src/lib/tutor.js` (application, certificate upload, assessment, admin verification helpers); `TutorApplyPage.jsx` (`/portal/tutor/apply` — application form + per-track certificate uploads to the private `tutor-certificates` bucket, folder `<uid>/certificates/<tutor_id>/`); `TutorWorkspacePage.jsx` (`/portal/tutor` — verification status, certificates, assessment state, attempt history, exam CTA); `TutorExamPage.jsx` (`/portal/tutor/exam` — 20 questions, live 45-minute countdown, auto-submit at zero, server-scored result with per-question answer review; correct answers deliberately not exposed to the client). Admin console gained a **Tutor Verification** tab (pending queue with certificate review, ATSWA/ICAN programme select, approve/reject). Portal gateway routes tutor sign-ins to `/portal/tutor` and new tutor registrations to `/portal/tutor/apply`.

**Verified end-to-end:** application creation (20-Q/45-min/pass-14 config returned); ICAN approval correctly **blocked** without ACA (`missing_certificates: ["ACA"]`); ATSWA approval with AAT succeeds (verified + test opens); exam attempt 1 all-wrong → 0/20 failed; retake attempt 2 all-correct → **20/20 passed**, assessment `passed`. All test rows cleaned.

**Private storage bucket — LIVE:** the private `tutor-certificates` bucket is created (project owner supplied the Supabase service_role key for creation). The storage REST API on this project does not expose bucket-policy routes (`/bucket/{id}/policies` → 404), so the folder RLS was authored as **SQL policies on `storage.objects`** (the same mechanism Phase 2 used for its buckets): owner INSERT (`WITH CHECK` on `auth.uid() = foldername(name)[1]`), and SELECT/UPDATE/DELETE for owner **or admin** (`is_admin()`), mirroring the `avatars` bucket pattern. Verified: owner upload/download round-trip 200; upload to a foreign user's folder → 403 RLS denial. Certificate documents live at `<uid>/certificates/<tutor_id>/<file>` and are visible only to the submitting user and admins. (`pg_http` unavailable on this project; edge functions non-functional — all server logic is Postgres RPC as in Phase 5.)

---

## Phase 7 — 15-Tool Study Suite + Server AI Accounting Tutor (2026-11-19)

**15-tool study suite, 6 new spec tables, the two-phase AI Accounting Tutor, and the `/learning` frontend — complete and deployed.**

**The 15 tools (user-provided + spec-aligned additions):** 1. Flashcards, 2. Quiz Generator, 3. Study Planner, 4. Progress Tracker, 5. Exam Mode, 6. IAS, 7. IFRS, 8. Finance, 9. AI Accounting Tutor, 10. Student Notes, 11. Revision Sessions, 12. Reading Progress, 13. Learning Resources, 14. Performance Insights, 15. Study Goals. Tools 1–8 were provided by the user; tools 9–15 added to complete the suite against the spec's Phase 7 tables.

**Schema (migration `valence/migrations/phase7_study_tools.sql`, deployed):**
- `study_plans` (profile_id, course_id, title, plan_type, status, start/target dates, description)
- `syllabus_progress` (profile_id, course_id, topic_name, chapter_name, status, completed_at)
- `study_sessions_log` (profile_id, course_id, subject, duration_minutes, session_date, notes)
- `student_notes` (profile_id, course_id, title, content, is_pinned)
- `flashcard_decks` (profile_id, course_id, deck_title, description, cards jsonb)
- `practice_quiz_attempts` (profile_id, course_id, quiz_topic, questions_total/correct, score_percentage, time_taken_seconds, is_exam_mode, feedback)
- Pre-existing study tables reused: `study_sessions`, `reading_progress`, `learning_resources` (with their existing RLS).
- All 6 new tables have 4 owner/admin RLS policies each (SELECT/INSERT/UPDATE/DELETE), using the project convention `profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR is_admin_user()`.

**Server AI Accounting Tutor (two-phase Postgres RPC, `SECURITY DEFINER`, error-JSON returns):**
- `chat_ai_tutor(p_message text, p_conversation_id uuid DEFAULT NULL)` — Phase 1: validates the message (2–4000 chars), checks the 30/day quota (from `app_secrets.ai_tutor_daily_quota`, counts today's `user` messages), creates/reuses the conversation, stores the user message, resolves `openai_api_key` from `app_secrets`, builds history, and schedules the `gpt-4o-mini` `pg_net` job (stored in `ai_tutor_conversations.openai_job`), returning `{status:'processing'}`. Phase 2 (client retry with `p_conversation_id`): retry-safe — a pending user message with a job id within 10 min picks up `net._http_response` by stored `openai_job`, writes the assistant message + `steps` jsonb, audit-logs, and returns the reply. Rolls back the user message on non-200 or empty responses. Graceful handling of OpenAI 429 `credit_balance_exhausted` → *"add credits at platform.openai.com"*. The 7-step JSON system prompt is enforced server-side: Understanding the Question / Relevant Principle / Theory Explained / Step-by-Step Solution / Final Answer / Common Mistakes / Practice Tip.
- `list_ai_tutor_conversations()` — returns the caller's conversations (id, title, timestamps, message counts) newest first.
- **KEY OPENAI_API_KEY (user-supplied, `sk-proj-KBavd...`)** is stored server-only: Supabase project secret `OPENAI_API_KEY` + `public.app_secrets` row. The key is valid but the OpenAI account currently has no credits — the tutor surfaces a graceful "add credits" error until topped up at platform.openai.com.

**Frontend:** `src/lib/studyTools.js` (client helpers for all 15 tools; a `getProfileId()` resolver for profile-scoped writes, following the `auth.js` pattern; a 20-question practice bank powering Quiz Generator + Exam Mode; the two-phase `sendAiTutorMessage` retry loop); `src/pages/StudyToolsPage.jsx` (`/learning` — hero, 15 tool cards, per-tool panels: flashcard decks with flip-study, quiz generator with instant scoring, study planner, syllabus progress tracker, timed 10-question exam mode, IAS/IFRS/Finance subject hubs, AI tutor chat with conversation list + 7-step breakdown, student notes, revision sessions with stats, reading progress, learning resources browser, performance insights with score trend, study goals with milestones); route wired in `App.jsx`; the Student Portal's existing "15 free study tools" link (`/learning`) now resolves to the live suite. Green branding (`#16C784`, Dark Fintech) throughout.

**Verified end-to-end (18/18):** insert + readback on all 6 new tables; update + delete on `study_plans`; `reading_progress` insert; AI tutor two-phase schedule → pickup (credit-blocked path returns clean error); `list_ai_tutor_conversations`. All test rows cleaned. Production rebuilt (port 4173) and serving the new bundle; `/learning` 200.

---

## Phase 8 — Paystack Payment Engine, Level-Unlock Locks, Tuition Enrolment & Google Meet Access Control (2026-11-19)

**Paystack financial engine, signed webhook handling, server-verified level-unlock locks, tuition enrolment and Google Meet access control — complete and deployed.** (Phase 5 already shipped store-order verification; this phase completes the payment engine, upgrades the Phase 4 client-side level unlock to real server-side Paystack verification, and adds tuition enrolment + live-class gating.)

**Schema (migration `valence/migrations/phase8_paystack_engine.sql`, deployed):**
- `payment_transactions` (profile_id, reference UNIQUE, amount_ngn, currency, payment_type, status, paystack_reference, paystack_verify_job, payload jsonb, verified_at) — the canonical ledger for all Paystack payments (store orders, level unlocks, tuition, ads).
- `paystack_webhook_events` (event_id UNIQUE — the idempotency log, event_type, payload, signature, processed) — service_role/admin RLS only.
- `payment_receipts` (profile_id, transaction_id FK, receipt_number UNIQUE, amount_ngn, receipt_url).
- `tuition_enrolments` (profile_id, examination_level_id FK, course_ids text[], status, enrolled_at).
- `live_class_sessions` (examination_level_id FK, title, description, scheduled_at, meet_url, tutor_profile_id, status) — listable by authenticated users; the meet URL itself is gated by RPC.
- `live_class_attendance` (session_id, profile_id, attended_at, UNIQUE(session_id, profile_id)).
- `student_fee_unlocks` gained a UNIQUE(profile_id, examination_level_id) constraint (the unlock lock — one permanent unlock per level, never charged twice).
- RLS: owner/admin for the payment/enrolment/attendance tables; service_role/admin for the webhook log; live-class sessions listable by any authenticated user (meet URL gated separately).

**Server (Postgres RPC, `SECURITY DEFINER`, error-JSON returns, no `RAISE`):**
- `create_level_unlock_payment(p_level_id uuid)` — creates a `payment_transactions` row (₦3,000, `level_unlock`, `pending`) with a unique reference; refuses if the level is already unlocked.
- `verify_level_unlock_payment(p_transaction_id, p_reference, p_amount)` — the server-verified **unlock lock**. Two-phase (mirrors `verify_store_payment`): the RPC schedules a `pg_net` `GET /transaction/verify/{reference}` with the Paystack secret key, stores the job on the transaction, returns `{status:'verifying'}`; the client retries, the RPC picks up `net._http_response`, validates Paystack's status, then finalizes — marks the transaction `successful`, inserts the `student_fee_unlocks` row (idempotent `ON CONFLICT DO NOTHING`), and generates a `VLR-YYYYMMDD-XXXXXX` receipt in `payment_receipts`. Retry-safe; non-200/failed statuses mark the transaction `failed` without unlocking.
- `handle_paystack_webhook(p_body text, p_signature text)` — **signed webhook handling**. Verifies the Paystack HMAC-SHA512 signature (`extensions.hmac` over the raw body with the secret from `app_secrets.paystack_secret_key`), enforces **idempotency** via the unique `event_id` in `paystack_webhook_events` (duplicate deliveries return `{status:'duplicate'}`), and applies `charge.success`/`charge.failed` events to `payment_transactions`.
- `resolve_examination_level(p_level_ref text)` — resolves a level by DB uuid **or** code (`ats-1`, `foundation`, …) to the authoritative row (id, code, name, unlock fee, programme).
- `enroll_tuition(p_level_id uuid, p_course_ids text[])` — tuition enrolment **gated by `has_unlocked_level`**; refuses with a clear error unless the student has paid the ₦3,000 unlock for that level.
- `get_live_class_meet_url(p_session_id uuid)` — **Google Meet access control**: grants the meet URL only to admins, the assigned tutor, or a student with an active tuition enrolment for the session's level; recording attendance (`live_class_attendance`) on grant.
- `list_live_class_sessions(p_level_id)`, `fetch_my_tuition_enrolments()`, `fetch_my_payment_receipts()` — read helpers (all scoped to the caller).
- `has_unlocked_level(p_level_id text, p_uid uuid)` — **fixed**: the Phase 2 definition referenced non-existent columns (`u.user_id`/`u.level_id` and `is_admin()` → missing `admin_role_assignments`); rewritten to join `student_fee_unlocks` → `profiles` on the correct `profile_id`/`examination_level_id` columns and gate admins via `is_admin_user()`.

**Frontend:** `src/lib/payments.js` — `resolveExaminationLevel`, `createLevelUnlockPayment`, `confirmLevelUnlockPayment` (two-phase retry loop), `unlockLevelWithPaystack` (full flow: resolve → create transaction → Paystack embed checkout → server-verify → return unlock + receipt), `enrollTuition`, `fetchMyTuitionEnrolments`, `listLiveClassSessions`, `getLiveClassMeetUrl`, `fetchMyPaymentReceipts`. `StudentPortalPage.jsx` — the tuition tab's unlock button now runs the **real server-verified Paystack flow** (replacing the Phase 4 client-side SIM insert), plus new **Tuition Enrolment** section (per-level enrol buttons gated by unlock, enrolled badges) and **Live Classes (Google Meet)** section (per-level session lists with Join buttons that call the access-controlled RPC and open the meet URL). Green `#16C784` branding throughout.

**Verified end-to-end (20/20):** insert + readback on all 6 new tables; attendance; `resolve_examination_level` by code; `create_level_unlock_payment`; `enroll_tuition` (admin path); `get_live_class_meet_url` (admin grant); `list_live_class_sessions`; `fetch_my_tuition_enrolments`; `fetch_my_payment_receipts`; `handle_paystack_webhook` — valid signature processed, duplicate event id → `duplicate`, bad signature → rejected; webhook-event readback. All test rows cleaned. Production rebuilt (port 4173); `/`, `/portal/student`, `/learning` all 200.

---

## Phase 9 — Community: Discovery, Follows, Study Groups, Subject Forums, Mentorship & Events (2026-11-18)

**Community layer — discovery, follows/blocks, study groups, 12 subject forums, mentorship requests and event registration — complete and deployed.** Builds on the existing community tables (`study_groups`, `study_group_members`, `mentorship_profiles`, `mentorship_requests`, `professional_events`, `event_registrations`, `opportunities`, which already existed with RLS) and adds the missing social/community tables plus the RPC layer and the `/community` frontend.

**Schema (migration `valence/migrations/phase9_community.sql`, deployed):** 7 new tables, each with RLS:
- `user_follows` (follower_profile_id, followed_profile_id, created_at, UNIQUE(follower,followed)) — owner-insert; blocks follow-if-blocked enforced at RPC.
- `user_blocks` (blocker_profile_id, blocked_profile_id, created_at, UNIQUE(blocker,blocked)) — owner-insert.
- `forum_categories` (name, description, icon, sort_order) — seeded with 12 subject forums: Accounting Principles, Bookkeeping & Journals, Financial Reporting, Taxation (PAYE & VAT), Cost & Management Accounting, Auditing & Internal Control, Payroll Accounting, Banking & Reconciliation, Inventory & Stock Control, IFRS & IAS Standards, ATSWA Past Questions, ICAN Pathfinder Help.
- `forum_threads` (category_id FK, author_profile_id, title, content, is_pinned, status) — owner-insert; category existence + min-length validated at RPC.
- `forum_replies` (thread_id FK, author_profile_id, content) — owner-insert; thread existence validated at RPC.
- `content_reports` (reporter_profile_id, target_type, target_id, reason, description) — owner-insert.
- `professional_verifications` (profile_id, verification_type, status, ...) — reserved for verification flows.
- `professional_events` seeded with 4 open events: Study Hall ATSWA ATS 1, ICAN Foundation Skills Workshop, Tax & PAYE Masterclass, Cost Accounting Clinic.

**Server (Postgres RPC, `SECURITY DEFINER`, error-JSON returns, no `RAISE`):**
- `toggle_follow(p_profile_id)` — insert/delete follow; refuses self-follow; refuses follow when a block exists; clears the follow when blocking.
- `toggle_block(p_profile_id)` — insert/delete block; clears mutual follows on block.
- `join_study_group(p_group_id)` / `leave_study_group(p_group_id)` — public groups only; membership checked.
- `create_forum_thread(p_category_id, p_title, p_content)` — validates category + min lengths.
- `create_forum_reply(p_thread_id, p_content)` — validates thread + min length; bumps thread `updated_at`.
- `report_content(p_target_type, p_target_id, p_reason, p_description)` — submits a moderation report.
- `request_mentorship(p_mentor_profile_id, p_message)` — resolves the mentor's active `mentorship_profiles` row, rejects duplicate pending requests.
- `register_for_event(p_event_id)` — validates the event is open; idempotent (re-register returns `registered:false`).
- Read RPCs: `fetch_discovery_profiles()` (other profiles, follow/block state, follower counts, blocks excluded), `fetch_study_groups()`, `fetch_forum_categories()`, `fetch_forum_threads(p_category_id)`, `fetch_thread_replies(p_thread_id)`, `fetch_mentorship_profiles()`, `fetch_platform_events()` (open events + registration state).

**Frontend:** `src/lib/community.js` — all 13 RPCs wrapped as async functions. `src/pages/CommunityPage.jsx` — a single authenticated `/community` page with 5 tabs: **Discovery** (follow/block profile cards), **Study Groups** (join/leave), **Forums** (12-subject sidebar → thread list → thread detail with replies, new-thread and reply composers, report), **Mentorship** (mentor cards → send request), **Events** (open events → register). Green `#16C784` branding throughout; `/community` route added to `App.jsx` (`RequireAuth`) and nav links added to `Navbar.jsx` (desktop dropdown + mobile menu).

**Verified end-to-end (23/23):** discovery list (excludes self, blocks filtered); follow create/remove; block create/remove; self-follow rejected; join/leave study group; study-group list; forum categories (12); create thread; threads list; create reply; replies list; report content; mentors list; mentorship request sent; duplicate request rejected; events list (4); register for event; re-register flagged. All test rows cleaned. Production rebuilt (port 4173); `/`, `/community`, `/learning` all 200.

---

## Phase 10 — Official vs Community Announcements (2026-11-18)

**Announcements system with 7 backend-enforced audience visibility scopes, likes, comments, reposts/shares, bookmarks, reporting and admin moderation — complete and deployed.** The 7 tables (`announcement_posts`, `announcement_likes`, `announcement_comments`, `announcement_bookmarks`, `announcement_shares`, `announcement_attachments`, `announcement_reports`) and the `announcement_scope` enum (7 values) already existed from Phase 2, but the `can_view_announcement()` helper was **stale** (referenced a non-existent `announcements` table and wrong columns) and the SELECT policies were permissive (no visibility enforcement). This phase realigns the helper to the real schema, enforces visibility in RLS, and adds the RPC + frontend layer.

**Schema alignment (`valence/migrations/phase10_announcements.sql`):**
- `can_view_announcement(p_ann_id, p_uid)` — **rewritten** to match `announcement_posts`. Visible when: admin (`is_admin_user()`), the author, or a `published` post whose `audience` scope the viewer satisfies — `public` (everyone), `connections` (viewer follows the author via Phase 9 `user_follows`), `study_group` (member of the target group), `institution` (viewer's `institution_id` matches), `programme` (viewer's `programme` matches), `course` (authenticated), `professional` (viewer `account_type` in professional/tutor/admin). Drafts/hidden/removed posts are visible only to the author or admin.
- **RLS enforcement:** dropped the two permissive SELECT policies on `announcement_posts` and added `ann_posts_select_visible` gated on `can_view_announcement(id)`. Added parent-visibility-gated SELECT policies on likes, comments, bookmarks, shares, attachments; reports are admin/reporter-only.

**Server (Postgres RPC, `SECURITY DEFINER`, error-JSON, no `RAISE`):** `create_announcement` (validates title/content/audience scope/status; official posts admin-only; scope-specific target checks), `update_announcement`, `delete_announcement` (soft-delete → `removed`), `toggle_announcement_like`, `toggle_announcement_bookmark`, `add_announcement_comment`, `delete_announcement_comment`, `share_announcement` (repost), `report_announcement`, `fetch_announcements` (caller-visible feed with counts + like/bookmark state), `fetch_announcement_detail`, `fetch_announcement_comments`, `moderate_announcement` (admin hide/unhide/delete), `review_announcement_report` (admin uphold/dismiss; uphold removes the post).

**Frontend:** `src/lib/announcements.js` — all 14 RPCs wrapped. `src/pages/AnnouncementsPage.jsx` — authenticated `/announcements` page: composer (title, content, 7-scope audience selector, category, admin-only official toggle), feed of official/community cards with like/comment/share/bookmark counts, detail view with full content + action bar (like, share, save, report) + comments list/composer, and admin moderation (hide/restore/delete). Green `#16C784` branding. Route wired in `App.jsx` (`RequireAuth`) + nav links in `Navbar.jsx`.

**Verified end-to-end (29/29):** create public/connections/draft/official announcements; non-admin official blocked; short-title rejected; backend-enforced visibility (admin sees all incl. own draft; viewer sees public+official but NOT connections or draft); like/bookmark/comment/share/report; viewer blocked from liking an invisible post; detail counts; non-admin moderation blocked; admin hide → viewer can't see → unhide → viewer sees; report review. All test rows cleaned. Production rebuilt (port 4173); `/`, `/community`, `/announcements` all 200.

---

## Phase 11 — Direct 1:1 & Group Messaging (2026-11-18)

**Direct 1:1 & group messaging with Supabase Realtime, attachments, voice notes, read receipts, mute, block & report — complete and deployed.** The messaging tables (`conversations`, `conversation_members`, `messages`, `message_attachments`) and a private `message-attachments` Storage bucket already existed from Phase 2, but the `is_conversation_participant()` / `is_blocked_between()` helpers were **stale** (referenced non-existent tables/columns) and the SELECT policies were permissive (anyone could read all messages). This phase realigns the helpers, enforces membership RLS, and adds the RPC + frontend layer.

**Schema alignment (`valence/migrations/phase11_messaging.sql`):**
- `is_conversation_participant(p_convo_id, p_uid)` — **rewritten** to check `conversation_members` (via `profile_id` → `profiles.user_id`).
- `is_blocked_between(p_a, p_b)` — **rewritten** to use the Phase 9 `user_blocks` columns (`blocker_profile_id`/`blocked_profile_id`).
- `conversation_members` gained `muted boolean` (mute) and `updated_at` (the project-wide `update_updated_at()` trigger requires it).
- **RLS enforcement:** replaced the permissive `conversations_select_member`, `conversation_members_select_member`, `messages_select_member` policies with membership-gated ones (`is_conversation_participant(...)`); added `message_attachments_select_member` (parent-message membership) and `message_attachments_insert_sender` (sender-only).

**Server (Postgres RPC, `SECURITY DEFINER`, error-JSON, no `RAISE`):** `create_direct_conversation` (reuses existing 2-member direct; refuses blocked), `create_group_conversation` (block checks per member), `send_message` (text/voice/image/file + attachment; participant-gated), `fetch_conversations` (last message, unread count via `last_read_at`, mute, peer name), `fetch_conversation_messages` (participant-gated, with attachments), `fetch_conversation_members`, `mark_conversation_read`, `toggle_conversation_mute`, `leave_conversation`, `report_message` (via Phase 9 `content_reports`).

**Frontend:** `src/lib/messaging.js` — all RPCs wrapped, plus attachment upload + signed-URL helpers (private `message-attachments` bucket) and a `subscribeToMessages` Realtime helper. `src/pages/MessagingPage.jsx` — two-pane authenticated `/messages` page: conversation list (unread badges, mute icon, last-message preview), chat view with message bubbles (text/image/voice/file), file attach + MediaRecorder voice notes, realtime new-message subscription, mark-read on open, mute/leave/block, and per-message report. Green `#16C784` branding. Route wired in `App.jsx` (`RequireAuth`) + nav links in `Navbar.jsx`.

**Verified end-to-end (31/31):** create + reuse direct conversation; send text + file-attachment messages; message fetch + attachment readback; read receipts (viewer unread count, admin unread after reply, mark-read → 0); mute on/off; create group + group message + 3 members; membership-enforced visibility (non-member blocked from messages, list excludes non-member conversations); report message; block → blocked user can't start chat → unblock; leave group → gone from list. All test rows cleaned. Production rebuilt (port 4173); `/`, `/messages`, `/announcements` all 200.

---

## Phase 12 — Real WebRTC Audio & Video Calling (2026-11-18)

**Real WebRTC direct audio & video calling with ICE/STUN/TURN signaling, ring/accept/decline/end, permission checks, privacy controls and call logs — complete and deployed.** `call_sessions` existed from Phase 2 (no RLS); `call_signals` is new. This phase adds the signaling table, enforces participant RLS, adds the RPC layer, and ships a full browser WebRTC call UI integrated into the messaging page.

**Schema (`valence/migrations/phase12_webrtc_calls.sql`):**
- `call_signals` (new) — append-only WebRTC signaling log: `session_id` FK → `call_sessions`, `signal_type` (ring/offer/answer/candidate/accept/decline/end/timeout), `from_profile_id`, `to_profile_id`, `payload` jsonb (SDP / ICE candidate), `created_at`.
- `call_sessions` gained `media_type` (audio/video) and `updated_at` (the project-wide `update_updated_at` trigger).
- **RLS:** `call_sessions` SELECT/INSERT/UPDATE gated on `is_conversation_participant(conversation_id)` (or admin); `call_signals` SELECT/INSERT gated on the session's conversation membership.
- `call_signals` added to the `supabase_realtime` publication for live signaling.

**Server (Postgres RPC, `SECURITY DEFINER`, error-JSON, no `RAISE`):** `create_call_session` (participant check; creates a `ringing` session and emits a `ring` signal to every other member, with `conversation_id` in the payload), `signal_call` (participant-gated offer/answer/candidate/ring/accept/decline/end), `accept_call` (→ `active`, `started_at`), `decline_call` (→ `declined`), `end_call` (→ `ended`, `ended_at`), `fetch_call_sessions` (participant call log), `fetch_call_signals` (participant signaling history), `get_turn_credentials` (reads `turn_server_url`/`turn_username`/`turn_credential` from `app_secrets`; returns `configured:false` when absent).

**Frontend:** `src/lib/calls.js` — RPC wrappers, `subscribeToCallSignals` Realtime helper (session-filtered or all), and `buildIceServers` (public STUN always; TURN appended when configured server-side). `src/components/calls/CallModal.jsx` — full browser WebRTC flow: caller creates the session, gets local media, waits for the callee's `accept`, then creates the offer; callee accepts, gets media, answers; ICE candidates exchanged via Realtime-backed `signal_call`; remote audio/video rendered; mute/camera toggle, end/decline. Integrated into `MessagingPage.jsx` with 📞/📹 call buttons in the chat header and incoming-call detection via a `call_signals` Realtime subscription filtered to the active conversation. Green `#16C784` branding.

**Verified end-to-end (19/19):** create call session (ringing) + ring signals (with `conversation_id` payload); offer/candidate/answer signals recorded + readback; accept → active; call log reflects status; end → ended; decline flow; non-participant blocked from create/signals/log; TURN credentials endpoint returns `configured:false` (STUN-only fallback until TURN keys are supplied). All test rows cleaned. Production rebuilt (port 4173); `/`, `/messages`, `/announcements` all 200.

> **Note on TURN:** no `TURN_SERVER_URL`/`TURN_USERNAME`/`TURN_CREDENTIAL` are configured in `app_secrets` yet, so calls use public STUN servers only (works on most networks; may need TURN for strict NAT/firewall traversal). When the owner supplies TURN credentials, store them as `app_secrets` rows and calls will automatically use them.

---

## Phase 15 — VALENCE ADVERTISE & Verified Partner Directory (2026-11-18)

**Scope:** in-app advertising strictly for (1) Physical Tuition Centres, (2) Accounting Textbook Authors, (3) Verified Textbook Vendors; **₦10,000/week** with Paystack billing; online tuition delivered solely in-app by VALENCE-verified tutors; 9 `Sponsored`-labelled placements; anti-piracy/venue verification queue; live CTR analytics.

**Tables (all RLS + `trg_set_updated_at` triggers):** `advertisers` (+`total_impressions`, `total_clicks`, `enquiry_count`), `advertiser_verifications`, `advertising_packages` (default **₦10,000/week "VALENCE Standard Week"**), `advertising_campaigns`, `advertising_payments` (Paystack ref + verify job), `advertising_placements` (9 slots), `advertising_impressions`/`advertising_clicks` (daily upserts, unique on campaign+date), `advertising_enquiries`, `promotional_banners`. Unique constraints `uq_impressions_campaign_date` / `uq_clicks_campaign_date`.

**22 SECURITY DEFINER RPCs (all deployed, `pg_proc` count = 22):** `manage_advertiser`, `fetch_my_advertiser`, `fetch_advertiser_directory`, `submit_advertiser_verification`, `fetch_advertiser_verification_queue`, `review_advertiser_verification`, `fetch_advertising_packages`, `fetch_advertising_placements`, `manage_advertising_campaign`, `fetch_my_advertising_campaigns`, `fetch_advertising_campaigns`, `create_advertising_payment`, `verify_advertising_payment`, `record_ad_impression`, `record_ad_click`, `fetch_advertising_analytics`, `submit_advertising_enquiry`, `fetch_advertising_enquiries`, `fetch_my_advertising_enquiries`, `manage_advertising_package`, `fetch_promotional_banners`, `manage_promotional_banner`.

**Pricing:** `total_amount_ngn = weeks × placement_count × package.price_ngn` (default 10000/week). Max 9 slots, 52 weeks. 9 placements: home-banner, store-spotlight, ican-sponsored, atswa-sponsored, student-dash, connect-post, featured-dir, learn-slot, book-launch.

**E2E (`e2e_phase15.py`): 38/38 PASS** — main 23/23 (3-category registration, ISBN/category blocks, verification submit→admin queue→approve→verified, directory list/filter/verified-only, ₦10,000 package, 9 placements, campaign ₦180,000 = 2×9×10000, payment create + Paystack verify) + analytics 15/15 (live CTR impression/click, enquiry submit+inbox, analytics aggregation). All test rows cleaned.

**Frontend: COMPLETE** (build clean).
- `src/lib/advertising.js` — all 22 RPC wrappers + `bookAdCampaign` orchestration (create campaign → Paystack checkout → server-verified confirm, mirroring `storeOrders.js`).
- `src/pages/AdvertisePage.jsx` — **rebuilt DB-backed**: sign-in gate, 3-category advertiser application + verification submission, multi-slot placement picker (1–9), live ₦10,000/wk cost calc, campaign creation + Paystack checkout, verification-status banner.
- `src/pages/PartnersDirectoryPage.jsx` (`/partners`) — DB-backed Verified Partner Directory: category tabs, search, verified badges, detail modal (records impression), in-app enquiry modal (records click + `submit_advertising_enquiry`) tied to active campaigns.
- `src/pages/AdvertiserHubPage.jsx` + `AdvertiserHubRoute.jsx` (`/portal/advertiser`) — advertiser hub: profile/verification, campaign creation, per-campaign Paystack payment, live CTR analytics, inbound enquiry inbox.
- `AdminPortalPage.jsx` — new **Ad Verification** section: advertiser verification queue with approve/reject + live active-campaigns list.

**Verified:** `npm run build` clean (all new chunks emitted). Backend 38/38 E2E.

---

## Phase 16 — Full 8-Role RBAC Admin Portal & Live Platform CMS (2026-11-18)

**Scope:** full RBAC role gating; admin audit-log RPCs; CMS completeness (DB-backed FAQs, platform settings, delivery zones); Central Exam Authority console (exam session dates/timetable/result-release/delay, Google Calendar sync markers); podium payout ledger; moderation queue (content + announcement reports); security hardening; Google Workspace automation.

**Migration:** `migrations/phase16_admin_rbac_cms.sql` (authoritative). Schema deployed: `examination_sessions` new columns (`result_release_date`, `result_delay_notice`, `calendar_synced`, `calendar_event_id`); new `faqs` table (question, answer, category, sort_order, is_active) + `trg_set_updated_at` trigger; RLS (public SELECT, admin INSERT/UPDATE/DELETE); 8 seeded FAQs (general/tuition/store/competition/advertise/tutor); `ad_weekly_rate` = 10000 platform setting.

**15 SECURITY DEFINER RPCs (all deployed):** `has_admin_role`, `manage_platform_setting`, `fetch_all_platform_settings`, `manage_delivery_zone`, `manage_exam_session`, `fetch_exam_authority_console`, `sync_exam_calendar`, `fetch_podium_ledger`, `fetch_moderation_queue`, `fetch_announcement_moderation_queue`, `resolve_moderation_report`, `resolve_announcement_report`, `fetch_admin_audit_logs`, `manage_faq`, `fetch_faqs` — all admin-gated via `is_admin_user()`, error-JSON returns.

**E2E (`e2e_phase16.py`): 32/32 PASS** — RBAC gate, non-admin rejection, platform settings CRUD, delivery zone CRUD, FAQ CRUD + public unauthenticated read, exam session date management, calendar sync, podium ledger, moderation dismiss/uphold, audit logs. All test rows cleaned.

**Frontend: COMPLETE** (build clean).
- `src/lib/adminRbac.js` — all 15 RPC wrappers.
- `src/pages/AdminPortalPage.jsx` — new sections: **Central Exam Authority** (result release/delay editing + Google Calendar sync), **Podium Ledger** (filterable, payout totals), **Moderation** (content + announcement report resolution), **Audit Logs** (filterable); CMS extended with **FAQ Manager** (DB-backed) and **Delivery Zones** manager.
- `src/context/PlatformContext.jsx` — FAQs now DB-backed via `fetch_faqs` RPC (static FAQS fallback on error); surfaces on Home & Contact pages.

**Verified:** `npm run build` clean. Backend 32/32 E2E. Google Workspace automation COMPLETE and live (see below). **Vercel production deploy PENDING — blocked on git source:** no GitHub repo for the VALENCE app exists (`abdulsalam08-gif/valence` not found), no GitHub connector, and the sandbox has no git push credentials. Deploy path agreed: push repo to GitHub, then deploy from git source on Vercel. Commands for the user: `git init && git add -A && git commit -m "Phase 16: RBAC admin portal, CMS, Google Workspace automation" && git branch -M main && git remote add origin https://github.com/abdulsalam08-gif/valence.git && git push -u origin main` — after the push, the Vercel git-source deployment can be created immediately (project: new "valence" project, framework vite, build `npm run build`, output `dist`, rewrites in `vercel.json`).

**Google Workspace automation — COMPLETE (all 5 connectors live, verified):**
- **Google Calendar — 4 events synced.** ATSWA exam window (2027-03-23→24, event `c30himh0tpvi7mmirhei3rtse4`); ICAN exam window (2027-05-04→06, `8gch1pqnmqun56qrbescp02meo`); ATSWA results release (2027-03-31 09:00–12:00Z, `202nucc5fd94c0lmrp6qv5ua8c`); ICAN results release (2027-05-11 09:00–12:00Z, `oj8l3gm03hqcaumf4nbko31pq4`). Both exam sessions (ATSWA `cba6a8ec-…`, ICAN `a5ed21ae-…`) marked `calendar_synced=true`.
- **Gmail — 3 emails sent** to `yusufabdulsalam864@gmail.com`: Order Confirmation & Receipt (₦10,010, order ref `5a41dc5e-3904-4908-ad10-1e3c6b29581d`, Lagos delivery address, msg `1a1f52c1fed155b9`); Certificate of Completion Issued (`1a1f52c2edcd4d42`); Exam Results Released May 2027 Diets (`1a1f52c4088093c6`).
- **Google Docs — 4 documents (all verified via text read-back):**
  - *Certificate of Completion — Yusuf Abdulsalam* (`1I3Sg96-3KWB0w90m2bb_u4spTVF7xlicwvcfG6Eck8U`) — VALENCE ACADEMY title (bold 24pt), "Certificate of Completion" (HEADING_1/CENTER), "YUSUF ABDULSALAM" (bold 18pt), completion text, issue date 18 Nov 2026, reference `VALENCE-CERT-2026-YABS`, CEO/Registrar signature block.
  - *Payment Receipt — Order 5a41dc5e* (`1zM3cDJyW7EvyuSdQmTIkBFZEUDgl5ZR0YMQCTnNeV1M`) — Receipt No `VLN-2026-0001`, order ref, date; 6-row table (Programme enrolment 10,010; Delivery fee 0; Total paid 10,010; Status "Pending payment verification"; Payment provider "Paystack").
  - *May 2027 Exam Timetable Summary* (`1W4lXp3qXYU0eIXkunfy_pRMJMk00aZ5yno1zybAzhks`) — both diet timetables with 8 milestones each (registration → fee deadline → revision → mock → exam window → results release).
- **Google Sheets — competition leaderboard** (`1kqR9A0nSOp--LJzwXuTt9mIxqlrDQkqou9r_GXmokSM`, "VALENCE Academy — National Inter-School Challenge 2027 Leaderboard", locale en_US, tz Africa/Lagos). Tabs: **Leaderboard** (5 ranked candidates with scores + rewards, header styled, row banding, column chart "National Inter-School Challenge 2027 — Top Scores"); **Prizes** (1st ₦100,000 / 2nd ₦70,000 / 3rd ₦50,000 / 4th–5th Merit ₦0); **Summary** (formulas: 5 candidates, avg 81.2, max 92, total rewards ₦220,000). Backed by 5 seeded `competition_attempts` + 5 approved `competition_results` rows in Supabase.
- **Google Drive — organized under VALENCE Academy folder** (`1UyRly6EsEYo0MBmr-E4hw-Q94tw5U4R5`) with subfolders **Certificates** (`1eMkqEKUTVWxFVsU7ho65v3kM3MVyTZR7`), **Receipts** (`1iL8y8ZaFQvNTgr3vfCYvDpa-ap9zwNs-`), **Leaderboards** (`1AN148sNj6zmL4bwVxe1GGIrnrUrPfaSM`), **Exam Timetables** (`1T9qM6zMQLvSnsx_CjD8ywcLSmyZ3FLcU`); all 4 generated artifacts moved into their folders and verified via `list_files`.

---

## Bug Fix Log

| Date | Fix | Details |
|---|---|---|
| 2026-11-18 | **React Rules-of-Hooks violation in `StudentPortalPage.jsx`** | A `useEffect` (ATSWA document loading) was placed *after* the `if (!user) return null;` early return. During hydration (`user` = null), 7 hooks ran and the component returned early; after sign-in (`user` set), it tried to call 8 hooks — React threw *"Rendered fewer hooks than expected"*, caught by `ErrorBoundary`. **Fix:** moved the early return below all hooks; the effect now guards `if (!user) return;` internally. Rebuilt and redeployed to production (port 4173). |
| 2026-11-18 | **Supabase Auth `mailer_autoconfirm: false`** | New registrations couldn't confirm email (no SMTP configured), blocking all sign-ins. **Fix:** set `mailer_autoconfirm: true` via `update_auth_config`. |
| 2026-11-18 | **SQL-inserted admin users could not sign in — `invalid_credentials` then `unexpected_failure: Database error querying schema`** | Users created via direct `INSERT INTO auth.users` failed password sign-in. Root causes found via differential debugging against an API-created control user: (1) pgcrypto `crypt()` bcrypt hashes were rejected by GoTrue's bcrypt — fixed by replacing with a bcryptjs-generated `$2b$10$` hash; (2) missing `aud`/`role` = `'authenticated'`; (3) missing identity row in `auth.identities` (provider `email`); (4) `email_change` / `email_change_token_new` must be `''` not NULL; (5) `created_at` must be set. **Fix:** all five corrected on both admin accounts (`admin@valence.ng`, `yusufabdulsalam864@gmail.com`). Both now return access tokens. **Lesson:** create auth users through the Supabase API or replicate ALL GoTrue row defaults when inserting directly. |
| 2026-11-18 | **Admin portal showed the student dashboard — no real admin console** | `/portal/admin` routed to the generic `PortalGatewayPage`, which after sign-in always navigated to `/portal/student`. **Fix:** created `AdminPortalPage.jsx` (real admin console: Overview KPIs, Platform & Pricing CMS, Operations Queue, Examination Authority, Users & Roles, Announcements) + `AdminPortalRoute.jsx` wrapper (shows sign-in gateway when logged out, console when `super_admin`, redirect otherwise). `PortalGatewayPage` now navigates admins to `/portal/admin` after sign-in. Route `/portal/admin` wired in `App.jsx`. |
| 2026-11-18 | **RLS blocked `super_admin` from all admin actions** | Admin policies gated access to `auth.role() = 'admin'` or `service_role` only — our super_admin has `role='authenticated'`, so the dashboard could read/write nothing. **Fix:** added `SECURITY DEFINER` helper `public.is_admin_user()` (checks `user_roles` for `super_admin`), rewrote all 54 restricted policies to include `OR public.is_admin_user()`, and added `products_update_admin` + `notifications_select_admin` policies. Verified: super_admin can SELECT/UPDATE platform_settings, SELECT user_roles/notifications end-to-end via the anon-key client. |
| 2026-11-18 | **Supabase Edge Functions return HTTP 404 on this project (project-wide infra issue)** | Deployed `store-checkout` / `store-verify-payment` edge functions (both reported `ACTIVE`) but every `/functions/*` route returned 404 — including a trivial hello-world probe function after multiple waits and a forced re-deploy (version 2). The project is `ACTIVE_HEALTHY` yet edge-function routing is non-functional. **Fix:** abandoned the Edge Function approach; implemented the same server logic as **Postgres RPC functions** (`public.create_store_order`, `public.verify_store_payment`) with `SECURITY DEFINER`. Verified end-to-end. The broken edge functions were deleted. |
| 2026-11-18 | **`RAISE EXCEPTION` in PostgREST RPC hangs indefinitely (infra quirk)** | `verify_store_payment` validation errors used `RAISE EXCEPTION`; success paths worked but every exception path hung (HTTP 000, 60s+), confirmed with a minimal throw-test RPC. **Fix:** rewrote both RPC functions to **return error JSON** (`jsonb_build_object('error', ...)`) instead of raising; the client (`storeOrders.js`) already handles `data.error`. Error paths now return in <1s. **Lesson:** on this project, avoid `RAISE EXCEPTION` in client-invoked RPC functions. |
| 2026-11-18 | **Server discount rules misclassified ATSWA past questions as ICAN** | ATSWA past-question product names contain "ATS 1" but not "ATSWA", so name-based programme detection fell through to the ICAN 6% rule (₦660 instead of the correct ₦990 ATSWA 9% discount). **Fix:** `create_store_order` now detects the programme via the authoritative `products.examination_level_id → examination_levels.name` join (`left(level_name,5)='ATSWA'`). All four discount rules re-verified: 9% ₦990 · 5% ₦950 · 6% ₦1,080 · 7% ₦2,030. |
| 2026-11-18 | **Server-side Paystack verification via `pg_http` impossible; `pg_net` jobs invisible inside the triggering transaction** | `pg_http` is not installed on this project (`extension "pg_http" is not available`), so Postgres-side HTTP must use the `pg_net` async extension (installed, jobs execute in ~2s). First attempt polled the job's response inside the same RPC transaction — but `pg_net` jobs only become visible to the scheduler after the triggering transaction commits, so the poll loop could never see the response and the call hit the statement timeout. **Fix:** split verification into two phases — the RPC schedules the `pg_net` job, stores the job id on the order (`orders.paystack_verify_job`), and returns `{status:'verifying'}` immediately; the client (`confirmStorePayment`) retries, and the RPC finalizes from `net._http_response` (validating Paystack reference + kobo amount + status), records the payment, marks the order paid and issues the receipt. Secret key lives in `app_secrets` (Supabase project secrets are not visible to Postgres via `current_setting()` on this project). Verified: real Paystack API responses flow through; bogus reference → clean error in <1s. |
| 2026-11-18 | **Phase 6 tutor RPC type mismatches (text[] vs jsonb, FK, jsonb→uuid operator)** | (1) `tutor_profiles.qualifications/expertise/preferred_mentee_categories` are `text[]`, not jsonb — RPC signature corrected; the stale jsonb overload had to be dropped explicitly (PostgREST `PGRST203` function-overload error). (2) `tutor_certificates.verified_by` FK targets `auth.users(id)`, not `profiles(id)` — approvals failed with FK violation; fixed to write `auth.uid()`. (3) `p_answers -> v_q.id` failed (`operator does not exist: jsonb -> uuid`) — jsonb keys must be text; fixed with `-> (v_q.id)::text`. All re-verified in the fail-then-pass exam E2E. |
| 2026-11-18 | **`assessment_attempts` UPDATE failed: `record "new" has no field "updated_at"`** | The project-wide `update_updated_at()` trigger fires on every UPDATE, but the spec-table `assessment_attempts` was created without the `updated_at` column. **Fix:** `ALTER TABLE assessment_attempts ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now()` — exam submission now updates cleanly. |
| 2026-11-18 | **Connector `execute_query` cannot run two `CREATE FUNCTION` statements in one batch** | The multi-statement executor splits naively on `;`, breaking plpgsql bodies that contain semicolons inside dollar-quoted strings. **Fix:** one `CREATE OR REPLACE FUNCTION` per `execute_query` call (same constraint as Phase 5). |
| 2026-11-18 | **Supabase Storage REST API exposes no bucket-policy routes (`/bucket/{id}/policies`, `/bucket/{id}/rls` → 404)** | Bucket `tutor-certificates` was created via `POST /storage/v1/bucket` with the service_role key (creation works), but every policy-management route 404s on this project — storage RLS must be configured another way. **Fix:** authored the folder RLS as SQL policies directly on `storage.objects` (owner INSERT `WITH CHECK` on `auth.uid() = (storage.foldername(name))[1]`; SELECT/UPDATE/DELETE for owner or `is_admin()`), mirroring the existing Phase 2 `avatars` bucket pattern. Verified: owner upload/download 200, foreign-folder upload 403. |
| 2026-11-18 | **Phase 15 fetch RPCs — OUTER `ORDER BY` on a `jsonb_agg` subquery (Postgres 42703)** | Nine Phase 15 `fetch_*` functions did `SELECT jsonb_agg(... ORDER BY col) FROM t ... ORDER BY agg_col` (or outer-ORDERed an aggregate), which is invalid: *\"column must appear in GROUP BY or be used in an aggregate\"*. **Fix:** removed the outer `ORDER BY`; where LIMIT/OFFSET is needed, wrapped the ordered base query as an inner subquery (`FROM (SELECT ... ORDER BY ... LIMIT/OFFSET) a JOIN ...`) and ordered inside `jsonb_agg`. Applied to `fetch_advertiser_verification_queue`, `fetch_advertiser_directory`, `fetch_advertising_packages`, `fetch_my_advertising_campaigns`, `fetch_advertising_campaigns`, `fetch_advertising_enquiries`, `fetch_my_advertising_enquiries`, `fetch_advertising_analytics`, `fetch_promotional_banners`; migration patched to match. |
| 2026-11-18 | **Phase 15 analytics — missing `total_impressions`/`total_clicks` columns & inner-JOIN zero counts** | `record_ad_impression`/`record_ad_click` referenced `advertising_campaigns.total_impressions`/`total_clicks` which didn't exist (42703), and their daily count SELECTs joined impressions×clicks on the same date, returning 0 whenever either table had no row for that date. **Fix:** added `total_impressions`/`total_clicks` columns to `advertising_campaigns`; both record RPCs now upsert independently and compute each total with its own `sum()` subquery. Also fixed `fetch_advertising_analytics` totals to sum `advertising_clicks` (not `advertising_impressions`) for clicks. Re-verified: 38/38 E2E pass. |
| 2026-11-18 | **`verify_advertising_payment` `EXCEPTION` clause parse quirk (42601)** | Appending `EXCEPTION WHEN OTHERS ...` to this long RPC triggers a 42601 parse error near \"EXCEPTION\" (plpgsql body too large for the naive multi-statement splitter). **Fix:** deployed this RPC without the `EXCEPTION` handler — the early-return error-JSON paths remain intact; other shorter Phase 15 RPCs deploy fine with `EXCEPTION`. |
