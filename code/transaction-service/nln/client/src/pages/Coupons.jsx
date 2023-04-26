import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ItemCoupon from "../components/ItemCoupon";
import Layout from "../components/layouts/Layout";
import Loading from "../components/Loading";
import Swal from "sweetalert2";
import { setUser } from "../redux-thunk/userSlice";
import Cookies from "universal-cookie";

const Coupons = () => {
  const dispatch = useDispatch();

  const [coupons, setCoupons] = useState();
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);

  const listCoupon = async () => {
    const response = await axios.get(`https://shoppet.site/api/coupon/getAll`, {
      headers: { Authorization: "Bearer " + user?.token },
    });
    console.log(response);
    setCoupons(response.data);
  };
  useEffect(() => {
    listCoupon();
  }, []);
  const createUserCoupon = async (id, coin) => {
    console.log(id);
    console.log(coin);

    console.log(user?.id);
    const formData = new FormData();
    if (coin) {
      formData.append("coin", coin);
    }
    formData.append("user_id", user?.id);
    formData.append("coupon_id", id);
    try {
      setLoading(true);
      const result = await axios({
        method: "post",
        url: "https://shoppet.site/api/coupon/user_coupon",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user?.token,
        },
        data: formData,
      });

      if (result) {
        console.log(result);
        setLoading(false);
        if (result.data.message) {
          Swal.fire({
            position: "center-center",
            icon: "error",
            title: "<p>" + result.data.message + "</p>",
            showConfirmButton: false,
            timer: 2000,
          });
        } else {
          const cookies = new Cookies();
          cookies.set("user", {
            ...user,
            coin_dif: { ...user.coin_dif, coin: result.data.coin },
          });
          dispatch(
            setUser({
              ...user,
              coin_dif: { ...user.coin_dif, coin: result.data.coin },
            })
          );

          Swal.fire({
            position: "center-center",
            icon: "success",
            title: "Lấy mã thành công",
            showConfirmButton: false,
            timer: 2000,
          });
        }
        listCoupon();
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Layout>
      {loading && (
        <div className="mt-5">
          <Loading></Loading>
        </div>
      )}
      <div className="w-4/5 mx-auto p-5 rounded-lg mt-5">
        <div className="grid grid-cols-12 gap-3">
          {coupons &&
            !loading &&
            coupons.map((item) => (
              <ItemCoupon
                createUserCoupon={createUserCoupon}
                item={item}
                key={item.id}
              ></ItemCoupon>
            ))}
        </div>
      </div>
    </Layout>
  );
};

export default Coupons;
