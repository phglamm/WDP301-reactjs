import axios from "axios";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = "https://wdp301-se1752-be.onrender.com/";

const request = async (method, url, data = null, headers = {}, params = {}) => {
  const token = localStorage.getItem("access_token") || null;
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
  try {
    const response = await axios({
      method,
      url: `${API_BASE_URL}${url}`,
      data,
      headers: {
        ...headers,
        ...authHeader, // Include the Authorization header if token exists
      },
      params,
    });

    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export { request }; // Export the request function for use in other services
