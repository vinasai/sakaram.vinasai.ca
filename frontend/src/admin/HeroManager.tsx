import { useEffect, useState } from 'react';
import {
  createHeroBanner,
  deleteHeroBanner,
  fetchHeroBanners,
  toMediaUrl,
  updateHeroBanner,
} from '../api/client';

type Hero = { id: string; title: string; subtitle?: string; imageUrl?: string };

type FormState = {
  title: string;
  subtitle: string;
  imageFile: File | null;
  imagePreview: string;
};

// Icons (Unchanged)
const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ImageIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const UploadIcon = () => (
  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

// Updated Skeleton to match Grid Layout
function HeroGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
        >
          <div className="h-48 bg-gray-100 animate-pulse" />
          <div className="p-5 space-y-3">
            <div className="h-5 bg-gray-100 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse" />
            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-50">
              <div className="h-8 w-8 bg-gray-100 rounded animate-pulse" />
              <div className="h-8 w-8 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HeroManager() {
  const [items, setItems] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(false);

  const [editing, setEditing] = useState<Hero | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState<FormState>({
    title: '',
    subtitle: '',
    imageFile: null,
    imagePreview: '',
  });

  const [isSaving, setIsSaving] = useState(false);

  const cleanupPreview = (url: string) => {
    if (url && url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      alert('Invalid file type. Please upload JPG, PNG, WEBP, or GIF.');
      e.target.value = '';
      return;
    }
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File too large. Maximum size is 10MB.');
      e.target.value = '';
      return;
    }

    cleanupPreview(form.imagePreview);
    const preview = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, imageFile: file, imagePreview: preview }));
    e.target.value = '';
  };

  const loadItems = async () => {
    setLoading(true);
    try {
      const res = await fetchHeroBanners(true);
      const mapped = (res.items || []).map((item: any) => ({
        id: item._id,
        title: item.title,
        subtitle: item.subtitle,
        imageUrl: item.imageUrl,
      }));
      setItems(mapped);
    } catch (err) {
      console.error('Failed to load hero banners', err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
    return () => {
      cleanupPreview(form.imagePreview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openAddModal = () => {
    setEditing(null);
    cleanupPreview(form.imagePreview);
    setForm({ title: '', subtitle: '', imageFile: null, imagePreview: '' });
    setShowModal(true);
  };

  const startEdit = (h: Hero) => {
    setEditing(h);
    cleanupPreview(form.imagePreview);
    setForm({
      title: h.title,
      subtitle: h.subtitle || '',
      imageFile: null,
      imagePreview: h.imageUrl ? toMediaUrl(h.imageUrl) : '',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    cleanupPreview(form.imagePreview);
    setShowModal(false);
    setEditing(null);
    setForm({ title: '', subtitle: '', imageFile: null, imagePreview: '' });
    setIsSaving(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      alert('Please enter a title.');
      return;
    }
    if (!form.imageFile) {
      alert('Please select an image.');
      return;
    }

    setIsSaving(true);
    try {
      await createHeroBanner({ title: form.title, subtitle: form.subtitle }, form.imageFile);
      await loadItems();
      closeModal();
    } catch (err) {
      console.error('Failed to create banner', err);
      alert('Unable to create banner.');
    } finally {
      setIsSaving(false);
    }
  };

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    if (!form.title.trim()) {
      alert('Please enter a title.');
      return;
    }

    setIsSaving(true);
    try {
      await updateHeroBanner(editing.id, { title: form.title, subtitle: form.subtitle }, form.imageFile);
      await loadItems();
      closeModal();
    } catch (err) {
      console.error('Failed to update banner', err);
      alert('Unable to update banner.');
    } finally {
      setIsSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this banner?')) return;
    try {
      await deleteHeroBanner(id);
      setItems((s) => s.filter((i) => i.id !== id));
    } catch (err) {
      console.error('Failed to delete banner', err);
      alert('Unable to delete banner.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>

          <p className="text-gray-500 mt-1 text-sm">Manage the visuals displayed on your homepage carousel - {items.length}</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg font-medium"
          type="button"
        >
          <PlusIcon />
          <span>Add New Banner</span>
        </button>
      </div>

      {/* Main Content Grid */}
      {loading ? (
        <HeroGridSkeleton count={3} />
      ) : items.length === 0 ? (
        <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-400 mb-4">
            <ImageIcon />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No banners yet</h3>
          <p className="text-gray-500 mb-6 max-w-xs mx-auto">Upload high-quality images to welcome visitors to your site.</p>
          <button
            onClick={openAddModal}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            type="button"
          >
            Create First Banner
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((i) => (
            <div
              key={i.id}
              className="group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
            >
              {/* Image Area */}
              <div className="relative aspect-video bg-gray-100 overflow-hidden">
                {i.imageUrl ? (
                  <img
                    src={toMediaUrl(i.imageUrl)}
                    alt="banner"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <ImageIcon />
                  </div>
                )}
                {/* Overlay Gradient (Subtle) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Content Area */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="mb-4 flex-1">
                  <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1 line-clamp-1">{i.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{i.subtitle || 'No subtitle provided'}</p>
                </div>

                {/* Actions Footer */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Action</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(i)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Details"
                      type="button"
                    >
                      <EditIcon />
                    </button>
                    <button
                      onClick={() => remove(i.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Banner"
                      type="button"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modern Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">

            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{editing ? 'Edit Banner' : 'New Banner'}</h3>
              </div>
              <button
                onClick={closeModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                type="button"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Modal Form */}
            <div className="overflow-y-auto p-6">
              <form onSubmit={editing ? saveEdit : handleAdd} className="space-y-6">

                {/* Image Upload Area */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Banner Image {editing ? <span className="font-normal text-gray-500">(Optional)</span> : <span className="text-red-500">*</span>}
                  </label>

                  <div className="relative group">
                    {form.imagePreview ? (
                      <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm aspect-video">
                        <img
                          src={form.imagePreview}
                          alt="preview"
                          className="w-full h-full object-cover"
                        />
                        <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                          <span className="bg-white text-gray-800 px-4 py-2 rounded-lg font-medium text-sm shadow-lg">Change Image</span>
                          <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
                        </label>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <UploadIcon />
                          <p className="mb-2 text-sm text-gray-500 mt-3"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                          <p className="text-xs text-gray-400">JPG, PNG, WEBP (Max 10MB)</p>
                        </div>
                        <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
                      </label>
                    )}
                  </div>
                </div>

                {/* Text Inputs */}
                <div className="grid gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      required
                      className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 shadow-sm outline-none transition-all"
                      placeholder="e.g., Summer Getaway"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Subtitle</label>
                    <input
                      value={form.subtitle}
                      onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                      className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 shadow-sm outline-none transition-all"
                      placeholder="e.g., 20% off all tours this season"
                    />
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none transition-colors"
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none shadow-md shadow-blue-200 transition-all disabled:opacity-70 disabled:shadow-none"
                  >
                    {isSaving ? 'Saving...' : editing ? 'Update Banner' : 'Create Banner'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}