import { axios } from "../lib/axios";

export function getReporteAll(date) {
  return axios.get(`reports/dailyReport/${date}`);
}

export function getReportCashier(date) {
  return axios.get(`reports/reportByCashier/${date}`);
}
