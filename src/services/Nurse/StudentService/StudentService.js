import { request } from "../../request";

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
