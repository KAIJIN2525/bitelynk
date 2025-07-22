import api from "../api";

const API_ENDPOINT = "/users";

export const userService = {
    getAllUsers: () => api.get(`${API_ENDPOINT}/all`),
};
