import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

export const materialAPI = {
  getAll: (params) => api.get('/materials', { params }),
  getById: (id) => api.get(`/materials/${id}`),
  upload: (formData) => api.post('/materials', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/materials/${id}`, data),
  delete: (id) => api.delete(`/materials/${id}`),
  incrementDownload: (id) => api.patch(`/materials/${id}/download`)
};

export const progressAPI = {
  getProgress: () => api.get('/progress'),
  toggleTopic: (data) => api.post('/progress/toggle', data),
  markComplete: (data) => api.post('/progress/mark', data)
};

export const quizAPI = {
  getQuestions: (params) => api.get('/quizzes/questions', { params }),
  submitQuiz: (data) => api.post('/quizzes/submit', data),
  getHistory: () => api.get('/quizzes/history'),
  createQuestion: (data) => api.post('/quizzes/questions', data),
  updateQuestion: (id, data) => api.put(`/quizzes/questions/${id}`, data),
  deleteQuestion: (id) => api.delete(`/quizzes/questions/${id}`),
  bulkCreateQuestions: (data) => api.post('/quizzes/questions/bulk', data)
};

export const examAPI = {
  getAll: (params) => api.get('/exams', { params }),
  getById: (id) => api.get(`/exams/${id}`),
  create: (data) => api.post('/exams', data),
  update: (id, data) => api.put(`/exams/${id}`, data),
  delete: (id) => api.delete(`/exams/${id}`)
};

export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all')
};

export default api;
