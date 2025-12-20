import { useEffect, useState } from 'react';
import { createGalleryPhoto, deleteGalleryPhoto, fetchGallery, toMediaUrl, updateGalleryPhoto } from '../api/client';

type GalleryItem = { id: string; title: string; category?: string; imageUrl?: string };

type FormState = { title: string; category: string; imageFile: File | null; imagePreview: string };

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const ImageIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
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

export default function GalleryManager() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<FormState>({ title: '', category: '', imageFile: null, imagePreview: '' });
  const [isSaving, setIsSaving] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setForm((p) => ({ ...p, imageFile: file, imagePreview: preview }));
  };

  const loadGallery = async () => {
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
    if (!form.imageFile) {
      alert('Please select an image.');
      return;
    }
    setIsSaving(true);
    try {
      await createGalleryPhoto({ title: form.title, category: form.category }, form.imageFile);
      await loadGallery();
      setShowModal(false);
    } catch (err) {
      console.error('Failed to create photo', err);
      alert('Unable to add photo.');
    } finally {
      setIsSaving(false);
    }
  };

  const startEdit = (g: GalleryItem) => {
    setEditing(g);
    setForm({ title: g.title, category: g.category || '', imageFile: null, imagePreview: g.imageUrl ? toMediaUrl(g.imageUrl) : '' });
    setShowModal(true);
  };

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setIsSaving(true);
    try {
      await updateGalleryPhoto(editing.id, { title: form.title, category: form.category }, form.imageFile);
      await loadGallery();
      setShowModal(false);
      setEditing(null);
    } catch (err) {
      console.error('Failed to update photo', err);
      alert('Unable to update photo.');
    } finally {
      setIsSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this image?')) return;
    try {
      await deleteGalleryPhoto(id);
      setItems((s) => s.filter(i => i.id !== id));
    } catch (err) {
      console.error('Failed to delete photo', err);
      alert('Unable to delete photo.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Gallery <span className="text-sm text-gray-500 font-normal">({items.length} saved)</span></h2>
          <p className="text-sm text-gray-600 mt-1">Manage gallery photos shown on the site</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <PlusIcon />
          <span className="font-medium">Add Photo</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.length === 0 && (
          <div className="col-span-full bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="flex justify-center mb-4 text-gray-400"><ImageIcon /></div>
            <p className="text-gray-600 mb-4">No gallery images yet</p>
            <button onClick={openAdd} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Add your first photo</button>
          </div>
        )}

        {items.map(i => (
          <div key={i.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
              {i.imageUrl ? (
                <img src={toMediaUrl(i.imageUrl)} alt={i.title} className="w-full h-full object-cover" />
              ) : (
                <div className="text-gray-400"><ImageIcon /></div>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 flex-1">{i.title}</h3>
                <span className="text-sm text-gray-600 ml-2">{i.category}</span>
              </div>
              <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                <button onClick={() => startEdit(i)} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium">
                  <EditIcon />
                  <span>Edit</span>
                </button>
                <button onClick={() => remove(i.id)} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium">
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
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {editing ? 'Edit Photo' : 'Add New Photo'}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {editing ? 'Update your gallery photo details' : 'Add a stunning photo to your gallery'}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-xl transition-all shadow-sm"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto flex-1">
              <form onSubmit={editing ? saveEdit : handleAdd} className="p-8 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Photo Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    required
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="e.g., Sunset at the Beach"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <input
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="e.g., Nature, Travel, Food"
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    Photo Image
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
                  <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 rounded-lg bg-gray-100 text-gray-700">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-70"
                  >
                    {isSaving ? 'Saving...' : editing ? 'Save Changes' : 'Add Photo'}
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
