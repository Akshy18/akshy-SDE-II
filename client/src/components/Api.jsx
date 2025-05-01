// Simple solution for token refresh
import axios from 'axios';
// Create base axios instance with increased timeout
const api = axios.create({
  baseURL: "http://localhost:5000/api" ,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000  // Increased timeout to 10 seconds
});
// import.meta.env.VITE_API_BASE_URL
// "http://localhost:5000/api"

// Simple token refresh function
export const refreshAccessToken = async () => {

  try {
    const response = await api.post("/users/refresh-token", {});
    const { accessToken } = response.data;
    console.log("New access token:", accessToken);

    // Store the new token
    localStorage.setItem("accessToken", accessToken);
    return accessToken;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    localStorage.removeItem("accessToken");
    throw error;
  }
};

// Add auth header to requests
export const addAuthHeader = (token) => {
  if (token) {
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  }
  return {};
};

export default api;