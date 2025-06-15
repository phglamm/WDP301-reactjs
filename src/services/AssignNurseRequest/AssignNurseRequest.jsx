import axios from "axios";
import { request } from "../request";

const assignService = {
  fetchClassesWithMedicalRequests: () =>
    request("GET", "medicine-request/class"),

  fetchNurses: () => request("GET", "user/nurse"),
  assignNurseToClasses: (requestData) =>
    request("POST", `medicine-request/assign`, requestData),
};

export default assignService;
