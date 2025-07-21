import { request } from "../../request";

const medicineStorageService = {
  // Get all medicine storage
  getAllMedicineStorage: () => request("GET", "medicine"),

  // Create new medicine (admin only)
  createMedicine: (formData) => request("POST", "medicine", formData, {
    headers: {
      'Content-Type': 'application/json'
    }
  }),

  // Set medicine for accident
  setMedicineForAccident: (formData) => request("POST", "accident-medicine", formData, {
    headers: {
      'Content-Type': 'application/json'
    }
  }),

  //import medicine data from excel
  importMedicineDataFromExcel: (formData) => request("POST", "medicine/import", formData, {
    headers: {
      // Don't set Content-Type for FormData - let browser set it with boundary
    }
  }),
};

export default medicineStorageService;
