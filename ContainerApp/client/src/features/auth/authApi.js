import axios from 'axios';

const API_URL = 'https://localhost:7217/api/auth';

export const authApi = {
  login: async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userEmail', response.data.email);
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    window.location.href = '/login';
  }
};