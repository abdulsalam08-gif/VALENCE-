# VALENCE — COMPLETE MASTER DEVELOPMENT SPEC (authoritative)

> Working source of truth. Rebuilt from Phase 1 with the adjustments established in chat (see APPLIED ADJUSTMENTS at the end).

## VALENCE

**AAG PROFESSIONAL SERVICES**
Official Tagline: Vita sine litteris mors est.

Project: VALENCE – A Complete Accounting Education, Professional Development, Networking, Competition and Learning Ecosystem.
Operating Organisation: AAG PROFESSIONAL SERVICES.

---

### 1. PROJECT VISION AND OBJECTIVES

Build VALENCE, a comprehensive, modern, secure, scalable and production-ready educational and professional platform operated by AAG PROFESSIONAL SERVICES.

Serves: ATSWA students; ICAN Foundation/Skills/Professional students; university & polytechnic accounting students; chartered accountants & professionals; accounting tutors & tuition centres; general accounting learners.

Major pillars:
- VALENCE LEARN — tuition, academic learning, resources, AI assistance, exam prep.
- VALENCE CONNECT — networking, messaging, announcements, profile sharing, study groups, mentorship.
- VALENCE COMPETE — accounting competitions, academic challenges, inter-school tournaments.
- VALENCE PROFESSIONAL — professional networking, career development, CA profiles, industry engagement.
- VALENCE MARKETPLACE — books, textbooks, past questions, study packs, educational materials.
- VALENCE ADVERTISE — paid advertising for verified tuition centres & educational service providers.
- VALENCE OPPORTUNITIES — scholarships, internships, jobs, training, professional development.

The final product must be a real, working application — not a frontend demo, static site or UI prototype. All major features connect to a functional backend, database, auth, payment infrastructure and admin dashboard.

### 2. BRANDING AND VISUAL IDENTITY

Premium academic and professional design.
- Brand name: VALENCE. Operator: AAG PROFESSIONAL SERVICES. Tagline: Vita sine litteris mors est.
- Positioning: Academic excellence, professional growth, collaboration, innovation.
- Colour palette: **Deep black, Mustard gold, White, Charcoal, Professional grey.**
- Modern, elegant, premium, professional. Responsive (mobile/tablet/desktop). Clean navigation. Excellent typography. Consistent spacing and visual hierarchy. Accessible buttons/forms/navigation. Appropriate animations/transitions. Professional dashboards. Lucide icons. Clear loading, empty, error and success states.
- Consistent design system throughout. Must feel like a serious educational/professional institution, not an ordinary social media app.

### 3. TECHNOLOGY STACK AND ARCHITECTURE

Frontend: React, Vite, JavaScript, Tailwind CSS, Lucide React icons.
Backend: Supabase, PostgreSQL, Supabase Auth, Supabase Storage, Supabase RLS, Supabase Realtime.
Hosting: (adjustment: deployed on Vercel with git-source CI/CD — see APPLIED ADJUSTMENTS).
Payment: Paystack exclusively.
AI: OpenAI API via secure server-side functions.
Online classes/meetings: Google Meet integration — **(ADJUSTMENT: REMOVED per user directive; call feature removed completely).**
Security: Never expose Supabase service-role keys, Paystack secret keys, OpenAI API keys or other private credentials. Sensitive operations run through secure server-side functions. Use env vars and complete deployment config.

### 4. WEBSITE STRUCTURE AND NAVIGATION

Public nav: Home, About Us, Programmes, Services, Study Materials, Store, VALENCE Connect, Competitions, Opportunities, Tuition Centres, Advertise on VALENCE, Contact.
Prominent buttons: Student Portal, Professional Portal, Join VALENCE Connect, Apply as a Tutor, Register for Competitions, Advertise Your Tuition Centre, Admin Portal Login.
Navigation adapts to auth status and role.

### 5. HOMEPAGE

Headline: "Your Learning. Your Connections. Your Competition. Your Professional Future."
Supporting copy: VALENCE is your complete learning and professional development community for ICAN and ATSWA candidates, tertiary students, chartered accountants, accounting tutors and aspiring professionals. Access structured learning, intelligent study tools, professional networking, academic competitions, educational resources and career opportunities in one place.

Sections: 1. Hero. 2. About VALENCE. 3. VALENCE LEARN. 4. ICAN programmes. 5. ATSWA programmes. 6. University/tertiary learning. 7. VALENCE CONNECT. 8. VALENCE NATIONAL ACCOUNTING CHALLENGE. 9. VALENCE PROFESSIONAL. 10. Featured tuition centres & sponsored ads. 11. VALENCE MARKETPLACE. 12. Latest opportunities. 13. Featured tutors. 14. Upcoming classes & events. 15. Community announcements. 16. Testimonials. 17. Statistics & achievements. 18. FAQs. 19. Contact & footer.
Homepage content must be dynamic and admin-controlled.

### 6. USER CATEGORIES AND REGISTRATION

A. Professional examination students — ATSWA, ICAN Foundation, ICAN Skills, ICAN Professional. Access relevant programmes, courses, exams, tuition, learning.
B. University & polytechnic students — register even if not ICAN/ATSWA. Eligible disciplines: Accounting, Finance, Banking & Finance, Business Administration, Economics, Taxation, Auditing, Public Administration, Management, Entrepreneurship, Business Education, related. General accounting lessons, discussions, study groups, competitions, practice questions, AI, mentorship, guidance, opportunities. Do NOT auto-grant access to restricted ICAN/ATSWA materials.
C. Chartered accountants & professionals — ACA, FCA, ACCA, CPA, other. Professional profiles, credential verification, networking, mentorship, events, discussions, CPD resources, opportunities, tutor recruitment. Only verified qualifications get verified badges.
D. General accounting learners — financial literacy, bookkeeping, business accounting, personal finance, introductory taxation, basic financial management.
E. Tutors — separate application, verification, portal.
F. Tuition centres & educational advertisers — separate advertiser registration under VALENCE ADVERTISE.
G. Institutions — universities, polytechnics, colleges apply for institutional profiles and join competitions.

### 7. USER PROFILES, PROFILE PICTURES AND PERSONALISATION

Every registered user has a personal profile regardless of category.
Profile info: display name, username, profile photo, cover photo, biography, user category, institution, programme, exam level, courses, professional qualifications, skills, interests, experience, location, website/social links, privacy settings. Only collect necessary info.

Profile picture uploads: upload, change, remove, preview before publishing, crop/reposition, gallery uploads, captions, visibility selection, delete own. JPG/JPEG/PNG/WebP. Auto-resize/optimise. Supabase Storage with proper permissions. File-size limits, validation, upload security. Users edit/delete own; moderators intervene for violations.

Profile visibility: public vs connections-only; profile picture visibility; gallery visibility; institution/qualification display; connection request permission; appear in searches. Never expose private info without permission.

Verified badges: approved tutors, verified CAs, verified professionals, verified institutions, approved tuition centres. Badge only after verification.

### 8. ATSWA PROGRAMME

ATS 1 courses: Basic Accounting Processes and Systems (BAPS), Economics, Communication Skills, Business Law.
Fees: ICAN registration ₦13,400; tuition ₦20,000/course; 25% discount per course when selecting 2+; max tuition all four ₦60,000; full exam fee ₦39,500; annual subscription ₦7,000.
Required docs: passport photo, O'Level result, birth certificate.

ATS 2 courses: Public Sector Accounting (PSA), Financial Accounting (FA), Information Technology (IT), Quantitative Analysis (QA).
Fees: tuition ₦20,000/course; 25% discount 2+; max all four ₦60,000; full exam fee ₦43,000; annual subscription ₦7,000.

ATS 3 courses: Cost Accounting, Audit, Management, Taxation.
Fees: tuition ₦20,000/course; 25% discount 2+; max all four ₦60,000; full exam fee ₦43,000; annual subscription ₦7,000.

ATSWA registration/unlocking: unlock fee ₦3,000 per ATSWA level; each level unlocked separately; pay once per level; successful payment permanently unlocks; never charge twice for an unlocked level; unlock fee credited/waived as tutorial registration fee; unlocking grants access to fee details and enrolment; tuition registration+payment before joining classes; other official fees paid per deadlines. (Online tuition payment unlocks authorised class access — ADJUSTMENT: class access without Meet/call.)

### 9. ICAN PROGRAMME

Foundation: Corporate & Business Law (CBL), Business Environment (BE), Management Accounting (MA), Financial Accounting (FA).
Skills: Financial Reporting (FR), Financial Management (FM), Public Sector Accounting & Finance (PSAF), Audit Assurance & Forensics (AAF), Taxation (TAX), Performance Management (PM).
Professional: Strategic Business Reporting (SBR), Case Study (CS), Advanced Audit Assurance & Forensics (AAAF), Advanced Taxation (A/TAX), Strategic Financial Management (SFM).

ICAN tuition: online ₦40,000/course; 25% discount when 3+ courses in same transaction.
1→₦40,000; 2→₦80,000; 3→₦90,000; 4→₦120,000; 5→₦150,000; 6→₦180,000. Discount only on eligible tuition, not official fees/unlock/materials/delivery.

ICAN unlocking: ₦3,000/level; separate per level; unlocking one doesn't unlock another; permanent record; unlock fees don't offset official registration/subscription/exam fees.

Physical tuition: via WhatsApp enquiries, not online checkout. Official ICAN fees via WhatsApp assistance. WhatsApp: +234 915 434 4663. Buttons for registration, exam fee, annual subscription, physical tuition. Prefilled messages (name, level, category). Admins can change WhatsApp number.

ICAN exemption guidance tool: inputs (qualification, institution, graduation year, course, professional qualifications, exam history, documents) → outputs (potential exemptions, remaining courses, conditions, guidance, next steps). Editable mapping. ICAN makes final decision. Never auto-remove a course from enrolment.

### 10. EXAMINATION DIET AND SESSION MANAGEMENT

Admin-managed examination calendar (no hardcoding). ATSWA diets: March, September. ICAN diets: May, November. March 2027 as initial upcoming ATSWA session. ICAN May/Nov configurable.

Admin: create/edit sessions, publish/unpublish, set registration open/close, exam dates, fee deadlines, tuition commencement, revision periods, mock exam dates, class schedules, archive completed. Retain historical.

Student session selection at enrolment: programme, level, courses, intended diet, exam year. Prevent enrolment into closed sessions unless admin override.

Student dashboard: next diet, countdown, registration deadline, payment deadlines, tuition timeline, upcoming classes, mock dates, learning progress, exam readiness. Deadline reminders/notifications. Distinguish ATSWA March/Sep from ICAN May/Nov.

### 11. VALENCE LEARN — STUDENT LEARNING ENVIRONMENT

Student dashboard: name, photo, programme category, institution, exam level, registered courses, exam session, unlock status, tuition payment status, upcoming classes, learning progress, study hours, reading streak, exam readiness score, announcements, upcoming competitions, recommended study groups, opportunities.

Learning tools: reading tracker, topic/chapter completion, study-hour tracker, daily/weekly targets, reading streaks, progress %, practice questions, mock exams, exam readiness indicators, video lessons, textbook library, downloadable resources, assignments, class attendance, learning notifications. (Exam readiness = educational indicator, not official result prediction.)

Classroom: programme, level, course, tutor, schedule, (Meet link — ADJUSTMENT: removed), attendance, announcements, resources, assignments. Only authorised students access.

Video library: organise by programme/level/course/tutor/topic. Admins add/manage YouTube links & playlists.

Soft-copy resources: button → https://icanig.org/students/atswa (new tab).

### 12. VALENCE AI ACCOUNTING TUTOR

AI assistant supporting ATSWA, ICAN Foundation/Skills/Professional, university accounting, general.
Answer format: interpret question → identify topic → explain principles/standards → step-by-step calculations → final answer → exam presentation → common mistakes. Professional exam-style workings.
Security: OpenAI via server-side functions, never expose key in frontend, usage limits, admin controls, usage tracking, error handling, abuse prevention.

### 13. VALENCE CONNECT — LEARNING AND PROFESSIONAL NETWORK

A. User discovery & connections: search, discover by institution/programme/level/courses/qualifications, connection requests, accept/reject, follow, view permitted public profiles.

B. Community announcements & publishing: EVERY registered user can create/publish announcements (not restricted to admins/tutors/professionals). Publishers: all categories. Types: academic, study group, exam updates, competition, professional achievements, career opportunities, events, seminars/workshops, educational info, learning tips, general updates.
Composer: title, content, pictures, links, category, audience, preview, publish, draft, edit own, delete own, engagement/responses.
Audiences: public, connections-only, study-group, institution, programme, course, professional. Enforce visibility server-side.
Feed: discover by recent/connections/institution/programme/course/study group/professional interests/categories. Show publisher photo, name, category, verified badge.
Engagement: like, comment, reply, share in-app, bookmark, report. Notify on engagement.
Official vs community: community = all users; official = admins only (platform notices, exam deadlines, payment instructions, results, policy updates, org comms). No impersonation. Clearly distinguish.

C. Profile pictures & photo sharing: upload/change/remove profile pic, gallery, captions, preview, visibility, delete own, attach to announcements, share in groups. JPG/JPEG/PNG/WebP. Optimise. Supabase Storage. Limits/validation/security. Only modify/delete own unless moderation.

D. Notifications: comment, like, reply, connection publishes, study group member publishes, institution publishes, connection request, request accepted. Configure preferences.

E. Private messaging: 1:1 text, group, image attachments, document attachments, voice notes (ADJUSTMENT: voice notes retained as messaging, but NO calls), message notifications, history, read status, blocking, reporting. Supabase Realtime. Secure attachments.

F. Voice and video calls: **(ADJUSTMENT: REMOVED COMPLETELY per user directive — no call_sessions, no WebRTC, no Meet.)**

G. Study groups: create/join by ICAN level, ATSWA level, course, institution, exam session, university discipline, professional interests. Group: name, description, admin, members, announcements, messages, shared resources, practice questions, meeting schedules, (call functionality — removed). Public/private/approval-based.

H. Academic discussion forums: Financial Accounting, Management Accounting, Taxation, Audit, Financial Reporting, Public Sector Accounting, Financial Management, Economics, Business Law, University accounting, Examination techniques, Career development. Posts, comments, replies, likes, bookmarks, reporting.

I. Mentorship: qualified accountants/professionals offer mentorship. Mentor profiles: qualifications, expertise, experience, hours, preferred mentee categories. Students submit requests. Admin oversight.

J. Professional events: admins/organisers create webinars, seminars, revision workshops, career sessions, guest lectures, networking, training. Registration, capacity, dates, venues, meeting links.

### 14. VALENCE COMPETE — NATIONAL ACCOUNTING CHALLENGE

Flagship: VALENCE NATIONAL ACCOUNTING CHALLENGE / VALENCE INTER-SCHOOL ACCOUNTING CHALLENGE.
Divisions: ATSWA Challenge, ICAN Foundation Challenge, ICAN Skills Challenge, ICAN Professional Challenge, University Accounting Challenge, optional Professional Accounting Challenge. Don't mix levels.

Institutional profiles: name, logo, location, description, representative, verification status, participating students, history, achievements. Verify affiliation.

Competition teams: captain, assistant captain, members, school rep, category, registered level, status. Students request to join institution's team.

Structure: individual, team, institution-vs-institution, regional, national. Configurable rounds: preliminary, institutional qualifier, regional qualifier, national semifinal, grand finale.

ATSWA format: Section A 30 MCQs; Section B 20 short-answer; Section C 6 theory (answer 4, 12.5 marks each = 50 marks). Sections A/B marks configurable for total.

ICAN format: Section A 30 marks compulsory; Section B 3 theory (answer 2, 20 marks each); Section C 4 theory (answer 2, 15 marks each). Total A 30 + B 40 + C 30 = 100. Seven theory questions, four selected answers + compulsory Section A. Configurable counts/marks/types/rules. Academic review against current ICAN syllabus before publishing.

Examination engine: timed, question randomisation, option randomisation, section navigation, selection rules, autosave, server-controlled countdown, auto-submit, reconnection, duplicate prevention, objective auto-marking, manual theory marking, rubrics, moderator review, appeals, results approval. Preserve answers during interruptions. AI may suggest marks but human markers final.

Leaderboards: individual, institution, regional, national, programme, level. Only verified results affect rankings.

Admin: create competitions, select divisions, configure dates, durations, manage questions, assign markers, verify schools, approve participants, monitor exams, publish results, manage appeals, issue certificates.
Statuses: Draft, Registration Open, Registration Closed, Upcoming, Ongoing, Marking, Results Pending, Completed, Archived.

Practice centre: timed/untimed practice, topic-based, question banks, instant objective feedback, worked solutions, performance history, group practice.

Grand finale: branding, schools, finalists, schedules, scoreboards, registration, winners, digital certificates, awards, photos, reports. Physical & online.

### 15. ADDITIONAL COMPETITION AND COMMUNITY FEATURES

VALENCE NATIONAL ACCOUNTING LEAGUE — annual institutional season with qualifiers, regional, national group stages, semifinals, grand finale. Recurring monthly competitions.

VALENCE BATTLE ARENA — 1v1 battles, 2v2, school-vs-school, subject speed rounds, daily puzzles, weekly challenges, points, badges, rankings. Speed not the only factor.

VALENCE CAMPUS AMBASSADOR PROGRAMME — apply to represent VALENCE; promote, recruit, organise study groups, coordinate competitions/events. Certificates, recognition, incentives.

VALENCE ACCOUNTING HALL OF FAME — national champions, outstanding students, tutors, professionals, ambassadors. Only verified achievements.

### 16. VALENCE PROFESSIONAL

Professional profiles, verified qualifications, networking, industry discussions, mentorship, CPD resources, career opportunities, webinars, seminars, events, tutor recruitment, speaking, collaboration, professional announcements. Connect with students subject to privacy/rules.

### 17. TUTOR RECRUITMENT AND MANAGEMENT

ATSWA tutor: minimum AAT (or accepted higher relevant qualification).
ICAN tutor: BOTH AAT AND ACA (compulsory).
Certificate verification: upload required certs; admins verify authenticity; uploading never auto-approves; store in private Supabase Storage.
Application statuses: Draft, Submitted, Pending Verification, Approved, Rejected, Suspended.
Tutor assessment: 20 questions, 45-min, randomised, question bank, auto-submit, configurable pass score, limited attempts, attempt records, cooldown. Tab-switch/paste = integrity signals, not conclusive.
Tutor portal: profiles, assigned programmes/levels/courses, student groups, class schedules, (Meet links — removed), resources, assignments, tutor community, announcements, approved rate requests. Tutors must NOT access student financial records, tuition pricing, checkout or financial reports. Must NOT change official class schedules.

### 18. VALENCE MARKETPLACE — STORE AND EDUCATIONAL MATERIALS

ATSWA hard-copy past questions ₦5,500/copy; 9% discount for 2+.
ATSWA study packs ₦9,500/pack; 5% discount for 2+.
ICAN past questions ₦9,000/copy; 6% discount for 2+.
ICAN study packs: FM ₦13,500; FR ₦15,500; PM ₦15,500; PSAF ₦15,000; AAF ₦13,000; TAX ₦13,500; SBR ₦15,500; SFM ₦15,500; CS ₦12,000; A/TAX ₦13,000; AAAF ₦13,000; FA ₦12,500; MA ₦13,000; BE ₦13,000; CBL ₦10,000.
ICAN study pack discount: 7% when purchasing 2+ different ICAN study packs in same transaction, across all ICAN levels (Foundation/Skills/Professional). Only eligible different-course packs. Not on past questions/ATSWA/tuition/unlock/official fees/delivery. Admin-configurable.

Textbook library: admins upload PDFs, covers, descriptions, titles, course info; assign access; replace/delete. Secure storage + authorised download.

Store & orders: product listings, details, quantities, cart, auto discount, subtotal, delivery fees, total, Paystack checkout, confirmation, tracking, history.

Delivery: free delivery — LASU, Ojo, UNILAG, YABATECH, FCE, Yaba. Other locations use admin-configurable zones/prices.

### 19. PAYMENT PROCESSING — PAYSTACK ONLY

Paystack is the exclusive online checkout/payment method throughout. WhatsApp is NOT an alternative online checkout. Applies to tuition, unlocking, store, advertising, competition fees, other paid services. WhatsApp for enquiries/support/ICAN official fee assistance/physical tuition/general comms only — never replaces Paystack checkout.

Integration: initialise transaction, verify, process webhook, record payment, generate receipt, update access. Verify reference, amount, currency, status, duplicates, ownership. Never unlock on frontend success only. Server-side verification + idempotent. Order not marked paid until Paystack verified.

Payment statuses: Unpaid, Pending, Successful, Failed, Processing, Refunded. Store orders: Unpaid, Processing, Paid, Processing Order, Dispatched, Delivered, Cancelled, Refunded.

Unlock security: unique successful unlock record per student/programme/level. Prevent duplicate charges. Maintain audit records.

### 20. VALENCE ADVERTISE — TUITION CENTRE ADVERTISING

Advertiser registration: centre name, logo, address, contact, website, social, description, specialisation areas, programmes offered, credentials. Centres advertise ICAN/ATSWA/university/professional tuition, revision, exam prep, workshops, seminars. Admin verification before verified status/publishing.

Placements: homepage banners, sponsored ICAN/ATSWA listings, student dashboard ads, sponsored CONNECT posts, featured tuition centre listings, learning section ads, workshop promotions, professional training announcements. Label as Sponsored/Advertisement. No false endorsement.

Tuition Centres Directory: public directory; name, logo, location, programmes, subjects, online/physical, description, contact, website/social, verification, photos. Filters: programme, location, mode, subject, level. Verified centres purchase enhanced visibility.

Campaign management: create campaigns, upload banners/images, copy, contact links, target audiences, placements, durations, monitor status, renew, pause. Audiences: ATSWA, ICAN each level, university, polytechnic, professionals, general learners.

Packages: admin-configurable names, prices, durations, placements, banner sizes, audiences, limits, offers. All online ad payments via Paystack. Server-side verification before activation.

Admin: review advertisers, verify centres, approve/reject ads, request corrections, schedule, pause, manage packages, view payments, monitor performance.
Campaign statuses: Draft, Submitted, Pending Review, Approved, Scheduled, Active, Paused, Rejected, Expired, Suspended.

Analytics: advertisers view impressions, clicks, CTR, enquiries, dates, remaining duration. Admins view revenue, performance, activity, placement stats.

Guidelines: prohibit fraudulent/deceptive ads; no false accreditation claims; verification ≠ teaching quality; no selling student contact info or unsolicited DMs; reporting tools; ads must not obstruct learning/exams.

### 21. OPPORTUNITIES AND CAREER DEVELOPMENT

Public section: scholarships, internships, graduate opportunities, accounting jobs, finance jobs, professional development, training, workshops, fellowships, career events. Each: title, org, category, description, eligibility, deadline, application link, documents, flyer, date. Admin create/edit/publish/archive.

### 22. ADMINISTRATIVE DASHBOARD

Secure master admin portal with role-based permissions: Master Admin, Academic Admin, Finance Admin, Tutor Manager, Competition Admin, Community Moderator, Advertising Admin, Store Manager, other configurable roles.

Stats: total/active students, professionals, tutors, pending tutor apps, pending cert verification, active enrolments, successful unlock payments, verified tuition payments, store orders, outstanding orders, ad campaigns, ad revenue, competition registrations, participating institutions, upcoming classes, upcoming exam sessions, recent activities, community announcements, reported content.

Modules: students, tutors, tutor certificates, programmes, courses, exam levels, exam sessions, fees, discounts, enrolments, payments, classes, resources, textbooks, videos, store products, orders, delivery zones, opportunities, exemptions, institutions, competitions, competition questions, marking, results, CONNECT moderation, profiles & reported pictures, community announcements, official announcements, professional profiles, mentorship, events, tuition centre advertisers, ad campaigns, ad packages, website banners, notifications, contact info, reports, audit logs, platform settings.

Announcement admin: publish/edit/schedule/pin official announcements, target categories/institutions/programmes/courses, archive, review reported community announcements, remove violating content, suspend accounts. No silent impersonation; moderation + audit record. All changes DB-backed, no redeploy.

### 23. NOTIFICATIONS AND COMMUNICATION

Central notification system: enrolments, payments, unlock confirmations, upcoming classes, class changes, exam deadlines, exam sessions, competition registration/schedules/results, messages, connection requests, study group invitations, mentorship requests, opportunities, ad campaign updates, order status, announcement comments/likes/replies, connection announcements, institution announcements, official notices. In-app + email where configured. Preferences.

### 24. COMMUNITY SAFETY AND MODERATION

Prohibit harassment, bullying, impersonation, fraud, unauthorised disclosure, exam misconduct, copyright violations, spam, abusive messages, misleading claims, inappropriate images, deceptive announcements.
Provide: block, report user/post/announcement/picture/comment, group moderation, rate limits, moderator tools, warnings, temp restrictions, suspension, removal.
Moderator private-message access restricted to safety/legal/policy-enforcement with controls + audit.

### 25. DATABASE ARCHITECTURE

PostgreSQL via Supabase. Properly related tables with PKs, FKs, indexes, constraints, timestamps.

Core identity/users: profiles, user_roles, student_profiles, tutor_profiles, professional_profiles, professional_credentials, institutions, institution_verifications, institution_representatives, institution_members.
Pictures/announcements: profile_photos, announcement_posts, announcement_attachments, announcement_comments, announcement_likes, announcement_bookmarks, announcement_shares, announcement_reports.
Academic: programmes, examination_levels, courses, course_topics, examination_sessions, enrolments, fee_components, programme_fee_settings, discount_rules, student_fee_unlocks.
Tutor: tutor_certificates, tutor_assessments, assessment_questions, assessment_attempts, tutor_rate_requests.
Learning: reading_progress, study_sessions, classrooms, class_schedules, class_attendance, assignments, assignment_submissions, textbooks, video_resources, learning_resources.
Payments/store: payments, products, product_prices, orders, order_items, delivery_zones, receipts.
Opportunities: opportunities, opportunity_applications.
VALENCE CONNECT: user_connections, connection_requests, conversations, conversation_members, messages, message_attachments, (call_sessions — REMOVED), study_groups, study_group_members, study_group_messages, discussion_categories, discussion_posts, discussion_comments, discussion_likes, discussion_bookmarks, mentorship_profiles, mentorship_requests, professional_events, event_registrations.
Competitions: competition_teams, competition_team_members, competitions, competition_categories, competition_registrations, competition_rounds, competition_subjects, competition_question_banks, competition_questions, competition_options, competition_attempts, competition_answers, competition_marking_rubrics, competition_marks, competition_markers, competition_results, competition_leaderboards, competition_awards, competition_certificates, competition_appeals, competition_audit_logs.
VALENCE ADVERTISE: advertisers, advertiser_verifications, advertising_packages, advertising_campaigns, advertising_placements, advertising_payments, advertising_impressions, advertising_clicks, advertising_reports, advertising_audit_logs.
General: notifications, exemption_guidelines, exemption_qualifications, exemption_course_mappings, promotional_banners, audit_logs, platform_settings.
Indexes, constraints, FKs, unique relationships.

### 26. SECURITY AND DATA PRIVACY

RLS on all sensitive tables.
- Students: own profiles, enrolments, payments, unlocks, progress, authorised classes/resources; own announcements/pictures.
- Tutors: own profiles, assigned courses/classes/student groups/teaching resources. NO student financial records.
- Professionals: own profiles, qualifications, announcements, approved activities.
- Advertisers: own advertiser profiles, campaigns, analytics, ad payments. NO student records, exam attempts, private conversations, confidential financial data.
- School reps: authorised institution teams/competition activities. NO unrestricted admin/financial access.
- Admins: backend-controlled roles. Never self-grant via frontend.
User content security: modify/delete only own; no altering others' profiles/content; audience restrictions server-side; private pics/attachments secure; reported content → moderation workflow; logged.
Additional: private document storage, secure file access, input validation, server-side payment verification, rate limiting, audit logging, secure auth, session protection, error handling, protection against unauthorised DB access.

### 27. CONTACT INFORMATION

AAG PROFESSIONAL SERVICES. WhatsApp: +234 915 434 4663. Email: axelacademyinfo@gmail.com. Operating hours: by appointment.
Contact form, WhatsApp support, physical tuition enquiries, ICAN official fee assistance, material enquiries, document submission instructions, advertising enquiries. Floating WhatsApp support button. WhatsApp not an alternative payment checkout.

### 28. DEPLOYMENT AND ENVIRONMENT CONFIGURATION

(Deployment adjustment: Vercel + git-source CI/CD — see APPLIED ADJUSTMENTS. Spec originally said Netlify; Vercel used per chat.)
Config: Vercel/SPA redirects, server functions, Supabase migrations, DB setup, storage buckets, RLS policies, env docs, GitHub repo, build/deploy instructions, error handling, production testing.
Env vars: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, PAYSTACK_SECRET_KEY, OPENAI_API_KEY. Private credentials server-side. Document any extra credentials.

### 29. IMPLEMENTATION PHASES

Phase 1: Brand & public website (design system, homepage, nav, About, Services, Programmes, Contact).
Phase 2: Database & authentication (Supabase, registration, auth, user categories, roles, security policies).
Phase 3: User profiles & community publishing (profiles, pictures, galleries, privacy, announcement composer, feeds, comments/reactions, moderation).
Phase 4: Academic programmes (ATSWA, ICAN, tuition pricing, unlock system, exam sessions, enrolments).
Phase 5: Student portal (dashboard, learning tracker, study hours, classes, resources, videos, notifications).
Phase 6: Tutor system (applications, certificates, verification, assessment, tutor portal).
Phase 7: Administration (dashboard, roles, academic, finance, reports, audit logs, moderation).
Phase 8: Payments (Paystack, tuition, unlocking, store checkout, receipts, verification).
Phase 9: VALENCE AI (accounting tutor, usage controls, secure API).
Phase 10: VALENCE CONNECT (connections, messaging, study groups, discussions, mentorship, events — calls REMOVED).
Phase 11: VALENCE COMPETE (institutional profiles, teams, competitions, exam engine, marking, results, leaderboards, certificates).
Phase 12: VALENCE PROFESSIONAL (professional profiles, networking, mentorship, events, opportunities).
Phase 13: VALENCE MARKETPLACE (store, textbooks, study packs, past questions, delivery, orders).
Phase 14: VALENCE ADVERTISE (advertiser registration, centre verification, directory, packages, campaign management, Paystack, placements, analytics).
Phase 15: Opportunities & additional programmes (scholarships, jobs, internships, campus ambassadors, Hall of Fame, National Accounting League, Battle Arena).
Phase 16: Security & production launch (testing, performance, accessibility, security review, deployment, documentation).

Do not sacrifice functionality to rush phases.

### 30. TESTING AND QUALITY ASSURANCE

Test every major business rule: academic (programme structure, course selection, tuition/discount calc, session selection, deadlines, unlocking, exemptions); profile/announcements (pic upload/change/delete, gallery, privacy, creation/edit/delete, audiences, attachments, comments/likes/replies/bookmarks/sharing, notifications, reporting, moderation, official permissions; one user can't modify another's content); payments (initialise, success/fail verification, duplicates, webhooks, idempotency, unlock activation, store/ad payment, refunds); competitions (school registration, verification, teams, registration, randomisation, timers, autosave, reconnection, selection, auto/manual marking, approval, appeals, leaderboards); community (connections, messaging, groups, file permissions, blocking, reporting, moderation); advertising (registration, verification, submission, approval, payment, activation, scheduling, expiry, impression/click tracking, permissions, reporting); security (no cross-user private access, tutors no financial, advertisers no student info, no self-admin, no unauthorised private doc access, no modifying others' content, no unauthorised private announcements, no forged payments). Test mobile/tablet/desktop.

### 31. FINAL DELIVERY REQUIREMENTS

1. Complete responsive frontend. 2. Functional backend. 3. Supabase schema. 4. Migrations. 5. RLS policies. 6. Auth & role management. 7. Student portal. 8. Tutor portal. 9. Professional portal. 10. Admin dashboard. 11. Profile management. 12. Profile picture uploads & galleries. 13. Community announcement publishing. 14. Announcement feeds & engagement. 15. ATSWA/ICAN programme management. 16. Exam diet/session management. 17. Secure Paystack integration. 18. AI accounting tutor. 19. VALENCE CONNECT. 20. VALENCE NATIONAL ACCOUNTING CHALLENGE. 21. Institutional & competition management. 22. VALENCE MARKETPLACE. 23. VALENCE ADVERTISE. 24. Tuition Centres Directory. 25. Opportunities portal. 26. Notification system. 27. Content moderation tools. 28. Audit logging. 29. Deployment config. 30. Env var documentation. 31. Testing documentation. 32. Admin guide. 33. User guide.

### FINAL DEVELOPMENT INSTRUCTIONS

- Build the actual application, not just a design concept.
- No non-functional buttons or decorative dashboard statistics.
- Every major feature connects to backend functionality.
- Every registered user can upload profile pictures and publish community announcements (subject to rules).
- Official VALENCE announcements under authorised admin control.
- Preserve all specified business rules and prices.
- Paystack is the only online checkout/payment provider.
- Exam sessions configurable; distinguish ATSWA and ICAN diets.
- Apply the ICAN 7% study-pack discount across Foundation, Skills and Professional levels.
- Separate access permissions for students, tutors, professionals, advertisers, institutions, admins.
- Do not expose private information.
- Scalable for users and institutions across Nigeria.
- Easy for admins to maintain without developer code changes for ordinary pricing/scheduling/content/campaign updates.
- Where official exam formats/requirements may change, make configurable + require academic review before publication.
- Where an external integration needs credentials/paid service, document the requirement rather than pretending it is functional.
- Build each phase to a working standard before proceeding.
- Do not silently omit any feature. If a feature cannot be completed immediately, document its implementation status and outstanding requirements.

### ULTIMATE OBJECTIVE

Establish VALENCE as a leading Nigerian accounting education, professional networking, academic competition, community engagement, advertising and career development ecosystem operated by AAG PROFESSIONAL SERVICES.

---

## APPLIED ADJUSTMENTS (from chat)

1. **Call feature REMOVED COMPLETELY** — no Google Meet, no WebRTC, no call_sessions, no voice/video calls, no meeting links. (User directive: "LETS REMOVE THE CALL FEATURE COMPLETELY.")
2. **Portal routing corrected** — each portal routes to its proper destination after login (admin→/portal/admin, tutor→/portal/tutor, advertiser→/portal/advertiser, learners→/portal/student).
3. **Dashboard de-cluttered & toggles responsive** — not rough/busy; font sizes and spacing improved.
4. **StudyTools ExternalLink crash fixed** — missing icon import added.
5. **Privacy toggles hardened** — DB null/string values normalized to booleans.
6. **Deployment via GitHub → fresh Vercel git-source deployment** (never redeploy); Vercel env var type `encrypted`.
7. **Supabase project: `valence-platform`** (ref `gdgeogzmrvxtwdqtlwbu`).
8. **Colour palette per spec: Deep black, Mustard gold, White, Charcoal, Professional grey** (to be reconciled against the current green-accented design system during Phase 1).
