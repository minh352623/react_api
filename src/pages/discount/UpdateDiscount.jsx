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
import { setLoading } from "../../redux-thunk/userSlice";
import Loading from "../../components/Loading";
const schema = yup.object({
  caption: yup.string().min(5, "Tên đối tác ít nhất 5 kí tự"),
  title: yup.string().min(5, "Tên đối tác ít nhất 5 kí tự"),
});

const UpdateDiscount = () => {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const { user } = useSelector((state) => state.user);
  const { discount } = useParams();
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

  const FetchPartner = async () => {
    setLoading(true);
    const result = await axios({
      method: "get",
      url: "https://shoppet.fun/api/discount/update/" + discount,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + user?.token,
      },
    });
    if (result) {
      setValue("caption", result.data.caption);
      setValue("title", result.data.title);

      setValue("file_path", result.data.image);
      setData(result.data);
      setLoading(false);
    }
  };
  const onSubmitUpdate = async (values) => {
    if (!isValid) return;
    const formData = new FormData();
    formData.append("caption", values.caption);
    formData.append("title", values.title);
    formData.append("file_path", values.file_path[0]);

    try {
      const result = await axios({
        method: "post",
        url: "https://shoppet.fun/api/discount/update/" + discount,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user?.token,
        },
        data: formData,
      });

      if (result) {
        setMessage("Cập discount thành công");
        setError("");
      }

      console.log(result);
    } catch (e) {
      setMessage("");
      setError("Có lỗi xảy ra. Vui lòng kiểm tra lại!");
    }
  };

  useEffect(() => {
    FetchPartner();
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
        <h2 className="text-center">Update Discount</h2>

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
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  {...register("title")}
                  name="title"
                  placeholder="Enter title"
                />
                {errors?.title && (
                  <p className="text-red-500 mt-1 text-sm">
                    {errors.title.message}
                  </p>
                )}
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="file"
                  name="file_path"
                  {...register("file_path")}
                />
                {errors?.file_path && (
                  <p className="text-red-500 mt-1 text-sm">
                    {errors.file_path.message}
                  </p>
                )}

                {data.image && (
                  <img
                    className="w-[300px] rounded-2xl mt-3 object-cover"
                    src={`http://127.0.0.1:8000${data.image}`}
                    alt=""
                  />
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

export default UpdateDiscount;
