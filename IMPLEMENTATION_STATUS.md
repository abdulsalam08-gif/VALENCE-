# VALENCE — Master Implementation Roadmap & Status

**Operator:** AAG PROFESSIONAL SERVICES  
**Official Tagline:** *Vita sine litteris mors est.*  
**Visual System:** Dark Fintech (`#0B0E11` obsidian base, `#16C784` emerald primary, `#EA3943` crimson alert, `Space Grotesk` + `Inter`, rounded elevated surfaces, glassy navbar, responsive mobile bottom navigation, toasts, shimmer skeletons, animated counters, custom VALENCE emblem).  
**Infrastructure:** React + Vite + JavaScript + Tailwind CSS + Lucide React · **Supabase** (fresh project: PostgreSQL, Auth, Storage, RLS, Realtime, Edge Functions) · **Vercel** (fresh project deployment & serverless routing) · **Paystack** (exclusive online checkout) · **OpenAI API** (server-side AI Tutor) · **Google Meet / Google Calendar** (authorised live classes).

---

## 16-Phase Tracker

| Phase | Scope | Status |
|---|---|---|
| **Phase 1** | Brand logo, dark-fintech design system, glassy navbar + mobile bottom nav, complete 19-section Homepage, About Us, Programmes hub, full ATSWA page & live tuition calculator, dedicated ICAN Foundation/Skills/Professional pages & live calculator + Exemption Guidance Tool, Services + 7-step AI sample, Study Materials, interactive Marketplace preview (all 24 products + exact discount & free-delivery engine), Connect, Competitions, Opportunities, Tuition Centres Directory, Advertise, Contact + prefilled WhatsApp widget, role-adaptive Portal Gateways | **Completed** |
| **Phase 2** | Fresh Supabase project provisioning, core PostgreSQL schema & migrations, Supabase Auth, all 7 user categories, role-based access & RLS policies | Next (awaiting go-ahead) |
| **Phase 3** | User profiles, client-side image crop/resize/WebP optimisation, Supabase Storage buckets, profile pictures & galleries, privacy settings, open community announcement composer, 7 audience scopes, likes/comments/replies/bookmarks/shares, reporting & moderation | Pending |
| **Phase 4** | Database-backed ATSWA & ICAN academic programmes, admin-configurable fees/discounts, unique one-time ₦3,000 level unlocks, exam diet calendar (March/Sept vs May/Nov) & enrolments | Pending |
| **Phase 5** | VALENCE LEARN Student Portal (dashboard, reading tracker, study-hour streaks, readiness index, authorised Google Meet classrooms, assignments, attendance, video playlists, PDF textbooks, notifications) | Pending |
| **Phase 6** | Tutor recruitment & portal (AAT for ATSWA; compulsory AAT + ACA for ICAN, private certificate storage, manual verification, timed 20Q/45-min assessment, rate requests, strict financial data isolation) | Pending |
| **Phase 7** | Master Administrative Dashboard (8+ granular admin roles, all admin modules, official announcements, reports, community moderation & immutable audit logs) | Pending |
| **Phase 8** | Secure server-side Paystack integration (init, verify, HMAC webhook, idempotency, receipts, unlocks, tuition, store & ad payments — requires Paystack keys) | Pending |
| **Phase 9** | VALENCE AI Accounting Tutor (secure server-side OpenAI Edge Function, 7-step exam workings format, quotas, usage logs & admin controls — requires OpenAI API key) | Pending |
| **Phase 10** | VALENCE CONNECT full realtime features (user discovery, connection requests, Supabase Realtime 1:1 & group chat + attachments, study groups, 12 discussion forums, mentorship, professional events, WebRTC voice/video calls) | Pending |
| **Phase 11** | VALENCE COMPETE — National Accounting Challenge (institution profiles, team management, 6 divisions, 5 rounds, server-timed autosave exam engine for ATSWA & ICAN formats, auto + rubric theory marking, moderator review, appeals, verified leaderboards & digital certificates) | Pending |
| **Phase 12** | VALENCE PROFESSIONAL portal (verified ACA/FCA/ACCA/CPA profiles, CPD resources, mentorship workflows, webinars, speaking & collaboration) | Pending |
| **Phase 13** | VALENCE MARKETPLACE backend completion (live DB inventory, PDF textbook management, order lifecycle `Unpaid → Delivered`, free & configurable delivery zones) | Pending |
| **Phase 14** | VALENCE ADVERTISE platform (advertiser onboarding & verification, Tuition Centres Directory, packages, 9 placements, campaign lifecycle, impression/click/CTR analytics) | Pending |
| **Phase 15** | Opportunities portal applications, National Accounting League, Battle Arena (1v1/2v2/daily puzzles), Campus Ambassador Programme & Accounting Hall of Fame | Pending |
| **Phase 16** | Full QA across all business/security rules, accessibility & mobile performance audit, fresh Vercel production deployment, Admin Guide, User Guide & Testing Documentation | Pending |
