import { request } from "../../request";

const AppointmentService = {
  // Get all appointments
  getAllAppointments: () => request("GET", "appointment"),

  // Create a new appointment
  createAppointment: (formData) => request("POST", "appointment", formData),

  // Get appointment by ID
  getAppointmentById: (id) => request("GET", `appointment/${id}`),

  getTodayAppointments: () => request("GET", "appointment/today"),
};

export default AppointmentService;
