import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { isBuffer } from "lodash";
import Layout from "../../components/layouts/Layout";
import Cookies from "universal-cookie";
import { fetchCurrentUser } from "../../redux-thunk/userSlice";
import { useDispatch } from "react-redux";
const cookies = new Cookies();

const schema = yup.object().shape({
  name: yup.string().min(2, "Tên user ít nhất 2 kí tự"),
  email: yup
    .string()
    .required("Email bắt buộc phải nhập")
    .email("Email không hợp lệ"),
});
const EditUSer = () => {
  const dispatch = useDispatch();

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { user } = useSelector((state) => state.user);
  const [userInfo, setUserInfo] = useState();
  const [loading, setLoading] = useState(true);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid, isSubmitting, isSubmitSuccessful },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const FetchUser = async () => {
    try {
      setLoading(true);
      const response = await axios({
        method: "GET",
        url: "https://shoppet.site/api/users/update/" + user.id,

        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user?.token,
        },
      });
      if (response.data) {
        setUserInfo((userInfo) => ({
          ...userInfo,
          ...response.data,
        }));
        setValue("name", response.data.name);
        setValue("email", response.data.email);
        setValue("phone", response.data.phone);
        setValue("address", response.data.address);

        setValue("description", response.data.description);
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    FetchUser();
  }, []);
  const onSubmitUpdate = async (values) => {
    if (!isValid) return;
    const formData = new FormData();
    // file_path: values.file_path[0].name,
    //console.log(values);

    //console.log(values.file_path);
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("phone", values.phone);
    formData.append("address", values.address);

    formData.append("description", values.description);
    formData.append("file_path", values.file_path[0]);

    try {
      const result = await axios({
        method: "post",
        url: "https://shoppet.site/api/users/update/" + user.id,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user?.token,
        },
        data: formData,
      });

      if (result) {
        cookies.set("user", result.data);
        cookies.set("jwt", result.data.token);

        dispatch(fetchCurrentUser(result.data));
        setUserInfo((userInfo) => ({
          ...userInfo,
          ...result.data,
        }));
        setMessage("Cập nhật nguời dùng thành công");
        setError("");
      }
      //console.log(result);
    } catch (e) {
      //console.log(e);
      setMessage("");
      setError("Có lỗi xảy ra. Vui lòng kiểm tra lại!");
    }
  };
  return (
    <Layout>
      <div className="my-3">
        <Form
          encType="multipart/form-data"
          method="post"
          onSubmit={handleSubmit(onSubmitUpdate)}
          className="w-[1000px] mx-auto mt-5 shadow-lg p-5 rounded-lg"
        >
          <h2 className="text-center">Edit Info</h2>

          {error && <h4 className="text-red-400 text-center">{error}</h4>}
          {message && (
            <h4 className="text-green-400 bg-green-200 p-3 rounded-lg text-center">
              {message}
            </h4>
          )}
          {loading && (
            <span className="text-center mx-auto flex justify-center w-8 h-8 rounded-full border-slate-600 border-4 border-r-4 border-r-transparent animate-spin inline-block"></span>
          )}
          {!loading && (
            <>
              <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Name User</Form.Label>
                  <Form.Control
                    type="text"
                    {...register("name")}
                    name="name"
                    //   defaultValue={userInfo?.name}
                    placeholder="Enter name"
                  />
                  {errors?.name && (
                    <p className="text-red-500 mt-1 text-sm">
                      {errors.name.message}
                    </p>
                  )}
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="text"
                    name="email"
                    //   defaultValue={userInfo?.email}
                    {...register("email")}
                    placeholder="Enter email"
                  />
                  {errors?.email && (
                    <p className="text-red-500 mt-1 text-sm">
                      {errors.email.message}
                    </p>
                  )}
                </Form.Group>
                {/* <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="text"
                    name="password"
                    {...register("password")}
                    placeholder="Nếu bạn không nhập gì chúng tôi sẽ giữ nguyên mật khẩu củ"
                  />
                  {errors?.password && (
                    <p className="text-red-500 mt-1 text-sm">
                      {errors.password.message}
                    </p>
                  )}
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirm_password"
                    {...register("confirm_password")}
                    placeholder="Nếu bạn không nhập gì chúng tôi sẽ giữ nguyên mật khẩu củ"
                  />
                  {errors?.confirm_password && (
                    <p className="text-red-500 mt-1 text-sm">
                      {errors.confirm_password.message}
                    </p>
                  )}
                </Form.Group> */}
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Avatar</Form.Label>
                  <Form.Control
                    type="file"
                    name="file_path"
                    {...register("file_path")}
                    placeholder="Password"
                  />
                  {userInfo?.image && (
                    <img
                      src={`${userInfo.image}`}
                      className="mt-3 w-10 h-10 object-cover rounded-full"
                    />
                  )}
                  {errors?.file_path && (
                    <p className="text-red-500 mt-1 text-sm">
                      {errors.file_path.message}
                    </p>
                  )}
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    {...register("phone")}
                  ></Form.Control>
                  {errors?.phone && (
                    <p className="text-red-500 mt-1 text-sm">
                      {errors.phone.message}
                    </p>
                  )}
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    {...register("description")}
                    placeholder="Description"
                  />
                  {errors?.description && (
                    <p className="text-red-500 mt-1 text-sm">
                      {errors.description.message}
                    </p>
                  )}
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="address"
                    {...register("address")}
                    placeholder="address"
                  />
                  {errors?.address && (
                    <p className="text-red-500 mt-1 text-sm">
                      {errors.address.message}
                    </p>
                  )}
                </Form.Group>
              </div>
              <div className="block text-end">
                <button
                  className="px-6 py-3 font-semibold hover:bg-slate-700 bg-slate-900 rounded-xl text-white"
                  type="submit"
                >
                  Submit
                </button>
              </div>
            </>
          )}
        </Form>
      </div>
    </Layout>
  );
};

export default EditUSer;
