import { axios } from "../lib/axios";

export function deleteSales(id) {
  return axios.delete(`sales/deleteSale/${id}`);
}
