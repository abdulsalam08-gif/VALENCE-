import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Megaphone,
  ShieldCheck,
  ShieldAlert,
  BarChart3,
  MessageSquare,
  CreditCard,
  Loader2,
  CheckCircle2,
  Calendar,
  Send,
  Building2,
  BookOpen,
  Store,
  MapPin,
  Plus,
  RotateCcw,
} from 'lucide-react';
import { useAuth, useCart, usePublicData, useUi } from '../context/PlatformContext';
import { useToast } from '../context/ToastContext';
import Badge from '../components/ui/Badge';
import { formatNaira } from '../lib/pricing';
import {
  fetchMyAdvertiser,
  saveAdvertiser,
  submitAdvertiserVerification,
  fetchMyAdCampaigns,
  fetchAdAnalytics,
  fetchMyAdEnquiries,
  fetchAdPackages,
  fetchAdPlacements,
  createAdPayment,
  confirmAdPayment,
  saveAdCampaign,
} from '../lib/advertising';
import { openPaystackCheckout, generatePaymentReference, isPaystackConfigured } from '../lib/paystack';

const CATEGORY_META = {
  physical_centre: { label: 'Physical Tuition Centre', icon: Building2 },
  textbook_author: { label: 'Textbook Author', icon: BookOpen },
  textbook_vendor: { label: 'Textbook Vendor / Bookshop', icon: Store },
};

const VERIFICATION_TYPE = {
  physical_centre: 'Physical Venue Verification',
  textbook_author: 'ISBN / Publisher Verification',
  textbook_vendor: 'Anti-Piracy Stock Verification',
};

const TABS = [
  { key: 'profile', label: 'Profile & Verification', icon: ShieldCheck },
  { key: 'campaigns', label: 'Campaigns', icon: Megaphone },
  { key: 'analytics', label: 'Analytics', icon: BarChart3 },
  { key: 'enquiries', label: 'Enquiries', icon: MessageSquare },
];

export default function AdvertiserHubPage() {
  const { user } = useAuth();
  const { settings } = usePublicData();
  const toast = useToast();

  const [tab, setTab] = useState('profile');
  const [advertiser, setAdvertiser] = useState(null);
  const [verification, setVerification] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [analytics, setAnalytics] = useState({ campaigns: [], totals: { impressions: 0, clicks: 0, ctr: 0, enquiries: 0 } });
  const [enquiries, setEnquiries] = useState([]);
  const [packages, setPackages] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingCampaign, setSavingCampaign] = useState(false);
  const [payingId, setPayingId] = useState(null);

  const [form, setForm] = useState({
    centre_name: '',
    category: 'physical_centre',
    address: '',
    contact_details: '',
    website: '',
    business_description: '',
    credentials: '',
    isbn_or_publisher: '',
  });
  const [verifDetails, setVerifDetails] = useState('');

  const [newCampaign, setNewCampaign] = useState({ name: '', weeks: 1, placements: ['featured-dir'], softcopyUrl: '' });

  const activePackage = useMemo(
    () => packages.find((p) => p.price_ngn === (settings.adWeeklyRate || 10000)) || packages[0] || null,
    [packages, settings]
  );
  const cost = useMemo(
    () => newCampaign.weeks * newCampaign.placements.length * (activePackage?.price_ngn || settings.adWeeklyRate || 10000),
    [newCampaign, activePackage, settings]
  );

  const refresh = async () => {
    try {
      const [adv, camps, ana, enqs, pkgs, pls] = await Promise.all([
        fetchMyAdvertiser(),
        fetchMyAdCampaigns(),
        fetchAdAnalytics(),
        fetchMyAdEnquiries(),
        fetchAdPackages(),
        fetchAdPlacements(),
      ]);
      setAdvertiser(adv?.advertiser || null);
      setVerification(adv?.verification || null);
      setCampaigns(Array.isArray(camps) ? camps : []);
      setAnalytics(ana || { campaigns: [], totals: { impressions: 0, clicks: 0, ctr: 0, enquiries: 0 } });
      setEnquiries(Array.isArray(enqs) ? enqs : []);
      setPackages(Array.isArray(pkgs) ? pkgs : []);
      setPlacements(Array.isArray(pls) ? pls : []);
      if (adv?.advertiser) {
        setForm((f) => ({
          ...f,
          centre_name: adv.advertiser.centre_name || f.centre_name,
          category: adv.advertiser.category || f.category,
          address: adv.advertiser.address || f.address,
          contact_details: adv.advertiser.contact_details || f.contact_details,
          website: adv.advertiser.website || f.website,
          business_description: adv.advertiser.business_description || f.business_description,
          credentials: adv.advertiser.credentials || f.credentials,
          isbn_or_publisher: adv.advertiser.isbn_or_publisher || f.isbn_or_publisher,
        }));
      }
    } catch (err) {
      toast.error('Could not load advertiser hub', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const togglePlacement = (id) => {
    setNewCampaign((c) => {
      const has = c.placements.includes(id);
      if (has) return { ...c, placements: c.placements.filter((p) => p !== id) };
      if (c.placements.length >= 9) {
        toast.warning('Maximum 9 slots', 'You can select up to 9 sponsored placement slots.');
        return c;
      }
      return { ...c, placements: [...c.placements, id] };
    });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await saveAdvertiser({ ...form, id: advertiser?.id });
      toast.success('Profile saved', 'Your advertiser details were updated.');
      refresh();
    } catch (err) {
      toast.error('Could not save profile', err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSubmitVerification = async () => {
    try {
      await submitAdvertiserVerification({
        verificationType: VERIFICATION_TYPE[form.category] || 'Advertiser Verification',
        details: verifDetails.trim() || form.address || form.isbn_or_publisher,
      });
      setVerification({ status: 'pending' });
      toast.success('Verification submitted', 'Admins will review your evidence. Your ads go live once approved.');
      refresh();
    } catch (err) {
      toast.error('Could not submit verification', err.message);
    }
  };

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    if (!advertiser || advertiser.verification_status !== 'verified') {
      toast.warning('Verification required', 'Verify your advertiser profile before booking a campaign.');
      return;
    }
    if (!newCampaign.name.trim()) {
      toast.warning('Campaign name required', 'Give your campaign a headline.');
      return;
    }
    setSavingCampaign(true);
    try {
      const res = await saveAdCampaign({
        advertiserId: advertiser.id,
        packageId: activePackage?.id,
        campaignName: newCampaign.name.trim(),
        softcopyUrl: newCampaign.softcopyUrl || null,
        placements: newCampaign.placements,
        weeks: newCampaign.weeks,
      });
      toast.success('Campaign created', `Total ${formatNaira(res.total_amount_ngn)} — complete payment to activate.`);
      setNewCampaign({ name: '', weeks: 1, placements: ['featured-dir'] });
      refresh();
      setTab('campaigns');
    } catch (err) {
      toast.error('Could not create campaign', err.message);
    } finally {
      setSavingCampaign(false);
    }
  };

  const handlePayCampaign = async (campaign) => {
    if (!isPaystackConfigured()) {
      toast.warning('Paystack not configured', 'Payment checkout is unavailable right now.');
      return;
    }
    setPayingId(campaign.id);
    try {
      const payment = await createAdPayment(campaign.id);
      const reference = payment.reference || generatePaymentReference();
      const verified = await new Promise((resolve, reject) => {
        openPaystackCheckout({
          email: user?.email || '',
          name: advertiser?.centre_name || '',
          amountNgn: payment.amount_ngn,
          reference,
          onSuccess: async () => {
            try {
              resolve(
                await confirmAdPayment({ paymentId: payment.payment_id, reference, amountNgn: payment.amount_ngn })
              );
            } catch (err) {
              reject(err);
            }
          },
          onClose: () => resolve(null),
        });
      });
      if (verified) {
        toast.success('Payment verified', `${formatNaira(payment.amount_ngn)} paid — your campaign is now active.`);
        refresh();
      }
    } catch (err) {
      toast.error('Payment failed', err.message);
    } finally {
      setPayingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="v-card p-6 text-center text-[#9AA4B2] text-sm">Loading your Advertiser Hub…</div>
      </div>
    );
  }

  const isVerified = advertiser?.verification_status === 'verified';
  const catMeta = CATEGORY_META[form.category] || CATEGORY_META.physical_centre;
  const CCIcon = catMeta.icon;

  return (
    <div className="divide-y divide-white/[0.06]">
      {/* Header */}
      <section className="bg-grid-fintech py-10 sm:py-14">
        <div className="v-container flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-[#16C784]/12 border border-[#16C784]/30 flex items-center justify-center">
              <Megaphone className="h-6 w-6 text-[#16C784]" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-white">VALENCE Advertiser Hub</h1>
              <p className="text-xs text-[#9AA4B2]">
                {advertiser?.centre_name || 'No advertiser profile yet'} · {catMeta.label} · ₦{settings.adWeeklyRate || 10000}/week
              </p>
            </div>
          </div>
          <Badge variant={isVerified ? 'verified' : advertiser ? 'neutral' : 'red'}>
            {isVerified ? 'Verified' : advertiser ? 'Pending verification' : 'Not set up'}
          </Badge>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="v-container grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Tabs */}
          <div className="lg:col-span-3 lg:sticky lg:top-28">
            <nav className="v-card p-2 flex flex-col gap-1">
              {TABS.map((t) => {
                const TIcon = t.icon;
                const active = tab === t.key;
                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setTab(t.key)}
                    className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-display font-bold transition-colors ${
                      active
                        ? 'bg-[#16C784]/[0.12] text-[#16C784] border border-[#16C784]/30'
                        : 'text-[#C2C9D4] border border-transparent hover:bg-white/[0.04]'
                    }`}
                  >
                    <TIcon className="h-4 w-4" /> {t.label}
                  </button>
                );
              })}
              <Link to="/advertise" className="v-btn-secondary text-xs mt-2">
                <Plus className="h-3.5 w-3.5" /> Book New Ad
              </Link>
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-9 space-y-6">
            {tab === 'profile' && (
              <>
                {/* Verification status card */}
                <div className={`v-card p-6 space-y-3 ${isVerified ? 'border-[#16C784]/40' : 'border-[#9AA4B2]/40'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isVerified ? (
                        <ShieldCheck className="h-5 w-5 text-[#16C784]" />
                      ) : (
                        <ShieldAlert className="h-5 w-5 text-[#9AA4B2]" />
                      )}
                      <h2 className="font-display text-lg font-bold text-white">Verification Status</h2>
                    </div>
                    <Badge variant={isVerified ? 'verified' : 'neutral'}>
                      {isVerified ? 'Verified' : verification?.status || 'Pending'}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#9AA4B2]">
                    {isVerified
                      ? 'Your profile is verified. You can book and pay for advertising campaigns.'
                      : 'Submit your verification evidence below. VALENCE admins verify physical venues, ISBNs and anti-piracy evidence before ads go live.'}
                  </p>
                  {verification?.notes && (
                    <p className="text-[11px] text-[#C2C9D4]">Note: {verification.notes}</p>
                  )}
                  {!isVerified && (
                    <div className="space-y-2">
                      <textarea
                        rows={2}
                        value={verifDetails}
                        onChange={(e) => setVerifDetails(e.target.value)}
                        placeholder={`${VERIFICATION_TYPE[form.category]} — add venue/ISBN/anti-piracy evidence details`}
                        className="v-input text-xs resize-none"
                      />
                      <button type="button" onClick={handleSubmitVerification} className="v-btn-primary text-xs">
                        <Send className="h-4 w-4" /> Submit Verification
                      </button>
                    </div>
                  )}
                </div>

                {/* Profile form */}
                <form onSubmit={handleSaveProfile} className="v-card p-6 sm:p-7 space-y-4">
                  <h2 className="font-display text-lg font-bold text-white">Advertiser Profile</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="v-label">Category</label>
                      <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="v-input text-xs"
                      >
                        <option value="physical_centre">Physical Tuition Centre</option>
                        <option value="textbook_author">Textbook Author</option>
                        <option value="textbook_vendor">Textbook Vendor / Bookshop</option>
                      </select>
                    </div>
                    <div>
                      <label className="v-label">{form.category === 'physical_centre' ? 'Centre Name' : form.category === 'textbook_author' ? 'Author Name' : 'Bookshop Name'}</label>
                      <input
                        type="text"
                        required
                        value={form.centre_name}
                        onChange={(e) => setForm({ ...form, centre_name: e.target.value })}
                        className="v-input text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="v-label flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-[#16C784]" /> Address / Coverage</label>
                    <input
                      type="text"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      placeholder="Venue address, or bookshop address & delivery coverage"
                      className="v-input text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="v-label">Contact Details</label>
                      <input
                        type="text"
                        value={form.contact_details}
                        onChange={(e) => setForm({ ...form, contact_details: e.target.value })}
                        placeholder="email · phone"
                        className="v-input text-xs"
                      />
                    </div>
                    <div>
                      <label className="v-label">Website</label>
                      <input
                        type="text"
                        value={form.website}
                        onChange={(e) => setForm({ ...form, website: e.target.value })}
                        placeholder="https://…"
                        className="v-input text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="v-label">Business Description</label>
                    <textarea
                      rows={2}
                      value={form.business_description}
                      onChange={(e) => setForm({ ...form, business_description: e.target.value })}
                      className="v-input text-xs resize-none"
                    />
                  </div>
                  {(form.category === 'textbook_author' || form.category === 'textbook_vendor') && (
                    <div>
                      <label className="v-label">{form.category === 'textbook_author' ? 'ISBN / Publisher' : 'Stocked Textbooks / Publishers'}</label>
                      <input
                        type="text"
                        value={form.isbn_or_publisher}
                        onChange={(e) => setForm({ ...form, isbn_or_publisher: e.target.value })}
                        className="v-input text-xs"
                      />
                    </div>
                  )}
                  <button type="submit" disabled={savingProfile} className="v-btn-primary text-xs">
                    {savingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />} Save Profile
                  </button>
                </form>
              </>
            )}

            {tab === 'campaigns' && (
              <div className="space-y-6">
                {/* New campaign */}
                <form onSubmit={handleCreateCampaign} className="v-card p-6 space-y-4">
                  <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
                    <Plus className="h-4 w-4 text-[#16C784]" /> New Campaign
                  </h2>
                  <div>
                    <label className="v-label">Campaign Headline</label>
                    <input
                      type="text"
                      required
                      value={newCampaign.name}
                      onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                      placeholder="e.g. May 2027 ICAN Skills Physical Weekend Classes, Yaba"
                      className="v-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="v-label">Soft-Copy Download Link (optional)</label>
                    <input
                      type="url"
                      value={newCampaign.softcopyUrl}
                      onChange={(e) => setNewCampaign({ ...newCampaign, softcopyUrl: e.target.value })}
                      placeholder="https://… direct link to your soft-copy materials"
                      className="v-input text-xs"
                    />
                    <p className="text-[10px] text-[#9AA4B2] mt-1">
                      For ACCA, CIBN, CITN &amp; CIPM authors: paste the direct link to your soft-copy materials. Displayed on your ad card for students to download.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="v-label mb-0 whitespace-nowrap">Duration (weeks)</label>
                    <input
                      type="number"
                      min="1"
                      max="52"
                      value={newCampaign.weeks}
                      onChange={(e) => setNewCampaign({ ...newCampaign, weeks: Math.max(1, Math.min(52, Number(e.target.value) || 1)) })}
                      className="v-input text-xs w-24"
                    />
                  </div>
                  <div>
                    <span className="v-label">Placement Slots ({newCampaign.placements.length}/9)</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1.5 text-xs">
                      {placements.map((pl) => {
                        const active = newCampaign.placements.includes(pl.id);
                        return (
                          <button
                            key={pl.id}
                            type="button"
                            onClick={() => togglePlacement(pl.id)}
                            className={`rounded-xl border px-3 py-2 text-left ${
                              active ? 'bg-[#16C784]/[0.12] border-[#16C784]/50 text-white' : 'bg-[#0B0E11] border-white/[0.07] text-[#C2C9D4]'
                            }`}
                          >
                            {pl.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-[#0B0E11] border border-[#16C784]/30 p-3">
                    <span className="text-xs text-[#9AA4B2]">
                      {newCampaign.weeks} week(s) × {newCampaign.placements.length} slot(s) × {formatNaira(activePackage?.price_ngn || settings.adWeeklyRate)}
                    </span>
                    <span className="font-display text-lg font-bold text-[#16C784]">{formatNaira(cost)}</span>
                  </div>
                  <button type="submit" disabled={savingCampaign} className="v-btn-primary text-xs">
                    {savingCampaign ? <Loader2 className="h-4 w-4 animate-spin" /> : <Megaphone className="h-4 w-4" />} Create Campaign
                  </button>
                </form>

                {/* Campaigns list */}
                <div className="space-y-3">
                  <h2 className="font-display text-lg font-bold text-white">My Campaigns</h2>
                  {campaigns.length === 0 ? (
                    <div className="v-card p-8 text-center text-sm text-[#9AA4B2]">
                      No campaigns yet. Create one above to start advertising.
                    </div>
                  ) : (
                    campaigns.map((c) => (
                      <div key={c.id} className="v-card p-5 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-display text-sm font-bold text-white">{c.campaign_name}</p>
                            <p className="text-[11px] text-[#9AA4B2]">
                              {c.weeks} week(s) · {c.placement_count} slot(s) · {formatNaira(c.total_amount_ngn)}
                            </p>
                          </div>
                          <Badge
                            variant={
                              c.status === 'active'
                                ? 'green'
                                : c.status === 'pending_payment'
                                ? 'neutral'
                                : 'red'
                            }
                          >
                            {c.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="rounded-lg bg-white/[0.03] p-2">
                            <p className="text-[10px] text-[#667085]">Impressions</p>
                            <p className="font-display text-sm font-bold text-white tabular-nums">{c.impressions || 0}</p>
                          </div>
                          <div className="rounded-lg bg-white/[0.03] p-2">
                            <p className="text-[10px] text-[#667085]">Clicks</p>
                            <p className="font-display text-sm font-bold text-white tabular-nums">{c.clicks || 0}</p>
                          </div>
                          <div className="rounded-lg bg-white/[0.03] p-2">
                            <p className="text-[10px] text-[#667085]">CTR</p>
                            <p className="font-display text-sm font-bold text-[#16C784] tabular-nums">{c.ctr || 0}%</p>
                          </div>
                        </div>
                        {c.status === 'pending_payment' && (
                          <button
                            type="button"
                            onClick={() => handlePayCampaign(c)}
                            disabled={payingId === c.id}
                            className="v-btn-primary text-xs w-full"
                          >
                            {payingId === c.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <CreditCard className="h-4 w-4" />
                            )}
                            Pay {formatNaira(c.total_amount_ngn)} via Paystack
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {tab === 'analytics' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Impressions', value: analytics.totals.impressions, color: 'text-white' },
                    { label: 'Total Clicks', value: analytics.totals.clicks, color: 'text-white' },
                    { label: 'Click-through Rate', value: `${analytics.totals.ctr || 0}%`, color: 'text-[#16C784]' },
                    { label: 'Enquiries', value: analytics.totals.enquiries, color: 'text-white' },
                  ].map((s) => (
                    <div key={s.label} className="v-card p-5">
                      <p className="text-[11px] text-[#667085]">{s.label}</p>
                      <p className={`font-display text-2xl font-bold tabular-nums ${s.color}`}>{s.value}</p>
                    </div>
                  ))}
                </div>
                <div className="v-card p-6">
                  <h2 className="font-display text-lg font-bold text-white mb-4">Per-Campaign Performance</h2>
                  {(analytics.campaigns || []).length === 0 ? (
                    <p className="text-sm text-[#9AA4B2]">No campaign analytics yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="text-[#667085] text-left border-b border-white/[0.08]">
                            <th className="py-2 pr-3 font-medium">Campaign</th>
                            <th className="py-2 pr-3 font-medium">Status</th>
                            <th className="py-2 pr-3 font-medium text-right">Impr.</th>
                            <th className="py-2 pr-3 font-medium text-right">Clicks</th>
                            <th className="py-2 pr-3 font-medium text-right">CTR</th>
                          </tr>
                        </thead>
                        <tbody>
                          {analytics.campaigns.map((c) => (
                            <tr key={c.id} className="border-b border-white/[0.05]">
                              <td className="py-2.5 pr-3 text-white">{c.campaign_name}</td>
                              <td className="py-2.5 pr-3 text-[#9AA4B2]">{c.status}</td>
                              <td className="py-2.5 pr-3 text-right tabular-nums">{c.impressions || 0}</td>
                              <td className="py-2.5 pr-3 text-right tabular-nums">{c.clicks || 0}</td>
                              <td className="py-2.5 pr-3 text-right text-[#16C784] tabular-nums">{c.ctr || 0}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {tab === 'enquiries' && (
              <div className="v-card p-6">
                <h2 className="font-display text-lg font-bold text-white mb-4">Inbound Enquiries</h2>
                {enquiries.length === 0 ? (
                  <div className="p-8 text-center text-sm text-[#9AA4B2]">
                    No enquiries yet. Students who see your ads can message you directly in-app.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {enquiries.map((e) => (
                      <div key={e.id} className="rounded-xl bg-white/[0.03] border border-white/[0.08] p-4 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <p className="font-display text-sm font-bold text-white">
                            {e.display_name || 'A student'}
                            <span className="ml-2 text-[10px] font-normal text-[#667085]">· {e.campaign_name}</span>
                          </p>
                          <Badge variant={e.contact_mode === 'purchase' ? 'sponsored' : 'neutral'}>
                            {e.contact_mode}
                          </Badge>
                        </div>
                        {e.message && <p className="text-xs text-[#C2C9D4]">{e.message}</p>}
                        <p className="text-[10.5px] text-[#667085]">
                          {e.status} · {new Date(e.created_at).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
