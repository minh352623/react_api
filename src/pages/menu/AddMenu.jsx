import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/layouts/Header";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const schema = yup.object({
  name: yup.string().min(2, "Tên menu ít nhất 2 kí tự"),
});
const AddMenu = () => {
  const select = useRef(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [menus, setMenu] = useState();
  const { user } = useSelector((state) => state.user);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting, isSubmitSuccessful },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const FetchMenu = async () => {
    const result = await axios({
      method: "GET",
      url: `https://shoppet-tm.herokuapp.com/api/menu/recusive`,
      headers: { Authorization: "Bearer " + user?.token },
    });
    if (result) {
      console.log(result.data.data);
      setMenu(result.data.data);
    }
  };

  const onSubmitAdd = async (values) => {
    console.log(values);
    if (!isValid) return;
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("parent_id", values.parent_id);

    try {
      const result = await axios({
        method: "post",
        url: "https://shoppet-tm.herokuapp.com/api/menu/add",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user?.token,
        },
        data: formData,
      });
      reset({
        name: "",
      });
      if (result) {
        setMessage("Thêm menu dùng thành công");
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
    FetchMenu();
  }, []);

  return (
    <>
      <Header></Header>
      <Form
        encType="multipart/form-data"
        method="post"
        onSubmit={handleSubmit(onSubmitAdd)}
        className="w-[800px] mx-auto mt-5 shadow-lg p-5 rounded-lg"
      >
        <h2 className="text-center">Add Menu</h2>

        {error && <h4 className="text-red-400 text-center">{error}</h4>}
        {message && (
          <h4 className="text-green-400 bg-green-200 p-3 rounded-lg text-center">
            {message}
          </h4>
        )}

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
              <p className="text-red-500 mt-1 text-sm">{errors.name.message}</p>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Parent Menu</Form.Label>
            <Form.Select
              required
              ref={select}
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
      </Form>
    </>
  );
};

export default AddMenu;
