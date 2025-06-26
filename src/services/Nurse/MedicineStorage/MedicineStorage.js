import { request } from "../../request";

const medicineStorageService = {
  // Get all medicine storage
  getAllMedicineStorage: () => request("GET", "medicine"),

  // Get medicine storage by ID
  getMedicineStorageById: (id) => request("GET", `medicine-storage/${id}`),

  // Create new medicine storage
  createMedicineStorage: (data) => request("POST", "medicine-storage", data),

  // Update medicine storage by ID
  updateMedicineStorage: (id, data) =>
    request("PUT", `medicine-storage/${id}`, data),

  // Delete medicine storage by ID
  deleteMedicineStorage: (id) => request("DELETE", `medicine-storage/${id}`),
};

export default medicineStorageService;
