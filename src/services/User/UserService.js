import { request } from "../request";

const UserService = {

    getAllParents: () => request("GET", "user/parents"),

}

export default UserService;