import React, { useRef, useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { useToast } from '../../context/ToastContext';
import { uploadGalleryPhoto, fetchGalleryPhotos, deleteGalleryPhoto } from '../../lib/auth';
import { ImagePlus, Loader2, Trash2, Check, X, Camera } from 'lucide-react';

export default function GalleryUploader() {
  const { user } = usePlatform();
  const toast = useToast();
  const fileInputRef = useRef(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
  const [pendingPreview, setPendingPreview] = useState(null);
  const [caption, setCaption] = useState('');

  const loadPhotos = async () => {
    setLoading(true);
    const { data } = await fetchGalleryPhotos();
    setPhotos(data || []);
    setLoading(false);
  };

  React.useEffect(() => {
    if (user) loadPhotos();
  }, [user]);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file', 'Please select an image file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large', 'Maximum 10 MB per photo.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPendingFile(file);
      setPendingPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!pendingFile) return;
    setUploading(true);
    const result = await uploadGalleryPhoto(pendingFile, caption, 'public');
    setUploading(false);
    if (result.error) {
      toast.error('Upload failed', result.error);
      return;
    }
    setPhotos((prev) => [result.data, ...prev]);
    setPendingFile(null);
    setPendingPreview(null);
    setCaption('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    toast.success('Photo uploaded', 'Your photo has been added to your gallery.');
  };

  const handleDelete = async (photoId, storagePath) => {
    const result = await deleteGalleryPhoto(photoId);
    if (result.error) {
      toast.error('Delete failed', result.error);
      return;
    }
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    toast.success('Photo deleted', 'Your photo has been removed.');
  };

  return (
    <div className="space-y-5">
      {/* Upload zone */}
      <div className="v-card p-5 space-y-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#16C784]">Add a Photo</p>
          <p className="text-[11px] text-[#9AA4B2] mt-0.5">Upload study moments, campus photos or achievements to your gallery.</p>
        </div>

        {pendingPreview ? (
          <div className="space-y-3">
            <div className="relative rounded-xl overflow-hidden border border-white/[0.1]">
              <img src={pendingPreview} alt="Preview" className="w-full max-h-64 object-contain bg-[#0B0E11]" />
            </div>
            <div>
              <label className="v-label" htmlFor="gallery-caption">Caption (optional)</label>
              <input
                id="gallery-caption"
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Add a caption..."
                className="v-input"
                maxLength={200}
              />
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={handleUpload} disabled={uploading} className="v-btn-primary text-xs py-2 px-4">
                {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                Upload Photo
              </button>
              <button
                type="button"
                onClick={() => {
                  setPendingFile(null);
                  setPendingPreview(null);
                  setCaption('');
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="inline-flex items-center gap-1 rounded-lg bg-[#11161C] border border-white/[0.08] px-4 py-2 text-xs text-[#9AA4B2] hover:text-white"
              >
                <X className="h-3.5 w-3.5" /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full rounded-xl border-2 border-dashed border-[#16C784]/30 bg-[#16C784]/[0.03] py-8 flex flex-col items-center gap-2 text-[#16C784] hover:bg-[#16C784]/[0.06] transition-colors"
          >
            <ImagePlus className="h-8 w-8" />
            <span className="text-sm font-semibold">Click to upload a photo</span>
            <span className="text-[11px] text-[#9AA4B2]">JPG, PNG or GIF · Max 10 MB</span>
          </button>
        )}
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </div>

      {/* Gallery grid */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-[#C2C9D4] mb-3">Your Gallery ({photos.length})</p>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="aspect-square rounded-xl bg-[#11161C] animate-pulse" />
            ))}
          </div>
        ) : photos.length === 0 ? (
          <div className="rounded-xl bg-[#11161C] border border-white/[0.06] py-8 text-center text-sm text-[#667085]">
            No photos yet. Upload your first photo above.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {photos.map((photo) => (
              <div key={photo.id} className="group relative rounded-xl overflow-hidden border border-white/[0.08]">
                <img src={photo.public_url} alt={photo.caption || 'Gallery photo'} className="w-full aspect-square object-cover bg-[#0B0E11]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E11]/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                  {photo.caption && (
                    <p className="text-[10px] text-[#D5DBE3] truncate">{photo.caption}</p>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(photo.id, photo.storage_path)}
                    className="absolute top-1.5 right-1.5 inline-flex h-6 w-6 items-center justify-center rounded-lg bg-[#EA3943]/90 text-white hover:bg-[#EA3943] transition-colors"
                    aria-label="Delete photo"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
