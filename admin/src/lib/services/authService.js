import api from "../api";

export const loginAdmin = async (email, password) => {
  const res = await api.post("/users/login", { email, password });
  if (res.role !== "admin") {
    throw new Error("Not an admin account");
  }
  return res;
};

export const signupAdmin = async (name, email, password) => {
  const res = await api.post("/users/register", {
    username: name,
    email,
    password,
    role: "admin",
  });
  if (res.user.role !== "admin") {
    throw new Error("Admin registration failed");
  }
  return res;
};
