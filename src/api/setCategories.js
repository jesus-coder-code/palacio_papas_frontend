import { axios } from "../lib/axios";

export function setCategories(body) {
  return axios.post("categories/createCategories", body);
}
