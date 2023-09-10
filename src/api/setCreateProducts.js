import { axios } from "../lib/axios";

export function setCreateProducts(body) {
  return axios.post("products/createProduct", body, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
