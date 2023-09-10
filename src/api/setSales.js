import { axios } from "../lib/axios";

export function setSales(body) {
  return axios.post("sales/createSale", body);
}

export function setCortesias(body) {
  return axios.post("clients/createCourtesy", body);
}
