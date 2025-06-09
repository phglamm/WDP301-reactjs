import axios from "axios";

const API_BASE_URL = "https://wdp301-se1752-be.onrender.com/"
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IjAxMjM0NTY3ODkiLCJzdWIiOjksInJvbGUiOiJwYXJlbnQiLCJpYXQiOjE3NDk0MTg3NDAsImV4cCI6MTc1MjAxMDc0MH0.2ayWwQle6ok8ocx0gEBt1sxUzdgjXNF5Jx8AsQRJkxA";
const request = async (method, url, data = null, headers = {}, params = {}) => {
  try {
    const response = await axios({
      method,
      url: `${API_BASE_URL}${url}`,
      data,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...headers,
      },
      params,
    });

    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

const medicineStorageService = {
  // Get all medicine storage
  getAllMedicineStorage: () => request("GET", "medicine"),

  // Get medicine storage by ID
  getMedicineStorageById: (id) => request("GET", `medicine-storage/${id}`),

  // Create new medicine storage
  createMedicineStorage: (data) => request("POST", "medicine-storage", data),

  // Update medicine storage by ID
  updateMedicineStorage: (id, data) => request("PUT", `medicine-storage/${id}`, data),

  // Delete medicine storage by ID
  deleteMedicineStorage: (id) => request("DELETE", `medicine-storage/${id}`),
};


export default medicineStorageService;