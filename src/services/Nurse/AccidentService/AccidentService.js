import { request } from "../../request";

const AccidentService = {
  // Get all accidents
  getAllAccidents: () => request("GET", "accident"),

  // Create a new accident report
  createAccidentReport: (formData) => request("POST", "accident", formData),

  getAccidentById: (id) => request("GET", `accident/${id}`),
};

export default AccidentService;
