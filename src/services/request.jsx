import axios from "axios";
import Cookies from "js-cookie";
const BASE_URL = "https://wdp301-se1752-be.onrender.com";

export const request = async (method, url, data = null, config = {}) => {
  const token = Cookies.get("token");

  const authheader = token ? { Authorization: `Bearer ${token}` } : {};
  try {
    const response = await axios({
      method,
      url: `${BASE_URL}/${url}`,
      data,
      headers: {
        // Add Authorization header if token exists
        ...authheader,
        // Merge with any existing headers from config
        ...config.headers,
      },
      ...config,
      validateStatus: (status) => status >= 200 && status < 300,
    });

    // For blob responses, return the data directly (should be a Blob)
    if (config.responseType === "blob") {
      // Ensure we return a proper Blob
      if (response.data instanceof Blob) {
        return response.data;
      } else {
        // If axios didn't create a proper blob, create one manually
        return new Blob([response.data], {
          type: response.headers["content-type"] || "application/octet-stream",
        });
      }
    }

    // For JSON responses, return the structured response
    return response.data;
  } catch (error) {
    console.error("Request error:", error);

    // Handle authentication errors
    if (error.response?.status === 401) {
      // Token might be expired or invalid
      localStorage.removeItem("access_token");
      // Optionally redirect to login page
      // window.location.href = '/login';
    }

    throw error;
  }
};
