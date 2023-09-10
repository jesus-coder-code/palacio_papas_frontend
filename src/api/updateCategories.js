import { axios } from "../lib/axios";

export function updateCategories(id, body) {
  return axios.put(`categories/updateCategories/${id}`, body);
}
