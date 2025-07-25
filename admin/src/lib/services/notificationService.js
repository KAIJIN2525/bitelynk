import api from "../api";

export const fetchNotifications = async () => api.get("/notifications");
export const markNotificationRead = async (id) => api.patch(`/notifications/${id}/read`);
