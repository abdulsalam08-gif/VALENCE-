import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  PLATFORM_SETTINGS,
  EXAMINATION_SESSIONS,
  ATSWA_LEVELS,
  ALL_ATSWA_COURSES,
  ATSWA_APP_REGISTRATION_GUIDE,
  ICAN_LEVELS,
  ALL_ICAN_COURSES,
  STORE_PRODUCTS,
  DELIVERY_ZONES,
  VALENCE_PILLARS,
  FEATURED_TUITION_CENTRES,
  FEATURED_TEXTBOOK_ADVERTISERS,
  MOTIVATIONAL_QUOTES,
  PAGE_TICKER_NOTICES,
  FEATURED_TUTORS,
  LATEST_OPPORTUNITIES,
  UPCOMING_EVENTS,
  ANNOUNCEMENTS_FEED,
  TESTIMONIALS,
  PLATFORM_STATISTICS,
  FAQS,
  ICAN_CANDIDATE_FAQS,
  ATSWA_ENTRY_PATHWAYS,
  GRADUATE_ENTRY_PATHWAYS,
  ICAN_REGISTRATION_PROCESS,
  ICAN_COMPLETION_TIMELINES,
  EXEMPTION_RULES,
  DISCUSSION_CATEGORIES,
  COMPETITION_DIVISIONS,
  COMPETITION_REWARD,
  COMPETITION_STRUCTURES,
  TERTIARY_DISCIPLINES,
  GENERAL_LEARNER_TRACKS,
  PROFESSIONAL_QUALIFICATIONS,
} from '../data/platformConfig';
import {
  NIGERIAN_UNIVERSITIES,
  NIGERIAN_STATES,
  GEOPOLITICAL_ZONES,
  UNIVERSITY_COUNTS,
} from '../data/nigerianUniversities';
import { calculateStoreCart } from '../lib/pricing';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  signIn as authSignIn,
  signUp as authSignUp,
  signOut as authSignOut,
  updateProfile as authUpdateProfile,
  fetchNotifications as authFetchNotifications,
  fetchPrivacySettings as authFetchPrivacy,
  updatePrivacySettings as authUpdatePrivacy,
  fetchGalleryPhotos as authFetchGallery,
} from '../lib/auth';

const PlatformContext = createContext(null);
const CART_STORAGE_KEY = 'valence_cart_v1';

// Map database store_products row to UI product model (preserving static enrichment where present)
const STATIC_PRODUCTS_BY_ID = Object.fromEntries(STORE_PRODUCTS.map((p) => [p.id, p]));

function mapStoreProductRow(row) {
  const base = STATIC_PRODUCTS_BY_ID[row.id] || {};
  const isAvailable = row.is_available !== false;
  return {
    ...base,
    id: row.id,
    title: base.title || row.title,
    category: row.category || base.category,
    categoryLabel: base.categoryLabel || row.category_label,
    programme: row.programme || base.programme,
    level: row.level_label || base.level,
    courseCode: row.course_code ?? base.courseCode ?? null,
    courseTitle: base.courseTitle || row.course_title || null,
    price: Number(row.price_ngn ?? base.price ?? 0),
    imageUrl: row.image_url ?? base.imageUrl ?? null,
    colourBadge: base.colourBadge || row.colour_badge || '',
    accentHex: base.accentHex || row.accent_hex || '#16C784',
    editionLabel: base.editionLabel || row.edition_label || '',
    discountHint: base.discountHint || row.discount_hint || '',
    description: base.description || row.description || '',
    isStudyPack: Boolean(row.is_study_pack ?? base.isStudyPack),
    isAvailable,
    availabilityStatus: row.availability_status || (isAvailable ? 'available' : 'unavailable'),
    availabilityNote:
      row.availability_note ||
      base.availabilityNote ||
      (isAvailable ? 'Available · Updated by Admin' : 'Currently Unavailable · Updated by Admin'),
    deliveryNote:
      row.delivery_note ||
      base.deliveryNote ||
      'Same-day delivery within Lagos · 1-day delivery outside Lagos',
    stockQuantity: row.stock_quantity ?? null,
    availabilityUpdatedAt: row.availability_updated_at || null,
  };
}

function mapDeliveryZoneRow(row) {
  return {
    id: row.id,
    name: row.name,
    regionType: row.region_type || 'lagos',
    fee: Number(row.fee_ngn ?? 0),
    isFree: Boolean(row.is_free),
    pqEta: row.pq_eta || 'Same-day delivery',
    studyPackEta: row.study_pack_eta || 'Delivered when available',
    eta: row.eta_summary || 'Same-day (Past Qs) · When available (Study Packs)',
  };
}

function mapSettingsRow(row) {
  if (!row) return PLATFORM_SETTINGS;
  return {
    ...PLATFORM_SETTINGS,
    brandName: row.brand_name || PLATFORM_SETTINGS.brandName,
    tagline: row.tagline || PLATFORM_SETTINGS.tagline,
    taglineTranslation: row.tagline_translation || PLATFORM_SETTINGS.taglineTranslation,
    heroHeadline: row.hero_headline || PLATFORM_SETTINGS.heroHeadline,
    heroSubcopy: row.hero_subcopy || PLATFORM_SETTINGS.heroSubcopy,
    whatsappNumber: row.whatsapp_number || PLATFORM_SETTINGS.whatsappNumber,
    whatsappChannelUrl: row.whatsapp_channel_url || PLATFORM_SETTINGS.whatsappChannelUrl,
    email: row.email || PLATFORM_SETTINGS.email,
    operatingHours: row.operating_hours || PLATFORM_SETTINGS.operatingHours,
    location: row.location || PLATFORM_SETTINGS.location,
    paymentProvider: row.payment_provider || PLATFORM_SETTINGS.paymentProvider,
    tuitionUnlockFee: Number(row.tuition_unlock_fee ?? PLATFORM_SETTINGS.tuitionUnlockFee),
    adWeeklyRate: Number(row.ad_weekly_rate ?? PLATFORM_SETTINGS.adWeeklyRate),
    atswaPastQuestionPerCourse: Number(
      row.atswa_pq_per_course ?? PLATFORM_SETTINGS.atswaPastQuestionPerCourse
    ),
    icanPastQuestionPerCourse: Number(
      row.ican_pq_per_course ?? PLATFORM_SETTINGS.icanPastQuestionPerCourse
    ),
    atswaStudyPackPrice: Number(
      row.atswa_study_pack_price ?? PLATFORM_SETTINGS.atswaStudyPackPrice
    ),
    competitionFirstPrize: Number(
      row.competition_first_prize ?? PLATFORM_SETTINGS.competitionFirstPrize
    ),
    competitionSecondPrize: Number(
      row.competition_second_prize ?? PLATFORM_SETTINGS.competitionSecondPrize
    ),
    competitionThirdPrize: Number(
      row.competition_third_prize ?? PLATFORM_SETTINGS.competitionThirdPrize
    ),
    competitionMaxCompetitorsPerSchool: Number(
      row.competition_max_competitors_per_school ??
        PLATFORM_SETTINGS.competitionMaxCompetitorsPerSchool
    ),
    resultReleaseWindowDays: Number(
      row.result_release_window_days ?? PLATFORM_SETTINGS.resultReleaseWindowDays
    ),
    registrationCutoffDaysBeforeExam: Number(
      row.registration_cutoff_days ?? PLATFORM_SETTINGS.registrationCutoffDaysBeforeExam
    ),
    centralScheduleAuthority:
      row.central_schedule_authority || PLATFORM_SETTINGS.centralScheduleAuthority,
    officialLinks: {
      ...PLATFORM_SETTINGS.officialLinks,
      ...(row.official_links || {}),
    },
    socialLinks: {
      ...PLATFORM_SETTINGS.socialLinks,
      ...(row.social_links || {}),
    },
    tickerSecondsPerChar: Number(row.ticker_seconds_per_char ?? 0.24),
  };
}

function mergePageTickerRows(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return PAGE_TICKER_NOTICES;
  const grouped = {};
  for (const r of rows) {
    if (!grouped[r.page_key]) {
      grouped[r.page_key] = {
        label: r.badge_label || PAGE_TICKER_NOTICES[r.page_key]?.label || 'Live Update',
        items: [],
      };
    }
    grouped[r.page_key].items.push({
      id: r.notice_key || r.id,
      tag: r.tag || 'Update',
      text: r.message,
      linkUrl: r.link_url || null,
    });
  }
  return { ...PAGE_TICKER_NOTICES, ...grouped };
}

function mapAnnouncementRow(row) {
  return {
    id: row.slug || row.id,
    dbId: row.id,
    authorName: row.author_display_name,
    authorCategory: row.author_category_label,
    verifiedBadge: row.verified_badge_label || null,
    isOfficial: Boolean(row.is_official),
    pinned: Boolean(row.is_pinned),
    category: row.category || 'General',
    audience: row.audience_label || 'Public · All Candidates',
    audienceScope: row.audience_scope || 'public',
    title: row.title,
    content: row.content,
    timestamp: row.published_at
      ? new Date(row.published_at).toLocaleDateString('en-NG', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      : 'Live Notice',
    likes: Number(row.like_count ?? 0),
    comments: Number(row.comment_count ?? 0),
    reposts: Number(row.repost_count ?? 0),
  };
}

function computeInstitutionCounts(list) {
  let federal = 0;
  let state = 0;
  let priv = 0;
  let polytechnics = 0;
  let colleges = 0;
  for (const item of list) {
    if (item.category === 'Federal') federal += 1;
    else if (item.category === 'State') state += 1;
    else if (item.category === 'Private') priv += 1;
    else if (item.category === 'Polytechnic') polytechnics += 1;
    else if (item.category === 'College') colleges += 1;
  }
  return {
    total: list.length,
    universities: federal + state + priv,
    federal,
    state,
    private: priv,
    polytechnics,
    colleges,
  };
}

export function PlatformProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [adminRoles, setAdminRoles] = useState([]);
  const [unlockedLevelIds, setUnlockedLevelIds] = useState([]);
  const [unlockedCentreFees, setUnlockedCentreFees] = useState([]);
  const [isHydrating, setIsHydrating] = useState(true);
  const [dbStatus, setDbStatus] = useState(isSupabaseConfigured ? 'connecting' : 'local');

  // Live Supabase-hydrated platform collections (seeded with exact Phase 1 baseline for instant render)
  const [liveSettings, setLiveSettings] = useState(() => PLATFORM_SETTINGS);
  const [catalogProducts, setCatalogProducts] = useState(() => STORE_PRODUCTS);
  const [liveDeliveryZones, setLiveDeliveryZones] = useState(() => DELIVERY_ZONES);
  const [liveQuotes, setLiveQuotes] = useState(() => MOTIVATIONAL_QUOTES);
  const [livePageTickers, setLivePageTickers] = useState(() => PAGE_TICKER_NOTICES);
  const [liveCentres, setLiveCentres] = useState(() => FEATURED_TUITION_CENTRES);
  const [liveTextbookAdvertisers, setLiveTextbookAdvertisers] = useState(
    () => FEATURED_TEXTBOOK_ADVERTISERS
  );
  const [liveTutors, setLiveTutors] = useState(() => FEATURED_TUTORS);
  const [liveOpportunities, setLiveOpportunities] = useState(() => LATEST_OPPORTUNITIES);
  const [liveEvents, setLiveEvents] = useState(() => UPCOMING_EVENTS);
  const [liveAnnouncements, setLiveAnnouncements] = useState(() => ANNOUNCEMENTS_FEED);
  const [liveFaqs, setLiveFaqs] = useState(() => FAQS);
  const [liveCandidateFaqs, setLiveCandidateFaqs] = useState(() => ICAN_CANDIDATE_FAQS);
  const [liveUniversities, setLiveUniversities] = useState(() => NIGERIAN_UNIVERSITIES);
  const [liveUniversityCounts, setLiveUniversityCounts] = useState(() => UNIVERSITY_COUNTS);

  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      const validIds = new Set(STORE_PRODUCTS.map((p) => p.id));
      return Array.isArray(parsed) ? parsed.filter((item) => validIds.has(item.id)) : [];
    } catch {
      return [];
    }
  });
  const [selectedZoneId, setSelectedZoneId] = useState(DELIVERY_ZONES[0].id);
  const [inAppTickets, setInAppTickets] = useState([]);

  const [whatsAppModal, setWhatsAppModal] = useState({
    open: false,
    category: 'General Support Enquiry',
    programme: '',
    level: '',
  });

  // Hydrate authenticated user profile, RBAC roles & server-verified level cost unlocks
  const hydrateAuthenticatedUser = useCallback(async (authUser) => {
    if (!supabase || !authUser) {
      setUser(null);
      setProfile(null);
      setUserRole(null);
      setAdminRoles([]);
      setUnlockedLevelIds([]);
      setUnlockedCentreFees([]);
      return;
    }
    setUser(authUser);
    const [profileRes, rolesRes, unlocksRes, centreFeesRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', authUser.id).maybeSingle(),
      supabase
        .from('admin_role_assignments')
        .select('role')
        .eq('user_id', authUser.id)
        .eq('is_active', true),
      supabase.from('student_fee_unlocks').select('level_id').eq('user_id', authUser.id),
      supabase
        .from('tuition_centre_fee_schedules')
        .select('*, tuition_centres(name, location_label, state)')
        .eq('is_verified', true),
    ]);

    if (profileRes.data) {
      setProfile(profileRes.data);
      setUserRole(profileRes.data.account_type);
    }
    if (Array.isArray(rolesRes.data)) {
      const roles = rolesRes.data.map((r) => r.role);
      setAdminRoles(roles);
      if (roles.length > 0) setUserRole('admin');
    }
    if (Array.isArray(unlocksRes.data)) {
      setUnlockedLevelIds(unlocksRes.data.map((u) => u.level_id));
    }
    if (Array.isArray(centreFeesRes.data)) {
      setUnlockedCentreFees(centreFeesRes.data);
    }
  }, []);

  // Hydrate live public reference & CMS tables from Supabase
  const refreshPublicData = useCallback(async () => {
    if (!supabase) {
      setIsHydrating(false);
      return;
    }
    try {
      const [
        settingsRes,
        productsRes,
        zonesRes,
        quotesRes,
        tickersRes,
        centresRes,
        booksRes,
        tutorsRes,
        oppsRes,
        eventsRes,
        annRes,
        faqsRes,
        instRes,
      ] = await Promise.all([
        supabase.from('platform_settings').select('*').eq('id', 1).maybeSingle(),
        supabase
          .from('store_products')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true }),
        supabase
          .from('delivery_zones')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true }),
        supabase
          .from('motivational_quotes')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true }),
        supabase
          .from('page_ticker_notices')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true }),
        supabase
          .from('tuition_centres')
          .select('*')
          .eq('is_active', true)
          .eq('is_verified', true)
          .order('is_sponsored', { ascending: false }),
        supabase
          .from('textbook_advertisers')
          .select('*')
          .eq('is_active', true)
          .eq('is_verified', true)
          .order('is_sponsored', { ascending: false }),
        supabase
          .from('verified_tutor_profiles')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: true }),
        supabase
          .from('opportunities')
          .select('*')
          .eq('is_published', true)
          .order('published_at', { ascending: false }),
        supabase
          .from('platform_events')
          .select('*')
          .eq('is_published', true)
          .order('sort_order', { ascending: true }),
        supabase
          .from('announcements')
          .select('*')
          .eq('is_draft', false)
          .eq('is_hidden', false)
          .order('is_pinned', { ascending: false })
          .order('published_at', { ascending: false })
          .limit(30),
        supabase
          .from('platform_faqs')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true }),
        supabase
          .from('nigerian_institutions')
          .select('id, name, short_name, category, type_label, state, zone')
          .eq('is_active', true)
          .order('name', { ascending: true }),
      ]);

      if (settingsRes.data) setLiveSettings(mapSettingsRow(settingsRes.data));

      if (Array.isArray(productsRes.data) && productsRes.data.length > 0) {
        const mapped = productsRes.data.map(mapStoreProductRow);
        setCatalogProducts(mapped);
        // Automatically drop any Study Packs that Admin marked unavailable while in cart
        const unavailable = new Set(mapped.filter((p) => !p.isAvailable).map((p) => p.id));
        if (unavailable.size > 0) {
          setCart((prev) => prev.filter((item) => !unavailable.has(item.id)));
        }
      }

      if (Array.isArray(zonesRes.data) && zonesRes.data.length > 0) {
        setLiveDeliveryZones(zonesRes.data.map(mapDeliveryZoneRow));
      }

      if (Array.isArray(quotesRes.data) && quotesRes.data.length > 0) {
        setLiveQuotes(
          quotesRes.data.map((q) => ({
            id: q.quote_key || q.id,
            quote: q.quote,
            author: q.author || '',
            category: q.category || 'Life & Wisdom',
          }))
        );
      }

      if (Array.isArray(tickersRes.data) && tickersRes.data.length > 0) {
        // Keep full Phase 1 route notices intact and blend any live Admin notices seamlessly
        const merged = { ...PAGE_TICKER_NOTICES };
        const byPage = mergePageTickerRows(tickersRes.data);
        for (const [key, cfg] of Object.entries(byPage)) {
          const existing = PAGE_TICKER_NOTICES[key];
          if (!existing) {
            merged[key] = cfg;
          } else if (cfg.items.length >= existing.items.length) {
            merged[key] = cfg;
          }
        }
        setLivePageTickers(merged);
      }

      if (Array.isArray(centresRes.data)) {
        setLiveCentres(
          centresRes.data.map((c) => ({
            id: c.id,
            name: c.name,
            streetAddress: c.street_address,
            location: c.location_label,
            state: c.state,
            programmes: c.programmes || [],
            subjects: c.subjects || [],
            mode: c.delivery_mode || 'Physical Tuition Only',
            schedule: c.schedule_label,
            description: c.description,
            verified: Boolean(c.is_verified),
            sponsored: Boolean(c.is_sponsored),
            adLabel: c.ad_label || 'Sponsored',
          }))
        );
      }

      if (Array.isArray(booksRes.data)) {
        setLiveTextbookAdvertisers(
          booksRes.data.map((b) => ({
            id: b.id,
            type: b.partner_type,
            name: b.name,
            title: b.book_or_catalogue_title,
            isbnOrEdition: b.isbn_or_edition,
            location: b.location_label,
            state: b.state,
            programmes: b.programmes || [],
            subjects: b.subjects || [],
            description: b.description,
            coverUrl: b.cover_url,
            price: b.price_ngn ? Number(b.price_ngn) : null,
            deliveryFee: Number(b.delivery_fee_ngn ?? 0),
            inAppCheckout: Boolean(b.in_app_checkout_enabled),
            isAvailable: b.is_available !== false,
            verified: Boolean(b.is_verified),
            sponsored: Boolean(b.is_sponsored),
            adLabel: b.ad_label || 'Sponsored',
          }))
        );
      }

      if (Array.isArray(tutorsRes.data)) {
        setLiveTutors(
          tutorsRes.data.map((t) => ({
            id: t.id,
            name: t.display_name,
            initials: t.initials,
            tier: t.tier_label,
            credentials: t.verified_credentials || [],
            courses: t.course_codes || [],
            bio: t.bio,
            avatarUrl: t.avatar_url || null,
          }))
        );
      }

      if (Array.isArray(oppsRes.data)) {
        setLiveOpportunities(
          oppsRes.data.map((o) => ({
            id: o.id,
            title: o.title,
            organisation: o.organisation,
            location: o.location || 'Nigeria',
            category: o.category,
            eligibility: o.eligibility,
            description: o.description || '',
            applyUrl: o.apply_url || null,
            deadline: o.deadline
              ? new Date(o.deadline).toLocaleDateString('en-NG', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              : 'Rolling',
            verified: true,
          }))
        );
      }

      if (Array.isArray(eventsRes.data) && eventsRes.data.length > 0) {
        setLiveEvents(
          eventsRes.data.map((e) => ({
            id: e.id,
            type: e.event_type,
            programme: e.programme_label,
            title: e.title,
            date: e.date_label,
            mode: e.mode_label,
            access: e.access_label,
          }))
        );
      }

      if (Array.isArray(annRes.data) && annRes.data.length > 0) {
        setLiveAnnouncements(annRes.data.map(mapAnnouncementRow));
      }

      if (Array.isArray(faqsRes.data) && faqsRes.data.length > 0) {
        const gen = faqsRes.data
          .filter((f) => f.faq_group !== 'ican_candidate')
          .map((f) => ({ q: f.question, a: f.answer }));
        const cand = faqsRes.data
          .filter((f) => f.faq_group === 'ican_candidate')
          .map((f, idx) => ({ num: idx + 1, q: f.question, a: f.answer }));
        if (gen.length >= FAQS.length) setLiveFaqs(gen);
        if (cand.length >= ICAN_CANDIDATE_FAQS.length) setLiveCandidateFaqs(cand);
      }

      if (Array.isArray(instRes.data) && instRes.data.length > 0) {
        const mappedInst = instRes.data.map((i) => ({
          id: i.id,
          name: i.name,
          shortName: i.short_name,
          category: i.category,
          typeLabel: i.type_label,
          state: i.state,
          zone: i.zone,
        }));
        setLiveUniversities(mappedInst);
        setLiveUniversityCounts(computeInstitutionCounts(mappedInst));
      }

      if (!settingsRes.error && !productsRes.error) {
        setDbStatus('connected');
      } else {
        setDbStatus('fallback');
      }
    } catch {
      setDbStatus('fallback');
    } finally {
      setIsHydrating(false);
    }
  }, []);

  // Initial session hydration, public data fetch & Realtime subscriptions
  useEffect(() => {
    if (!supabase) {
      const t = setTimeout(() => setIsHydrating(false), 180);
      return () => clearTimeout(t);
    }

    refreshPublicData();

    supabase.auth.getSession().then(({ data }) => {
      if (data?.session?.user) {
        hydrateAuthenticatedUser(data.session.user);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      hydrateAuthenticatedUser(session?.user || null);
    });

    // Live Realtime channel: Admin Study Pack availability toggles, ticker updates & platform settings
    const channel = supabase
      .channel('valence-live-sync')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'store_products' },
        (payload) => {
          if (!payload.new) return;
          const updated = mapStoreProductRow(payload.new);
          setCatalogProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
          if (!updated.isAvailable) {
            setCart((prev) => prev.filter((item) => item.id !== updated.id));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'platform_settings' },
        (payload) => {
          if (payload.new) setLiveSettings(mapSettingsRow(payload.new));
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'page_ticker_notices' },
        async () => {
          const { data } = await supabase
            .from('page_ticker_notices')
            .select('*')
            .eq('is_active', true)
            .order('sort_order', { ascending: true });
          if (Array.isArray(data) && data.length > 0) {
            setLivePageTickers(mergePageTickerRows(data));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'announcements' },
        (payload) => {
          if (payload.new && !payload.new.is_draft && !payload.new.is_hidden) {
            setLiveAnnouncements((prev) => [mapAnnouncementRow(payload.new), ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      authListener?.subscription?.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [hydrateAuthenticatedUser, refreshPublicData]);

  // Admin live Study Pack availability updater (optimistic UI + persistent Supabase write for store_admin)
  const updateProductAvailability = useCallback(async (productId, isAvailable, customNote = '') => {
    const nextStatus = isAvailable ? 'available' : 'unavailable';
    const nextNote =
      customNote ||
      (isAvailable ? 'Available · Updated by Admin' : 'Currently Unavailable · Updated by Admin');

    setCatalogProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              isAvailable: Boolean(isAvailable),
              availabilityStatus: nextStatus,
              availabilityNote: nextNote,
            }
          : p
      )
    );
    if (!isAvailable) {
      setCart((prev) => prev.filter((item) => item.id !== productId));
    }

    if (supabase) {
      const { error } = await supabase
        .from('store_products')
        .update({
          is_available: Boolean(isAvailable),
          availability_status: nextStatus,
          availability_note: nextNote,
          availability_updated_at: new Date().toISOString(),
        })
        .eq('id', productId);
      return { persisted: !error, error: error?.message || null };
    }
    return { persisted: false, error: null };
  }, []);

  // Persist in-app tickets & partner/store/ATSWA/ad requests directly to RLS-protected Supabase tables
  const submitInAppTicket = useCallback(
    (type, payload) => {
      const cleanType = String(type || 'SUP')
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '');
      const ref = `VAL-${cleanType}-${String(Date.now()).slice(-6)}`;
      const record = {
        id: ref,
        type,
        status: 'Submitted · Pending Admin Review',
        persisted: false,
        createdAt: new Date().toISOString(),
        ...payload,
      };
      setInAppTickets((prev) => [record, ...prev]);

      if (supabase) {
        const uid = user?.id || null;
        let dbOp = null;

        if (type === 'support') {
          dbOp = supabase.from('support_tickets').insert({
            ticket_ref: ref,
            user_id: uid,
            full_name: (payload.fullName || 'VALENCE Visitor').trim(),
            email: (payload.email || '').trim(),
            phone: (payload.phone || '').trim() || null,
            category: payload.category || 'General Support',
            message: (payload.message || '').trim(),
          });
        } else if (type === 'atswa') {
          dbOp = supabase.from('atswa_guidance_requests').insert({
            ticket_ref: ref,
            user_id: uid,
            full_name: (payload.fullName || 'ATSWA Candidate').trim(),
            email: (payload.email || '').trim(),
            target_level: payload.level || 'ATS 1',
            qualification_background: payload.entryQualification || 'O-Level Result',
            documents_ready: Array.isArray(payload.readyDocuments) ? payload.readyDocuments : [],
            question_or_note: (payload.question || '').trim() || null,
          });
        } else if (type === 'store') {
          const isRestock = String(payload.topic || '')
            .toLowerCase()
            .includes('study pack availability');
          dbOp = supabase.from('store_material_enquiries').insert({
            ticket_ref: ref,
            user_id: uid,
            full_name: (payload.fullName || 'VALENCE Candidate').trim(),
            email: (payload.email || '').trim(),
            topic: payload.topic || 'Store Material Enquiry',
            material_or_course: (payload.materialOrCourse || 'General Store').trim(),
            delivery_zone_id: payload.zoneId || null,
            delivery_zone_name: payload.zoneName || null,
            message: (payload.message || '').trim(),
            notify_on_restock: isRestock,
          });
        } else if (type === 'book-enq') {
          const isCentre = String(payload.partnerType || '').toLowerCase().includes('centre');
          dbOp = supabase.from('partner_enquiries').insert({
            enquiry_ref: ref,
            student_user_id: uid,
            centre_id: isCentre && payload.partnerId ? payload.partnerId : null,
            textbook_advertiser_id: !isCentre && payload.partnerId ? payload.partnerId : null,
            partner_name: payload.partnerName || 'Verified Partner',
            partner_type: payload.partnerType || 'Textbook Vendor',
            book_title: payload.bookTitle || null,
            student_name: (payload.studentName || 'VALENCE Student').trim(),
            student_email: (payload.studentEmail || '').trim(),
            quantity: Number(payload.quantity) || 1,
            delivery_location: (payload.deliveryLocation || 'Nigeria').trim(),
            message: (payload.message || '').trim(),
          });
        } else if (type === 'advertise') {
          const catStr = String(payload.advertiserCategory || '').toLowerCase();
          const enumCat = catStr.includes('author')
            ? 'textbook_author'
            : catStr.includes('vendor') || catStr.includes('bookshop')
            ? 'textbook_vendor'
            : 'physical_centre';
          dbOp = supabase.from('ad_campaigns').insert({
            campaign_ref: ref,
            user_id: uid,
            advertiser_category: enumCat,
            entity_name: (payload.entityName || 'Applicant Partner').trim(),
            contact_email: (payload.contactEmail || '').trim(),
            contact_phone: (payload.contactPhone || '').trim() || null,
            city_state: (payload.cityState || 'Lagos').trim(),
            venue_or_coverage: (payload.streetOrCoverage || 'Physical Location').trim(),
            schedule_or_delivery: payload.bookTitlesOrSchedule || null,
            centre_cost_implication_text: payload.centreCostImplication || null,
            isbn_or_publisher: payload.isbnOrPublisher || null,
            student_purchase_mode: payload.studentPurchaseMode || null,
            headline: (payload.headline || payload.entityName || 'Partner Campaign').trim(),
            body_copy: payload.notes || null,
            duration_weeks: Math.max(1, Math.min(52, Number(payload.weeks) || 1)),
            weekly_rate_ngn: Number(payload.weeklyRate) || 10000,
            total_amount_ngn: Number(payload.totalAmount) || 10000,
            payment_status: 'pending',
            status: 'pending_review',
          });
        }

        if (dbOp) {
          dbOp.then(({ error }) => {
            if (!error) {
              setInAppTickets((prev) =>
                prev.map((t) =>
                  t.id === ref
                    ? { ...t, persisted: true, status: 'Saved in VALENCE · Pending Admin Review' }
                    : t
                )
              );
            }
          });
        }
      }

      return record;
    },
    [user]
  );

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // ignore storage quota errors
    }
  }, [cart]);

  // Phase 3: Auth state
  const [privacySettings, setPrivacySettings] = useState(null);
  const [userNotifications, setUserNotifications] = useState([]);

  const refreshUserData = useCallback(async (uid) => {
    if (!supabase || !uid) return;
    const [privacyRes, notifRes] = await Promise.all([
      authFetchPrivacy(),
      authFetchNotifications(),
    ]);
    if (privacyRes.data) setPrivacySettings(privacyRes.data);
    if (Array.isArray(notifRes.data)) setUserNotifications(notifRes.data);
  }, []);

  const handleSignIn = useCallback(async (email, password) => {
    const result = await authSignIn(email, password);
    if (result.error) return { error: result.error };
    if (result.data?.user) {
      await hydrateAuthenticatedUser(result.data.user);
      await refreshUserData(result.data.user.id);
    }
    return { error: null };
  }, [hydrateAuthenticatedUser, refreshUserData]);

  const handleSignUp = useCallback(
    async (payload) => {
      const result = await authSignUp(payload);
      if (result.error) return { error: result.error };
      if (result.data?.user) {
        // Auto-sign in after registration
        await supabase.auth.signInWithPassword({ email: payload.email, password: payload.password }).catch(() => {});
      }
      return { error: null };
    },
    []
  );

  const handleSignOut = useCallback(async () => {
    await authSignOut();
    setUser(null);
    setProfile(null);
    setUserRole(null);
    setAdminRoles([]);
    setUnlockedLevelIds([]);
    setUnlockedCentreFees([]);
    setUserNotifications([]);
    setPrivacySettings(null);
  }, []);

  const handleUpdateProfile = useCallback(
    async (updates) => {
      const result = await authUpdateProfile(updates);
      if (result.data && profile) {
        setProfile({ ...profile, ...result.data });
      }
      return result;
    },
    [profile]
  );

  const isLevelUnlocked = (levelKey) => unlockedLevelIds.includes(levelKey);

  const addToCart = (product, qty = 1) => {
    if (product.isAvailable === false) return false;
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });
    return true;
  };

  const updateCartQty = (productId, nextQty) => {
    if (nextQty <= 0) {
      setCart((prev) => prev.filter((i) => i.id !== productId));
    } else {
      setCart((prev) =>
        prev.map((i) => (i.id === productId ? { ...i, quantity: Math.min(50, nextQty) } : i))
      );
    }
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((i) => i.id !== productId));
  };

  const clearCart = () => setCart([]);

  const selectedZone = useMemo(
    () =>
      liveDeliveryZones.find((z) => z.id === selectedZoneId) ||
      liveDeliveryZones[0] ||
      DELIVERY_ZONES[0],
    [liveDeliveryZones, selectedZoneId]
  );

  const cartSummary = useMemo(
    () => calculateStoreCart(cart, selectedZone),
    [cart, selectedZone]
  );

  const openWhatsAppModal = (preset = {}) => {
    setWhatsAppModal({
      open: true,
      category: preset.category || 'General Support Enquiry',
      programme: preset.programme || '',
      level: preset.level || '',
    });
  };

  const closeWhatsAppModal = () => {
    setWhatsAppModal((prev) => ({ ...prev, open: false }));
  };

  const value = {
    user,
    setUser,
    profile,
    userRole,
    setUserRole,
    adminRoles,
    unlockedLevelIds,
    setUnlockedLevelIds,
    unlockedCentreFees,
    isLevelUnlocked,
    isHydrating,
    dbStatus,
    refreshPublicData,
    settings: liveSettings,
    sessions: EXAMINATION_SESSIONS,
    atswaLevels: ATSWA_LEVELS,
    allAtswaCourses: ALL_ATSWA_COURSES,
    atswaRegistrationGuide: ATSWA_APP_REGISTRATION_GUIDE,
    icanLevels: ICAN_LEVELS,
    allIcanCourses: ALL_ICAN_COURSES,
    products: catalogProducts,
    updateProductAvailability,
    deliveryZones: liveDeliveryZones,
    pillars: VALENCE_PILLARS,
    tuitionCentres: liveCentres,
    textbookAdvertisers: liveTextbookAdvertisers,
    motivationalQuotes: liveQuotes,
    pageTickerNotices: livePageTickers,
    tutors: liveTutors,
    opportunities: liveOpportunities,
    events: liveEvents,
    announcements: liveAnnouncements,
    testimonials: TESTIMONIALS,
    statistics: PLATFORM_STATISTICS,
    faqs: liveFaqs,
    candidateFaqs: liveCandidateFaqs,
    atswaEntryPathways: ATSWA_ENTRY_PATHWAYS,
    graduateEntryPathways: GRADUATE_ENTRY_PATHWAYS,
    icanRegistrationProcess: ICAN_REGISTRATION_PROCESS,
    completionTimelines: ICAN_COMPLETION_TIMELINES,
    exemptionRules: EXEMPTION_RULES,
    discussionCategories: DISCUSSION_CATEGORIES,
    competitionDivisions: COMPETITION_DIVISIONS,
    competitionReward: {
      ...COMPETITION_REWARD,
      amount: liveSettings.competitionFirstPrize,
      firstPrize: liveSettings.competitionFirstPrize,
      secondPrize: liveSettings.competitionSecondPrize,
      thirdPrize: liveSettings.competitionThirdPrize,
      totalPodiumPool:
        liveSettings.competitionFirstPrize +
        liveSettings.competitionSecondPrize +
        liveSettings.competitionThirdPrize,
      maxCompetitorsPerSchool: liveSettings.competitionMaxCompetitorsPerSchool,
    },
    competitionStructures: COMPETITION_STRUCTURES,
    tertiaryDisciplines: TERTIARY_DISCIPLINES,
    generalLearnerTracks: GENERAL_LEARNER_TRACKS,
    professionalQualifications: PROFESSIONAL_QUALIFICATIONS,
    universities: liveUniversities,
    nigerianStates: NIGERIAN_STATES,
    geopoliticalZones: GEOPOLITICAL_ZONES,
    universityCounts: liveUniversityCounts,
    cart,
    addToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
    selectedZoneId,
    setSelectedZoneId,
    selectedZone,
    cartSummary,
    whatsAppModal,
    openWhatsAppModal,
    closeWhatsAppModal,
    inAppTickets,
    submitInAppTicket,
    // Phase 3 auth
    handleSignIn,
    handleSignUp,
    handleSignOut,
    handleUpdateProfile,
    refreshUserData,
    privacySettings,
    setPrivacySettings,
    userNotifications,
    setUserNotifications,
  };

  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>;
}

export function usePlatform() {
  const ctx = useContext(PlatformContext);
  if (!ctx) throw new Error('usePlatform must be used within PlatformProvider');
  return ctx;
}
