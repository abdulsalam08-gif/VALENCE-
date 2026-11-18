import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  PLATFORM_SETTINGS,
  EXAMINATION_SESSIONS,
  ATSWA_LEVELS,
  ICAN_LEVELS,
  ALL_ICAN_COURSES,
  STORE_PRODUCTS,
  DELIVERY_ZONES,
  VALENCE_PILLARS,
  FEATURED_TUITION_CENTRES,
  FEATURED_TUTORS,
  LATEST_OPPORTUNITIES,
  UPCOMING_EVENTS,
  ANNOUNCEMENTS_FEED,
  TESTIMONIALS,
  PLATFORM_STATISTICS,
  FAQS,
  EXEMPTION_RULES,
  DISCUSSION_CATEGORIES,
  COMPETITION_DIVISIONS,
  TERTIARY_DISCIPLINES,
  GENERAL_LEARNER_TRACKS,
  PROFESSIONAL_QUALIFICATIONS,
} from '../data/platformConfig';
import { calculateStoreCart } from '../lib/pricing';

const PlatformContext = createContext(null);
const CART_STORAGE_KEY = 'valence_cart_v1';

export function PlatformProvider({ children }) {
  // Ready for Phase 2 live Supabase Auth + Realtime hydration
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isHydrating, setIsHydrating] = useState(true);

  // Shopping cart persisted across page navigation
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [selectedZoneId, setSelectedZoneId] = useState(DELIVERY_ZONES[0].id);

  // Prefilled WhatsApp Assistance Modal (strictly enquiries / ICAN official fees / physical tuition)
  const [whatsAppModal, setWhatsAppModal] = useState({
    open: false,
    category: 'General Support Enquiry',
    programme: '',
    level: '',
  });

  useEffect(() => {
    const t = setTimeout(() => setIsHydrating(false), 240);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // ignore storage quota errors
    }
  }, [cart]);

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
    isHydrating,
    settings: PLATFORM_SETTINGS,
    sessions: EXAMINATION_SESSIONS,
    atswaLevels: ATSWA_LEVELS,
    icanLevels: ICAN_LEVELS,
    allIcanCourses: ALL_ICAN_COURSES,
    products: STORE_PRODUCTS,
    deliveryZones: DELIVERY_ZONES,
    pillars: VALENCE_PILLARS,
    tuitionCentres: FEATURED_TUITION_CENTRES,
    tutors: FEATURED_TUTORS,
    opportunities: LATEST_OPPORTUNITIES,
    events: UPCOMING_EVENTS,
    announcements: ANNOUNCEMENTS_FEED,
    testimonials: TESTIMONIALS,
    statistics: PLATFORM_STATISTICS,
    faqs: FAQS,
    exemptionRules: EXEMPTION_RULES,
    discussionCategories: DISCUSSION_CATEGORIES,
    competitionDivisions: COMPETITION_DIVISIONS,
    tertiaryDisciplines: TERTIARY_DISCIPLINES,
    generalLearnerTracks: GENERAL_LEARNER_TRACKS,
    professionalQualifications: PROFESSIONAL_QUALIFICATIONS,
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
  };

  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>;
}

export function usePlatform() {
  const ctx = useContext(PlatformContext);
  if (!ctx) throw new Error('usePlatform must be used within PlatformProvider');
  return ctx;
}
