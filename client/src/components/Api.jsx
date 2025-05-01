import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Base URL from environment variables
  withCredentials: true, // Include credentials for cross-origin requests
  headers: {
    'Content-Type': 'application/json' // Set default content type
  },
  timeout: 10000 // Request timeout set to 10 seconds
});

// Function to refresh access token using refresh token
export const refreshAccessToken = async () => {
  try {
    const response = await api.post("/users/refresh-token", {}, {
      withCredentials: true // Ensure cookies are sent with request
    });
    
    const { accessToken } = response.data;
    
    // Store new access token in localStorage
    localStorage.setItem("accessToken", accessToken);
    return accessToken;
  } catch (error) {
    // Clear stored token if refresh fails
    localStorage.removeItem("accessToken");
    throw error;
  }
};

// Helper function to add authorization header to requests
export const addAuthHeader = (token) => {
  if (token) {
    return {
      headers: {
        Authorization: `Bearer ${token}` // Format bearer token header
      }
    };
  }
  return {}; // Return empty headers if no token provided
};

export default api;