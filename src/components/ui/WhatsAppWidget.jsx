import React, { useState, useEffect } from 'react';
import { MessageCircle, X, ExternalLink, ShieldAlert } from 'lucide-react';
import { useAuth, useCart, usePublicData, useUi } from '../../context/PlatformContext';
import { useToast } from '../../context/ToastContext';
import { buildWhatsAppEnquiryUrl } from '../../lib/pricing';

const ENQUIRY_CATEGORIES = [
  'ICAN Official Registration Fee Assistance',
  'ICAN Official Examination Fee Assistance',
  'ICAN Official Annual Subscription & Levy Assistance',
  'ICAN Official Exemption Processing Assistance',
  'General Support Enquiry',
];

const LEVEL_OPTIONS = [
  'ICAN Foundation Level',
  'ICAN Skills Level',
  'ICAN Professional Level',
  'ATSWA ATS 1',
  'ATSWA ATS 2',
  'ATSWA ATS 3',
  'University / Polytechnic Student',
  'Chartered Accountant / Professional',
  'Not Applicable',
];

export default function WhatsAppWidget() {
  const { settings } = usePublicData();
  const { whatsAppModal, openWhatsAppModal, closeWhatsAppModal } = useUi();
  const toast = useToast();

  const [studentName, setStudentName] = useState('');
  const [category, setCategory] = useState(ENQUIRY_CATEGORIES[0]);
  const [level, setLevel] = useState(LEVEL_OPTIONS[3]);
  const [details, setDetails] = useState('');

  useEffect(() => {
    if (whatsAppModal.open) {
      if (whatsAppModal.category) setCategory(whatsAppModal.category);
      if (whatsAppModal.level) setLevel(whatsAppModal.level);
    }
  }, [whatsAppModal]);

  const generatedUrl = buildWhatsAppEnquiryUrl({
    whatsappNumber: settings.whatsappNumber,
    category,
    studentName,
    level: level === 'Not Applicable' ? '' : level,
    details,
  });

  const handleLaunch = (e) => {
    e.preventDefault();
    window.open(generatedUrl, '_blank', 'noopener,noreferrer');
    toast.success(
      'Opening WhatsApp Enquiry',
      `Prefilled message prepared for ${settings.whatsappNumber}.`
    );
    closeWhatsAppModal();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => openWhatsAppModal({ category: 'General Support Enquiry' })}
        aria-label="WhatsApp Support and Enquiries"
        className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40 group flex items-center gap-2.5 rounded-full bg-[#16C784] px-4 py-3 text-[#06130D] font-semibold shadow-glow hover:bg-[#1ED791] active:scale-95 transition-all duration-200"
      >
        <MessageCircle className="h-5 w-5 shrink-0" />
        <span className="hidden sm:inline text-xs font-bold tracking-wide">
          WhatsApp Support
        </span>
      </button>

      {whatsAppModal.open && (
        <div
          className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="wa-modal-title"
        >
          <div className="w-full max-w-lg rounded-t-3xl sm:rounded-2xl bg-[#11161C] border border-white/[0.1] p-6 shadow-2xl animate-fade-up max-h-[92vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-[#16C784]">
                  VALENCE · Official Support Desk
                </span>
                <h3 id="wa-modal-title" className="mt-1 font-display text-xl font-bold text-[#F4F6F9]">
                  WhatsApp Enquiry & Official Fee Assistance
                </h3>
                <p className="mt-1 text-xs text-[#9AA4B2]">
                  Line: <span className="text-[#F4F6F9] font-medium">{settings.whatsappNumber}</span> · Operating hours: {settings.operatingHours}
                </p>
              </div>
              <button
                type="button"
                onClick={closeWhatsAppModal}
                aria-label="Close modal"
                className="rounded-xl p-2 text-[#9AA4B2] hover:bg-white/[0.06] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-3 flex items-start gap-2.5 rounded-xl bg-[#0B0E11] border border-white/[0.08] p-3 text-xs text-[#9AA4B2]">
              <ShieldAlert className="h-4 w-4 shrink-0 text-[#16C784] mt-0.5" />
              <p>
                <strong className="text-[#F4F6F9]">In-App First &amp; Paystack-Only Checkout:</strong> Online tuition, ATSWA guidance, store &amp; delivery enquiries, and VALENCE ADVERTISE (₦10,000/week) all run directly inside VALENCE. WhatsApp is reserved strictly for official ICAN fee/exemption assistance and 24/7 general customer support.
              </p>
            </div>

            <form onSubmit={handleLaunch} className="mt-5 space-y-4">
              <div>
                <label className="v-label" htmlFor="wa-name">Your Full Name</label>
                <input
                  id="wa-name"
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Enter your full name"
                  className="v-input"
                />
              </div>

              <div>
                <label className="v-label" htmlFor="wa-category">Enquiry Category</label>
                <select
                  id="wa-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="v-input"
                >
                  {ENQUIRY_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="v-label" htmlFor="wa-level">Programme / Examination Level</label>
                <select
                  id="wa-level"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="v-input"
                >
                  {LEVEL_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="v-label" htmlFor="wa-details">Additional Note (Optional)</label>
                <textarea
                  id="wa-details"
                  rows={2}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Specify intended diet (e.g. ICAN May 2027), courses or enquiry details..."
                  className="v-input resize-none"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-2">
                <button type="button" onClick={closeWhatsAppModal} className="v-btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="v-btn-primary">
                  <MessageCircle className="h-4 w-4" />
                  Continue to WhatsApp
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
