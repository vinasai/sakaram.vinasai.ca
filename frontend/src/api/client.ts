import axios from 'axios';

const rawApiBase = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:5000';
const rawMediaBase = (import.meta.env.VITE_MEDIA_BASE_URL as string) || rawApiBase;

const API_BASE = rawApiBase.replace(/\/$/, '');
const MEDIA_BASE = rawMediaBase.replace(/\/$/, '');

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login if we receive a 401
      localStorage.removeItem('admin_token');
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

const toMediaUrl = (path?: string) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('blob:')) return path;
  if (path.startsWith('/')) return `${MEDIA_BASE}${path}`;
  return `${MEDIA_BASE}/${path}`;
};

const toFormData = (payload: Record<string, any>, file?: File | null, fieldName = 'image') => {
  const data = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (Array.isArray(value)) {
      value.forEach(item => data.append(key, String(item)));
    } else {
      data.append(key, String(value));
    }
  });
  if (file) data.append(fieldName, file);
  return data;
};

const setAuthToken = (token: string) => {
  localStorage.setItem('admin_token', token);
};

const clearAuthToken = () => {
  localStorage.removeItem('admin_token');
};

const getAuthToken = () => localStorage.getItem('admin_token');

const login = async (username: string, password: string) => {
  const { data } = await api.post('/auth/login', { username, password });
  return data as { token: string };
};

const fetchHeroBanners = async (includeInactive = false) => {
  const { data } = await api.get('/hero-banners', {
    params: includeInactive ? { includeInactive: true } : undefined,
  });
  return data as { items: any[] };
};

const createHeroBanner = async (payload: Record<string, any>, file?: File | null) => {
  const data = toFormData(payload, file);
  const response = await api.post('/hero-banners', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

const updateHeroBanner = async (id: string, payload: Record<string, any>, file?: File | null) => {
  const data = toFormData(payload, file);
  const response = await api.put(`/hero-banners/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

const deleteHeroBanner = async (id: string) => {
  await api.delete(`/hero-banners/${id}`);
};

const fetchDeals = async (params?: Record<string, any>) => {
  const { data } = await api.get('/deals', { params });
  return data as { items: any[] };
};

const createDeal = async (payload: Record<string, any>, file?: File | null) => {
  const data = toFormData(payload, file);
  const response = await api.post('/deals', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

const updateDeal = async (id: string, payload: Record<string, any>, file?: File | null) => {
  const data = toFormData(payload, file);
  const response = await api.put(`/deals/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

const deleteDeal = async (id: string) => {
  await api.delete(`/deals/${id}`);
};

const fetchTours = async (params?: Record<string, any>) => {
  const { data } = await api.get('/tours', { params });
  return data as { items: any[] };
};

const fetchTourDetails = async (id: string) => {
  const { data } = await api.get(`/tours/${id}`);
  return data as { tour: any; inclusions: any[]; exclusions: any[]; itinerary: any[]; images: any[] };
};

const createTour = async (payload: Record<string, any>) => {
  const { data } = await api.post('/tours', payload);
  return data;
};

const updateTour = async (id: string, payload: Record<string, any>) => {
  const { data } = await api.put(`/tours/${id}`, payload);
  return data;
};

const deleteTour = async (id: string) => {
  await api.delete(`/tours/${id}`);
};

const addTourInclusion = async (tourId: string, description: string) => {
  const { data } = await api.post(`/tours/${tourId}/inclusions`, { description });
  return data;
};

const addTourExclusion = async (tourId: string, description: string) => {
  const { data } = await api.post(`/tours/${tourId}/exclusions`, { description });
  return data;
};

const deleteTourInclusion = async (tourId: string, itemId: string) => {
  await api.delete(`/tours/${tourId}/inclusions/${itemId}`);
};

const deleteTourExclusion = async (tourId: string, itemId: string) => {
  await api.delete(`/tours/${tourId}/exclusions/${itemId}`);
};

const addTourItinerary = async (tourId: string, dayNumber: number, activity: string) => {
  const { data } = await api.post(`/tours/${tourId}/itinerary`, { dayNumber, activity });
  return data;
};

const deleteTourItinerary = async (tourId: string, itemId: string) => {
  await api.delete(`/tours/${tourId}/itinerary/${itemId}`);
};

const uploadTourImage = async (tourId: string, file?: File | null, imageUrl?: string) => {
  const data = new FormData();
  if (file) data.append('image', file);
  if (imageUrl) data.append('imageUrl', imageUrl);
  const response = await api.post(`/tours/${tourId}/images`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

const deleteTourImage = async (tourId: string, imageId: string) => {
  await api.delete(`/tours/${tourId}/images/${imageId}`);
};

const fetchGallery = async (params?: Record<string, any>) => {
  const { data } = await api.get('/gallery', { params });
  return data as { items: any[] };
};

const createGalleryPhoto = async (payload: Record<string, any>, file?: File | null) => {
  const data = toFormData(payload, file);
  const response = await api.post('/gallery', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

const updateGalleryPhoto = async (id: string, payload: Record<string, any>, file?: File | null) => {
  const data = toFormData(payload, file);
  const response = await api.put(`/gallery/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

const deleteGalleryPhoto = async (id: string) => {
  await api.delete(`/gallery/${id}`);
};

const createInquiry = async (payload: Record<string, any>) => {
  const { data } = await api.post('/inquiries', payload);
  return data;
};

const fetchInquiries = async (params?: Record<string, any>) => {
  const { data } = await api.get('/inquiries', { params });
  return data as { items: any[] };
};

const createTripRequest = async (payload: Record<string, any>) => {
  const { data } = await api.post('/trip-requests', payload);
  return data;
};

const fetchTripRequests = async (params?: Record<string, any>) => {
  const { data } = await api.get('/trip-requests', { params });
  return data as { items: any[] };
};

const updateTripRequest = async (id: string, payload: Record<string, any>) => {
  const { data } = await api.put(`/trip-requests/${id}`, payload);
  return data;
};

const fetchDashboardStats = async () => {
  const { data } = await api.get('/dashboard/stats');
  return data as {
    totalBanners: number;
    totalDeals: number;
    activeDeals: number;
    totalTours: number;
    totalTourDays: number;
    totalInquiries: number;
    totalTripRequests: number;
  };
};

export {
  api,
  toMediaUrl,
  setAuthToken,
  clearAuthToken,
  getAuthToken,
  login,
  fetchHeroBanners,
  createHeroBanner,
  updateHeroBanner,
  deleteHeroBanner,
  fetchDeals,
  createDeal,
  updateDeal,
  deleteDeal,
  fetchTours,
  fetchTourDetails,
  createTour,
  updateTour,
  deleteTour,
  addTourInclusion,
  addTourExclusion,
  deleteTourInclusion,
  deleteTourExclusion,
  addTourItinerary,
  deleteTourItinerary,
  uploadTourImage,
  deleteTourImage,
  fetchGallery,
  createGalleryPhoto,
  updateGalleryPhoto,
  deleteGalleryPhoto,
  createInquiry,
  fetchInquiries,
  createTripRequest,
  fetchTripRequests,
  updateTripRequest,
  fetchDashboardStats,
  createDealRequest,
  fetchDealRequests,
  updateDealRequestStatus,
};

const createDealRequest = async (payload: Record<string, any>) => {
  const { data } = await api.post('/deal-requests', payload);
  return data;
};

const fetchDealRequests = async (params?: Record<string, any>) => {
  const { data } = await api.get('/deal-requests', { params });
  return data as any[];
};

const updateDealRequestStatus = async (id: string, status: string) => {
  const { data } = await api.put(`/deal-requests/${id}/status`, { status });
  return data;
};
