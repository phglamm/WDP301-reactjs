import { request } from "../../request";

const medicineStorageService = {
  // Get all medicine storage
  getAllMedicineStorage: () => request("GET", "medicine"),

  // Set medicine for accident
  setMedicineForAccident: (formData) => request("POST", "accident-medicine", formData, {
    headers: {
      'Content-Type': 'application/json'
    }
  }),
};

export default medicineStorageService;
