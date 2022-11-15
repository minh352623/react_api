import React, { useEffect, useState, useRef } from "react";
import Header from "../../components/layouts/Header";
import { useNavigate, useParams } from "react-router-dom";
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
  name: yup.string().min(6, "Tên nhiệm vụ ít nhất 6 kí tự"),
});
const UpdateMission = () => {
  const { user } = useSelector((state) => state.user);
  const [category, setCategory] = useState();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const editorRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
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

  const onSubmitUpdate = async (values) => {
    console.log(values);
    if (!isValid) return;
    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("water_take", values.water_take);
    formData.append("type_mission", values.type_mission);
    formData.append("value_type", values.value_type);

    formData.append("energy", values.energy);
    if (values.file_path) {
      formData.append("file_path", values.file_path[0]);
    }
    try {
      setLoading(true);
      const result = await axios({
        method: "post",
        url: "https://shoppet.site/api/mission/update/" + id,
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
        FetchSeedDetail(id);
        setMessage("Update thành công");
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
  const [formData, setFormData] = useState({});
  const FetchSeedDetail = async (id) => {
    try {
      setLoading(true);
      const result = await axios.get(
        "https://shoppet.site/api/mission/update/" + id,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + user?.token,
          },
        }
      );
      console.log(result);
      if (result) {
        let detailData = await result.data.data;
        if (detailData) {
          setValue("name", detailData.name);
          setValue("water_take", detailData.water_take);
          setValue("energy", detailData.energy);
          setValue("type_mission", detailData.type_mission);
          setValue("value_type", detailData.value_type);

          setFormData({
            ...detailData,
          });
        }
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    FetchSeedDetail(id);
  }, []);
  return (
    <>
      <Header></Header>
      <Form
        encType="multipart/form-data"
        method="post"
        onSubmit={handleSubmit(onSubmitUpdate)}
        className="w-[1000px] mx-auto mt-5 shadow-lg p-5 rounded-lg"
      >
        <h2 className="text-center">Update Mission</h2>

        {error && <h4 className="text-red-400 text-center">{error}</h4>}
        {message && (
          <h4 className="text-green-400 bg-green-200 p-3 rounded-lg text-center">
            {message}
          </h4>
        )}

        <div className="grid grid-cols-1 gap-x-5 gap-y-3">
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Name Mission</Form.Label>
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
            <Form.Label>Water_take</Form.Label>
            <Form.Control
              type="number"
              min="1"
              name="water_take"
              {...register("water_take")}
              placeholder="Enter water_take"
            />
            {errors?.water_take && (
              <p className="text-red-500 mt-1 text-sm">
                {errors.water_take.message}
              </p>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Energy</Form.Label>
            <Form.Control
              type="number"
              min="1"
              max="3"
              name="energy"
              {...register("energy")}
              placeholder="Enter energy"
            />
            {errors?.energy && (
              <p className="text-red-500 mt-1 text-sm">
                {errors.energy.message}
              </p>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Type_mission</Form.Label>
            <Form.Select
              aria-label="Default select example"
              name="type_mission"
              {...register("type_mission")}
            >
              <option value="1">Dạng điểm danh</option>
              <option value="2">Dạng nhiệm vụ chuyển trang</option>
            </Form.Select>
            {errors?.type_mission && (
              <p className="text-red-500 mt-1 text-sm">
                {errors.type_mission.message}
              </p>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Value_type</Form.Label>
            <Form.Control
              type="text"
              name="value_type"
              {...register("value_type")}
              placeholder="Enter value_type"
            />
            {errors?.value_type && (
              <p className="text-red-500 mt-1 text-sm">
                {errors.value_type.message}
              </p>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formControlsFile">
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

            <img
              src={formData?.image}
              className="w-[200px] mt-3 shadow-xl"
              alt=""
            />
          </Form.Group>
        </div>

        <Button variant="primary" type="submit">
          {loading ? "Đang xử lý..." : "Submit"}
        </Button>
      </Form>
    </>
  );
};

export default UpdateMission;
