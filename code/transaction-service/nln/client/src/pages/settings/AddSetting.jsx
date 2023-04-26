import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Header from "../../components/layouts/Header";
import { useSelector } from "react-redux";
import axios from "axios";
const schema = yup.object({
  config_key: yup.string().min(2, "Tên cài đặt phải lớn hơn 2 kí tự"),
  config_value: yup.string().min(2, "Giá trị cài đặt phải lớn hơn 2 kí tự"),
});
const AddSetting = () => {
  const { user } = useSelector((state) => state.user);
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmitAdd = async (values) => {
    const formData = new FormData();
    formData.append("config_key", values.config_key);
    formData.append("config_value", values.config_value);

    try {
      const respone = await axios({
        method: "post",
        url: "https://shoppet.site/api/setting/add",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user?.token,
        },
        data: formData,
      });
      console.log(respone);
      if (respone.status == 200 || respone.status == 201) {
        reset({
          config_key: "",
          config_value: "",
        });
        setMessage("Thêm cài đặt thành công!");
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <Header></Header>
      <Form
        encType="multipart/form-data"
        method="post"
        onSubmit={handleSubmit(onSubmitAdd)}
        className="w-[1000px] mx-auto mt-5 shadow-lg p-5 rounded-lg"
      >
        <h2 className="text-center">Add Setting</h2>

        {/* {error && <h4 className="text-red-400 text-center">{error}</h4>} */}
        {message && (
          <h4 className="text-green-400 bg-green-200 p-3 rounded-lg text-center">
            {message}
          </h4>
        )}

        <div className="grid grid-cols-1 gap-x-5 gap-y-3">
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Config key</Form.Label>
            <Form.Control
              type="text"
              {...register("config_key")}
              name="config_key"
              placeholder="Enter config_key"
            />
            {errors?.config_key && (
              <p className="text-red-500 mt-1 text-sm">
                {errors.config_key.message}
              </p>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Config value</Form.Label>
            <Form.Control
              type="text"
              {...register("config_value")}
              name="config_value"
              placeholder="Enter config_value"
            />
            {errors?.config_value && (
              <p className="text-red-500 mt-1 text-sm">
                {errors.config_value.message}
              </p>
            )}
          </Form.Group>
        </div>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </>
  );
};

export default AddSetting;
