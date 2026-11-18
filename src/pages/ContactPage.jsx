import React, { useState } from 'react';
import {
  MessageCircle,
  Mail,
  Clock,
  Send,
  ShieldCheck,
  FileText,
  Megaphone,
  ShoppingBag,
  GraduationCap,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { useToast } from '../context/ToastContext';
import Badge from '../components/ui/Badge';

const ENQUIRY_CHANNELS = [
  { icon: HelpCircle, title: 'WhatsApp General Support', category: 'General Support Enquiry', desc: 'Fast candidate guidance, portal enquiries and appointment scheduling.' },
  { icon: GraduationCap, title: 'Physical Tuition Enquiries', category: 'Physical Tuition Application Enquiry', desc: 'Apply or enquire about physical face-to-face lecture availability and schedules.' },
  { icon: ShieldCheck, title: 'ICAN Official Fee Assistance', category: 'ICAN Official Registration Fee Assistance', desc: 'Dedicated assistance for ICAN registration, examination fees and annual subscriptions.' },
  { icon: ShoppingBag, title: 'Study Material Enquiries', category: 'Study Material & Delivery Enquiry', desc: 'Questions about study packs, past questions, bulk institutional orders or delivery zones.' },
  { icon: FileText, title: 'Document Submission Instructions', category: 'ATSWA Document & Registration Guidance', desc: 'Passport photo, O’Level result, birth certificate and transcript guidance.' },
  { icon: Megaphone, title: 'Advertising Enquiries', category: 'VALENCE ADVERTISE — Tuition Centre Enquiry', desc: 'Verification requirements, ad packages and placements for tuition centres.' },
];

export default function ContactPage() {
  const { settings, openWhatsAppModal } = usePlatform();
  const toast = useToast();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    topic: 'Programme & Enrolment Enquiry',
    message: '',
  });
  const [submittedRef, setSubmittedRef] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const ref = `VAL-ENQ-${Date.now().toString().slice(-6)}`;
    setSubmittedRef(ref);
    toast.success(
      'Enquiry Logged Successfully',
      `Reference ${ref}. Our AAG PROFESSIONAL SERVICES team will respond via email.`
    );
    setForm({
      fullName: '',
      email: '',
      phone: '',
      topic: 'Programme & Enrolment Enquiry',
      message: '',
    });
  };

  return (
    <div className="divide-y divide-white/[0.06]">
      <section className="bg-grid-fintech py-14 sm:py-18">
        <div className="v-container space-y-4 max-w-4xl">
          <Badge variant="green">CONTACT · {settings.operatorName}</Badge>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-white">
            Speak With AAG PROFESSIONAL SERVICES
          </h1>
          <p className="text-sm sm:text-base text-[#9AA4B2]">
            Reach our support desk for academic guidance, physical tuition applications, ICAN official fee assistance, document verification instructions, material enquiries and advertising partnerships.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
            <div className="v-card p-4 flex items-center gap-3">
              <MessageCircle className="h-5 w-5 text-[#16C784] shrink-0" />
              <div>
                <p className="text-[11px] text-[#667085]">WhatsApp Support</p>
                <p className="text-xs sm:text-sm font-bold text-white">{settings.whatsappNumber}</p>
              </div>
            </div>
            <div className="v-card p-4 flex items-center gap-3">
              <Mail className="h-5 w-5 text-[#16C784] shrink-0" />
              <div className="min-w-0">
                <p className="text-[11px] text-[#667085]">Official Email</p>
                <a
                  href={`mailto:${settings.email}`}
                  className="text-xs sm:text-sm font-bold text-white hover:text-[#16C784] truncate block"
                >
                  {settings.email}
                </a>
              </div>
            </div>
            <div className="v-card p-4 flex items-center gap-3">
              <Clock className="h-5 w-5 text-[#16C784] shrink-0" />
              <div>
                <p className="text-[11px] text-[#667085]">Operating Hours</p>
                <p className="text-xs sm:text-sm font-bold text-white">{settings.operatingHours}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-18">
        <div className="v-container grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Form */}
          <div className="lg:col-span-6 v-card p-6 sm:p-8 space-y-5">
            <div>
              <h2 className="font-display text-2xl font-bold text-white">Send a Direct Message</h2>
              <p className="text-xs text-[#9AA4B2] mt-1">
                Complete the form below or choose a prefilled WhatsApp enquiry category on the right.
              </p>
            </div>

            {submittedRef && (
              <div className="rounded-xl bg-[#16C784]/12 border border-[#16C784]/35 p-4 flex items-start gap-2.5 text-xs text-[#F4F6F9]">
                <CheckCircle2 className="h-4 w-4 text-[#16C784] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#16C784]">Message Received — Ref: {submittedRef}</p>
                  <p className="text-[#C2C9D4] mt-0.5">
                    For urgent ICAN official fee or physical tuition enquiries, you can also open a prefilled WhatsApp chat at {settings.whatsappNumber}.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <div>
                  <label className="v-label" htmlFor="ct-phone">Phone / WhatsApp (Optional)</label>
                  <input
                    id="ct-phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+234..."
                    className="v-input"
                  />
                </div>
              </div>
              <div>
                <label className="v-label" htmlFor="ct-topic">Enquiry Subject</label>
                <select
                  id="ct-topic"
                  value={form.topic}
                  onChange={(e) => setForm({ ...form, topic: e.target.value })}
                  className="v-input"
                >
                  <option>Programme & Enrolment Enquiry</option>
                  <option>Physical Tuition Application</option>
                  <option>ICAN Official Fee Assistance</option>
                  <option>ATSWA Document Submission</option>
                  <option>Store & Study Materials</option>
                  <option>National Accounting Challenge / Institution Verification</option>
                  <option>Tutor Application</option>
                  <option>VALENCE ADVERTISE (Tuition Centre)</option>
                </select>
              </div>
              <div>
                <label className="v-label" htmlFor="ct-msg">Message</label>
                <textarea
                  id="ct-msg"
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="How can AAG PROFESSIONAL SERVICES assist you?"
                  className="v-input resize-none"
                />
              </div>
              <button type="submit" className="v-btn-primary w-full py-3">
                <Send className="h-4 w-4" /> Submit Enquiry
              </button>
            </form>
          </div>

          {/* 6 Dedicated WhatsApp & Document Submission Channels */}
          <div className="lg:col-span-6 space-y-4">
            <h2 className="font-display text-xl font-bold text-white">
              Dedicated Enquiry & Document Channels
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {ENQUIRY_CHANNELS.map((ch) => {
                const Icon = ch.icon;
                return (
                  <button
                    key={ch.title}
                    type="button"
                    onClick={() => openWhatsAppModal({ category: ch.category })}
                    className="v-card-hover p-4 text-left space-y-2"
                  >
                    <Icon className="h-5 w-5 text-[#16C784]" />
                    <h3 className="font-display text-sm font-bold text-white">{ch.title}</h3>
                    <p className="text-xs text-[#9AA4B2] leading-relaxed">{ch.desc}</p>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#16C784]">
                      Open prefilled WhatsApp →
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="v-card p-5 space-y-2 text-xs text-[#9AA4B2]">
              <p className="font-semibold text-white">Document Submission & Checkout Policy</p>
              <p>
                ATS 1 registration requires a clear passport photograph, O’Level result and birth certificate. Tutor and professional verification documents are uploaded exclusively into private encrypted Supabase Storage inside your portal. All online payments across VALENCE run solely through verified <strong className="text-[#16C784]">Paystack</strong> checkout — WhatsApp is never used to process online website payments.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
