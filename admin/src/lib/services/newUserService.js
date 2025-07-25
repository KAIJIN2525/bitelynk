import api from "../api";

export const fetchNewUsersThisMonth = async () => api.get("/users/new-this-month");
