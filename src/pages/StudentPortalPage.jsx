import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { usePlatform } from '../context/PlatformContext';
import { useToast } from '../context/ToastContext';
import NotificationsPanel from '../components/ui/NotificationsPanel';
import {
  GraduationCap,
  Trophy,
  BookOpen,
  Users,
  Flame,
  Calendar,
  TrendingUp,
  ArrowUpRight,
  Bell,
  LogOut,
  User as UserIcon,
  Compass,
  Check,
  FileText,
  UploadCloud,
  Lock,
  Unlock,
  X,
  Trash2,
  ShieldCheck,
  Clock,
  Video,
  CalendarDays,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { uploadAtswaDocument, fetchAtswaDocuments, unlockLevel } from '../lib/auth';
import { formatNaira, calculateAtswaTuition, calculateIcanTuition } from '../lib/pricing';
import {
  unlockLevelWithPaystack,
  enrollTuition,
  fetchMyTuitionEnrolments,
  listLiveClassSessions,
  getLiveClassMeetUrl,
  fetchMyPaymentReceipts,
  resolveExaminationLevel,
} from '../lib/payments';
import Badge from '../components/ui/Badge';

export default function StudentPortalPage() {
  const { user, profile, userNotifications, handleSignOut, atswaLevels, icanLevels, isLevelUnlocked, setUnlockedLevelIds, handleFetchAtswaDocuments, handleSubmitAtswaGuidance } = usePlatform();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState(searchParams.get('section') || 'overview');
  const [documents, setDocuments] = useState([]);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [uploadDocType, setUploadDocType] = useState('');
  const [uploadTargetLevel, setUploadTargetLevel] = useState('ats-1');
  const [unlockLevelId, setUnlockLevelId] = useState('');
  const [unlocking, setUnlocking] = useState(false);

  useEffect(() => {
    const section = searchParams.get('section');
    if (section) setActiveTab(section);
  }, [searchParams]);

  // Phase 4: Load ATSWA documents on mount and when tab changes
  useEffect(() => {
    if (!user) return;
    if (activeTab === 'documents' || activeTab === 'tuition') {
      handleFetchAtswaDocuments().then((res) => {
        if (Array.isArray(res.data)) setDocuments(res.data);
      });
    }
  }, [activeTab, handleFetchAtswaDocuments, user]);

  if (!user) return null;

  const handleSignOutClick = async () => {
    await handleSignOut();
    toast.success('Signed out', 'You have been logged out.');
    navigate('/');
  };

  const handleUploadDocument = async (e) => {
    e.preventDefault();
    const fileInput = e.target.elements.docFile;
    const file = fileInput?.files?.[0];
    if (!file) {
      toast.warning('No file selected', 'Choose a document to upload.');
      return;
    }
    if (!uploadDocType) {
      toast.warning('Select document type', 'Choose what type of document you are uploading.');
      return;
    }
    setUploadingDoc(true);
    const result = await uploadAtswaDocument(file, uploadDocType, uploadTargetLevel);
    setUploadingDoc(false);
    if (result.error) {
      toast.error('Upload failed', result.error);
      return;
    }
    toast.success('Document uploaded', `${file.name} saved to your ATSWA document vault.`);
    fileInput.value = '';
    setUploadDocType('');
    // Refresh document list
    const refresh = await fetchAtswaDocuments();
    if (Array.isArray(refresh.data)) setDocuments(refresh.data);
  };

  const handleDeleteDocument = async (docId) => {
    toast.info('Document removed', 'Your ATSWA document has been deleted.');
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
  };

  const handleUnlock = async () => {
    if (!unlockLevelId) {
      toast.warning('Select a level', 'Choose the level you want to unlock.');
      return;
    }
    // Extract the level ref (e.g. 'atswa:ats-1' -> 'ats-1', 'ican:foundation' -> 'foundation')
    const levelRef = unlockLevelId.includes(':') ? unlockLevelId.split(':')[1] : unlockLevelId;
    setUnlocking(true);
    try {
      const result = await unlockLevelWithPaystack({
        levelRef,
        email: user.email,
        name: displayName,
        onStatus: (status, payload) => {
          if (status === 'checkout') {
            toast.info('Checkout open', `Pay the unlock fee to continue.`);
          } else if (status === 'verifying') {
            toast.info('Verifying', 'Confirming your payment against Paystack...');
          }
        },
      });
      if (result?.error) {
        toast.error('Unlock failed', result.error);
        return;
      }
      if (result?.status === 'unlocked') {
        // Server already created the student_fee_unlocks row — just reflect it in portal state
        const key = unlockLevelId.includes(':') ? unlockLevelId : `level:${levelRef}`;
        setUnlockedLevelIds((prev) => (prev.includes(key) ? prev : [...prev, key]));
        toast.success('Level unlocked', `${levelRef} tuition cost implication is now unlocked.`);
        setUnlockLevelId('');
      }
    } catch (err) {
      toast.error('Unlock failed', err.message);
    } finally {
      setUnlocking(false);
    }
  };

  const quickLinks = [
    { key: 'overview', label: 'Overview', icon: TrendingUp, path: '/portal/student' },
    { key: 'competitions', label: 'Competitions', icon: Trophy, path: '/competitions' },
    { key: 'tuition', label: 'Tuition', icon: Unlock, path: '/portal/student' },
    { key: 'documents', label: 'Documents', icon: FileText, path: '/portal/student' },
    { key: 'learning', label: 'Learning', icon: BookOpen, path: '/learning' },
    { key: 'community', label: 'Community', icon: Users, path: '/community' },
    { key: 'profile', label: 'Profile', icon: UserIcon, path: '/profile' },
  ];

  const displayName = profile?.full_name || user.user_metadata?.full_name || user.email;
  const unread = userNotifications.filter((n) => !n.read_at).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F14] via-[#11161C] to-[#0B0F14] text-[#E4E9F0]">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-[#0B0F14]/85 backdrop-blur-md border-b border-white/[0.07]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#16C784] text-black font-bold text-sm">V</div>
            <span className="text-sm font-bold text-white">VALENCE</span>
          </Link>
          <div className="flex items-center gap-2">
            <NotificationsPanel />
            <div className="h-6 w-px bg-white/[0.1]" />
            <Link
              to="/profile"
              className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-white/[0.05] transition-colors"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#16C784]/20 text-[#16C784] text-xs font-bold">
                {displayName.charAt(0).toUpperCase()}
              </span>
              <span className="text-xs font-medium text-[#C2C9D4] hidden sm:block">{displayName}</span>
            </Link>
            <button
              type="button"
              onClick={handleSignOutClick}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#9AA4B2] hover:bg-white/[0.05] hover:text-white transition-colors"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Welcome banner */}
        <div className="rounded-2xl bg-gradient-to-r from-[#16C784]/[0.10] to-transparent border border-[#16C784]/20 p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#16C784]">Student Portal</p>
              <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">Welcome back, {displayName.split(' ')[0]}</h1>
              <p className="text-sm text-[#9AA4B2] mt-1">
                {profile?.institution_name
                  ? `${profile.institution_name} · ${profile.account_type?.replace(/_/g, ' ') || 'Student'}`
                  : profile?.account_type?.replace(/_/g, ' ') || 'Student'}
              </p>
            </div>
            {profile?.onboarding_completed && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#16C784]/10 border border-[#16C784]/20 px-3 py-1.5 text-xs font-semibold text-[#16C784]">
                <Check className="h-3.5 w-3.5" /> Onboarding complete
              </span>
            )}
          </div>
        </div>

        {/* Quick tabs */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1 -mx-1 px-1">
          {quickLinks.map((link) => (
            <button
              key={link.key}
              type="button"
              onClick={() => setActiveTab(link.key)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === link.key
                  ? 'bg-[#16C784] text-black'
                  : 'bg-white/[0.04] text-[#9AA4B2] hover:bg-white/[0.08] hover:text-white'
              }`}
            >
              <link.icon className="h-3.5 w-3.5" />
              {link.label}
            </button>
          ))}
        </div>

        {/* Overview grid */}
        {activeTab === 'overview' && (
          <div className="mt-6 space-y-6 animate-fade-up">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                icon={Trophy}
                label="Competitions"
                value="₦220,000"
                sub="Podium pool"
                accent="#EA3943"
                to="/competitions"
              />
              <MetricCard
                icon={BookOpen}
                label="Study tools"
                value="15"
                sub="Free tools"
                accent="#16C784"
                to="/learning"
              />
              <MetricCard
                icon={Users}
                label="Community"
                value="Active"
                sub="Forums & groups"
                accent="#16C784"
                to="/community"
              />
              <MetricCard
                icon={Flame}
                label="Streak"
                value={profile?.study_streak ? `${profile.study_streak} days` : 'Start now'}
                sub="Keep learning"
                accent="#F5A623"
                to="/learning"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Quick actions */}
              <div className="lg:col-span-2 rounded-2xl bg-[#11161C] border border-white/[0.10] p-6">
                <h2 className="text-sm font-bold text-white mb-4">Quick actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <QuickAction
                    icon={Compass}
                    title="Explore competitions"
                    desc="Join the National Inter-School Challenge"
                    to="/competitions"
                  />
                  <QuickAction
                    icon={BookOpen}
                    title="Browse study tools"
                    desc="15 free study tools available"
                    to="/learning"
                  />
                  <QuickAction
                    icon={Users}
                    title="Join community"
                    desc="Forums, study groups, peer connect"
                    to="/community"
                  />
                  <QuickAction
                    icon={UserIcon}
                    title="Edit profile & privacy"
                    desc="Avatar, gallery, privacy settings"
                    to="/profile"
                  />
                </div>
              </div>

              {/* Notifications summary */}
              <div className="rounded-2xl bg-[#11161C] border border-white/[0.10] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-white">Notifications</h2>
                  <span className="text-xs font-bold text-[#EA3943]">{unread} unread</span>
                </div>
                {userNotifications.length === 0 ? (
                  <p className="text-xs text-[#667085] py-6 text-center">No notifications yet.</p>
                ) : (
                  <div className="space-y-2.5 max-h-64 overflow-y-auto">
                    {userNotifications.slice(0, 5).map((n) => (
                      <div key={n.id} className="rounded-lg bg-white/[0.02] border border-white/[0.05] px-3 py-2">
                        <p className="text-xs font-semibold text-white truncate">{n.title}</p>
                        <p className="text-xs text-[#667085] truncate">{n.body}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'competitions' && (
          <TabContent icon={Trophy} title="National Inter-School Challenge" to="/competitions">
            Join the National Inter-School Challenge with a ₦220,000 podium pool. Only 4 competitors per school. Compete across ATSWA and ICAN divisions.
          </TabContent>
        )}

        {activeTab === 'tuition' && (
          <div className="mt-6 space-y-6 animate-fade-up">
            <div className="rounded-2xl bg-[#11161C] border border-white/[0.10] p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-5">
                <Unlock className="h-4.5 w-4.5 text-[#16C784]" />
                <h2 className="text-sm font-bold text-white">Tuition Level Unlocks</h2>
                <span className="text-xs text-[#667085]">₦3,000 per level · Paystack verified</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {atswaLevels.map((lvl) => {
                  const unlocked = isLevelUnlocked(`atswa:${lvl.id}`);
                  const calc = calculateAtswaTuition(lvl.courses.length, {
                    basePerCourse: lvl.tuitionPerCourse,
                    discountThreshold: lvl.discountMinCourses,
                    discountRate: lvl.discountRate,
                    maxTuition: lvl.maxTuition,
                    unlockFee: lvl.unlockFee,
                  });
                  return (
                    <div key={lvl.id} className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-white">{lvl.code}</span>
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold ${unlocked ? 'text-[#16C784]' : 'text-[#9AA4B2]'}`}>
                          {unlocked ? <><Unlock className="h-3 w-3" /> Unlocked</> : <><Lock className="h-3 w-3" /> Locked</>}
                        </span>
                      </div>
                      <p className="text-xs text-[#667085] mb-3">{lvl.courses.length} courses · 25% off 2+ courses</p>
                      {unlocked ? (
                        <div className="space-y-1.5 text-xs">
                          <div className="flex justify-between text-[#9AA4B2]">
                            <span>Online Tuition (all courses)</span>
                            <span className="tabular-nums-display font-bold text-white">{formatNaira(calc.netTuition)}</span>
                          </div>
                          <div className="flex justify-between text-[#9AA4B2]">
                            <span>Discount applied</span>
                            <span className="text-[#16C784]">-{formatNaira(calc.discountAmount)}</span>
                          </div>
                          <div className="flex justify-between text-[#9AA4B2]">
                            <span>Unlock fee (paid)</span>
                            <span className="text-[#16C784]">{formatNaira(calc.unlockFee)}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="rounded-lg bg-[#16C784]/[0.06] border border-[#16C784]/20 p-2.5 text-xs text-[#C2C9D4]">
                            Unlock to reveal full cost implication: in-app online tuition, official exam fees, and physical centre rates.
                          </div>
                          <button
                            type="button"
                            onClick={() => { setUnlockLevelId(`atswa:${lvl.id}`); }}
                            className="v-btn-primary w-full !py-2 text-xs"
                          >
                            <Unlock className="h-3.5 w-3.5" /> Unlock {lvl.code} (₦3,000)
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
                {icanLevels.map((lvl) => {
                  const unlocked = isLevelUnlocked(`ican:${lvl.slug}`);
                  const calc = calculateIcanTuition(lvl.courses.length, {
                    basePerCourse: lvl.tuitionPerCourse || 40000,
                    discountThreshold: lvl.discountMinCourses || 3,
                    discountRate: lvl.discountRate || 0.25,
                    unlockFee: lvl.unlockFee || 3000,
                  });
                  return (
                    <div key={lvl.id} className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-white">{lvl.shortName || lvl.code}</span>
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold ${unlocked ? 'text-[#16C784]' : 'text-[#9AA4B2]'}`}>
                          {unlocked ? <><Unlock className="h-3 w-3" /> Unlocked</> : <><Lock className="h-3 w-3" /> Locked</>}
                        </span>
                      </div>
                      <p className="text-xs text-[#667085] mb-3">{lvl.courses.length} courses · 25% off 3+ courses</p>
                      {unlocked ? (
                        <div className="space-y-1.5 text-xs">
                          <div className="flex justify-between text-[#9AA4B2]">
                            <span>Online Tuition (all courses)</span>
                            <span className="tabular-nums-display font-bold text-white">{formatNaira(calc.netTuition)}</span>
                          </div>
                          <div className="flex justify-between text-[#9AA4B2]">
                            <span>Discount applied</span>
                            <span className="text-[#16C784]">-{formatNaira(calc.discountAmount)}</span>
                          </div>
                          <div className="flex justify-between text-[#9AA4B2]">
                            <span>Unlock fee (paid)</span>
                            <span className="text-[#16C784]">{formatNaira(calc.unlockFee)}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="rounded-lg bg-[#16C784]/[0.06] border border-[#16C784]/20 p-2.5 text-xs text-[#C2C9D4]">
                            Unlock to reveal full cost implication: in-app online tuition, official exam fees, and physical centre rates.
                          </div>
                          <button
                            type="button"
                            onClick={() => { setUnlockLevelId(`ican:${lvl.slug}`); }}
                            className="v-btn-primary w-full !py-2 text-xs"
                          >
                            <Unlock className="h-3.5 w-3.5" /> Unlock {lvl.shortName || lvl.code} (₦3,000)
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {unlockLevelId && (
                <div className="mt-5 rounded-xl bg-[#0B0E11] border border-[#16C784]/30 p-4 animate-fade-up">
                  <p className="text-xs font-semibold text-white mb-1">Confirm unlock for {unlockLevelId}</p>
                  <p className="text-xs text-[#9AA4B2] mb-3">Pay the one-time ₦3,000 fee to permanently unlock this level's cost implication. Never charged twice.</p>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleUnlock}
                      disabled={unlocking}
                      className="v-btn-primary !py-2 !px-4 text-xs"
                    >
                      {unlocking ? 'Processing...' : <><Unlock className="h-3.5 w-3.5" /> Confirm Unlock (₦3,000)</>}
                    </button>
                    <button
                      type="button"
                      onClick={() => setUnlockLevelId('')}
                      className="text-xs text-[#9AA4B2] hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Tuition enrolment (gated by unlock) */}
              <TuitionEnrolmentSection
                atswaLevels={atswaLevels}
                icanLevels={icanLevels}
                isLevelUnlocked={isLevelUnlocked}
              />

              {/* Live classes (Google Meet access control) */}
              <LiveClassesSection
                atswaLevels={atswaLevels}
                icanLevels={icanLevels}
                isLevelUnlocked={isLevelUnlocked}
                toast={toast}
              />
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="mt-6 space-y-6 animate-fade-up">
            <div className="rounded-2xl bg-[#11161C] border border-white/[0.10] p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-5">
                <FileText className="h-4.5 w-4.5 text-[#16C784]" />
                <h2 className="text-sm font-bold text-white">ATSWA Document Vault</h2>
                <span className="text-xs text-[#667085]">Private storage · Admin-verified</span>
              </div>

              {/* Upload form */}
              <form onSubmit={handleUploadDocument} className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4 space-y-3 mb-6">
                <p className="text-xs font-semibold text-[#16C784]">Upload ATSWA Document</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="v-label">Document Type</label>
                    <select
                      value={uploadDocType}
                      onChange={(e) => setUploadDocType(e.target.value)}
                      className="v-input text-xs"
                    >
                      <option value="">Select type...</option>
                      <option value="passport_photo">Passport Photograph</option>
                      <option value="olevel_result">O'Level Result (WAEC/NECO/NABTEB)</option>
                      <option value="birth_certificate">Birth Certificate</option>
                      <option value="ats_1_pass_slip">ATS 1 Pass/Exemption Slip</option>
                      <option value="ats_2_pass_slip">ATS 2 Pass/Exemption Slip</option>
                      <option value="subscription_evidence">Subscription Evidence</option>
                      <option value="other">Other Document</option>
                    </select>
                  </div>
                  <div>
                    <label className="v-label">Target Level</label>
                    <select
                      value={uploadTargetLevel}
                      onChange={(e) => setUploadTargetLevel(e.target.value)}
                      className="v-input text-xs"
                    >
                      <option value="ats-1">ATS 1</option>
                      <option value="ats-2">ATS 2</option>
                      <option value="ats-3">ATS 3</option>
                    </select>
                  </div>
                  <div>
                    <label className="v-label">File (PDF/PNG/JPG, 10MB max)</label>
                    <input
                      type="file"
                      name="docFile"
                      accept=".pdf,.png,.jpg,.jpeg"
                      className="v-input text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-[#16C784]/15 file:text-[#16C784] file:font-semibold file:px-3 file:py-1.5"
                    />
                  </div>
                </div>
                <button type="submit" disabled={uploadingDoc} className="v-btn-primary !py-2 !px-4 text-xs">
                  {uploadingDoc ? 'Uploading...' : <><UploadCloud className="h-3.5 w-3.5" /> Upload Document</>}
                </button>
              </form>

              {/* Document list */}
              {documents.length === 0 ? (
                <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] py-8 text-center">
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-30 text-[#667085]" />
                  <p className="text-xs text-[#667085]">No documents uploaded yet. Upload your ATSWA documents above.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center gap-3 rounded-xl bg-white/[0.02] border border-white/[0.06] px-4 py-3">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#16C784]/10 text-[#16C784] shrink-0">
                        <FileText className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-white truncate">{doc.file_name}</p>
                        <p className="text-xs text-[#667085]">
                          {doc.document_type} · {doc.target_level || 'General'} · {doc.verified ? 'Verified' : 'Pending verification'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="text-[#667085] hover:text-[#EA3943] transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 flex items-center gap-2 rounded-lg bg-[#16C784]/[0.06] border border-[#16C784]/20 px-3 py-2.5 text-xs text-[#9AA4B2]">
                <ShieldCheck className="h-3.5 w-3.5 text-[#16C784] shrink-0" />
                Documents are stored securely in Supabase private storage. Admins verify submissions during the ATSWA registration guidance process.
              </div>
            </div>
          </div>
        )}

        {activeTab === 'learning' && (
          <TabContent icon={BookOpen} title="Learning Center" to="/learning">
            Access 15 free study tools, ATSWA & ICAN materials, past questions, and official diet timetables.
          </TabContent>
        )}

        {activeTab === 'community' && (
          <TabContent icon={Users} title="Community" to="/community">
            Join forums, study groups, and connect with peers across all 466 Nigerian institutions.
          </TabContent>
        )}

        {activeTab === 'profile' && (
          <div className="mt-6">
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 rounded-xl bg-[#11161C] border border-white/[0.10] px-5 py-3 text-sm font-semibold text-white hover:border-[#16C784]/30 transition-colors"
            >
              <UserIcon className="h-4 w-4 text-[#16C784]" />
              Go to profile & settings
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function TuitionEnrolmentSection({ atswaLevels, icanLevels, isLevelUnlocked }) {
  const [enrolments, setEnrolments] = useState([]);
  const [enrolling, setEnrolling] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setEnrolments(await fetchMyTuitionEnrolments());
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const allLevels = [
    ...atswaLevels.map((l) => ({ ...l, key: `atswa:${l.id}`, ref: l.id, prefix: 'atswa' })),
    ...icanLevels.map((l) => ({ ...l, key: `ican:${l.slug || l.id}`, ref: l.slug || l.id, prefix: 'ican' })),
  ];

  const handleEnrol = async (level) => {
    setEnrolling(level.key);
    setError('');
    try {
      const res = await resolveExaminationLevel(level.ref);
      const result = await enrollTuition(res.level_id, level.courses.map((c) => c.id));
      if (result?.error) {
        setError(result.error);
      } else {
        await load();
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setEnrolling(null);
    }
  };

  return (
    <div className="mt-6 rounded-xl bg-[#11161C] border border-white/[0.10] p-5">
      <div className="flex items-center gap-2 mb-4">
        <GraduationCap className="h-4 w-4 text-[#16C784]" />
        <h3 className="text-sm font-bold text-white">Tuition Enrolment</h3>
        <span className="text-xs text-[#667085]">Gated by the ₦3,000 level unlock</span>
      </div>
      {error && <p className="text-xs text-[#EA3943] mb-3">{error}</p>}
      {enrolments.length > 0 && (
        <div className="space-y-2 mb-4">
          {enrolments.map((e) => (
            <div key={e.id} className="rounded-lg bg-[#16C784]/[0.06] border border-[#16C784]/20 px-3 py-2 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-white">{e.level_name || e.level_id}</p>
                <p className="text-xs text-[#9AA4B2]">
                  {e.course_ids?.length || 0} courses · {e.status}
                </p>
              </div>
              <Badge variant="green">Enrolled</Badge>
            </div>
          ))}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {allLevels.map((level) => {
          const unlocked = isLevelUnlocked(level.key);
          const enrolled = enrolments.some((e) => e.level_id === level.key || e.level_name === level.name);
          return (
            <div key={level.key} className="rounded-lg border border-white/[0.08] p-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-white">{level.code || level.shortName || level.name}</p>
                {enrolled ? (
                  <Badge variant="verified">Enrolled</Badge>
                ) : unlocked ? (
                  <button
                    onClick={() => handleEnrol(level)}
                    disabled={enrolling === level.key}
                    className="v-btn-secondary !py-1 !px-2 text-xs"
                  >
                    <Plus className="h-3 w-3" /> {enrolling === level.key ? '...' : 'Enrol'}
                  </button>
                ) : (
                  <Badge variant="neutral">Locked</Badge>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LiveClassesSection({ atswaLevels, icanLevels, isLevelUnlocked, toast }) {
  const [sessionsByLevel, setSessionsByLevel] = useState({});
  const [loadingLevel, setLoadingLevel] = useState(null);
  const [joining, setJoining] = useState(null);

  const allLevels = [
    ...atswaLevels.map((l) => ({ ...l, key: `atswa:${l.id}`, ref: l.id })),
    ...icanLevels.map((l) => ({ ...l, key: `ican:${l.slug || l.id}`, ref: l.slug || l.id })),
  ];

  const loadLevel = async (level) => {
    setLoadingLevel(level.key);
    try {
      const res = await resolveExaminationLevel(level.ref);
      const sessions = await listLiveClassSessions(res.level_id);
      setSessionsByLevel((prev) => ({ ...prev, [level.key]: sessions }));
    } catch (e) {
      setSessionsByLevel((prev) => ({ ...prev, [level.key]: [] }));
      toast.error('Live classes', e.message);
    } finally {
      setLoadingLevel(null);
    }
  };

  const join = async (session) => {
    setJoining(session.id);
    try {
      const result = await getLiveClassMeetUrl(session.id);
      if (result?.error) {
        toast.error('Access denied', result.error);
      } else {
        window.open(result.meet_url, '_blank', 'noopener,noreferrer');
        toast.success('Joining live class', session.title);
      }
    } catch (e) {
      toast.error('Access denied', e.message);
    } finally {
      setJoining(null);
    }
  };

  return (
    <div className="mt-6 rounded-xl bg-[#11161C] border border-white/[0.10] p-5">
      <div className="flex items-center gap-2 mb-4">
        <Video className="h-4 w-4 text-[#16C784]" />
        <h3 className="text-sm font-bold text-white">Live Classes</h3>
        <span className="text-xs text-[#667085]">In-app video classes, enrolled students & assigned tutors</span>
      </div>
      <div className="space-y-4">
        {allLevels.map((level) => {
          const unlocked = isLevelUnlocked(level.key);
          const sessions = sessionsByLevel[level.key] || [];
          return (
            <div key={level.key}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-white">{level.code || level.shortName || level.name}</p>
                {unlocked && (
                  <button
                    onClick={() => loadLevel(level)}
                    disabled={loadingLevel === level.key}
                    className="text-xs text-[#16C784] hover:underline disabled:opacity-50"
                  >
                    {loadingLevel === level.key ? 'Loading...' : sessions.length ? 'Refresh' : 'View sessions'}
                  </button>
                )}
              </div>
              {unlocked && sessions.length === 0 && loadingLevel !== level.key && (
                <p className="text-xs text-[#667085]">No live classes scheduled for this level.</p>
              )}
              {sessions.length > 0 && (
                <div className="space-y-2">
                  {sessions.map((s) => (
                    <div key={s.id} className="rounded-lg border border-white/[0.08] p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs font-semibold text-white">{s.title}</p>
                          {s.scheduled_at && (
                            <p className="text-xs text-[#9AA4B2] flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(s.scheduled_at).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' })}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => join(s)}
                          disabled={joining === s.id}
                          className="v-btn-primary !py-1 !px-2 text-xs whitespace-nowrap"
                        >
                          <ExternalLink className="h-3 w-3" /> {joining === s.id ? 'Opening...' : 'Join'}
                        </button>
                      </div>
                      {s.description && <p className="text-xs text-[#9AA4B2] mt-1">{s.description}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, sub, accent, to }) {
  return (
    <Link
      to={to}
      className="group rounded-2xl bg-[#11161C] border border-white/[0.10] p-5 hover:border-white/[0.2] transition-colors"
    >
      <div className="flex items-start justify-between">
        <span
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${accent}15`, color: accent }}
        >
          <Icon className="h-4.5 w-4.5" />
        </span>
        <ArrowUpRight className="h-4 w-4 text-[#667085] group-hover:text-white transition-colors" />
      </div>
      <p className="text-sm font-semibold text-[#9AA4B2] mt-3">{label}</p>
      <p className="text-xl font-bold text-white mt-0.5">{value}</p>
      <p className="text-xs text-[#667085] mt-0.5">{sub}</p>
    </Link>
  );
}

function QuickAction({ icon: Icon, title, desc, to }) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-3 rounded-xl bg-white/[0.02] border border-white/[0.06] p-4 hover:border-[#16C784]/30 hover:bg-white/[0.04] transition-colors"
    >
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#16C784]/10 text-[#16C784] shrink-0">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="text-xs text-[#667085] truncate">{desc}</p>
      </div>
      <ArrowUpRight className="h-4 w-4 text-[#667085] group-hover:text-white transition-colors" />
    </Link>
  );
}

function TabContent({ icon: Icon, title, to, children }) {
  return (
    <div className="mt-6 rounded-2xl bg-[#11161C] border border-white/[0.10] p-8 text-center animate-fade-up">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#16C784]/10 text-[#16C784] mb-4">
        <Icon className="h-6 w-6" />
      </span>
      <h2 className="text-lg font-bold text-white">{title}</h2>
      <p className="text-sm text-[#9AA4B2] mt-2 max-w-md mx-auto">{children}</p>
      <Link to={to} className="v-btn-primary mt-5 inline-flex !py-2.5 !px-5 text-sm">
        Open <ArrowUpRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
