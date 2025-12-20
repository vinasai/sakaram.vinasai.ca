import { useEffect, useState } from 'react';
import { fetchTripRequests, fetchTours, updateTripRequest } from '../api/client';

type TripRequest = {
  id: string;
  tourId: string;
  tourName?: string;
  startDate: string;
  travellers: number;
  accommodation: string;
  name: string;
  phone: string;
  email: string;
  createdAt: string;
  status?: string;
};

const RefreshIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const MapIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
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

const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const HomeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function TripRequests() {
  const [items, setItems] = useState<TripRequest[]>([]);

  const load = async () => {
    try {
      const [res, tours] = await Promise.all([fetchTripRequests(), fetchTours()]);
      const tourMap = new Map((tours.items || []).map((tour: any) => [tour._id, tour.name]));
      const mapped = (res.items || []).map((item: any) => ({
        id: item._id,
        tourId: item.tourId,
        tourName: tourMap.get(item.tourId),
        startDate: new Date(item.startDate).toLocaleDateString(),
        travellers: item.travellers,
        accommodation: item.accommodationType,
        name: item.fullName,
        phone: item.phone || '- ',
        email: item.email,
        createdAt: item.createdAt,
        status: item.status,
      }));
      setItems(mapped);
    } catch (e) {
      console.warn('TripRequests: failed to load', e);
      setItems([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await updateTripRequest(id, { status: newStatus });
      setItems((prev) => prev.map(i => i.id === id ? { ...i, status: newStatus } : i));
    } catch (e) {
      console.error('TripRequests: failed to update status', e);
      alert('Unable to update status.');
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'Completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Trip Requests</h2>
          <p className="text-sm text-gray-600 mt-1">Booking requests from customers ({items.length})</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={load}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RefreshIcon />
            <span className="font-medium">Refresh</span>
          </button>
        </div>
      </div>

      {items.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="flex justify-center mb-4 text-gray-400">
            <MapIcon />
          </div>
          <p className="text-gray-600 mb-2">No trip requests yet</p>
          <p className="text-sm text-gray-500">Customer booking requests will appear here</p>
        </div>
      )}

      <div className="space-y-4">
        {items.map(i => (
          <div key={i.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <ClockIcon />
                      <span>{new Date(i.createdAt).toLocaleString()}</span>
                    </div>
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusColor(i.status)}`}>
                      {i.status || 'New'}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{i.tourName || i.tourId}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <CalendarIcon />
                      <span>{i.startDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <UsersIcon />
                      <span>{i.travellers} traveller{i.travellers !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <HomeIcon />
                      <span>{i.accommodation}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 text-sm">
                  <div className="text-gray-400">
                    <UserIcon />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Name</p>
                    <p className="text-gray-900">{i.name}</p>
                  </div>
                </div>
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
                      {i.phone}</a>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                {['Pending', 'Confirmed', 'Cancelled', 'Completed'].map((status) => (
                  <button
                    key={status}
                    onClick={() => updateStatus(i.id, status)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full border ${getStatusColor(status)} ${i.status === status ? 'ring-2 ring-offset-2 ring-emerald-400' : ''}`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
