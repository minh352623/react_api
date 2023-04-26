import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Header from "../../components/layouts/Header";
import { useSelector } from "react-redux";
import axios from "axios";
import Loading from "../../components/Loading";
const schema = yup.object({
  caption: yup.string().min(5, "Caption phải lớn hơn 5 kí tự"),
  heading: yup.string().min(5, "Heading phải lớn hơn 5 kí tự"),
  description: yup.string().min(5, "Description phải lớn hơn 5 kí tự"),
});
const AddSlider = () => {
  const { user } = useSelector((state) => state.user);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
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
    console.log(values);
    const formData = new FormData();
    formData.append("caption", values.caption);
    formData.append("heading", values.heading);
    formData.append("description", values.description);
    formData.append("file_path", values.file_path[0]);

    try {
      setLoading(true);
      const respone = await axios({
        method: "post",
        url: "https://shoppet.site/api/slider/add",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user?.token,
        },
        data: formData,
      });
      console.log(respone);
      if (respone.status == 200 || respone.status == 201) {
        reset({
          caption: "",
          heading: "",
          description: "",
          file_path: "",
        });
        setMessage("Thêm slider thành công!");
        setLoading(false);
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
        <h2 className="text-center">Add Slider</h2>

        {/* {error && <h4 className="text-red-400 text-center">{error}</h4>} */}
        {message && (
          <h4 className="text-green-400 bg-green-200 p-3 rounded-lg text-center">
            {message}
          </h4>
        )}

        <div className="grid grid-cols-1 gap-x-5 gap-y-3">
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Images</Form.Label>
            <Form.Control
              required
              type="file"
              name="file_path"
              {...register("file_path")}
            />
            {errors?.file_path && (
              <p className="text-red-500 mt-1 text-sm">
                {errors.file_path.message}
              </p>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Caption</Form.Label>
            <Form.Control
              type="text"
              {...register("caption")}
              name="caption"
              placeholder="Enter caption"
            />
            {errors?.caption && (
              <p className="text-red-500 mt-1 text-sm">
                {errors.caption.message}
              </p>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Heading</Form.Label>
            <Form.Control
              type="text"
              {...register("heading")}
              name="heading"
              placeholder="Enter heading"
            />
            {errors?.heading && (
              <p className="text-red-500 mt-1 text-sm">
                {errors.heading.message}
              </p>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              {...register("description")}
              name="description"
              placeholder="Enter description"
            />
            {errors?.description && (
              <p className="text-red-500 mt-1 text-sm">
                {errors.description.message}
              </p>
            )}
          </Form.Group>
        </div>

        <Button variant="primary" type="submit">
          {loading ? <Loading></Loading> : "submit"}
        </Button>
      </Form>
    </>
  );
};

export default AddSlider;
