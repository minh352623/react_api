import axios from "axios";
import { useSelector } from "react-redux";

const { user } = useSelector((state) => state.user);

export const FetchListGroups = async () => {
  const respone = await axios.get(`https://shoppet-tm.herokuapp.com/api/product/list`, {
    headers: { Authorization: "Bearer " + user?.token },
  });
  return respone;
};
