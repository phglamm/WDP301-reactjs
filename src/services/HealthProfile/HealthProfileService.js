import { request } from "../request";

export const HealthProfileService = {
    getStudentHealthProfileById: (studentId) => request("GET", `health-profile/student/{id}?id=${studentId}`),

}