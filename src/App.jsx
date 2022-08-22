import { Fragment, useCallback, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddProduct from "./pages/product/AddProduct";
import UpdateProduct from "./pages/product/UpdateProduct";
import ListProduct from "./pages/product/ListProduct";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser, setLoading } from "./redux-thunk/userSlice";
import Cookies from "universal-cookie";
import Swal from "sweetalert2";
import ListGroup from "./pages/groups/ListGroup";
import AddGroup from "./pages/groups/AddGroup";
import UpdateGroup from "./pages/groups/UpdateGroup";
import ListUser from "./pages/users/ListUser";
import AddUser from "./pages/users/AddUser";
import UpdateUSer from "./pages/users/UpdateUSer";
import ListCategory from "./pages/category/ListCategory";
import AddCategory from "./pages/category/AddCategory";
import UpdateCategory from "./pages/category/UpdateCategory";
import ListSlider from "./pages/slider/ListSlider";
import AddSlider from "./pages/slider/AddSlider";
import UpdateSlider from "./pages/slider/UpdateSlider";
import Loader from "./components/Loader";
import ListSettings from "./pages/settings/ListSettings";
import AddSetting from "./pages/settings/AddSetting";
import UpdateSetting from "./pages/settings/UpdateSetting";
import ListMenu from "./pages/menu/ListMenu";
import AddMenu from "./pages/menu/AddMenu";
import UpdateMenu from "./pages/menu/UpdateMenu";
import HomeClient from "./pages/client/HomeClient";
import PrivateRoute from "./PrivateRoute";

const cookies = new Cookies();

function App() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(setLoading(true));
    if (cookies.get("user")) {
      dispatch(fetchCurrentUser(cookies.get("user")));
      setTimeout(() => {
        dispatch(setLoading(false));
      }, 1100);
    } else {
      Swal.fire("Đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  if (loading) return <Loader></Loader>;
  return (
    <>
      {!loading && (
        <Fragment>
          <Routes>
            <Route
              path="/admin"
              element={
                <PrivateRoute roles={[1]}>
                  <Home></Home>
                </PrivateRoute>
              }
            ></Route>

            <Route path="/login" element={<Login></Login>}></Route>
            <Route path="/register" element={<Register></Register>}></Route>
            <Route
              path="/product"
              element={
                <PrivateRoute roles={[1]}>
                  <ListProduct></ListProduct>
                </PrivateRoute>
              }
            ></Route>
            <Route
              path="/addProduct"
              element={
                <PrivateRoute roles={[1]}>
                  <AddProduct></AddProduct>
                </PrivateRoute>
              }
            ></Route>
            <Route
              path="/updateProduct/:id"
              element={
                <PrivateRoute roles={[1]}>
                  <UpdateProduct></UpdateProduct>
                </PrivateRoute>
              }
            ></Route>

            <Route
              path="/group"
              element={
                <PrivateRoute roles={[1]}>
                  <ListGroup></ListGroup>
                </PrivateRoute>
              }
            ></Route>
            <Route
              path="/addGroup"
              element={
                <PrivateRoute roles={[1]}>
                  <AddGroup></AddGroup>
                </PrivateRoute>
              }
            ></Route>
            <Route
              path="/updateGroup/:group"
              element={
                <PrivateRoute roles={[1]}>
                  <UpdateGroup></UpdateGroup>
                </PrivateRoute>
              }
            ></Route>

            <Route
              path="/users"
              element={
                <PrivateRoute roles={[1]}>
                  <ListUser></ListUser>
                </PrivateRoute>
              }
            ></Route>
            <Route
              path="/addUser"
              element={
                <PrivateRoute roles={[1]}>
                  <AddUser></AddUser>
                </PrivateRoute>
              }
            ></Route>
            <Route
              path="/updateUser/:id"
              element={
                <PrivateRoute roles={[1]}>
                  <UpdateUSer></UpdateUSer>
                </PrivateRoute>
              }
            ></Route>
            <Route
              path="/category"
              element={
                <PrivateRoute roles={[1]}>
                  <ListCategory></ListCategory>
                </PrivateRoute>
              }
            ></Route>
            <Route
              path="/addCategory"
              element={
                <PrivateRoute roles={[1]}>
                  <AddCategory></AddCategory>
                </PrivateRoute>
              }
            ></Route>
            <Route
              path="/updateCategory/:category"
              element={
                <PrivateRoute roles={[1]}>
                  <UpdateCategory></UpdateCategory>
                </PrivateRoute>
              }
            ></Route>
            <Route
              path="/slider"
              element={
                <PrivateRoute roles={[1]}>
                  <ListSlider></ListSlider>
                </PrivateRoute>
              }
            ></Route>
            <Route
              path="/addSlider"
              element={
                <PrivateRoute roles={[1]}>
                  <AddSlider></AddSlider>
                </PrivateRoute>
              }
            ></Route>
            <Route
              path="/updateSlider/:slider"
              element={
                <PrivateRoute roles={[1]}>
                  <UpdateSlider></UpdateSlider>
                </PrivateRoute>
              }
            ></Route>

            <Route
              path="/settings"
              element={
                <PrivateRoute roles={[1]}>
                  <ListSettings></ListSettings>
                </PrivateRoute>
              }
            ></Route>
            <Route
              path="/addSetting"
              element={
                <PrivateRoute roles={[1]}>
                  <AddSetting></AddSetting>
                </PrivateRoute>
              }
            ></Route>
            <Route
              path="/updateSetting/:setting"
              element={
                <PrivateRoute roles={[1]}>
                  <UpdateSetting></UpdateSetting>
                </PrivateRoute>
              }
            ></Route>

            <Route
              path="/menu"
              element={
                <PrivateRoute roles={[1]}>
                  <ListMenu></ListMenu>
                </PrivateRoute>
              }
            ></Route>
            <Route
              path="/addMenu"
              element={
                <PrivateRoute roles={[1]}>
                  <AddMenu></AddMenu>
                </PrivateRoute>
              }
            ></Route>
            <Route
              path="/updateMenu/:menu"
              element={
                <PrivateRoute roles={[1]}>
                  <UpdateMenu></UpdateMenu>
                </PrivateRoute>
              }
            ></Route>

            {/* client */}
            <Route path="/home" element={<HomeClient></HomeClient>}></Route>
          </Routes>
        </Fragment>
      )}
    </>
  );
}

export default App;
