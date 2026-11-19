import { supabase, isSupabaseConfigured } from './supabase';

export const USER_TYPES = [
  { value: 'student', label: 'Student & Learner', icon: 'GraduationCap' },
  { value: 'professional', label: 'Professional (ACA / FCA / ACCA / CPA)', icon: 'Briefcase' },
  { value: 'tutor', label: 'Accounting Tutor', icon: 'BookOpenCheck' },
  { value: 'school_rep', label: 'School / Institution Representative', icon: 'Building2' },
  { value: 'advertiser', label: 'Advertiser (Centre / Author / Vendor)', icon: 'Megaphone' },
  { value: 'general_learner', label: 'General Accounting Learner', icon: 'Users' },
];

export const ADMIN_ROLES = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'exam_authority_admin', label: 'Examination Authority Admin' },
  { value: 'academic_admin', label: 'Academic Admin' },
  { value: 'store_admin', label: 'Store Admin' },
  { value: 'verification_admin', label: 'Verification Admin' },
  { value: 'community_moderator', label: 'Community Moderator' },
  { value: 'competition_admin', label: 'Competition Admin' },
  { value: 'ads_finance_admin', label: 'Ads & Finance Admin' },
];

export function isSupabaseReady() {
  return isSupabaseConfigured && supabase;
}

// --- Phase 2: Authentication ---

export async function signIn(email, password) {
  if (!isSupabaseReady()) return { error: 'Supabase auth is not configured.' };
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    let friendlyError = error.message;
    if (error.message?.includes('Invalid login credentials')) {
      friendlyError = 'Invalid email or password. Please check your credentials or create a new account.';
    } else if (error.message?.includes('Email not confirmed')) {
      friendlyError = 'Your email is not confirmed. Please check your inbox or register again — accounts are now auto-confirmed.';
    } else if (error.message?.includes('Network error') || error.message?.includes('fetch')) {
      friendlyError = 'Network error. Please check your connection and try again.';
    } else if (error.message?.includes('rate limited')) {
      friendlyError = 'Too many attempts. Please wait a moment and try again.';
    }
    return { data, error: friendlyError };
  }
  return { data, error: null };
}

export async function signUp({ email, password, fullName, phone, accountType, institutionId, customInstitutionName }) {
  if (!isSupabaseReady()) return { error: 'Supabase auth is not configured.' };

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone,
        account_type: accountType,
      },
    },
  });

  if (authError) {
    let friendlyError = authError.message;
    if (authError.message?.includes('User already registered')) {
      friendlyError = 'An account with this email already exists. Try signing in instead.';
    } else if (authError.message?.includes('Network error') || authError.message?.includes('fetch')) {
      friendlyError = 'Network error. Please check your connection and try again.';
    } else if (authError.message?.includes('rate limited')) {
      friendlyError = 'Too many attempts. Please wait a moment and try again.';
    }
    return { error: friendlyError, authData };
  }

  // Wait briefly for the auth trigger to create the profile row, then patch it
  if (authData?.user) {
    await new Promise((r) => setTimeout(r, 400));
    const uid = authData.user.id;
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        display_name: fullName,
        full_name: fullName,
        account_type: accountType,
        user_category: accountType,
        institution_id: institutionId || null,
        onboarding_completed: false,
      })
      .eq('user_id', uid);

    if (profileError) {
      // Profile row may not exist yet, insert as fallback
      const { error: insertError } = await supabase.from('profiles').insert([
        {
          user_id: uid,
          display_name: fullName,
          full_name: fullName,
          account_type: accountType,
          user_category: accountType,
          institution_id: institutionId || null,
          onboarding_completed: false,
        },
      ]);
      if (insertError) return { error: insertError.message, authData };
    }
  }

  return { data: authData, error: null };
}

export async function signOut() {
  if (!isSupabaseReady()) return;
  await supabase.auth.signOut();
}

// --- Phase 2: Profile management ---

export async function updateProfile(updates) {
  if (!isSupabaseReady()) return { error: 'Supabase is not configured.' };
  const { data: sessionData } = await supabase.auth.getSession();
  const uid = sessionData?.session?.user?.id;
  if (!uid) return { error: 'Not authenticated.' };

  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('user_id', uid)
    .select('*')
    .maybeSingle();

  return { data, error };
}

export async function fetchProfile() {
  if (!isSupabaseReady()) return { data: null, error: null };
  const { data: sessionData } = await supabase.auth.getSession();
  const uid = sessionData?.session?.user?.id;
  if (!uid) return { data: null, error: null };

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', uid)
    .maybeSingle();

  return { data, error };
}

// --- Phase 3: Profile photos (profile_photos table) ---

export async function uploadAvatar(file) {
  if (!isSupabaseReady()) return { error: 'Supabase Storage is not configured.' };
  const { data: sessionData } = await supabase.auth.getSession();
  const uid = sessionData?.session?.user?.id;
  if (!uid) return { error: 'Not authenticated.' };

  const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const fileName = `${uid}/avatar.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, { contentType: file.type, upsert: true });

  if (uploadError) return { error: uploadError.message };

  const { data: pub } = supabase.storage.from('avatars').getPublicUrl(fileName);
  const url = pub.publicUrl;

  // Update profile_photo_url on profiles
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ profile_photo_url: url, updated_at: new Date().toISOString() })
    .eq('user_id', uid);

  if (profileError) return { error: profileError.message };

  return { data: { profile_photo_url: url }, error: null };
}

export async function uploadGalleryPhoto(file, caption, visibility = 'public') {
  if (!isSupabaseReady()) return { error: 'Supabase Storage is not configured.' };
  const { data: sessionData } = await supabase.auth.getSession();
  const uid = sessionData?.session?.user?.id;
  if (!uid) return { error: 'Not authenticated.' };

  const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const fileName = `${uid}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('community-media')
    .upload(fileName, file, { contentType: file.type });

  if (uploadError) return { error: uploadError.message };

  const { data: pub } = supabase.storage.from('community-media').getPublicUrl(fileName);

  // Get profile_id first
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', uid)
    .maybeSingle();

  if (!profile) return { error: 'Profile not found.' };

  const { data, error } = await supabase
    .from('profile_photos')
    .insert([
      {
        profile_id: profile.id,
        url: pub.publicUrl,
        caption: caption || '',
        visibility,
        is_profile_picture: false,
      },
    ])
    .select('*')
    .single();

  return { data, error };
}

export async function deleteGalleryPhoto(photoId) {
  if (!isSupabaseReady()) return { error: 'Supabase is not configured.' };
  const { data: sessionData } = await supabase.auth.getSession();
  const uid = sessionData?.session?.user?.id;
  if (!uid) return { error: 'Not authenticated.' };

  // Get profile_id
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', uid)
    .maybeSingle();

  if (!profile) return { error: 'Profile not found.' };

  const { error } = await supabase
    .from('profile_photos')
    .delete()
    .eq('id', photoId)
    .eq('profile_id', profile.id);

  return { error };
}

export async function fetchGalleryPhotos() {
  if (!isSupabaseReady()) return { data: [], error: null };
  const { data: sessionData } = await supabase.auth.getSession();
  const uid = sessionData?.session?.user?.id;
  if (!uid) return { data: [], error: null };

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', uid)
    .maybeSingle();

  if (!profile) return { data: [], error: null };

  const { data, error } = await supabase
    .from('profile_photos')
    .select('*')
    .eq('profile_id', profile.id)
    .order('created_at', { ascending: false });

  return { data: data || [], error };
}

// --- Phase 3: Privacy settings (stored on profiles) ---

export async function fetchPrivacySettings() {
  if (!isSupabaseReady()) return { data: null, error: null };
  const { data: sessionData } = await supabase.auth.getSession();
  const uid = sessionData?.session?.user?.id;
  if (!uid) return { data: null, error: null };

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', uid)
    .maybeSingle();

  return { data, error };
}

export async function updatePrivacySettings(updates) {
  if (!isSupabaseReady()) return { error: 'Supabase is not configured.' };
  const { data: sessionData } = await supabase.auth.getSession();
  const uid = sessionData?.session?.user?.id;
  if (!uid) return { error: 'Not authenticated.' };

  const { error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('user_id', uid);

  return { error };
}

// --- Phase 3: Notifications (notifications table with profile_id) ---

export async function fetchNotifications() {
  if (!isSupabaseReady()) return { data: [], error: null };
  const { data: sessionData } = await supabase.auth.getSession();
  const uid = sessionData?.session?.user?.id;
  if (!uid) return { data: [], error: null };

  // Get profile_id first
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', uid)
    .maybeSingle();

  if (!profile) return { data: [], error: null };

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('profile_id', profile.id)
    .order('created_at', { ascending: false })
    .limit(50);

  return { data: data || [], error };
}

export async function markNotificationRead(notificationId) {
  if (!isSupabaseReady()) return;
  const { error } = await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('id', notificationId);
  return { error };
}

export async function markAllNotificationsRead() {
  if (!isSupabaseReady()) return;
  const { data: sessionData } = await supabase.auth.getSession();
  const uid = sessionData?.session?.user?.id;
  if (!uid) return;

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', uid)
    .maybeSingle();

  if (!profile) return;

  const { error } = await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('profile_id', profile.id)
    .is('read_at', null);
  return { error };
}

// --- Phase 4: Tuition level unlock persistence ---

export async function unlockLevel(levelId, amountPaidNgn = 3000, paystackReference = null) {
  if (!isSupabaseReady()) return { error: 'Supabase is not configured.' };
  const { data: sessionData } = await supabase.auth.getSession();
  const uid = sessionData?.session?.user?.id;
  if (!uid) return { error: 'Not authenticated.' };

  // Get profile_id
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', uid)
    .maybeSingle();

  if (!profile) return { error: 'Profile not found.' };

  // Check if already unlocked
  const { data: existing } = await supabase
    .from('student_fee_unlocks')
    .select('id')
    .eq('profile_id', profile.id)
    .eq('examination_level_id', levelId)
    .maybeSingle();

  if (existing) return { data: existing, error: null };

  const { data, error } = await supabase
    .from('student_fee_unlocks')
    .insert([
      {
        profile_id: profile.id,
        amount_paid_ngn: amountPaidNgn,
        paystack_reference: paystackReference || `SIM-${Date.now().toString(36).toUpperCase()}`,
        payment_status: 'successful',
        payment_verified_at: new Date().toISOString(),
      },
    ])
    .select('*')
    .single();

  return { data, error };
}

// --- Phase 4: ATSWA document upload to private storage ---
// Note: atswa_guidance_documents and atswa_guidance_requests are Phase 4 tables
// not listed in the spec's section 25 database architecture. These functions
// will be re-implemented in the Phase 4 rebuild using spec-compliant tables.

export async function uploadAtswaDocument(file, documentType, targetLevel) {
  if (!isSupabaseReady()) return { error: 'Supabase Storage is not configured.' };
  const { data: sessionData } = await supabase.auth.getSession();
  const uid = sessionData?.session?.user?.id;
  if (!uid) return { error: 'Not authenticated.' };

  const fileExt = file.name.split('.').pop()?.toLowerCase() || 'pdf';
  const fileName = `${uid}/atswa-docs/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('atswa-documents')
    .upload(fileName, file, { contentType: file.type });

  if (uploadError) return { error: uploadError.message };

  // Store document metadata in profile_photos as a lightweight document record
  // (Phase 4 will use a dedicated table when rebuilt)
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', uid)
    .maybeSingle();

  if (!profile) return { error: 'Profile not found.' };

  const { data, error } = await supabase
    .from('profile_photos')
    .insert([
      {
        profile_id: profile.id,
        url: fileName,
        caption: `${documentType} - ${targetLevel || 'general'}`,
        visibility: 'private',
        is_profile_picture: false,
      },
    ])
    .select('*')
    .single();

  return { data, error };
}

export async function fetchAtswaDocuments() {
  if (!isSupabaseReady()) return { data: [], error: null };
  const { data: sessionData } = await supabase.auth.getSession();
  const uid = sessionData?.session?.user?.id;
  if (!uid) return { data: [], error: null };

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', uid)
    .maybeSingle();

  if (!profile) return { data: [], error: null };

  // Fetch documents from profile_photos where caption starts with a document type
  const { data, error } = await supabase
    .from('profile_photos')
    .select('*')
    .eq('profile_id', profile.id)
    .eq('visibility', 'private')
    .order('created_at', { ascending: false });

  return { data: data || [], error };
}

export async function submitAtswaGuidanceRequest(payload) {
  if (!isSupabaseReady()) return { error: 'Supabase is not configured.' };
  const { data: sessionData } = await supabase.auth.getSession();
  const uid = sessionData?.session?.user?.id;
  if (!uid) return { error: 'Not authenticated.' };

  // Store guidance request as a notification record for admin review
  // (Phase 4 will use a dedicated table when rebuilt)
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, display_name')
    .eq('user_id', uid)
    .maybeSingle();

  if (!profile) return { error: 'Profile not found.' };

  const { data, error } = await supabase
    .from('notifications')
    .insert([
      {
        profile_id: profile.id,
        notification_type: 'atswa_guidance_request',
        title: 'ATSWA Registration Guidance Request',
        message: `${payload.fullName || profile.full_name || profile.display_name}: ${payload.question || ''} (Level: ${payload.level || 'general'})`,
      },
    ])
    .select('*')
    .single();

  return { data, error };
}
