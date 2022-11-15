import React, { useEffect, useState } from "react";
import Header from "../../components/layouts/Header";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const schema = yup.object({
  name: yup.string().min(2, "Tên danh mục phải lớn hơn 2 kí tự"),
});
const UpdateCategory = () => {
  const { user } = useSelector((state) => state.user);
  const [message, setMessage] = useState("");
  const { category } = useParams();
  const [error, setError] = useState("");
  const [data, setData] = useState();
  //console.log(category);
  const [loading, setLoading] = useState(true);
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
  const FetchCategory = async () => {
    try {
      setLoading(true);
      const response = await axios({
        method: "GET",
        url: "https://shoppet.site/api/category/update/" + category,

        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user?.token,
        },
      });
      if (response.status == 200) {
        setData(response.data);
        setValue("name", response.data.name);
        setLoading(false);
      }
    } catch (err) {
      //console.log(err);
    }
  };

  const onSubmitUpdate = async (values) => {
    console.log(values);
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("file_path", values.file_path[0]);
    formData.append("icon_image", values.icon_path[0]);

    try {
      const respone = await axios({
        method: "post",
        url: "https://shoppet.site/api/category/update/" + category,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user?.token,
        },
        data: formData,
      });
      console.log(respone);
      if (respone.status === 200) {
        setMessage("Update danh mục thành công!");
      }
    } catch (err) {
      //console.log(err);
    }
  };

  useEffect(() => {
    FetchCategory();
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
        <h2 className="text-center">Update Category</h2>

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
            <div className="grid grid-cols-1 gap-x-5 gap-y-3">
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Name User</Form.Label>
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
                <Form.Label>Avatar</Form.Label>
                <Form.Control
                  type="file"
                  name="file_path"
                  {...register("file_path")}
                />
                <img className="mt-2 w-[100px]" src={`${data.image}`} alt="" />
                {errors?.file_path && (
                  <p className="text-red-500 mt-1 text-sm">
                    {errors.file_path.message}
                  </p>
                )}
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Icon</Form.Label>
                <Form.Control
                  type="file"
                  name="icon_path"
                  {...register("icon_path")}
                />
                <img className="mt-2" src={`${data.icon_image}`} alt="" />
                {errors?.icon_path && (
                  <p className="text-red-500 mt-1 text-sm">
                    {errors.icon_path.message}
                  </p>
                )}
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

export default UpdateCategory;
