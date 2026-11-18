# VALENCE Supabase Architecture & Security Overview (Phase 2)

- **Project Name:** `valence-platform`
- **Project Ref:** `gdgeogzmrvxtwdqtlwbu`
- **Region:** `eu-west-1`
- **Project URL:** `https://gdgeogzmrvxtwdqtlwbu.supabase.co`
- **Extensions:** `pgcrypto`, `citext`
- **Total Public Tables:** `99` (`99 / 99` with Row Level Security enabled; `0` tables without RLS)
- **Active RLS Policies:** `230` across `public` and `storage.objects`
- **Security Definer Helpers:** All pinned with `SET search_path = public` (`is_admin`, `has_admin_role`, `has_unlocked_level`, `is_blocked_between`, `is_study_group_member`, `can_view_announcement`, `is_conversation_participant`, `handle_new_auth_user`, `guard_profile_privileged_fields`, `set_updated_at`, `generate_ticket_ref`)

---

## Applied Migrations

1. **`v01_core_identity_rbac_and_settings`** (Tables 1 to 8 + 14 domain enums + triggers)
   - Enums: `user_account_type` (7 roles), `admin_role_type` (8 RBAC roles), `verification_status`, `programme_code`, `institution_category`, `payment_status`, `payment_purpose`, `order_fulfilment_status`, `advertiser_category`, `campaign_status`, `announcement_scope` (7 scopes), `ticket_status`, `call_status`, `competition_status`.
   - Tables: `platform_settings`, `nigerian_institutions` (300 seeded), `profiles`, `admin_role_assignments`, `user_privacy_settings`, `user_gallery_photos`, `notifications`, `audit_logs`.
   - Anti-escalation trigger `guard_profile_privileged_fields()` stops non-admins from elevating `account_type`, `is_verified_tutor`, `is_verified_professional`, `is_verified_advertiser`, `is_school_rep` or `is_suspended`.
   - Auth signup trigger `on_auth_user_created` auto-provisions `profiles` + `user_privacy_settings`.

2. **`v02_cms_academics_exam_authority_and_tuition`** (Tables 9 to 26)
   - Dynamic CMS & Legal: `motivational_quotes` (30 seeded), `page_ticker_notices` (33 notices across 18 route groups), `platform_faqs` (14 seeded), `legal_documents` (4 Paystack/NDPA documents), `support_tickets`.
   - Academics & Central Exam Authority: `examination_levels` (6), `syllabus_courses` (27 revised ATSWA + ICAN courses), `exam_diet_schedules` (5), `exam_timetables` (13), `exam_result_releases` (5), `exemption_rules` (9), `atswa_guidance_requests`, `atswa_guidance_documents`.
   - Tuition & Per-Level Cost Unlock: `student_fee_unlocks` (permanent ₦3,000 per-level unlock), `tuition_enrolments`, `live_class_sessions` (Google Meet URL gated to verified enrolled students, assigned tutor & admins), `live_class_attendance`, `learning_resources`.

3. **`v03_payments_store_tutors_and_study_tools`** (Tables 27 to 49)
   - Paystack Financial Engine: `payment_transactions`, `paystack_webhook_events` (idempotency log), `payment_receipts`.
   - Bookstore & Express Dispatch: `delivery_zones` (10 zones: same-day Lagos & 1-day outside Lagos for Past Questions; Study Packs delivered when available; 3 free campus corridors covering LASU, Ojo, UNILAG, YABATECH, FCE & Yaba), `store_products` (45 items: 27 Past Questions + 18 Study Packs with Admin-updated live `is_available`, `availability_status`, `availability_note` & `delivery_note`; 42 distinct course cover JPEGs), `store_carts`, `store_orders`, `store_order_items`, `store_material_enquiries` (with `notify_on_restock`).
   - Verified Tutors: `tutor_applications`, `tutor_credentials`, `tutor_exam_questions` (answer keys restricted to admin/server), `tutor_exam_attempts` (20 questions, 45 minutes), `verified_tutor_profiles` (0 fake rows), `tutor_course_assignments`.
   - 15-Tool Study Suite & Server AI Tutor: `study_plans`, `syllabus_progress`, `study_sessions_log`, `student_notes`, `flashcard_decks`, `practice_quiz_attempts`, `ai_tutor_conversations`, `ai_tutor_messages`.

4. **`v04_community_announcements_messaging_calls_and_pro`** (Tables 50 to 75)
   - Community & Moderation: `user_follows`, `user_blocks`, `study_groups`, `study_group_members`, `forum_categories` (12 seeded), `forum_threads`, `forum_replies`, `content_reports`.
   - 7-Scope Announcements: `announcements` (server-enforced `can_view_announcement()` across `public`, `connections`, `study_group`, `institution`, `programme`, `course`, `professional`), `announcement_likes`, `announcement_comments`, `announcement_bookmarks`, `announcement_reposts`.
   - Realtime Messaging & WebRTC Calling: `conversations`, `conversation_participants`, `direct_messages`, `message_read_receipts`, `call_sessions`, `call_signals`.
   - Professional Hub, Events & Opportunities: `professional_verifications`, `mentorship_profiles`, `mentorship_requests`, `platform_events` (4 seeded), `event_registrations`, `opportunities` (0 fake rows), `opportunity_bookmarks`.

5. **`v05_competitions_advertise_storage_and_realtime`** (Tables 76 to 99 + Storage + Realtime)
   - VALENCE National Inter-School Challenge (Accounting & Related Fields + ₦50,000 Merit Reward): `competition_divisions` (6), `competitions` (flagship 2027 edition seeded), `competition_schools`, `competition_teams`, `competition_registrations`, `competition_rounds` (5 official stages), `competition_questions` (answer keys protected), `competition_attempts`, `competition_answers`, `competition_leaderboard_entries`, `arena_matches`, `competition_certificates`, `competition_appeals`, `competition_rewards` (audited ₦50,000 payout ledger), `hall_of_fame_entries`.
   - VALENCE ADVERTISE (₦10,000/week) & Option B Textbook Flow: `advertiser_profiles` (`physical_centre`, `textbook_author`, `textbook_vendor`), `tuition_centres` (physical venues only; 0 fake rows), `tuition_centre_fee_schedules` (RLS-gated behind `has_unlocked_level(level_id)` so centre cost implications are only readable by students who unlocked that level, the owning centre, or admins), `textbook_advertisers` (0 fake rows), `ad_placements` (9 slots at ₦10,000/week), `ad_campaigns`, `ad_analytics_events`, `partner_enquiries`, `partner_book_orders`.

---

## Storage Buckets (6)

- **Public:** `avatars` (5 MB), `community-media` (10 MB), `certificates-public` (10 MB)
- **Private (RLS folder-isolated):** `verification-docs` (15 MB), `learning-vault` (25 MB), `message-attachments` (15 MB)

## Realtime Publication (`supabase_realtime`)

`announcements`, `call_sessions`, `call_signals`, `direct_messages`, `exam_diet_schedules`, `exam_result_releases`, `notifications`, `page_ticker_notices`, `platform_settings`, `store_products`
