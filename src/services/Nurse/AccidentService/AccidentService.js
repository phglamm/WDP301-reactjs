import { request } from "../../request";

const AccidentService = {
  // Get all accidents
  getAllAccidents: () => request("GET", "accident"),

  // Create a new accident report
  createAccidentReport: (formData) => request("POST", "accident", formData),

  getAccidentById: (id) => request("GET", `accident/${id}`),

  // Update an existing accident report
  updateAccidentReport: (id, status) => request("PATCH", `accident/${id}/status?status=${status}`),  
};

export default AccidentService;
