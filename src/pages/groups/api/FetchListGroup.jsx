import axios from "axios";
import { useSelector } from "react-redux";

const { user } = useSelector((state) => state.user);

export const FetchListGroups = async () => {
  const respone = await axios.get(`http://127.0.0.1:8000/api/product/list`, {
    headers: { Authorization: "Bearer " + user?.token },
  });
  return respone;
};
