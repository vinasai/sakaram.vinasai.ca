import { useEffect, useState } from 'react';

type GalleryItem = { id: number; title: string; category?: string; url?: string; image?: string };

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
  const [form, setForm] = useState({ title: '', category: '', url: '', image: '' });

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((p) => ({ ...p, image: reader.result as string }));
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem('gallery');
      console.debug('GalleryManager: read raw gallery from localStorage:', raw ? `${raw.length} chars` : 'null');
      if (!raw) { setItems([]); return; }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) setItems(parsed);
      else setItems([]);
    } catch (e) {
      console.warn('GalleryManager: failed to read/parse gallery from localStorage', e);
      setItems([]);
    }
  }, []);

  useEffect(() => {
    try {
      if (items.length === 0) {
        const existingRaw = localStorage.getItem('gallery');
        try {
          const existing = existingRaw ? JSON.parse(existingRaw) : null;
          if (Array.isArray(existing) && existing.length > 0) {
            console.warn('GalleryManager: skipping write of empty gallery to avoid overwriting existing data');
            return;
          }
        } catch (e) {
          // proceed to write if parse fails
        }
      }

      const payload = JSON.stringify(items);
      localStorage.setItem('gallery', payload);
      console.debug('GalleryManager: wrote gallery to localStorage, count=', items.length, 'chars=', payload.length);
      try { window.dispatchEvent(new CustomEvent('local-storage-updated', { detail: { key: 'gallery' } })); } catch (e) {}
    } catch (e) {
      console.error('GalleryManager: failed to write gallery to localStorage', e);
    }
  }, [items]);

  const openAdd = () => {
    setEditing(null);
    setForm({ title: '', category: '', url: '', image: '' });
    setShowModal(true);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: GalleryItem = { id: Date.now(), title: form.title, category: form.category, url: form.url, image: form.image };
    setItems((s) => [newItem, ...s]);
    setForm({ title: '', category: '', url: '', image: '' });
    setShowModal(false);
  };

  const startEdit = (g: GalleryItem) => {
    setEditing(g);
    setForm({ title: g.title, category: g.category || '', url: g.url || '', image: g.image || '' });
    setShowModal(true);
  };

  const saveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setItems((s) => s.map(i => i.id === editing.id ? { ...i, title: form.title, category: form.category, url: form.url, image: form.image } : i));
    setEditing(null);
    setForm({ title: '', category: '', url: '', image: '' });
    setShowModal(false);
  };

  const remove = (id: number) => {
    if (!confirm('Delete this image?')) return;
    setItems((s) => s.filter(i => i.id !== id));
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
              {i.image || i.url ? (
                <img src={i.image || i.url} alt={i.title} className="w-full h-full object-cover" />
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
            {/* Modal Header - Enhanced */}
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

            {/* Modal Body - Scrollable */}
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
                  
                  <div className="flex gap-2">
                    <input
                      value={form.url}
                      onChange={e => setForm({ ...form, url: e.target.value })}
                      placeholder="https://example.com/photo.jpg"
                      className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                    {form.url && form.url.startsWith('http') && (
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, url: '', image: '' })}
                        className="px-4 py-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors font-semibold text-sm"
                        title="Clear URL"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  
                  <label className="flex items-center justify-center gap-3 w-full border-3 border-dashed border-gray-300 rounded-xl px-6 py-5 cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all group">
                    <svg className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <div className="text-center">
                      <span className="text-sm font-semibold text-gray-700 group-hover:text-purple-600 transition-colors">
                        Upload from Device
                      </span>
                      <p className="text-xs text-gray-500 mt-0.5">JPG, PNG, WEBP up to 10MB</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFile}
                      className="hidden"
                    />
                  </label>
                  
                  {(form.image || form.url) && (
                    <div className="mt-4 w-full h-48 overflow-hidden rounded-xl border-2 border-gray-200 shadow-sm relative group">
                      <img 
                        src={form.image || form.url} 
                        alt="preview" 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent && !parent.querySelector('.error-msg')) {
                            const errorDiv = document.createElement('div');
                            errorDiv.className = 'error-msg flex items-center justify-center h-full bg-red-50 text-red-600 text-sm';
                            errorDiv.textContent = 'Failed to load image. Check URL.';
                            parent.appendChild(errorDiv);
                          }
                        }}
                      />
                      <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                        Preview
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Modal Footer - Fixed */}
            <div className="flex gap-4 px-8 py-6 border-t border-gray-200 bg-gray-50">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={editing ? saveEdit : handleAdd}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-semibold shadow-lg hover:shadow-xl"
              >
                {editing ? 'Save Changes' : 'Add Photo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
