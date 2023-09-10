import { axios } from "../lib/axios";

export function loginUser(data) {
  return axios.post("users/login", data);
}
