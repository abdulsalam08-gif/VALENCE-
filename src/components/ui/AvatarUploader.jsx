import React, { useRef, useState } from 'react';
import { useAuth, useCart, usePublicData, useUi } from '../../context/PlatformContext';
import { useToast } from '../../context/ToastContext';
import { uploadAvatar } from '../../lib/auth';
import { Camera, Loader2, Check, X } from 'lucide-react';

export default function AvatarUploader({ currentUrl, size = 'md' }) {
  const { user, setUser, profile, setProfile } = useAuth();
  const toast = useToast();
  const fileInputRef = useRef(null);
  const [processing, setProcessing] = useState(false);
  const [preview, setPreview] = useState(null);

  const sizeClasses = {
    sm: 'h-16 w-16 text-xs',
    md: 'h-24 w-24 text-sm',
    lg: 'h-36 w-36 text-base',
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file', 'Please select an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large', 'Maximum 5 MB for avatar images.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!preview) return;
    setProcessing(true);
    const file = new File([await (await fetch(preview)).blob()], 'avatar.png', { type: 'image/png' });
    const result = await uploadAvatar(file);
    setProcessing(false);

    if (result.error) {
      toast.error('Upload failed', result.error);
      return;
    }

    if (result.data?.avatar_url && profile) {
      setProfile({ ...profile, avatar_url: result.data.avatar_url });
    }
    if (user) {
      setUser({ ...user, user_metadata: { ...user.user_metadata, avatar_url: result.data.avatar_url } });
    }
    setPreview(null);
    toast.success('Avatar updated', 'Your profile picture has been uploaded.');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const displayUrl = preview || currentUrl || null;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative group">
        <div
          className={`${sizeClasses[size]} rounded-full bg-[#11161C] border-2 border-white/[0.12] overflow-hidden flex items-center justify-center text-[#667085]`}
        >
          {displayUrl ? (
            <img src={displayUrl} alt="Avatar" className="h-full w-full object-cover" />
          ) : (
            <Camera className="h-1/2 w-1/2" />
          )}
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={processing}
          className="absolute -bottom-1 -right-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#16C784] text-[#06130D] border-2 border-[#0B0E11] hover:scale-105 transition-transform disabled:opacity-50"
          aria-label="Change avatar"
        >
          {processing ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Camera className="h-3.5 w-3.5" />
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />
      </div>

      {preview && (
        <div className="flex items-center gap-2">
          <button type="button" onClick={handleUpload} className="v-btn-primary text-xs py-1.5 px-3">
            {processing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
            Upload
          </button>
          <button
            type="button"
            onClick={() => {
              setPreview(null);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
            className="inline-flex items-center gap-1 rounded-lg bg-[#11161C] border border-white/[0.08] px-3 py-1.5 text-xs text-[#9AA4B2] hover:text-white"
          >
            <X className="h-3.5 w-3.5" /> Cancel
          </button>
        </div>
      )}
    </div>
  );
}
