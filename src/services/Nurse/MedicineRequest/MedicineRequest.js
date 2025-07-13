import { request } from "../../request";

const medicinRequestService = {
    getAllMedicineRequests: () => request("GET", "medicine-request"),
    getMedicineRequestsToday: () => request("GET", "medicine-request/today"),
    createMedicineRequest: (formData) => request("POST", "medicine-request", formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }),
    approveMedicineRequest: (id) => request("PATCH", `medicine-request/${id}`),
    rejectMedicineRequest: (id) => request("DELETE", `medicine-request/${id}`),
    getMedicineRequestById: (id) => request("GET", `medicine-request/${id}`),
}

export default medicinRequestService;