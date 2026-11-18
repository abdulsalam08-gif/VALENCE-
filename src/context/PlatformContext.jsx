import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
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

const PlatformContext = createContext(null);
const CART_STORAGE_KEY = 'valence_cart_v1';

export function PlatformProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  // Server-verified student_fee_unlocks records hydrate here in Phase 2/4/8
  const [unlockedLevelIds, setUnlockedLevelIds] = useState([]);
  const [isHydrating, setIsHydrating] = useState(true);

  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      // Filter out any legacy pre-course-split IDs so every cart item matches current catalogue
      const validIds = new Set(STORE_PRODUCTS.map((p) => p.id));
      return Array.isArray(parsed) ? parsed.filter((item) => validIds.has(item.id)) : [];
    } catch {
      return [];
    }
  });
  const [selectedZoneId, setSelectedZoneId] = useState(DELIVERY_ZONES[0].id);

  // In-app submissions (wired directly to Supabase tables & Admin Portal queues in Phase 2+)
  const [inAppTickets, setInAppTickets] = useState([]);

  const submitInAppTicket = (type, payload) => {
    const ref = `VAL-${type.toUpperCase()}-${String(Date.now()).slice(-6)}`;
    const record = {
      id: ref,
      type,
      status: 'Submitted · Pending Admin Review',
      createdAt: new Date().toISOString(),
      ...payload,
    };
    setInAppTickets((prev) => [record, ...prev]);
    return record;
  };

  const [whatsAppModal, setWhatsAppModal] = useState({
    open: false,
    category: 'General Support Enquiry',
    programme: '',
    level: '',
  });

  useEffect(() => {
    const t = setTimeout(() => setIsHydrating(false), 220);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // ignore storage quota errors
    }
  }, [cart]);

  const isLevelUnlocked = (levelKey) => unlockedLevelIds.includes(levelKey);

  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });
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
    () => DELIVERY_ZONES.find((z) => z.id === selectedZoneId) || DELIVERY_ZONES[0],
    [selectedZoneId]
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
    userRole,
    setUserRole,
    unlockedLevelIds,
    setUnlockedLevelIds,
    isLevelUnlocked,
    isHydrating,
    settings: PLATFORM_SETTINGS,
    sessions: EXAMINATION_SESSIONS,
    atswaLevels: ATSWA_LEVELS,
    allAtswaCourses: ALL_ATSWA_COURSES,
    atswaRegistrationGuide: ATSWA_APP_REGISTRATION_GUIDE,
    icanLevels: ICAN_LEVELS,
    allIcanCourses: ALL_ICAN_COURSES,
    products: STORE_PRODUCTS,
    deliveryZones: DELIVERY_ZONES,
    pillars: VALENCE_PILLARS,
    tuitionCentres: FEATURED_TUITION_CENTRES,
    textbookAdvertisers: FEATURED_TEXTBOOK_ADVERTISERS,
    motivationalQuotes: MOTIVATIONAL_QUOTES,
    tutors: FEATURED_TUTORS,
    opportunities: LATEST_OPPORTUNITIES,
    events: UPCOMING_EVENTS,
    announcements: ANNOUNCEMENTS_FEED,
    testimonials: TESTIMONIALS,
    statistics: PLATFORM_STATISTICS,
    faqs: FAQS,
    candidateFaqs: ICAN_CANDIDATE_FAQS,
    atswaEntryPathways: ATSWA_ENTRY_PATHWAYS,
    graduateEntryPathways: GRADUATE_ENTRY_PATHWAYS,
    icanRegistrationProcess: ICAN_REGISTRATION_PROCESS,
    completionTimelines: ICAN_COMPLETION_TIMELINES,
    exemptionRules: EXEMPTION_RULES,
    discussionCategories: DISCUSSION_CATEGORIES,
    competitionDivisions: COMPETITION_DIVISIONS,
    competitionReward: COMPETITION_REWARD,
    competitionStructures: COMPETITION_STRUCTURES,
    tertiaryDisciplines: TERTIARY_DISCIPLINES,
    generalLearnerTracks: GENERAL_LEARNER_TRACKS,
    professionalQualifications: PROFESSIONAL_QUALIFICATIONS,
    universities: NIGERIAN_UNIVERSITIES,
    nigerianStates: NIGERIAN_STATES,
    geopoliticalZones: GEOPOLITICAL_ZONES,
    universityCounts: UNIVERSITY_COUNTS,
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
  };

  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>;
}

export function usePlatform() {
  const ctx = useContext(PlatformContext);
  if (!ctx) throw new Error('usePlatform must be used within PlatformProvider');
  return ctx;
}
