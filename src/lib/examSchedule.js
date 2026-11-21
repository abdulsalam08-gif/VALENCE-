/**
 * VALENCE Examination Diet Schedule & Lifecycle Engine
 *
 * Default Statutory Rules (all individually overridable by VALENCE Central Academic Authority
 * whenever ICAN / ATSWA adjusts official dates or announces result delays):
 *
 * 1. ATSWA Diets (March & September), 2 Examination Days:
 *    - Always the second-to-last Tuesday and Wednesday of March or September.
 *    - Exam registration closes exactly 7 days (1 week) before Exam Day 1.
 *    - Result release countdown runs for 30 days after the last exam day (subject to delay/override).
 *
 * 2. ICAN Diets (May & November), 3 Examination Days:
 *    - Standard schedule: First Tuesday, Wednesday and Thursday of May or November
 *      (configurable by Central Academic Authority when the Institute adjusts dates).
 *    - Exam registration closes exactly 7 days (1 week) before Exam Day 1.
 *    - Result release countdown runs for 30 days after the last exam day (subject to delay/override).
 */

const DAY_MS = 24 * 60 * 60 * 1000;

function pad(n) {
  return String(n).padStart(2, '0');
}

export function toIsoDate(year, monthIndex0, day) {
  return `${year}-${pad(monthIndex0 + 1)}-${pad(day)}`;
}

export function addDaysIso(isoDate, days) {
  const [y, m, d] = isoDate.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())}`;
}

export function formatReadableDate(isoDate, includeWeekday = true) {
  if (!isoDate) return 'TBA';
  const [y, m, d] = isoDate.slice(0, 10).split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  return dt.toLocaleDateString('en-NG', {
    weekday: includeWeekday ? 'short' : undefined,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/**
 * Compute second-to-last Tuesday (and following Wednesday) of a given month.
 * Ensures the paired Wednesday also falls within the two-day ATSWA window.
 */
export function computeAtswaDefaultDates(year, monthIndex0) {
  const daysInMonth = new Date(Date.UTC(year, monthIndex0 + 1, 0)).getUTCDate();
  const tuesdays = [];
  for (let d = 1; d <= daysInMonth; d += 1) {
    const dow = new Date(Date.UTC(year, monthIndex0, d)).getUTCDay();
    if (dow === 2) tuesdays.push(d); // 2 = Tuesday
  }
  const secondToLastTue = tuesdays[tuesdays.length - 2];
  const day1 = toIsoDate(year, monthIndex0, secondToLastTue);
  const day2 = addDaysIso(day1, 1); // Wednesday
  const registrationClose = addDaysIso(day1, -7); // 1 week before exam
  const expectedResultDate = addDaysIso(day2, 30); // 30 days after last exam day

  return {
    examDays: [day1, day2],
    examStartDate: `${day1}T09:00:00+01:00`,
    examEndDate: `${day2}T17:00:00+01:00`,
    registrationClose,
    registrationCloseAt: `${registrationClose}T23:59:59+01:00`,
    expectedResultDate,
    resultReleaseAt: `${expectedResultDate}T12:00:00+01:00`,
    durationDays: 2,
    patternLabel: '2 Days · Second-to-last Tuesday & Wednesday',
  };
}

/**
 * Compute first Tuesday, Wednesday and Thursday of a given month for ICAN levels.
 */
export function computeIcanDefaultDates(year, monthIndex0) {
  let firstTue = 1;
  while (new Date(Date.UTC(year, monthIndex0, firstTue)).getUTCDay() !== 2) {
    firstTue += 1;
  }
  const day1 = toIsoDate(year, monthIndex0, firstTue); // Tuesday
  const day2 = addDaysIso(day1, 1); // Wednesday
  const day3 = addDaysIso(day1, 2); // Thursday
  const registrationClose = addDaysIso(day1, -7); // 1 week before exam
  const expectedResultDate = addDaysIso(day3, 30); // 30 days after last exam day

  return {
    examDays: [day1, day2, day3],
    examStartDate: `${day1}T09:00:00+01:00`,
    examEndDate: `${day3}T17:00:00+01:00`,
    registrationClose,
    registrationCloseAt: `${registrationClose}T23:59:59+01:00`,
    expectedResultDate,
    resultReleaseAt: `${expectedResultDate}T12:00:00+01:00`,
    durationDays: 3,
    patternLabel: '3 Days · First Tuesday, Wednesday & Thursday',
  };
}

/**
 * Build a complete diet session object combining default calendar rules
 * with optional Central Academic Authority overrides (dates, timetable, result delays).
 */
export function buildDietSession({
  id,
  programme,
  diet,
  year,
  tuitionCommencement,
  timetable = [],
  overrides = {},
}) {
  const monthMap = { March: 2, May: 4, September: 8, November: 10 };
  const monthIdx = monthMap[diet];
  const base =
    programme === 'ATSWA'
      ? computeAtswaDefaultDates(year, monthIdx)
      : computeIcanDefaultDates(year, monthIdx);

  const examDays = overrides.examDays || base.examDays;
  const firstDay = examDays[0];
  const lastDay = examDays[examDays.length - 1];
  const registrationClose = overrides.registrationClose || addDaysIso(firstDay, -7);
  const expectedResultDate = overrides.expectedResultDate || addDaysIso(lastDay, 30);

  return {
    id,
    programme,
    diet,
    year,
    label: `${programme} ${diet} ${year} Diet`,
    isPublished: overrides.isPublished ?? true,
    isScheduleAdjusted: Boolean(overrides.examDays || overrides.expectedResultDate),
    authorityNotice:
      overrides.authorityNotice ||
      'Dates & timetable governed by VALENCE Central Academic Authority and updated immediately if the Institute revises the official schedule.',
    resultDelayNotice:
      overrides.resultDelayNotice ||
      'Standard release estimate is 30 days after the final examination day; subject to adjustment if official release is delayed.',
    resultsReleased: Boolean(overrides.resultsReleased),
    durationDays: examDays.length,
    patternLabel: base.patternLabel,
    examDays,
    examWindow: `${formatReadableDate(firstDay, true)} – ${formatReadableDate(lastDay, true)}`,
    examStartDate: `${firstDay}T09:00:00+01:00`,
    examEndDate: `${lastDay}T17:00:00+01:00`,
    registrationClose,
    registrationCloseFormatted: formatReadableDate(registrationClose, true),
    registrationCloseAt: `${registrationClose}T23:59:59+01:00`,
    expectedResultDate,
    expectedResultFormatted: formatReadableDate(expectedResultDate, true),
    resultReleaseAt: `${expectedResultDate}T12:00:00+01:00`,
    tuitionCommencement,
    tuitionCommencementFormatted: formatReadableDate(tuitionCommencement, false),
    mockExamDate: overrides.mockExamDate || addDaysIso(firstDay, -10),
    timetable,
  };
}

/**
 * Convert a Postgres timestamptz string ("2027-03-23 00:00:00+00") to a YYYY-MM-DD ISO date.
 * Returns null for null/empty values.
 */
function pgToIsoDate(ts) {
  if (!ts) return null;
  const s = String(ts);
  // Handle both "2027-03-23 00:00:00+00" and ISO "2027-03-23T00:00:00.000Z"
  const m = s.match(/(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : null;
}

/**
 * Map a raw `examination_sessions` DB row into the buildDietSession-compatible
 * shape the app renders (homepage hero card, programmes page, lifecycle engine).
 *
 * DB column notes:
 *   - `diet` column actually stores the programme ("ATSWA" / "ICAN");
 *     the calendar month is embedded in `name` (e.g. "ATSWA May 2027 Diet").
 *   - Explicit timestamps take precedence as Central Academic Authority overrides.
 */
export function mapExamSessionRow(row, { timetable = [] } = {}) {
  const name = row.name || '';
  const programme = /ATSWA/i.test(row.diet || '') || /ATSWA/i.test(name) ? 'ATSWA' : 'ICAN';

  const monthMatch = name.match(
    /(January|February|March|April|May|June|July|August|September|October|November|December)/i
  );
  // Normalize to a valid ICAN/ATSWA diet month so buildDietSession's default
  // calendar computation stays valid even for unusual row names.
  const VALID_MONTHS = ['March', 'May', 'September', 'November'];
  const parsedMonth = monthMatch ? monthMatch[1] : 'May';
  const diet = VALID_MONTHS.includes(parsedMonth) ? parsedMonth : 'May';
  const year = row.year || new Date().getUTCFullYear();

  // Build the examDays array from exam_starts .. exam_ends (inclusive).
  let examDays = [];
  const start = pgToIsoDate(row.exam_starts);
  const end = pgToIsoDate(row.exam_ends);
  if (start) {
    let cur = start;
    const stop = end || start;
    while (cur <= stop) {
      examDays.push(cur);
      cur = addDaysIso(cur, 1);
    }
  }

  const resultReleaseDate = pgToIsoDate(row.result_release_date);
  const isPublished = row.status !== 'archived' && !row.is_archived;

  const overrides = {
    ...(examDays.length ? { examDays } : {}),
    ...(row.registration_closes ? { registrationClose: pgToIsoDate(row.registration_closes) } : {}),
    ...(resultReleaseDate ? { expectedResultDate: resultReleaseDate } : {}),
    ...(row.result_delay_notice ? { resultDelayNotice: row.result_delay_notice } : {}),
    ...(resultReleaseDate && new Date(`${resultReleaseDate}T00:00:00Z`) < new Date()
      ? { resultsReleased: true }
      : {}),
    isPublished,
    ...(row.mock_exam_date ? { mockExamDate: pgToIsoDate(row.mock_exam_date) } : {}),
  };

  return buildDietSession({
    id: row.id,
    programme,
    diet,
    year,
    tuitionCommencement: row.tuition_commencement ? pgToIsoDate(row.tuition_commencement) : undefined,
    timetable,
    overrides,
  });
}

/**
 * Determine the real-time operational phase and active countdown target for any diet session.
 */
export function getSessionLifecycle(session, nowMs = Date.now()) {
  const regCloseMs = new Date(session.registrationCloseAt).getTime();
  const examStartMs = new Date(session.examStartDate).getTime();
  const examEndMs = new Date(session.examEndDate).getTime();
  const resultMs = new Date(session.resultReleaseAt).getTime();

  if (session.resultsReleased) {
    return {
      phase: 'results_released',
      badgeLabel: 'Results Released',
      badgeVariant: 'green',
      canRegister: false,
      countdownLabel: 'Official Diet Results Published',
      countdownTarget: null,
      subNote: 'Contact the Central Academic Authority for post-diet transcript and progression guidance.',
    };
  }

  if (nowMs < regCloseMs) {
    const daysToRegClose = Math.ceil((regCloseMs - nowMs) / DAY_MS);
    return {
      phase: 'registration_open',
      badgeLabel: daysToRegClose <= 14 ? 'Registration Closing Soon' : 'Registration Open',
      badgeVariant: daysToRegClose <= 14 ? 'red' : 'green',
      canRegister: true,
      countdownLabel: `Countdown to ${session.programme} ${session.diet} ${session.year} Exams`,
      countdownTarget: session.examStartDate,
      secondaryCountdownLabel: 'Exam Registration Closes (1 Week Before Exam)',
      secondaryCountdownTarget: session.registrationCloseAt,
      subNote: `Registration closes ${session.registrationCloseFormatted} (7 days before Day 1).`,
    };
  }

  if (nowMs >= regCloseMs && nowMs < examStartMs) {
    return {
      phase: 'registration_closed',
      badgeLabel: 'Registration Closed · Exam Imminent',
      badgeVariant: 'red',
      canRegister: false,
      countdownLabel: 'Final Countdown to Examination Day 1',
      countdownTarget: session.examStartDate,
      subNote: 'Exam registration closed 1 week prior. Admin override required for late changes.',
    };
  }

  if (nowMs >= examStartMs && nowMs <= examEndMs) {
    const dayIndex = Math.min(
      session.durationDays,
      Math.floor((nowMs - examStartMs) / DAY_MS) + 1
    );
    return {
      phase: 'exam_in_progress',
      badgeLabel: `Exams Live · Day ${dayIndex} of ${session.durationDays}`,
      badgeVariant: 'live',
      canRegister: false,
      countdownLabel: '30-Day Result Countdown Begins After Final Paper',
      countdownTarget: session.examEndDate,
      subNote: 'Examination currently in session. Result release timer starts immediately after the final paper.',
    };
  }

  if (nowMs > examEndMs && nowMs <= resultMs) {
    return {
      phase: 'awaiting_results',
      badgeLabel: '30-Day Result Countdown Active',
      badgeVariant: 'green',
      canRegister: false,
      countdownLabel: `Estimated Result Release (${session.expectedResultFormatted})`,
      countdownTarget: session.resultReleaseAt,
      subNote: session.resultDelayNotice,
    };
  }

  return {
    phase: 'results_delayed',
    badgeLabel: 'Result Release Pending (Possible Delay)',
    badgeVariant: 'red',
    canRegister: false,
    countdownLabel: '30-Day Standard Window Elapsed: Awaiting Official Release',
    countdownTarget: null,
    subNote:
      'Official result release is experiencing a schedule delay. Central Academic Authority will update immediately upon confirmation.',
  };
}
