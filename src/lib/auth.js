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

export async function signIn(email, password) {
  if (!isSupabaseReady()) return { error: 'Supabase auth is not configured.' };
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
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

  if (authError) return { error: authError.message, authData };

  // Wait briefly for the auth trigger to create the profile row, then patch it
  if (authData?.user) {
    await new Promise((r) => setTimeout(r, 400));
    const metadata = authData.user.user_metadata || {};
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        phone,
        account_type: accountType,
        display_name: fullName,
        institution_id: institutionId || null,
        custom_institution_name: customInstitutionName || null,
        onboarding_completed: false,
      })
      .eq('id', authData.user.id);

    if (profileError) {
      // Profile row may not exist yet, insert as fallback
      const { error: insertError } = await supabase.from('profiles').insert([
        {
          id: authData.user.id,
          account_type: accountType,
          email,
          full_name: fullName,
          display_name: fullName,
          phone,
          institution_id: institutionId || null,
          custom_institution_name: customInstitutionName || null,
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

export async function updateProfile(updates) {
  if (!isSupabaseReady()) return { error: 'Supabase is not configured.' };
  const user = supabase.auth.getUser?.() ?? null;
  // Use getUser async
  const { data: sessionData } = await supabase.auth.getSession();
  const uid = sessionData?.session?.user?.id;
  if (!uid) return { error: 'Not authenticated.' };

  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', uid)
    .select('*')
    .maybeSingle();

  return { data, error };
}

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

  const { error: profileError } = await supabase
    .from('profiles')
    .update({ avatar_url: url, updated_at: new Date().toISOString() })
    .eq('id', uid);

  if (profileError) return { error: profileError.message };

  return { data: { avatar_url: url }, error: null };
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

  const { data, error } = await supabase
    .from('user_gallery_photos')
    .insert([
      {
        user_id: uid,
        storage_path: fileName,
        public_url: pub.publicUrl,
        caption: caption || '',
        visibility,
        sort_order: 0,
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

  const { error } = await supabase
    .from('user_gallery_photos')
    .delete()
    .eq('id', photoId)
    .eq('user_id', uid);

  return { error };
}

export async function fetchGalleryPhotos() {
  if (!isSupabaseReady()) return { data: [], error: null };
  const { data: sessionData } = await supabase.auth.getSession();
  const uid = sessionData?.session?.user?.id;
  if (!uid) return { data: [], error: null };

  const { data, error } = await supabase
    .from('user_gallery_photos')
    .select('*')
    .eq('user_id', uid)
    .order('created_at', { ascending: false });

  return { data: data || [], error };
}

export async function fetchPrivacySettings() {
  if (!isSupabaseReady()) return { data: null, error: null };
  const { data: sessionData } = await supabase.auth.getSession();
  const uid = sessionData?.session?.user?.id;
  if (!uid) return { data: null, error: null };

  const { data, error } = await supabase
    .from('user_privacy_settings')
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
    .from('user_privacy_settings')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('user_id', uid);

  return { error };
}

export async function fetchNotifications() {
  if (!isSupabaseReady()) return { data: [], error: null };
  const { data: sessionData } = await supabase.auth.getSession();
  const uid = sessionData?.session?.user?.id;
  if (!uid) return { data: [], error: null };

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', uid)
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
  const { error } = await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('user_id', uid)
    .is('read_at', null);
  return { error };
}
