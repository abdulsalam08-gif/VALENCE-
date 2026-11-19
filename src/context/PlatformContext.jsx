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
import { formatReadableDate } from '../lib/examSchedule';
import {
  signIn as authSignIn,
  signUp as authSignUp,
  signOut as authSignOut,
  updateProfile as authUpdateProfile,
  fetchNotifications as authFetchNotifications,
  fetchPrivacySettings as authFetchPrivacy,
  updatePrivacySettings as authUpdatePrivacy,
  fetchGalleryPhotos as authFetchGallery,
  unlockLevel as authUnlockLevel,
  fetchAtswaDocuments as authFetchAtswaDocuments,
  submitAtswaGuidanceRequest as authSubmitAtswaGuidance,
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

  // Phase 4: Live exam sessions, timetables, exemption rules & ATSWA documents
  const [liveExamSessions, setLiveExamSessions] = useState(() => EXAMINATION_SESSIONS);
  const [liveExamTimetables, setLiveExamTimetables] = useState({});
  const [liveExemptionRules, setLiveExemptionRules] = useState(() => EXEMPTION_RULES);
  const [atswaDocuments, setAtswaDocuments] = useState([]);

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
    // Get profile_id from profiles (keyed by user_id in new schema)
    const profileRes = await supabase
      .from('profiles')
      .select('id, user_category, account_type')
      .eq('user_id', authUser.id)
      .maybeSingle();

    const profileId = profileRes.data?.id;

    const [rolesRes, unlocksRes, centreFeesRes] = await Promise.all([
      // RBAC roles from user_roles table
      supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', authUser.id),
      // Level unlocks — need profile_id in new schema
      profileId
        ? supabase
            .from('student_fee_unlocks')
            .select('examination_level_id')
            .eq('profile_id', profileId)
        : Promise.resolve({ data: [], error: null }),
      // Centre fee schedules from advertisers (verified tuition centres)
      supabase
        .from('advertisers')
        .select('centre_name, areas_of_specialisation, programmes_offered')
        .eq('verification_status', 'verified'),
    ]);

    if (profileRes.data) {
      const fullProfile = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', authUser.id)
        .maybeSingle();
      if (fullProfile.data) {
        setProfile(fullProfile.data);
        setUserRole(fullProfile.data.account_type);
      }
    }
    if (Array.isArray(rolesRes.data)) {
      const roles = rolesRes.data.map((r) => r.role);
      setAdminRoles(roles);
      if (roles.length > 0) setUserRole('admin');
    }
    if (Array.isArray(unlocksRes.data)) {
      setUnlockedLevelIds(unlocksRes.data.map((u) => u.examination_level_id));
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
        oppsRes,
        instRes,
        annRes,
        eventsRes,
        exemptionRes,
      ] = await Promise.all([
        // platform_settings: key-value store (all rows)
        supabase.from('platform_settings').select('*'),
        // products (spec section 25) — join with product_prices for pricing
        supabase
          .from('products')
          .select('*, product_prices(price_ngn, currency)')
          .order('name', { ascending: true }),
        // delivery_zones (spec section 25)
        supabase
          .from('delivery_zones')
          .select('*')
          .order('name', { ascending: true }),
        // opportunities (spec section 25)
        supabase
          .from('opportunities')
          .select('*')
          .eq('status', 'published')
          .order('published_at', { ascending: false }),
        // institutions (spec section 25)
        supabase
          .from('institutions')
          .select('id, name, type, location')
          .order('name', { ascending: true }),
        // announcement_posts (spec section 25)
        supabase
          .from('announcement_posts')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false })
          .limit(30),
        // professional_events (spec section 25)
        supabase
          .from('professional_events')
          .select('*')
          .eq('status', 'published')
          .order('event_date', { ascending: true }),
        // exemption_guidelines (spec section 25)
        supabase
          .from('exemption_guidelines')
          .select('*')
          .order('title', { ascending: true }),
      ]);

      // Settings: build from key-value rows
      if (Array.isArray(settingsRes.data) && settingsRes.data.length > 0) {
        const settingsMap = {};
        settingsRes.data.forEach((row) => {
          settingsMap[row.setting_key] = row.setting_value;
        });
        setLiveSettings({ ...PLATFORM_SETTINGS, ...settingsMap });
      }

      // Products: merge spec-schema DB rows with the local catalogue metadata
      // (category, courseCode, level, programme, discount hints, etc.) by matching name === title
      if (Array.isArray(productsRes.data) && productsRes.data.length > 0) {
        const localByTitle = new Map(STORE_PRODUCTS.map((p) => [p.title, p]));
        const mapped = productsRes.data
          .map((p) => {
            const price = Array.isArray(p.product_prices) && p.product_prices.length > 0
              ? p.product_prices[0].price_ngn
              : 0;
            const local = localByTitle.get(p.name);
            if (!local) return null; // keep local catalogue authoritative
            return {
              ...local,
              dbId: p.id,
              name: p.name,
              description: p.description || local.description,
              productType: p.product_type,
              courseId: p.course_id,
              imageUrl: p.image_url || local.imageUrl,
              isAvailable: p.is_available,
              availabilityNote: p.availability_note || '',
              price: price || local.price,
            };
          })
          .filter(Boolean);
        setCatalogProducts(mapped);
        // Automatically drop any Study Packs that Admin marked unavailable while in cart
        const unavailable = new Set(mapped.filter((p) => !p.isAvailable).map((p) => p.id));
        if (unavailable.size > 0) {
          setCart((prev) => prev.filter((item) => !unavailable.has(item.id)));
        }
      }

      // Delivery zones: merge spec-schema DB rows with the local zone metadata by name
      if (Array.isArray(zonesRes.data) && zonesRes.data.length > 0) {
        const localZones = new Map(DELIVERY_ZONES.map((z) => [z.name, z]));
        const merged = zonesRes.data
          .map((z) => {
            const local = localZones.get(z.name);
            if (!local) return null;
            return {
              ...local,
              dbId: z.id,
              name: z.name,
              fee: z.fee_ngn,
              feeNgn: z.fee_ngn,
              isFree: z.is_free,
            };
          })
          .filter(Boolean);
        setLiveDeliveryZones(merged);
      }

      // Opportunities: map from spec schema
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
            applyUrl: o.application_link || null,
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

      // Institutions: map from spec schema
      if (Array.isArray(instRes.data) && instRes.data.length > 0) {
        const mappedInst = instRes.data.map((i) => ({
          id: i.id,
          name: i.name,
          shortName: i.name.split(' ').slice(0, 3).join(' '),
          category: i.type,
          typeLabel: i.type,
          state: i.location || '',
          zone: '',
        }));
        setLiveUniversities(mappedInst);
        setLiveUniversityCounts(computeInstitutionCounts(mappedInst));
      }

      // Announcements: map from spec schema
      if (Array.isArray(annRes.data) && annRes.data.length > 0) {
        setLiveAnnouncements(
          annRes.data.map((a) => ({
            id: a.id,
            title: a.title,
            content: a.content,
            category: a.category || 'General',
            isOfficial: a.is_official,
            profileName: 'VALENCE',
            avatarUrl: null,
            createdAt: a.created_at,
            likes: 0,
            comments: 0,
          }))
        );
      }

      // Professional events: map from spec schema
      if (Array.isArray(eventsRes.data) && eventsRes.data.length > 0) {
        setLiveEvents(
          eventsRes.data.map((e) => ({
            id: e.id,
            type: e.event_type,
            title: e.title,
            date: e.event_date
              ? new Date(e.event_date).toLocaleDateString('en-NG', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              : 'TBA',
            mode: e.venue || 'TBA',
            access: e.meeting_link ? 'Online' : 'Physical',
          }))
        );
      }

      // Exemption guidelines: map from spec schema
      if (Array.isArray(exemptionRes.data) && exemptionRes.data.length > 0) {
        setLiveExemptionRules(
          exemptionRes.data.map((e) => ({
            id: e.id,
            title: e.title,
            description: e.description || '',
            conditions: e.conditions || '',
            guidance: e.guidance || '',
          }))
        );
      }

      // Phase 16: FAQs are DB-backed via the faqs table (fetch_faqs RPC, public read).
      // Map DB rows {question, answer, category, sort_order} to the UI {q, a, num} shape
      // expected by HomePage/ContactPage; fall back to static FAQS on any error.
      try {
        const { data: faqsData, error: faqsError } = await supabase.rpc('fetch_faqs', {
          p_category: null,
        });
        if (!faqsError && Array.isArray(faqsData) && faqsData.length > 0) {
          setLiveFaqs(
            faqsData.map((f, i) => ({
              id: f.id,
              q: f.question,
              a: f.answer,
              num: f.sort_order || i + 1,
              category: f.category,
            }))
          );
        }
      } catch (faqErr) {
        // keep static FAQS fallback
      }

      // Non-spec tables (motivational quotes, page tickers, tuition centres,
      // textbook advertisers, tutors) are not in the spec's section 25 database
      // architecture. These use local seed data from platformConfig.js as the
      // source of truth and will be migrated to spec tables in later phases.
    } catch (err) {
      // Gracefully fall back to local seed data on any DB error
      console.warn('refreshPublicData error, using local fallback:', err);
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

    // Live Realtime channel: Admin product availability toggles, settings updates & announcement inserts
    const channel = supabase
      .channel('valence-live-sync')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'products' },
        (payload) => {
          if (!payload.new) return;
          const updated = {
            id: payload.new.id,
            name: payload.new.name,
            description: payload.new.description || '',
            productType: payload.new.product_type,
            courseId: payload.new.course_id,
            imageUrl: payload.new.image_url || null,
            isAvailable: payload.new.is_available,
            availabilityNote: payload.new.availability_note || '',
            priceNgn: 0,
          };
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
          if (payload.new) {
            const settingsMap = {};
            settingsMap[payload.new.setting_key] = payload.new.setting_value;
            setLiveSettings((prev) => ({ ...prev, ...settingsMap }));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'announcement_posts' },
        (payload) => {
          if (payload.new && payload.new.status === 'published') {
            setLiveAnnouncements((prev) => [
              {
                id: payload.new.id,
                title: payload.new.title,
                content: payload.new.content,
                category: payload.new.category || 'General',
                isOfficial: payload.new.is_official,
                profileName: 'VALENCE',
                avatarUrl: null,
                createdAt: payload.new.created_at,
                likes: 0,
                comments: 0,
              },
              ...prev,
            ]);
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
        .from('products')
        .update({
          is_available: Boolean(isAvailable),
          availability_note: nextNote,
          updated_at: new Date().toISOString(),
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
        // Get profile_id for notifications (spec table)
        const profileId = profile?.id || null;

        // All enquiry types are persisted as notifications in the spec's
        // `notifications` table for admin review. The spec's section 25
        // database architecture does not include separate tables for
        // support tickets, ATSWA guidance requests, store enquiries,
        // or partner enquiries — these are stored as notifications.
        const notifType = type === 'support' ? 'support_ticket'
          : type === 'atswa' ? 'atswa_guidance_request'
          : type === 'store' ? 'store_material_enquiry'
          : type === 'book-enq' ? 'partner_enquiry'
          : 'advertising_campaign_request';

        let notifTitle = 'VALENCE Enquiry';
        let notifMessage = '';

        if (type === 'support') {
          notifTitle = 'Support Ticket';
          notifMessage = `${payload.fullName || 'Visitor'}: ${payload.message || ''} (${payload.category || 'General Support'})`;
        } else if (type === 'atswa') {
          notifTitle = 'ATSWA Registration Guidance Request';
          notifMessage = `${payload.fullName || 'ATSWA Candidate'}: ${payload.question || ''} (Level: ${payload.level || 'ATS 1'})`;
        } else if (type === 'store') {
          notifTitle = 'Store Material Enquiry';
          notifMessage = `${payload.fullName || 'Candidate'}: ${payload.topic || 'Store Enquiry'} — ${payload.message || ''}`;
        } else if (type === 'book-enq') {
          notifTitle = 'Partner Enquiry';
          notifMessage = `${payload.studentName || 'Student'} → ${payload.partnerName || 'Partner'}: ${payload.message || ''}`;
        } else if (type === 'advertise') {
          notifTitle = 'Advertising Campaign Request';
          notifMessage = `${payload.entityName || 'Applicant'}: ${payload.headline || ''} — ${payload.notes || ''}`;
        }

        const dbOp = supabase.from('notifications').insert({
          profile_id: profileId,
          notification_type: notifType,
          title: notifTitle,
          message: notifMessage,
        });

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

  // Phase 4: Tuition level unlock
  const handleUnlockLevel = useCallback(async (levelId, amountPaidNgn = 3000, paystackReference = null) => {
    const result = await authUnlockLevel(levelId, amountPaidNgn, paystackReference);
    if (!result.error && result.data) {
      const newId = result.data.level_id;
      setUnlockedLevelIds((prev) => (prev.includes(newId) ? prev : [...prev, newId]));
    }
    return result;
  }, []);

  // Phase 4: ATSWA document management
  const handleFetchAtswaDocuments = useCallback(async () => {
    const result = await authFetchAtswaDocuments();
    if (Array.isArray(result.data)) setAtswaDocuments(result.data);
    return result;
  }, []);

  // Phase 4: ATSWA guidance request submission
  const handleSubmitAtswaGuidance = useCallback(async (payload) => {
    const result = await authSubmitAtswaGuidance(payload);
    return result;
  }, []);

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
    sessions: liveExamSessions,
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
    exemptionRules: liveExemptionRules,
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
    // Phase 4: Exam & tuition
    liveExamSessions,
    liveExamTimetables,
    liveExemptionRules,
    atswaDocuments,
    handleUnlockLevel,
    handleFetchAtswaDocuments,
    handleSubmitAtswaGuidance,
  };

  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>;
}

export function usePlatform() {
  const ctx = useContext(PlatformContext);
  if (!ctx) throw new Error('usePlatform must be used within PlatformProvider');
  return ctx;
}
