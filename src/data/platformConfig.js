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
  email: 'axelacademyinfo@gmail.com',
  operatingHours: 'By appointment',
  location: 'Lagos, Nigeria (Serving candidates & institutions nationwide)',
  paymentProvider: 'Paystack',
  tuitionUnlockFee: 3000,
  competitionCashReward: 50000,
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
  },
};

/**
 * Dynamic Examination Sessions & Timetables
 * Governed & published by the Central Examination Authority in Admin Portal:
 * - ATSWA (March & September): 2 days — second-to-last Tuesday & Wednesday of diet month
 * - ICAN (May & November): 3 days — first Tuesday, Wednesday & Thursday of diet month (overridable when ICAN adjusts schedule)
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
        morning: 'Skills: Financial Management (FM) · Pro: Case Study (CS — Full Session)',
        afternoon: 'Skills: Public Sector Accounting & Finance (PSAF)',
      },
    ],
  }),
  // Concluded November 2026 ICAN diet — demonstrates LIVE 30-day post-exam Result Release Countdown!
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
        morning: 'BAPS · Financial Accounting · Cost Accounting (Provisional — Central Authority)',
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
        morning: 'FA · FR · SBR (Provisional — Subject to Institute Timetable)',
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
    tagline: 'Entry stage to the ACA professional qualification — 4 rigorous foundational papers.',
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
    tagline: 'Applied technical mastery across IFRS reporting, corporate finance, public sector, assurance and taxation — 6 papers.',
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
    tagline: 'Boardroom-level advisory, group reporting, forensic assurance, tax strategy and integrated case synthesis — 5 papers.',
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
    label: 'B.Sc. / HND Accounting — ICAN-Accredited Institution with MCATI Agreement',
    startingLevel: 'ICAN Professional Level',
    estimatedDuration: '~6 months – 1 year (without carryovers)',
    exemptedCodes: ['CBL', 'BE', 'MA', 'FA', 'FR', 'FM', 'PSAF', 'AAF', 'TAX', 'PM'],
    atswaExemptedLevels: [],
    guidance:
      'Accounting graduates from an ICAN-accredited institution with an active Mutual Cooperation Agreement with Tertiary Institutions (MCATI) start directly from the ICAN Professional Level — exempted from all Foundation and Skills Level papers, subject to graduation-year verification.',
    conditions: [
      'Confirm your school appears on the official ICAN MCATI Institutions List (applies strictly to Accounting graduates).',
      'Active MCATI status must cover your exact graduation cohort/session.',
      'Official academic transcript sent directly from your Registrar to ICAN plus NYSC certificate/exemption required.',
      'Progression requires clearing all 5 Professional papers (SBR, CS, AAAF, A/TAX, SFM) to qualify as ACA.',
    ],
  },
  {
    id: 'bsc_hnd_accounting_accredited',
    label: 'B.Sc. / HND Accounting — ICAN-Accredited Institution (Non-MCATI)',
    startingLevel: 'ICAN Skills Level',
    estimatedDuration: '~1 year (without carryovers)',
    exemptedCodes: ['CBL', 'BE', 'MA', 'FA', 'AAF'],
    atswaExemptedLevels: [],
    guidance:
      'Accounting graduates from an ICAN-accredited university or polytechnic start from the ICAN Skills Level — exempted from all 4 Foundation Level courses and Audit, Assurance & Forensics (AAF). You clear the remaining Skills papers before advancing to Professional Level.',
    conditions: [
      'Confirm your institution appears on the official ICAN Accredited Institutions PDF (applies to Accounting graduates).',
      'Accreditation status must be valid for your year of graduation.',
      'Official academic transcript, certified B.Sc./HND certificate and formal ICAN exemption processing required.',
      'All remaining Skills Level courses must be cleared before progressing to Professional Level.',
    ],
  },
  {
    id: 'bsc_hnd_accounting_unaccredited',
    label: 'B.Sc. / HND Accounting — Non-Accredited Institution',
    startingLevel: 'ICAN Foundation Level (Usually Management Accounting Only)',
    estimatedDuration: '~1.5 years (without carryovers)',
    exemptedCodes: ['CBL', 'BE', 'FA'],
    atswaExemptedLevels: [],
    guidance:
      'Accounting graduates from a non-accredited institution commence from the ICAN Foundation Level — typically writing Management Accounting (MA) only at Foundation before advancing to Skills and Professional Levels, subject to official ICAN transcript verification.',
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
      'Graduates from any non-accounting discipline (Sciences, Engineering, Arts, Social Sciences, Tech, Law, etc.) are fully eligible to enrol without starting from ATSWA — commencing directly at ICAN Foundation Level (MA, FA, CBL, BE) and progressing through Skills and Professional.',
    conditions: [
      'Recognised bachelor’s degree or HND certificate from an approved institution.',
      'Complete Student Registration, Annual Subscription & one-time Development Levy before Exam Registration.',
    ],
  },
  {
    id: 'nd_accounting',
    label: 'ND Accounting (ATSWA Undergraduate Entry Route)',
    startingLevel: 'ATSWA — ATS 3 (Exempted from ATS 1 & ATS 2)',
    estimatedDuration: '~1.5 – 2 years to full ACA (ATS 3 → AAT → Skills → Professional)',
    exemptedCodes: [],
    atswaExemptedLevels: ['ATS 1', 'ATS 2'],
    guidance:
      'ND Accounting holders start directly from ATS 3 (exempted from ATS 1 and ATS 2 — writing Cost Accounting, Taxation, Auditing and Management). Upon passing ATS 3 and earning the AAT certificate, you progress directly into ICAN Skills and Professional Levels.',
    conditions: [
      'Recognised NBTE-accredited National Diploma (ND) in Accounting plus 5 O’Level credits incl. English & Mathematics.',
      'Apply for ATS 1 & ATS 2 exemption during ATSWA registration before sitting ATS 3 (March or September diet).',
    ],
  },
  {
    id: 'nd_banking_finance',
    label: 'ND Banking & Finance (ATSWA Undergraduate Entry Route)',
    startingLevel: 'ATSWA — ATS 2 (Exempted from ATS 1)',
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
    startingLevel: 'ATSWA — ATS 1',
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
    exemptions: 'No exemption — complete ATS 1 → ATS 2 → ATS 3',
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
    exemptions: 'Direct graduate entry — no ATSWA required (subject exemptions where applicable)',
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
    exemptions: 'Exempted from Foundation & Skills — starts directly at final stage',
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
      "a) Undergraduate / ATSWA Route: Start via ICAN’s subsidiary scheme — ATSWA (Accounting Technicians Scheme West Africa) — with just an O'Level result. Progress from ATS 1 → ATS 3, earn the AAT certificate, and advance directly to the ICAN main levels (Skills and Professional).",
      'b) Graduate Route: Graduates do not need to start from ATSWA. Depending on your qualification, course and institution’s accreditation status, you begin directly at Foundation Level, Skills Level or Professional Level.',
    ],
  },
  {
    num: 4,
    q: 'How many levels are there in ATSWA and ICAN?',
    a: 'Both programmes have 3 structured stages, and you must pass all courses in a level/stage before progressing to the next:',
    bullets: [
      'ATSWA (3 Levels — 4 courses each): ATS 1 (Basic Accounting Processes & Systems, Economics, Business Law, Communication Skills) → ATS 2 (Financial Accounting, Public Sector Accounting, Quantitative Analysis, Information Technology) → ATS 3 (Cost Accounting, Taxation, Auditing, Management).',
      'ICAN (3 Stages — 15 courses total): Foundation Level (Management Accounting, Financial Accounting, Corporate & Business Law, Business Environment) → Skills Level (Financial Reporting, Performance Management, Public Sector Accounting & Finance, Financial Management, Taxation, Audit, Assurance & Forensics) → Professional Level (Strategic Business Reporting, Strategic Financial Management, Advanced Taxation, Advanced Audit, Assurance & Forensics, Case Study).',
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
    a: 'Examinations hold twice every year — ATSWA in March & September (2 exam days: second-to-last Tue & Wed) and ICAN in May & November (3 exam days: first Tue, Wed & Thu). Estimated completion time without carryovers:',
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
    tagline: '“If I can, you CAN — that’s why it’s ICAN.”',
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

export const STORE_PRODUCTS = [
  {
    id: 'prod-atswa-pq-1',
    title: 'ATSWA ATS 1 Insight Past Questions & Answers',
    category: 'atswa_past_question',
    categoryLabel: 'ATSWA Past Questions',
    programme: 'ATSWA',
    level: 'ATS 1',
    courseCode: null,
    price: 5500,
    imageUrl: '/materials/ats1-past-question.jpg',
    colourBadge: 'Blue Cover · ATS 1',
    accentHex: '#2563EB',
    editionLabel: 'Hard-Copy ATSWA Insight',
    discountHint: '9% off 2+ copies',
    description: 'Official blue-coded ATS 1 Insight past questions & answers with structured workings across BAPS, Economics, Communication Skills & Business Law.',
  },
  {
    id: 'prod-atswa-pq-2',
    title: 'ATSWA ATS 2 Insight Past Questions & Answers',
    category: 'atswa_past_question',
    categoryLabel: 'ATSWA Past Questions',
    programme: 'ATSWA',
    level: 'ATS 2',
    courseCode: null,
    price: 5500,
    imageUrl: '/materials/ats2-past-question.jpg',
    colourBadge: 'Orange Cover · ATS 2',
    accentHex: '#EA580C',
    editionLabel: 'Hard-Copy ATSWA Insight',
    discountHint: '9% off 2+ copies',
    description: 'Official orange-coded ATS 2 Insight past examination questions & answers covering Financial Accounting, Public Sector Accounting, IT & Quantitative Analysis.',
  },
  {
    id: 'prod-atswa-pq-3',
    title: 'ATSWA ATS 3 Insight Past Questions & Answers',
    category: 'atswa_past_question',
    categoryLabel: 'ATSWA Past Questions',
    programme: 'ATSWA',
    level: 'ATS 3',
    courseCode: null,
    price: 5500,
    imageUrl: '/materials/ats3-past-question.jpg',
    colourBadge: 'Dark Green Cover · ATS 3',
    accentHex: '#15803D',
    editionLabel: 'Hard-Copy ATSWA Insight',
    discountHint: '9% off 2+ copies',
    description: 'Official dark-green ATS 3 Insight past questions & answers with examiner workings across Cost Accounting, Auditing, Taxation & Management.',
  },
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
    description: 'Complete printed ATS 1 syllabus study pack covering Basic Accounting Processes & Systems, Economics, Business Law & Communication Skills.',
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
    description: 'Complete printed ATS 2 syllabus study pack covering Financial Accounting, Public Sector Accounting, Quantitative Analysis & Information Technology.',
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
    description: 'Complete printed ATS 3 syllabus study pack covering Cost Accounting, Auditing, Taxation & Management for final AAT candidates.',
  },
  {
    id: 'prod-ican-pq-fnd',
    title: 'ICAN Foundation Pathfinder Past Questions & Answers',
    category: 'ican_past_question',
    categoryLabel: 'ICAN Past Questions',
    programme: 'ICAN',
    level: 'Foundation',
    courseCode: null,
    price: 9000,
    imageUrl: '/materials/ican-past-question.jpg',
    colourBadge: 'Green Pathfinder · Sealed',
    accentHex: '#16A34A',
    editionLabel: 'Nylon-Sealed New Syllabus',
    discountHint: '6% off 2+ copies',
    description: 'Nylon-sealed green ICAN Pathfinder past questions & answers (new syllabus) with full marking-scheme solutions for Foundation Level.',
  },
  {
    id: 'prod-ican-pq-skl',
    title: 'ICAN Skills Pathfinder Past Questions & Answers',
    category: 'ican_past_question',
    categoryLabel: 'ICAN Past Questions',
    programme: 'ICAN',
    level: 'Skills',
    courseCode: null,
    price: 9000,
    imageUrl: '/materials/ican-past-question.jpg',
    colourBadge: 'Green Pathfinder · Sealed',
    accentHex: '#16A34A',
    editionLabel: 'Nylon-Sealed New Syllabus',
    discountHint: '6% off 2+ copies',
    description: 'Nylon-sealed green ICAN Pathfinder past questions & answers (new syllabus) with full IFRS/IPSAS examination workings for Skills Level.',
  },
  {
    id: 'prod-ican-pq-pro',
    title: 'ICAN Professional Pathfinder Past Questions & Answers',
    category: 'ican_past_question',
    categoryLabel: 'ICAN Past Questions',
    programme: 'ICAN',
    level: 'Professional',
    courseCode: null,
    price: 9000,
    imageUrl: '/materials/ican-past-question.jpg',
    colourBadge: 'Green Pathfinder · Sealed',
    accentHex: '#16A34A',
    editionLabel: 'Nylon-Sealed New Syllabus',
    discountHint: '6% off 2+ copies',
    description: 'Nylon-sealed green ICAN Pathfinder past questions & answers (new syllabus) with Case Study dossiers and advisory solutions for Professional Level.',
  },
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
      price: course.studyPackPrice,
      imageUrl: `/materials/ican-sp-${slug}.jpg`,
      colourBadge: `${course.code} Study Text`,
      accentHex: '#2563EB',
      editionLabel: 'Official ICAN Study Text',
      discountHint: '7% off 2+ distinct ICAN packs',
      description: `Official ICAN ${course.level} Level Study Text for ${course.title} (${course.code}) — 2026 syllabus edition with full standards coverage and exam-grade questions.`,
    };
  }),
];

export const DELIVERY_ZONES = [
  { id: 'zone-lasu', name: 'LASU (Lagos State University Campus)', fee: 0, isFree: true, eta: '1 – 2 business days' },
  { id: 'zone-ojo', name: 'Ojo Axis, Lagos', fee: 0, isFree: true, eta: '1 – 2 business days' },
  { id: 'zone-unilag', name: 'UNILAG (Akoka Campus)', fee: 0, isFree: true, eta: '1 – 2 business days' },
  { id: 'zone-yabatech', name: 'YABATECH Campus', fee: 0, isFree: true, eta: '1 – 2 business days' },
  { id: 'zone-fce', name: 'FCE (Akoka)', fee: 0, isFree: true, eta: '1 – 2 business days' },
  { id: 'zone-yaba', name: 'Yaba Axis, Lagos', fee: 0, isFree: true, eta: '1 – 2 business days' },
  { id: 'zone-lagos-mainland', name: 'Other Lagos Mainland Locations', fee: 2500, isFree: false, eta: '1 – 3 business days' },
  { id: 'zone-lagos-island', name: 'Lagos Island / Lekki / Ajah', fee: 3500, isFree: false, eta: '2 – 3 business days' },
  { id: 'zone-southwest', name: 'South-West States (Ogun, Oyo, Osun, Ondo, Ekiti)', fee: 4500, isFree: false, eta: '3 – 5 business days' },
  { id: 'zone-nationwide', name: 'Abuja, Port Harcourt & Other States (Nationwide)', fee: 6000, isFree: false, eta: '4 – 6 business days' },
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
    id: 'connect',
    code: 'VALENCE CONNECT',
    title: 'Academic & Professional Network',
    description: 'Free community membership, open announcements, verified profiles & photo galleries, realtime messaging, study groups, 12 subject forums, voice/video calls and mentorship.',
    route: '/connect',
    metric: '12 Subject Forums',
  },
  {
    id: 'compete',
    code: 'VALENCE COMPETE',
    title: 'National Accounting Challenge & ₦50,000 Rewards',
    description: 'Nigeria’s inter-school championship across all accredited universities, polytechnics and exam divisions — awarding ₦50,000 to outstanding learners after every competition closes.',
    route: '/competitions',
    metric: '₦50,000 Cash Reward',
  },
  {
    id: 'professional',
    code: 'VALENCE PROFESSIONAL',
    title: 'Chartered Accountants & Industry Hub',
    description: 'Verified ACA, FCA, ACCA and CPA profiles, executive networking, CPD-aligned resources, mentorship pairing, speaking invitations and verified tutor recruitment.',
    route: '/portal/professional',
    metric: 'ACA · FCA · ACCA · CPA',
  },
  {
    id: 'marketplace',
    code: 'VALENCE MARKETPLACE',
    title: 'Study Packs, Past Questions & Digital Library',
    description: 'Authentic ICAN and ATSWA study packs, hard-copy past questions with automatic multi-pack discounts, Paystack checkout, free campus delivery zones and PDF textbooks.',
    route: '/store',
    metric: '6 Free Delivery Hubs',
  },
  {
    id: 'advertise',
    code: 'VALENCE ADVERTISE',
    title: 'Independent Tuition Centre Advertising',
    description: 'A neutral, transparent advertising platform and searchable Tuition Centres Directory for verified tutorial institutes nationwide with Paystack billing and live CTR analytics.',
    route: '/advertise',
    metric: '9 Ad Placements',
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

export const FEATURED_TUITION_CENTRES = [
  {
    id: 'tc-1',
    name: 'Apex Ledger School of Accountancy',
    location: 'Ojo & Yaba, Lagos',
    state: 'Lagos',
    programmes: ['ATSWA', 'ICAN Foundation', 'ICAN Skills', 'ICAN Professional'],
    subjects: ['FR', 'SBR', 'SFM', 'TAX', 'PM', 'BAPS', 'PSA'],
    mode: 'Online & Physical',
    verified: true,
    sponsored: true,
    adLabel: 'Sponsored',
    description: 'Intensive diet-focused ICAN and ATSWA lectures, weekend exam clinics, supervised mock diets and step-by-step syllabus mastery.',
    website: 'https://example.com',
    contact: 'Verified Advertiser Profile',
  },
  {
    id: 'tc-2',
    name: 'Meridian Associates Tuition House',
    location: 'Yaba, Lagos',
    state: 'Lagos',
    programmes: ['ICAN Skills', 'ICAN Professional'],
    subjects: ['SBR', 'CS', 'AAAF', 'A/TAX', 'SFM', 'FR'],
    mode: 'Online & Physical',
    verified: true,
    sponsored: true,
    adLabel: 'Sponsored',
    description: 'Specialist Skills and Professional Level revision workshops led by practising chartered accountants with case-study marking drills.',
    website: 'https://example.com',
    contact: 'Verified Advertiser Profile',
  },
  {
    id: 'tc-3',
    name: 'Crestline Professional Tutors',
    location: 'Ikeja, Lagos & Online Nationwide',
    state: 'Lagos',
    programmes: ['ATSWA', 'ICAN Foundation', 'University Accounting'],
    subjects: ['BAPS', 'FA', 'MA', 'CBL', 'BE', 'Cost Accounting'],
    mode: 'Online',
    verified: true,
    sponsored: false,
    adLabel: null,
    description: 'Evening and weekend online classes built for ATSWA candidates and undergraduate accounting students across Nigerian universities.',
    website: 'https://example.com',
    contact: 'Verified Directory Listing',
  },
  {
    id: 'tc-4',
    name: 'Capital Balance Tutorial Institute',
    location: 'Wuse II, Abuja',
    state: 'FCT Abuja',
    programmes: ['ICAN Skills', 'ICAN Professional', 'Professional Training'],
    subjects: ['PSAF', 'FR', 'TAX', 'A/TAX', 'AAF'],
    mode: 'Online & Physical',
    verified: true,
    sponsored: true,
    adLabel: 'Advertisement',
    description: 'IPSAS, public sector finance, Nigerian tax reform workshops and structured May/November ICAN diet coaching.',
    website: 'https://example.com',
    contact: 'Verified Advertiser Profile',
  },
];

export const FEATURED_TUTORS = [
  {
    id: 'tut-1',
    name: 'Adebayo Ogunleye, FCA, AAT',
    initials: 'AO',
    credentials: ['AAT Verified', 'ACA / FCA Verified'],
    tier: 'ICAN & ATSWA Senior Tutor',
    courses: ['SBR', 'FR', 'FA'],
    bio: 'Specialises in IFRS group consolidations, financial instruments and exam-standard reporting templates.',
  },
  {
    id: 'tut-2',
    name: 'Chidinma Nwosu, ACA, AAT',
    initials: 'CN',
    credentials: ['AAT Verified', 'ACA Verified'],
    tier: 'ICAN Skills & Professional Tutor',
    courses: ['SFM', 'FM', 'PM'],
    bio: 'Breaks down hedging, WACC, investment appraisal and variance analysis into repeatable step-by-step workings.',
  },
  {
    id: 'tut-3',
    name: 'Ibrahim Danjuma, ACA, AAT, ACTI',
    initials: 'ID',
    credentials: ['AAT Verified', 'ACA Verified'],
    tier: 'ICAN & ATSWA Tax/Public Sector Tutor',
    courses: ['TAX', 'A/TAX', 'PSAF', 'PSA'],
    bio: 'Focused on current Nigerian Finance Act provisions, capital allowances, petroleum profits and IPSAS accrual statements.',
  },
  {
    id: 'tut-4',
    name: 'Oluwaseun Balogun, AAT, B.Sc.',
    initials: 'OB',
    credentials: ['AAT Verified'],
    tier: 'ATSWA Lead Tutor',
    courses: ['BAPS', 'Cost Accounting', 'QA', 'Audit'],
    bio: 'Dedicated to building rock-solid double-entry accuracy, costing schedules and first-sitting ATSWA confidence.',
  },
];

export const LATEST_OPPORTUNITIES = [
  {
    id: 'opp-1',
    title: '2027 Audit & Assurance Graduate Trainee Programme',
    organisation: 'Tier-1 Professional Services Firm · Lagos & Abuja',
    category: 'Graduate Opportunities',
    eligibility: 'B.Sc./HND (min. 2:1 / Upper Credit) in Accounting, Finance or Economics; ATSWA/ICAN progress is a strong advantage.',
    deadline: '2027-01-31',
    publishedAt: '2026-11-14',
    applyUrl: '#opportunity-detail',
  },
  {
    id: 'opp-2',
    title: 'ICAN Foundation & ATSWA Merit Examination Scholarship',
    organisation: 'Accounting Education Trust Initiative',
    category: 'Scholarships',
    eligibility: 'Registered ATS 2, ATS 3 and ICAN Foundation candidates in accredited Nigerian universities and polytechnics.',
    deadline: '2027-01-15',
    publishedAt: '2026-11-12',
    applyUrl: '#opportunity-detail',
  },
  {
    id: 'opp-3',
    title: 'Tax & Regulatory Compliance Undergraduate Internship (6 Months)',
    organisation: 'Lagos Advisory Practice · Victoria Island',
    category: 'Internships',
    eligibility: '300L/400L Accounting, Taxation or Banking & Finance undergraduates or ATSWA finalists.',
    deadline: '2026-12-20',
    publishedAt: '2026-11-10',
    applyUrl: '#opportunity-detail',
  },
  {
    id: 'opp-4',
    title: 'IFRS 18 & IPSAS Financial Reporting Practical Bootcamp',
    organisation: 'VALENCE Professional Development Series',
    category: 'Workshops',
    eligibility: 'Open to ICAN Skills/Professional students, university finalists and practising accountants (ACA/ACCA).',
    deadline: '2026-12-12',
    publishedAt: '2026-11-16',
    applyUrl: '#opportunity-detail',
  },
];

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
    id: 'evt-3',
    type: 'Professional Webinar',
    programme: 'VALENCE PROFESSIONAL',
    title: 'From Student Candidate to ACA: Audit Careers, Ethics & Mentorship',
    date: '19 Dec 2026 · 5:00 PM WAT',
    mode: 'Online Webinar · 250 Seats',
    access: 'Free Member Registration',
  },
  {
    id: 'evt-4',
    type: '₦50,000 Prize Competition',
    programme: 'VALENCE COMPETE',
    title: 'VALENCE National Accounting Challenge — Qualifier & ₦50,000 Reward Briefing',
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
    timestamp: '2 hours ago',
    likes: 214,
    comments: 34,
  },
  {
    id: 'ann-comm-1',
    isOfficial: false,
    pinned: false,
    authorName: 'Temitope Adeyemi',
    authorCategory: 'ICAN Skills Candidate · University of Lagos (UNILAG)',
    verifiedBadge: null,
    category: 'Study Group Announcements',
    audience: 'Programme · ICAN Skills',
    title: 'Forming a Weekend Consolidation & Cash-Flow Study Group for FR (May 2027)',
    content:
      'We solve two full Section B/C past questions every Saturday at 8 PM WAT and peer-review presentation formats. Open to serious ICAN Skills candidates targeting first-sitting pass in Financial Reporting and PM.',
    timestamp: '5 hours ago',
    likes: 63,
    comments: 18,
  },
  {
    id: 'ann-comm-2',
    isOfficial: false,
    pinned: false,
    authorName: 'Ngozi Okafor, ACA',
    authorCategory: 'Chartered Accountant · Audit Senior',
    verifiedBadge: 'Verified ACA',
    category: 'Mentorship & Learning Tips',
    audience: 'Public · VALENCE Community',
    title: '3 Exam Presentation Habits That Moved My SBR & Case Study Scores Above 68%',
    content:
      'Never bury your IFRS rule inside a calculation paragraph. State the standard, apply it strictly to the scenario facts, cross-reference Working 1 cleanly, and watch your time-per-mark allocation from minute one. Happy to mentor 4 finalists this diet.',
    timestamp: '1 day ago',
    likes: 241,
    comments: 47,
  },
  {
    id: 'ann-comm-3',
    isOfficial: false,
    pinned: false,
    authorName: 'LASU Accounting Society Captain',
    authorCategory: 'University Student · Lagos State University (LASU)',
    verifiedBadge: 'Verified Institution Rep',
    category: 'Competition Announcements',
    audience: 'Institution & Inter-School',
    title: 'Campus Tryouts Open for the VALENCE Challenge — ₦50,000 Merit Cash Reward!',
    content:
      'Calling 200L–400L Accounting and ATSWA students ready to compete in the upcoming VALENCE National Accounting Challenge. Top performers earn the ₦50,000 post-competition cash reward plus Hall of Fame recognition.',
    timestamp: '2 days ago',
    likes: 129,
    comments: 41,
  },
];

export const TESTIMONIALS = [
  {
    id: 'test-1',
    quote:
      'Having my ICAN Skills classes, central diet timetable, 30-day result tracker, past-question store and study partners from universities across Nigeria in one focused platform transformed my preparation.',
    name: 'Damilola Akinwale',
    role: 'ICAN Skills Candidate · Passed 4 Papers in One Sitting',
  },
  {
    id: 'test-2',
    quote:
      'The 7-step examination working structure — interpreting the requirement, citing the IFRS principle, showing clean workings and flagging common traps — trains candidates the exact way markers grade.',
    name: 'Kelechi Eze, FCA, AAT',
    role: 'Practising Chartered Accountant & VALENCE Mentor',
  },
  {
    id: 'test-3',
    quote:
      'Joining VALENCE for free, connecting with peers from my university, competing for the ₦50,000 competition reward and getting free book delivery in Ojo made ATSWA preparation seamless.',
    name: 'Zainab Abdullahi',
    role: 'ATS 3 Finalist · Lagos',
  },
];

export const PLATFORM_STATISTICS = [
  {
    id: 'stat-1',
    label: 'Nigerian Universities Embedded',
    value: UNIVERSITY_COUNTS.total,
    prefix: '',
    suffix: '+',
    detail: 'Federal, State & Private across 36 States + FCT',
  },
  {
    id: 'stat-2',
    label: 'Competition Merit Reward',
    value: 50000,
    prefix: '₦',
    suffix: '',
    detail: 'Awarded to top learners after every competition closes',
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
    q: 'Do I have to pay ₦3,000 just to sign up on VALENCE?',
    a: 'No. Creating a VALENCE account is completely free across students, university undergraduates, general learners and professionals. The one-time ₦3,000 registration fee per level applies ONLY when you want to apply for tuition and unlock your personalised tuition cost implication for that specific ATSWA or ICAN level (and you are never charged twice for an already unlocked level).',
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
    q: 'How does the ₦50,000 competition reward work?',
    a: 'Outstanding learners who excel in VALENCE competitions are rewarded ₦50,000 after every competition closes and official results pass verification and moderator approval, alongside digital certificates and Accounting Hall of Fame recognition.',
  },
  {
    q: 'Are all Nigerian universities supported on VALENCE?',
    a: `Yes. VALENCE includes a built-in searchable directory of ${UNIVERSITY_COUNTS.total}+ NUC-accredited Federal, State and Private universities across all 36 states and FCT Abuja (plus support for polytechnics and colleges) for student profiles, study groups, exemption checks and inter-school competitions.`,
  },
  {
    q: 'How are online payments processed, and when is WhatsApp used?',
    a: 'Paystack is the exclusive online checkout and payment processor across all of VALENCE (tuition application unlocks, online tuition, store orders and advertising packages), verified server-side before access is granted. WhatsApp (+234 915 434 4663) is never used as an online checkout — it handles enquiries, official ICAN fee assistance, physical tuition applications and customer support.',
  },
  {
    q: 'How does the 7% ICAN study pack discount and free campus delivery work?',
    a: 'Purchasing two or more different ICAN study packs in the same transaction — even across Foundation, Skills and Professional levels — triggers an automatic 7% discount on those study packs. ATSWA past questions get 9% off (2+), ATSWA study packs 5% off (2+) and ICAN past questions 6% off (2+). Delivery is free to LASU, Ojo, UNILAG, YABATECH, FCE and Yaba.',
  },
  {
    q: 'Can independent tuition centres advertise on VALENCE?',
    a: 'Yes. VALENCE is an open, neutral ecosystem where verified accounting tuition centres and training providers across Nigeria can list in the public Tuition Centres Directory and run clearly labelled Sponsored campaigns with Paystack billing and live impression/click analytics.',
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
  { id: 'div-atswa', name: 'ATSWA Challenge', level: 'ATS 1 – ATS 3', reward: '₦50,000 Merit Reward', format: '30 MCQ + 20 Short-Answer + Answer 4 of 6 Theory (12.5 marks each = 50m Section C)' },
  { id: 'div-ican-fnd', name: 'ICAN Foundation Challenge', level: 'CBL · BE · MA · FA', reward: '₦50,000 Merit Reward', format: 'Section A: 30m compulsory · Section B: 2 of 3 (20m each = 40m) · Section C: 2 of 4 (15m each = 30m) = 100m' },
  { id: 'div-ican-skl', name: 'ICAN Skills Challenge', level: 'FR · FM · PSAF · AAF · TAX · PM', reward: '₦50,000 Merit Reward', format: 'Section A: 30m compulsory · Section B: 2 of 3 (20m each = 40m) · Section C: 2 of 4 (15m each = 30m) = 100m' },
  { id: 'div-ican-pro', name: 'ICAN Professional Challenge', level: 'SBR · CS · AAAF · A/TAX · SFM', reward: '₦50,000 Merit Reward', format: 'Section A: 30m compulsory · Section B: 2 of 3 (20m each = 40m) · Section C: 2 of 4 (15m each = 30m) = 100m' },
  { id: 'div-uni', name: 'University Accounting Challenge', level: `${UNIVERSITY_COUNTS.total}+ Nigerian Universities & Polytechnics`, reward: '₦50,000 Merit Reward', format: 'Inter-school individual & team tournament across 5 national rounds — syllabus-reviewed before publication' },
  { id: 'div-pro', name: 'Professional Accounting Challenge', level: 'ACA · FCA · ACCA · CPA (Optional Division)', reward: '₦50,000 Merit Reward', format: 'Executive IFRS, tax strategy, forensic assurance & boardroom advisory showcase' },
];

export const COMPETITION_REWARD = {
  amount: 50000,
  currency: 'NGN',
  summary:
    'Learners who demonstrate outstanding performance in VALENCE competitions receive a verified ₦50,000 cash reward immediately after every competition closes and official results are confirmed.',
  eligibilityRules: [
    'Open to verified ATSWA, ICAN, university, polytechnic, college and general accounting candidates.',
    'Awarded after final scoring, anti-cheat audit and appeals review conclude at competition close.',
    'Identity and candidate standing verified before audited ₦50,000 payout disbursement.',
    'Accompanied by verifiable digital merit certificates and VALENCE Hall of Fame induction.',
  ],
};

export const COMPETITION_STRUCTURES = {
  atswa: {
    name: 'ATSWA Competition Paper Structure',
    totalMarks: 100,
    sections: [
      {
        label: 'Section A — Multiple Choice Questions (Compulsory)',
        detail: '30 objective questions × 1 mark each (auto-graded on submission)',
        marks: 30,
      },
      {
        label: 'Section B — Short-Answer Questions (Compulsory)',
        detail: '20 short-answer items × 1 mark each (structured precision check)',
        marks: 20,
      },
      {
        label: 'Section C — Theory & Practical Workings',
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
        label: 'Section A — Compulsory Core Question(s)',
        detail: 'Mandatory foundational / scenario calculation & reporting section',
        marks: 30,
      },
      {
        label: 'Section B — Applied Technical Scenarios',
        detail: 'Answer any 2 out of 3 questions × 20 marks each (rubric graded)',
        marks: 40,
      },
      {
        label: 'Section C — Analytical & Advisory Questions',
        detail: 'Answer any 2 out of 4 questions × 15 marks each (rubric graded)',
        marks: 30,
      },
    ],
  },
};
