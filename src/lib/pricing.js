/**
 * VALENCE Business Rules & Pricing Engine
 *
 * Tuition Cost Implication Visibility Rule:
 * - General platform signup is free.
 * - Students pay the one-time ₦3,000 tuition registration/unlock fee per level ONLY when
 *   they wish to apply for tuition and unlock/view their full cost implication for that level.
 * - Once unlocked (verified server-side via Paystack), calculateAtswaTuition and
 *   calculateIcanTuition compute the student's exact tuition and multi-course discounts.
 * - All rates remain administrator-configurable in Supabase without code deployment.
 */

export function formatNaira(amount) {
  const num = Number(amount || 0);
  return `₦${num.toLocaleString('en-NG')}`;
}

/**
 * ATSWA Tuition Calculator (Unlocked Cost Implication & Server Verification)
 * - ₦20,000 per course
 * - 25% tuition discount per course when selecting 2 or more courses
 * - Maximum tuition for all 4 courses: ₦60,000
 * - One-time registration/unlock fee: ₦3,000 per ATSWA level (permanent, never charged twice,
 *   credited/waived as tutorial registration fee per ATSWA arrangement)
 * - Official fees are separate and NEVER discounted
 */
export function calculateAtswaTuition(courseCount, config = {}) {
  const basePerCourse = config.basePerCourse ?? 20000;
  const discountThreshold = config.discountThreshold ?? 2;
  const discountRate = config.discountRate ?? 0.25;
  const maxTuition = config.maxTuition ?? 60000;
  const unlockFee = config.unlockFee ?? 3000;

  const count = Math.max(0, Math.min(4, Number(courseCount) || 0));
  const grossTuition = count * basePerCourse;
  const qualifiesForDiscount = count >= discountThreshold;
  const rawDiscount = qualifiesForDiscount ? Math.round(grossTuition * discountRate) : 0;
  const netTuition = Math.min(maxTuition, grossTuition - rawDiscount);
  const discountAmount = grossTuition - netTuition;
  const effectivePerCourse = count > 0 ? Math.round(netTuition / count) : basePerCourse;

  return {
    courseCount: count,
    basePerCourse,
    effectivePerCourse,
    grossTuition,
    qualifiesForDiscount,
    discountRate: qualifiesForDiscount ? discountRate : 0,
    discountPercent: qualifiesForDiscount ? Math.round(discountRate * 100) : 0,
    discountAmount,
    netTuition,
    unlockFee,
  };
}

/**
 * ICAN Online Tuition Calculator (Unlocked Cost Implication & Server Verification)
 * - ₦40,000 per course online
 * - 25% discount when selecting 3 or more courses in the same transaction:
 *   1 = ₦40,000 | 2 = ₦80,000 | 3 = ₦90,000 | 4 = ₦120,000 | 5 = ₦150,000 | 6 = ₦180,000
 * - One-time registration/unlock fee: ₦3,000 per level (separate, permanent, NEVER offsets official ICAN fees)
 */
export function calculateIcanTuition(courseCount, config = {}) {
  const basePerCourse = config.basePerCourse ?? 40000;
  const discountThreshold = config.discountThreshold ?? 3;
  const discountRate = config.discountRate ?? 0.25;
  const unlockFee = config.unlockFee ?? 3000;

  const count = Math.max(0, Math.min(6, Number(courseCount) || 0));
  const grossTuition = count * basePerCourse;
  const qualifiesForDiscount = count >= discountThreshold;
  const discountAmount = qualifiesForDiscount ? Math.round(grossTuition * discountRate) : 0;
  const netTuition = grossTuition - discountAmount;
  const effectivePerCourse = count > 0 ? Math.round(netTuition / count) : basePerCourse;

  return {
    courseCount: count,
    basePerCourse,
    effectivePerCourse,
    grossTuition,
    qualifiesForDiscount,
    discountRate: qualifiesForDiscount ? discountRate : 0,
    discountPercent: qualifiesForDiscount ? Math.round(discountRate * 100) : 0,
    discountAmount,
    netTuition,
    unlockFee,
  };
}

/**
 * VALENCE Marketplace Cart & Discount Engine
 * - ATSWA hard-copy past questions: ₦5,500 PER COURSE; automatic 9% off 2+ courses/copies
 * - ATSWA study packs: ₦9,500/pack; automatic 5% off 2+ packs
 * - ICAN Pathfinder past questions: ₦9,000 PER COURSE; automatic 6% off 2+ courses/copies
 * - ICAN study packs: individual per-course prices; automatic 7% off when purchasing 2+ DIFFERENT
 *   ICAN study packs in the same transaction across Foundation, Skills & Professional.
 * - Free delivery zones: LASU, Ojo, UNILAG, YABATECH, FCE, Yaba
 * All prices, discounts and delivery fees are admin-editable via the Admin Portal.
 */
export function calculateStoreCart(cartItems = [], deliveryZone = null, discountConfig = {}) {
  const rules = {
    atswaPastQuestionsRate: discountConfig.atswaPastQuestionsRate ?? 0.09,
    atswaPastQuestionsMinQty: discountConfig.atswaPastQuestionsMinQty ?? 2,
    atswaStudyPackRate: discountConfig.atswaStudyPackRate ?? 0.05,
    atswaStudyPackMinQty: discountConfig.atswaStudyPackMinQty ?? 2,
    icanPastQuestionsRate: discountConfig.icanPastQuestionsRate ?? 0.06,
    icanPastQuestionsMinQty: discountConfig.icanPastQuestionsMinQty ?? 2,
    icanStudyPackRate: discountConfig.icanStudyPackRate ?? 0.07,
    icanStudyPackMinDistinct: discountConfig.icanStudyPackMinDistinct ?? 2,
  };

  const validItems = cartItems.filter((item) => item.quantity > 0);
  const countByType = (type) =>
    validItems.filter((i) => i.category === type).reduce((sum, i) => sum + i.quantity, 0);

  const atswaPqQty = countByType('atswa_past_question');
  const atswaSpQty = countByType('atswa_study_pack');
  const icanPqQty = countByType('ican_past_question');

  const distinctIcanStudyPackCodes = new Set(
    validItems
      .filter((i) => i.category === 'ican_study_pack' && i.courseCode)
      .map((i) => i.courseCode)
  );
  const icanStudyPackDiscountActive =
    distinctIcanStudyPackCodes.size >= rules.icanStudyPackMinDistinct;

  let rawSubtotal = 0;
  let totalDiscount = 0;
  const appliedDiscounts = [];
  let atswaPqSub = 0;
  let atswaSpSub = 0;
  let icanPqSub = 0;
  let icanSpSub = 0;

  validItems.forEach((item) => {
    const lineTotal = item.price * item.quantity;
    rawSubtotal += lineTotal;
    if (item.category === 'atswa_past_question') atswaPqSub += lineTotal;
    if (item.category === 'atswa_study_pack') atswaSpSub += lineTotal;
    if (item.category === 'ican_past_question') icanPqSub += lineTotal;
    if (item.category === 'ican_study_pack') icanSpSub += lineTotal;
  });

  if (atswaPqQty >= rules.atswaPastQuestionsMinQty && atswaPqSub > 0) {
    const amt = Math.round(atswaPqSub * rules.atswaPastQuestionsRate);
    totalDiscount += amt;
    appliedDiscounts.push({
      id: 'atswa_pq',
      label: `ATSWA Past Questions (${Math.round(rules.atswaPastQuestionsRate * 100)}% off ${atswaPqQty} courses/copies)`,
      amount: amt,
    });
  }
  if (atswaSpQty >= rules.atswaStudyPackMinQty && atswaSpSub > 0) {
    const amt = Math.round(atswaSpSub * rules.atswaStudyPackRate);
    totalDiscount += amt;
    appliedDiscounts.push({
      id: 'atswa_sp',
      label: `ATSWA Study Packs (${Math.round(rules.atswaStudyPackRate * 100)}% off ${atswaSpQty} packs)`,
      amount: amt,
    });
  }
  if (icanPqQty >= rules.icanPastQuestionsMinQty && icanPqSub > 0) {
    const amt = Math.round(icanPqSub * rules.icanPastQuestionsRate);
    totalDiscount += amt;
    appliedDiscounts.push({
      id: 'ican_pq',
      label: `ICAN Past Questions (${Math.round(rules.icanPastQuestionsRate * 100)}% off ${icanPqQty} courses/copies)`,
      amount: amt,
    });
  }
  if (icanStudyPackDiscountActive && icanSpSub > 0) {
    const amt = Math.round(icanSpSub * rules.icanStudyPackRate);
    totalDiscount += amt;
    appliedDiscounts.push({
      id: 'ican_sp',
      label: `ICAN Multi-Course Study Pack (${Math.round(rules.icanStudyPackRate * 100)}% off ${distinctIcanStudyPackCodes.size} distinct courses across levels)`,
      amount: amt,
    });
  }

  const discountedSubtotal = Math.max(0, rawSubtotal - totalDiscount);
  const deliveryFee = validItems.length > 0 && deliveryZone ? Number(deliveryZone.fee || 0) : 0;
  const finalTotal = discountedSubtotal + deliveryFee;

  return {
    totalQuantity: validItems.reduce((sum, i) => sum + i.quantity, 0),
    distinctIcanStudyPacks: distinctIcanStudyPackCodes.size,
    rawSubtotal,
    totalDiscount,
    appliedDiscounts,
    discountedSubtotal,
    deliveryFee,
    isFreeDelivery: Boolean(deliveryZone && Number(deliveryZone.fee) === 0),
    finalTotal,
  };
}

/**
 * ICAN Exemption Guidance Evaluator (Advisory — ICAN holds final authority)
 */
export function evaluateIcanExemptions(input, allIcanCourses, exemptionRules) {
  const matchedRule =
    exemptionRules.find((r) => r.id === input.qualificationKey) ||
    exemptionRules[exemptionRules.length - 1];

  const priorPassed = new Set(input.priorPassedCodes || []);
  const exemptedSet = new Set(matchedRule.exemptedCodes || []);

  if (input.professionalQualification === 'ACCA_AFFILIATE_MEMBER') {
    ['CBL', 'BE', 'MA', 'FA', 'FR', 'FM', 'AAF', 'PM'].forEach((c) => exemptedSet.add(c));
  } else if (input.professionalQualification === 'CITN_ACTI') {
    exemptedSet.add('TAX');
  } else if (input.professionalQualification === 'CIMA_ACMA') {
    ['CBL', 'BE', 'MA', 'FA', 'PM', 'FM'].forEach((c) => exemptedSet.add(c));
  }

  const potentialExemptions = allIcanCourses.filter((c) => exemptedSet.has(c.code));
  const remainingCourses = allIcanCourses.filter(
    (c) => !exemptedSet.has(c.code) && !priorPassed.has(c.code)
  );

  return {
    ruleTitle: matchedRule.label,
    startingLevel: matchedRule.startingLevel || 'ICAN Foundation Level',
    estimatedDuration: matchedRule.estimatedDuration || '~1.5 years (without carryovers)',
    atswaExemptedLevels: matchedRule.atswaExemptedLevels || [],
    isAtswaRoute: String(matchedRule.startingLevel || '').startsWith('ATSWA'),
    potentialExemptions,
    remainingCourses,
    conditions: [
      ...matchedRule.conditions,
      ...(input.graduationYear && Number(input.graduationYear) > 2026
        ? ['Awaiting graduation/NYSC: formal statement of result and official transcript are required before ICAN grants final exemption approval.']
        : []),
      ...(input.supportingDocNote
        ? [`Supporting document noted: "${input.supportingDocNote}" — ensure certified copies match ICAN portal submission specifications.`]
        : []),
    ],
    guidance: matchedRule.guidance,
    nextSteps: [
      'Check if your school is on ICAN’s official Accredited Institutions PDF or MCATI List PDF (applicable to Accounting graduates).',
      'Confirm your official exemption status on icanig.org/ican (Students → Exemptions → Professional → Professional Exemption Guide).',
      'Complete Student Registration, Annual Subscription & one-time Development Levy, then process confirmed exemptions before Exam Registration (closes 1 week before Exam Day 1).',
      'Apply for VALENCE tuition on your confirmed remaining papers — VALENCE never automatically removes a course from enrolment based on an estimated exemption.',
    ],
    disclaimer:
      'Important Advisory Notice: This output is an educational guidance estimate on VALENCE. The Institute of Chartered Accountants of Nigeria (ICAN) holds sole authority to approve, modify or decline exemptions.',
  };
}

/**
 * VALENCE ADVERTISE — Weekly Tuition Centre Advertisement Rate Calculator
 * Default official rate: ₦10,000 per week (admin-editable from the Admin Portal).
 * All campaign applications, approvals, creative management & Paystack payments run in-app.
 */
export function calculateAdCampaignCost(weeks = 1, weeklyRate = 10000, placementCount = 1) {
  const safeWeeks = Math.max(1, Math.min(52, Math.floor(Number(weeks) || 1)));
  const safeSlots = Math.max(1, Math.min(9, Math.floor(Number(placementCount) || 1)));
  const safeRate = Math.max(0, Number(weeklyRate) || 10000);
  const totalAmount = safeWeeks * safeSlots * safeRate;
  return {
    weeks: safeWeeks,
    placementCount: safeSlots,
    weeklyRate: safeRate,
    totalAmount,
  };
}

/**
 * Prefilled WhatsApp Enquiry Link Builder
 * Strictly for official ICAN fee assistance, physical tuition applications and general support.
 * ATSWA document & registration guidance, study materials & delivery enquiries, and
 * VALENCE ADVERTISE tuition-centre campaigns are all handled directly inside the VALENCE app.
 * NEVER used as an online payment checkout.
 */
export function buildWhatsAppEnquiryUrl({
  whatsappNumber = '+234 915 434 4663',
  category = 'General Support Enquiry',
  studentName = '',
  programme = '',
  level = '',
  details = '',
}) {
  const digits = String(whatsappNumber).replace(/[^\d]/g, '');
  const lines = ['Hello VALENCE Support Desk,', '', `Enquiry Category: ${category}`];
  if (studentName.trim()) lines.push(`Name: ${studentName.trim()}`);
  if (programme.trim()) lines.push(`Programme: ${programme.trim()}`);
  if (level.trim()) lines.push(`Examination Level: ${level.trim()}`);
  if (details.trim()) {
    lines.push('', `Details: ${details.trim()}`);
  }
  lines.push('', 'Sent via VALENCE Official Platform.');
  return `https://wa.me/${digits}?text=${encodeURIComponent(lines.join('\n'))}`;
}
