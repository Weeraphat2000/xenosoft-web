export const getToken = () => localStorage.getItem("tokenx");

export const setToken = (token: string) =>
  localStorage.setItem("tokenx", token);

export const removeToken = () => localStorage.removeItem("tokenx");
