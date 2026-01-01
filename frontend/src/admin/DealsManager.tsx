import { useEffect, useState } from 'react';
import DeleteModal from './DeleteModal';
import { createDeal, deleteDeal, fetchDeals, toMediaUrl, updateDeal } from '../api/client';
import LoadingState from '../components/LoadingState';

type Deal = {
  id: string;
  title: string;
  tagline?: string;
  duration?: string;
  inclusions?: string[];
  price?: string;
  discount?: string;
  spotsLeft?: number;
  expiryDate?: string;
  isActive?: boolean;
  imageUrl?: string
};

type FormState = {
  title: string;
  tagline: string;
  duration: string;
  inclusions: string[];
  price: string;
  discount: string;
  spotsLeft: string;
  expiryDate: string;
  isActive: boolean;
  imageFile: File | null;
  imagePreview: string
};

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const TagIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
);

const ImageIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const UploadIcon = () => (
  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2m-4-6l-4-4m0 0l-4 4m4-4v12" />
  </svg>
);

// New Error Modal Component
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

export default function DealsManager() {
  const [items, setItems] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Deal | null>(null);
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
    tagline: '',
    duration: '',
    inclusions: [],
    price: '',
    discount: '',
    spotsLeft: '',
    expiryDate: '',
    isActive: true,
    imageFile: null,
    imagePreview: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [inclusionInput, setInclusionInput] = useState('');

  // Duration state
  const [durationType, setDurationType] = useState<'days' | 'nights' | 'days-nights'>('days');
  const [durationDays, setDurationDays] = useState('');
  const [durationNights, setDurationNights] = useState('');

  const durationPattern = /^[1-9]\d*\s*(Day|Days|Night|Nights)(\s+[1-9]\d*\s*(Day|Days|Night|Nights))?$/i;

  const isValidDuration = (value: string) => durationPattern.test(value.trim());

  // Build duration string from separate inputs
  const buildDurationString = (): string => {
    if (durationType === 'days') {
      const val = parseInt(durationDays);
      if (!val || val <= 0) return '';
      return `${val} ${val === 1 ? 'Day' : 'Days'}`;
    } else if (durationType === 'nights') {
      const val = parseInt(durationNights);
      if (!val || val <= 0) return '';
      return `${val} ${val === 1 ? 'Night' : 'Nights'}`;
    } else if (durationType === 'days-nights') {
      const days = parseInt(durationDays);
      const nights = parseInt(durationNights);
      if (!days || days <= 0 || !nights || nights <= 0) return '';
      return `${days} ${days === 1 ? 'Day' : 'Days'} ${nights} ${nights === 1 ? 'Night' : 'Nights'}`;
    }
    return '';
  };

  // Parse duration string into separate inputs
  const parseDurationString = (duration: string) => {
    if (!duration) {
      setDurationType('days');
      setDurationDays('');
      setDurationNights('');
      return;
    }

    const combinedMatch = duration.match(/^(\d+)\s+(Day|Days)\s+(\d+)\s+(Night|Nights)$/i);
    if (combinedMatch) {
      setDurationType('days-nights');
      setDurationDays(combinedMatch[1]);
      setDurationNights(combinedMatch[3]);
      return;
    }

    const daysMatch = duration.match(/^(\d+)\s+(Day|Days)$/i);
    if (daysMatch) {
      setDurationType('days');
      setDurationDays(daysMatch[1]);
      setDurationNights('');
      return;
    }

    const nightsMatch = duration.match(/^(\d+)\s+(Night|Nights)$/i);
    if (nightsMatch) {
      setDurationType('nights');
      setDurationNights(nightsMatch[1]);
      setDurationDays('');
      return;
    }

    // Default fallback
    setDurationType('days');
    setDurationDays('');
    setDurationNights('');
  };

  const cleanupPreview = (url: string) => {
    if (url && url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  };

  const addInclusion = () => {
    const value = inclusionInput.trim();
    if (!value) return;
    if (form.inclusions.includes(value)) {
      setError('Inclusion already added.');
      return;
    }
    setForm((prev) => ({ ...prev, inclusions: [...prev.inclusions, value] }));
    setInclusionInput('');
  };

  const removeInclusion = (index: number) => {
    setForm((prev) => ({ ...prev, inclusions: prev.inclusions.filter((_, i) => i !== index) }));
  };

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

    cleanupPreview(form.imagePreview);
    const preview = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, imageFile: file, imagePreview: preview }));
    e.target.value = '';
  };

  const loadDeals = async () => {
    try {
      const res = await fetchDeals();
      const mapped = (res.items || []).map((deal: any) => ({
        id: deal._id,
        title: deal.title,
        tagline: deal.tagline,
        duration: deal.duration,
        inclusions: deal.inclusions || [],
        price: deal.price ? String(deal.price) : '',
        discount: deal.discount ? String(deal.discount) : '',
        spotsLeft: typeof deal.spotsLeft === 'number' ? deal.spotsLeft : undefined,
        expiryDate: deal.expiryDate,
        isActive: deal.isActive,
        imageUrl: deal.imageUrl,
      }));
      setItems(mapped);
    } catch (err) {
      console.error('Failed to load deals', err);
      // No alert on load fail, just empty list
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeals();
  }, []);

  const openAddModal = () => {
    setEditing(null);
    cleanupPreview(form.imagePreview);
    setForm({
      title: '',
      tagline: '',
      duration: '',
      inclusions: [],
      price: '',
      discount: '',
      spotsLeft: '',
      expiryDate: '',
      isActive: true,
      imageFile: null,
      imagePreview: ''
    });
    setInclusionInput('');
    setDurationType('days');
    setDurationDays('');
    setDurationNights('');
    setShowModal(true);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.imageFile) {
      setError('Please select an image.');
      return;
    }

    const builtDuration = buildDurationString();
    if (!builtDuration) {
      setError('Please provide a valid duration.');
      return;
    }
    if (form.title.length > 80) {
      setError('Title must be 80 characters or fewer.');
      return;
    }
    const numericPrice = form.price ? Number(form.price) : undefined;
    if (!numericPrice || numericPrice <= 0) {
      setError('Price must be greater than 0.');
      return;
    }

    const numericDiscount = form.discount ? Number(form.discount) : undefined;
    if (numericDiscount !== undefined && numericDiscount <= 0) {
      setError('Discount must be greater than 0 if provided.');
      return;
    }

    const numericSpots = form.spotsLeft ? Number(form.spotsLeft) : undefined;
    if (numericSpots !== undefined && numericSpots > 999) {
      setError('Spots left must be below 1000.');
      return;
    }
    if (numericSpots !== undefined && numericSpots <= 0) {
      setError('Spots left must be greater than 0.');
      return;
    }
    setIsSaving(true);
    try {
      const newDeal = await createDeal({
        title: form.title,
        tagline: form.tagline,
        duration: builtDuration,
        inclusions: form.inclusions,
        price: numericPrice,
        discount: numericDiscount,
        spotsLeft: numericSpots,
        expiryDate: form.expiryDate || undefined,
        isActive: form.isActive,
      }, form.imageFile);

      await loadDeals();
      setForm({
        title: '',
        tagline: '',
        duration: '',
        inclusions: [],
        price: '',
        discount: '',
        spotsLeft: '',
        expiryDate: '',
        isActive: true,
        imageFile: null,
        imagePreview: ''
      });
      setInclusionInput('');
      setDurationType('days');
      setDurationDays('');
      setDurationNights('');
      setShowModal(false);
    } catch (err: any) {
      console.error('Failed to create deal', err);
      let errorMessage = 'Unable to create deal. Please check your inputs.';
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

  const startEdit = (d: Deal) => {
    setEditing(d);
    cleanupPreview(form.imagePreview);
    setForm({
      title: d.title,
      tagline: d.tagline || '',
      duration: d.duration || '',
      inclusions: d.inclusions || [],
      price: d.price || '',
      discount: d.discount || '',
      spotsLeft: d.spotsLeft != null ? String(d.spotsLeft) : '',
      expiryDate: d.expiryDate ? d.expiryDate.substring(0, 10) : '',
      isActive: d.isActive !== false,
      imageFile: null,
      imagePreview: d.imageUrl ? toMediaUrl(d.imageUrl) : '',
    });
    setInclusionInput('');
    parseDurationString(d.duration || '');
    setShowModal(true);
  };

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    const builtDuration = buildDurationString();
    if (!builtDuration) {
      setError('Please provide a valid duration.');
      return;
    }
    if (form.title.length > 80) {
      setError('Title must be 80 characters or fewer.');
      return;
    }
    const numericPrice = form.price ? Number(form.price) : undefined;
    if (!numericPrice || numericPrice <= 0) {
      setError('Price must be greater than 0.');
      return;
    }

    const numericDiscount = form.discount ? Number(form.discount) : undefined;
    if (numericDiscount !== undefined && numericDiscount <= 0) {
      setError('Discount must be greater than 0 if provided.');
      return;
    }

    const numericSpots = form.spotsLeft ? Number(form.spotsLeft) : undefined;
    if (numericSpots !== undefined && numericSpots > 999) {
      setError('Spots left must be below 1000.');
      return;
    }
    if (numericSpots !== undefined && numericSpots <= 0) {
      setError('Spots left must be greater than 0.');
      return;
    }
    setIsSaving(true);
    try {
      await updateDeal(editing.id, {
        title: form.title,
        tagline: form.tagline,
        duration: builtDuration,
        inclusions: form.inclusions,
        price: numericPrice,
        discount: numericDiscount,
        spotsLeft: numericSpots,
        expiryDate: form.expiryDate || undefined,
        isActive: form.isActive,
      }, form.imageFile);
      await loadDeals();
      cleanupPreview(form.imagePreview);
      setEditing(null);
      setShowModal(false);
    } catch (err: any) {
      console.error('Failed to update deal', err);
      let errorMessage = 'Unable to update deal.';
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

  const closeModal = () => {
    cleanupPreview(form.imagePreview);
    setShowModal(false);
    setEditing(null);
    setForm({ title: '', tagline: '', duration: '', inclusions: [], price: '', discount: '', spotsLeft: '', expiryDate: '', isActive: true, imageFile: null, imagePreview: '' });
    setInclusionInput('');
    setDurationType('days');
    setDurationDays('');
    setDurationNights('');
  };

  const remove = (deal: Deal) => {
    setDeleteModal({ open: true, id: deal.id, title: deal.title });
  };

  const confirmDelete = async () => {
    if (!deleteModal.id) return;
    setIsDeleting(true);
    try {
      await deleteDeal(deleteModal.id);
      setItems((s) => s.filter(i => i.id !== deleteModal.id));
      setDeleteModal({ open: false, id: null, title: '' });
    } catch (err: any) {
      console.error('Failed to delete deal', err);
      setError('Unable to delete deal.');
    } finally {
      setIsDeleting(false);
    }
  };

  const savedCount = items.length;

  return (
    <div className="max-w-7xl mx-auto">
      {error && <ErrorModal message={error} onClose={() => setError(null)} />}
      <DeleteModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null, title: '' })}
        onConfirm={confirmDelete}
        title="Delete Deal"
        message="Are you sure you want to delete this deal? This action cannot be undone."
        itemTitle={deleteModal.title}
        isDeleting={isDeleting}
      />

      <div className="flex items-center justify-between mb-6">
        <div>

          <p className="text-sm text-gray-600 mt-1">Manage your special deals and offers - {savedCount}</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon />
          <span className="font-medium">Add Deal</span>
        </button>
      </div>


      {loading ? (
        <LoadingState count={6} className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.length === 0 && (
            <div className="col-span-full bg-white rounded-lg border border-gray-200 p-12 text-center">
              <div className="flex justify-center mb-4 text-gray-400">
                <TagIcon />
              </div>
              <p className="text-gray-600 mb-4">No deals available yet</p>
              <button
                onClick={openAddModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create your first deal
              </button>
            </div>
          )}

          {items.map(i => (
            <div key={i.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                {i.imageUrl ? (
                  <img src={toMediaUrl(i.imageUrl)} alt="deal" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-gray-400">
                    <ImageIcon />
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 flex-1">{i.title}</h3>
                  {i.price && (
                    <span className="text-green-600 font-semibold ml-2">{i.price}</span>
                  )}
                </div>
                {i.tagline && <p className="text-xs text-blue-600 font-medium mb-1">{i.tagline}</p>}
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
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">

            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {editing ? 'Edit Deal' : 'Create New Deal'}
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  {editing ? 'Update your deal details' : 'Add a new special offer to attract customers'}
                </p>
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
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Deal Title <span className="text-red-500">*</span>
                    <span className={`ml-2 text-xs ${form.title.length > 80 ? 'text-red-500' : 'text-gray-400'}`}>
                      {form.title.length}/80
                    </span>
                  </label>
                  <input
                    value={form.title}
                    onChange={e => {
                      if (e.target.value.length <= 80) {
                        setForm({ ...form, title: e.target.value });
                      }
                    }}
                    required
                    className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 shadow-sm outline-none transition-all"
                    placeholder="e.g., Summer Beach Getaway"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tagline (location or short text) <span className="text-red-500">*</span>
                    <span className={`ml-2 text-xs ${form.tagline.length > 80 ? 'text-red-500' : 'text-gray-400'}`}>
                      {form.tagline.length}/80
                    </span>
                  </label>
                  <input
                    value={form.tagline}
                    onChange={(e) => {
                      if (e.target.value.length <= 80) {
                        setForm({ ...form, tagline: e.target.value });
                      }
                    }}
                    required
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:border-transparent transition-all"
                    placeholder="e.g., Mirissa & Unawatuna"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Duration <span className="text-red-500">*</span>
                    </label>

                    {/* Duration Type Selector */}
                    <div className="mb-3">
                      <select
                        value={durationType}
                        onChange={(e) => {
                          setDurationType(e.target.value as 'days' | 'nights' | 'days-nights');
                          setDurationDays('');
                          setDurationNights('');
                        }}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                        <option value="days">Days Only</option>
                        <option value="nights">Nights Only</option>
                        <option value="days-nights">Days & Nights</option>
                      </select>
                    </div>

                    {/* Duration Value Inputs */}
                    {durationType === 'days-nights' ? (
                      <div className="space-y-2">
                        <input
                          type="number"
                          min={1}
                          value={durationDays}
                          onChange={(e) => setDurationDays(e.target.value)}
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Days (e.g., 3)"
                          required
                        />
                        <input
                          type="number"
                          min={1}
                          value={durationNights}
                          onChange={(e) => setDurationNights(e.target.value)}
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Nights (e.g., 2)"
                          required
                        />
                      </div>
                    ) : durationType === 'days' ? (
                      <input
                        type="number"
                        min={1}
                        value={durationDays}
                        onChange={(e) => setDurationDays(e.target.value)}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="e.g., 3"
                        required
                      />
                    ) : (
                      <input
                        type="number"
                        min={1}
                        value={durationNights}
                        onChange={(e) => setDurationNights(e.target.value)}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="e.g., 2"
                        required
                      />
                    )}

                    <p className="mt-2 text-xs text-gray-500">
                      {durationType === 'days' && 'Enter number of days (e.g., 3 Days)'}
                      {durationType === 'nights' && 'Enter number of nights (e.g., 2 Nights)'}
                      {durationType === 'days-nights' && 'Enter both days and nights (e.g., 3 Days 2 Nights)'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Price (USD) <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={form.price}
                      onChange={e => setForm({ ...form, price: e.target.value.replace(/\D/g, '') })}
                      required
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:border-transparent transition-all"
                      placeholder="e.g., 299"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Inclusions (add as tags)</label>
                  <div className="flex gap-2">
                    <input
                      value={inclusionInput}
                      onChange={(e) => setInclusionInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addInclusion();
                        }
                      }}
                      className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:border-transparent transition-all"
                      placeholder="e.g., Beach Resort Stay"
                    />
                    <button
                      type="button"
                      onClick={addInclusion}
                      className="px-4 py-2.5 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all font-semibold text-sm shadow-sm whitespace-nowrap"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {form.inclusions.map((inc, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-2 bg-gray-50 text-gray-800 border border-gray-200 rounded-full px-3 py-1 text-sm"
                      >
                        {inc}
                        <button type="button" onClick={() => removeInclusion(idx)} className="text-gray-700 hover:text-gray-900">
                          <CloseIcon />
                        </button>
                      </span>
                    ))}
                    {form.inclusions.length === 0 && (
                      <span className="text-xs text-gray-400">No inclusions added yet.</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Discount (%)
                    </label>
                    <input
                      value={form.discount}
                      onChange={(e) => {
                        const raw = e.target.value;
                        if (raw === '') {
                          setForm({ ...form, discount: '' });
                          return;
                        }
                        let val = Number(raw);
                        if (Number.isNaN(val)) {
                          setForm({ ...form, discount: '' });
                          return;
                        }
                        val = Math.min(100, Math.max(1, val));
                        setForm({ ...form, discount: String(val) });
                      }}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:border-transparent transition-all"
                      placeholder="e.g., 10"
                      type="number"
                      min="1"
                      max="100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Spots Left
                    </label>
                    <input
                      value={form.spotsLeft}
                      onChange={(e) => {
                        const raw = e.target.value;
                        if (raw === '') {
                          setForm({ ...form, spotsLeft: '' });
                          return;
                        }
                        const clamped = Math.min(999, Math.max(1, Number(raw)));
                        setForm({ ...form, spotsLeft: String(clamped) });
                      }}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:border-transparent transition-all"
                      placeholder="e.g., 20"
                      type="number"
                      min="1"
                      max="999"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Expiry Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={form.expiryDate}
                      onChange={e => setForm({ ...form, expiryDate: e.target.value })}
                      required
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:border-transparent transition-all"
                      type="date"
                      min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="inline-flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-xl cursor-pointer hover:bg-gray-100 transition-all w-full">
                      <input
                        type="checkbox"
                        checked={form.isActive}
                        onChange={e => setForm({ ...form, isActive: e.target.checked })}
                        className="h-5 w-5 text-gray-600 rounded"
                      />
                      <span className="text-sm font-semibold text-gray-700">Active</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Deal Image <span className="text-red-500">*</span>
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
                          <p className="text-xs text-gray-400">JPG, PNG, WEBP, GIF (Max 10MB)</p>
                        </div>
                        <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
                      </label>
                    )}
                  </div>
                </div>

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
                    {isSaving ? 'Saving...' : editing ? 'Update Deal' : 'Create Deal'}
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
