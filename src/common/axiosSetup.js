import axios from "axios";
import Cookies from "universal-cookie";
const cookies = new Cookies();

axios.defaults.baseURL = "https://shoppet.site/api";
axios.defaults.headers.common["Authorization"] = `Bearer ${cookies.get("jwt")}`;
axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    //api sau khi login mới thêm bearer
    console.log(config);
    axios.defaults.headers.common["Authorization"] = `Bearer ${cookies.get(
      "jwt"
    )}`;
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);
