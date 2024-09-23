import axios from "../../util/axios";

export const registerApi = (body: {
  username: string;
  password: string;
  confirmPassword: string;
}) => axios.post("/user/register", body);

export const loginApi = (body: { username: string; password: string }) =>
  axios.post("/user/login", body);

export const getMe = () => axios.get("/user/me");
