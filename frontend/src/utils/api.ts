// import axios from 'axios';

// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://localhost:5000/api',
// });

// export default api;

// ===================================================================================================

// src/utils/api.ts
import axios, { InternalAxiosRequestConfig } from 'axios';

// Define your backend base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:5000/api'; // Adjust as needed

// Create the Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Request Interceptor ---
// This function will run before every request made using this 'api' instance
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Check if running on the client side where localStorage is available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        // If token exists, add the Authorization header
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Interceptor: Added Auth header'); // For debugging
      } else {
        // Optional: Remove header if no token is found (e.g., after logout)
        delete config.headers.Authorization;
        console.log('Interceptor: No token found, ensuring Auth header is removed'); // For debugging
      }
    }
    return config; // Return the modified config
  },
  (error) => {
    // Handle request error
    console.error('Axios request interceptor error:', error);
    return Promise.reject(error);
  }
);

// --- Optional: Response Interceptor ---
// You can also add a response interceptor to handle errors globally,
// like redirecting to login on 401/403 errors.
/*
api.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.log('Interceptor: Unauthorized or Forbidden response. Clearing auth data.');
      // Potentially clear localStorage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('permissions');
      // Avoid redirecting if already on the login page
      if (window.location.pathname !== '/') {
         window.location.href = '/'; // Force redirect
      }
    }
    return Promise.reject(error); // Reject the promise for other errors
  }
);
*/


export default api;
