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
    }), // Import injection event result (file upload)
  importInjectionEventResult: (id, formData) =>
    request("POST", `injection-record/injection-event/${id}/result`, formData, {
      headers: {
        // Don't set Content-Type for FormData - let browser set it with boundary
      },
      timeout: 60000, // Increase timeout for file upload
    }),

    //Get all post injection records for a specific injection event
  getAllPostInjectionRecords: (id) =>
    request("GET", `post-injection-report/injection-event/${id}`),

  //Get post injection record by ID
  getPostInjectionRecordById: (id) =>
    request("GET", `post-injection-report/injection-record/${id}`),
};

export default injectionEventService;
