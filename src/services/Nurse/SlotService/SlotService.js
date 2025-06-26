import { request } from "../../request";

const slotService = {
    importSlots: (formData) => request("POST", "slot/import", formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }),
    
    // Session parameter should already be URL encoded when passed in
    getSlotToday: (session) => request("GET", `slot/today?session=${session}`),
    
    checkSlot: (id, formData = null) => {
        if (formData && formData instanceof FormData) {
            // If formData is provided, send it as multipart/form-data
            return request("PATCH", `slot/${id}/check`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        } else {
            // If no formData, send empty body
            return request("PATCH", `slot/${id}/check`, {});
        }
    }
};

export default slotService;