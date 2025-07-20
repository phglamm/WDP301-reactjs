import { request } from "../../request";

const injectionEventService = {
  // Get all injection events
  getAllInjectionEvents: () => request("GET", "injection-event/available"),

  // Create a new injection event
  createInjectionEvent: (formData) =>
    request("POST", "injection-event", formData, {
      headers: {
        "Content-Type": "application/json",
      },
    }),

  // Download student list for a specific injection event
  downloadStudentRegisteredInjectionEvent: (id) =>
    request("GET", `injection-record/${id}/students`, null, {
      responseType: "blob",
      timeout: 60000,
      headers: {
        Accept:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Cache-Control": "no-cache",
      },
    }),
};

export default injectionEventService;
