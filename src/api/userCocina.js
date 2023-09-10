import { axios } from "../lib/axios";

export function setCreateCocina(body) {
  return axios.post("users/register/newKitchen", body);
}

export function putActualizarCocina(id, body) {
  return axios.put(`users/cashier/updateCashier/${id}`, body);
}
