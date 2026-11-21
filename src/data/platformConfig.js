import { buildDietSession } from '../lib/examSchedule.js';
import { UNIVERSITY_COUNTS } from './nigerianUniversities.js';

export const PLATFORM_SETTINGS = {
  brandName: 'VALENCE',
  tagline: 'Vita sine litteris mors est.',
  taglineTranslation: 'Life without learning is death.',
  heroHeadline: 'Your Learning. Your Connections. Your Competition. Your Professional Future.',
  heroSubcopy:
    'VALENCE is your complete learning and professional development community for ICAN and ATSWA candidates, tertiary students, chartered accountants, accounting tutors and aspiring professionals. Access structured learning, intelligent study tools, professional networking, academic competitions, educational resources and career opportunities in one place.',
  whatsappNumber: '+234 915 434 4663',
  whatsappChannelUrl: '',
  email: 'atvalencecustomersupport@gmail.com',
  supportNumbers: ['09154344663', '08129916034', '09045353370'],
  operatingHours: 'By appointment',
  location: 'Lagos, Nigeria (Serving candidates & institutions nationwide)',
  paymentProvider: 'Paystack',
  tuitionUnlockFee: 3000,
  adWeeklyRate: 10000,
  atswaPastQuestionPerCourse: 5500,
  icanPastQuestionPerCourse: 9000,
  atswaStudyPackPrice: 9500,
  competitionFirstPrize: 250000,
  competitionSecondPrize: 150000,
  competitionThirdPrize: 100000,
  competitionMaxCompetitorsPerSchool: 4,
  resultReleaseWindowDays: 30,
  registrationCutoffDaysBeforeExam: 7,
  centralScheduleAuthority: 'VALENCE Central Examination Authority',
  officialLinks: {
    icanWebsite: 'https://icanig.org/ican/',
    atswaSoftCopy: 'https://icanig.org/students/atswa',
    icanExamDockets: 'https://icanig.org/ican/students/professional-exam-dockets',
    icanSyllabus2026: 'https://icanig.org/ican/assets/docs/ICAN_SYLLABUS_2026_Final_Updated_NEW.pdf',
    icanAccreditedInstitutions:
      'https://icanig.org/ican/assets/docs/documents/Accredited_institutions_0425.pdf',
    icanMcatiInstitutions:
      'https://icanig.org/ican/assets/docs/documents/MCATI_LIST_UPDATED_MAY_2024.pdf',
    whatsappChannel: 'https://whatsapp.com/channel/0029VbDLZl4J93wMoS0biE1o',
  },
  // Configurable anytime from Admin Portal; automatically rendered in Footer when populated
  socialLinks: {
    instagram: '',
    x: '',
    linkedin: '',
    youtube: '',
    tiktok: '',
  },
};

/**
 * Dynamic Examination Sessions & Timetables
 * Governed & published by the Central Examination Authority in Admin Portal:
 * - ATSWA (March & September): 2 days, second-to-last Tuesday & Wednesday of diet month
 * - ICAN (May & November): 3 days, first Tuesday, Wednesday & Thursday of diet month (overridable when ICAN adjusts schedule)
 * - Exam registration closes 1 week (7 days) prior to Day 1
 * - After final exam day, automatic 30-day countdown to result release begins (overridable if delayed)
 */
export const EXAMINATION_SESSIONS = [
  buildDietSession({
    id: 'atswa-mar-2027',
    programme: 'ATSWA',
    diet: 'March',
    year: 2027,
    tuitionCommencement: '2026-12-07',
    timetable: [
      {
        dayLabel: 'Day 1 · Tuesday',
        dateIndex: 0,
        morning: 'ATS 1: BAPS · ATS 2: Financial Accounting · ATS 3: Cost Accounting',
        afternoon: 'ATS 1: Economics · ATS 2: Public Sector Accounting · ATS 3: Audit',
      },
      {
        dayLabel: 'Day 2 · Wednesday',
        dateIndex: 1,
        morning: 'ATS 1: Business Law · ATS 2: Quantitative Analysis · ATS 3: Taxation',
        afternoon: 'ATS 1: Communication Skills · ATS 2: Information Technology · ATS 3: Management',
      },
    ],
  }),
  buildDietSession({
    id: 'ican-may-2027',
    programme: 'ICAN',
    diet: 'May',
    year: 2027,
    tuitionCommencement: '2027-01-11',
    timetable: [
      {
        dayLabel: 'Day 1 · Tuesday',
        dateIndex: 0,
        morning: 'Foundation: Financial Accounting (FA) · Skills: Financial Reporting (FR) · Pro: Strategic Business Reporting (SBR)',
        afternoon: 'Foundation: Business Environment (BE) · Skills: Taxation (TAX) · Pro: Advanced Taxation (A/TAX)',
      },
      {
        dayLabel: 'Day 2 · Wednesday',
        dateIndex: 1,
        morning: 'Foundation: Management Accounting (MA) · Skills: Performance Management (PM) · Pro: Strategic Financial Management (SFM)',
        afternoon: 'Foundation: Corporate & Business Law (CBL) · Skills: Audit, Assurance & Forensics (AAF) · Pro: AAAF',
      },
      {
        dayLabel: 'Day 3 · Thursday',
        dateIndex: 2,
        morning: 'Skills: Financial Management (FM) · Pro: Case Study (CS, Full Session)',
        afternoon: 'Skills: Public Sector Accounting & Finance (PSAF)',
      },
    ],
  }),
  // Concluded November 2026 ICAN diet, demonstrates LIVE 30-day post-exam Result Release Countdown!
  buildDietSession({
    id: 'ican-nov-2026',
    programme: 'ICAN',
    diet: 'November',
    year: 2026,
    tuitionCommencement: '2026-07-06',
    timetable: [
      {
        dayLabel: 'Day 1 · Tuesday',
        dateIndex: 0,
        morning: 'FA · FR · SBR (Completed)',
        afternoon: 'BE · TAX · A/TAX (Completed)',
      },
      {
        dayLabel: 'Day 2 · Wednesday',
        dateIndex: 1,
        morning: 'MA · PM · SFM (Completed)',
        afternoon: 'CBL · AAF · AAAF (Completed)',
      },
      {
        dayLabel: 'Day 3 · Thursday',
        dateIndex: 2,
        morning: 'FM · Case Study (Completed)',
        afternoon: 'PSAF (Completed)',
      },
    ],
  }),
  buildDietSession({
    id: 'atswa-sep-2027',
    programme: 'ATSWA',
    diet: 'September',
    year: 2027,
    tuitionCommencement: '2027-05-10',
    timetable: [
      {
        dayLabel: 'Day 1 · Tuesday',
        dateIndex: 0,
        morning: 'BAPS · Financial Accounting · Cost Accounting (Provisional, Central Authority)',
        afternoon: 'Economics · Public Sector Accounting · Audit (Provisional)',
      },
      {
        dayLabel: 'Day 2 · Wednesday',
        dateIndex: 1,
        morning: 'Business Law · Quantitative Analysis · Taxation (Provisional)',
        afternoon: 'Communication Skills · Information Technology · Management (Provisional)',
      },
    ],
  }),
  buildDietSession({
    id: 'ican-nov-2027',
    programme: 'ICAN',
    diet: 'November',
    year: 2027,
    tuitionCommencement: '2027-07-05',
    timetable: [
      {
        dayLabel: 'Day 1 · Tuesday',
        dateIndex: 0,
        morning: 'FA · FR · SBR (Provisional, Subject to Institute Timetable)',
        afternoon: 'BE · TAX · A/TAX (Provisional)',
      },
      {
        dayLabel: 'Day 2 · Wednesday',
        dateIndex: 1,
        morning: 'MA · PM · SFM (Provisional)',
        afternoon: 'CBL · AAF · AAAF (Provisional)',
      },
      {
        dayLabel: 'Day 3 · Thursday',
        dateIndex: 2,
        morning: 'FM · Case Study (Provisional)',
        afternoon: 'PSAF (Provisional)',
      },
    ],
  }),
];

export const ATSWA_LEVELS = [
  {
    id: 'ats-1',
    code: 'ATS 1',
    name: 'ATSWA Level 1 (ATS 1)',
    summary: 'Foundational accounting records, economics, corporate communication and legal principles.',
    unlockFee: 3000,
    tuitionPerCourse: 20000,
    discountRate: 0.25,
    discountMinCourses: 2,
    maxTuition: 60000,
    officialFees: {
      icanRegistration: 13400,
      fullExamFee: 39500,
      annualSubscription: 7000,
    },
    requiredDocuments: ['Passport photograph', "O'Level result (WAEC/NECO/NABTEB)", 'Birth certificate'],
    courses: [
      { id: 'ats1-baps', code: 'BAPS', title: 'Basic Accounting Processes and Systems', topics: 14 },
      { id: 'ats1-eco', code: 'ECO', title: 'Economics', topics: 12 },
      { id: 'ats1-cs', code: 'COM', title: 'Communication Skills', topics: 10 },
      { id: 'ats1-bl', code: 'BLW', title: 'Business Law', topics: 12 },
    ],
  },
  {
    id: 'ats-2',
    code: 'ATS 2',
    name: 'ATSWA Level 2 (ATS 2)',
    summary: 'Core financial reporting, government accounting, information systems and quantitative methods.',
    unlockFee: 3000,
    tuitionPerCourse: 20000,
    discountRate: 0.25,
    discountMinCourses: 2,
    maxTuition: 60000,
    officialFees: {
      icanRegistration: null,
      fullExamFee: 43000,
      annualSubscription: 7000,
    },
    requiredDocuments: ['ATS 1 pass/exemption slip', 'Current subscription evidence'],
    courses: [
      { id: 'ats2-psa', code: 'PSA', title: 'Public Sector Accounting', topics: 13 },
      { id: 'ats2-fa', code: 'FA', title: 'Financial Accounting', topics: 16 },
      { id: 'ats2-it', code: 'IT', title: 'Information Technology', topics: 11 },
      { id: 'ats2-qa', code: 'QA', title: 'Quantitative Analysis', topics: 14 },
    ],
  },
  {
    id: 'ats-3',
    code: 'ATS 3',
    name: 'ATSWA Level 3 (ATS 3)',
    summary: 'Final AAT qualifying stage covering costing, auditing practice, management and Nigerian taxation.',
    unlockFee: 3000,
    tuitionPerCourse: 20000,
    discountRate: 0.25,
    discountMinCourses: 2,
    maxTuition: 60000,
    officialFees: {
      icanRegistration: null,
      fullExamFee: 43000,
      annualSubscription: 7000,
    },
    requiredDocuments: ['ATS 2 pass/exemption slip', 'Current subscription evidence'],
    courses: [
      { id: 'ats3-cost', code: 'COST', title: 'Cost Accounting', topics: 15 },
      { id: 'ats3-aud', code: 'AUD', title: 'Audit', topics: 13 },
      { id: 'ats3-mgt', code: 'MGT', title: 'Management', topics: 12 },
      { id: 'ats3-tax', code: 'TAX', title: 'Taxation', topics: 15 },
    ],
  },
];

export const ICAN_LEVELS = [
  {
    id: 'foundation',
    slug: 'foundation',
    code: 'FOUNDATION',
    name: 'ICAN Foundation Level',
    shortName: 'Foundation',
    tagline: 'Entry stage to the ACA professional qualification, 4 rigorous foundational papers.',
    unlockFee: 3000,
    tuitionPerCourse: 40000,
    discountRate: 0.25,
    discountMinCourses: 3,
    courses: [
      { id: 'ican-cbl', code: 'CBL', title: 'Corporate and Business Law', level: 'Foundation', studyPackPrice: 10000, topics: 15 },
      { id: 'ican-be', code: 'BE', title: 'Business Environment', level: 'Foundation', studyPackPrice: 13000, topics: 14 },
      { id: 'ican-ma', code: 'MA', title: 'Management Accounting', level: 'Foundation', studyPackPrice: 13000, topics: 16 },
      { id: 'ican-fa', code: 'FA', title: 'Financial Accounting', level: 'Foundation', studyPackPrice: 12500, topics: 18 },
    ],
  },
  {
    id: 'skills',
    slug: 'skills',
    code: 'SKILLS',
    name: 'ICAN Skills Level',
    shortName: 'Skills',
    tagline: 'Applied technical mastery across IFRS reporting, corporate finance, public sector, assurance and taxation, 6 papers.',
    unlockFee: 3000,
    tuitionPerCourse: 40000,
    discountRate: 0.25,
    discountMinCourses: 3,
    courses: [
      { id: 'ican-fr', code: 'FR', title: 'Financial Reporting', level: 'Skills', studyPackPrice: 15500, topics: 20 },
      { id: 'ican-fm', code: 'FM', title: 'Financial Management', level: 'Skills', studyPackPrice: 13500, topics: 17 },
      { id: 'ican-psaf', code: 'PSAF', title: 'Public Sector Accounting and Finance', level: 'Skills', studyPackPrice: 15000, topics: 18 },
      { id: 'ican-aaf', code: 'AAF', title: 'Audit, Assurance and Forensics', level: 'Skills', studyPackPrice: 13000, topics: 16 },
      { id: 'ican-tax', code: 'TAX', title: 'Taxation', level: 'Skills', studyPackPrice: 13500, topics: 18 },
      { id: 'ican-pm', code: 'PM', title: 'Performance Management', level: 'Skills', studyPackPrice: 15500, topics: 17 },
    ],
  },
  {
    id: 'professional',
    slug: 'professional',
    code: 'PROFESSIONAL',
    name: 'ICAN Professional Level',
    shortName: 'Professional',
    tagline: 'Boardroom-level advisory, group reporting, forensic assurance, tax strategy and integrated case synthesis, 5 papers.',
    unlockFee: 3000,
    tuitionPerCourse: 40000,
    discountRate: 0.25,
    discountMinCourses: 3,
    courses: [
      { id: 'ican-sbr', code: 'SBR', title: 'Strategic Business Reporting', level: 'Professional', studyPackPrice: 15500, topics: 22 },
      { id: 'ican-cs', code: 'CS', title: 'Case Study', level: 'Professional', studyPackPrice: 12000, topics: 12 },
      { id: 'ican-aaaf', code: 'AAAF', title: 'Advanced Audit, Assurance and Forensics', level: 'Professional', studyPackPrice: 13000, topics: 19 },
      { id: 'ican-atax', code: 'A/TAX', title: 'Advanced Taxation', level: 'Professional', studyPackPrice: 13000, topics: 20 },
      { id: 'ican-sfm', code: 'SFM', title: 'Strategic Financial Management', level: 'Professional', studyPackPrice: 15500, topics: 21 },
    ],
  },
];

export const ALL_ICAN_COURSES = ICAN_LEVELS.flatMap((lvl) => lvl.courses);

// Used strictly inside verified/unlocked Student Portal & server-side Paystack checks
export const ICAN_PRICING_TABLE = [
  { courses: 1, gross: 40000, total: 40000, savings: 0, discounted: false },
  { courses: 2, gross: 80000, total: 80000, savings: 0, discounted: false },
  { courses: 3, gross: 120000, total: 90000, savings: 30000, discounted: true },
  { courses: 4, gross: 160000, total: 120000, savings: 40000, discounted: true },
  { courses: 5, gross: 200000, total: 150000, savings: 50000, discounted: true },
  { courses: 6, gross: 240000, total: 180000, savings: 60000, discounted: true },
];

export const EXEMPTION_RULES = [
  {
    id: 'bsc_hnd_accounting_mcati',
    label: 'B.Sc. / HND Accounting: ICAN-Accredited Institution with MCATI Agreement',
    startingLevel: 'ICAN Professional Level',
    estimatedDuration: '~6 months – 1 year (without carryovers)',
    exemptedCodes: ['CBL', 'BE', 'MA', 'FA', 'FR', 'FM', 'PSAF', 'AAF', 'TAX', 'PM'],
    atswaExemptedLevels: [],
    guidance:
      'Accounting graduates from an ICAN-accredited institution with an active Mutual Cooperation Agreement with Tertiary Institutions (MCATI) start directly from the ICAN Professional Level, exempted from all Foundation and Skills Level papers, subject to graduation-year verification.',
    conditions: [
      'Confirm your school appears on the official ICAN MCATI Institutions List (applies strictly to Accounting graduates).',
      'Active MCATI status must cover your exact graduation cohort/session.',
      'Official academic transcript sent directly from your Registrar to ICAN plus NYSC certificate/exemption required.',
      'Progression requires clearing all 5 Professional papers (SBR, CS, AAAF, A/TAX, SFM) to qualify as ACA.',
    ],
  },
  {
    id: 'bsc_hnd_accounting_accredited',
    label: 'B.Sc. / HND Accounting: ICAN-Accredited Institution (Non-MCATI)',
    startingLevel: 'ICAN Skills Level',
    estimatedDuration: '~1 year (without carryovers)',
    exemptedCodes: ['CBL', 'BE', 'MA', 'FA', 'AAF'],
    atswaExemptedLevels: [],
    guidance:
      'Accounting graduates from an ICAN-accredited university or polytechnic start from the ICAN Skills Level, exempted from all 4 Foundation Level courses and Audit, Assurance & Forensics (AAF). You clear the remaining Skills papers before advancing to Professional Level.',
    conditions: [
      'Confirm your institution appears on the official ICAN Accredited Institutions PDF (applies to Accounting graduates).',
      'Accreditation status must be valid for your year of graduation.',
      'Official academic transcript, certified B.Sc./HND certificate and formal ICAN exemption processing required.',
      'All remaining Skills Level courses must be cleared before progressing to Professional Level.',
    ],
  },
  {
    id: 'bsc_hnd_accounting_unaccredited',
    label: 'B.Sc. / HND Accounting: Non-Accredited Institution',
    startingLevel: 'ICAN Foundation Level (Usually Management Accounting Only)',
    estimatedDuration: '~1.5 years (without carryovers)',
    exemptedCodes: ['CBL', 'BE', 'FA'],
    atswaExemptedLevels: [],
    guidance:
      'Accounting graduates from a non-accredited institution commence from the ICAN Foundation Level, typically writing Management Accounting (MA) only at Foundation before advancing to Skills and Professional Levels, subject to official ICAN transcript verification.',
    conditions: [
      'Official academic transcript evaluation by ICAN confirms exact Foundation paper exemptions.',
      'Must clear Foundation stage completely before progressing to Skills Level.',
    ],
  },
  {
    id: 'aat_atswa',
    label: 'AAT Certificate Holder (Completed ATSWA ATS 1 – ATS 3)',
    startingLevel: 'ICAN Skills Level',
    estimatedDuration: '~1 year from AAT to ACA (~2.5 years full ATSWA-to-ACA route)',
    exemptedCodes: ['CBL', 'BE', 'MA', 'FA', 'AAF', 'TAX'],
    atswaExemptedLevels: ['ATS 1', 'ATS 2', 'ATS 3 (Completed)'],
    guidance:
      'After passing ATS 1 to ATS 3 and earning the AAT certificate, candidates progress directly to the ICAN main stages (Skills and Professional Levels), receiving full Foundation exemption plus approved Skills exemptions under the current ICAN Exemption Guide.',
    conditions: [
      'Valid AAT certificate and active annual subscription standing required.',
      'Formal exemption processing on the ICAN portal confirms exact Skills papers under the 2026 syllabus.',
    ],
  },
  {
    id: 'bsc_finance_banking',
    label: 'B.Sc. / HND Banking & Finance / Finance',
    startingLevel: 'ICAN Foundation Level (With Subject Exemptions)',
    estimatedDuration: '~1.5 years (without carryovers)',
    exemptedCodes: ['CBL', 'BE', 'FM'],
    atswaExemptedLevels: [],
    guidance:
      'Graduates from Banking & Finance or Finance transition via the Graduate Route starting from Foundation Level, with subject-by-subject exemptions (commonly CBL, BE and FM) confirmed through the official ICAN Professional Exemption Guide.',
    conditions: [
      'Recognised NUC/NBTE-approved institution transcript required.',
      'Subject exemptions confirmed strictly upon official ICAN exemption processing.',
    ],
  },
  {
    id: 'bsc_economics_busadmin',
    label: 'B.Sc. / HND Economics, Business Administration or Management',
    startingLevel: 'ICAN Foundation Level (With Subject Exemptions)',
    estimatedDuration: '~1.5 years (without carryovers)',
    exemptedCodes: ['BE', 'CBL'],
    atswaExemptedLevels: [],
    guidance:
      'Graduates of Economics, Business Administration and Management start from Foundation Level and typically qualify for Business Environment (BE) and Corporate & Business Law (CBL) where passed at tertiary level.',
    conditions: [
      'Official transcript must reflect passed credits in equivalent courses.',
      'All remaining Foundation courses must be cleared before advancing to Skills Level.',
    ],
  },
  {
    id: 'bsc_non_accounting',
    label: 'B.Sc. / HND Non-Accounting Discipline (Transitioning to Accounting)',
    startingLevel: 'ICAN Foundation Level (All 4 Papers)',
    estimatedDuration: '~1.5 years (without carryovers)',
    exemptedCodes: [],
    atswaExemptedLevels: [],
    guidance:
      'Graduates from any non-accounting discipline (Sciences, Engineering, Arts, Social Sciences, Tech, Law, etc.) are fully eligible to enrol without starting from ATSWA, commencing directly at ICAN Foundation Level (MA, FA, CBL, BE) and progressing through Skills and Professional.',
    conditions: [
      'Recognised bachelor’s degree or HND certificate from an approved institution.',
      'Complete Student Registration, Annual Subscription & one-time Development Levy before Exam Registration.',
    ],
  },
  {
    id: 'nd_accounting',
    label: 'ND Accounting (ATSWA Undergraduate Entry Route)',
    startingLevel: 'ATSWA ATS 3 (Exempted from ATS 1 & ATS 2)',
    estimatedDuration: '~1.5 – 2 years to full ACA (ATS 3 → AAT → Skills → Professional)',
    exemptedCodes: [],
    atswaExemptedLevels: ['ATS 1', 'ATS 2'],
    guidance:
      'ND Accounting holders start directly from ATS 3 (exempted from ATS 1 and ATS 2: writing Cost Accounting, Taxation, Auditing and Management). Upon passing ATS 3 and earning the AAT certificate, you progress directly into ICAN Skills and Professional Levels.',
    conditions: [
      'Recognised NBTE-accredited National Diploma (ND) in Accounting plus 5 O’Level credits incl. English & Mathematics.',
      'Apply for ATS 1 & ATS 2 exemption during ATSWA registration before sitting ATS 3 (March or September diet).',
    ],
  },
  {
    id: 'nd_banking_finance',
    label: 'ND Banking & Finance (ATSWA Undergraduate Entry Route)',
    startingLevel: 'ATSWA ATS 2 (Exempted from ATS 1)',
    estimatedDuration: '~2 years to full ACA (ATS 2 → ATS 3 → AAT → Skills → Professional)',
    exemptedCodes: [],
    atswaExemptedLevels: ['ATS 1'],
    guidance:
      'ND Banking & Finance holders start from ATS 2 (exempted from ATS 1). You pass all 4 ATS 2 courses, advance to ATS 3 to earn the AAT certificate, and then progress to ICAN Skills and Professional Levels.',
    conditions: [
      'Recognised NBTE-accredited ND in Banking & Finance plus required O’Level credits.',
      'You must pass all courses in ATS 2 before progressing to ATS 3.',
    ],
  },
  {
    id: 'olevel_or_nd_non_accounting',
    label: "O'Level (WAEC/NECO/NABTEB) or ND Non-Accounting (ATSWA Route)",
    startingLevel: 'ATSWA ATS 1',
    estimatedDuration: '~2.5 years full ATSWA-to-ACA route (without carryovers)',
    exemptedCodes: [],
    atswaExemptedLevels: [],
    guidance:
      'Undergraduates, school leavers with an O’Level result, and non-accounting ND holders start their ICAN journey via ATSWA at ATS 1 (BAPS, Economics, Business Law, Communication Skills), progress through ATS 2 and ATS 3 to earn the AAT certificate, and then advance to ICAN Skills and Professional Levels.',
    conditions: [
      "Minimum 5 O'Level credits including English Language and Mathematics in not more than two sittings.",
      'Required ATS 1 documents: Passport photograph, O’Level result and Birth certificate.',
      'You must pass all 4 courses in each ATS level before progressing to the next level.',
    ],
  },
];

export const ATSWA_ENTRY_PATHWAYS = [
  {
    id: 'entry-ats1',
    qualification: "O'Level Result or ND (Non-Accounting)",
    startAt: 'Start from ATS 1',
    exemptions: 'No exemption; complete ATS 1 → ATS 2 → ATS 3',
    nextStep: 'Earn AAT certificate → progress to ICAN Skills & Professional (~2.5 yrs total)',
  },
  {
    id: 'entry-ats2',
    qualification: 'ND Banking & Finance',
    startAt: 'Start from ATS 2',
    exemptions: 'Exempted from ATS 1 (4 papers)',
    nextStep: 'Complete ATS 2 → ATS 3 → earn AAT → ICAN Skills & Professional',
  },
  {
    id: 'entry-ats3',
    qualification: 'ND Accounting',
    startAt: 'Start from ATS 3',
    exemptions: 'Exempted from ATS 1 & ATS 2 (8 papers)',
    nextStep: 'Pass ATS 3 → earn AAT → ICAN Skills & Professional',
  },
];

export const GRADUATE_ENTRY_PATHWAYS = [
  {
    id: 'grad-non-acct',
    qualification: 'Graduate (Non-Accounting Discipline)',
    startAt: 'Foundation Level',
    exemptions: 'Direct graduate entry; no ATSWA required (subject exemptions where applicable)',
    duration: '~1.5 years (without carryovers)',
  },
  {
    id: 'grad-unaccredited',
    qualification: 'B.Sc. / HND Accounting (Non-Accredited Institution)',
    startAt: 'Foundation Level',
    exemptions: 'Usually writes Management Accounting (MA) only at Foundation',
    duration: '~1.5 years (without carryovers)',
  },
  {
    id: 'grad-accredited',
    qualification: 'B.Sc. / HND Accounting (ICAN-Accredited Institution)',
    startAt: 'Skills Level',
    exemptions: 'Exempted from all Foundation courses + Audit & Assurance (AAF)',
    duration: '~1 year (without carryovers)',
  },
  {
    id: 'grad-mcati',
    qualification: 'B.Sc. / HND Accounting (MCATI Partner Institution)',
    startAt: 'Professional Level',
    exemptions: 'Exempted from Foundation & Skills; starts directly at final stage',
    duration: '~6 months – 1 year (without carryovers)',
  },
];

export const ICAN_REGISTRATION_PROCESS = {
  firstTime: [
    {
      step: '01',
      title: 'Student Registration',
      detail: 'Register officially with ICAN and obtain your unique ICAN student registration number.',
    },
    {
      step: '02',
      title: 'Subscription & Development Levy',
      detail: 'Pay your annual student subscription plus the one-time development levy.',
    },
    {
      step: '03',
      title: 'Exemption Processing (If Applicable)',
      detail: 'Apply for and confirm eligible paper exemptions before selecting examination papers.',
    },
    {
      step: '04',
      title: 'Examination Registration',
      detail: 'Register for the diet based on your confirmed papers (closes 1 week before Exam Day 1).',
    },
  ],
  returning: [
    {
      step: '01',
      title: 'Annual Subscription Renewal',
      detail: 'Settle your annual student subscription if not already paid for the current year.',
    },
    {
      step: '02',
      title: 'Proceed to Examination Registration',
      detail: 'Register for your next diet papers before registration closes 1 week prior to Exam Day 1.',
    },
  ],
};

export const ICAN_COMPLETION_TIMELINES = [
  {
    route: 'ATSWA Route (O’Level → AAT → ACA)',
    diets: 'ATSWA: Mar & Sep · ICAN: May & Nov',
    estimate: '~2.5 Years',
    note: 'ATS 1 → ATS 3 (earn AAT), then ICAN Skills & Professional without carryovers.',
  },
  {
    route: 'Graduate Starting from Foundation',
    diets: 'ICAN: May & November (Twice Yearly)',
    estimate: '~1.5 Years',
    note: '3 diets clearing Foundation → Skills → Professional without carryovers.',
  },
  {
    route: 'Graduate Starting from Skills',
    diets: 'ICAN: May & November (Twice Yearly)',
    estimate: '~1 Year',
    note: 'ICAN-accredited Accounting graduates & AAT holders clearing Skills → Professional.',
  },
  {
    route: 'MCATI Accounting Graduate (Professional)',
    diets: 'ICAN: May & November (Twice Yearly)',
    estimate: '~6 – 12 Months',
    note: 'Direct entry into the 5 final Professional Level papers without carryovers.',
  },
];

export const ICAN_CANDIDATE_FAQS = [
  {
    num: 1,
    q: 'What is ICAN?',
    a: 'The Institute of Chartered Accountants of Nigeria (ICAN) is Nigeria’s foremost professional accounting body. It awards the prestigious ACA (Associate Chartered Accountant) qualification to successful candidates.',
  },
  {
    num: 2,
    q: 'Who is eligible to enrol for the ICAN programme?',
    a: 'Anyone interested in building a career in accounting and finance can enrol, including:',
    bullets: [
      'Graduates or current tertiary students of Accounting',
      'Graduates or students from non-accounting disciplines transitioning into accounting',
      "Undergraduates and school leavers holding a valid O'Level result (via the ATSWA route)",
    ],
  },
  {
    num: 3,
    q: 'What are the ways to start my ICAN journey?',
    a: 'There are two major entry routes into becoming a Chartered Accountant:',
    bullets: [
      "a) Undergraduate / ATSWA Route: Start via ICAN’s subsidiary scheme, ATSWA (Accounting Technicians Scheme West Africa), with just an O'Level result. Progress from ATS 1 → ATS 3, earn the AAT certificate, and advance directly to the ICAN main levels (Skills and Professional).",
      'b) Graduate Route: Graduates do not need to start from ATSWA. Depending on your qualification, course and institution’s accreditation status, you begin directly at Foundation Level, Skills Level or Professional Level.',
    ],
  },
  {
    num: 4,
    q: 'How many levels are there in ATSWA and ICAN?',
    a: 'Both programmes have 3 structured stages, and you must pass all courses in a level/stage before progressing to the next:',
    bullets: [
      'ATSWA (3 Levels: 4 courses each): ATS 1 (Basic Accounting Processes & Systems, Economics, Business Law, Communication Skills) → ATS 2 (Financial Accounting, Public Sector Accounting, Quantitative Analysis, Information Technology) → ATS 3 (Cost Accounting, Taxation, Auditing, Management).',
      'ICAN (3 Stages: 15 courses total): Foundation Level (Management Accounting, Financial Accounting, Corporate & Business Law, Business Environment) → Skills Level (Financial Reporting, Performance Management, Public Sector Accounting & Finance, Financial Management, Taxation, Audit, Assurance & Forensics) → Professional Level (Strategic Business Reporting, Strategic Financial Management, Advanced Taxation, Advanced Audit, Assurance & Forensics, Case Study).',
    ],
  },
  {
    num: 5,
    q: 'How do I know the level I should start from?',
    a: 'Your entry level depends on whether you are entering as an undergraduate/ND holder or as a B.Sc./HND graduate:',
    bullets: [
      "O'Level or ND (Non-Accounting): Start from ATS 1.",
      'ND Banking & Finance: Start from ATS 2 (exempted from ATS 1).',
      'ND Accounting: Start from ATS 3 (exempted from ATS 1 & ATS 2).',
      'B.Sc./HND Accounting (Non-Accredited Institution): Start from Foundation Level (usually writing Management Accounting only).',
      'B.Sc./HND Accounting (ICAN-Accredited Institution): Start from Skills Level (exempted from Foundation Level and Audit & Assurance).',
      'B.Sc./HND Accounting (Accredited Institution with MCATI Agreement): Start directly from Professional Level.',
      'B.Sc./HND Non-Accounting Discipline: Start from Foundation Level.',
    ],
  },
  {
    num: 6,
    q: 'How do I check my official ICAN exemption status?',
    a: 'Visit ICAN’s official website and follow these 4 simple steps (or preview your estimate using VALENCE’s Exemption Guidance Tool):',
    bullets: [
      '1. Go to Students on the ICAN website',
      '2. Click Exemptions',
      '3. Select Professional',
      '4. Click Professional Exemption Guide',
    ],
    links: [
      { label: 'Official ICAN Website (icanig.org/ican)', url: 'https://icanig.org/ican/' },
    ],
  },
  {
    num: 7,
    q: 'How do I check if my school is ICAN-accredited or has an MCATI agreement?',
    a: 'Open the official ICAN directory links below to check your institution’s name and accreditation status. Kindly note that Accredited and MCATI lists apply specifically to graduates of Accounting:',
    links: [
      {
        label: 'Check ICAN Accredited Institutions List (PDF)',
        url: 'https://icanig.org/ican/assets/docs/documents/Accredited_institutions_0425.pdf',
      },
      {
        label: 'Check ICAN MCATI Partner Institutions List (PDF)',
        url: 'https://icanig.org/ican/assets/docs/documents/MCATI_LIST_UPDATED_MAY_2024.pdf',
      },
    ],
  },
  {
    num: 8,
    q: 'What is the process for registering for ICAN exams?',
    a: 'The registration sequence differs slightly for first-time and returning candidates (note: exam registration closes 1 week before Exam Day 1):',
    bullets: [
      'First-Time Students: (1) Student Registration to obtain your ICAN registration number → (2) Pay Annual Subscription & one-time Development Levy → (3) Complete Exemption Processing (if applicable) → (4) Exam Registration based on your confirmed number of papers.',
      'Returning Students: (1) Pay your Annual Subscription (if not already paid) → (2) Proceed directly to Exam Registration.',
    ],
  },
  {
    num: 9,
    q: 'How long does it take to complete the ICAN programme?',
    a: 'Examinations hold twice every year: ATSWA in March & September (2 exam days: second-to-last Tue & Wed) and ICAN in May & November (3 exam days: first Tue, Wed & Thu). Estimated completion time without carryovers:',
    bullets: [
      'ATSWA Route (O’Level → AAT → ACA): ~2.5 years',
      'Graduate starting from Foundation Level: ~1.5 years',
      'Graduate starting from Skills Level: ~1 year',
      'Accounting graduate from an MCATI institution (starting at Professional): ~6 months – 1 year',
    ],
  },
  {
    num: 10,
    q: 'Is ICAN difficult?',
    a: 'Yes and No. ICAN is rigorously examined, but with structured preparation, consistent daily study, strong interest and discipline, it is completely achievable.',
    tagline: '“If I can, you CAN. That’s why it’s ICAN.”',
  },
];

export const TERTIARY_DISCIPLINES = [
  'Accounting',
  'Finance',
  'Banking and Finance',
  'Business Administration',
  'Economics',
  'Taxation',
  'Auditing',
  'Public Administration',
  'Management',
  'Entrepreneurship',
  'Business Education',
  'Other Related Disciplines',
];

export const GENERAL_LEARNER_TRACKS = [
  { title: 'Financial Literacy', desc: 'Master cash flow, savings ratios, inflation protection and sound money decisions.' },
  { title: 'Bookkeeping', desc: 'Double-entry ledgers, source documents, trial balance and clean SME books.' },
  { title: 'Business Accounting', desc: 'Income statements, statements of financial position and working capital control.' },
  { title: 'Personal Finance', desc: 'Budgeting frameworks, net-worth tracking, ethical investing and goal planning.' },
  { title: 'Introductory Taxation', desc: 'Fundamentals of Nigerian PAYE, VAT, WHT, CIT and compliance timelines.' },
  { title: 'Basic Financial Management', desc: 'Time value of money, cost of capital basics, pricing and capital budgeting.' },
];

export const PROFESSIONAL_QUALIFICATIONS = [
  { code: 'ACA', name: 'Associate Chartered Accountant (ICAN)' },
  { code: 'FCA', name: 'Fellow Chartered Accountant (ICAN)' },
  { code: 'ACCA', name: 'Association of Chartered Certified Accountants' },
  { code: 'CPA', name: 'Certified Public Accountant' },
  { code: 'AAT', name: 'Associate Accounting Technician (ATSWA)' },
  { code: 'ACTI / CIMA', name: 'Other Recognised Accounting & Tax Qualifications' },
];

export const ALL_ATSWA_COURSES = ATSWA_LEVELS.flatMap((lvl) =>
  lvl.courses.map((course) => ({
    ...course,
    level: lvl.code,
    levelId: lvl.id,
  }))
);

const ATSWA_PQ_COVER_META = {
  'ATS 1': {
    colourBadge: 'Blue Cover · ATS 1',
    accentHex: '#2563EB',
  },
  'ATS 2': {
    colourBadge: 'Orange Cover · ATS 2',
    accentHex: '#EA580C',
  },
  'ATS 3': {
    colourBadge: 'Dark Green Cover · ATS 3',
    accentHex: '#15803D',
  },
};

/**
 * VALENCE Store Catalogue (Admin-Editable from Admin Portal)
 * - 12 ATSWA Past Questions (PER COURSE: ₦5,500 per course, each with its own course-specific cover, 9% off 2+)
 * - 3 ATSWA Study Packs (ATS 1, ATS 2, ATS 3: ₦9,500 per pack, automatic 5% off 2+ packs)
 * - 15 ICAN Pathfinder Past Questions (PER COURSE: ₦9,000 per course, each with its own course-specific Pathfinder cover, 6% off 2+)
 * - 15 ICAN Study Packs (PER COURSE: ₦10,000–₦15,500, each with its own Study Text cover, 7% off 2+ distinct courses)
 * Total: 45 individual orderable items.
 */
export const STORE_PRODUCTS = [
  // 12 Individual Per-Course ATSWA Insight Past Questions (₦5,500 per course)
  ...ALL_ATSWA_COURSES.map((course) => {
    const meta = ATSWA_PQ_COVER_META[course.level] || ATSWA_PQ_COVER_META['ATS 1'];
    return {
      id: `prod-atswa-pq-${course.id}`,
      title: `${course.title} (${course.code}) · ${course.level} Past Questions`,
      category: 'atswa_past_question',
      categoryLabel: 'ATSWA Past Questions (Per Course)',
      programme: 'ATSWA',
      level: course.level,
      courseCode: course.code,
      courseTitle: course.title,
      price: 5500,
      imageUrl: `/materials/atswa-pq-${course.id}.jpg`,
      colourBadge: `${meta.colourBadge} · ${course.code}`,
      accentHex: meta.accentHex,
      editionLabel: 'ATSWA Insight · Per Course',
      discountHint: '₦5,500/course · 9% off 2+ courses',
      isStudyPack: false,
      isAvailable: true,
      availabilityStatus: 'available',
      availabilityNote: 'In stock · Ready for dispatch',
      deliveryNote: 'Same-day delivery in Lagos · 1-day delivery outside Lagos',
      description: `Official ${course.level} Insight hard-copy past questions & answers specifically for ${course.title} (${course.code}). Same-day delivery within Lagos and 1-day delivery outside Lagos. Combine 2+ courses for automatic 9% off.`,
    };
  }),
  // 3 ATSWA Study Packs (live availability updated by Admin; delivered when available)
  {
    id: 'prod-atswa-sp-1',
    title: 'ATSWA ATS 1 Study Pack',
    category: 'atswa_study_pack',
    categoryLabel: 'ATSWA Study Pack',
    programme: 'ATSWA',
    level: 'ATS 1',
    courseCode: null,
    price: 9500,
    imageUrl: null,
    colourBadge: 'Blue Edition · ATS 1',
    accentHex: '#2563EB',
    editionLabel: 'ATS 1 Study Pack',
    discountHint: '5% off 2+ packs',
    isStudyPack: true,
    isAvailable: true,
    availabilityStatus: 'available',
    availabilityNote: 'Available · Updated by Admin',
    deliveryNote: 'Delivered when available (live status updated by Admin)',
    description: 'Complete printed ATS 1 syllabus study pack covering Basic Accounting Processes & Systems, Economics, Business Law & Communication Skills. Delivered when available.',
  },
  {
    id: 'prod-atswa-sp-2',
    title: 'ATSWA ATS 2 Study Pack',
    category: 'atswa_study_pack',
    categoryLabel: 'ATSWA Study Pack',
    programme: 'ATSWA',
    level: 'ATS 2',
    courseCode: null,
    price: 9500,
    imageUrl: null,
    colourBadge: 'Orange Edition · ATS 2',
    accentHex: '#EA580C',
    editionLabel: 'ATS 2 Study Pack',
    discountHint: '5% off 2+ packs',
    isStudyPack: true,
    isAvailable: true,
    availabilityStatus: 'available',
    availabilityNote: 'Available · Updated by Admin',
    deliveryNote: 'Delivered when available (live status updated by Admin)',
    description: 'Complete printed ATS 2 syllabus study pack covering Financial Accounting, Public Sector Accounting, Quantitative Analysis & Information Technology. Delivered when available.',
  },
  {
    id: 'prod-atswa-sp-3',
    title: 'ATSWA ATS 3 Study Pack',
    category: 'atswa_study_pack',
    categoryLabel: 'ATSWA Study Pack',
    programme: 'ATSWA',
    level: 'ATS 3',
    courseCode: null,
    price: 9500,
    imageUrl: null,
    colourBadge: 'Green Edition · ATS 3',
    accentHex: '#15803D',
    editionLabel: 'ATS 3 Study Pack',
    discountHint: '5% off 2+ packs',
    isStudyPack: true,
    isAvailable: true,
    availabilityStatus: 'available',
    availabilityNote: 'Available · Updated by Admin',
    deliveryNote: 'Delivered when available (live status updated by Admin)',
    description: 'Complete printed ATS 3 syllabus study pack covering Cost Accounting, Auditing, Taxation & Management for final AAT candidates. Delivered when available.',
  },
  // 15 Individual Per-Course ICAN Pathfinder Past Questions (₦9,000 per course)
  ...ALL_ICAN_COURSES.map((course) => {
    const slug = course.code.toLowerCase().replace('/', '');
    return {
      id: `prod-ican-pq-${slug}`,
      title: `${course.title} (${course.code}) · Pathfinder Past Questions`,
      category: 'ican_past_question',
      categoryLabel: 'ICAN Past Questions (Per Course)',
      programme: 'ICAN',
      level: course.level,
      courseCode: course.code,
      courseTitle: course.title,
      price: 9000,
      imageUrl: `/materials/ican-pq-${slug}.jpg`,
      colourBadge: `${course.code} Pathfinder · ${course.level}`,
      accentHex: '#16A34A',
      editionLabel: 'Nylon-Sealed Pathfinder · Per Course',
      discountHint: '₦9,000/course · 6% off 2+ courses',
      isStudyPack: false,
      isAvailable: true,
      availabilityStatus: 'available',
      availabilityNote: 'In stock · Ready for dispatch',
      deliveryNote: 'Same-day delivery in Lagos · 1-day delivery outside Lagos',
      description: `Nylon-sealed green ICAN Pathfinder past questions & answers (new syllabus) for ${course.title} (${course.code}) (${course.level} Level). Same-day delivery within Lagos and 1-day delivery outside Lagos; 6% off 2+ courses.`,
    };
  }),
  // 15 Individual Per-Course ICAN Study Packs (₦10,000 to ₦15,500 per course; delivered when available)
  ...ALL_ICAN_COURSES.map((course) => {
    const slug = course.code.toLowerCase().replace('/', '');
    return {
      id: `prod-ican-sp-${slug}`,
      title: `${course.title} (${course.code}) Study Pack`,
      category: 'ican_study_pack',
      categoryLabel: 'ICAN Study Pack',
      programme: 'ICAN',
      level: course.level,
      courseCode: course.code,
      courseTitle: course.title,
      price: course.studyPackPrice,
      imageUrl: `/materials/ican-sp-${slug}.jpg`,
      colourBadge: `${course.code} Study Text`,
      accentHex: '#2563EB',
      editionLabel: 'Official ICAN Study Text',
      discountHint: '7% off 2+ distinct ICAN packs',
      isStudyPack: true,
      isAvailable: true,
      availabilityStatus: 'available',
      availabilityNote: 'Available · Updated by Admin',
      deliveryNote: 'Delivered when available (live status updated by Admin)',
      description: `Official ICAN ${course.level} Level Study Text for ${course.title} (${course.code}), 2026 syllabus edition. Live stock status updated by Admin; delivered when available.`,
    };
  }),
];

export const ATSWA_APP_REGISTRATION_GUIDE = [
  {
    step: '01',
    title: 'Confirm Your Starting ATS Level',
    detail: "O'Level or non-accounting ND starts at ATS 1 · ND Banking & Finance starts at ATS 2 (exempt ATS 1) · ND Accounting starts at ATS 3 (exempt ATS 1 & 2).",
  },
  {
    step: '02',
    title: 'Prepare & Check Required Documents In-App',
    detail: "ATS 1 requires a clear passport photograph, O'Level result (WAEC/NECO/NABTEB) and birth certificate. ATS 2 & ATS 3 require your previous ATS pass slip or approved ND exemption slip plus subscription evidence.",
  },
  {
    step: '03',
    title: 'Submit Documents & Registration Details on VALENCE',
    detail: 'Upload your documents and submit registration/document questions directly inside your VALENCE Student Portal, our academic team reviews and updates your status in-app.',
  },
  {
    step: '04',
    title: 'Complete Exam Entry Before the 7-Day Cutoff',
    detail: 'Register for your March or September 2-day diet (second-to-last Tuesday & Wednesday) at least 1 week before Exam Day 1, and optionally unlock online tuition (₦3,000) whenever ready.',
  },
];

export const DELIVERY_ZONES = [
  { id: 'zone-lasu', name: 'LASU (Lagos State University Campus)', regionType: 'lagos', fee: 0, isFree: true, pqEta: 'Same-day delivery', studyPackEta: 'Delivered when available', eta: 'Same-day (Past Qs) · When available (Study Packs)' },
  { id: 'zone-ojo', name: 'Ojo Axis, Lagos', regionType: 'lagos', fee: 0, isFree: true, pqEta: 'Same-day delivery', studyPackEta: 'Delivered when available', eta: 'Same-day (Past Qs) · When available (Study Packs)' },
  { id: 'zone-unilag', name: 'UNILAG (Akoka Campus)', regionType: 'lagos', fee: 0, isFree: true, pqEta: 'Same-day delivery', studyPackEta: 'Delivered when available', eta: 'Same-day (Past Qs) · When available (Study Packs)' },
  { id: 'zone-yabatech', name: 'YABATECH Campus', regionType: 'lagos', fee: 0, isFree: true, pqEta: 'Same-day delivery', studyPackEta: 'Delivered when available', eta: 'Same-day (Past Qs) · When available (Study Packs)' },
  { id: 'zone-fce', name: 'FCE (Akoka)', regionType: 'lagos', fee: 0, isFree: true, pqEta: 'Same-day delivery', studyPackEta: 'Delivered when available', eta: 'Same-day (Past Qs) · When available (Study Packs)' },
  { id: 'zone-yaba', name: 'Yaba Axis, Lagos', regionType: 'lagos', fee: 0, isFree: true, pqEta: 'Same-day delivery', studyPackEta: 'Delivered when available', eta: 'Same-day (Past Qs) · When available (Study Packs)' },
  { id: 'zone-lagos-mainland', name: 'Other Lagos Mainland Locations', regionType: 'lagos', fee: 2500, isFree: false, pqEta: 'Same-day delivery', studyPackEta: 'Delivered when available', eta: 'Same-day (Past Qs) · When available (Study Packs)' },
  { id: 'zone-lagos-island', name: 'Lagos Island / Lekki / Ajah', regionType: 'lagos', fee: 3500, isFree: false, pqEta: 'Same-day delivery', studyPackEta: 'Delivered when available', eta: 'Same-day (Past Qs) · When available (Study Packs)' },
  { id: 'zone-southwest', name: 'Outside Lagos: South-West States (Ogun, Oyo, Osun, Ondo, Ekiti)', regionType: 'outside_lagos', fee: 4500, isFree: false, pqEta: '1-day (next-day) delivery', studyPackEta: 'Delivered when available', eta: '1 day / Next-day (Past Qs) · When available (Study Packs)' },
  { id: 'zone-nationwide', name: 'Outside Lagos: Abuja, Port Harcourt & All Other States', regionType: 'outside_lagos', fee: 6000, isFree: false, pqEta: '1-day (next-day) delivery', studyPackEta: 'Delivered when available', eta: '1 day / Next-day (Past Qs) · When available (Study Packs)' },
];

export const VALENCE_PILLARS = [
  {
    id: 'learn',
    code: 'VALENCE LEARN',
    title: 'Structured Tuition, AI Tutor & Exam Mastery',
    description: 'Authorised Google Meet classes, syllabus reading trackers, study-hour streaks, exam readiness analytics, central diet timetables and our 7-step AI Accounting Tutor.',
    route: '/programmes',
    metric: '15 Learning Tools',
  },
  {
  },
  {
    id: 'compete',
    code: 'VALENCE COMPETE',
    title: 'National Inter-School Challenge & ₦500,000 Podium Pool',
    description: 'Nigeria’s inter-school championship across universities, polytechnics, colleges and exam divisions, testing accounting and related fields (finance, tax, audit, economics, business law & management) with a ₦500,000 podium prize pool after every competition.',
    route: '/competitions',
    metric: '₦250,000 / ₦150,000 / ₦100,000 Podium',
  },
  {
    id: 'marketplace',
    code: 'VALENCE MARKETPLACE',
    title: 'Study Packs, Per-Course Past Questions & Library',
    description: 'Order a single course or all applicable courses, per-course ATSWA (₦5,500) & ICAN (₦9,000) past questions, study packs with up to 9% automatic discounts, Paystack checkout, free campus delivery and in-app delivery enquiries.',
    route: '/store',
    metric: '45 Items · 6 Free Hubs',
  },
  {
    id: 'advertise',
    code: 'VALENCE ADVERTISE',
    title: 'Physical Centres, Textbook Authors & Vendors (₦10k/Wk)',
    description: '100% in-app advertising at ₦10,000/week for verified physical tuition centres, accounting textbook authors and verified textbook vendors nationwide (all online tuition stays in-app via VALENCE-verified tutors).',
    route: '/advertise',
    metric: '₦10,000 / Week · In-App',
  },
  {
    id: 'opportunities',
    code: 'VALENCE OPPORTUNITIES',
    title: 'Scholarships, Internships & Finance Careers',
    description: 'Curated audit internships, examination scholarships, graduate trainee intakes, tax fellowships, workshops and professional development opportunities across Nigeria.',
    route: '/opportunities',
    metric: 'Verified Listings',
  },
];

/**
 * Verified Live Partner Directories (Populated dynamically from Admin-approved Supabase records).
 * Zero fake/placeholder businesses or personas are shown before verification.
 */
export const FEATURED_TUITION_CENTRES = [];

export const FEATURED_TEXTBOOK_ADVERTISERS = [];

export const FEATURED_TUTORS = [];

export const LATEST_OPPORTUNITIES = [];

export const UPCOMING_EVENTS = [
  {
    id: 'evt-1',
    type: 'Live Online Class',
    programme: 'ATSWA · March 2027 Diet',
    title: 'March 2027 Diet Orientation (Exam: Tue 23 & Wed 24 Mar 2027)',
    date: '7 Dec 2026 · 6:00 PM WAT',
    mode: 'Authorised Google Meet',
    access: 'Enrolled ATSWA Students',
  },
  {
    id: 'evt-2',
    type: 'Revision Workshop',
    programme: 'ICAN · May 2027 Diet',
    title: 'May 2027 Diet Kickoff (Exam: Tue 4 – Thu 6 May 2027)',
    date: '11 Jan 2027 · 7:00 PM WAT',
    mode: 'Authorised Google Meet',
    access: 'Enrolled ICAN Students',
  },
  {
    id: 'evt-4',
    type: '₦500,000 Podium Prize Competition',
    programme: 'VALENCE COMPETE',
    title: 'VALENCE National Inter-School Challenge: Qualifier & Podium Prize Briefing',
    date: '23 Jan 2027 · 4:00 PM WAT',
    mode: 'Live Inter-University Session',
    access: 'Verified Schools & Candidates',
  },
];

export const ANNOUNCEMENTS_FEED = [
  {
    id: 'ann-official-1',
    isOfficial: true,
    pinned: true,
    authorName: 'VALENCE Central Examination Authority',
    authorCategory: 'Official Examination Schedule & Timetable Desk',
    verifiedBadge: 'Official Notice',
    category: 'Examination Updates',
    audience: 'Public · All Candidates',
    title: '2027 Diet Dates, 7-Day Registration Cutoffs & Nov 2026 Result Countdown Active',
    content:
      'ATSWA March 2027 holds Tue 23 & Wed 24 Mar 2027 (exam registration closes Tue 16 Mar). ICAN May 2027 holds Tue 4, Wed 5 & Thu 6 May 2027 (registration closes Tue 27 Apr), subject to official Institute updates posted here. Meanwhile, the 30-day provisional result countdown for ICAN November 2026 is now live.',
    timestamp: 'Pinned Notice',
    likes: 0,
    comments: 0,
  },
  {
    id: 'ann-official-2',
    isOfficial: true,
    pinned: false,
    authorName: 'VALENCE Marketplace Desk',
    authorCategory: 'Official Bookstore & Campus Delivery Operations',
    verifiedBadge: 'Official Notice',
    category: 'Study Materials',
    audience: 'Public · ATSWA & ICAN Candidates',
    title: 'Per-Course Past Questions (Same-Day Lagos, 1-Day Outside Lagos) & Study Packs Live',
    content:
      'All Past Questions (12 ATSWA papers at ₦5,500/course, 9% off 2+; 15 ICAN Pathfinder papers at ₦9,000/course, 6% off 2+) deliver the same day within Lagos and within 1 day outside Lagos, with free delivery to LASU, Ojo, UNILAG, YABATECH, FCE and Yaba. ICAN and ATSWA Study Packs show live Admin-updated availability and are delivered when available.',
    timestamp: 'Official Update',
    likes: 0,
    comments: 0,
  },
  {
    id: 'ann-official-3',
    isOfficial: true,
    pinned: false,
    authorName: 'VALENCE Advertise & Partner Desk',
    authorCategory: 'Partner Verification & Directory Onboarding',
    verifiedBadge: 'Official Notice',
    category: 'Partner Onboarding',
    audience: 'Public · Centres, Authors & Book Vendors',
    title: 'Onboarding Open: Physical Tuition Centres, Textbook Authors & Verified Book Vendors',
    content:
      'Verified physical (in-person) tuition centres, accounting textbook authors, and verified textbook vendors can now apply directly in-app at ₦10,000/week. Textbook authors and bookshops receive built-in in-app student enquiries plus optional in-app Paystack checkout.',
    timestamp: 'Official Update',
    likes: 0,
    comments: 0,
  },
];

export const TESTIMONIALS = [
  {
    id: 'std-1',
    quote:
      'Create a student, undergraduate, polytechnic, college or professional account at zero cost. The one-time ₦3,000 per-level unlock reveals in-app online tuition alongside the verified cost implications set directly by physical tuition centres advertising on VALENCE.',
    name: 'Transparent Student-First Access',
    role: 'Free Membership · Paystack-Verified Checkout',
  },
  {
    id: 'std-2',
    quote:
      'Every online tuition class on VALENCE is taught inside the app by manually verified tutors (minimum AAT for ATSWA; both AAT and ACA for ICAN) who also pass our timed 20-question assessment.',
    name: 'Strictly Verified In-App Faculty',
    role: 'AAT & ACA Credential Authentication',
  },
  {
    id: 'std-3',
    quote:
      'Zero fake listings and zero pirated books. Physical tuition centres, textbook authors, bookshops, institutions and chartered professionals undergo Admin review before going live on VALENCE.',
    name: '100% Verified Ecosystem & NDPA Privacy',
    role: '24/7 Support · Auditable Governance',
  },
];

export const PLATFORM_STATISTICS = [
  {
    id: 'stat-1',
    label: 'Nigerian Institutions Embedded',
    value: UNIVERSITY_COUNTS.total,
    prefix: '',
    suffix: '+',
    detail: `${UNIVERSITY_COUNTS.universities} Universities · ${UNIVERSITY_COUNTS.polytechnics} Polytechnics · ${UNIVERSITY_COUNTS.colleges} Colleges`,
  },
  {
    id: 'stat-2',
    label: 'Podium Cash Prize Pool',
    value: 500000,
    prefix: '₦',
    suffix: '',
    detail: '₦100,000 (1st) · ₦70,000 (2nd) · ₦50,000 (3rd) after every competition closes',
  },
  {
    id: 'stat-3',
    label: 'ATSWA & ICAN Papers',
    value: 27,
    prefix: '',
    suffix: '',
    detail: '12 ATSWA (2-Day Exam) · 15 ICAN (3-Day Exam)',
  },
  {
    id: 'stat-4',
    label: 'Result Countdown Window',
    value: 30,
    prefix: '',
    suffix: ' Days',
    detail: 'Auto-starts after last exam day (admin-adjustable)',
  },
  {
    id: 'stat-5',
    label: 'Academic Discussion Forums',
    value: 12,
    prefix: '',
    suffix: '',
    detail: 'Free VALENCE membership; ₦3k only for tuition',
  },
  {
    id: 'stat-6',
    label: 'Free Campus Delivery Zones',
    value: 6,
    prefix: '',
    suffix: '',
    detail: 'LASU, Ojo, UNILAG, YABATECH, FCE, Yaba',
  },
];

export const FAQS = [
  {
    q: 'Do I have to pay ₦3,000 just to sign up on VALENCE, and what determines the cost implication I unlock?',
    a: 'No. Creating a VALENCE account is completely free across students, university/polytechnic/college learners and professionals. The one-time ₦3,000 fee per level applies only when applying for tuition and unlocking cost implications for that ATSWA or ICAN level (never charged twice). It reveals in-app online tuition alongside the verified physical tuition cost implications set directly by each physical tuition centre advertising on VALENCE, plus official exam and subscription fees.',
  },
  {
    q: 'When do ATSWA and ICAN examinations hold, and when does registration close?',
    a: 'ATSWA exams run for 2 days on the second-to-last Tuesday and Wednesday of March and September. ICAN exams span 3 days on the first Tuesday, Wednesday and Thursday of May and November. Exam registration closes 1 week (7 days) before Day 1 for both programmes. Because the Institute occasionally adjusts dates, VALENCE’s Central Examination Authority publishes and updates official exam dates and full paper timetables dynamically.',
  },
  {
    q: 'How does the post-examination result release countdown work?',
    a: 'Immediately after the final examination day of any ATSWA or ICAN diet concludes, VALENCE automatically starts a 30-day countdown to the expected result release date. Because official release can occasionally experience delays, the Central Examination Authority updates the timer and posts status notices whenever the Institute adjusts release timing.',
  },
  {
    q: 'How does the VALENCE National Inter-School Challenge & podium prize pool work?',
    a: 'The VALENCE National Inter-School Challenge brings together students across universities, polytechnics, colleges and exam divisions, with questions grounded in accounting and related fields (financial & management accounting, audit, tax, finance, economics, business law, quantitative methods and management). Strictly only 4 students can compete in each school. After every competition closes, outstanding learners earn a verified ₦500,000 podium cash prize pool: ₦250,000 for 1st position, ₦150,000 for 2nd position and ₦100,000 for 3rd position, and the winning students are displayed on their respective school’s official VALENCE profile as Top VALENCE Students, alongside digital certificates and Hall of Fame recognition.',
  },
  {
    q: 'Are Nigerian universities, polytechnics and colleges supported on VALENCE?',
    a: `Yes. VALENCE includes a built-in searchable directory of ${UNIVERSITY_COUNTS.total}+ accredited Nigerian tertiary institutions (${UNIVERSITY_COUNTS.universities} Federal, State and Private universities, ${UNIVERSITY_COUNTS.polytechnics} polytechnics, and ${UNIVERSITY_COUNTS.colleges} colleges of education and specialist colleges) across all 36 states and FCT Abuja, plus custom entry for any newly licensed institution.`,
  },
  {
    q: 'How are online payments, store enquiries, ATSWA guidance and WhatsApp support handled?',
    a: 'Paystack is the exclusive online checkout across all of VALENCE (tuition application unlocks, in-app online tuition, store orders, optional advertised textbook orders and ₦10,000/week advertising), verified server-side before access is granted. ATSWA document & registration guidance, study materials & delivery enquiries, and VALENCE ADVERTISE bookings all run directly inside the app. WhatsApp (+234 915 434 4663, 24/7) handles official ICAN fee/exemption assistance and general customer support.',
  },
  {
    q: 'How fast is delivery for Past Questions and Study Packs, and how do discounts work?',
    a: 'All Past Questions are delivered the SAME DAY within Lagos and within 1 DAY (next day) outside Lagos across Nigeria, with FREE delivery to LASU, Ojo, UNILAG, YABATECH, FCE and Yaba. ATSWA past questions are ₦5,500/course (9% off 2+ courses/copies) and ICAN Pathfinder past questions are ₦9,000/course (6% off 2+ courses/copies). Study Packs (ATSWA ₦9,500/pack with 5% off 2+; ICAN ₦10,000 to ₦15,500/course with 7% off 2+ distinct courses) display live availability updated by the Admin team and are delivered when available.',
  },
  {
    q: 'Who can advertise on VALENCE, and how do students buy from textbook authors & vendors?',
    a: 'Three verified categories can advertise 100% inside VALENCE at ₦10,000 per week: (1) verified physical (in-person) accounting tuition centres, (2) accounting textbook authors promoting original books they sell, and (3) verified textbook vendors/bookshops stocking genuine accounting texts. Textbook authors and vendors receive built-in in-app student enquiries plus optional in-app Paystack checkout so students can safely enquire and purchase without leaving VALENCE. External online tuition is never advertised; all online tuition runs in-app with VALENCE-verified tutors.',
  },
];

/**
 * Admin-Editable General Life & Wisdom Quote Bank
 * Pops up randomly across VALENCE to encourage, ground and inspire users in life and growth.
 */
export const MOTIVATIONAL_QUOTES = [
  {
    id: 'mq-1',
    tag: 'TIMELESS WISDOM',
    quote: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.',
    author: 'Aristotle',
  },
  {
    id: 'mq-2',
    tag: 'RESILIENCE',
    quote: 'It always seems impossible until it is done.',
    author: 'Nelson Mandela',
  },
  {
    id: 'mq-3',
    tag: 'SELF-MASTERY',
    quote: 'You have power over your mind, not outside events. Realize this, and you will find strength.',
    author: 'Marcus Aurelius',
  },
  {
    id: 'mq-4',
    tag: 'LIFE & PURPOSE',
    quote: 'Luck is what happens when preparation meets opportunity.',
    author: 'Seneca',
  },
  {
    id: 'mq-5',
    tag: 'AFRICAN WISDOM',
    quote: 'However long the night, the dawn will break.',
    author: 'African Proverb',
  },
  {
    id: 'mq-6',
    tag: 'STEADY PROGRESS',
    quote: 'It does not matter how slowly you go as long as you do not stop.',
    author: 'Confucius',
  },
  {
    id: 'mq-7',
    tag: 'COURAGE',
    quote: 'Do what you can, with what you have, where you are.',
    author: 'Theodore Roosevelt',
  },
  {
    id: 'mq-8',
    tag: 'BEGIN TODAY',
    quote: 'A journey of a thousand miles begins with a single step.',
    author: 'Lao Tzu',
  },
  {
    id: 'mq-9',
    tag: 'CHARACTER',
    quote: 'Success is to be measured not so much by the position one has reached in life as by the obstacles overcome while trying to succeed.',
    author: 'Booker T. Washington',
  },
  {
    id: 'mq-10',
    tag: 'INNER STRENGTH',
    quote: 'First say to yourself what you would be, and then do what you have to do.',
    author: 'Epictetus',
  },
  {
    id: 'mq-11',
    tag: 'GROWTH',
    quote: 'Do the best you can until you know better. Then when you know better, do better.',
    author: 'Maya Angelou',
  },
  {
    id: 'mq-12',
    tag: 'PERSPECTIVE',
    quote: 'In the middle of every difficulty lies opportunity.',
    author: 'Albert Einstein',
  },
  {
    id: 'mq-13',
    tag: 'DAILY EFFORT',
    quote: 'Success is the sum of small efforts, repeated day in and day out.',
    author: 'Robert Collier',
  },
  {
    id: 'mq-14',
    tag: 'VISION',
    quote: 'The future belongs to those who believe in the beauty of their dreams.',
    author: 'Eleanor Roosevelt',
  },
  {
    id: 'mq-15',
    tag: 'COMMUNITY & LIFE',
    quote: 'If you want to go fast, go alone. If you want to go far, go together.',
    author: 'African Proverb',
  },
  {
    id: 'mq-16',
    tag: 'PREPARATION',
    quote: 'The best time to plant a tree was twenty years ago. The second best time is now.',
    author: 'Proverb',
  },
  {
    id: 'mq-17',
    tag: 'CLARITY',
    quote: 'He who has a why to live can bear almost any how.',
    author: 'Friedrich Nietzsche',
  },
  {
    id: 'mq-18',
    tag: 'MOMENTUM',
    quote: 'The secret of getting ahead is getting started.',
    author: 'Mark Twain',
  },
  {
    id: 'mq-19',
    tag: 'INTEGRITY',
    quote: 'Waste no more time arguing about what a good person should be. Be one.',
    author: 'Marcus Aurelius',
  },
  {
    id: 'mq-20',
    tag: 'PATIENCE',
    quote: 'Rivers know this: there is no hurry. We shall get there some day.',
    author: 'A. A. Milne',
  },
  {
    id: 'mq-21',
    tag: 'DETERMINATION',
    quote: 'One child, one teacher, one book and one pen can change the world.',
    author: 'Malala Yousafzai',
  },
  {
    id: 'mq-22',
    tag: 'FREEDOM OF CHOICE',
    quote: 'When we are no longer able to change a situation, we are challenged to change ourselves.',
    author: 'Viktor E. Frankl',
  },
  {
    id: 'mq-23',
    tag: 'HUMILITY & WISDOM',
    quote: 'Knowing others is intelligence; knowing yourself is true wisdom. Mastering others is strength; mastering yourself is true power.',
    author: 'Lao Tzu',
  },
  {
    id: 'mq-24',
    tag: 'PERSEVERANCE',
    quote: 'Smooth seas do not make skillful sailors.',
    author: 'African Proverb',
  },
  {
    id: 'mq-25',
    tag: 'ACTION',
    quote: 'Well done is better than well said.',
    author: 'Benjamin Franklin',
  },
  {
    id: 'mq-26',
    tag: 'SELF-BELIEF',
    quote: 'What lies behind us and what lies before us are tiny matters compared to what lies within us.',
    author: 'Ralph Waldo Emerson',
  },
  {
    id: 'mq-27',
    tag: 'DISCIPLINE',
    quote: 'We must all suffer one of two things: the pain of discipline or the pain of regret.',
    author: 'Jim Rohn',
  },
  {
    id: 'mq-28',
    tag: 'PURPOSE',
    quote: 'Act as if what you do makes a difference. It does.',
    author: 'William James',
  },
  {
    id: 'mq-29',
    tag: 'SHARPEN YOUR CRAFT',
    quote: 'Give me six hours to chop down a tree and I will spend the first four sharpening the axe.',
    author: 'Abraham Lincoln',
  },
  {
    id: 'mq-30',
    tag: 'HOPE & COURAGE',
    quote: 'Do not judge me by my successes; judge me by how many times I fell down and got back up again.',
    author: 'Nelson Mandela',
  },
];

export const DISCUSSION_CATEGORIES = [
  'Financial Accounting',
  'Management Accounting',
  'Taxation',
  'Audit',
  'Financial Reporting',
  'Public Sector Accounting',
  'Financial Management',
  'Economics',
  'Business Law',
  'University Accounting',
  'Examination Techniques',
  'Career Development',
];

export const COMPETITION_DIVISIONS = [
  { id: 'div-atswa', name: 'ATSWA Challenge', level: 'ATS 1 – ATS 3', reward: '₦250,000 / ₦150,000 / ₦100,000 Podium Pool', format: '30 MCQ + 20 Short-Answer + Answer 4 of 6 Theory (12.5 marks each = 50m Section C)' },
  { id: 'div-ican-fnd', name: 'ICAN Foundation Challenge', level: 'CBL · BE · MA · FA', reward: '₦250,000 / ₦150,000 / ₦100,000 Podium Pool', format: 'Section A: 30m compulsory · Section B: 2 of 3 (20m each = 40m) · Section C: 2 of 4 (15m each = 30m) = 100m' },
  { id: 'div-ican-skl', name: 'ICAN Skills Challenge', level: 'FR · FM · PSAF · AAF · TAX · PM', reward: '₦250,000 / ₦150,000 / ₦100,000 Podium Pool', format: 'Section A: 30m compulsory · Section B: 2 of 3 (20m each = 40m) · Section C: 2 of 4 (15m each = 30m) = 100m' },
  { id: 'div-ican-pro', name: 'ICAN Professional Challenge', level: 'SBR · CS · AAAF · A/TAX · SFM', reward: '₦250,000 / ₦150,000 / ₦100,000 Podium Pool', format: 'Section A: 30m compulsory · Section B: 2 of 3 (20m each = 40m) · Section C: 2 of 4 (15m each = 30m) = 100m' },
  { id: 'div-uni', name: 'National Inter-School Challenge (Tertiary)', level: `${UNIVERSITY_COUNTS.total} Universities, Polytechnics & Colleges · Max 4 per School`, reward: '₦250,000 / ₦150,000 / ₦100,000 Podium Pool', format: 'Inter-school individual & team tournament across 5 national rounds covering accounting, finance, tax, audit, economics, business law & management' },
  { id: 'div-pro', name: 'Professional Challenge', level: 'ACA · FCA · ACCA · CPA (Optional Division)', reward: '₦250,000 / ₦150,000 / ₦100,000 Podium Pool', format: 'Executive IFRS, corporate finance, tax strategy, forensic assurance & boardroom advisory showcase' },
];

export const COMPETITION_REWARD = {
  amount: 100000,
  currency: 'NGN',
  firstPrize: 100000,
  secondPrize: 70000,
  thirdPrize: 50000,
  totalPodiumPool: 500000,
  maxCompetitorsPerSchool: 4,
  summary:
    'Learners who excel in the VALENCE National Inter-School Challenge and exam divisions (with questions grounded in accounting and related fields) earn a podium cash prize pool of ₦500,000 after every competition closes: ₦250,000 for 1st position, ₦150,000 for 2nd position and ₦100,000 for 3rd position. Winning students are displayed on their respective school’s official VALENCE profile as Top VALENCE Students.',
  eligibilityRules: [
    'Open to verified ATSWA, ICAN, university, polytechnic, college and general accounting candidates.',
    'Strictly only 4 students can compete in each school.',
    'Awarded after final scoring, anti-cheat audit and appeals review conclude at competition close.',
    'Identity and candidate standing verified before audited podium payout disbursement (₦250,000 / ₦150,000 / ₦100,000).',
    'Top three winners are permanently featured on their school’s VALENCE profile as Top VALENCE Students, alongside verifiable digital merit certificates and VALENCE Hall of Fame induction.',
  ],
};

export const COMPETITION_STRUCTURES = {
  atswa: {
    name: 'ATSWA Competition Paper Structure',
    totalMarks: 100,
    sections: [
      {
        label: 'Section A: Multiple Choice Questions (Compulsory)',
        detail: '30 objective questions × 1 mark each (auto-graded on submission)',
        marks: 30,
      },
      {
        label: 'Section B: Short-Answer Questions (Compulsory)',
        detail: '20 short-answer items × 1 mark each (structured precision check)',
        marks: 20,
      },
      {
        label: 'Section C: Theory & Practical Workings',
        detail: 'Answer any 4 out of 6 questions × 12.5 marks each (human rubric grading)',
        marks: 50,
      },
    ],
  },
  ican: {
    name: 'ICAN Competition Paper Structure',
    totalMarks: 100,
    sections: [
      {
        label: 'Section A: Compulsory Core Question(s)',
        detail: 'Mandatory foundational / scenario calculation & reporting section',
        marks: 30,
      },
      {
        label: 'Section B: Applied Technical Scenarios',
        detail: 'Answer any 2 out of 3 questions × 20 marks each (rubric graded)',
        marks: 40,
      },
      {
        label: 'Section C: Analytical & Advisory Questions',
        detail: 'Answer any 2 out of 4 questions × 15 marks each (rubric graded)',
        marks: 30,
      },
    ],
  },
};

/**
 * Page-Specific Top Moving Ticker Notices (Admin-Editable via Admin Portal / Supabase `page_ticker_notices`)
 * - Home (`/`) streams all 30 shuffled timeless life & wisdom quotes at a calm, readable pace.
 * - Every other route streams focused, field-relevant announcements tailored to that exact page.
 */
export const PAGE_TICKER_NOTICES = {
  programmes: {
    label: 'Programmes',
    items: [
      { id: 'pg-1', text: 'Registration for ICAN and ATSWA examinations is currently ongoing across all levels. Prepare early and beat the 7-day exam registration cutoff.', tag: 'Registration Open' },
      { id: 'pg-2', text: 'ATSWA diets hold over 2 days (second-to-last Tuesday & Wednesday of March and September); ICAN diets hold over 3 days (first Tuesday to Thursday of May and November).', tag: 'Diet Calendar' },
      { id: 'pg-3', text: 'Need assistance with official ICAN registration, examination, annual subscription, development levy or exemption fees? Tap WhatsApp Support 24/7.', tag: 'Official ICAN Help' },
      { id: 'pg-4', text: 'ATSWA document review and starting-level guidance run 100% inside the VALENCE app.', tag: 'ATSWA Desk' },
      { id: 'pg-5', text: 'Unlock full level cost implications (in-app online tuition plus verified advertising physical tuition centre fees) with a one-time ₦3,000 fee per level.', tag: 'Cost Unlock' },
      { id: 'pg-6', text: 'Automatic 30-day post-exam result countdowns are maintained live by the VALENCE Central Examination Authority.', tag: 'Result Tracker' },
      { id: 'pg-7', text: 'Join the official VALENCE WhatsApp Channel for instant exam timetable, cutoff and diet announcements.', tag: 'WhatsApp Channel' },
    ],
  },
  atswa: {
    label: 'ATSWA Live',
    items: [
      { id: 'at-1', text: 'ATSWA registration is ongoing across ATS 1, ATS 2 and ATS 3. Confirm your entry at least 7 days before Examination Day 1.', tag: 'Registration Ongoing' },
      { id: 'at-2', text: "Starting-level guide: O'Level or non-accounting ND enters ATS 1; ND Banking & Finance enters ATS 2; ND Accounting enters ATS 3.", tag: 'Entry Pathways' },
      { id: 'at-3', text: "Upload and verify your O'Level, passport photograph, birth certificate or ND exemption slip right in the in-app ATSWA Guidance Desk below.", tag: 'In-App Guidance' },
      { id: 'at-4', text: 'In-app ATSWA online classes are led by verified AAT-certified tutors, with an automatic 25% discount on 2 or more courses.', tag: 'Online Tuition' },
      { id: 'at-5', text: 'ATSWA Insight Past Questions (₦5,500/course, 9% off 2+) deliver the same day within Lagos and within 1 day outside Lagos; Study Packs ship when available.', tag: 'Materials' },
      { id: 'at-6', text: 'One-time ₦3,000 per-level unlock reveals online tuition, official fees, and verified rates from physical tuition centres advertising on VALENCE.', tag: 'Cost Unlock' },
    ],
  },
  icanExemptions: {
    label: 'Exemptions',
    items: [
      { id: 'ex-1', text: 'ICAN student registration and exemption processing are ongoing. Check your eligible starting level and exempted papers instantly below.', tag: 'Exemption Check' },
      { id: 'ex-2', text: 'Download and cross-check the official ICAN Accredited Institutions list and MCATI partner institutions directory directly on this page.', tag: 'Accredited List' },
      { id: 'ex-3', text: 'AAT graduates, B.Sc./HND Accounting graduates and allied degree holders qualify for structured Foundation and Skills paper exemptions.', tag: 'Eligibility' },
      { id: 'ex-4', text: 'Need help filing your official ICAN exemption or paying statutory fees? Contact our 24/7 WhatsApp Support Desk.', tag: '24/7 Support' },
      { id: 'ex-5', text: 'Once exempted, order past questions only for the exact papers you need to sit (same-day delivery in Lagos, 1-day outside Lagos).', tag: 'Smart Ordering' },
    ],
  },
  icanGuide: {
    label: 'ICAN Guide',
    items: [
      { id: 'ig-1', text: 'Registration for ICAN Foundation, Skills and Professional diets is ongoing for both first-time applicants and returning candidates.', tag: 'Registration Open' },
      { id: 'ig-2', text: 'Read all 10 official ICAN candidate FAQs covering entry eligibility, ATSWA vs graduate pathways, exam steps and ACA completion timelines.', tag: 'Candidate Guide' },
      { id: 'ig-3', text: 'Access the official ICAN 2026 Syllabus PDF, examination docket portal, Accredited Institutions list and MCATI directory in one click.', tag: 'Official Docs' },
      { id: 'ig-4', text: 'Our 24/7 WhatsApp Desk assists candidates with official ICAN registration, annual subscription, development levy, exemption and exam fees.', tag: 'Fee Assistance' },
    ],
  },
  ican: {
    label: 'ICAN Live',
    items: [
      { id: 'ic-1', text: 'ICAN registration and examination entry are ongoing across Foundation (4 papers), Skills (6 papers) and Professional (5 papers).', tag: 'Registration Ongoing' },
      { id: 'ic-2', text: 'Exam registration closes 7 days before Day 1 of each May and November 3-day diet, followed by a live 30-day provisional result countdown.', tag: 'Diet Deadlines' },
      { id: 'ic-3', text: 'All in-app ICAN online classes are taught by manually verified tutors holding both AAT and ACA certificates, with 25% off 3 or more courses.', tag: 'Verified Tutors' },
      { id: 'ic-4', text: 'One-time ₦3,000 per-level unlock reveals online tuition alongside the exact verified cost implications of physical tuition centres advertising on VALENCE.', tag: 'Cost Unlock' },
      { id: 'ic-5', text: 'Sealed ICAN Pathfinder Past Questions (₦9,000/course, 6% off 2+) deliver the same day within Lagos and within 1 day outside Lagos; Study Packs show live availability.', tag: 'Fast Delivery' },
      { id: 'ic-6', text: 'Need official ICAN registration, exam fee, annual subscription, development levy or exemption assistance? Tap WhatsApp Support 24/7.', tag: '24/7 Assistance' },
    ],
  },
  tertiary: {
    label: 'Campus Hub',
    items: [
      { id: 'tr-1', text: '300 accredited Nigerian universities, polytechnics and colleges across all 36 states and FCT Abuja are embedded right inside VALENCE.', tag: '300 Institutions' },
      { id: 'tr-2', text: 'Free membership for every undergraduate, ND, HND, NCE and general accounting learner; ATSWA and ICAN registration is ongoing.', tag: 'Join Free' },
      { id: 'tr-3', text: 'Start ATSWA or ICAN while in school, join campus study groups and master 6 practical financial literacy tracks.', tag: 'Early Advantage' },
      { id: 'tr-4', text: 'Rally your campus team (only 4 students per school) for the VALENCE National Inter-School Challenge (accounting & related fields) and compete for the ₦250,000 / ₦150,000 / ₦100,000 podium prize pool.', tag: 'Inter-School' },
    ],
  },
  store: {
    label: 'Store & Delivery',
    items: [
      { id: 'st-1', text: 'All Past Questions deliver the SAME DAY within Lagos and within 1 DAY (next day) outside Lagos nationwide.', tag: 'Express Dispatch' },
      { id: 'st-2', text: 'Study Packs show live availability updated directly by Admin and are delivered as soon as available.', tag: 'Study Pack Status' },
      { id: 'st-3', text: 'Enjoy FREE delivery to LASU, Ojo, UNILAG, YABATECH, FCE and Yaba on eligible store orders.', tag: '6 Free Hubs' },
      { id: 'st-4', text: 'Automatic checkout discounts: 9% off 2+ ATSWA PQs (₦5,500/course), 6% off 2+ ICAN PQs (₦9,000/course), 5% off 2+ ATSWA Study Packs & 7% off 2+ distinct ICAN Study Packs.', tag: 'Auto Savings' },
      { id: 'st-5', text: 'Order a single paper or every paper applicable to you, secured exclusively via Paystack with in-app material and delivery enquiries.', tag: 'Paystack Secured' },
    ],
  },
  studyMaterials: {
    label: 'Study Library',
    items: [
      { id: 'sm-1', text: 'Complete syllabus coverage for all 12 ATSWA papers and all 15 ICAN papers, plus official ICAN 2026 Syllabus and Accredited Institution PDFs.', tag: '27 Courses' },
      { id: 'sm-2', text: 'Printed Past Questions deliver the same day within Lagos and within 1 day outside Lagos, with free campus delivery to LASU, Ojo, UNILAG, YABATECH, FCE & Yaba.', tag: 'Same-Day Lagos' },
      { id: 'sm-3', text: 'Printed Study Packs display live availability updated by Admin in the Store and are dispatched when available.', tag: 'Live Stock Status' },
      { id: 'sm-4', text: 'Registration for ICAN and ATSWA examinations is ongoing. Pair official study texts with course-specific past questions for first-sitting mastery.', tag: 'Exam Prep' },
    ],
  },
  connect: {
    label: 'Community',
    items: [
      { id: 'cn-1', text: 'Welcome to VALENCE Connect: free academic and professional networking for ATSWA & ICAN candidates, 300 Nigerian campuses and chartered accountants.', tag: 'Free Network' },
      { id: 'cn-2', text: 'Form diet study groups, join 12 subject forums, share announcements across 7 controlled audiences and connect with verified ACA/FCA mentors.', tag: 'Collaborate' },
      { id: 'cn-3', text: 'Follow the official VALENCE WhatsApp Channel for instant broadcasts on ICAN/ATSWA registration, study pack restocks and competition dates.', tag: 'WhatsApp Channel' },
      { id: 'cn-4', text: 'Protected by server-enforced audience permissions, profile verification badges and NDPA-aligned privacy settings.', tag: 'Safe Space' },
    ],
  },
  competitions: {
    label: 'Challenge',
    items: [
      { id: 'cp-1', text: `The VALENCE National Inter-School Challenge brings together ${UNIVERSITY_COUNTS.total} accredited Nigerian universities, polytechnics, colleges and exam divisions.`, tag: 'National Challenge' },
      { id: 'cp-2', text: 'All competition questions test accounting and related fields: reporting, costing, audit, tax, finance, economics, business law, quantitative methods & management.', tag: 'Question Scope' },
      { id: 'cp-3', text: 'Strictly only 4 students can compete in each school. The podium prize pool is ₦500,000 after every competition: ₦250,000 for 1st, ₦150,000 for 2nd and ₦100,000 for 3rd.', tag: 'Podium Pool' },
      { id: 'cp-4', text: 'Winners are displayed on their respective school’s official VALENCE profile as Top VALENCE Students, plus digital certificates and Hall of Fame recognition.', tag: 'Top VALENCE Students' },
      { id: 'cp-5', text: 'Five competitive rounds: Institution Verification, Individual CBT Qualifiers, Zonal Brackets, National Semi-Finals and the Grand Finale.', tag: '5 Rounds' },
    ],
  },
  opportunities: {
    label: 'Careers',
    items: [
      { id: 'op-1', text: 'Every scholarship, undergraduate internship, NYSC placement, workshop and graduate audit/tax/finance role is manually verified by Admin.', tag: '100% Verified' },
      { id: 'op-2', text: 'Zero fake or expired job cards: create a free VALENCE account and follow our official WhatsApp Channel for instant deadline alerts.', tag: 'Real Openings' },
      { id: 'op-4', text: 'Progressing through ATSWA and ICAN (registration ongoing) strengthens your eligibility for Tier-1 audit, tax and advisory trainee programmes.', tag: 'Career Edge' },
    ],
  },
  tuitionCentres: {
    label: 'Partner Hub',
    items: [
      { id: 'tc-1', text: 'Verified Partner Directory: Admin-verified physical (in-person) tuition centres, original accounting textbook authors and genuine book vendors.', tag: 'Verified Only' },
      { id: 'tc-2', text: 'Physical tuition cost implications unlocked on VALENCE (one-time ₦3,000 per level) reflect each advertising tuition centre’s exact verified rates.', tag: 'Centre Fees' },
      { id: 'tc-3', text: 'Advertised textbook authors and bookshops include built-in in-app student enquiries plus optional in-app Paystack checkout.', tag: 'In-App Book Buying' },
      { id: 'tc-4', text: 'Prefer online lectures? All online ATSWA and ICAN classes on VALENCE are taught strictly in-app by verified AAT and ACA tutors.', tag: 'Online Tuition' },
    ],
  },
  advertise: {
    label: 'Advertise',
    items: [
      { id: 'ad-1', text: 'Book targeted campaigns 100% inside VALENCE at ₦10,000 per week via Paystack across 9 high-visibility academic placements.', tag: '₦10,000 / Week' },
      { id: 'ad-2', text: 'Open to 3 verified groups: physical (in-person) accounting tuition centres, accounting textbook authors and verified textbook vendors.', tag: 'Who Qualifies' },
      { id: 'ad-3', text: 'Physical tuition centres submit verified per-level/per-course cost implications displayed to students who unlock cost implications on VALENCE.', tag: 'Publish Centre Fees' },
      { id: 'ad-4', text: 'Textbook authors and vendors get built-in in-app buyer enquiries, optional Paystack checkout, live CTR analytics and strict zero-piracy enforcement.', tag: 'Author & Vendor Tools' },
    ],
  },
  services: {
    label: 'Services',
    items: [
      { id: 'sv-1', text: 'ICAN and ATSWA registration is ongoing: access verified in-app online tuition, 7-step study support, timetables, community and career tools in one place.', tag: '7 Pillars' },
      { id: 'sv-2', text: 'Past Questions deliver the same day within Lagos and within 1 day outside Lagos; Study Packs show live Admin-updated availability and ship when available.', tag: 'Bookstore' },
      { id: 'sv-3', text: '24/7 support via email, prefilled WhatsApp for official ICAN fees & exemptions, and broadcast updates on our official WhatsApp Channel.', tag: '24/7 Support' },
    ],
  },
  about: {
    label: 'About VALENCE',
    items: [
      { id: 'ab-1', text: 'Vita sine litteris mors est (Life without learning is death): uniting learning, networking, inter-school competition, marketplace and career growth.', tag: 'Mission' },
      { id: 'ab-2', text: 'Built for ATSWA & ICAN candidates, 300 accredited Nigerian universities, polytechnics & colleges, verified partners and chartered accountants.', tag: 'Nationwide' },
      { id: 'ab-3', text: 'Follow the official VALENCE WhatsApp Channel and reach our team 24/7 at atvalencecustomersupport@gmail.com.', tag: 'Stay Connected' },
    ],
  },
  contact: {
    label: '24/7 Support',
    items: [
      { id: 'ct-1', text: 'VALENCE Support is open 24/7 via atvalencecustomersupport@gmail.com, in-app support tickets, and WhatsApp (+234 915 434 4663).', tag: 'Always Open' },
      { id: 'ct-2', text: 'Official ICAN registration, examination, subscription, development levy and exemption assistance is ongoing via WhatsApp Support.', tag: 'ICAN Fee Desk' },
      { id: 'ct-3', text: 'Follow the official VALENCE WhatsApp Channel for instant updates on exam dates, registration cutoffs, study pack availability and competitions.', tag: 'Official Channel' },
      { id: 'ct-4', text: 'Past Questions deliver the same day in Lagos and in 1 day outside Lagos; submit store or delivery enquiries directly inside the app.', tag: 'Fast Help' },
    ],
  },
  legal: {
    label: 'Policies',
    items: [
      { id: 'lg-1', text: 'Transparent governance: Terms of Service, NDPA-aligned Privacy Policy, Paystack Payment/Refund/Delivery rules & Zero-Piracy Ad Policy.', tag: 'Compliance' },
      { id: 'lg-2', text: 'Delivery SLA: same-day within Lagos and 1-day outside Lagos for all Past Questions; Study Packs display live Admin availability and deliver when available.', tag: 'Delivery Policy' },
      { id: 'lg-3', text: 'VALENCE never stores card numbers and never sells student data to advertisers. All online payments verify server-side via Paystack.', tag: 'Data & Payment Safety' },
    ],
  },
  portal: {
    label: 'Portal Access',
    items: [
      { id: 'pt-1', text: 'Free account signup for students, campuses and professionals; registration for ICAN and ATSWA diets is currently ongoing.', tag: 'Free Signup' },
      { id: 'pt-2', text: 'Unlock per-level online and verified advertising tuition centre cost implications for ₦3,000 once per level, verified via Paystack.', tag: 'Student Portal' },
      { id: 'pt-3', text: 'Admin Portal updates Study Pack availability, store prices, delivery zones, exam timetables and page ticker notices live in real time.', tag: 'Live Admin CMS' },
    ],
  },
};


/* ===================================================================== */
/* ACCA — Association of Chartered Certified Accountants               */
/* ===================================================================== */

export const ACCA_LEVELS = [
  {
    id: 'acca-ak',
    slug: 'applied-knowledge',
    name: 'ACCA Applied Knowledge',
    shortName: 'AK',
    stages: 'Stage 1 · 3 Papers',
    courses: [
      { code: 'BT', title: 'Business and Technology' },
      { code: 'MA', title: 'Management Accounting' },
      { code: 'FA', title: 'Financial Accounting' },
    ],
    diets: 'June & December (global)',
    requiredDocuments: ['O\'Level result (WAEC/NECO/NABTEB)', 'Passport photograph', 'Birth certificate or age declaration'],
  },
  {
    id: 'acca-as',
    slug: 'applied-skills',
    name: 'ACCA Applied Skills',
    shortName: 'AS',
    stages: 'Stage 2 · 6 Papers',
    courses: [
      { code: 'LW', title: 'Corporate and Business Law' },
      { code: 'PM', title: 'Performance Management' },
      { code: 'TX', title: 'Taxation' },
      { code: 'FR', title: 'Financial Reporting' },
      { code: 'AA', title: 'Audit and Assurance' },
      { code: 'FM', title: 'Financial Management' },
    ],
    diets: 'June & December (global)',
    requiredDocuments: ['ACCA Applied Knowledge pass slips or exemption confirmation', 'Current ACCA student registration'],
  },
  {
    id: 'acca-sp',
    slug: 'strategic-professional',
    name: 'ACCA Strategic Professional',
    shortName: 'SP',
    stages: 'Stage 3 · 4 Papers (2 core + 2 options)',
    courses: [
      { code: 'SBR', title: 'Strategic Business Reporting' },
      { code: 'SBL', title: 'Strategic Business Leader' },
      { code: 'APM', title: 'Advanced Performance Management (Option)' },
      { code: 'ATX', title: 'Advanced Taxation (Option)' },
      { code: 'AAA', title: 'Advanced Audit and Assurance (Option)' },
      { code: 'AFM', title: 'Advanced Financial Management (Option)' },
    ],
    diets: 'March & September (strategic professional only)',
    requiredDocuments: ['ACCA Applied Skills pass slips or exemption confirmation', 'Completed Ethics & Professional Skills module'],
  },
];

export const ALL_ACCA_COURSES = ACCA_LEVELS.flatMap((lvl) => lvl.courses);

export const ACCA_EXEMPTION_RULES = [
  {
    id: 'acca-olevel',
    label: "O'Level (WAEC/NECO/NABTEB) — Direct ACCA Entry",
    startingLevel: 'ACCA Applied Knowledge (Stage 1)',
    estimatedDuration: '~3 – 4 years (without carryovers)',
    exemptedCodes: [],
    guidance:
      "With a valid O'Level result (minimum 5 credits including English and Mathematics), you can register directly with ACCA and begin at Applied Knowledge. No prior accounting qualification is required.",
    conditions: [
      "Minimum 5 O'Level credits including English Language and Mathematics, in not more than two sittings.",
      "Register directly with ACCA via the myACCA portal and pay the annual subscription.",
      "Complete all 3 Applied Knowledge papers before progressing to Applied Skills.",
    ],
  },
  {
    id: 'acca-nd-accounting',
    label: 'ND Accounting (ATSWA/AAT route)',
    startingLevel: 'ACCA Applied Knowledge (with possible exemptions)',
    estimatedDuration: '~2 – 3 years (with exemptions)',
    exemptedCodes: ['BT', 'MA', 'FA'],
    guidance:
      'ND Accounting holders who have earned the AAT certificate may qualify for exemptions from some Applied Knowledge papers. ACCA evaluates each application individually and confirms exemptions on the myACCA portal.',
    conditions: [
      'Valid AAT certificate from ATSWA required.',
      'Exemptions are granted at ACCA\'s sole discretion after transcript evaluation.',
      'You must still complete the ACCA Ethics & Professional Skills module.',
    ],
  },
  {
    id: 'acca-bsc-accounting',
    label: 'B.Sc. / HND Accounting (Nigerian University)',
    startingLevel: 'ACCA Applied Skills (Stage 2)',
    estimatedDuration: '~2 – 3 years (with exemptions)',
    exemptedCodes: ['BT', 'MA', 'FA', 'LW', 'FR', 'PM'],
    guidance:
      'B.Sc. or HND Accounting graduates from recognised Nigerian universities typically qualify for exemptions from all Applied Knowledge papers and several Applied Skills papers. ACCA evaluates your transcript and confirms exact exemptions on the myACCA portal.',
    conditions: [
      'Recognised NUC/NBTE-approved degree or HND in Accounting required.',
      'Official academic transcript must be sent directly to ACCA for evaluation.',
      'Exemptions confirmed strictly on the myACCA portal after ACCA evaluation.',
    ],
  },
  {
    id: 'acca-bsc-finance',
    label: 'B.Sc. / HND Banking & Finance / Finance',
    startingLevel: 'ACCA Applied Knowledge (with partial exemptions)',
    estimatedDuration: '~2.5 – 3.5 years (with exemptions)',
    exemptedCodes: ['BT', 'MA', 'FM'],
    guidance:
      'B.Sc. or HND graduates in Banking & Finance or Finance may qualify for exemptions from Business and Technology (BT), Management Accounting (MA) and Financial Management (FM), subject to ACCA transcript evaluation.',
    conditions: [
      'Recognised degree or HND in Banking & Finance, Finance or related field required.',
      'Official transcript must reflect passed credits in equivalent ACCA papers.',
      'Exemptions confirmed strictly on the myACCA portal.',
    ],
  },
  {
    id: 'acca-ican-aca',
    label: 'ICAN ACA / FCA Holder',
    startingLevel: 'ACCA Strategic Professional (Stage 3)',
    estimatedDuration: '~1 – 1.5 years (with exemptions)',
    exemptedCodes: ['BT', 'MA', 'FA', 'LW', 'PM', 'TX', 'FR', 'AA', 'FM', 'SBR', 'SBL'],
    guidance:
      'ICAN ACA and FCA holders typically qualify for exemptions from most ACCA papers, entering directly at Strategic Professional. You may only need to complete the remaining Strategic Professional options and the Ethics module.',
    conditions: [
      'Valid ICAN ACA or FCA certificate required.',
      'ACCA evaluates ICAN qualifications and confirms exact exemptions on the myACCA portal.',
      'You must complete the ACCA Ethics & Professional Skills module if not already exempt.',
    ],
  },
  {
    id: 'acca-non-accounting',
    label: 'B.Sc. / HND Non-Accounting Discipline',
    startingLevel: 'ACCA Applied Knowledge (Stage 1)',
    estimatedDuration: '~3 – 4 years (without carryovers)',
    exemptedCodes: [],
    guidance:
      'Graduates from any non-accounting discipline (Sciences, Engineering, Arts, Social Sciences, Law, etc.) can register directly with ACCA and start at Applied Knowledge. No prior accounting qualification is required.',
    conditions: [
      'Recognised bachelor\'s degree or HND from an approved institution.',
      'Register with ACCA via the myACCA portal and pay the annual subscription.',
      'Complete the ACCA Ethics & Professional Skills module at the required stage.',
    ],
  },
];

export const ACCA_REGISTRATION_PROCESS = {
  firstTime: [
    { step: '01', title: 'Create myACCA Account', detail: 'Register on the ACCA myACCA portal and pay the annual subscription fee.' },
    { step: '02', title: 'Complete Ethics & Professional Skills', detail: 'Complete the Ethics and Professional Skills module before or alongside your exams.' },
    { step: '03', title: 'Exemption Processing (If Applicable)', detail: 'Submit your qualifications and transcript for ACCA evaluation. Exemptions are confirmed on myACCA.' },
    { step: '04', title: 'Exam Registration', detail: 'Register for the June or December diet (or March/September for Strategic Professional) via myACCA.' },
  ],
  returning: [
    { step: '01', title: 'Renew Annual Subscription', detail: 'Pay your ACCA annual subscription if not already paid for the current year.' },
    { step: '02', title: 'Proceed to Exam Registration', detail: 'Register for your next diet papers before the registration deadline via myACCA.' },
  ],
};

export const ACCA_COMPLETION_TIMELINES = [
  { route: 'O\'Level Entry', estimate: '~3 – 4 yrs', diets: 'June & December', note: 'Full route from Applied Knowledge through Strategic Professional to ACCA member status.' },
  { route: 'B.Sc. Accounting Entry', estimate: '~2 – 3 yrs', diets: 'June & December', note: 'Exemptions from Applied Knowledge and several Applied Skills papers after transcript evaluation.' },
  { route: 'ICAN ACA Entry', estimate: '~1 – 1.5 yrs', diets: 'March & September', note: 'Direct entry at Strategic Professional with most papers exempted.' },
];

export const ACCA_CANDIDATE_FAQS = [
  {
    num: 1,
    q: 'What is ACCA?',
    a: 'The Association of Chartered Certified Accountants (ACCA) is a globally recognised professional accounting body. It awards the ACCA Chartered Certified Accountant qualification, respected in over 180 countries.',
  },
  {
    num: 2,
    q: 'Who can register for ACCA?',
    a: 'ACCA is open to anyone with a valid O\'Level result or a university degree. You do not need to be an accounting graduate to start.',
    bullets: [
      "School leavers with O'Level (WAEC/NECO/NABTEB) — start at Applied Knowledge",
      'B.Sc./HND graduates in any discipline — start at Applied Knowledge or get exemptions',
      'ICAN ACA/FCA holders — direct entry at Strategic Professional with exemptions',
      'ND Accounting / AAT holders — possible exemptions from Applied Knowledge',
    ],
  },
  {
    num: 3,
    q: 'How many papers are there in ACCA?',
    a: 'ACCA has 13 examinations across 3 stages (plus the Ethics & Professional Skills module):',
    bullets: [
      'Applied Knowledge (3 papers): BT, MA, FA',
      'Applied Skills (6 papers): LW, PM, TX, FR, AA, FM',
      'Strategic Professional (4 papers): SBR, SBL + 2 options from APM, ATX, AAA, AFM',
    ],
  },
  {
    num: 4,
    q: 'How do I check my ACCA exemptions?',
    a: 'ACCA grants exemptions after evaluating your prior qualifications. You can check your exemption status on the myACCA portal:',
    bullets: [
      'Log in to your myACCA account',
      'Navigate to "My Qualifications" → "Exemptions"',
      'View your confirmed exempted papers and remaining exams',
    ],
    links: [
      { label: 'ACCA Official Website (accaglobal.com)', url: 'https://www.accaglobal.com/' },
    ],
  },
  {
    num: 5,
    q: 'When are ACCA exams held?',
    a: 'ACCA Applied Knowledge and Applied Skills exams are held in June and December globally. Strategic Professional exams are held in March and September.',
  },
  {
    num: 6,
    q: 'How long does it take to complete ACCA?',
    a: 'Duration depends on your entry route and exemptions:',
    bullets: [
      "O'Level entry (no exemptions): ~3 – 4 years",
      'B.Sc. Accounting entry (with exemptions): ~2 – 3 years',
      'ICAN ACA entry (with exemptions): ~1 – 1.5 years',
    ],
  },
  {
    num: 7,
    q: 'Does VALENCE sell ACCA materials?',
    a: 'No. VALENCE sells hard-copy study materials exclusively for ATSWA and ICAN. For ACCA, verified authors advertise on VALENCE and provide direct soft-copy download links on their ad cards in the Tuition Centres & Partners directory.',
  },
  {
    num: 8,
    q: 'Can I take ACCA tuition on VALENCE?',
    a: 'Yes. VALENCE offers online tuition for ACCA with verified tutors. Pay the one-time ₦3,000 per-level unlock to view your cost implication, then apply for tuition through the Student Portal.',
  },
  {
    num: 9,
    q: 'How do I get help with ACCA registration and fees?',
    a: 'VALENCE provides 24/7 WhatsApp support for official ACCA registration, subscription, and exam fee assistance. All online tuition and payments run in-app via Paystack.',
  },
  {
    num: 10,
    q: 'Is ACCA recognised in Nigeria?',
    a: 'Yes. ACCA is globally recognised and well-established in Nigeria. Many Nigerian chartered accountants and finance professionals hold ACCA qualifications alongside or instead of ICAN.',
    tagline: 'A global qualification, built for the Nigerian professional.',
  },
];

/* ===================================================================== */
/* CIBN — Chartered Institute of Bankers, Nigeria                      */
/* ===================================================================== */

export const CIBN_LEVELS = [
  {
    id: 'cibn-cp',
    slug: 'certified-banking-professional',
    name: 'CIBN Certified Banking Professional (CBP)',
    shortName: 'CBP',
    stages: 'Stage 1 · Core Banking Papers',
    courses: [
      { code: 'CBP-1', title: 'Banking Operations & Practice' },
      { code: 'CBP-2', title: 'Financial Accounting & Reporting' },
      { code: 'CBP-3', title: 'Business Communication' },
      { code: 'CBP-4', title: 'Economics & Monetary Policy' },
    ],
    diets: 'May & November',
    requiredDocuments: ["O'Level result (WAEC/NECO/NABTEB)", 'Passport photograph', 'Birth certificate'],
  },
  {
    id: 'cibn-acp',
    slug: 'associate-chartered-banker',
    name: 'CIBN Associate Chartered Banker (ACB)',
    shortName: 'ACB',
    stages: 'Stage 2 · Professional Banking Papers',
    courses: [
      { code: 'ACB-1', title: 'Advanced Bank Management' },
      { code: 'ACB-2', title: 'Credit Risk Management' },
      { code: 'ACB-3', title: 'Financial Institutions & Markets' },
      { code: 'ACB-4', title: 'Banking Law & Ethics' },
    ],
    diets: 'May & November',
    requiredDocuments: ['CIBN CBP pass slips', 'Current CIBN student registration'],
  },
  {
    id: 'cibn-fcb',
    slug: 'fellow-chartered-banker',
    name: 'CIBN Fellow Chartered Banker (FCB)',
    shortName: 'FCB',
    stages: 'Stage 3 · Strategic & Leadership',
    courses: [
      { code: 'FCB-1', title: 'Strategic Bank Management' },
      { code: 'FCB-2', title: 'Corporate Governance & Risk' },
      { code: 'FCB-3', title: 'Treasury & Asset Management' },
      { code: 'FCB-4', title: 'Leadership & Change Management' },
    ],
    diets: 'May & November',
    requiredDocuments: ['CIBN ACB pass slips', 'Relevant banking experience'],
  },
];

export const ALL_CIBN_COURSES = CIBN_LEVELS.flatMap((lvl) => lvl.courses);

export const CIBN_EXEMPTION_RULES = [
  {
    id: 'cibn-olevel',
    label: "O'Level (WAEC/NECO/NABTEB) — Direct CIBN Entry",
    startingLevel: 'CIBN CBP (Stage 1)',
    estimatedDuration: '~2 – 3 years (without carryovers)',
    exemptedCodes: [],
    guidance:
      "With a valid O'Level result (minimum 5 credits including English and Mathematics), you can register directly with CIBN and begin at the Certified Banking Professional stage.",
    conditions: [
      "Minimum 5 O'Level credits including English Language and Mathematics.",
      "Register with CIBN and pay the annual subscription.",
      'Complete all 4 CBP papers before progressing to ACB.',
    ],
  },
  {
    id: 'cibn-bsc-banking',
    label: 'B.Sc. / HND Banking & Finance',
    startingLevel: 'CIBN ACB (Stage 2, with exemptions)',
    estimatedDuration: '~1.5 – 2 years (with exemptions)',
    exemptedCodes: ['CBP-1', 'CBP-2', 'CBP-4'],
    guidance:
      'B.Sc. or HND graduates in Banking & Finance typically qualify for exemptions from several CBP papers, entering directly at the Associate Chartered Banker stage. CIBN evaluates transcripts and confirms exemptions.',
    conditions: [
      'Recognised NUC/NBTE-approved degree or HND in Banking & Finance.',
      'Official transcript must be sent to CIBN for evaluation.',
      'Exemptions confirmed on the CIBN portal after evaluation.',
    ],
  },
  {
    id: 'cibn-bsc-accounting',
    label: 'B.Sc. / HND Accounting',
    startingLevel: 'CIBN ACB (Stage 2, with partial exemptions)',
    estimatedDuration: '~2 – 2.5 years (with exemptions)',
    exemptedCodes: ['CBP-2'],
    guidance:
      'B.Sc. or HND Accounting graduates may qualify for an exemption from the Financial Accounting & Reporting CBP paper, entering at the ACB stage. CIBN confirms exemptions after transcript evaluation.',
    conditions: [
      'Recognised degree or HND in Accounting.',
      'Official transcript must reflect passed credits in equivalent banking papers.',
      'Exemptions confirmed on the CIBN portal.',
    ],
  },
  {
    id: 'cibn-non-banking',
    label: 'B.Sc. / HND Non-Banking Discipline',
    startingLevel: 'CIBN CBP (Stage 1)',
    estimatedDuration: '~2.5 – 3 years (without carryovers)',
    exemptedCodes: [],
    guidance:
      'Graduates from non-banking disciplines can register directly with CIBN and start at CBP. A background in business, finance, or economics is helpful but not required.',
    conditions: [
      'Recognised bachelor\'s degree or HND from an approved institution.',
      'Register with CIBN and pay the annual subscription.',
      'Complete all CBP papers before progressing to ACB.',
    ],
  },
];

export const CIBN_REGISTRATION_PROCESS = {
  firstTime: [
    { step: '01', title: 'CIBN Student Registration', detail: 'Register officially with CIBN and obtain your student registration number.' },
    { step: '02', title: 'Pay Annual Subscription', detail: 'Pay your annual CIBN student subscription and any required development levy.' },
    { step: '03', title: 'Exemption Processing (If Applicable)', detail: 'Submit qualifications for evaluation. Exemptions are confirmed before exam registration.' },
    { step: '04', title: 'Exam Registration', detail: 'Register for the May or November diet based on your confirmed papers.' },
  ],
  returning: [
    { step: '01', title: 'Renew Annual Subscription', detail: 'Pay your CIBN annual subscription if not already paid for the current year.' },
    { step: '02', title: 'Proceed to Exam Registration', detail: 'Register for your next diet papers before the registration deadline.' },
  ],
};

export const CIBN_COMPLETION_TIMELINES = [
  { route: "O'Level Entry", estimate: '~2 – 3 yrs', diets: 'May & November', note: 'Full route from CBP through ACB to FCB.' },
  { route: 'B.Sc. Banking Entry', estimate: '~1.5 – 2 yrs', diets: 'May & November', note: 'Exemptions from CBP papers after transcript evaluation.' },
  { route: 'B.Sc. Accounting Entry', estimate: '~2 – 2.5 yrs', diets: 'May & November', note: 'Partial exemption from CBP Financial Accounting paper.' },
];

export const CIBN_CANDIDATE_FAQS = [
  {
    num: 1,
    q: 'What is CIBN?',
    a: 'The Chartered Institute of Bankers, Nigeria (CIBN) is the premier professional body for bankers and financial services professionals in Nigeria. It awards the Chartered Banker qualification.',
  },
  {
    num: 2,
    q: 'Who can register for CIBN?',
    a: 'CIBN is open to anyone with a valid O\'Level result or a university degree. No prior banking experience is required to start.',
    bullets: [
      "School leavers with O'Level — start at CBP",
      'B.Sc./HND Banking & Finance graduates — start at ACB with exemptions',
      'B.Sc./HND Accounting graduates — start at ACB with partial exemptions',
      'Graduates from other disciplines — start at CBP',
    ],
  },
  {
    num: 3,
    q: 'How many stages are in the CIBN qualification?',
    a: 'CIBN has 3 stages, and you must pass all papers in a stage before progressing:',
    bullets: [
      'Certified Banking Professional (CBP): 4 papers',
      'Associate Chartered Banker (ACB): 4 papers',
      'Fellow Chartered Banker (FCB): 4 papers',
    ],
  },
  {
    num: 4,
    q: 'How do I check my CIBN exemptions?',
    a: 'CIBN grants exemptions after evaluating your prior qualifications. Check your status on the CIBN portal after registration.',
    bullets: [
      'Log in to your CIBN student portal',
      'Navigate to "Exemptions" or "My Qualifications"',
      'View your confirmed exempted papers and remaining exams',
    ],
    links: [
      { label: 'CIBN Official Website (cibnnigeria.org)', url: 'https://cibnnigeria.org/' },
    ],
  },
  {
    num: 5,
    q: 'When are CIBN exams held?',
    a: 'CIBN examinations are held twice a year: May and November diets.',
  },
  {
    num: 6,
    q: 'How long does it take to complete CIBN?',
    a: 'Duration depends on your entry route and exemptions:',
    bullets: [
      "O'Level entry: ~2 – 3 years",
      'B.Sc. Banking entry: ~1.5 – 2 years',
      'B.Sc. Accounting entry: ~2 – 2.5 years',
    ],
  },
  {
    num: 7,
    q: 'Does VALENCE sell CIBN materials?',
    a: 'No. VALENCE sells hard-copy study materials exclusively for ATSWA and ICAN. For CIBN, verified authors advertise on VALENCE and provide direct soft-copy download links on their ad cards.',
  },
  {
    num: 8,
    q: 'Can I take CIBN tuition on VALENCE?',
    a: 'Yes. VALENCE offers online tuition for CIBN with verified tutors. Pay the one-time ₦3,000 per-level unlock to view your cost implication, then apply for tuition through the Student Portal.',
  },
  {
    num: 9,
    q: 'How do I get help with CIBN registration and fees?',
    a: 'VALENCE provides 24/7 WhatsApp support for official CIBN registration, subscription, and exam fee assistance. All online tuition and payments run in-app via Paystack.',
  },
  {
    num: 10,
    q: 'Is CIBN recognised across Nigerian banks?',
    a: 'Yes. CIBN is the premier banking professional body in Nigeria and is widely recognised across all Nigerian banks and financial institutions.',
    tagline: 'The professional standard for Nigerian bankers.',
  },
];

/* ===================================================================== */
/* CITN — Chartered Institute of Taxation, Nigeria                     */
/* ===================================================================== */

export const CITN_LEVELS = [
  {
    id: 'citn-acti',
    slug: 'acti',
    name: 'CITN Associate Chartered Tax Practitioner (ACTI)',
    shortName: 'ACTI',
    stages: 'Stage 1 · Core Taxation Papers',
    courses: [
      { code: 'ACTI-1', title: 'Taxation Principles & Practice' },
      { code: 'ACTI-2', title: 'Nigerian Tax Law' },
      { code: 'ACTI-3', title: 'Personal Income Tax' },
      { code: 'ACTI-4', title: 'Corporate Taxation' },
    ],
    diets: 'May & November',
    requiredDocuments: ["O'Level result (WAEC/NECO/NABTEB)", 'Passport photograph', 'Birth certificate'],
  },
  {
    id: 'citn-fcti',
    slug: 'fcti',
    name: 'CITN Fellow Chartered Tax Practitioner (FCTI)',
    shortName: 'FCTI',
    stages: 'Stage 2 · Advanced Taxation Papers',
    courses: [
      { code: 'FCTI-1', title: 'Advanced Tax Planning & Advisory' },
      { code: 'FCTI-2', title: 'Taxation of Companies & Groups' },
      { code: 'FCTI-3', title: 'International Taxation' },
      { code: 'FCTI-4', title: 'Tax Administration & Compliance' },
    ],
    diets: 'May & November',
    requiredDocuments: ['CITN ACTI pass slips', 'Current CITN student registration'],
  },
];

export const ALL_CITN_COURSES = CITN_LEVELS.flatMap((lvl) => lvl.courses);

export const CITN_EXEMPTION_RULES = [
  {
    id: 'citn-olevel',
    label: "O'Level (WAEC/NECO/NABTEB) — Direct CITN Entry",
    startingLevel: 'CITN ACTI (Stage 1)',
    estimatedDuration: '~2 – 3 years (without carryovers)',
    exemptedCodes: [],
    guidance:
      "With a valid O'Level result (minimum 5 credits including English and Mathematics), you can register directly with CITN and begin at the ACTI stage.",
    conditions: [
      "Minimum 5 O'Level credits including English Language and Mathematics.",
      'Register with CITN and pay the annual subscription.',
      'Complete all 4 ACTI papers before progressing to FCTI.',
    ],
  },
  {
    id: 'citn-bsc-accounting',
    label: 'B.Sc. / HND Accounting',
    startingLevel: 'CITN ACTI (Stage 1, with exemptions)',
    estimatedDuration: '~1.5 – 2 years (with exemptions)',
    exemptedCodes: ['ACTI-1'],
    guidance:
      'B.Sc. or HND Accounting graduates may qualify for an exemption from the Taxation Principles & Practice ACTI paper, given their accounting background. CITN evaluates transcripts and confirms exemptions.',
    conditions: [
      'Recognised NUC/NBTE-approved degree or HND in Accounting.',
      'Official transcript must reflect passed credits in taxation or accounting papers.',
      'Exemptions confirmed on the CITN portal after evaluation.',
    ],
  },
  {
    id: 'citn-bsc-law',
    label: 'B.Sc. / LLB Law',
    startingLevel: 'CITN ACTI (Stage 1, with exemptions)',
    estimatedDuration: '~1.5 – 2 years (with exemptions)',
    exemptedCodes: ['ACTI-2'],
    guidance:
      'Law graduates may qualify for an exemption from the Nigerian Tax Law ACTI paper, given their legal background. CITN evaluates qualifications and confirms exemptions.',
    conditions: [
      'Recognised LLB or B.Sc. Law degree from an approved institution.',
      'Official transcript must reflect passed credits in relevant legal papers.',
      'Exemptions confirmed on the CITN portal.',
    ],
  },
  {
    id: 'citn-ican',
    label: 'ICAN ACA / FCA Holder',
    startingLevel: 'CITN FCTI (Stage 2, with exemptions)',
    estimatedDuration: '~1 – 1.5 years (with exemptions)',
    exemptedCodes: ['ACTI-1', 'ACTI-2', 'ACTI-3', 'ACTI-4'],
    guidance:
      'ICAN ACA and FCA holders typically qualify for exemptions from all ACTI papers, entering directly at the FCTI stage. CITN evaluates ICAN qualifications and confirms exemptions.',
    conditions: [
      'Valid ICAN ACA or FCA certificate required.',
      'CITN evaluates ICAN qualifications and confirms exact exemptions on its portal.',
      'You must complete all FCTI papers to qualify as FCTI.',
    ],
  },
  {
    id: 'citn-non-accounting',
    label: 'B.Sc. / HND Non-Accounting Discipline',
    startingLevel: 'CITN ACTI (Stage 1)',
    estimatedDuration: '~2.5 – 3 years (without carryovers)',
    exemptedCodes: [],
    guidance:
      'Graduates from non-accounting disciplines can register directly with CITN and start at ACTI. A background in economics, law, or business is helpful but not required.',
    conditions: [
      'Recognised bachelor\'s degree or HND from an approved institution.',
      'Register with CITN and pay the annual subscription.',
      'Complete all ACTI papers before progressing to FCTI.',
    ],
  },
];

export const CITN_REGISTRATION_PROCESS = {
  firstTime: [
    { step: '01', title: 'CITN Student Registration', detail: 'Register officially with CITN and obtain your student registration number.' },
    { step: '02', title: 'Pay Annual Subscription', detail: 'Pay your annual CITN student subscription and any required development levy.' },
    { step: '03', title: 'Exemption Processing (If Applicable)', detail: 'Submit qualifications for evaluation. Exemptions are confirmed before exam registration.' },
    { step: '04', title: 'Exam Registration', detail: 'Register for the May or November diet based on your confirmed papers.' },
  ],
  returning: [
    { step: '01', title: 'Renew Annual Subscription', detail: 'Pay your CITN annual subscription if not already paid for the current year.' },
    { step: '02', title: 'Proceed to Exam Registration', detail: 'Register for your next diet papers before the registration deadline.' },
  ],
};

export const CITN_COMPLETION_TIMELINES = [
  { route: "O'Level Entry", estimate: '~2 – 3 yrs', diets: 'May & November', note: 'Full route from ACTI to FCTI.' },
  { route: 'B.Sc. Accounting Entry', estimate: '~1.5 – 2 yrs', diets: 'May & November', note: 'Exemption from ACTI Taxation Principles paper.' },
  { route: 'ICAN ACA Entry', estimate: '~1 – 1.5 yrs', diets: 'May & November', note: 'Direct entry at FCTI with all ACTI papers exempted.' },
];

export const CITN_CANDIDATE_FAQS = [
  {
    num: 1,
    q: 'What is CITN?',
    a: 'The Chartered Institute of Taxation, Nigeria (CITN) is the professional body for tax practitioners in Nigeria. It awards the ACTI (Associate Chartered Tax Practitioner) and FCTI (Fellow Chartered Tax Practitioner) qualifications.',
  },
  {
    num: 2,
    q: 'Who can register for CITN?',
    a: 'CITN is open to anyone with a valid O\'Level result or a university degree. No prior tax experience is required to start.',
    bullets: [
      "School leavers with O'Level — start at ACTI",
      'B.Sc./HND Accounting graduates — start at ACTI with exemptions',
      'LLB Law graduates — start at ACTI with exemptions',
      'ICAN ACA/FCA holders — direct entry at FCTI with exemptions',
    ],
  },
  {
    num: 3,
    q: 'How many stages are in the CITN qualification?',
    a: 'CITN has 2 stages, and you must pass all papers in a stage before progressing:',
    bullets: [
      'Associate Chartered Tax Practitioner (ACTI): 4 papers',
      'Fellow Chartered Tax Practitioner (FCTI): 4 papers',
    ],
  },
  {
    num: 4,
    q: 'How do I check my CITN exemptions?',
    a: 'CITN grants exemptions after evaluating your prior qualifications. Check your status on the CITN portal after registration.',
    bullets: [
      'Log in to your CITN student portal',
      'Navigate to "Exemptions" or "My Qualifications"',
      'View your confirmed exempted papers and remaining exams',
    ],
    links: [
      { label: 'CITN Official Website (citrin.org.ng)', url: 'https://www.citrin.org.ng/' },
    ],
  },
  {
    num: 5,
    q: 'When are CITN exams held?',
    a: 'CITN examinations are held twice a year: May and November diets.',
  },
  {
    num: 6,
    q: 'How long does it take to complete CITN?',
    a: 'Duration depends on your entry route and exemptions:',
    bullets: [
      "O'Level entry: ~2 – 3 years",
      'B.Sc. Accounting entry: ~1.5 – 2 years',
      'ICAN ACA entry: ~1 – 1.5 years',
    ],
  },
  {
    num: 7,
    q: 'Does VALENCE sell CITN materials?',
    a: 'No. VALENCE sells hard-copy study materials exclusively for ATSWA and ICAN. For CITN, verified authors advertise on VALENCE and provide direct soft-copy download links on their ad cards.',
  },
  {
    num: 8,
    q: 'Can I take CITN tuition on VALENCE?',
    a: 'Yes. VALENCE offers online tuition for CITN with verified tutors. Pay the one-time ₦3,000 per-level unlock to view your cost implication, then apply for tuition through the Student Portal.',
  },
  {
    num: 9,
    q: 'How do I get help with CITN registration and fees?',
    a: 'VALENCE provides 24/7 WhatsApp support for official CITN registration, subscription, and exam fee assistance. All online tuition and payments run in-app via Paystack.',
  },
  {
    num: 10,
    q: 'Is CITN recognised by Nigerian tax authorities?',
    a: 'Yes. CITN is the recognised professional body for tax practitioners in Nigeria and is respected by the Federal Inland Revenue Service (FIRS), state revenue boards, and tax consulting firms nationwide.',
    tagline: 'The professional standard for Nigerian tax practitioners.',
  },
];

/* ===================================================================== */
/* CIPM — Chartered Institute of Personnel Management                  */
/* ===================================================================== */

export const CIPM_LEVELS = [
  {
    id: 'cipm-aspm',
    slug: 'assistant-student-personnel-manager',
    name: 'CIPM Assistant Student Personnel Manager (ASPM)',
    shortName: 'ASPM',
    stages: 'Stage 1 · Foundation HR Papers',
    courses: [
      { code: 'ASPM-1', title: 'Human Resource Management Principles' },
      { code: 'ASPM-2', title: 'Industrial Relations & Labour Law' },
      { code: 'ASPM-3', title: 'Organisational Behaviour' },
      { code: 'ASPM-4', title: 'Compensation & Benefits' },
    ],
    diets: 'April & October',
    requiredDocuments: ["O'Level result (WAEC/NECO/NABTEB)", 'Passport photograph', 'Birth certificate'],
  },
  {
    id: 'cipm-splm',
    slug: 'student-personnel-manager',
    name: 'CIPM Student Personnel Manager (SPLM)',
    shortName: 'SPLM',
    stages: 'Stage 2 · Professional HR Papers',
    courses: [
      { code: 'SPLM-1', title: 'Strategic Human Resource Management' },
      { code: 'SPLM-2', title: 'Talent Management & Development' },
      { code: 'SPLM-3', title: 'Performance Management' },
      { code: 'SPLM-4', title: 'Employee Relations & Wellness' },
    ],
    diets: 'April & October',
    requiredDocuments: ['CIPM ASPM pass slips', 'Current CIPM student registration'],
  },
  {
    id: 'cipm-fcpm',
    slug: 'fellow-chartered-personnel-manager',
    name: 'CIPM Fellow Chartered Personnel Manager (FCPM)',
    shortName: 'FCPM',
    stages: 'Stage 3 · Strategic HR & Leadership',
    courses: [
      { code: 'FCPM-1', title: 'Advanced Organisational Development' },
      { code: 'FCPM-2', title: 'HR Metrics & Analytics' },
      { code: 'FCPM-3', title: 'Change Management & Transformation' },
      { code: 'FCPM-4', title: 'Leadership & Executive Coaching' },
    ],
    diets: 'April & October',
    requiredDocuments: ['CIPM SPLM pass slips', 'Relevant HR experience'],
  },
];

export const ALL_CIPM_COURSES = CIPM_LEVELS.flatMap((lvl) => lvl.courses);

export const CIPM_EXEMPTION_RULES = [
  {
    id: 'cipm-olevel',
    label: "O'Level (WAEC/NECO/NABTEB) — Direct CIPM Entry",
    startingLevel: 'CIPM ASPM (Stage 1)',
    estimatedDuration: '~2.5 – 3.5 years (without carryovers)',
    exemptedCodes: [],
    guidance:
      "With a valid O'Level result (minimum 5 credits including English and Mathematics), you can register directly with CIPM and begin at the Assistant Student Personnel Manager stage.",
    conditions: [
      "Minimum 5 O'Level credits including English Language and Mathematics.",
      'Register with CIPM and pay the annual subscription.',
      'Complete all 4 ASPM papers before progressing to SPLM.',
    ],
  },
  {
    id: 'cipm-bsc-hrm',
    label: 'B.Sc. / HND Human Resource Management',
    startingLevel: 'CIPM SPLM (Stage 2, with exemptions)',
    estimatedDuration: '~1.5 – 2 years (with exemptions)',
    exemptedCodes: ['ASPM-1', 'ASPM-3', 'ASPM-4'],
    guidance:
      'B.Sc. or HND graduates in Human Resource Management typically qualify for exemptions from several ASPM papers, entering directly at the Student Personnel Manager stage. CIPM evaluates transcripts and confirms exemptions.',
    conditions: [
      'Recognised NUC/NBTE-approved degree or HND in HRM or a related field.',
      'Official transcript must be sent to CIPM for evaluation.',
      'Exemptions confirmed on the CIPM portal after evaluation.',
    ],
  },
  {
    id: 'cipm-bsc-mgt',
    label: 'B.Sc. / HND Business Administration / Management',
    startingLevel: 'CIPM SPLM (Stage 2, with partial exemptions)',
    estimatedDuration: '~2 – 2.5 years (with exemptions)',
    exemptedCodes: ['ASPM-1', 'ASPM-3'],
    guidance:
      'B.Sc. or HND graduates in Business Administration or Management may qualify for exemptions from ASPM papers on Organisational Behaviour and HR Principles, entering at the SPLM stage. CIPM confirms exemptions after evaluation.',
    conditions: [
      'Recognised degree or HND in Business Administration, Management or a related field.',
      'Official transcript must reflect passed credits in equivalent HR or management papers.',
      'Exemptions confirmed on the CIPM portal.',
    ],
  },
  {
    id: 'cipm-non-hr',
    label: 'B.Sc. / HND Non-HR Discipline',
    startingLevel: 'CIPM ASPM (Stage 1)',
    estimatedDuration: '~3 – 3.5 years (without carryovers)',
    exemptedCodes: [],
    guidance:
      'Graduates from non-HR disciplines can register directly with CIPM and start at ASPM. A background in business, psychology, or management is helpful but not required.',
    conditions: [
      'Recognised bachelor\'s degree or HND from an approved institution.',
      'Register with CIPM and pay the annual subscription.',
      'Complete all ASPM papers before progressing to SPLM.',
    ],
  },
];

export const CIPM_REGISTRATION_PROCESS = {
  firstTime: [
    { step: '01', title: 'CIPM Student Registration', detail: 'Register officially with CIPM and obtain your student registration number.' },
    { step: '02', title: 'Pay Annual Subscription', detail: 'Pay your annual CIPM student subscription and any required development levy.' },
    { step: '03', title: 'Exemption Processing (If Applicable)', detail: 'Submit qualifications for evaluation. Exemptions are confirmed before exam registration.' },
    { step: '04', title: 'Exam Registration', detail: 'Register for the April or October diet based on your confirmed papers.' },
  ],
  returning: [
    { step: '01', title: 'Renew Annual Subscription', detail: 'Pay your CIPM annual subscription if not already paid for the current year.' },
    { step: '02', title: 'Proceed to Exam Registration', detail: 'Register for your next diet papers before the registration deadline.' },
  ],
};

export const CIPM_COMPLETION_TIMELINES = [
  { route: "O'Level Entry", estimate: '~2.5 – 3.5 yrs', diets: 'April & October', note: 'Full route from ASPM through SPLM to FCPM.' },
  { route: 'B.Sc. HRM Entry', estimate: '~1.5 – 2 yrs', diets: 'April & October', note: 'Exemptions from ASPM papers after transcript evaluation.' },
  { route: 'B.Sc. Management Entry', estimate: '~2 – 2.5 yrs', diets: 'April & October', note: 'Partial exemptions from ASPM papers.' },
];

export const CIPM_CANDIDATE_FAQS = [
  {
    num: 1,
    q: 'What is CIPM?',
    a: 'The Chartered Institute of Personnel Management (CIPM) is Nigeria\'s premier professional body for human resources and people management practitioners. It awards the ASPM, SPLM, and FCPM qualifications.',
  },
  {
    num: 2,
    q: 'Who can register for CIPM?',
    a: 'CIPM is open to anyone with a valid O\'Level result or a university degree. No prior HR experience is required to start.',
    bullets: [
      "School leavers with O'Level — start at ASPM",
      'B.Sc./HND HRM graduates — start at SPLM with exemptions',
      'B.Sc./HND Management graduates — start at SPLM with partial exemptions',
      'Graduates from other disciplines — start at ASPM',
    ],
  },
  {
    num: 3,
    q: 'How many stages are in the CIPM qualification?',
    a: 'CIPM has 3 stages, and you must pass all papers in a stage before progressing:',
    bullets: [
      'Assistant Student Personnel Manager (ASPM): 4 papers',
      'Student Personnel Manager (SPLM): 4 papers',
      'Fellow Chartered Personnel Manager (FCPM): 4 papers',
    ],
  },
  {
    num: 4,
    q: 'How do I check my CIPM exemptions?',
    a: 'CIPM grants exemptions after evaluating your prior qualifications. Check your status on the CIPM portal after registration.',
    bullets: [
      'Log in to your CIPM student portal',
      'Navigate to "Exemptions" or "My Qualifications"',
      'View your confirmed exempted papers and remaining exams',
    ],
    links: [
      { label: 'CIPM Official Website (cipm.org.ng)', url: 'https://cipm.org.ng/' },
    ],
  },
  {
    num: 5,
    q: 'When are CIPM exams held?',
    a: 'CIPM examinations are held twice a year: April and October diets.',
  },
  {
    num: 6,
    q: 'How long does it take to complete CIPM?',
    a: 'Duration depends on your entry route and exemptions:',
    bullets: [
      "O'Level entry: ~2.5 – 3.5 years",
      'B.Sc. HRM entry: ~1.5 – 2 years',
      'B.Sc. Management entry: ~2 – 2.5 years',
    ],
  },
  {
    num: 7,
    q: 'Does VALENCE sell CIPM materials?',
    a: 'No. VALENCE sells hard-copy study materials exclusively for ATSWA and ICAN. For CIPM, verified authors advertise on VALENCE and provide direct soft-copy download links on their ad cards.',
  },
  {
    num: 8,
    q: 'Can I take CIPM tuition on VALENCE?',
    a: 'Yes. VALENCE offers online tuition for CIPM with verified tutors. Pay the one-time ₦3,000 per-level unlock to view your cost implication, then apply for tuition through the Student Portal.',
  },
  {
    num: 9,
    q: 'How do I get help with CIPM registration and fees?',
    a: 'VALENCE provides 24/7 WhatsApp support for official CIPM registration, subscription, and exam fee assistance. All online tuition and payments run in-app via Paystack.',
  },
  {
    num: 10,
    q: 'Is CIPM recognised across Nigerian organisations?',
    a: 'Yes. CIPM is the premier HR professional body in Nigeria and is widely recognised across Nigerian organisations, the public service, and multinational companies.',
    tagline: 'The professional standard for Nigerian HR practitioners.',
  },
];

/* ===================================================================== */
/* Combined other-body registry for navigation and rendering           */
/* ===================================================================== */

export const OTHER_BODIES = [
  {
    id: 'acca',
    name: 'ACCA',
    fullName: 'Association of Chartered Certified Accountants',
    levels: ACCA_LEVELS,
    exemptionRules: ACCA_EXEMPTION_RULES,
    registrationProcess: ACCA_REGISTRATION_PROCESS,
    completionTimelines: ACCA_COMPLETION_TIMELINES,
    candidateFaqs: ACCA_CANDIDATE_FAQS,
    allCourses: ALL_ACCA_COURSES,
    officialWebsite: 'https://www.accaglobal.com/',
    diets: 'June & December (AK/AS) · March & September (SP)',
    badge: 'GLOBAL · 3 STAGES · 13 PAPERS',
  },
  {
    id: 'cibn',
    name: 'CIBN',
    fullName: 'Chartered Institute of Bankers, Nigeria',
    levels: CIBN_LEVELS,
    exemptionRules: CIBN_EXEMPTION_RULES,
    registrationProcess: CIBN_REGISTRATION_PROCESS,
    completionTimelines: CIBN_COMPLETION_TIMELINES,
    candidateFaqs: CIBN_CANDIDATE_FAQS,
    allCourses: ALL_CIBN_COURSES,
    officialWebsite: 'https://cibnnigeria.org/',
    diets: 'May & November',
    badge: 'NIGERIA · 3 STAGES · 12 PAPERS',
  },
  {
    id: 'citn',
    name: 'CITN',
    fullName: 'Chartered Institute of Taxation, Nigeria',
    levels: CITN_LEVELS,
    exemptionRules: CITN_EXEMPTION_RULES,
    registrationProcess: CITN_REGISTRATION_PROCESS,
    completionTimelines: CITN_COMPLETION_TIMELINES,
    candidateFaqs: CITN_CANDIDATE_FAQS,
    allCourses: ALL_CITN_COURSES,
    officialWebsite: 'https://www.citrin.org.ng/',
    diets: 'May & November',
    badge: 'NIGERIA · 2 STAGES · 8 PAPERS',
  },
  {
    id: 'cipm',
    name: 'CIPM',
    fullName: 'Chartered Institute of Personnel Management',
    levels: CIPM_LEVELS,
    exemptionRules: CIPM_EXEMPTION_RULES,
    registrationProcess: CIPM_REGISTRATION_PROCESS,
    completionTimelines: CIPM_COMPLETION_TIMELINES,
    candidateFaqs: CIPM_CANDIDATE_FAQS,
    allCourses: ALL_CIPM_COURSES,
    officialWebsite: 'https://cipm.org.ng/',
    diets: 'April & October',
    badge: 'NIGERIA · 3 STAGES · 12 PAPERS',
  },
];
