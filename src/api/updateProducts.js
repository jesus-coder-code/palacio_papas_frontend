import { axios } from "../lib/axios";

export function updateProducts(id, body) {
  return axios.put(`products/updateProduct/${id}`, body, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
