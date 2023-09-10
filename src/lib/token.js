export const token = {
  getToken: () => {
    return localStorage.getItem("token") ?? false;
  },
  setToken: (token) => {
    localStorage.setItem("token", token);
  },
  clearToken: () => {
    localStorage.removeItem("token");
  },
};
