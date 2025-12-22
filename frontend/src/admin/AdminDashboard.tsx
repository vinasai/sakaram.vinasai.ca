import { useState, useEffect } from 'react';
import HeroManager from './HeroManager';
import DealsManager from './DealsManager';
import DealRequestsManager from './DealRequestsManager';
import Inquiries from './Inquiries';
import TripRequests from './TripRequests';
import TourManager from './TourManager';
import GalleryManager from './GalleryManager';
import { clearAuthToken, fetchDashboardStats } from '../api/client';

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

const DealReqIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
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

const ChevronDown = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const ChevronRight = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

type MenuItem =
  | { type: 'item'; id: string; label: string; icon: () => JSX.Element }
  | {
    type: 'group';
    id: string;
    label: string;
    icon: () => JSX.Element;
    children: Array<{ id: string; label: string; icon: () => JSX.Element }>;
  };

export default function AdminDashboard() {
  const [view, setView] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // groups open/close
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    deals_group: true,
    tours_group: true,
  });

  const [heroCount, setHeroCount] = useState<number | null>(null);
  const [dealsCount, setDealsCount] = useState<number | null>(null);
  const [dealRequestsCount, setDealRequestsCount] = useState<number | null>(null);
  const [toursCount, setToursCount] = useState<number | null>(null);
  const [totalTourDays, setTotalTourDays] = useState<number | null>(null);
  const [inquiriesCount, setInquiriesCount] = useState<number | null>(null);
  const [tripRequestsCount, setTripRequestsCount] = useState<number | null>(null);

  useEffect(() => {
    const updateViewFromURL = () => {
      const pathname = window.location.pathname;
      const segment = pathname.split('/')[2] || 'home';
      setView(segment);
    };

    updateViewFromURL();

    window.addEventListener('popstate', updateViewFromURL);
    return () => window.removeEventListener('popstate', updateViewFromURL);
  }, []);

  const updateCounts = async () => {
    try {
      const stats = await fetchDashboardStats();
      setHeroCount(stats.totalBanners);
      setDealsCount(stats.totalDeals);
      setToursCount(stats.totalTours);
      setTotalTourDays(stats.totalTourDays);
      setInquiriesCount(stats.totalInquiries);
      setTripRequestsCount(stats.totalTripRequests);
      // If backend doesn't provide this yet, keep null
      setDealRequestsCount((stats as any).totalDealRequests ?? null);
    } catch (err) {
      setHeroCount(0);
      setDealsCount(0);
      setToursCount(0);
      setTotalTourDays(0);
      setInquiriesCount(0);
      setTripRequestsCount(0);
      setDealRequestsCount(0);
    }
  };

  useEffect(() => {
    updateCounts();
  }, []);

  const go = (v: string) => {
    setView(v);
    if (typeof window !== 'undefined') window.history.pushState({}, '', `/admin/${v === 'home' ? '' : v}`);
  };

  const logout = () => {
    clearAuthToken();
    window.location.pathname = '/admin/login';
  };

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  // ✅ Deals & Tours become groups, with submenus inside
  const menuItems: MenuItem[] = [
    { type: 'item', id: 'home', label: 'Dashboard', icon: HomeIcon },
    { type: 'item', id: 'hero', label: 'Hero Banners', icon: ImageIcon },

    {
      type: 'group',
      id: 'deals_group',
      label: 'Manage Deals',
      icon: TagIcon,
      children: [
        { id: 'deals', label: 'Deals', icon: TagIcon },
        { id: 'deal_requests', label: 'Deal Requests', icon: DealReqIcon },
      ],
    },

    {
      type: 'group',
      id: 'tours_group',
      label: 'Manage Tours',
      icon: MapIcon,
      children: [
        { id: 'tours', label: 'Tours', icon: MapIcon },
        { id: 'trip_requests', label: 'Tour Requests', icon: CalendarIcon },
      ],
    },

    { type: 'item', id: 'gallery', label: 'Gallery', icon: CameraIcon },
    { type: 'item', id: 'inquiries', label: 'Inquiries', icon: MailIcon },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-slate-900 transition-all duration-300 flex flex-col`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-700">
          {sidebarOpen && <span className="text-lg font-semibold text-white">Admin Panel</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-slate-800 text-gray-300">
            <MenuIcon />
          </button>
        </div>

        <nav className="flex-1 py-4 px-2 space-y-1">
          {menuItems.map((item) => {
            const IconComponent = item.icon;

            if (item.type === 'item') {
              return (
                <button
                  key={item.id}
                  onClick={() => go(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${view === item.id ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  type="button"
                >
                  <IconComponent />
                  {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                </button>
              );
            }

            // group
            const isOpen = !!openGroups[item.id];
            const childActive = item.children.some((c) => c.id === view);

            return (
              <div key={item.id} className="select-none">
                <button
                  onClick={() => toggleGroup(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${childActive ? 'bg-slate-800 text-white' : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  type="button"
                >
                  <IconComponent />
                  {sidebarOpen && (
                    <>
                      <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
                      <span className="opacity-80">{isOpen ? <ChevronDown /> : <ChevronRight />}</span>
                    </>
                  )}
                </button>

                {sidebarOpen && isOpen && (
                  <div className="mt-1 ml-3 pl-3 border-l border-slate-700 space-y-1">
                    {item.children.map((child) => {
                      const ChildIcon = child.icon;
                      return (
                        <button
                          key={child.id}
                          onClick={() => go(child.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${view === child.id
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                            }`}
                          type="button"
                        >
                          <ChildIcon />
                          <span className="font-medium">{child.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-slate-800 transition-colors"
            type="button"
          >
            <LogoutIcon />
            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              {/* label finder supports nested labels */}
              {(() => {
                const flat = menuItems.flatMap((m) =>
                  m.type === 'group'
                    ? [{ id: m.id, label: m.label }, ...m.children.map((c) => ({ id: c.id, label: c.label }))]
                    : [{ id: m.id, label: m.label }]
                );
                return flat.find((x) => x.id === view)?.label || 'Dashboard';
              })()}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Admin</span>
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
              A
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {view === 'home' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                    <ImageIcon />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Hero Banners</h3>
                    <p className="text-gray-500 text-sm">Homepage sliders</p>
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">{heroCount ?? '—'}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
                    <TagIcon />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Deals</h3>
                    <p className="text-gray-500 text-sm">Active promotions</p>
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">{dealsCount ?? '—'}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                    <DealReqIcon />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Deal Requests</h3>
                    <p className="text-gray-500 text-sm">Pending requests</p>
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">{dealRequestsCount ?? '—'}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                    <MapIcon />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Tours</h3>
                    <p className="text-gray-500 text-sm">Available packages</p>
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">{toursCount ?? '—'}</p>
                <p className="text-sm text-gray-500 mt-2">Total Days: {totalTourDays ?? '—'}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                    <MailIcon />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Inquiries</h3>
                    <p className="text-gray-500 text-sm">Customer messages</p>
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">{inquiriesCount ?? '—'}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600">
                    <CalendarIcon />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Trip Requests</h3>
                    <p className="text-gray-500 text-sm">Booking requests</p>
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">{tripRequestsCount ?? '—'}</p>
              </div>
            </div>
          )}

          {view === 'hero' && <HeroManager />}
          {view === 'deals' && <DealsManager />}
          {view === 'deal_requests' && <DealRequestsManager />}
          {view === 'tours' && <TourManager />}
          {view === 'gallery' && <GalleryManager />}
          {view === 'inquiries' && <Inquiries />}
          {view === 'trip_requests' && <TripRequests />}
        </main>
      </div>
    </div>
  );
}
