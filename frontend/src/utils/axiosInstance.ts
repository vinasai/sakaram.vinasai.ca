import axios from 'axios';

const base = (import.meta.env.VITE_API_BASE_URL as string) || '';

const axiosInstance = axios.create({
  baseURL: base,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
