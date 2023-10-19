import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import { setLoading, setUser } from "../../redux-thunk/userSlice";
import Cookies from "universal-cookie";

const LoginGoogle = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(location.search);
    const fetch = async () => {
      const response = await axios.get(
        "https://shoppet.fun/api/auth/google/callback" + location.search
      );
      if (response?.data?.token) {
        console.log(response.data.token);
        const cookies = new Cookies();
        cookies.set("jwt", response.data.token);
        cookies.set("user", response.data.user);
        dispatch(setUser(response.data.user));
        setTimeout(() => {
          dispatch(setLoading(false));
        }, 100);
        navigate("/home");
      }
    };
    fetch();
  }, []);
  return (
    <div>
      <Loading></Loading>
    </div>
  );
};

export default LoginGoogle;
