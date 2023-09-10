import { axios } from "../lib/axios";

export function getSales() {
  return axios.get("sales/getSaleByCashier");
}

export function getCourtesy() {
  return axios.get("clients/getCourtesy");
}
