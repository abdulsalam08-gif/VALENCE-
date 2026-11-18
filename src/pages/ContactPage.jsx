import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageCircle,
  Mail,
  Clock,
  Send,
  ShieldCheck,
  ChevronDown,
  ExternalLink,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { useToast } from '../context/ToastContext';
import Badge from '../components/ui/Badge';

export default function ContactPage() {
  const { settings, faqs, candidateFaqs, openWhatsAppModal, submitInAppTicket } = usePlatform();
  const toast = useToast();
  const [faqTab, setFaqTab] = useState('candidate');
  const [openFaq, setOpenFaq] = useState(0);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    category: 'Student Tuition & Cost Implication Enquiry',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      const ticket = submitInAppTicket('support', form);
      setSubmitting(false);
      toast.success(
        `In-App Ticket Logged (${ticket.id})`,
        'Stored directly in VALENCE for response by the assigned Admin team.'
      );
      setForm({ ...form, message: '' });
    }, 250);
  };

  return (
    <div className="divide-y divide-white/[0.06]">
      <section className="bg-grid-fintech py-14 sm:py-18">
        <div className="v-container space-y-4">
          <Badge variant="green">CONTACT & SUPPORT DESK</Badge>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-white max-w-3xl">
            Reach the VALENCE Support Desk
          </h1>
          <p className="text-sm sm:text-base text-[#9AA4B2] max-w-2xl">
            Academic guidance, physical tuition enquiries, official ICAN fee support, timetable notices, competition rewards, bookstore assistance and tuition-centre advertising enquiries.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="v-container grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="v-card p-6 space-y-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#16C784]/15 text-[#16C784]">
                <MessageCircle className="h-5 w-5" />
              </div>
              <h2 className="font-display text-lg font-bold text-white">WhatsApp Support & Enquiries</h2>
              <p className="font-display text-xl font-bold text-[#16C784] tabular-nums-display">
                {settings.whatsappNumber}
              </p>
              <p className="text-xs text-[#9AA4B2]">
                Dedicated to official ICAN registration/exam/subscription fee assistance, physical tuition applications and general support. (Online checkouts run via Paystack; ATSWA guidance, store/delivery enquiries and advertising run directly in-app.)
              </p>
              <button
                type="button"
                onClick={() => openWhatsAppModal({ category: 'General Support Enquiry' })}
                className="v-btn-primary w-full text-xs"
              >
                <MessageCircle className="h-4 w-4" /> Open Prefilled WhatsApp Chat
              </button>
            </div>

            {/* Dedicated In-App Self-Serve Workflows */}
            <div className="v-card p-6 space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#16C784]">
                Handled 100% Inside the App
              </span>
              <div className="space-y-2 text-xs">
                <Link
                  to="/programmes/atswa#document-guidance"
                  className="flex items-center justify-between rounded-xl bg-[#0B0E11] border border-white/[0.07] hover:border-[#16C784]/45 px-3.5 py-2.5 text-white transition-colors"
                >
                  <span>ATSWA Document &amp; Registration Guidance</span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#16C784]" />
                </Link>
                <Link
                  to="/store?enquiry=open"
                  className="flex items-center justify-between rounded-xl bg-[#0B0E11] border border-white/[0.07] hover:border-[#16C784]/45 px-3.5 py-2.5 text-white transition-colors"
                >
                  <span>Study Materials &amp; Delivery Enquiry</span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#16C784]" />
                </Link>
                <Link
                  to="/advertise"
                  className="flex items-center justify-between rounded-xl bg-[#0B0E11] border border-white/[0.07] hover:border-[#16C784]/45 px-3.5 py-2.5 text-white transition-colors"
                >
                  <span>Advertise: Centres, Textbook Authors &amp; Vendors (₦10k/Wk)</span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#16C784]" />
                </Link>
              </div>
            </div>

            <div className="v-card p-6 space-y-2.5">
              <div className="flex items-center gap-2 text-[#16C784]">
                <Mail className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Official Email</span>
              </div>
              <a
                href={`mailto:${settings.email}`}
                className="block font-display text-base font-bold text-white hover:text-[#16C784] transition-colors"
              >
                {settings.email}
              </a>
              <p className="text-xs text-[#9AA4B2]">
                Verification desk, institutional partnerships, competition administration and order receipts.
              </p>
            </div>

            <div className="v-card p-6 space-y-2">
              <div className="flex items-center gap-2 text-[#16C784]">
                <Clock className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Operating Hours</span>
              </div>
              <p className="font-display text-base font-bold text-white">{settings.operatingHours}</p>
              <p className="text-xs text-[#9AA4B2]">
                Platform: <strong className="text-white">{settings.brandName}</strong> · <em>{settings.tagline}</em>
              </p>
            </div>
          </div>

          {/* Enquiry Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 v-card p-6 sm:p-8 space-y-4">
            <h2 className="font-display text-xl font-bold text-white">Send a Support Ticket</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="v-label" htmlFor="ct-name">Full Name</label>
                <input
                  id="ct-name"
                  type="text"
                  required
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="Enter your full name"
                  className="v-input"
                />
              </div>
              <div>
                <label className="v-label" htmlFor="ct-email">Email Address</label>
                <input
                  id="ct-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="v-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="v-label" htmlFor="ct-phone">Phone / WhatsApp Number</label>
                <input
                  id="ct-phone"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+234 800 000 0000"
                  className="v-input"
                />
              </div>
              <div>
                <label className="v-label" htmlFor="ct-cat">Enquiry Category</label>
                <select
                  id="ct-cat"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="v-input"
                >
                  <option>Student Tuition &amp; Cost Implication Enquiry</option>
                  <option>ATSWA Document &amp; Registration Guidance (In-App)</option>
                  <option>Study Materials &amp; Delivery Enquiry (In-App)</option>
                  <option>VALENCE ADVERTISE: ₦10,000/Week Campaign (In-App)</option>
                  <option>Official ICAN Fee Assistance</option>
                  <option>Physical Tuition Application</option>
                  <option>Exam Timetable &amp; Result Release Notice</option>
                  <option>National Competition &amp; ₦50,000 Merit Reward</option>
                  <option>Tutor / Professional Verification</option>
                </select>
              </div>
            </div>

            <div>
              <label className="v-label" htmlFor="ct-msg">Message</label>
              <textarea
                id="ct-msg"
                rows={4}
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell us how we can support your learning, timetable enquiry, competition entry or order..."
                className="v-input resize-none"
              />
            </div>

            <button type="submit" disabled={submitting} className="v-btn-primary w-full py-3">
              <Send className="h-4 w-4" />
              {submitting ? 'Submitting Enquiry...' : 'Submit Support Enquiry'}
            </button>

            <p className="text-[11px] text-[#667085] flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-[#16C784]" />
              Stored in VALENCE support logs and routed to the appropriate verification or academic team.
            </p>
          </form>
        </div>
      </section>

      {/* Dual-Tab FAQ Section: 10 Prospective ICAN Candidate FAQs + Platform FAQs */}
      <section className="py-16 bg-[#0D1116]">
        <div className="v-container max-w-4xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="font-display text-2xl font-bold text-white">
              Frequently Asked Questions
            </h2>
            <div className="inline-flex rounded-xl bg-[#11161C] border border-white/[0.08] p-1 self-start">
              <button
                type="button"
                onClick={() => {
                  setFaqTab('candidate');
                  setOpenFaq(0);
                }}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  faqTab === 'candidate'
                    ? 'bg-[#16C784] text-[#06130D]'
                    : 'text-[#9AA4B2] hover:text-white'
                }`}
              >
                ICAN Candidate Guide (10)
              </button>
              <button
                type="button"
                onClick={() => {
                  setFaqTab('platform');
                  setOpenFaq(0);
                }}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  faqTab === 'platform'
                    ? 'bg-[#16C784] text-[#06130D]'
                    : 'text-[#9AA4B2] hover:text-white'
                }`}
              >
                VALENCE Platform ({faqs.length})
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {(faqTab === 'candidate' ? candidateFaqs : faqs).map((f, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={f.q} className="v-card overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left"
                  >
                    <span className="font-display text-sm font-semibold text-white">
                      {f.num ? `${f.num}. ${f.q}` : f.q}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-[#9AA4B2] transition-transform ${
                        isOpen ? 'rotate-180 text-[#16C784]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-[#9AA4B2] border-t border-white/[0.05] pt-3 space-y-2.5">
                      <p>{f.a}</p>
                      {f.bullets && (
                        <ul className="space-y-1.5 text-[#D5DBE3]">
                          {f.bullets.map((b) => (
                            <li key={b} className="flex items-start gap-2 text-xs">
                              <CheckCircle2 className="h-3.5 w-3.5 text-[#16C784] shrink-0 mt-0.5" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {f.links && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {f.links.map((lnk) => (
                            <a
                              key={lnk.url}
                              href={lnk.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-lg bg-[#0B0E11] border border-[#16C784]/35 px-3 py-1.5 text-xs font-semibold text-[#16C784] hover:border-[#16C784]"
                            >
                              {lnk.label} <ExternalLink className="h-3 w-3" />
                            </a>
                          ))}
                        </div>
                      )}
                      {f.tagline && (
                        <p className="font-display text-sm font-bold italic text-[#16C784]">
                          {f.tagline}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
