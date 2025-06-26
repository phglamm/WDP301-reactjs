import { request } from "../request";

const UserService = {

    getAllParents: () => request("GET", "user/parent"),

}

export default UserService;