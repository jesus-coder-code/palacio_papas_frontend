import { axios } from "../lib/axios";

export function setCreateCajero(body) {
  return axios.post("users/register/newCashier", body);
}

export function putActualizarCajero(id, body) {
  return axios.put(`users/cashier/updateCashier/${id}`, body);
}
