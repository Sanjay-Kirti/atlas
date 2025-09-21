import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Debug logging
console.log('🔗 API URL:', API_URL)
console.log('🌍 Environment:', import.meta.env.MODE)

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('🚨 API Error:', error.message)
    console.error('🔍 Error details:', error.response?.data || error)
    
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
}

// Movies API calls
export const moviesAPI = {
  getAll: () => api.get('/movies'),
  create: (movieData) => api.post('/movies', movieData),
  delete: (id) => api.delete(`/movies/${id}`),
  getTop: () => api.get('/movies/top'),
  getVotes: (id) => api.get(`/movies/${id}/votes`),
}

// Votes API calls
export const votesAPI = {
  vote: (voteData) => api.post('/votes', voteData),
}

// Comments API calls
export const commentsAPI = {
  getByMovie: (movieId) => api.get(`/comments/movie/${movieId}`),
  create: (commentData) => api.post('/comments', commentData),
  update: (id, commentData) => api.put(`/comments/${id}`, commentData),
  delete: (id) => api.delete(`/comments/${id}`),
}

export default api
