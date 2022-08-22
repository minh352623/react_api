import axios from "axios";
import React, { useEffect, useState } from "react";
import HeaderClient from "./HeaderClient";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../Loading";
import Loader from "../Loader";

const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const [menus, setMenus] = useState();
  const [settings, setSettings] = useState();
  const [loading, setLoading] = useState(true);
  const FetchMenu = async () => {
    setLoading(true);
    const response = await axios({
      method: "get",
      url: "http://127.0.0.1:8000/api/menu/all",
      headers: {
        Authorization: "Bearer " + user?.token,
      },
    });
    if (response) {
      setMenus(response.data);
      setLoading(false);
    }
  };
  const FetchSetting = async () => {
    setLoading(true);

    const response = await axios({
      method: "get",
      url: "http://127.0.0.1:8000/api/setting/all",
      headers: {
        Authorization: "Bearer " + user?.token,
      },
    });
    if (response) {
      setSettings(response.data);
      setLoading(false);
    }
  };
  useEffect(() => {
    FetchMenu();
    FetchSetting();
  }, []);

  return (
    <>
      {loading && <Loader></Loader>}
      {menus && settings && !loading && (
        <HeaderClient settings={settings} data={menus} check></HeaderClient>
      )}
      {!loading && children}
    </>
  );
};

export default Layout;
