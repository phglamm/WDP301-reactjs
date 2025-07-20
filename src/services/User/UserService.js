import { request } from "../request";

const UserService = {

    getAllParents: () => request("GET", "user/parents"),
    getAllNurses: () => request("GET", "user/nurse"),
    getAllUsers: () => request("GET", "user"),
    getUserById: (userId) => request("GET", `user/${userId}`),
    importUserDataFromExcel: (formData) => request("POST", "user/import", formData, {
        headers: {
            // Don't set Content-Type for FormData - let browser set it with boundary
        }
    }),

}

export default UserService;