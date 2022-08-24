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
  name: yup.string().min(2, "Tên đối tác ít nhất 2 kí tự"),
});

const UpdatePartner = () => {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const { user } = useSelector((state) => state.user);
  const { partner } = useParams();
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
      url: "http://127.0.0.1:8000/api/partner/update/" + partner,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + user?.token,
      },
    });
    if (result) {
      setValue("name", result.data.name);
      setValue("file_path", result.data.image);
      setData(result.data);
      setLoading(false);
    }
  };
  const onSubmitUpdate = async (values) => {
    console.log(values);
    if (!isValid) return;
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("file_path", values.file_path[0]);

    try {
      const result = await axios({
        method: "post",
        url: "http://127.0.0.1:8000/api/partner/update/" + partner,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user?.token,
        },
        data: formData,
      });

      if (result) {
        setMessage("Cập nhật đối tác thành công");
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
        <h2 className="text-center">Update Partner</h2>

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
                <Form.Label>Name</Form.Label>
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
                <Form.Label>Image</Form.Label>
                <Form.Control
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
                {data?.image && (
                  <img src={`http://127.0.0.1:8000${data.image}`} alt="" />
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

export default UpdatePartner;
