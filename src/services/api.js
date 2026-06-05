import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

// Attach token to every request
API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser    = (data) => API.post('/auth/login', data);
export const getProfile   = ()     => API.get('/auth/me');
export const updateProfile = (data) => API.put('/auth/profile', data);

// Tasks
export const fetchTasks    = (params) => API.get('/tasks', { params });
export const fetchTask     = (id)     => API.get(`/tasks/${id}`);
export const createTask    = (data)   => API.post('/tasks', data);
export const updateTask    = (id, data) => API.put(`/tasks/${id}`, data);
export const deleteTask    = (id)     => API.delete(`/tasks/${id}`);
export const fetchStats    = ()       => API.get('/tasks/stats');

export default API;
