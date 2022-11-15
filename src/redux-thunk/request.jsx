import axios from "axios";

export default function requestGetCart(user) {
  return axios({
    method: "GET",
    url: `https://shoppet.site/api/cart/all/${user?.id}`,
    headers: {
      Authorization: "Bearer " + user?.token,
    },
  });
}

export function requestAddCart(idPRo, number, user) {
  const formData = new FormData();
  formData.append("id", idPRo);
  formData.append("user_id", user?.id);
  formData.append("number", number);
  return axios({
    method: "POST",
    url: `https://shoppet.site/api/cart/add`,
    headers: {
      Authorization: "Bearer " + user?.token,
    },
    data: formData,
  });
}
export function requestDeleteCart(idPRo, user) {
  const formData = new FormData();
  formData.append("id_pro", idPRo);
  formData.append("user_id", user?.id);
  return axios({
    method: "POST",
    url: `https://shoppet.site/api/cart/delete`,
    headers: {
      Authorization: "Bearer " + user?.token,
    },
    data: formData,
  });
}
