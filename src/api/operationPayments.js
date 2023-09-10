import { axios } from "../lib/axios";

export function getPayment() {
  return axios.get(`payments/getPayments`);
}

export function newPayment(body) {
  return axios.post(`payments/newPayment`, body);
}

export function daletePayment(id) {
  return axios.delete(`payments/deletePayment/${id}`);
}

/* Gastos */
export function newGasto(body) {
  return axios.post(`expense/newExpense`, body);
}

export function getExpenseByUser() {
  return axios.get(`expense/getExpenseByUser`);
}

export function getExpense() {
  return axios.get("expense/getExpense");
}

export function newGastoAdmin(body) {
  return axios.post(`expense/newExpense`, body);
}

export function deleteGastoAdmin(id) {
  return axios.delete(`expense/deleteExpense/${id}`);
}
