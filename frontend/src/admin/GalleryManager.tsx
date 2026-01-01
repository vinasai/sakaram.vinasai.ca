import { useEffect, useState } from 'react';
import DeleteModal from './DeleteModal';
import {
  createGalleryPhoto,
  deleteGalleryPhoto,
  fetchGallery,
  toMediaUrl,
  updateGalleryPhoto,
} from '../api/client';

type GalleryItem = { id: string; title: string; category?: string; imageUrl?: string };

type FormState = { title: string; category: string; imageFile: File | null; imagePreview: string };

const categories = [
  'Nature',
  'Food',
  'Travel',
  'Adventure',
  'Culture',
  'Wildlife',
  'Architecture',
  'Beach',
  'Mountains',
  'Cityscapes',
];

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
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

// Error Modal Component
const ErrorModal = ({ message, onClose }: { message: string, onClose: () => void }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
    <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-fade-in-up">
      <div className="flex items-center gap-3 text-red-600 mb-4">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 className="text-lg font-bold">Error</h3>
      </div>
      <p className="text-gray-600 mb-6 whitespace-pre-wrap">{message}</p>
      <button
        onClick={onClose}
        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 rounded-lg transition-colors"
      >
        Dismiss
      </button>
    </div>
  </div>
);

function GallerySkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse"
        >
          <div className="h-40 bg-gray-200" />
          <div className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="h-4 bg-gray-200 rounded w-2/3" />
              <div className="h-3 bg-gray-200 rounded w-1/4" />
            </div>
            <div className="pt-3 border-t border-gray-100 flex gap-2">
              <div className="h-9 bg-gray-200 rounded-lg flex-1" />
              <div className="h-9 bg-gray-200 rounded-lg flex-1" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}


export default function GalleryManager() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string | null; title: string }>({
    open: false,
    id: null,
    title: ''
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({
    title: '',
    category: '',
    imageFile: null,
    imagePreview: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload JPG, PNG, WEBP, or GIF.');
      e.target.value = '';
      return;
    }
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File too large. Maximum size is 10MB.');
      e.target.value = '';
      return;
    }

    const preview = URL.createObjectURL(file);
    setForm((p) => ({ ...p, imageFile: file, imagePreview: preview }));
  };

  const loadGallery = async () => {
    setLoading(true);
    try {
      const res = await fetchGallery();
      const mapped = (res.items || []).map((item: any) => ({
        id: item._id,
        title: item.title,
        category: item.category,
        imageUrl: item.imageUrl,
      }));
      setItems(mapped);
    } catch (err) {
      console.error('Failed to load gallery', err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ title: '', category: '', imageFile: null, imagePreview: '' });
    setShowModal(true);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const title = form.title.trim();
    if (!title) {
      setError('Please enter a title.');
      return;
    }
    if (title.length > 80) {
      setError('Photo title must be 80 characters or fewer.');
      return;
    }
    if (!form.imageFile) {
      setError('Please select an image.');
      return;
    }
    setIsSaving(true);
    try {
      await createGalleryPhoto({ title: form.title, category: form.category }, form.imageFile);
      await loadGallery();
      setShowModal(false);
      setForm({ title: '', category: '', imageFile: null, imagePreview: '' });
    } catch (err: any) {
      console.error('Failed to create photo', err);
      let errorMessage = 'Unable to add photo.';
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        errorMessage = err.response.data.errors.map((e: any) => `${e.path}: ${e.msg}`).join('\n');
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const startEdit = (g: GalleryItem) => {
    setEditing(g);
    setForm({
      title: g.title,
      category: g.category || '',
      imageFile: null,
      imagePreview: g.imageUrl ? toMediaUrl(g.imageUrl) : '',
    });
    setShowModal(true);
  };

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const title = form.title.trim();
    if (!title) {
      setError('Please enter a title.');
      return;
    }
    if (title.length > 80) {
      setError('Photo title must be 80 characters or fewer.');
      return;
    }
    setIsSaving(true);
    try {
      await updateGalleryPhoto(editing.id, { title: form.title, category: form.category }, form.imageFile);
      await loadGallery();
      setShowModal(false);
      setEditing(null);
      setForm({ title: '', category: '', imageFile: null, imagePreview: '' });
    } catch (err: any) {
      console.error('Failed to update photo', err);
      let errorMessage = 'Unable to update photo.';
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        errorMessage = err.response.data.errors.map((e: any) => `${e.path}: ${e.msg}`).join('\n');
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const remove = (item: GalleryItem) => {
    setDeleteModal({ open: true, id: item.id, title: item.title });
  };

  const confirmDelete = async () => {
    if (!deleteModal.id) return;
    setIsDeleting(true);
    try {
      await deleteGalleryPhoto(deleteModal.id);
      setItems((s) => s.filter((i) => i.id !== deleteModal.id));
      setDeleteModal({ open: false, id: null, title: '' });
    } catch (err: any) {
      console.error('Failed to delete photo', err);
      setError('Unable to delete photo.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {error && <ErrorModal message={error} onClose={() => setError(null)} />}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gallery Manager</h2>
          <p className="text-gray-500 mt-1 text-sm">Manage gallery photos shown on the site - {items.length} images</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg font-medium"
        >
          <PlusIcon />
          <span>Add Photo</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          <GallerySkeletonGrid count={8} />
        ) : items.length === 0 ? (
          <div className="col-span-full bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="flex justify-center mb-4 text-gray-400">
              <ImageIcon />
            </div>
            <p className="text-gray-600 mb-4">No gallery images yet</p>
            <button
              onClick={openAdd}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add your first photo
            </button>
          </div>
        ) : (
          items.map((i) => (
            <div key={i.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                {i.imageUrl ? (
                  <img src={toMediaUrl(i.imageUrl)} alt={i.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-gray-400">
                    <ImageIcon />
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 flex-1">{i.title}</h3>
                  <span className="text-sm text-gray-600 ml-2">{i.category}</span>
                </div>
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => startEdit(i)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
                  >
                    <EditIcon />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => remove(i)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                  >
                    <TrashIcon />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">

            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{editing ? 'Edit Photo' : 'Add New Photo'}</h3>
                <p className="text-gray-500 text-sm mt-1">{editing ? 'Update your gallery photo details' : 'Add a stunning photo to your gallery'}</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                type="button"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Form */}
            <div className="overflow-y-auto p-6">
              <form onSubmit={editing ? saveEdit : handleAdd} className="space-y-6">
                {/* Text Inputs */}
                <div className="grid gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Photo Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      maxLength={30}
                      required
                      className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 shadow-sm outline-none transition-all"
                      placeholder="e.g., Sunset at the Beach"
                    />
                    <p className="text-xs text-gray-500 mt-1">Max 80 characters.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 shadow-sm outline-none transition-all"
                    >
                      <option value="">Select category</option>
                      {categories.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Image Upload Area */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Photo Image {editing ? <span className="font-normal text-gray-500">(Locked during edit)</span> : <span className="text-red-500">*</span>}
                  </label>

                  {editing ? (
                    <div>
                      <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm aspect-video bg-gray-50 flex items-center justify-center">
                        {form.imagePreview ? (
                          <img
                            src={form.imagePreview}
                            alt="preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-gray-400 text-sm">Existing image unavailable</div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Image cannot be changed while editing.</p>
                    </div>
                  ) : (
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
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 mt-3"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-gray-400">JPG, PNG, WEBP (Max 10MB)</p>
                          </div>
                          <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
                        </label>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
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
                    {isSaving ? 'Saving...' : editing ? 'Update Photo' : 'Add Photo'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <DeleteModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null, title: '' })}
        onConfirm={confirmDelete}
        title="Delete Photo"
        message="Are you sure you want to delete this photo?"
        itemTitle={deleteModal.title}
        isDeleting={isDeleting}
      />
    </div>
  );
}
