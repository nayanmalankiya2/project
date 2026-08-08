import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Attach token to requests
const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth
export const login = (username, password) => api.post('/auth/login', { username, password });

// Users (admin)
export const getUsers = () => api.get('/users');
export const createUser = (data) => api.post('/users', data);
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);

// Students (admin + faculty)
export const getStudents = () => api.get('/students');
export const getMyStudentProfile = () => api.get('/students/me');
export const createStudent = (data) => api.post('/students', data);
export const updateStudent = (id, data) => api.put(`/students/${id}`, data);
export const deleteStudent = (id) => api.delete(`/students/${id}`);

// Subjects (admin)
export const getSubjects = () => api.get('/subjects');
export const createSubject = (data) => api.post('/subjects', data);
export const updateSubject = (id, data) => api.put(`/subjects/${id}`, data);
export const deleteSubject = (id) => api.delete(`/subjects/${id}`);

// Marks (admin + faculty write, student read)
export const getMarks = () => api.get('/marks');
export const createMark = (data) => api.post('/marks', data);
export const updateMark = (id, data) => api.put(`/marks/${id}`, data);
export const deleteMark = (id) => api.delete(`/marks/${id}`);

export default api;
