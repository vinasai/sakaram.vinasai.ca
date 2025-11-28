import { useEffect, useState } from 'react';

type Inquiry = { id: number; name: string; email: string; phone: string; message: string };

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const MailIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const EmailIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const MessageIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function Inquiries() {
  const [items, setItems] = useState<Inquiry[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('inquiries');
      console.debug('Inquiries: read raw inquiries from localStorage:', raw ? `${raw.length} chars` : 'null');
      setItems(raw ? JSON.parse(raw) : []);
    } catch (e) {
      console.warn('Inquiries: failed to read/parse inquiries', e);
      setItems([]);
    }
  }, []);

  const remove = (id: number) => {
    if (!confirm('Delete this inquiry?')) return;
    const next = items.filter(i => i.id !== id);
    setItems(next);
    try {
      const payload = JSON.stringify(next);
      localStorage.setItem('inquiries', payload);
      console.debug('Inquiries: wrote inquiries to localStorage, count=', next.length, 'chars=', payload.length);
      try { window.dispatchEvent(new CustomEvent('local-storage-updated', { detail: { key: 'inquiries' } })); } catch (e) {}
    } catch (e) {
      console.error('Inquiries: failed to write inquiries to localStorage', e);
    }
  };

  const clearAll = () => {
    if (!confirm('Clear all inquiries?')) return;
    setItems([]);
    try {
      localStorage.removeItem('inquiries');
      console.debug('Inquiries: removed inquiries from localStorage');
      try { window.dispatchEvent(new CustomEvent('local-storage-updated', { detail: { key: 'inquiries' } })); } catch (e) {}
    } catch (e) {
      console.error('Inquiries: failed to remove inquiries from localStorage', e);
    }
  };

  // manual refresh button handler
  const refresh = () => {
    try {
      const raw = localStorage.getItem('inquiries');
      const parsed = raw ? JSON.parse(raw) : [];
      setItems(Array.isArray(parsed) ? parsed : []);
      try { window.dispatchEvent(new CustomEvent('local-storage-updated', { detail: { key: 'inquiries' } })); } catch (e) {}
    } catch (e) {
      console.warn('Inquiries: failed to refresh from localStorage', e);
      setItems([]);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Inquiries</h2>
          <p className="text-sm text-gray-600 mt-1">Customer inquiries and messages ({items.length})</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={refresh}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
            title="Refresh inquiries"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v6h6M20 20v-6h-6" />
            </svg>
            <span className="font-medium">Refresh</span>
          </button>
          {items.length > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <TrashIcon />
              <span className="font-medium">Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="flex justify-center mb-4 text-gray-400">
            <MailIcon />
          </div>
          <p className="text-gray-600 mb-2">No inquiries yet</p>
          <p className="text-sm text-gray-500">Customer inquiries will appear here</p>
        </div>
      )}

      {/* Inquiries List */}
      <div className="space-y-4">
        {items.map(i => (
          <div key={i.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              {/* Header with name and timestamp */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <UserIcon />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{i.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <ClockIcon />
                      <span>{new Date(i.id).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => remove(i.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete inquiry"
                >
                  <TrashIcon />
                </button>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 text-sm">
                  <div className="text-gray-400">
                    <EmailIcon />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Email</p>
                    <a href={`mailto:${i.email}`} className="text-gray-900 hover:text-blue-600">
                      {i.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="text-gray-400">
                    <PhoneIcon />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Phone</p>
                    <a href={`tel:${i.phone}`} className="text-gray-900 hover:text-blue-600">
                      {i.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <MessageIcon />
                  <span>Message</span>
                </div>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{i.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}