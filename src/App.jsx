import {
  Fragment,
  useCallback,
  useEffect,
  useState,
  lazy,
  Suspense,
} from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCurrentUser,
  setFaceioInstance,
  setLoading,
} from "./redux-thunk/userSlice";
import Cookies from "universal-cookie";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css"; // You can also use <link> for styles
import { handleFetchCart } from "./redux-thunk/cartSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./ProtectedRoute";
import Loader from "./components/Loader";
import PrivateRoute from "./PrivateRoute";
import axios from "axios";
import { io } from "socket.io-client";

import LoginGoogle from "./pages/client/LoginGoogle";
const ResetPassword = lazy(() => import("./pages/client/ResetPassword"));
const ForgotPassword = lazy(() => import("./pages/client/ForgotPassword"));
const FriendFarm = lazy(() => import("./pages/client/FriendFarm"));
const UpdateMission = lazy(() => import("./pages/mission/UpdateMission"));
const AddMission = lazy(() => import("./pages/mission/AddMission"));
const ListMission = lazy(() => import("./pages/mission/ListMission"));
const Farm = lazy(() => import("./pages/client/Farm"));
const UpdateSeed = lazy(() => import("./pages/seed/UpadteSeed"));
const AddSeed = lazy(() => import("./pages/seed/AddSeed"));
const ListSeed = lazy(() => import("./pages/seed/ListSeed"));
const EventDog = lazy(() => import("./pages/client/EventDog"));
const Coin = lazy(() => import("./pages/client/Coin"));
const EventShoot = lazy(() => import("./pages/client/EventShoot"));
const EventZoonbie = lazy(() => import("./pages/client/EventZoonbie"));
const Event = lazy(() => import("./pages/client/Event"));
const Contact = lazy(() => import("./pages/client/Contact"));
const Blockchain = lazy(() => import("./pages/client/Blockchain"));


const Coupons = lazy(() => import("./pages/Coupons"));
const UpdateCoupon = lazy(() => import("./pages/coupon/UpdateCoupon"));
const AddCoupon = lazy(() => import("./pages/coupon/AddCoupon"));
const ListCoupon = lazy(() => import("./pages/coupon/ListCoupon"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const AddProduct = lazy(() => import("./pages/product/AddProduct"));
const UpdateProduct = lazy(() => import("./pages/product/UpdateProduct"));
const ListProduct = lazy(() => import("./pages/product/ListProduct"));
const ListGroup = lazy(() => import("./pages/groups/ListGroup"));
const AddGroup = lazy(() => import("./pages/groups/AddGroup"));
const UpdateGroup = lazy(() => import("./pages/groups/UpdateGroup"));
const ListUser = lazy(() => import("./pages/users/ListUser"));
const AddUser = lazy(() => import("./pages/users/AddUser"));
const UpdateUSer = lazy(() => import("./pages/users/UpdateUSer"));
const ListCategory = lazy(() => import("./pages/category/ListCategory"));
const AddCategory = lazy(() => import("./pages/category/AddCategory"));
const UpdateCategory = lazy(() => import("./pages/category/UpdateCategory"));
const ListSlider = lazy(() => import("./pages/slider/ListSlider"));
const AddSlider = lazy(() => import("./pages/slider/AddSlider"));
const UpdateSlider = lazy(() => import("./pages/slider/UpdateSlider"));
const ListSettings = lazy(() => import("./pages/settings/ListSettings"));
const AddSetting = lazy(() => import("./pages/settings/AddSetting"));
const UpdateSetting = lazy(() => import("./pages/settings/UpdateSetting"));
const ListMenu = lazy(() => import("./pages/menu/ListMenu"));
const AddMenu = lazy(() => import("./pages/menu/AddMenu"));
const UpdateMenu = lazy(() => import("./pages/menu/UpdateMenu"));
const HomeClient = lazy(() => import("./pages/client/HomeClient"));
const ListPartner = lazy(() => import("./pages/partner/ListPartner"));
const AddPartner = lazy(() => import("./pages/partner/AddPartner"));
const UpdatePartner = lazy(() => import("./pages/partner/UpdatePartner"));
const ListDiscount = lazy(() => import("./pages/discount/ListDiscount"));
const AddDiscount = lazy(() => import("./pages/discount/AddDiscount"));
const UpdateDiscount = lazy(() => import("./pages/discount/UpdateDiscount"));
const ShopClient = lazy(() => import("./pages/client/ShopClient"));
const DetailProduct = lazy(() => import("./pages/client/DetailProduct"));
const Cart = lazy(() => import("./pages/client/Cart"));
const Checkout = lazy(() => import("./pages/client/Checkout"));
const Shipping = lazy(() => import("./pages/client/Shipping"));
const Payment = lazy(() => import("./pages/client/Payment"));
const MyBill = lazy(() => import("./pages/client/MyBill"));
const ListBills = lazy(() => import("./pages/bills/ListBills"));
const DetailBill = lazy(() => import("./pages/bills/DetailBill"));
const InfoUser = lazy(() => import("./pages/client/InfoUser"));
const EditInfo = lazy(() => import("./pages/client/EditInfo"));
const ListComment = lazy(() => import("./pages/comments/ListComment"));
// ..
AOS.init();
const cookies = new Cookies();

//lazy load

//end lazy

function App() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.user);
  const [socket, setSocket] = useState();

  useEffect(() => {
    
    dispatch(setLoading(true));
    if (cookies.get("user")) {
      dispatch(fetchCurrentUser(cookies.get("user")));
      setTimeout(() => {
        dispatch(setLoading(false));
      }, 100);
    } else {
      Swal.fire({
        position: "center-center",
        icon: "error",
        title: "Đăng nhập đã hết hạn. Vui lòng đăng nhập lại!",
        showConfirmButton: false,
        timer: 500,
      });
      dispatch(setLoading(false));
    }
  }, [dispatch]);
  const calulatorRating = async () => {
    try {
      const response = await axios({
        method: "get",
        url: "https://shoppet.fun/api/caculator",
      });
      if (response) {
        console.log(response);
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    const socket_connect = io("http://localhost:8080");
    setSocket(socket_connect);
    socket_connect?.off("socket_laravel_order");
    socket_connect?.off("socket_laravel_user_coupon");
    socket_connect?.on("socket_laravel_order", (data) => {
      console.log("🚀 ~ file: App.jsx:147 ~ socket?.on ~ data:", data)
      toast.success("Order!", {
        position: "top-left",
        autoClose: 2000,
      });
    });
    socket_connect?.on("socket_laravel_user_coupon", (data) => {
      console.log("🚀 ~ file: App.jsx:151 ~ socket?.on ~ data:", data)
      toast.success("User Compon!", {
        position: "top-left",
        autoClose: 2000,
      });
    });
    calulatorRating();
  }, []);

  useEffect(() => {
    socket?.emit("addUser", user?.id);
  }, [user, socket]);
  let faceioInstance = null;
  useEffect(() => {
    const faceioScript = document.createElement("script");
    faceioScript.src = "//cdn.faceio.net/fio.js";
    faceioScript.async = true;
    faceioScript.onload = () => faceioScriptLoaded();
    document.body.appendChild(faceioScript);

    return () => {
      document.body.removeChild(faceioScript);
    };
  }, []);
  const faceioScriptLoaded = () => {
    console.log(faceIO);
    if (faceIO && !faceioInstance) {
      faceioInstance = new faceIO("fioa35b6");
      dispatch(setFaceioInstance(faceioInstance));
    }
  };
  
  if (loading) return <Loader></Loader>;
  return (
    <>
      {!loading && (
        <Fragment>
          <Suspense fallback={<></>}>
            <Routes>
              <Route path="*" element={<PageNotFound></PageNotFound>}></Route>
              <Route
                path="/feature"
                element={<PageNotFound></PageNotFound>}
              ></Route>

              <Route
                path="about"
                element={<PageNotFound></PageNotFound>}
              ></Route>

              <Route
                path="/admin"
                element={
                  <PrivateRoute roles={[1]}>
                    <Home></Home>
                  </PrivateRoute>
                }
              ></Route>

              <Route path="/login" element={<Login></Login>}></Route>
              <Route
                path="/logingg"
                element={<LoginGoogle></LoginGoogle>}
              ></Route>

              <Route path="/" element={<Login></Login>}></Route>

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

              <Route
                path="/partner"
                element={
                  <PrivateRoute roles={[1]}>
                    <ListPartner></ListPartner>
                  </PrivateRoute>
                }
              ></Route>
              <Route
                path="/addPartner"
                element={
                  <PrivateRoute roles={[1]}>
                    <AddPartner></AddPartner>
                  </PrivateRoute>
                }
              ></Route>
              <Route
                path="/updatePartner/:partner"
                element={
                  <PrivateRoute roles={[1]}>
                    <UpdatePartner></UpdatePartner>
                  </PrivateRoute>
                }
              ></Route>

              <Route
                path="/discount"
                element={
                  <PrivateRoute roles={[1]}>
                    <ListDiscount></ListDiscount>
                  </PrivateRoute>
                }
              ></Route>
              <Route
                path="/addDiscount"
                element={
                  <PrivateRoute roles={[1]}>
                    <AddDiscount></AddDiscount>
                  </PrivateRoute>
                }
              ></Route>
              <Route
                path="/updateDiscount/:discount"
                element={
                  <PrivateRoute roles={[1]}>
                    <UpdateDiscount></UpdateDiscount>
                  </PrivateRoute>
                }
              ></Route>
              <Route
                path="/bills"
                element={
                  <PrivateRoute roles={[1]}>
                    <ListBills></ListBills>
                  </PrivateRoute>
                }
              ></Route>
              <Route
                path="/bill/:bill"
                element={
                  <PrivateRoute roles={[1]}>
                    <DetailBill></DetailBill>
                  </PrivateRoute>
                }
              ></Route>
              <Route
                path="/comments"
                element={
                  <PrivateRoute roles={[1]}>
                    <ListComment></ListComment>
                  </PrivateRoute>
                }
              ></Route>
              <Route
                path="/coupon"
                element={
                  <PrivateRoute roles={[1]}>
                    <ListCoupon></ListCoupon>
                  </PrivateRoute>
                }
              ></Route>
              <Route
                path="/addCoupon"
                element={
                  <PrivateRoute roles={[1]}>
                    <AddCoupon></AddCoupon>
                  </PrivateRoute>
                }
              ></Route>
              <Route
                path="/updateCoupon/:coupon"
                element={
                  <PrivateRoute roles={[1]}>
                    <UpdateCoupon></UpdateCoupon>
                  </PrivateRoute>
                }
              ></Route>
              <Route
                path="/seed"
                element={
                  <PrivateRoute roles={[1]}>
                    <ListSeed></ListSeed>
                  </PrivateRoute>
                }
              ></Route>
              <Route
                path="/addSeed"
                element={
                  <PrivateRoute roles={[1]}>
                    <AddSeed></AddSeed>
                  </PrivateRoute>
                }
              ></Route>
              <Route
                path="/updateSeed/:id"
                element={
                  <PrivateRoute roles={[1]}>
                    <UpdateSeed></UpdateSeed>
                  </PrivateRoute>
                }
              ></Route>
              <Route
                path="/mission"
                element={
                  <PrivateRoute roles={[1]}>
                    <ListMission></ListMission>
                  </PrivateRoute>
                }
              ></Route>
              <Route
                path="/addMission"
                element={
                  <PrivateRoute roles={[1]}>
                    <AddMission></AddMission>
                  </PrivateRoute>
                }
              ></Route>
              <Route
                path="/updateMission/:id"
                element={
                  <PrivateRoute roles={[1]}>
                    <UpdateMission></UpdateMission>
                  </PrivateRoute>
                }
              ></Route>
              {/* client */}
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <HomeClient></HomeClient>
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/shop"
                element={
                  <ProtectedRoute>
                    <ShopClient></ShopClient>
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/product/:product"
                element={
                  <ProtectedRoute>
                    <DetailProduct></DetailProduct>
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <Cart></Cart>
                  </ProtectedRoute>
                }
              ></Route>
                <Route
                path="/contact"
                element={
                  <ProtectedRoute>
                    <Contact></Contact>
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Checkout></Checkout>
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/shipping"
                element={
                  <ProtectedRoute>
                    <Shipping></Shipping>
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/payment/:bill"
                element={
                  <ProtectedRoute>
                    <Payment></Payment>
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/mybill"
                element={
                  <ProtectedRoute>
                    <MyBill></MyBill>
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/info"
                element={
                  <ProtectedRoute>
                    <InfoUser></InfoUser>
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/editInfo"
                element={
                  <ProtectedRoute>
                    <EditInfo></EditInfo>
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/listCoupon"
                element={
                  <ProtectedRoute>
                    <Coupons></Coupons>
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/event"
                element={
                  <ProtectedRoute>
                    <Event></Event>
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/eventZom"
                element={
                  <ProtectedRoute>
                    <EventZoonbie></EventZoonbie>
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/eventShoot"
                element={
                  <ProtectedRoute>
                    <EventShoot></EventShoot>
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/eventDog"
                element={
                  <ProtectedRoute>
                    <EventDog></EventDog>
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/coin"
                element={
                  <ProtectedRoute>
                    <Coin></Coin>
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/farm"
                element={
                  <ProtectedRoute>
                    <Farm></Farm>
                  </ProtectedRoute>
                }
              ></Route>

              <Route
                path="/farm/friend"
                element={
                  <ProtectedRoute>
                    <FriendFarm></FriendFarm>
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/forgorpassword"
                element={<ForgotPassword></ForgotPassword>}
              ></Route>
              <Route
                path="/reset-password"
                element={<ResetPassword></ResetPassword>}
              ></Route>
              <Route
                path="/Blockchain"
                element={<Blockchain></Blockchain>}
              ></Route>
            </Routes>
          </Suspense>
        </Fragment>
      )}
      <ToastContainer />
    </>
  );
}

export default App;
