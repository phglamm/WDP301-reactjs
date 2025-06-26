import { request } from "../../request";

const VaccinationService = {
    // Get all vaccinations
    getAllVaccinations: () => request("GET", "vaccination"),
    
    // Get vaccination by student ID
    getVaccinationByStudentId: (studentId) => request("GET", `vaccination/student/${studentId}`),
    
    // Report a new vaccination
    reportVaccination: (data) => request("POST", "vaccination", data),
    
}

export default VaccinationService;

