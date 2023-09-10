import { axios } from "../lib/axios";

export function getCategories() {
  return axios.get("categories/getCategories");
}
