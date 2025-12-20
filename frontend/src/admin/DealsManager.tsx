import { useEffect, useState } from 'react';
import { createDeal, deleteDeal, fetchDeals, toMediaUrl, updateDeal } from '../api/client';

type Deal = { id: string; title: string; description?: string; price?: string; imageUrl?: string };

type FormState = { title: string; description: string; price: string; imageFile: File | null; imagePreview: string };

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

export default function DealsManager() {
  const [items, setItems] = useState<Deal[]>([]);
  const [editing, setEditing] = useState<Deal | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<FormState>({ title: '', description: '', price: '', imageFile: null, imagePreview: '' });
  const [isSaving, setIsSaving] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, imageFile: file, imagePreview: preview }));
  };

  const loadDeals = async () => {
    try {
      const res = await fetchDeals();
      const mapped = (res.items || []).map((deal: any) => ({
        id: deal._id,
        title: deal.title,
        description: deal.description,
        price: deal.price ? String(deal.price) : '',
        imageUrl: deal.imageUrl,
      }));
      setItems(mapped);
    } catch (err) {
      console.error('Failed to load deals', err);
      setItems([]);
    }
  };

  useEffect(() => {
    loadDeals();
  }, []);

  const openAddModal = () => {
    setEditing(null);
    setForm({ title: '', description: '', price: '', imageFile: null, imagePreview: '' });
    setShowModal(true);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.imageFile) {
      alert('Please select an image.');
      return;
    }
    setIsSaving(true);
    try {
      await createDeal({
        title: form.title,
        description: form.description,
        price: form.price ? Number(form.price) : undefined,
      }, form.imageFile);
      await loadDeals();
      setShowModal(false);
    } catch (err) {
      console.error('Failed to create deal', err);
      alert('Unable to create deal.');
    } finally {
      setIsSaving(false);
    }
  };

  const startEdit = (d: Deal) => {
    setEditing(d);
    setForm({
      title: d.title,
      description: d.description || '',
      price: d.price || '',
      imageFile: null,
      imagePreview: d.imageUrl ? toMediaUrl(d.imageUrl) : '',
    });
    setShowModal(true);
  };

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setIsSaving(true);
    try {
      await updateDeal(editing.id, {
        title: form.title,
        description: form.description,
        price: form.price ? Number(form.price) : undefined,
      }, form.imageFile);
      await loadDeals();
      setEditing(null);
      setShowModal(false);
    } catch (err) {
      console.error('Failed to update deal', err);
      alert('Unable to update deal.');
    } finally {
      setIsSaving(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    setForm({ title: '', description: '', price: '', imageFile: null, imagePreview: '' });
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this deal?')) return;
    try {
      await deleteDeal(id);
      setItems((s) => s.filter(i => i.id !== id));
    } catch (err) {
      console.error('Failed to delete deal', err);
      alert('Unable to delete deal.');
    }
  };

  const savedCount = items.length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Deals <span className="text-sm text-gray-500 font-normal">({savedCount} saved)</span>
            </h2>
            <p className="text-sm text-gray-600 mt-1">Manage your special deals and offers</p>
          </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon />
          <span className="font-medium">Add Deal</span>
        </button>
      </div>

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
            <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
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
              {i.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{i.description}</p>
              )}
              <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                <button
                  onClick={() => startEdit(i)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
                >
                  <EditIcon />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => remove(i.id)}
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

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-orange-50">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {editing ? 'Edit Deal' : 'Create New Deal'}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {editing ? 'Update your deal details' : 'Add a new special offer to attract customers'}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-xl transition-all shadow-sm"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="overflow-y-auto flex-1">
              <form onSubmit={editing ? saveEdit : handleAdd} className="p-8 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Deal Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    required
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    placeholder="e.g., Summer Beach Getaway"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    placeholder="Describe the deal"
                    rows={3}
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price
                  </label>
                  <input
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    placeholder="e.g., 299"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Deal Image
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                    {form.imagePreview ? (
                      <img src={form.imagePreview} alt="preview" className="w-full h-48 object-cover rounded-lg mb-4" />
                    ) : (
                      <div className="text-gray-400 flex flex-col items-center">
                        <ImageIcon />
                        <p className="text-sm mt-2">Upload an image</p>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={handleFile} className="mt-4" />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button type="button" onClick={closeModal} className="px-6 py-2 rounded-lg bg-gray-100 text-gray-700">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-70"
                  >
                    {isSaving ? 'Saving...' : editing ? 'Save Changes' : 'Create Deal'}
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
