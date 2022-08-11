import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/layouts/Header";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";
import axios from "axios";
import lodash from "lodash";

const UpdateProduct = () => {
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
  });
  const [picture, setPicture] = useState(null);
  const [error, setError] = useState("");
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  function onChange(e) {
    let name = e.target.name;
    let value = e.target.value;
    setFormData((formData) => {
      const nextFromData = { ...formData, [name]: value };
      return nextFromData;
    });
  }

  const FetchProductDetail = async (id) => {
    try {
      const result = await axios.get(
        "http://127.0.0.1:8000/api/product/" + id,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (result.data.data) {
        let detailData = await result.data.data;
        if (detailData) {
          setData(detailData);
          setPicture(detailData.file_path);
          if (detailData) {
            console.log(data);
            setFormData({
              name: detailData.name,
              price: detailData.price,
              description: detailData.description,
            });
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    if (!localStorage.getItem("user-info")) {
      navigate("/login");
    }
    FetchProductDetail(id);
  }, []);

  const onSubmitUpdate = async (e) => {
    e.preventDefault();
    const formDataNew = new FormData();
    // file_path: values.file_path[0].name,
    // console.log(values.file_path[0]);
    console.log(formData);
    console.log(picture);

    formDataNew.append("name", formData.name);
    formDataNew.append("price", formData.price);
    formDataNew.append("description", formData.description);
    formDataNew.append("file_path", picture);

    try {
      const result = await axios({
        method: "POST",
        url: "http://127.0.0.1:8000/api/product/" + id,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        data: formDataNew,
      });

      if (result.status === 200) {
        setMessage("Update thành công");
        setError("");
      }
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
        onSubmit={onSubmitUpdate}
        className="w-[1000px] mx-auto my-5 shadow-lg p-5 rounded-lg"
      >
        <h2 className="text-center">Update Product</h2>

        {error && (
          <h4 className="text-red-400 my-3 bg-red-200 text-center p-3 rounded-lg">
            {error}
          </h4>
        )}
        {message && (
          <h4 className="text-green-400 bg-green-200 p-3 rounded-lg text-center">
            {message}
          </h4>
        )}
        {data && (
          <div className="grid grid-cols-1 gap-x-5 gap-y-3">
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Name Product</Form.Label>
              <Form.Control
                type="text"
                defaultValue={data.name}
                name="name"
                onChange={(e) => onChange(e)}
                placeholder="Enter product name"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="text"
                name="price"
                defaultValue={data.price}
                onChange={(e) => onChange(e)}
                placeholder="Enter price"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                name="file_path"
                onChange={(e) => setPicture(() => e.target.files[0])}
              />
              {data.file_path && (
                <img
                  className="mt-3 w-[200px] h-[200px] object-cover"
                  src={`http://127.0.0.1:8000${data.file_path}`}
                  alt=""
                />
              )}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                defaultValue={data.description}
                name="description"
                onChange={(e) => onChange(e)}
                placeholder="description"
              />
            </Form.Group>
          </div>
        )}

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </>
  );
};

export default UpdateProduct;
