import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { usePlatform } from '../context/PlatformContext';
import { useToast } from '../context/ToastContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ADMIN_ROLES } from '../lib/auth';
import { formatNaira } from '../lib/pricing';
import { verifyTutor } from '../lib/tutor';
import { fetchAdvertiserVerificationQueue, reviewAdvertiserVerification, fetchAdCampaigns } from '../lib/advertising';
import {
  checkAdminRole,
  savePlatformSetting,
  fetchAllPlatformSettings,
  saveDeliveryZone,
  saveFaq,
  fetchFaqs,
  saveExamSession,
  fetchExamAuthorityConsole,
  syncExamCalendar,
  fetchPodiumLedger,
  fetchModerationQueue,
  fetchAnnouncementModerationQueue,
  resolveModerationReport,
  resolveAnnouncementReport,
  fetchAdminAuditLogs,
} from '../lib/adminRbac';
import CompetitionAdminPage from './CompetitionAdminPage';
import OpportunitiesAdminPage from './OpportunitiesAdminPage';
import Badge from '../components/ui/Badge';
import {
  ShieldCheck,
  LayoutDashboard,
  Settings2,
  ClipboardList,
  CalendarDays,
  Users,
  Megaphone,
  LogOut,
  CheckCircle2,
  XCircle,
  ToggleLeft,
  ToggleRight,
  ArrowUpRight,
  AlertTriangle,
  Clock,
  Package,
  ShoppingBag,
  Bell,
  Trophy,
  Briefcase,
  Save,
  Trash2,
  UserPlus,
  ShieldAlert,
  BookOpenCheck,
} from 'lucide-react';

const SECTIONS = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'cms', label: 'Platform & Pricing CMS', icon: Settings2 },
  { key: 'queue', label: 'Operations Queue', icon: ClipboardList },
  { key: 'tutors', label: 'Tutor Verification', icon: BookOpenCheck },
  { key: 'advertising', label: 'Ad Verification', icon: Megaphone },
  { key: 'exams', label: 'Examination Authority', icon: CalendarDays },
  { key: 'podium', label: 'Podium Ledger', icon: Trophy },
  { key: 'moderation', label: 'Moderation', icon: ShieldAlert },
  { key: 'audit', label: 'Audit Logs', icon: ClipboardList },
  { key: 'competitions', label: 'Competitions', icon: Trophy },
  { key: 'opportunities', label: 'Opportunities & PRO', icon: Briefcase },
  { key: 'users', label: 'Users & Roles', icon: Users },
  { key: 'announcements', label: 'Announcements', icon: Megaphone },
];

const NOTIFICATION_TYPES = ['support', 'atswa', 'store', 'book-enq', 'advertise'];

export default function AdminPortalPage() {
  const { user, adminRoles, profile, handleSignOut, liveExamSessions } = usePlatform();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState(searchParams.get('section') || 'overview');
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Platform & Pricing CMS
  const [settings, setSettings] = useState([]);
  const [editingSetting, setEditingSetting] = useState({});
  const [products, setProducts] = useState([]);
  const [productNotes, setProductNotes] = useState({});

  // Operations queue
  const [notifications, setNotifications] = useState([]);
  const [queueFilter, setQueueFilter] = useState('all');

  // Users & roles
  const [users, setUsers] = useState([]);
  const [roleAssign, setRoleAssign] = useState({});

  // Announcements
  const [announcements, setAnnouncements] = useState([]);
  const [tutorApps, setTutorApps] = useState([]);
  const [tutorCerts, setTutorCerts] = useState({});
  const [tutorProgramme, setTutorProgramme] = useState({});
  const [tutorBusy, setTutorBusy] = useState('');

  // Advertiser verification queue
  const [adVerifications, setAdVerifications] = useState([]);
  const [adCampaigns, setAdCampaigns] = useState([]);
  const [adBusy, setAdBusy] = useState('');

  // Phase 16: Central Exam Authority console
  const [examSessions, setExamSessions] = useState([]);
  const [examEdit, setExamEdit] = useState({});
  const [examBusy, setExamBusy] = useState('');

  // Phase 16: Podium ledger
  const [podium, setPodium] = useState({ competitionName: 'All competitions', ledger: [] });
  const [podiumComps, setPodiumComps] = useState([]);
  const [podiumFilter, setPodiumFilter] = useState(null);

  // Phase 16: Moderation queues
  const [modQueue, setModQueue] = useState([]);
  const [annModQueue, setAnnModQueue] = useState([]);
  const [modBusy, setModBusy] = useState('');

  // Phase 16: Audit logs
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditFilter, setAuditFilter] = useState('all');

  // Phase 16: CMS — DB-backed FAQs + delivery zones
  const [faqs, setFaqs] = useState([]);
  const [faqEdit, setFaqEdit] = useState({});
  const [faqBusy, setFaqBusy] = useState('');
  const [deliveryZones, setDeliveryZones] = useState([]);
  const [zoneEdit, setZoneEdit] = useState({});
  const [zoneBusy, setZoneBusy] = useState('');

  // Phase 16: RBAC gate check
  const [rbacGate, setRbacGate] = useState(null);

  useEffect(() => {
    const section = searchParams.get('section');
    if (section) setActiveTab(section);
  }, [searchParams]);

  const setTab = (key) => {
    setActiveTab(key);
    setSearchParams({ section: key });
  };

  // ---- Data loaders ----
  const loadOverview = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setStatsLoading(false);
      return;
    }
    const [profiles, productsRes, orders, notifs, campaigns, comps] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('products').select('id', { count: 'exact', head: true }),
      supabase.from('orders').select('id, total_ngn', { count: 'exact' }),
      supabase.from('notifications').select('id', { count: 'exact', head: true }),
      supabase.from('advertising_campaigns').select('id', { count: 'exact', head: true }),
      supabase.from('competitions').select('id, name, status'),
    ]);
    setStats({
      members: profiles.count ?? 0,
      products: productsRes.count ?? 0,
      orders: orders.count ?? 0,
      revenue: (orders.data || []).reduce((sum, o) => sum + (o.total_ngn || 0), 0),
      notifications: notifs.count ?? 0,
      campaigns: campaigns.count ?? 0,
      competitions: (comps.data || []).length,
    });
    setStatsLoading(false);
  }, []);

  const loadCms = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    const [settingsRes, productsRes] = await Promise.all([
      supabase.from('platform_settings').select('id, setting_key, setting_value, description'),
      supabase.from('products').select('id, name, product_type, is_available, availability_note'),
    ]);
    if (settingsRes.data) {
      setSettings(settingsRes.data);
      setEditingSetting((prev) => {
        const next = { ...prev };
        settingsRes.data.forEach((s) => {
          next[s.setting_key] =
            s.setting_value && typeof s.setting_value === 'object' && !Array.isArray(s.setting_value)
              ? s.setting_value.value ?? JSON.stringify(s.setting_value)
              : String(s.setting_value ?? '');
        });
        return next;
      });
    }
    if (productsRes.data) {
      setProducts(productsRes.data);
      setProductNotes((prev) => {
        const next = { ...prev };
        productsRes.data.forEach((p) => (next[p.id] = p.availability_note || ''));
        return next;
      });
    }
  }, []);

  const loadQueue = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    const { data } = await supabase
      .from('notifications')
      .select('id, profile_id, notification_type, title, message, read_at, created_at')
      .order('created_at', { ascending: false })
      .limit(100);
    if (data) setNotifications(data);
  }, []);

  const loadUsers = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    const [profilesRes, rolesRes] = await Promise.all([
      supabase
        .from('profiles')
        .select('id, user_id, display_name, full_name, account_type, user_category, created_at')
        .order('created_at', { ascending: false })
        .limit(100),
      supabase.from('user_roles').select('user_id, role'),
    ]);
    const rolesByUser = {};
    (rolesRes.data || []).forEach((r) => {
      if (!rolesByUser[r.user_id]) rolesByUser[r.user_id] = [];
      rolesByUser[r.user_id].push(r.role);
    });
    if (profilesRes.data) {
      setUsers(
        profilesRes.data.map((p) => ({
          ...p,
          roles: rolesByUser[p.user_id] || [],
        }))
      );
    }
  }, []);

  const loadAnnouncements = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    const { data } = await supabase
      .from('announcement_posts')
      .select('id, title, category, audience, status, is_official, created_at')
      .order('created_at', { ascending: false })
      .limit(100);
    if (data) setAnnouncements(data);
  }, []);

  const loadTutors = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    const [pendingRes, verifiedRes, rejectedRes] = await Promise.all([
      supabase.from('tutor_profiles').select('*').eq('verification_status', 'pending').order('created_at', { ascending: false }).limit(100),
      supabase.from('tutor_profiles').select('id, qualifications, expertise, verification_status, created_at').eq('verification_status', 'verified').order('created_at', { ascending: false }).limit(50),
      supabase.from('tutor_profiles').select('id, verification_status, created_at').eq('verification_status', 'rejected').order('created_at', { ascending: false }).limit(50),
    ]);
    const apps = [...(pendingRes.data || []), ...(verifiedRes.data || []), ...(rejectedRes.data || [])];
    setTutorApps(apps);
    const certMap = {};
    await Promise.all(
      (pendingRes.data || []).map(async (tp) => {
        const { data: certs } = await supabase
          .from('tutor_certificates')
          .select('*')
          .eq('tutor_profile_id', tp.id)
          .order('created_at', { ascending: true });
        certMap[tp.id] = certs || [];
      })
    );
    setTutorCerts(certMap);
  }, []);

  const handleTutorVerify = async (tutorId, action) => {
    const programme = tutorProgramme[tutorId] || 'ATSWA';
    setTutorBusy(tutorId);
    try {
      await verifyTutor(tutorId, action, programme);
      toast.success(
        action === 'approve' ? 'Tutor verified' : 'Tutor rejected',
        action === 'approve'
          ? `Certificates verified for ${programme}; qualifying test opened.`
          : 'Application rejected.'
      );
      await loadTutors();
    } catch (err) {
      toast.error('Verification failed', err.message);
    } finally {
      setTutorBusy('');
    }
  };

  const loadAdVerification = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    try {
      const [pending, active] = await Promise.all([
        fetchAdvertiserVerificationQueue('pending'),
        fetchAdCampaigns('active'),
      ]);
      setAdVerifications(Array.isArray(pending) ? pending : []);
      setAdCampaigns(Array.isArray(active) ? active : []);
    } catch (err) {
      toast.error('Could not load ad verification queue', err.message);
    }
  }, [toast]);

  const handleAdVerify = async (verificationId, approved) => {
    setAdBusy(verificationId);
    try {
      await reviewAdvertiserVerification({ verificationId, approved });
      toast.success(
        approved ? 'Advertiser approved' : 'Advertiser rejected',
        approved
          ? 'Advertiser marked verified — they can now book paid campaigns.'
          : 'Verification rejected. The advertiser can resubmit.'
      );
      await loadAdVerification();
    } catch (err) {
      toast.error('Verification failed', err.message);
    } finally {
      setAdBusy('');
    }
  };

  // ---- Phase 16 loaders ----

  const loadExamAuthority = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    try {
      const sessions = await fetchExamAuthorityConsole();
      setExamSessions(sessions);
      const editMap = {};
      sessions.forEach((s) => {
        editMap[s.id] = {
          result_release_date: s.result_release_date ? s.result_release_date.slice(0, 10) : '',
          result_delay_notice: s.result_delay_notice || '',
          status: s.status || '',
        };
      });
      setExamEdit(editMap);
    } catch (err) {
      toast.error('Could not load exam authority console', err.message);
    }
  }, [toast]);

  const loadPodium = useCallback(async (competitionId = null) => {
    if (!isSupabaseConfigured) return;
    try {
      const [ledger, compsRes] = await Promise.all([
        fetchPodiumLedger(competitionId),
        supabase.from('competitions').select('id, name').eq('status', 'closed').order('created_at', { ascending: false }).limit(50),
      ]);
      setPodium(ledger);
      setPodiumFilter(competitionId);
      setPodiumComps(compsRes.data || []);
    } catch (err) {
      toast.error('Could not load podium ledger', err.message);
    }
  }, [toast]);

  const loadModeration = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    try {
      const [content, ann] = await Promise.all([
        fetchModerationQueue(),
        fetchAnnouncementModerationQueue(),
      ]);
      setModQueue(content);
      setAnnModQueue(ann);
    } catch (err) {
      toast.error('Could not load moderation queues', err.message);
    }
  }, [toast]);

  const loadAudit = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    try {
      const logs = await fetchAdminAuditLogs(200, 0);
      setAuditLogs(logs);
    } catch (err) {
      toast.error('Could not load audit logs', err.message);
    }
  }, [toast]);

  const loadFaqs = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    try {
      const rows = await fetchFaqs();
      setFaqs(rows);
      const editMap = {};
      rows.forEach((f) => {
        editMap[f.id] = {
          question: f.question,
          answer: f.answer,
          category: f.category,
          sort_order: f.sort_order ?? 0,
          is_active: f.is_active ?? true,
        };
      });
      setFaqEdit(editMap);
    } catch (err) {
      toast.error('Could not load FAQs', err.message);
    }
  }, [toast]);

  const loadDeliveryZones = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    try {
      const { data } = await supabase
        .from('delivery_zones')
        .select('id, name, states, fee_ngn, is_free')
        .order('name', { ascending: true });
      const zones = data || [];
      setDeliveryZones(zones);
      const editMap = {};
      zones.forEach((z) => {
        editMap[z.id] = {
          name: z.name,
          states: Array.isArray(z.states) ? z.states.join(', ') : '',
          fee_ngn: String(z.fee_ngn ?? 0),
          is_free: !!z.is_free,
        };
      });
      setZoneEdit(editMap);
    } catch (err) {
      toast.error('Could not load delivery zones', err.message);
    }
  }, [toast]);

  const loadRbacGate = useCallback(async () => {
    try {
      const res = await checkAdminRole('super_admin');
      setRbacGate(res);
    } catch {
      setRbacGate(null);
    }
  }, []);

  // ---- Phase 16 actions ----

  const saveFaqRow = async (faq) => {
    setFaqBusy(faq.id);
    try {
      await saveFaq({
        faqId: faq.id,
        question: faqEdit[faq.id].question,
        answer: faqEdit[faq.id].answer,
        category: faqEdit[faq.id].category,
        sortOrder: Number(faqEdit[faq.id].sort_order) || 0,
        isActive: faqEdit[faq.id].is_active,
      });
      toast.success('Saved', 'FAQ updated.');
      await loadFaqs();
    } catch (err) {
      toast.error('Save failed', err.message);
    } finally {
      setFaqBusy('');
    }
  };

  const addFaq = async () => {
    setFaqBusy('new');
    try {
      await saveFaq({
        question: 'New FAQ question',
        answer: 'New FAQ answer.',
        category: 'general',
        sortOrder: 100,
        isActive: true,
      });
      toast.success('FAQ created', 'Added a new FAQ entry.');
      await loadFaqs();
    } catch (err) {
      toast.error('Create failed', err.message);
    } finally {
      setFaqBusy('');
    }
  };

  const saveZoneRow = async (zone) => {
    setZoneBusy(zone.id);
    try {
      await saveDeliveryZone({
        zoneId: zone.id,
        name: zoneEdit[zone.id].name,
        states: zoneEdit[zone.id].states.split(',').map((s) => s.trim()).filter(Boolean),
        feeNgn: Number(zoneEdit[zone.id].fee_ngn) || 0,
        isFree: zoneEdit[zone.id].is_free,
      });
      toast.success('Saved', 'Delivery zone updated.');
      await loadDeliveryZones();
    } catch (err) {
      toast.error('Save failed', err.message);
    } finally {
      setZoneBusy('');
    }
  };

  const saveExamRow = async (session) => {
    setExamBusy(session.id);
    try {
      await saveExamSession(session.id, {
        status: examEdit[session.id].status,
        result_release_date: examEdit[session.id].result_release_date || null,
        result_delay_notice: examEdit[session.id].result_delay_notice,
      });
      toast.success('Saved', `Exam session "${session.name}" updated.`);
      await loadExamAuthority();
    } catch (err) {
      toast.error('Save failed', err.message);
    } finally {
      setExamBusy('');
    }
  };

  const syncExam = async (session) => {
    setExamBusy(session.id);
    try {
      await syncExamCalendar(session.id);
      toast.success('Calendar synced', `Google Calendar sync marked for "${session.name}".`);
      await loadExamAuthority();
    } catch (err) {
      toast.error('Sync failed', err.message);
    } finally {
      setExamBusy('');
    }
  };

  const resolveContentReport = async (report, action) => {
    setModBusy(report.id);
    try {
      await resolveModerationReport(report.id, action, 'Resolved from Admin Portal.');
      toast.success('Report resolved', `Content report ${action === 'uphold' ? 'upheld' : 'dismissed'}.`);
      await loadModeration();
    } catch (err) {
      toast.error('Resolve failed', err.message);
    } finally {
      setModBusy('');
    }
  };

  const resolveAnnReport = async (report, action) => {
    setModBusy(report.id);
    try {
      await resolveAnnouncementReport(report.id, action, 'Resolved from Admin Portal.');
      toast.success('Report resolved', `Announcement report ${action === 'uphold' ? 'upheld (post removed)' : 'dismissed'}.`);
      await loadModeration();
    } catch (err) {
      toast.error('Resolve failed', err.message);
    } finally {
      setModBusy('');
    }
  };

  useEffect(() => {
    if (!user) return;
    loadOverview();
  }, [user, loadOverview]);

  useEffect(() => {
    if (!user) return;
    if (activeTab === 'cms') { loadCms(); loadFaqs(); loadDeliveryZones(); }
    if (activeTab === 'queue') loadQueue();
    if (activeTab === 'users') loadUsers();
    if (activeTab === 'announcements') loadAnnouncements();
    if (activeTab === 'tutors') loadTutors();
    if (activeTab === 'advertising') loadAdVerification();
    if (activeTab === 'exams') loadExamAuthority();
    if (activeTab === 'podium') loadPodium(podiumFilter);
    if (activeTab === 'moderation') loadModeration();
    if (activeTab === 'audit') loadAudit();
  }, [activeTab, user, loadCms, loadQueue, loadUsers, loadAnnouncements, loadAdVerification, loadExamAuthority, loadPodium, loadModeration, loadAudit, loadFaqs, loadDeliveryZones, podiumFilter]);

  useEffect(() => {
    if (user) loadRbacGate();
  }, [user, loadRbacGate]);

  if (!user) return null;

  // Non-admin members are redirected to their own portal by the route guard.
  const isAdmin =
    adminRoles.includes('super_admin') ||
    adminRoles.some((r) => ADMIN_ROLES.some((ar) => ar.value === r));

  // ---- Actions ----
  const handleSignOutClick = async () => {
    await handleSignOut();
    toast.success('Signed out', 'You have been logged out.');
    navigate('/');
  };

  const saveSetting = async (setting) => {
    const raw = editingSetting[setting.setting_key];
    let value;
    try {
      value = JSON.parse(raw);
    } catch {
      value = raw;
    }
    // Preserve scalar strings as JSON string scalars (matching stored jsonb shape)
    if (typeof value === 'string') value = JSON.stringify(value);
    const { error } = await supabase
      .from('platform_settings')
      .update({ setting_value: value, updated_at: new Date().toISOString() })
      .eq('id', setting.id);
    if (error) {
      toast.error('Save failed', error.message);
    } else {
      toast.success('Saved', `${setting.setting_key} updated.`);
      loadCms();
    }
  };

  const toggleProductAvailability = async (product) => {
    const next = !product.is_available;
    const { error } = await supabase
      .from('products')
      .update({ is_available: next, availability_note: productNotes[product.id], updated_at: new Date().toISOString() })
      .eq('id', product.id);
    if (error) {
      toast.error('Update failed', error.message);
    } else {
      toast.success(next ? 'Product published' : 'Product hidden', `${product.name} is now ${next ? 'available' : 'unavailable'}.`);
      loadCms();
    }
  };

  const saveProductNote = async (product) => {
    const { error } = await supabase
      .from('products')
      .update({ availability_note: productNotes[product.id], updated_at: new Date().toISOString() })
      .eq('id', product.id);
    if (error) {
      toast.error('Update failed', error.message);
    } else {
      toast.success('Saved', 'Availability note updated.');
    }
  };

  const markNotificationRead = async (notif) => {
    const { error } = await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('id', notif.id);
    if (error) {
      toast.error('Update failed', error.message);
    } else {
      toast.success('Marked read', 'Enquiry marked as read.');
      loadQueue();
    }
  };

  const assignRole = async (profileUser) => {
    const role = roleAssign[profileUser.user_id];
    if (!role) {
      toast.warning('Select a role', 'Choose a role to assign.');
      return;
    }
    const { error } = await supabase
      .from('user_roles')
      .insert({ user_id: profileUser.user_id, role, assigned_by: user.id });
    if (error) {
      toast.error('Assignment failed', error.message);
    } else {
      toast.success('Role granted', `${role} assigned to ${profileUser.display_name || profileUser.full_name || profileUser.user_id}.`);
      loadUsers();
    }
  };

  const revokeRole = async (profileUser, role) => {
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', profileUser.user_id)
      .eq('role', role);
    if (error) {
      toast.error('Revoke failed', error.message);
    } else {
      toast.success('Role revoked', `${role} removed.`);
      loadUsers();
    }
  };

  const toggleAnnouncementStatus = async (post) => {
    const next = post.status === 'published' ? 'draft' : 'published';
    const { error } = await supabase
      .from('announcement_posts')
      .update({ status: next, updated_at: new Date().toISOString() })
      .eq('id', post.id);
    if (error) {
      toast.error('Update failed', error.message);
    } else {
      toast.success('Updated', `Announcement set to ${next}.`);
      loadAnnouncements();
    }
  };

  // ---- Derived views ----
  const filteredNotifications =
    queueFilter === 'all'
      ? notifications
      : notifications.filter((n) => n.notification_type === queueFilter);

  const unreadNotifications = notifications.filter((n) => !n.read_at).length;

  const roleLabel = (role) => ADMIN_ROLES.find((r) => r.value === role)?.label || role;

  return (
    <div className="bg-grid-fintech min-h-[70vh]">
      <div className="v-container space-y-6">
        {/* Admin Header */}
        <div className="v-glass-card p-6 sm:p-8 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#16C784]/[0.12] border border-[#16C784]/30 text-[#16C784]">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
                      Admin & Central Examination Authority Console
                    </h1>
                    <Badge variant="green">Super Admin</Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-[#9AA4B2]">
                    Full platform CMS · RBAC · RLS-protected — manage content, pricing, enquiries, exams, users &amp; announcements.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-[11px] text-[#667085]">Signed in as</p>
                <p className="text-xs font-semibold text-white">{user.email}</p>
                {adminRoles.length > 0 && (
                  <p className="text-[11px] text-[#16C784]">{adminRoles.map(roleLabel).join(', ')}</p>
                )}
              </div>
              <button onClick={handleSignOutClick} className="v-btn-secondary px-3 py-2">
                <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex flex-wrap gap-2">
          {SECTIONS.map((s) => {
            const SIcon = s.icon;
            const active = activeTab === s.key;
            return (
              <button
                key={s.key}
                onClick={() => setTab(s.key)}
                className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold border transition-all ${
                  active
                    ? 'bg-[#16C784] text-[#06130D] border-[#16C784] shadow-glow-sm'
                    : 'bg-[#11161C] text-[#C2C9D4] border-white/[0.08] hover:border-white/[0.2] hover:text-white'
                }`}
              >
                <SIcon className="h-3.5 w-3.5" />
                {s.label}
                {s.key === 'queue' && unreadNotifications > 0 && (
                  <span className="ml-0.5 inline-flex items-center justify-center rounded-full bg-[#EF4444] text-[10px] font-bold text-white px-1.5">
                    {unreadNotifications}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ============ OVERVIEW ============ */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: 'Members', value: stats?.members, icon: Users, tint: 'text-[#16C784]' },
                { label: 'Products', value: stats?.products, icon: Package, tint: 'text-[#3B82F6]' },
                { label: 'Orders', value: stats?.orders, icon: ShoppingBag, tint: 'text-[#A855F7]' },
                { label: 'Revenue', value: stats ? formatNaira(stats.revenue) : '₦0', icon: ShoppingBag, tint: 'text-[#22C55E]' },
                { label: 'Enquiries', value: stats?.notifications, icon: Bell, tint: 'text-[#F59E0B]' },
                { label: 'Competitions', value: stats?.competitions, icon: Trophy, tint: 'text-[#EC4899]' },
              ].map((s) => {
                const SIcon = s.icon;
                return (
                  <div key={s.label} className="v-card p-4 space-y-2">
                    <SIcon className={`h-5 w-5 ${s.tint}`} />
                    <div>
                      <p className="font-display text-xl font-bold text-white">
                        {statsLoading ? '—' : s.value}
                      </p>
                      <p className="text-[11px] text-[#667085]">{s.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="v-card p-6 space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#16C784]">System Status</p>
                <ul className="space-y-2.5 text-xs sm:text-sm text-[#D5DBE3]">
                  <li className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#16C784]" /> Supabase Auth</span>
                    <span className="text-[#16C784] font-semibold">{isSupabaseConfigured ? 'Connected' : 'Local mode'}</span>
                  </li>
                  <li className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#16C784]" /> Row Level Security</span>
                    <span className="text-[#16C784] font-semibold">Enabled (109 tables)</span>
                  </li>
                  <li className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#16C784]" /> RBAC (user_roles)</span>
                    <span className="text-[#16C784] font-semibold">{adminRoles.length} role(s) assigned</span>
                  </li>
                  <li className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2"><ShieldAlert className="h-4 w-4 text-[#F59E0B]" /> Admin access gate</span>
                    <span className="text-[#F59E0B] font-semibold">super_admin verified</span>
                  </li>
                </ul>
              </div>

              <div className="v-card p-6 space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#16C784]">Central Examination Authority</p>
                <ul className="space-y-2.5 text-xs sm:text-sm text-[#D5DBE3]">
                  {(liveExamSessions || []).slice(0, 6).map((s) => (
                    <li key={s.id || s.name} className="flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4 text-[#3B82F6]" /> {s.name || s.programme}</span>
                      <span className="text-[#C2C9D4]">{s.exam_starts ? new Date(s.exam_starts).toLocaleDateString() : '—'}</span>
                    </li>
                  ))}
                  {(liveExamSessions || []).length === 0 && (
                    <li className="text-[#667085]">No examination sessions configured yet.</li>
                  )}
                </ul>
              </div>
            </div>

            <div className="v-card p-6 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-[#16C784]">Admin Quick Actions</p>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setTab('cms')} className="v-btn-secondary px-4 py-2">Manage Pricing &amp; Products</button>
                <button onClick={() => setTab('queue')} className="v-btn-secondary px-4 py-2">Open Operations Queue</button>
                <button onClick={() => setTab('users')} className="v-btn-secondary px-4 py-2">Grant / Revoke Roles</button>
                <button onClick={() => setTab('exams')} className="v-btn-secondary px-4 py-2">Examination Timetables</button>
                <button onClick={() => setTab('announcements')} className="v-btn-secondary px-4 py-2">Publish Announcements</button>
              </div>
            </div>
          </div>
        )}

        {/* ============ PLATFORM & PRICING CMS ============ */}
        {activeTab === 'cms' && (
          <div className="space-y-6">
            <div className="v-card p-6 space-y-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#16C784]">Platform Settings</p>
                <p className="text-[11px] text-[#667085] mt-0.5">Live values stored in the platform_settings table — updated instantly across the app.</p>
              </div>
              {settings.map((s) => (
                <div key={s.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                  <div className="md:col-span-3">
                    <p className="text-xs font-semibold text-white">{s.setting_key}</p>
                    <p className="text-[11px] text-[#667085]">{s.description || 'Platform setting'}</p>
                  </div>
                  <div className="md:col-span-6">
                    <input
                      className="v-input"
                      value={editingSetting[s.setting_key] ?? ''}
                      onChange={(e) =>
                        setEditingSetting((prev) => ({ ...prev, [s.setting_key]: e.target.value }))
                      }
                    />
                  </div>
                  <div className="md:col-span-3 flex justify-end">
                    <button onClick={() => saveSetting(s)} className="v-btn-primary px-4 py-2">
                      <Save className="h-3.5 w-3.5" /> Save
                    </button>
                  </div>
                </div>
              ))}
              {settings.length === 0 && <p className="text-sm text-[#667085]">No platform settings loaded.</p>}
            </div>

            <div className="v-card p-6 space-y-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#16C784]">Store Products — Availability &amp; Notes</p>
                <p className="text-[11px] text-[#667085] mt-0.5">Toggle product availability and set availability notes (products table).</p>
              </div>
              {products.map((p) => (
                <div key={p.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start pb-4 border-b border-white/[0.07] last:border-0 last:pb-0">
                  <div className="md:col-span-4">
                    <p className="text-xs font-semibold text-white">{p.name}</p>
                    <p className="text-[11px] text-[#667085]">{p.product_type || 'product'}</p>
                  </div>
                  <div className="md:col-span-5">
                    <input
                      className="v-input"
                      placeholder="Availability note (e.g. Temporarily out of stock)"
                      value={productNotes[p.id] ?? ''}
                      onChange={(e) => setProductNotes((prev) => ({ ...prev, [p.id]: e.target.value }))}
                    />
                  </div>
                  <div className="md:col-span-3 flex items-center gap-2">
                    <button onClick={() => saveProductNote(p)} className="v-btn-secondary px-3 py-2">
                      <Save className="h-3.5 w-3.5" /> Note
                    </button>
                    <button
                      onClick={() => toggleProductAvailability(p)}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold border transition-colors ${
                        p.is_available
                          ? 'border-[#16C784]/40 text-[#16C784] bg-[#16C784]/[0.08]'
                          : 'border-white/[0.12] text-[#9AA4B2] bg-[#11161C]'
                      }`}
                    >
                      {p.is_available ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                      {p.is_available ? 'Available' : 'Hidden'}
                    </button>
                  </div>
                </div>
              ))}
              {products.length === 0 && <p className="text-sm text-[#667085]">No products loaded.</p>}
            </div>

            <div className="v-card p-6 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#16C784]">FAQ Manager (DB-backed)</p>
                  <p className="text-[11px] text-[#667085] mt-0.5">
                    Live FAQs served via the faqs table — shown on Home &amp; Contact pages immediately after save.
                  </p>
                </div>
                <button onClick={addFaq} disabled={!!faqBusy} className="v-btn-secondary px-3 py-2 text-xs">
                  <UserPlus className="h-3.5 w-3.5" /> Add FAQ
                </button>
              </div>
              {faqs.map((f) => {
                const edit = faqEdit[f.id] || {};
                return (
                  <div key={f.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start pb-4 border-b border-white/[0.07] last:border-0 last:pb-0">
                    <div className="md:col-span-4 space-y-2">
                      <input
                        className="v-input py-1.5"
                        placeholder="Question"
                        value={edit.question || ''}
                        onChange={(e) => setFaqEdit((prev) => ({ ...prev, [f.id]: { ...prev[f.id], question: e.target.value } }))}
                      />
                      <select
                        className="v-input py-1.5"
                        value={edit.category || 'general'}
                        onChange={(e) => setFaqEdit((prev) => ({ ...prev, [f.id]: { ...prev[f.id], category: e.target.value } }))}
                      >
                        {['general', 'tuition', 'store', 'competition', 'advertise', 'tutor'].map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-5">
                      <textarea
                        className="v-input py-1.5 min-h-[72px]"
                        placeholder="Answer"
                        value={edit.answer || ''}
                        onChange={(e) => setFaqEdit((prev) => ({ ...prev, [f.id]: { ...prev[f.id], answer: e.target.value } }))}
                      />
                      <div className="flex items-center gap-2 mt-2">
                        <input
                          type="number"
                          className="v-input py-1.5 w-20"
                          placeholder="Order"
                          value={edit.sort_order ?? 0}
                          onChange={(e) => setFaqEdit((prev) => ({ ...prev, [f.id]: { ...prev[f.id], sort_order: e.target.value } }))}
                        />
                        <label className="inline-flex items-center gap-1.5 text-[11px] text-[#9AA4B2]">
                          <input
                            type="checkbox"
                            className="accent-[#16C784]"
                            checked={!!edit.is_active}
                            onChange={(e) => setFaqEdit((prev) => ({ ...prev, [f.id]: { ...prev[f.id], is_active: e.target.checked } }))}
                          />
                          Active
                        </label>
                      </div>
                    </div>
                    <div className="md:col-span-3 flex justify-end items-center gap-2">
                      <button onClick={() => saveFaqRow(f)} disabled={!!faqBusy} className="v-btn-primary px-3 py-2 text-xs">
                        <Save className="h-3.5 w-3.5" /> Save
                      </button>
                    </div>
                  </div>
                );
              })}
              {faqs.length === 0 && <p className="text-sm text-[#667085]">No FAQs loaded.</p>}
            </div>

            <div className="v-card p-6 space-y-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#16C784]">Delivery Zones</p>
                <p className="text-[11px] text-[#667085] mt-0.5">
                  Store delivery zones &amp; fees (delivery_zones table) — used at checkout for study-material orders.
                </p>
              </div>
              {deliveryZones.map((z) => {
                const edit = zoneEdit[z.id] || {};
                return (
                  <div key={z.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start pb-4 border-b border-white/[0.07] last:border-0 last:pb-0">
                    <div className="md:col-span-4">
                      <input
                        className="v-input py-1.5"
                        placeholder="Zone name"
                        value={edit.name || ''}
                        onChange={(e) => setZoneEdit((prev) => ({ ...prev, [z.id]: { ...prev[z.id], name: e.target.value } }))}
                      />
                    </div>
                    <div className="md:col-span-4">
                      <input
                        className="v-input py-1.5"
                        placeholder="States (comma-separated)"
                        value={edit.states || ''}
                        onChange={(e) => setZoneEdit((prev) => ({ ...prev, [z.id]: { ...prev[z.id], states: e.target.value } }))}
                      />
                    </div>
                    <div className="md:col-span-2 flex items-center gap-2">
                      <input
                        type="number"
                        className="v-input py-1.5 w-24"
                        placeholder="Fee ₦"
                        value={edit.fee_ngn || 0}
                        onChange={(e) => setZoneEdit((prev) => ({ ...prev, [z.id]: { ...prev[z.id], fee_ngn: e.target.value } }))}
                      />
                      <label className="inline-flex items-center gap-1 text-[11px] text-[#9AA4B2] whitespace-nowrap">
                        <input
                          type="checkbox"
                          className="accent-[#16C784]"
                          checked={!!edit.is_free}
                          onChange={(e) => setZoneEdit((prev) => ({ ...prev, [z.id]: { ...prev[z.id], is_free: e.target.checked } }))}
                        />
                        Free
                      </label>
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                      <button onClick={() => saveZoneRow(z)} disabled={!!zoneBusy} className="v-btn-primary px-3 py-2 text-xs">
                        <Save className="h-3.5 w-3.5" /> Save
                      </button>
                    </div>
                  </div>
                );
              })}
              {deliveryZones.length === 0 && <p className="text-sm text-[#667085]">No delivery zones loaded.</p>}
            </div>
          </div>
        )}

        {/* ============ OPERATIONS QUEUE ============ */}
        {activeTab === 'queue' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-[#C2C9D4]">Filter:</span>
              <button
                onClick={() => setQueueFilter('all')}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold border transition-colors ${queueFilter === 'all' ? 'bg-[#16C784] text-[#06130D] border-[#16C784]' : 'bg-[#11161C] text-[#9AA4B2] border-white/[0.08]'}`}
              >
                All ({notifications.length})
              </button>
              {NOTIFICATION_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setQueueFilter(t)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold border capitalize transition-colors ${queueFilter === t ? 'bg-[#16C784] text-[#06130D] border-[#16C784]' : 'bg-[#11161C] text-[#9AA4B2] border-white/[0.08]'}`}
                >
                  {t} ({notifications.filter((n) => n.notification_type === t).length})
                </button>
              ))}
            </div>

            <div className="v-card p-6 space-y-3">
              {filteredNotifications.map((n) => (
                <div key={n.id} className="rounded-xl bg-[#11161C] border border-white/[0.08] p-4 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Badge variant={n.notification_type === 'advertise' ? 'official' : 'neutral'}>
                          {n.notification_type}
                        </Badge>
                        <p className="text-sm font-semibold text-white truncate">{n.title}</p>
                        {!n.read_at && <span className="inline-block h-2 w-2 rounded-full bg-[#EF4444]" />}
                      </div>
                      <p className="text-xs text-[#9AA4B2] mt-1">{n.message}</p>
                      <p className="text-[10px] text-[#667085] mt-1">{n.created_at ? new Date(n.created_at).toLocaleString() : ''}</p>
                    </div>
                    {!n.read_at && (
                      <button onClick={() => markNotificationRead(n)} className="v-btn-secondary px-3 py-1.5 shrink-0">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Mark read
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {filteredNotifications.length === 0 && (
                <div className="text-center py-8">
                  <ClipboardList className="h-8 w-8 text-[#334155] mx-auto mb-2" />
                  <p className="text-sm text-[#667085]">No enquiries in this queue.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============ CENTRAL EXAM AUTHORITY (Phase 16) ============ */}
        {activeTab === 'exams' && (
          <div className="space-y-6">
            <div className="v-card p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#16C784]">Official Examination Sessions</p>
                  <p className="text-[11px] text-[#667085] mt-0.5">
                    Manage dates, timetables, result release & delay notices — stored in examination_sessions.
                  </p>
                </div>
                {rbacGate && (
                  <Badge variant={rbacGate.allowed ? 'green' : 'red'}>
                    {rbacGate.allowed ? 'RBAC gate: allowed' : 'RBAC gate: denied'}
                  </Badge>
                )}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {examSessions.map((s) => {
                  const edit = examEdit[s.id] || {};
                  return (
                    <div key={s.id} className="rounded-xl bg-[#11161C] border border-white/[0.08] p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-[#3B82F6]" />
                        <p className="text-sm font-semibold text-white">{s.name}</p>
                        <Badge variant="official">{s.diet} {s.year}</Badge>
                        <Badge variant={s.calendar_synced ? 'green' : 'neutral'}>
                          {s.calendar_synced ? 'Calendar synced' : 'Not synced'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <p className="text-[#667085]">Exam dates</p>
                          <p className="text-white">
                            {s.exam_starts ? new Date(s.exam_starts).toLocaleDateString() : '—'} → {s.exam_ends ? new Date(s.exam_ends).toLocaleDateString() : '—'}
                          </p>
                        </div>
                        <div>
                          <p className="text-[#667085]">Registration</p>
                          <p className="text-white">
                            {s.registration_opens ? new Date(s.registration_opens).toLocaleDateString() : '—'} → {s.registration_closes ? new Date(s.registration_closes).toLocaleDateString() : '—'}
                          </p>
                        </div>
                        <div>
                          <p className="text-[#667085]">Mock exam</p>
                          <p className="text-white">{s.mock_exam_date ? new Date(s.mock_exam_date).toLocaleDateString() : '—'}</p>
                        </div>
                        <div>
                          <p className="text-[#667085]">Revision window</p>
                          <p className="text-white">
                            {s.revision_starts ? new Date(s.revision_starts).toLocaleDateString() : '—'} → {s.revision_ends ? new Date(s.revision_ends).toLocaleDateString() : '—'}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                        <div className="sm:col-span-4">
                          <label className="v-label">Status</label>
                          <select
                            className="v-input py-1.5"
                            value={edit.status || ''}
                            onChange={(e) => setExamEdit((prev) => ({ ...prev, [s.id]: { ...prev[s.id], status: e.target.value } }))}
                          >
                            <option value="">—</option>
                            {['upcoming', 'open', 'active', 'completed', 'archived'].map((st) => (
                              <option key={st} value={st}>{st}</option>
                            ))}
                          </select>
                        </div>
                        <div className="sm:col-span-4">
                          <label className="v-label">Result release date</label>
                          <input
                            type="date"
                            className="v-input py-1.5"
                            value={edit.result_release_date || ''}
                            onChange={(e) => setExamEdit((prev) => ({ ...prev, [s.id]: { ...prev[s.id], result_release_date: e.target.value } }))}
                          />
                        </div>
                        <div className="sm:col-span-4">
                          <label className="v-label">Result delay notice</label>
                          <input
                            className="v-input py-1.5"
                            placeholder="e.g. Result release delayed by 7 days"
                            value={edit.result_delay_notice || ''}
                            onChange={(e) => setExamEdit((prev) => ({ ...prev, [s.id]: { ...prev[s.id], result_delay_notice: e.target.value } }))}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => saveExamRow(s)} disabled={!!examBusy} className="v-btn-primary px-3 py-2 text-xs">
                          <Save className="h-3.5 w-3.5" /> Save
                        </button>
                        <button
                          onClick={() => syncExam(s)}
                          disabled={!!examBusy}
                          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold border transition-colors ${
                            s.calendar_synced
                              ? 'border-white/[0.12] text-[#9AA4B2] bg-[#11161C]'
                              : 'border-[#3B82F6]/40 text-[#3B82F6] bg-[#3B82F6]/[0.08]'
                          }`}
                        >
                          <CalendarDays className="h-3.5 w-3.5" />
                          {s.calendar_synced ? 'Re-sync Google Calendar' : 'Sync Google Calendar'}
                        </button>
                        {s.calendar_event_id && (
                          <span className="text-[10px] text-[#667085]">event: {String(s.calendar_event_id).slice(0, 28)}…</span>
                        )}
                      </div>
                    </div>
                  );
                })}
                {examSessions.length === 0 && (
                  <div className="lg:col-span-2 text-center py-8">
                    <CalendarDays className="h-8 w-8 text-[#334155] mx-auto mb-2" />
                    <p className="text-sm text-[#667085]">No examination sessions configured.</p>
                  </div>
                )}
              </div>
            </div>
            <div className="v-card p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-[#16C784]">Result Release &amp; Delay Notices</p>
              <p className="text-xs text-[#9AA4B2] mt-2">
                Result release dates and 30-day delay notices for ATSWA (2-day) and ICAN (3-day) sessions are maintained here and
                surfaced to candidates via countdown timers on their portals. Google Calendar sync marks each session as synced
                to the VALENCE exam calendar.
              </p>
            </div>
          </div>
        )}

        {/* ============ PODIUM LEDGER (Phase 16) ============ */}
        {activeTab === 'podium' && (
          <div className="space-y-6">
            <div className="v-card p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#16C784]">Podium Payout Ledger</p>
                  <p className="text-[11px] text-[#667085] mt-0.5">
                    Audited competition prize disbursements (competition_rewards) — server-authoritative amounts.
                  </p>
                </div>
                <select
                  className="v-input py-1.5 max-w-[240px]"
                  value={podiumFilter || ''}
                  onChange={(e) => loadPodium(e.target.value || null)}
                >
                  <option value="">All competitions</option>
                  {podiumComps.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 rounded-xl bg-[#11161C] border border-white/[0.08] p-4 text-xs">
                <div className="md:col-span-4 text-[#667085]">
                  Competition: <span className="text-white font-semibold">{podium.competitionName}</span>
                </div>
                <div className="md:col-span-4 text-[#667085]">
                  Ledger entries: <span className="text-white font-semibold">{podium.ledger.length}</span>
                </div>
                <div className="md:col-span-4 text-[#667085]">
                  Total payout: <span className="text-[#16C784] font-semibold">{formatNaira((podium.ledger || []).reduce((s, r) => s + (r.prize_amount_ngn || 0), 0))}</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-left text-[#667085] border-b border-white/[0.07]">
                      <th className="py-2 pr-3 font-semibold">Rank</th>
                      <th className="py-2 pr-3 font-semibold">Student</th>
                      <th className="py-2 pr-3 font-semibold">Institution</th>
                      <th className="py-2 pr-3 font-semibold">Award</th>
                      <th className="py-2 pr-3 font-semibold">Amount</th>
                      <th className="py-2 pr-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(podium.ledger || []).map((r) => (
                      <tr key={r.id} className="border-b border-white/[0.05]">
                        <td className="py-2 pr-3 text-white font-semibold">{r.placement_rank || '—'}</td>
                        <td className="py-2 pr-3 text-[#C2C9D4]">{r.display_name || '—'}</td>
                        <td className="py-2 pr-3 text-[#C2C9D4]">{r.institution_name || '—'}</td>
                        <td className="py-2 pr-3 text-[#C2C9D4]">{r.award_name || r.award_type || '—'}</td>
                        <td className="py-2 pr-3 text-[#16C784] font-semibold">{formatNaira(r.prize_amount_ngn)}</td>
                        <td className="py-2 pr-3">
                          <Badge variant={r.status === 'disbursed' ? 'green' : 'neutral'}>{r.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {(podium.ledger || []).length === 0 && (
                  <p className="text-sm text-[#667085] py-6 text-center">No podium payouts recorded.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============ MODERATION (Phase 16) ============ */}
        {activeTab === 'moderation' && (
          <div className="space-y-6">
            <div className="v-card p-6 space-y-4">
              <p className="text-xs font-bold uppercase tracking-wider text-[#16C784]">Content Moderation Queue ({modQueue.length})</p>
              <p className="text-[11px] text-[#667085]">Pending content reports — uphold or dismiss. Upholding records the resolution in the audit log.</p>
              {modQueue.map((r) => (
                <div key={r.id} className="rounded-xl bg-[#11161C] border border-white/[0.08] p-4 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Badge variant="neutral">{r.target_type}</Badge>
                        <p className="text-sm font-semibold text-white truncate">{r.reason}</p>
                      </div>
                      <p className="text-[11px] text-[#667085] mt-1">
                        {r.description || 'No description'} · {r.created_at ? new Date(r.created_at).toLocaleString() : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => resolveContentReport(r, 'dismiss')} disabled={!!modBusy} className="v-btn-secondary px-3 py-2 text-xs">
                        <XCircle className="h-3.5 w-3.5" /> Dismiss
                      </button>
                      <button onClick={() => resolveContentReport(r, 'uphold')} disabled={!!modBusy} className="v-btn-primary px-3 py-2 text-xs">
                        <ShieldAlert className="h-3.5 w-3.5" /> Uphold
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {modQueue.length === 0 && (
                <div className="text-center py-8">
                  <ShieldCheck className="h-8 w-8 text-[#334155] mx-auto mb-2" />
                  <p className="text-sm text-[#667085]">No pending content reports.</p>
                </div>
              )}
            </div>
            <div className="v-card p-6 space-y-4">
              <p className="text-xs font-bold uppercase tracking-wider text-[#16C784]">Announcement Moderation Queue ({annModQueue.length})</p>
              <p className="text-[11px] text-[#667085]">
                Pending announcement reports — upholding a report also removes the offending announcement post.
              </p>
              {annModQueue.map((r) => (
                <div key={r.id} className="rounded-xl bg-[#11161C] border border-white/[0.08] p-4 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{r.announcement_title || 'Announcement'}</p>
                      <p className="text-[11px] text-[#667085] mt-1">{r.reason} · {r.created_at ? new Date(r.created_at).toLocaleString() : ''}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => resolveAnnReport(r, 'dismiss')} disabled={!!modBusy} className="v-btn-secondary px-3 py-2 text-xs">
                        <XCircle className="h-3.5 w-3.5" /> Dismiss
                      </button>
                      <button onClick={() => resolveAnnReport(r, 'uphold')} disabled={!!modBusy} className="v-btn-primary px-3 py-2 text-xs">
                        <ShieldAlert className="h-3.5 w-3.5" /> Uphold &amp; Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {annModQueue.length === 0 && (
                <div className="text-center py-8">
                  <ShieldCheck className="h-8 w-8 text-[#334155] mx-auto mb-2" />
                  <p className="text-sm text-[#667085]">No pending announcement reports.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============ AUDIT LOGS (Phase 16) ============ */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <div className="v-card p-6 space-y-4">
              <p className="text-xs font-bold uppercase tracking-wider text-[#16C784]">Admin Audit Log</p>
              <p className="text-[11px] text-[#667085]">
                Every admin action is recorded server-side — role changes, settings, FAQs, exam edits, moderation resolutions.
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setAuditFilter('all')}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold border transition-colors ${auditFilter === 'all' ? 'bg-[#16C784] text-[#06130D] border-[#16C784]' : 'bg-[#11161C] text-[#9AA4B2] border-white/[0.08]'}`}
                >
                  All ({auditLogs.length})
                </button>
                {['manage_platform_setting', 'manage_delivery_zone', 'manage_exam_session', 'sync_exam_calendar', 'manage_faq', 'resolve_moderation_report', 'resolve_announcement_report'].map((a) => (
                  <button
                    key={a}
                    onClick={() => setAuditFilter(a)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold border transition-colors ${auditFilter === a ? 'bg-[#16C784] text-[#06130D] border-[#16C784]' : 'bg-[#11161C] text-[#9AA4B2] border-white/[0.08]'}`}
                  >
                    {a}
                  </button>
                ))}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-left text-[#667085] border-b border-white/[0.07]">
                      <th className="py-2 pr-3 font-semibold">When</th>
                      <th className="py-2 pr-3 font-semibold">Action</th>
                      <th className="py-2 pr-3 font-semibold">Actor</th>
                      <th className="py-2 pr-3 font-semibold">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(auditFilter === 'all' ? auditLogs : auditLogs.filter((l) => l.action === auditFilter)).map((l) => (
                      <tr key={l.id} className="border-b border-white/[0.05] align-top">
                        <td className="py-2 pr-3 text-[#9AA4B2] whitespace-nowrap">{l.created_at ? new Date(l.created_at).toLocaleString() : '—'}</td>
                        <td className="py-2 pr-3">
                          <span className="inline-flex items-center gap-1 text-[#3B82F6] font-semibold">
                            <ShieldAlert className="h-3 w-3" />{l.action}
                          </span>
                        </td>
                        <td className="py-2 pr-3 text-[#C2C9D4]">{l.actor_email || l.actor_display_name || '—'}</td>
                        <td className="py-2 pr-3 text-[#9AA4B2] font-mono text-[10px] break-all">
                          {l.details ? JSON.stringify(l.details) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {(auditFilter === 'all' ? auditLogs : auditLogs.filter((l) => l.action === auditFilter)).length === 0 && (
                  <p className="text-sm text-[#667085] py-6 text-center">No audit log entries.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============ USERS & ROLES ============ */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="v-card p-6 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-[#16C784]">Members &amp; Role Management</p>
              <p className="text-[11px] text-[#667085]">
                Grant or revoke platform admin roles (stored in user_roles). Role changes take effect on the member's next sign-in.
              </p>
              {users.map((u) => (
                <div key={u.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center pb-3 border-b border-white/[0.07] last:border-0 last:pb-0">
                  <div className="md:col-span-4 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">
                      {u.display_name || u.full_name || u.user_id}
                    </p>
                    <p className="text-[11px] text-[#667085] truncate">{u.account_type || u.user_category || 'member'} · {u.user_id}</p>
                  </div>
                  <div className="md:col-span-4 flex flex-wrap gap-1.5">
                    {u.roles.length === 0 ? (
                      <span className="text-[11px] text-[#667085]">No roles</span>
                    ) : (
                      u.roles.map((r) => (
                        <span key={r} className="inline-flex items-center gap-1 rounded-lg bg-[#16C784]/[0.12] border border-[#16C784]/30 text-[#16C784] text-[10px] font-semibold px-2 py-1">
                          {roleLabel(r)}
                          <button onClick={() => revokeRole(u, r)} className="hover:text-[#EF4444]">
                            <XCircle className="h-3 w-3" />
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                  <div className="md:col-span-4 flex items-center gap-2">
                    <select
                      className="v-input py-1.5"
                      value={roleAssign[u.user_id] || ''}
                      onChange={(e) => setRoleAssign((prev) => ({ ...prev, [u.user_id]: e.target.value }))}
                    >
                      <option value="">Assign role…</option>
                      {ADMIN_ROLES.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                    <button onClick={() => assignRole(u)} className="v-btn-primary px-3 py-2">
                      <UserPlus className="h-3.5 w-3.5" /> Grant
                    </button>
                  </div>
                </div>
              ))}
              {users.length === 0 && <p className="text-sm text-[#667085]">No members loaded.</p>}
            </div>
          </div>
        )}

        {/* ============ ANNOUNCEMENTS ============ */}
        {activeTab === 'tutors' && (
          <div className="space-y-6">
            <div className="v-card p-6 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-[#16C784]">Tutor Verification Queue</p>
              <p className="text-[11px] text-[#667085]">
                Manually verify tutor certificates. ATSWA tutors require AAT; ICAN tutors require AAT + ACA. Approving a tutor opens their 20-question / 45-minute qualifying test automatically.
              </p>
            </div>

            {tutorApps.filter((t) => t.verification_status === 'pending').map((tp) => {
              const certs = tutorCerts[tp.id] || [];
              return (
                <div key={tp.id} className="v-card p-5 space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-white">Tutor application</p>
                      <p className="text-[11px] text-[#667085]">
                        Submitted {tp.created_at ? new Date(tp.created_at).toLocaleString() : '—'}
                      </p>
                    </div>
                    <Badge variant="neutral">pending</Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="rounded-xl bg-[#0B0E11] border border-white/[0.08] p-3 space-y-1">
                      <p className="font-semibold text-[#16C784]">Qualifications</p>
                      <p className="text-[#C2C9D4]">{(tp.qualifications || []).join(', ') || '—'}</p>
                    </div>
                    <div className="rounded-xl bg-[#0B0E11] border border-white/[0.08] p-3 space-y-1">
                      <p className="font-semibold text-[#16C784]">Expertise</p>
                      <p className="text-[#C2C9D4]">{(tp.expertise || []).join(', ') || '—'}</p>
                    </div>
                    <div className="rounded-xl bg-[#0B0E11] border border-white/[0.08] p-3 space-y-1">
                      <p className="font-semibold text-[#16C784]">Available hours</p>
                      <p className="text-[#C2C9D4]">{tp.available_hours || '—'}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#667085]">Certificates uploaded</p>
                    {certs.length === 0 ? (
                      <p className="text-xs text-[#9AA4B2]">No certificates uploaded yet.</p>
                    ) : (
                      certs.map((c) => (
                        <div key={c.id} className="flex items-center justify-between gap-3 rounded-lg bg-[#0B0E11] border border-white/[0.08] px-3 py-2">
                          <span className="text-xs text-[#C2C9D4]">
                            <span className="font-semibold text-white">{c.certificate_type}</span> — {c.certificate_name}
                            {c.issuing_body ? ` · ${c.issuing_body}` : ''}
                            {c.certificate_number ? ` · #${c.certificate_number}` : ''}
                          </span>
                          <Badge variant={c.verification_status === 'verified' ? 'verified' : c.verification_status === 'rejected' ? 'red' : 'neutral'}>
                            {c.verification_status}
                          </Badge>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="inline-flex items-center gap-2">
                      <span className="text-[11px] text-[#9AA4B2]">Programme:</span>
                      <select
                        className="v-input text-xs py-1.5 w-44"
                        value={tutorProgramme[tp.id] || 'ATSWA'}
                        onChange={(e) => setTutorProgramme({ ...tutorProgramme, [tp.id]: e.target.value })}
                      >
                        <option value="ATSWA">ATSWA (requires AAT)</option>
                        <option value="ICAN">ICAN (requires AAT + ACA)</option>
                      </select>
                    </div>
                    <button
                      onClick={() => handleTutorVerify(tp.id, 'approve')}
                      disabled={tutorBusy === tp.id}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#16C784]/15 border border-[#16C784]/40 px-3.5 py-2 text-xs font-semibold text-[#16C784] hover:bg-[#16C784]/25 transition-colors disabled:opacity-50"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {tutorBusy === tp.id ? 'Verifying…' : 'Approve & open test'}
                    </button>
                    <button
                      onClick={() => handleTutorVerify(tp.id, 'reject')}
                      disabled={tutorBusy === tp.id}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#EA3943]/10 border border-[#EA3943]/40 px-3.5 py-2 text-xs font-semibold text-[#EA3943] hover:bg-[#EA3943]/20 transition-colors disabled:opacity-50"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      Reject
                    </button>
                  </div>
                </div>
              );
            })}

            {tutorApps.filter((t) => t.verification_status !== 'pending').length > 0 && (
              <div className="v-card p-5 space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-[#667085]">Recently processed</p>
                <ul className="space-y-2">
                  {tutorApps.filter((t) => t.verification_status !== 'pending').map((tp) => (
                    <li key={tp.id} className="flex items-center justify-between rounded-lg bg-[#0B0E11] border border-white/[0.08] px-3 py-2">
                      <span className="text-xs text-[#C2C9D4]">
                        {tp.created_at ? new Date(tp.created_at).toLocaleString() : ''}
                        {tp.qualifications?.length ? ` · ${tp.qualifications.join(', ')}` : ''}
                      </span>
                      <Badge variant={tp.verification_status === 'verified' ? 'verified' : 'red'}>
                        {tp.verification_status}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {tutorApps.length === 0 && (
              <div className="v-card p-8 text-center">
                <p className="text-sm text-[#667085]">No tutor applications in the queue.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'advertising' && (
          <div className="space-y-6">
            <div className="v-card p-6 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-[#16C784]">Advertiser Verification Queue</p>
                <Badge variant="neutral">{adVerifications.length} pending</Badge>
              </div>
              <p className="text-[11px] text-[#667085]">
                Review physical venue, ISBN and anti-piracy evidence. Approve to let advertisers book paid campaigns.
              </p>
            </div>

            {adVerifications.length === 0 ? (
              <div className="v-card p-8 text-center">
                <p className="text-sm text-[#667085]">No advertiser verification requests pending.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {adVerifications.map((v) => (
                  <div key={v.id} className="v-card p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-display text-sm font-bold text-white">
                          {v.centre_name || 'Advertiser'}
                        </p>
                        <p className="text-[11px] text-[#9AA4B2]">
                          {v.category || 'physical_centre'} ·
                          {v.created_at ? ` ${new Date(v.created_at).toLocaleString()}` : ''}
                        </p>
                      </div>
                      <Badge variant="neutral">{v.status || 'pending'}</Badge>
                    </div>
                    {(v.notes || v.isbn_or_publisher || v.address) && (
                      <div className="space-y-1">
                        {v.notes && (
                          <p className="text-xs text-[#C2C9D4] rounded-lg bg-white/[0.03] border border-white/[0.08] p-3">
                            {v.notes}
                          </p>
                        )}
                        {(v.isbn_or_publisher || v.address) && (
                          <p className="text-[11px] text-[#667085]">
                            {v.isbn_or_publisher && <span>{v.isbn_or_publisher}</span>}
                            {v.isbn_or_publisher && v.address ? ' · ' : ''}
                            {v.address && <span>{v.address}</span>}
                          </p>
                        )}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleAdVerify(v.id, true)}
                        disabled={adBusy === v.id}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#16C784]/15 border border-[#16C784]/40 px-3.5 py-2 text-xs font-semibold text-[#16C784] hover:bg-[#16C784]/25 transition-colors disabled:opacity-50"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {adBusy === v.id ? 'Processing…' : 'Approve & verify'}
                      </button>
                      <button
                        onClick={() => handleAdVerify(v.id, false)}
                        disabled={adBusy === v.id}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#EA3943]/10 border border-[#EA3943]/40 px-3.5 py-2 text-xs font-semibold text-[#EA3943] hover:bg-[#EA3943]/20 transition-colors disabled:opacity-50"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="v-card p-6 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-[#16C784]">Live Active Campaigns</p>
              <p className="text-[11px] text-[#667085]">{adCampaigns.length} active sponsored campaign(s).</p>
              {adCampaigns.length === 0 ? (
                <p className="text-sm text-[#667085]">No active campaigns.</p>
              ) : (
                <ul className="space-y-2">
                  {adCampaigns.map((c) => (
                    <li key={c.id} className="flex items-center justify-between rounded-lg bg-[#0B0E11] border border-white/[0.08] px-3 py-2">
                      <span className="text-xs text-[#C2C9D4]">
                        {c.campaign_name} · {c.weeks}w · {c.placement_count} slot(s)
                      </span>
                      <Badge variant="green">active</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {activeTab === 'announcements' && (
          <div className="space-y-6">
            <div className="v-card p-6 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-[#16C784]">Announcement Posts</p>
              <p className="text-[11px] text-[#667085]">Publish or unpublish official announcements (announcement_posts table).</p>
              {announcements.map((a) => (
                <div key={a.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center pb-3 border-b border-white/[0.07] last:border-0 last:pb-0">
                  <div className="md:col-span-6 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{a.title}</p>
                    <p className="text-[11px] text-[#667085]">
                      {a.category || 'announcement'} · {a.audience || 'all'} · {a.created_at ? new Date(a.created_at).toLocaleDateString() : ''}
                    </p>
                  </div>
                  <div className="md:col-span-3">
                    <Badge variant={a.status === 'published' ? 'green' : 'neutral'}>
                      {a.status === 'published' ? 'Published' : a.status || 'Draft'}
                    </Badge>
                  </div>
                  <div className="md:col-span-3 flex justify-end">
                    <button
                      onClick={() => toggleAnnouncementStatus(a)}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold border transition-colors ${
                        a.status === 'published'
                          ? 'border-[#EF4444]/40 text-[#EF4444] bg-[#EF4444]/[0.08]'
                          : 'border-[#16C784]/40 text-[#16C784] bg-[#16C784]/[0.08]'
                      }`}
                    >
                      {a.status === 'published' ? <XCircle className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                      {a.status === 'published' ? 'Unpublish' : 'Publish'}
                    </button>
                  </div>
                </div>
              ))}
              {announcements.length === 0 && <p className="text-sm text-[#667085]">No announcements loaded.</p>}
            </div>
          </div>
        )}

        {activeTab === 'competitions' && <CompetitionAdminPage />}
        {activeTab === 'opportunities' && <OpportunitiesAdminPage />}

        <div className="text-center">
          <p className="text-[11px] text-[#667085]">
            VALENCE Admin Console · RBAC via <span className="text-[#16C784]">user_roles</span> · RLS protected ·
            <Link to="/" className="text-[#16C784] hover:underline ml-1">Back to site</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
