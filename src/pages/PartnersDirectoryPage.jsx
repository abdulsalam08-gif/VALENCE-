import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  BookOpen,
  Store,
  MapPin,
  Search,
  ShieldCheck,
  MessageSquare,
  Send,
  ArrowRight,
  ShieldAlert,
  Loader2,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { useToast } from '../context/ToastContext';
import Badge from '../components/ui/Badge';
import { fetchAdvertiserDirectory, fetchAdCampaigns, submitAdEnquiry, recordAdClick, recordAdImpression } from '../lib/advertising';

const CATEGORY_META = {
  physical_centre: { label: 'Physical Tuition Centre', icon: Building2 },
  textbook_author: { label: 'Textbook Author', icon: BookOpen },
  textbook_vendor: { label: 'Textbook Vendor / Bookshop', icon: Store },
};

export default function PartnersDirectoryPage() {
  const { user, settings } = usePlatform();
  const toast = useToast();

  const [partners, setPartners] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('ALL');
  const [search, setSearch] = useState('');
  const [detail, setDetail] = useState(null);
  const [enquiry, setEnquiry] = useState(null);
  const [enquiryMsg, setEnquiryMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // campaign_id lookup: advertiser_id -> active campaign
  const campaignByAdvertiser = useMemo(() => {
    const map = {};
    campaigns.forEach((c) => {
      if (!map[c.advertiser_id]) map[c.advertiser_id] = c;
    });
    return map;
  }, [campaigns]);

  const load = async () => {
    try {
      const [dir, activeCampaigns] = await Promise.all([
        fetchAdvertiserDirectory({ limit: 100 }),
        fetchAdCampaigns('active'),
      ]);
      setPartners(Array.isArray(dir) ? dir : []);
      setCampaigns(Array.isArray(activeCampaigns) ? activeCampaigns : []);
    } catch (err) {
      toast.error('Could not load partners', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return partners.filter((p) => {
      if (category !== 'ALL' && p.category !== category) return false;
      if (!q) return true;
      return [
        p.centre_name,
        p.address,
        p.business_description,
        p.areas_of_specialisation?.join(' '),
        p.programmes_offered?.join(' '),
        p.isbn_or_publisher,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [partners, category, search]);

  const openDetail = async (partner) => {
    setDetail(partner);
    const camp = campaignByAdvertiser[partner.id];
    if (camp) {
      try {
        await recordAdImpression(camp.id);
      } catch (err) {
        /* telemetry is best-effort */
      }
    }
  };

  const openEnquiry = async (partner, campaign) => {
    if (campaign) {
      try {
        await recordAdClick(campaign.id);
      } catch (err) {
        /* best-effort */
      }
    }
    setDetail(null);
    setEnquiry({ partner, campaign });
    setEnquiryMsg('');
  };

  const handleEnquiry = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.warning('Sign in required', 'Sign in to send an in-app enquiry to this partner.');
      return;
    }
    if (!enquiry?.campaign) {
      toast.warning('Not available', 'This partner has no active in-app campaign for enquiries right now.');
      return;
    }
    setSubmitting(true);
    try {
      await submitAdEnquiry({
        campaignId: enquiry.campaign.id,
        message: enquiryMsg.trim() || `In-app enquiry about ${enquiry.partner.centre_name} advertising.`,
        contactMode: 'enquiry',
      });
      toast.success('Enquiry sent', `Your message was sent to ${enquiry.partner.centre_name} inside VALENCE.`);
      setEnquiry(null);
    } catch (err) {
      toast.error('Could not send enquiry', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="divide-y divide-white/[0.06]">
      <section className="bg-grid-fintech py-12 sm:py-16">
        <div className="v-container space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="green">VALENCE VERIFIED PARTNERS</Badge>
            <Badge variant="neutral">Physical Centres · Textbook Authors · Book Vendors</Badge>
          </div>
          <div className="max-w-3xl">
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-white leading-tight">
              Verified Partners &amp; Sponsored Advertisers
            </h1>
            <p className="text-sm text-[#9AA4B2] mt-3">
              Every partner below has passed VALENCE verification — physical tuition venues, accounting textbook
              authors and genuine textbook vendors. Enquire or connect directly, safely in-app.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="v-container space-y-6">
          {/* Controls */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {['ALL', 'physical_centre', 'textbook_author', 'textbook_vendor'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`rounded-xl px-3.5 py-2 text-xs font-display font-bold border transition-colors ${
                    category === cat
                      ? 'bg-[#E0A82E] text-[#06130D] border-[#E0A82E]'
                      : 'bg-[#0B0E11] text-[#C2C9D4] border-white/[0.08] hover:border-white/[0.2]'
                  }`}
                >
                  {cat === 'ALL' ? 'All Partners' : CATEGORY_META[cat]?.label || cat}
                </button>
              ))}
            </div>
            <div className="relative sm:w-64">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search partners…"
                className="v-input text-xs pl-9 w-full"
              />
            </div>
          </div>

          <p className="text-xs text-[#667085]">
            {loading ? 'Loading verified partners…' : `${filtered.length} verified partner(s) found`}
          </p>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="v-card p-5 h-44 animate-pulse bg-white/[0.02]" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="v-card p-10 text-center text-sm text-[#9AA4B2]">
              <ShieldAlert className="h-8 w-8 mx-auto text-[#667085] mb-2" />
              No verified partners match your filters yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((p) => {
                const meta = CATEGORY_META[p.category] || CATEGORY_META.physical_centre;
                const CIcon = meta.icon;
                const camp = campaignByAdvertiser[p.id];
                return (
                  <div key={p.id} className="v-card p-5 flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="h-10 w-10 rounded-xl bg-[#E0A82E]/12 border border-[#E0A82E]/30 flex items-center justify-center">
                          <CIcon className="h-5 w-5 text-[#E0A82E]" />
                        </div>
                        <div>
                          <p className="font-display text-sm font-bold text-white leading-tight">
                            {p.centre_name}
                          </p>
                          <p className="text-[10.5px] text-[#9AA4B2]">{meta.label}</p>
                        </div>
                      </div>
                      <Badge variant="verified">Verified</Badge>
                    </div>

                    {p.address && (
                      <p className="flex items-start gap-1.5 text-xs text-[#9AA4B2]">
                        <MapPin className="h-3.5 w-3.5 text-[#E0A82E] shrink-0 mt-0.5" />
                        <span>{p.address}</span>
                      </p>
                    )}
                    {p.business_description && (
                      <p className="text-xs text-[#C2C9D4] line-clamp-2">{p.business_description}</p>
                    )}

                    <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
                      {p.programmes_offered?.slice(0, 3).map((prog) => (
                        <span key={prog} className="text-[10px] rounded-md bg-white/[0.06] text-[#9AA4B2] px-2 py-0.5">
                          {prog}
                        </span>
                      ))}
                      {camp && <Badge variant="sponsored">Sponsored</Badge>}
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => openDetail(p)}
                        className="v-btn-secondary text-xs flex-1"
                      >
                        View Details
                      </button>
                      {camp ? (
                        <button
                          type="button"
                          onClick={() => openEnquiry(p, camp)}
                          className="v-btn-primary text-xs flex-1"
                        >
                          <MessageSquare className="h-3.5 w-3.5" /> Enquire
                        </button>
                      ) : (
                        <Link to="/advertise" className="v-btn-secondary text-xs flex-1">
                          Advertise <ArrowRight className="h-3.5 w-3.5 text-[#E0A82E]" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Detail modal */}
      {detail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setDetail(null)}
        >
          <div
            className="v-card p-6 w-full max-w-lg space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-display text-lg font-bold text-white">{detail.centre_name}</h3>
                <p className="text-xs text-[#9AA4B2]">
                  {(CATEGORY_META[detail.category] || {}).label || detail.category}
                </p>
              </div>
              <Badge variant="verified">Verified</Badge>
            </div>
            {detail.address && (
              <p className="flex items-start gap-1.5 text-xs text-[#C2C9D4]">
                <MapPin className="h-3.5 w-3.5 text-[#E0A82E] shrink-0 mt-0.5" /> {detail.address}
              </p>
            )}
            {detail.business_description && (
              <p className="text-xs text-[#9AA4B2]">{detail.business_description}</p>
            )}
            {detail.website && (
              <a
                href={detail.website}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[#E0A82E] hover:underline break-all"
              >
                {detail.website}
              </a>
            )}
            {detail.isbn_or_publisher && (
              <p className="text-[11px] text-[#667085]">{detail.isbn_or_publisher}</p>
            )}
            {detail.areas_of_specialisation?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {detail.areas_of_specialisation.map((a) => (
                  <span key={a} className="text-[10px] rounded-md bg-white/[0.06] text-[#9AA4B2] px-2 py-0.5">
                    {a}
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={() => setDetail(null)} className="v-btn-secondary text-xs flex-1">
                Close
              </button>
              {campaignByAdvertiser[detail.id] && (
                <button
                  type="button"
                  onClick={() => openEnquiry(detail, campaignByAdvertiser[detail.id])}
                  className="v-btn-primary text-xs flex-1"
                >
                  <Send className="h-3.5 w-3.5" /> Send Enquiry
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Enquiry modal */}
      {enquiry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => !submitting && setEnquiry(null)}
        >
          <form
            className="v-card p-6 w-full max-w-lg space-y-4"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleEnquiry}
          >
            <div>
              <h3 className="font-display text-lg font-bold text-white">
                Enquire with {enquiry.partner.centre_name}
              </h3>
              <p className="text-xs text-[#9AA4B2] mt-0.5">
                Send a message directly inside VALENCE — it lands in the partner's in-app enquiry inbox.
              </p>
            </div>
            <textarea
              rows={4}
              value={enquiryMsg}
              onChange={(e) => setEnquiryMsg(e.target.value)}
              placeholder="Write your enquiry (course, level, availability, pricing…)"
              className="v-input text-xs resize-none"
            />
            <div className="flex gap-2 pt-1">
              <button type="button" disabled={submitting} onClick={() => setEnquiry(null)} className="v-btn-secondary text-xs flex-1">
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="v-btn-primary text-xs flex-1">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Send Enquiry
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
