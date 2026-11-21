import React, { useState, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ExternalLink,
  Scale,
  Lock,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  Sparkles,
  FileCheck2,
  MessageCircle,
  Download,
  BookOpen,
  Clock,
  Award,
} from 'lucide-react';
import { usePublicData, useUi } from '../context/PlatformContext';
import { useToast } from '../context/ToastContext';
import Badge from '../components/ui/Badge';

export default function OtherBodiesPage() {
  const { bodyId } = useParams();
  const navigate = useNavigate();
  const { otherBodies, settings } = usePublicData();

  const body = useMemo(
    () => otherBodies.find((b) => b.id === bodyId) || otherBodies[0],
    [otherBodies, bodyId]
  );

  if (!body) return null;

  const subTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'levels', label: 'Levels & Papers' },
    { id: 'exemptions', label: 'Exemptions' },
    { id: 'registration', label: 'Registration' },
    { id: 'faqs', label: 'Candidate FAQs' },
  ];
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div>
      {/* Hero */}
      <section className="bg-grid-fintech py-14 sm:py-18">
        <div className="v-container space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="green">{body.badge}</Badge>
            <Badge variant="neutral">Online Tuition via VALENCE · ₦3,000 Unlock</Badge>
          </div>
          <div className="space-y-3 max-w-4xl">
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-white">
              {body.fullName}
            </h1>
            <p className="text-sm sm:text-base text-[#9AA4B2] max-w-3xl">
              Explore the {body.name} qualification on VALENCE — structured levels, exemption guidance, registration steps,
              and online tuition with verified tutors. VALENCE sells hard-copy materials exclusively for ATSWA and ICAN;
              for {body.name}, verified authors provide direct soft-copy download links on their ad cards.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={body.officialWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="v-btn-secondary text-xs"
            >
              Official {body.name} Website <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <button
              type="button"
              onClick={() => setActiveTab('exemptions')}
              className="v-btn-primary text-xs"
            >
              <Scale className="h-4 w-4" /> Check My Exemptions
            </button>
            <Link to="/portal/student?mode=register" className="v-btn-secondary text-xs">
              Join VALENCE Free <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Body switcher */}
      <section className="border-b border-white/[0.08] bg-[#0D1116]">
        <div className="v-container flex flex-wrap gap-2 py-4">
          {otherBodies.map((b) => (
            <button
              key={b.id}
              onClick={() => navigate(`/programmes/other/${b.id}`)}
              className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
                b.id === body.id
                  ? 'bg-[#16C784] text-[#06130D]'
                  : 'bg-[#11161C] text-[#9AA4B2] border border-white/[0.08] hover:text-white'
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>
      </section>

      {/* Sub-navigation tabs */}
      <section className="bg-[#0D1116]">
        <div className="v-container flex flex-wrap gap-1.5 py-3">
          {subTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition ${
                activeTab === tab.id
                  ? 'bg-[#16C784]/15 text-[#16C784] border border-[#16C784]/30'
                  : 'text-[#9AA4B2] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Overview tab */}
      {activeTab === 'overview' && (
        <OtherBodiesOverview body={body} settings={settings} />
      )}

      {/* Levels tab */}
      {activeTab === 'levels' && (
        <OtherBodiesLevels body={body} />
      )}

      {/* Exemptions tab */}
      {activeTab === 'exemptions' && (
        <OtherBodiesExemptions body={body} settings={settings} />
      )}

      {/* Registration tab */}
      {activeTab === 'registration' && (
        <OtherBodiesRegistration body={body} settings={settings} />
      )}

      {/* FAQs tab */}
      {activeTab === 'faqs' && (
        <OtherBodiesFaqs body={body} settings={settings} />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Overview                                                            */
/* ------------------------------------------------------------------ */

function OtherBodiesOverview({ body, settings }) {
  const totalPapers = body.levels.reduce((sum, lvl) => sum + lvl.courses.length, 0);

  return (
    <section className="py-14 sm:py-18">
      <div className="v-container space-y-10">
        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="v-card p-5 space-y-1.5">
            <span className="font-display text-3xl font-bold text-[#16C784]">{body.levels.length}</span>
            <p className="text-xs text-[#9AA4B2]">Stages</p>
          </div>
          <div className="v-card p-5 space-y-1.5">
            <span className="font-display text-3xl font-bold text-[#16C784]">{totalPapers}</span>
            <p className="text-xs text-[#9AA4B2]">Total Papers</p>
          </div>
          <div className="v-card p-5 space-y-1.5">
            <span className="font-display text-sm font-bold text-[#16C784]">{body.diets}</span>
            <p className="text-xs text-[#9AA4B2]">Exam Diets</p>
          </div>
          <div className="v-card p-5 space-y-1.5">
            <span className="font-display text-sm font-bold text-[#16C784]">₦3,000</span>
            <p className="text-xs text-[#9AA4B2]">Per-Level Unlock</p>
          </div>
        </div>

        {/* What VALENCE offers for this body */}
        <div className="v-container">
          <div className="space-y-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-white">What VALENCE Offers for {body.name}</h2>
              <p className="text-sm text-[#9AA4B2] mt-1">
                A complete support ecosystem for {body.name} candidates — from exemption guidance to online tuition and materials.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="v-card-hover p-6 space-y-3">
                <div className="h-10 w-10 rounded-xl bg-[#16C784]/15 border border-[#16C784]/30 flex items-center justify-center text-[#16C784]">
                  <Scale className="h-5 w-5" />
                </div>
                <h3 className="font-display font-bold text-white">Exemption Guidance</h3>
                <p className="text-xs text-[#9AA4B2]">
                  Check your starting stage and potential paper exemptions based on your qualifications. Guidance estimates only — the body holds sole authority for final approvals.
                </p>
              </div>
              <div className="v-card-hover p-6 space-y-3">
                <div className="h-10 w-10 rounded-xl bg-[#16C784]/15 border border-[#16C784]/30 flex items-center justify-center text-[#16C784]">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h3 className="font-display font-bold text-white">Online Tuition</h3>
                <p className="text-xs text-[#9AA4B2]">
                  Structured online classes with verified tutors who hold the highest qualification in {body.name}. Pay ₦3,000 per level to unlock cost implications.
                </p>
              </div>
              <div className="v-card-hover p-6 space-y-3">
                <div className="h-10 w-10 rounded-xl bg-[#16C784]/15 border border-[#16C784]/30 flex items-center justify-center text-[#16C784]">
                  <Download className="h-5 w-5" />
                </div>
                <h3 className="font-display font-bold text-white">Soft-Copy Materials</h3>
                <p className="text-xs text-[#9AA4B2]">
                  VALENCE does not sell hard-copy materials for {body.name}. Verified authors advertise on VALENCE and provide direct soft-copy download links on their ad cards.
                </p>
              </div>
              <div className="v-card-hover p-6 space-y-3">
                <div className="h-10 w-10 rounded-xl bg-[#16C784]/15 border border-[#16C784]/30 flex items-center justify-center text-[#16C784]">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <h3 className="font-display font-bold text-white">Registration & Fee Support</h3>
                <p className="text-xs text-[#9AA4B2]">
                  24/7 WhatsApp support for official {body.name} registration, subscription, and exam fee assistance. All online tuition and payments run in-app via Paystack.
                </p>
              </div>
              <div className="v-card-hover p-6 space-y-3">
                <div className="h-10 w-10 rounded-xl bg-[#16C784]/15 border border-[#16C784]/30 flex items-center justify-center text-[#16C784]">
                  <Award className="h-5 w-5" />
                </div>
                <h3 className="font-display font-bold text-white">Verified Tutors</h3>
                <p className="text-xs text-[#9AA4B2]">
                  Tutors apply with their highest {body.name} qualification, undergo certificate verification, and pass a rigorous assessment before teaching on VALENCE.
                </p>
              </div>
              <div className="v-card-hover p-6 space-y-3">
                <div className="h-10 w-10 rounded-xl bg-[#16C784]/15 border border-[#16C784]/30 flex items-center justify-center text-[#16C784]">
                  <Clock className="h-5 w-5" />
                </div>
                <h3 className="font-display font-bold text-white">Completion Timelines</h3>
                <p className="text-xs text-[#9AA4B2]">
                  See estimated completion durations for each entry route, so you can plan your journey from start to qualification.
                </p>
              </div>
            </div>
          </div>

          {/* Materials note */}
          <div className="v-card p-5 mt-8 space-y-3">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="h-4 w-4 text-[#16C784] shrink-0 mt-0.5" />
              <div className="text-xs text-[#9AA4B2]">
                <strong className="text-white">Materials note:</strong> VALENCE sells hard-copy study materials (past questions and study packs) exclusively for ATSWA and ICAN.
                For {body.name}, verified authors advertise on VALENCE and provide direct soft-copy download links on their ad cards in the{' '}
                <Link to="/tuition-centres" className="text-[#16C784] hover:underline">Tuition Centres & Partners</Link> directory.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Levels & Papers                                                     */
/* ------------------------------------------------------------------ */

function OtherBodiesLevels({ body }) {
  return (
    <section className="py-14 sm:py-18">
      <div className="v-container space-y-8">
        <div className="space-y-2">
          <h2 className="font-display text-2xl font-bold text-white">{body.name} Stages & Papers</h2>
          <p className="text-sm text-[#9AA4B2]">
            {body.levels.length} structured stages. You must pass all papers in a stage before progressing to the next.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {body.levels.map((lvl, idx) => (
            <div key={lvl.id} className="v-card-hover p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between gap-2">
                <div className="h-10 w-10 rounded-xl bg-[#16C784]/15 border border-[#16C784]/30 flex items-center justify-center">
                  <span className="font-display font-bold text-[#16C784]">{idx + 1}</span>
                </div>
                <Badge variant="neutral">{lvl.stages}</Badge>
              </div>
              <div>
                <h3 className="font-display text-sm font-bold text-white leading-tight">{lvl.name}</h3>
                <p className="text-[11px] text-[#9AA4B2] mt-0.5">{lvl.diets}</p>
              </div>
              <div className="space-y-1.5 mt-auto">
                {lvl.courses.map((c) => (
                  <div key={c.code} className="flex items-center justify-between rounded-lg bg-[#0B0E11] border border-white/[0.07] px-3 py-2">
                    <span className="text-xs text-[#C2C9D4]">{c.title}</span>
                    <span className="font-display font-bold text-[#16C784] text-[11px]">{c.code}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-white/[0.06] space-y-1">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9AA4B2]">Required Documents</p>
                <ul className="space-y-0.5">
                  {lvl.requiredDocuments.map((doc) => (
                    <li key={doc} className="flex items-start gap-1.5 text-[11px] text-[#9AA4B2]">
                      <CheckCircle2 className="h-3 w-3 text-[#16C784] shrink-0 mt-0.5" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Tuition unlock CTA */}
        <div className="v-glass-card p-6 sm:p-8 border-[#16C784]/35 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#16C784]">
              <Sparkles className="h-4 w-4" /> {body.name} Online Tuition
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
              Ready to start your {body.name} journey?
            </h3>
            <p className="text-xs sm:text-sm text-[#9AA4B2]">
              Pay the one-time ₦3,000 per-level unlock to view your cost implication, then apply for tuition with verified tutors.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {}}
              className="v-btn-secondary text-xs"
            >
              <Scale className="h-4 w-4 text-[#16C784]" /> Check Exemptions
            </button>
            <Link to="/portal/student?mode=register" className="v-btn-primary text-xs">
              Apply for Tuition <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Exemptions                                                          */
/* ------------------------------------------------------------------ */

function OtherBodiesExemptions({ body, settings }) {
  const [exInput, setExInput] = useState({
    qualificationKey: body.exemptionRules[0].id,
    institution: '',
    graduationYear: '',
    courseStudied: '',
    supportingDocNote: '',
  });
  const [exResult, setExResult] = useState(null);

  const runExemptionCheck = (e) => {
    e.preventDefault();
    const matchedRule = body.exemptionRules.find((r) => r.id === exInput.qualificationKey) || body.exemptionRules[0];
    setExResult({
      ruleTitle: matchedRule.label,
      startingLevel: matchedRule.startingLevel,
      estimatedDuration: matchedRule.estimatedDuration,
      guidance: matchedRule.guidance,
      conditions: matchedRule.conditions,
      potentialExemptions: matchedRule.exemptedCodes,
      disclaimer: `Important Advisory Notice: This output is an educational guidance estimate on VALENCE. The ${body.fullName} holds sole authority to approve, modify or decline exemptions.`,
    });
  };

  return (
    <section className="py-14 sm:py-18">
      <div className="v-container space-y-8">
        <div className="space-y-2">
          <h2 className="font-display text-2xl font-bold text-white">{body.name} Exemption & Starting-Level Guide</h2>
          <p className="text-sm text-[#9AA4B2]">
            Find your starting stage and potential paper exemptions based on your qualification. This is a guidance estimate — the body confirms final exemptions on its official portal.
          </p>
        </div>

        {/* Official portal link */}
        <a
          href={body.officialWebsite}
          target="_blank"
          rel="noopener noreferrer"
          className="v-card-hover p-5 flex items-center justify-between gap-4"
        >
          <div className="space-y-1">
            <Badge variant="green">Official Exemption Portal</Badge>
            <h3 className="font-display text-sm font-bold text-white">Check {body.name} Exemptions on the Official Portal</h3>
            <p className="text-xs text-[#9AA4B2]">
              Visit <strong className="text-white">{body.officialWebsite}</strong> and log in to your student portal to view confirmed exemptions.
            </p>
          </div>
          <ExternalLink className="h-4 w-4 text-[#16C784] shrink-0" />
        </a>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form */}
          <form onSubmit={runExemptionCheck} className="lg:col-span-6 v-card p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-white">Qualification & Starting-Level Check</h3>
              <Badge variant="green">Free Advisory Tool</Badge>
            </div>

            <div>
              <label className="v-label" htmlFor="ob-qual">Entry Route & Qualification</label>
              <select
                id="ob-qual"
                value={exInput.qualificationKey}
                onChange={(e) => setExInput({ ...exInput, qualificationKey: e.target.value })}
                className="v-input text-xs"
              >
                {body.exemptionRules.map((r) => (
                  <option key={r.id} value={r.id}>{r.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="v-label" htmlFor="ob-university">Awarding Institution (Optional)</label>
              <input
                id="ob-university"
                type="text"
                value={exInput.institution}
                onChange={(e) => setExInput({ ...exInput, institution: e.target.value })}
                placeholder="e.g. University of Lagos"
                className="v-input text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="v-label" htmlFor="ob-year">Graduation Year</label>
                <input
                  id="ob-year"
                  type="number"
                  min="1980"
                  max="2032"
                  value={exInput.graduationYear}
                  onChange={(e) => setExInput({ ...exInput, graduationYear: e.target.value })}
                  className="v-input"
                />
              </div>
              <div>
                <label className="v-label" htmlFor="ob-course">Course Studied</label>
                <input
                  id="ob-course"
                  type="text"
                  value={exInput.courseStudied}
                  onChange={(e) => setExInput({ ...exInput, courseStudied: e.target.value })}
                  placeholder="e.g. Accounting"
                  className="v-input"
                />
              </div>
            </div>

            <div>
              <label className="v-label" htmlFor="ob-docs">Supporting Documents Available</label>
              <input
                id="ob-docs"
                type="text"
                value={exInput.supportingDocNote}
                onChange={(e) => setExInput({ ...exInput, supportingDocNote: e.target.value })}
                placeholder="e.g. Official transcript, degree certificate, NYSC discharge"
                className="v-input"
              />
            </div>

            <button type="submit" className="v-btn-primary w-full py-3">
              <Scale className="h-4 w-4" /> Check Starting Level & Potential Exemptions
            </button>
          </form>

          {/* Result / Quick Summary */}
          <div className="lg:col-span-6 space-y-5">
            {!exResult ? (
              <div className="v-card p-7 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-2xl bg-[#16C784]/[0.12] border border-[#16C784]/25 flex items-center justify-center text-[#16C784] shrink-0">
                    <FileCheck2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-white">Quick Starting-Level Summary</h3>
                    <p className="text-xs text-[#9AA4B2]">
                      Run the form on the left for your full paper-by-paper breakdown.
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-xs">
                  {body.exemptionRules.map((r) => (
                    <div
                      key={r.id}
                      className="rounded-xl bg-[#0B0E11] border border-white/[0.07] px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2"
                    >
                      <span className="text-[#D5DBE3] font-medium truncate">{r.label}</span>
                      <span className="font-display font-bold text-[#16C784] shrink-0">{r.startingLevel}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-[#667085]">
                  {body.fullName} holds sole authority for final exemption approvals. VALENCE never automatically removes a paper from enrolment.
                </p>
              </div>
            ) : (
              <div className="v-card p-6 sm:p-7 space-y-5 animate-fade-up">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Badge variant="green">Exemption & Entry Output</Badge>
                  <span className="text-xs text-[#9AA4B2]">
                    {exInput.institution || 'Candidate Assessment'} ({exInput.graduationYear || '—'})
                  </span>
                </div>

                <div className="rounded-2xl bg-[#16C784]/10 border border-[#16C784]/35 p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10.5px] uppercase tracking-wider text-[#9AA4B2] block">Recommended Starting Stage</span>
                    <span className="font-display text-sm font-bold text-[#16C784]">{exResult.startingLevel}</span>
                  </div>
                  <div>
                    <span className="text-[10.5px] uppercase tracking-wider text-[#9AA4B2] block">Estimated Time (No Carryovers)</span>
                    <span className="font-display text-sm font-bold text-white">{exResult.estimatedDuration}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-display text-base font-bold text-white">{exResult.ruleTitle}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-[#9AA4B2]">{exResult.guidance}</p>
                </div>

                <div>
                  <p className="text-xs font-bold text-white">Potential Exemptions ({exResult.potentialExemptions.length})</p>
                  {exResult.potentialExemptions.length === 0 ? (
                    <p className="text-xs text-[#9AA4B2]">No standard automatic exemptions for this route; commence from the recommended starting stage.</p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {exResult.potentialExemptions.map((code) => (
                        <span key={code} className="text-[11px] font-display font-semibold rounded-lg bg-[#16C784]/15 border border-[#16C784]/30 text-[#16C784] px-2.5 py-1">
                          {code}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-bold text-white">Relevant Conditions:</p>
                  <ul className="space-y-1.5 text-xs text-[#9AA4B2]">
                    {exResult.conditions.map((cond) => (
                      <li key={cond} className="flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#16C784] shrink-0 mt-0.5" />
                        <span>{cond}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl bg-[#EA3943]/10 border border-[#EA3943]/30 p-3.5 flex items-start gap-2.5 text-xs text-[#F4F6F9]">
                  <AlertTriangle className="h-4 w-4 text-[#EA3943] shrink-0 mt-0.5" />
                  <p>{exResult.disclaimer}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Registration                                                        */
/* ------------------------------------------------------------------ */

function OtherBodiesRegistration({ body, settings }) {
  const toast = useToast();
  const { openWhatsAppModal } = useUi();
  const process = body.registrationProcess;

  return (
    <section className="py-14 sm:py-18">
      <div className="v-container space-y-10">
        <div className="space-y-2">
          <h2 className="font-display text-2xl font-bold text-white">{body.name} Registration Process</h2>
          <p className="text-sm text-[#9AA4B2]">
            Step-by-step registration for first-time and returning candidates. VALENCE provides WhatsApp support for official registration and fee assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* First-time */}
          <div className="v-card p-6 sm:p-7 space-y-4">
            <Badge variant="green">First-Time Candidates</Badge>
            <h3 className="font-display text-lg font-bold text-white">Registration Steps</h3>
            <ol className="space-y-3">
              {process.firstTime.map((step) => (
                <li key={step.step} className="flex gap-3">
                  <span className="tabular-nums-display inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#16C784]/[0.12] border border-[#16C784]/30 text-xs font-bold text-[#16C784]">
                    {step.step}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{step.title}</p>
                    <p className="text-xs text-[#9AA4B2] mt-0.5">{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Returning */}
          <div className="v-card p-6 sm:p-7 space-y-4">
            <Badge variant="neutral">Returning Candidates</Badge>
            <h3 className="font-display text-lg font-bold text-white">Registration Steps</h3>
            <ol className="space-y-3">
              {process.returning.map((step) => (
                <li key={step.step} className="flex gap-3">
                  <span className="tabular-nums-display inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#16C784]/[0.12] border border-[#16C784]/30 text-xs font-bold text-[#16C784]">
                    {step.step}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{step.title}</p>
                    <p className="text-xs text-[#9AA4B2] mt-0.5">{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Completion timelines */}
        <div>
          <h3 className="font-display text-lg font-bold text-white mb-4">Estimated Completion Timelines</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {body.completionTimelines.map((item) => (
              <div key={item.route} className="v-card p-5 space-y-2">
                <span className="font-display text-2xl font-bold text-[#16C784] tabular-nums-display">{item.estimate}</span>
                <h4 className="font-display text-sm font-bold text-white">{item.route}</h4>
                <p className="text-[11px] font-medium text-[#C2C9D4]">{item.diets}</p>
                <p className="text-[11px] text-[#9AA4B2] leading-relaxed">{item.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* WhatsApp support */}
        <div className="v-glass-card p-6 sm:p-8 border-[#16C784]/35 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#16C784]">
              <MessageCircle className="h-4 w-4" /> {body.name} Registration & Fee Support
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
              Need help with {body.name} registration and fees?
            </h3>
            <p className="text-xs sm:text-sm text-[#9AA4B2]">
              24/7 WhatsApp support for official registration, subscription, exam fees, and exemption processing. All online tuition and payments run in-app via Paystack.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <button
              type="button"
              onClick={() => openWhatsAppModal({ category: `${body.name} Registration & Fee Assistance` })}
              className="v-btn-primary text-xs"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp Support
            </button>
            <Link to="/portal/student?mode=register" className="v-btn-secondary text-xs">
              Apply for Tuition <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Candidate FAQs                                                       */
/* ------------------------------------------------------------------ */

function OtherBodiesFaqs({ body, settings }) {
  const [openFaqNum, setOpenFaqNum] = useState(0);
  const [expandAll, setExpandAll] = useState(false);
  const faqs = body.candidateFaqs;

  return (
    <section className="py-14 sm:py-18">
      <div className="v-container space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <h2 className="font-display text-2xl font-bold text-white">
              {body.name} Programme: {faqs.length} Frequently Asked Questions
            </h2>
            <p className="text-xs text-[#9AA4B2]">
              A clear, step-by-step orientation guide for prospective {body.name} candidates.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setExpandAll((v) => !v)}
            className="v-btn-secondary text-xs"
          >
            {expandAll ? 'Collapse to Accordion' : 'Expand All Answers'}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {faqs.map((faq) => {
            const isOpen = expandAll || openFaqNum === faq.num;
            return (
              <div key={faq.num} className="v-card overflow-hidden">
                <button
                  type="button"
                  onClick={() => {
                    if (expandAll) setExpandAll(false);
                    setOpenFaqNum(openFaqNum === faq.num && !expandAll ? 0 : faq.num);
                  }}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="tabular-nums-display inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#16C784]/[0.12] border border-[#16C784]/30 text-xs font-bold text-[#16C784]">
                      {String(faq.num).padStart(2, '0')}
                    </span>
                    <span className="font-display text-sm sm:text-base font-bold text-white">{faq.q}</span>
                  </div>
                  <ChevronDown className={`h-4 w-4 shrink-0 text-[#9AA4B2] transition-transform ${isOpen ? 'rotate-180 text-[#16C784]' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-3 border-t border-white/[0.06] space-y-3 text-xs sm:text-sm text-[#C2C9D4]">
                    <p className="text-[#9AA4B2] leading-relaxed">{faq.a}</p>
                    {faq.bullets && (
                      <ul className="space-y-1.5">
                        {faq.bullets.map((b) => (
                          <li key={b} className="flex items-start gap-2 text-xs sm:text-sm">
                            <CheckCircle2 className="h-4 w-4 text-[#16C784] shrink-0 mt-0.5" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {faq.links && (
                      <div className="flex flex-wrap gap-2.5 pt-1">
                        {faq.links.map((lnk) => (
                          <a
                            key={lnk.url}
                            href={lnk.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0B0E11] border border-[#16C784]/35 hover:border-[#16C784] px-3.5 py-2 text-xs font-semibold text-[#16C784] transition-colors"
                          >
                            {lnk.label} <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        ))}
                      </div>
                    )}
                    {faq.tagline && (
                      <p className="font-display text-sm sm:text-base font-bold italic text-[#16C784] pt-1">{faq.tagline}</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Closing banner */}
        <div className="v-glass-card p-6 sm:p-8 border-[#16C784]/35 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#16C784]">
              <Sparkles className="h-4 w-4" /> Start Your {body.name} Journey on VALENCE
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
              {faqs[faqs.length - 1]?.tagline || 'A professional qualification, built for your career.'}
            </h3>
            <p className="text-xs sm:text-sm text-[#9AA4B2]">
              Check your exact entry level, create a free learner account, or apply for structured {body.name} online tuition.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link to={`/programmes/other/${body.id}`} className="v-btn-secondary text-xs" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <Scale className="h-4 w-4 text-[#16C784]" /> Check My Starting Level
            </Link>
            <Link to="/portal/student?mode=register" className="v-btn-primary text-xs">
              Join VALENCE Free <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
