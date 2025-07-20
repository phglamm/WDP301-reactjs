import { request } from "../../request";

const HealthEventService = {
  // Get all health events
  getAllHealthEvents: () => request("GET", "health-event"),

  // Create a new health event
  createHealthEvent: (formData) =>
    request("POST", "health-event", formData, {
      headers: {
        "Content-Type": "application/json",
      },
    }),

  // Import health event result (file upload)
  importHealthEventResult: (formData) =>
    request("POST", "health-event/import", formData),
};
export default HealthEventService;
