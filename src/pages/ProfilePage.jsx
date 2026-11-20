import React, { useState, useEffect } from 'react';
import { usePlatform } from '../context/PlatformContext';
import { useToast } from '../context/ToastContext';
import AvatarUploader from '../components/ui/AvatarUploader';
import GalleryUploader from '../components/ui/GalleryUploader';
import { fetchPrivacySettings, updatePrivacySettings as updatePrivacyApi } from '../lib/auth';
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  School,
  Calendar,
  Lock,
  Image as ImageIcon,
  Save,
  Loader2,
  Eye,
  EyeOff,
} from 'lucide-react';

const PRIVACY_FIELDS = [
  { key: 'profile_visibility', label: 'Profile visibility', options: [
    { value: 'public', label: 'Public' },
    { value: 'connections', label: 'Connections only' },
    { value: 'private', label: 'Private' },
  ] },
  { key: 'gallery_visibility', label: 'Gallery visibility', options: [
    { value: 'public', label: 'Public' },
    { value: 'connections', label: 'Connections only' },
    { value: 'private', label: 'Private' },
  ] },
  { key: 'allow_messages_from', label: 'Allow messages from', options: [
    { value: 'everyone', label: 'Everyone' },
    { value: 'connections', label: 'Connections only' },
    { value: 'nobody', label: 'Nobody' },
  ] },
  { key: 'allow_calls_from', label: 'Allow calls from', options: [
    { value: 'everyone', label: 'Everyone' },
    { value: 'connections', label: 'Connections only' },
    { value: 'nobody', label: 'Nobody' },
  ] },
];

const TOGGLE_FIELDS = [
  { key: 'show_email', label: 'Show email on profile' },
  { key: 'show_phone', label: 'Show phone on profile' },
  { key: 'show_institution', label: 'Show institution on profile' },
  { key: 'show_study_streak', label: 'Show study streak' },
  { key: 'email_notifications', label: 'Email notifications' },
];

export default function ProfilePage() {
  const { profile, user, handleUpdateProfile, privacySettings, setPrivacySettings } = usePlatform();
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editForm, setEditForm] = useState({
    full_name: '',
    role: '',
    bio: '',
    graduation_year: '',
  });

  const [localPrivacy, setLocalPrivacy] = useState(null);
  const [privacySaving, setPrivacySaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setEditForm({
        full_name: profile.full_name || '',
        role: profile.role || '',
        bio: profile.bio || '',
        graduation_year: profile.graduation_year || '',
      });
    }
  }, [profile]);

  // Normalize loaded privacy settings so toggle fields are real booleans
  // (DB may return null/undefined/string for columns that don't exist yet).
  const normalizePrivacy = (raw) => {
    if (!raw) return raw;
    const out = { ...raw };
    for (const field of TOGGLE_FIELDS) {
      const v = out[field.key];
      out[field.key] = v === true || v === 'true' || v === 1 || v === '1';
    }
    return out;
  };

  useEffect(() => {
    if (privacySettings) setLocalPrivacy(normalizePrivacy(privacySettings));
  }, [privacySettings]);

  if (!user) return null;

  const displayName = profile?.full_name || user.user_metadata?.full_name || user.email;
  const accountTypeLabel = profile?.account_type?.replace(/_/g, ' ');

  const handleSaveProfile = async () => {
    setSaving(true);
    const result = await handleUpdateProfile(editForm);
    setSaving(false);
    if (result.error) {
      toast.error('Save failed', result.error);
    } else {
      toast.success('Saved', 'Profile updated successfully.');
      setEditing(false);
    }
  };

  const handleSavePrivacy = async () => {
    setPrivacySaving(true);
    const result = await updatePrivacyApi(localPrivacy);
    if (result.error) {
      toast.error('Save failed', result.error);
    } else if (result.data) {
      setPrivacySettings(result.data);
      toast.success('Saved', 'Privacy settings updated.');
    }
    setPrivacySaving(false);
  };

  const updatePrivacy = (key, value) => setLocalPrivacy((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F14] via-[#11161C] to-[#0B0F14] text-[#E4E9F0]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header card */}
        <div className="rounded-2xl bg-[#11161C] border border-white/[0.10] overflow-hidden">
          <div className="h-28 bg-gradient-to-r from-[#16C784]/20 via-[#11161C] to-[#11161C]" />
          <div className="px-6 sm:px-8 pb-6 -mt-12">
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <div className="flex items-end gap-4">
                <div className="rounded-full ring-4 ring-[#11161C]">
                  <AvatarUploader
                    avatarUrl={profile?.avatar_url}
                    size={96}
                    onUploaded={(url) => handleUpdateProfile({ avatar_url: url })}
                  />
                </div>
                <div className="pb-1">
                  <h1 className="text-xl font-bold text-white">{displayName}</h1>
                  {accountTypeLabel && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-[#16C784] capitalize mt-0.5">
                      {accountTypeLabel}
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditing((v) => !v)}
                className="v-btn-primary !py-2 !px-4 text-xs"
              >
                {editing ? 'Cancel' : 'Edit profile'}
              </button>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              <StatCard icon={User} label="Account" value={accountTypeLabel ? accountTypeLabel.replace(/_/g, ' ') : 'Member'} />
              {profile?.institution_name && (
                <StatCard icon={School} label="Institution" value={profile.institution_name} />
              )}
              {profile?.graduation_year && (
                <StatCard icon={Calendar} label="Grad year" value={profile.graduation_year} />
              )}
              {profile?.role && (
                <StatCard icon={GraduationCap} label="Role" value={profile.role} />
              )}
            </div>

            {/* Bio */}
            {(editing || profile?.bio) && (
              <div className="mt-6">
                {editing ? (
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, bio: e.target.value }))}
                    className="v-input resize-none"
                    rows={3}
                    placeholder="Write a short bio..."
                  />
                ) : (
                  <p className="text-sm text-[#9AA4B2] leading-relaxed">{profile.bio}</p>
                )}
              </div>
            )}

            {/* Editable fields */}
            {editing && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="v-label">Full name</label>
                  <input
                    type="text"
                    value={editForm.full_name}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, full_name: e.target.value }))}
                    className="v-input"
                  />
                </div>
                <div>
                  <label className="v-label">Role / Title</label>
                  <input
                    type="text"
                    value={editForm.role}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, role: e.target.value }))}
                    className="v-input"
                  />
                </div>
                <div>
                  <label className="v-label">Graduation year</label>
                  <input
                    type="number"
                    value={editForm.graduation_year}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, graduation_year: e.target.value }))}
                    className="v-input"
                    placeholder="2027"
                  />
                </div>
              </div>
            )}

            {editing && (
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={saving}
                className="v-btn-primary mt-5 !py-2 !px-4 text-xs"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saving ? 'Saving...' : 'Save changes'}
              </button>
            )}

            {/* Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-white/[0.07]">
              <ContactRow icon={Mail} label="Email" value={user.email} />
              {profile?.phone && <ContactRow icon={Phone} label="Phone" value={profile.phone} />}
              {profile?.institution_name && (
                <ContactRow icon={School} label="Institution" value={profile.institution_name} />
              )}
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="mt-6 rounded-2xl bg-[#11161C] border border-white/[0.10] p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-5">
            <ImageIcon className="h-4.5 w-4.5 text-[#16C784]" />
            <h2 className="text-sm font-bold text-white">Photo gallery</h2>
            <span className="text-[10px] text-[#667085]">Private storage · your captions</span>
          </div>
          <GalleryUploader />
        </div>

        {/* Privacy settings */}
        <div className="mt-6 rounded-2xl bg-[#11161C] border border-white/[0.10] p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-5">
            <Lock className="h-4.5 w-4.5 text-[#16C784]" />
            <h2 className="text-sm font-bold text-white">Privacy & visibility</h2>
          </div>

          {localPrivacy ? (
            <>
              <div className="space-y-4">
                {PRIVACY_FIELDS.map((field) => (
                  <div key={field.key}>
                    <label className="v-label">{field.label}</label>
                    <div className="flex flex-wrap gap-2">
                      {field.options.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => updatePrivacy(field.key, opt.value)}
                          className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-all ${
                            localPrivacy[field.key] === opt.value
                              ? 'bg-[#16C784] text-black'
                              : 'bg-white/[0.04] text-[#9AA4B2] hover:bg-white/[0.08]'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 pt-6 border-t border-white/[0.07]">
                {TOGGLE_FIELDS.map((field) => (
                  <label
                    key={field.key}
                    className="flex items-center justify-between rounded-lg bg-white/[0.02] border border-white/[0.05] px-3.5 py-2.5 cursor-pointer hover:bg-white/[0.04] transition-colors"
                  >
                    <span className="text-xs font-medium text-[#C2C9D4]">{field.label}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        updatePrivacy(field.key, !localPrivacy[field.key]);
                      }}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        localPrivacy[field.key] ? 'bg-[#16C784]' : 'bg-white/[0.1]'
                      }`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                          localPrivacy[field.key] ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </label>
                ))}
              </div>

              <button
                type="button"
                onClick={handleSavePrivacy}
                disabled={privacySaving}
                className="v-btn-primary mt-6 !py-2.5 !px-5 text-sm"
              >
                {privacySaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {privacySaving ? 'Saving...' : 'Save privacy settings'}
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2 text-sm text-[#667085] py-4">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading privacy settings...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] px-3.5 py-3">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#667085]">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className="text-sm font-bold text-white mt-1 truncate capitalize">{value}</p>
    </div>
  );
}

function ContactRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.05] text-[#16C784] shrink-0">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#667085]">{label}</p>
        <p className="text-xs font-medium text-[#E4E9F0] truncate">{value}</p>
      </div>
    </div>
  );
}
