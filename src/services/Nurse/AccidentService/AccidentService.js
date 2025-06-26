import { request } from "../../request";

const AccidentService = {
    // Get all accidents
    getAllAccidents: () => request("GET", "accident"),

    // Create a new accident report
    createAccidentReport: (formData) => request("POST", "accident", formData, {
        headers: {
            'Content-Type': 'application/json'
        }
    }),

    getAccidentById: (id) => request("GET", `accident/${id}`),
}

export default AccidentService;