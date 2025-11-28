import { useEffect, useState } from 'react';

type Deal = { id: number; title: string; description?: string; price?: string; image?: string };

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
  const [form, setForm] = useState({ title: '', description: '', price: '', image: '' });

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, image: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem('deals');
      console.debug('DealsManager: read raw deals from localStorage:', raw ? `${raw.length} chars` : 'null');
      if (!raw) {
        setItems([]);
        return;
      }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) setItems(parsed);
      else setItems([]);
    } catch (e) {
      console.warn('DealsManager: failed to read/parse localStorage deals:', e);
      setItems([]);
    }
  }, []);

  useEffect(() => { 
    try {
      // Prevent accidental overwrite of existing non-empty stored data with an empty array
      if (items.length === 0) {
        const existingRaw = localStorage.getItem('deals');
        try {
          const existing = existingRaw ? JSON.parse(existingRaw) : null;
          if (Array.isArray(existing) && existing.length > 0) {
            console.warn('DealsManager: skipping write of empty deals array to avoid overwriting existing data');
            return;
          }
        } catch (e) {
          // if parsing existing fails, proceed to write
        }
      }

      const payload = JSON.stringify(items);
      localStorage.setItem('deals', payload);
      console.debug('DealsManager: wrote deals to localStorage, count=', items.length, 'chars=', payload.length);
      try { window.dispatchEvent(new CustomEvent('local-storage-updated', { detail: { key: 'deals' } })); } catch (e) {}
    } catch (e) {
      console.error('DealsManager: failed to write deals to localStorage', e);
    }
  }, [items]);

  // small debug: expose a visible count so it's easier to confirm persistence after reload
  const savedCount = items.length;

  const openAddModal = () => {
    setEditing(null);
    setForm({ title: '', description: '', price: '', image: '' });
    setShowModal(true);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: Deal = { id: Date.now(), title: form.title, description: form.description, price: form.price, image: form.image };
    setItems((s) => [newItem, ...s]);
    setForm({ title: '', description: '', price: '', image: '' });
    setShowModal(false);
  };

  const startEdit = (d: Deal) => {
    setEditing(d);
    setForm({ title: d.title, description: d.description || '', price: d.price || '', image: d.image || '' });
    setShowModal(true);
  };

  const saveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setItems((s) => s.map(i => i.id === editing.id ? { ...i, title: form.title, description: form.description, price: form.price, image: form.image } : i));
    setEditing(null);
    setForm({ title: '', description: '', price: '', image: '' });
    setShowModal(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    setForm({ title: '', description: '', price: '', image: '' });
  };

  const remove = (id: number) => {
    if (!confirm('Delete this deal?')) return;
    setItems((s) => s.filter(i => i.id !== id));
  };

  return (
    <div>
      {/* Header */}
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

      {/* Deals Grid */}
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
              {i.image ? (
                <img src={i.image} alt="deal" className="w-full h-full object-cover" />
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header - Enhanced */}
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

            {/* Modal Body - Scrollable */}
            <div className="overflow-y-auto flex-1">
              <form onSubmit={editing ? saveEdit : handleAdd} className="p-8 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Deal Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    placeholder="e.g., Summer Special - 50% Off"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none"
                    placeholder="Describe your amazing deal..."
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price / Discount
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-amber-600 font-semibold">
                      💰
                    </div>
                    <input
                      value={form.price}
                      onChange={e => setForm({ ...form, price: e.target.value })}
                      className="w-full border-2 border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      placeholder="e.g., $99 or 20% OFF"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    Deal Image
                  </label>
                  
                  <div className="flex gap-2">
                    <input
                      value={form.image}
                      onChange={e => setForm({ ...form, image: e.target.value })}
                      className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      placeholder="https://example.com/deal-image.jpg"
                    />
                    {form.image && form.image.startsWith('http') && (
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, image: '' })}
                        className="px-4 py-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors font-semibold text-sm"
                        title="Clear URL"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  
                  <label className="flex items-center justify-center gap-3 w-full border-3 border-dashed border-gray-300 rounded-xl px-6 py-5 cursor-pointer hover:border-amber-400 hover:bg-amber-50 transition-all group">
                    <svg className="w-5 h-5 text-amber-600 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <div className="text-center">
                      <span className="text-sm font-semibold text-gray-700 group-hover:text-amber-600 transition-colors">
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
                  
                  {form.image && (
                    <div className="mt-4 w-full h-48 overflow-hidden rounded-xl border-2 border-gray-200 shadow-sm relative group">
                      <img 
                        src={form.image} 
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
                onClick={closeModal}
                className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={editing ? saveEdit : handleAdd}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all font-semibold shadow-lg hover:shadow-xl"
              >
                {editing ? ' Save Changes' : ' Create Deal'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}