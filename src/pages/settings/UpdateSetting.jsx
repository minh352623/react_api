import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Header from "../../components/layouts/Header";
import { useSelector } from "react-redux";
import axios from "axios";
import { useParams } from "react-router-dom";
import Loading from "../../components/Loading";
const schema = yup.object({
  config_key: yup.string().min(2, "Tên cài đặt phải lớn hơn 2 kí tự"),
  config_value: yup.string().min(2, "Giá trị cài đặt phải lớn hơn 2 kí tự"),
});

const UpdateSetting = () => {
  const { user } = useSelector((state) => state.user);
  const [message, setMessage] = useState("");
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const { setting } = useParams();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const FetchSetting = async () => {
    try {
      setLoading(true);
      const response = await axios({
        method: "GET",
        url: "http://127.0.0.1:8000/api/setting/update/" + setting,

        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user?.token,
        },
      });
      console.log(response);
      if (response.status == 200) {
        setData(response.data);
        setValue("config_key", response.data.config_key);
        setValue("config_value", response.data.config_value);

        setLoading(false);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    FetchSetting();
  }, []);

  const onSubmitUpdate = async (values) => {
    console.log(values);
    const formData = new FormData();
    formData.append("config_key", values.config_key);
    formData.append("config_value", values.config_value);

    try {
      const respone = await axios({
        method: "post",
        url: "http://127.0.0.1:8000/api/setting/update/" + setting,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user?.token,
        },
        data: formData,
      });
      console.log(respone);
      if (respone.status == 200 || respone.status == 201) {
        setMessage("Cập nhật setting thành công!");
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
        onSubmit={handleSubmit(onSubmitUpdate)}
        className="w-[1000px] mx-auto mt-5 shadow-lg p-5 rounded-lg"
      >
        <h2 className="text-center">Update Setting</h2>

        {/* {error && <h4 className="text-red-400 text-center">{error}</h4>} */}
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
          </>
        )}
      </Form>
    </>
  );
};

export default UpdateSetting;
