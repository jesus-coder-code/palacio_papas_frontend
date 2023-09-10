import { axios } from "../lib/axios";

export function getUser() {
  return axios.get("users/login/auth");
}
