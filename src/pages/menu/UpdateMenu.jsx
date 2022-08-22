import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/layouts/Header";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Loading from "../../components/Loading";
const schema = yup.object({
  name: yup.string().min(2, "Tên menu ít nhất 2 kí tự"),
});
const UpdateMenu = () => {
  const { user } = useSelector((state) => state.user);
  const [message, setMessage] = useState("");
  const [data, setData] = useState({});
  const { menu } = useParams();
  const [loading, setLoading] = useState(true);
  const [menus, setMenu] = useState();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid, isSubmitting, isSubmitSuccessful },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const FetchData = async () => {
    try {
      setLoading(true);
      const respone = await axios({
        method: "GET",
        url: "http://127.0.0.1:8000/api/menu/update/" + menu,

        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user?.token,
        },
      });
      if (respone.status == 200) {
        setData(respone.data.result);
        setMenu(respone.data.parent);
        setValue("name", respone.data.result.name);
        setValue("parent_id", respone.data.result.parent_id);
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const onSubmitUpdate = async (values) => {
    console.log(values);
    if (!isValid) return;
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("parent_id", values.parent_id);

    try {
      const result = await axios({
        method: "post",
        url: "http://127.0.0.1:8000/api/menu/update/" + menu,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user?.token,
        },
        data: formData,
      });

      if (result) {
        setMessage("Cập nhật menu dùng thành công");
        setError("");
      }

      console.log(result);
    } catch (e) {
      console.log(e);
      setMessage("");
      setError("Có lỗi xảy ra. Vui lòng kiểm tra lại!");
    }
  };
  useEffect(() => {
    FetchData();
  }, []);

  return (
    <>
      <Header></Header>
      <Form
        encType="multipart/form-data"
        method="post"
        onSubmit={handleSubmit(onSubmitUpdate)}
        className="w-[800px] mx-auto mt-5 shadow-lg p-5 rounded-lg"
      >
        <h2 className="text-center">Update Menu</h2>

        {error && <h4 className="text-red-400 text-center">{error}</h4>}
        {message && (
          <h4 className="text-green-400 bg-green-200 p-3 rounded-lg text-center">
            {message}
          </h4>
        )}
        {loading && <Loading></Loading>}
        {!loading && (
          <>
            <div className="grid grid-cols-1 gap-x-5 gap-y-3">
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Name Menu</Form.Label>
                <Form.Control
                  type="text"
                  {...register("name")}
                  name="name"
                  placeholder="Enter name"
                />
                {errors?.name && (
                  <p className="text-red-500 mt-1 text-sm">
                    {errors.name.message}
                  </p>
                )}
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Parent Menu</Form.Label>
                <Form.Select
                  required
                  name="parent_id"
                  {...register("parent_id")}
                  aria-label="Default select example"
                  dangerouslySetInnerHTML={{ __html: menus }}
                />
              </Form.Group>
            </div>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </>
        )}
      </Form>
    </>
  );
};

export default UpdateMenu;
