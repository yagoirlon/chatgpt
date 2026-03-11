import axios from 'axios';

const api = axios.create({ baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000' });

export const setAuthToken = (token) => {
  api.defaults.headers.common.Authorization = token ? `Bearer ${token}` : '';
};

export default api;
