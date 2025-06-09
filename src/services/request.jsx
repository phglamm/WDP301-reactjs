import axios from "axios";
import Cookies from "js-cookie";
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = "https://wdp301-se1752-be.onrender.com/";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IjAxMjM0NTY3ODkiLCJzdWIiOjksInJvbGUiOiJwYXJlbnQiLCJpYXQiOjE3NDk0MTg3NDAsImV4cCI6MTc1MjAxMDc0MH0.2ayWwQle6ok8ocx0gEBt1sxUzdgjXNF5Jx8AsQRJkxA";

const request = async (method, url, data = null, headers = {}, params = {}) => {
  //   const token = Cookies.get("token");
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
