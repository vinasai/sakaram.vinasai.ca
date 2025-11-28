import { useState, useEffect } from 'react';
import HeroManager from './HeroManager';
import DealsManager from './DealsManager';
import Inquiries from './Inquiries';
import TripRequests from './TripRequests';
import CollectionManager from './CollectionManager';
import GalleryManager from './GalleryManager';

const HomeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const ImageIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const TagIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
);

const MapIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
);

const MailIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const CameraIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h4l2-3h6l2 3h4v11a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11a3 3 0 100-6 3 3 0 000 6z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const LogoutIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const MenuIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

export default function AdminDashboard() {
  const [view, setView] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [heroCount, setHeroCount] = useState<number | null>(null);
  const [dealsCount, setDealsCount] = useState<number | null>(null);
  const [toursCount, setToursCount] = useState<number | null>(null);
  const [totalTourDays, setTotalTourDays] = useState<number | null>(null);
  const [inquiriesCount, setInquiriesCount] = useState<number | null>(null);
  const [tripRequestsCount, setTripRequestsCount] = useState<number | null>(null);

  // Sync view with URL on mount and handle browser back/forward
  useEffect(() => {
    const updateViewFromURL = () => {
      const pathname = window.location.pathname;
      const segment = pathname.split('/')[2] || 'home';
      setView(segment);
    };

    updateViewFromURL();

    // Listen for browser back/forward navigation
    window.addEventListener('popstate', updateViewFromURL);
    return () => window.removeEventListener('popstate', updateViewFromURL);
  }, []);

  // Read counts from localStorage
  const updateCounts = () => {
    try {
      const rawHero = localStorage.getItem('hero_banners');
      const hero = rawHero ? JSON.parse(rawHero) : [];
      setHeroCount(Array.isArray(hero) ? hero.length : 0);
    } catch (e) {
      setHeroCount(0);
    }

    try {
      const rawDeals = localStorage.getItem('deals');
      const deals = rawDeals ? JSON.parse(rawDeals) : [];
      setDealsCount(Array.isArray(deals) ? deals.length : 0);
    } catch (e) {
      setDealsCount(0);
    }

    try {
      const rawTours = localStorage.getItem('tours');
      const tours = rawTours ? JSON.parse(rawTours) : [];
      setToursCount(Array.isArray(tours) ? tours.length : 0);
      // compute total days: prefer explicit `days` or plan length, else parse number from duration
      if (Array.isArray(tours)) {
        const total = tours.reduce((acc: number, t: any) => {
          if (t.days) return acc + (Number(t.days) || 0);
          if (Array.isArray(t.plan) && t.plan.length) return acc + t.plan.length;
          const d = String(t.duration || '').match(/(\d+)/);
          if (d) return acc + Number(d[0]);
          return acc + 1;
        }, 0);
        setTotalTourDays(total);
      } else {
        setTotalTourDays(0);
      }
    } catch (e) {
      setToursCount(0);
      setTotalTourDays(0);
    }

    try {
      const rawInq = localStorage.getItem('inquiries');
      const inq = rawInq ? JSON.parse(rawInq) : [];
      setInquiriesCount(Array.isArray(inq) ? inq.length : 0);
    } catch (e) {
      setInquiriesCount(0);
    }

    try {
      const rawReq = localStorage.getItem('trip_requests');
      const req = rawReq ? JSON.parse(rawReq) : [];
      setTripRequestsCount(Array.isArray(req) ? req.length : 0);
    } catch (e) {
      setTripRequestsCount(0);
    }
  };

  useEffect(() => {
    // initial counts
    updateCounts();

    // listen for cross-tab storage changes
    const onStorage = (e: StorageEvent) => {
      if (!e.key) return;
      if (['hero_banners', 'deals', 'tours', 'inquiries', 'gallery', 'trip_requests'].includes(e.key)) updateCounts();
    };

    // listen for our custom in-tab notification
    const onLocalUpdate = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!detail || !detail.key) return;
      if (['hero_banners', 'deals', 'tours', 'inquiries', 'gallery', 'trip_requests'].includes(detail.key)) updateCounts();
    };

    window.addEventListener('storage', onStorage);
    window.addEventListener('local-storage-updated', onLocalUpdate as EventListener);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('local-storage-updated', onLocalUpdate as EventListener);
    };
  }, []);

  const go = (v: string) => {
    setView(v);
    if (typeof window !== 'undefined') window.history.pushState({}, '', `/admin/${v === 'home' ? '' : v}`);
  };

  const logout = () => {
    localStorage.removeItem('admin_logged_in');
    window.location.pathname = '/admin/login';
  };

  const menuItems = [
    { id: 'home', label: 'Dashboard', icon: HomeIcon },
    { id: 'hero', label: 'Hero Banners', icon: ImageIcon },
    { id: 'deals', label: 'Deals', icon: TagIcon },
    { id: 'tours', label: 'Tours', icon: MapIcon },
    { id: 'gallery', label: 'Gallery', icon: CameraIcon },
    { id: 'inquiries', label: 'Inquiries', icon: MailIcon },
    { id: 'trip_requests', label: 'Trip Requests', icon: MailIcon },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-16'
        } bg-slate-900 transition-all duration-300 flex flex-col`}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-700">
          {sidebarOpen && (
            <span className="text-lg font-semibold text-white">Admin Panel</span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-slate-800 text-gray-300"
          >
            <MenuIcon />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-4 px-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 mb-1 rounded-lg transition-colors ${
                  view === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <IconComponent />
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-slate-800 transition-colors"
          >
            <LogoutIcon />
            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              {menuItems.find(item => item.id === view)?.label || 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Admin</span>
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
              A
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {view === 'home' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Hero Banners</p>
                          <p className="text-2xl font-semibold text-gray-800 mt-1">{heroCount === null ? '-' : heroCount}</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                      <ImageIcon />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Active Deals</p>
                          <p className="text-2xl font-semibold text-gray-800 mt-1">{dealsCount === null ? '-' : dealsCount}</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg text-green-600">
                      <TagIcon />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Tours</p>
                          <p className="text-2xl font-semibold text-gray-800 mt-1">{toursCount === null ? '-' : toursCount}</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
                      <MapIcon />
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Duration (Days) — total</p>
                          <p className="text-2xl font-semibold text-gray-800 mt-1">{totalTourDays === null ? '-' : totalTourDays}</p>
                    </div>
                    <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                      <CalendarIcon />
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Inquiries</p>
                          <p className="text-2xl font-semibold text-gray-800 mt-1">{inquiriesCount === null ? '-' : inquiriesCount}</p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg text-orange-600">
                      <MailIcon />
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Trip Requests</p>
                          <p className="text-2xl font-semibold text-gray-800 mt-1">{tripRequestsCount === null ? '-' : tripRequestsCount}</p>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg text-yellow-600">
                      <MailIcon />
                    </div>
                  </div>
                </div>
              </div>

              {/* Welcome Section */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Welcome Back</h2>
                <p className="text-gray-600 mb-4">
                  Use the sidebar to navigate and manage your website content.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => go('hero')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                  >
                    Manage Content
                  </button>
                  <button
                    onClick={() => go('inquiries')}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
                  >
                    View Inquiries
                  </button>
                </div>
              </div>
            </div>
          )}

          {view === 'hero' && <HeroManager />}
          {view === 'deals' && <DealsManager />}
          {view === 'tours' && <CollectionManager />}
          {view === 'gallery' && <GalleryManager />}
          {view === 'inquiries' && <Inquiries />}
          {view === 'trip_requests' && <TripRequests />}
        </main>
      </div>
    </div>
  );
}