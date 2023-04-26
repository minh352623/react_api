import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Header from "../../components/layouts/Header";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const schema = yup.object({
  name: yup.string().min(2, "Tên nhóm phải lớn hơn 2 kí tự"),
});
const UpdateGroup = () => {
  const { user } = useSelector((state) => state.user);
  const [message, setMessage] = useState("");
  const [groupInfo, setGroupInfo] = useState({});
  const { group } = useParams();
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
  function onChange(e) {
    let name = e.target.name;
    let value = e.target.value;
    setGroupInfo((groupInfo) => {
      const nextFromData = { ...groupInfo, [name]: value };
      return nextFromData;
    });
  }
  const FetchGroupCurrent = async () => {
    try {
      setLoading(true);
      const respone = await axios({
        method: "GET",
        url: "https://shoppet.site/api/groups/update/" + group,

        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user?.token,
        },
      });
      if (respone.status == 200) {
        setGroupInfo((groupInfo) => ({
          ...groupInfo,
          ...respone.data.group,
        }));
        setValue("name", respone.data.group.name);
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    FetchGroupCurrent();
  }, []);
  const onSubmitUpdate = async (values) => {
    const formData = new FormData();
    console.log(groupInfo);
    formData.append("name", groupInfo.name);
    try {
      const respone = await axios({
        method: "post",
        url: "https://shoppet.site/api/groups/update/" + group,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user?.token,
        },
        data: formData,
      });
      console.log(respone);
      if (respone.status === 200) {
        setMessage("Update nhóm thành công!");
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
        <h2 className="text-center">Update Group</h2>

        {/* {error && <h4 className="text-red-400 text-center">{error}</h4>} */}
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
                <Form.Label>Name Group</Form.Label>
                <Form.Control
                  type="text"
                  {...register("name")}
                  name="name"
                  onChange={(e) => onChange(e)}
                  defaultValue={groupInfo?.name}
                  placeholder="Enter product name"
                />
                {errors?.name && (
                  <p className="text-red-500 mt-1 text-sm">
                    {errors.name.message}
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

export default UpdateGroup;
