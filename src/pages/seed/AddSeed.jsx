import React, { useEffect, useState, useRef } from "react";
import Header from "../../components/layouts/Header";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useSelector } from "react-redux";
import { Editor } from "@tinymce/tinymce-react";
import Loading from "../../components/Loading";
const schema = yup.object({
  name: yup.string().min(6, "Tên sản phẩm ít nhất 6 kí tự"),
});
const AddSeed = () => {
  const { user } = useSelector((state) => state.user);
  const [category, setCategory] = useState();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const editorRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting, isSubmitSuccessful },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmitAdd = async (values) => {
    console.log(values);
    if (!isValid) return;
    const formData = new FormData();
    // file_path: values.file_path[0].name,
    // console.log(values);

    // console.log([...values.image_detail]);
    // console.log(values.file_path[0]);
    formData.append("name", values.name);
    formData.append("coin_cost", values.coin_cost);
    formData.append("receive_coin", values.receive_coin);

    formData.append("water_cost", values.water_cost);
    formData.append("file_path", values.file_path[0]);
    formData.append("file_path_2", values.file_path_2[0]);
    formData.append("file_path_3", values.file_path_3[0]);

    try {
      setLoading(true);
      const result = await axios({
        method: "post",
        url: "https://shoppet.fun/api/seed/add",
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
        setMessage("Thêm thành công");
        setError("");
        setLoading(false);
      }
      console.log(result);
    } catch (e) {
      console.log(e);
      setMessage("");
      setError("Có lỗi xảy ra. Vui lòng kiểm tra lại!");
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
        <h2 className="text-center">Add Seed</h2>

        {error && <h4 className="text-red-400 text-center">{error}</h4>}
        {message && (
          <h4 className="text-green-400 bg-green-200 p-3 rounded-lg text-center">
            {message}
          </h4>
        )}

        <div className="grid grid-cols-1 gap-x-5 gap-y-3">
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Name Seed</Form.Label>
            <Form.Control
              type="text"
              {...register("name")}
              name="name"
              placeholder="Enter product name"
            />
            {errors?.name && (
              <p className="text-red-500 mt-1 text-sm">{errors.name.message}</p>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Coin_cost</Form.Label>
            <Form.Control
              type="number"
              name="coin_cost"
              {...register("coin_cost")}
              placeholder="Enter coin_cost"
            />
            {errors?.coin_cost && (
              <p className="text-red-500 mt-1 text-sm">
                {errors.coin_cost.message}
              </p>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Water_cost</Form.Label>
            <Form.Control
              type="number"
              name="water_cost"
              {...register("water_cost")}
              placeholder="Enter water_cost"
            />
            {errors?.water_cost && (
              <p className="text-red-500 mt-1 text-sm">
                {errors.water_cost.message}
              </p>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Receive_coin</Form.Label>
            <Form.Control
              type="number"
              name="receive_coin"
              {...register("receive_coin")}
              placeholder="Enter receive_coin"
            />
            {errors?.receive_coin && (
              <p className="text-red-500 mt-1 text-sm">
                {errors.receive_coin.message}
              </p>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formControlsFile">
            <Form.Label>Image</Form.Label>
            <Form.Control
              required
              type="file"
              name="file_path"
              {...register("file_path")}
              placeholder="Password"
            />
            {errors?.file_path && (
              <p className="text-red-500 mt-1 text-sm">
                {errors.file_path.message}
              </p>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formControlsFile">
            <Form.Label>Image_2</Form.Label>
            <Form.Control
              required
              type="file"
              name="file_path_2"
              {...register("file_path_2")}
              placeholder="Password"
            />
            {errors?.file_path_2 && (
              <p className="text-red-500 mt-1 text-sm">
                {errors.file_path_2.message}
              </p>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formControlsFile">
            <Form.Label>Image_3</Form.Label>
            <Form.Control
              required
              type="file"
              name="file_path_3"
              {...register("file_path_3")}
              placeholder="Password"
            />
            {errors?.file_path_3 && (
              <p className="text-red-500 mt-1 text-sm">
                {errors.file_path_3.message}
              </p>
            )}
          </Form.Group>
        </div>

        <Button variant="primary" type="submit">
          {loading ? "Đang xử lý..." : "Submit"}
        </Button>
      </Form>
    </>
  );
};

export default AddSeed;
