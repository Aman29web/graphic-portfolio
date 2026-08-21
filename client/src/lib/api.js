import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 20000,
});

// Attach the admin token to every request when one exists.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ss_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Normalise errors into a plain message and bounce expired admin sessions.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.message ||
      (err.code === 'ECONNABORTED' ? 'Request timed out' : null) ||
      err.message ||
      'Network error — is the API running?';

    if (err.response?.status === 401 && localStorage.getItem('ss_token')) {
      localStorage.removeItem('ss_token');
      if (window.location.pathname.startsWith('/admin') && !window.location.pathname.endsWith('/login')) {
        window.location.href = '/admin/login';
      }
    }

    return Promise.reject(new Error(message));
  }
);

export default api;

/* ---------------------------------------------------------------- helpers */

export const endpoints = {
  projects: '/projects',
  services: '/services',
  skills: '/skills',
  experience: '/experience',
  testimonials: '/testimonials',
};

export const getBootstrap = () => api.get('/bootstrap').then((r) => r.data.data);
export const getStats = () => api.get('/stats').then((r) => r.data.data);

export const list = (resource, params = {}) =>
  api.get(resource, { params }).then((r) => r.data.data);
export const getOne = (resource, id) => api.get(`${resource}/${id}`).then((r) => r.data.data);
export const create = (resource, body) => api.post(resource, body).then((r) => r.data.data);
export const update = (resource, id, body) => api.put(`${resource}/${id}`, body).then((r) => r.data.data);
export const remove = (resource, id) => api.delete(`${resource}/${id}`).then((r) => r.data);
export const reorder = (resource, items) => api.put(`${resource}/reorder`, { items });

export const getSingleton = (resource) => api.get(resource).then((r) => r.data.data);
export const saveSingleton = (resource, body) => api.put(resource, body).then((r) => r.data.data);

export const sendMessage = (body) => api.post('/messages', body).then((r) => r.data);
export const getMessages = (params = {}) => api.get('/messages', { params }).then((r) => r.data);

export async function uploadImage(file) {
  const form = new FormData();
  form.append('image', file);
  const { data } = await api.post('/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.url;
}

export const getLibrary = () => api.get('/upload/library').then((r) => r.data.data);
export const deleteMedia = (filename) => api.delete(`/upload/${filename}`);
