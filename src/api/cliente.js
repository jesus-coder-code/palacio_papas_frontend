import { axios } from "../lib/axios";

export function setCreateCliente(body) {
  return axios.post("clients/register", body);
}
