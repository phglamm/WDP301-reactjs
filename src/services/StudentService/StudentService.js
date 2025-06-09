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

const studentService = {
  // Get all students
  getAllStudents: () => request("GET", "student"),
  
  // Get student by ID
  getStudentById: (id) => request("GET", `student/${id}`),
  
  getStudentAccident: (id) => request("GET", `student/${id}/accident`),

  getAllAccident: () => request("GET", "accident"),

  reportAccident: (data) => request("POST", "accident", data),

  getMedicineRequest: () => request("GET", `medicine-request/parent`),
};


export default studentService;