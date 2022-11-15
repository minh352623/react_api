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
  price: yup
    .number()
    .min(1, "Giá sản phẩm ít nhất 1 số")
    .required("Giá bắt buộc phải nhập"),

  category: yup
    .string()
    .required("Danh mục bắt buộc phải chọn")
    .min(1, "Danh mục bắt buộc phải chọn"),
});
const AddProduct = () => {
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
  const fetchCate = async () => {
    const response = await axios({
      method: "get",
      url: "https://shoppet.site/api/category/all",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + user?.token,
      },
    });
    if (response) {
      setCategory(response.data);
    }
  };
  useEffect(() => {
    fetchCate();
  }, []);
  const onSubmitAdd = async (values) => {
    console.log(values);
    if (!isValid) return;
    const formData = new FormData();
    // file_path: values.file_path[0].name,
    // console.log(values);

    // console.log([...values.image_detail]);
    // console.log(values.file_path[0]);
    formData.append("name", values.name);
    formData.append("price", values.price);
    formData.append("category", values.category);

    formData.append("description", editorRef.current.getContent());
    formData.append("file_path", values.file_path[0]);
    [...values.image_detail].forEach((file) => {
      formData.append("image_detail[]", file);
    });

    try {
      setLoading(true);
      const result = await axios({
        method: "post",
        url: "https://shoppet.site/api/product/add",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user?.token,
        },
        data: formData,
      });
      reset({
        name: "",
        price: "",
        file_path: "",
        image_detail: "",
        category: "",
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
        <h2 className="text-center">Add Product</h2>

        {error && <h4 className="text-red-400 text-center">{error}</h4>}
        {message && (
          <h4 className="text-green-400 bg-green-200 p-3 rounded-lg text-center">
            {message}
          </h4>
        )}

        <div className="grid grid-cols-1 gap-x-5 gap-y-3">
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Name Product</Form.Label>
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
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="text"
              name="price"
              {...register("price")}
              placeholder="Enter price"
            />
            {errors?.price && (
              <p className="text-red-500 mt-1 text-sm">
                {errors.price.message}
              </p>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Category</Form.Label>

            <Form.Select
              aria-label="Default select example"
              name="category"
              required
              {...register("category")}
            >
              <option value="">Category</option>
              {category?.length > 0 &&
                category.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
            </Form.Select>
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
            <Form.Label>Image Detail</Form.Label>
            <Form.Control
              type="file"
              multiple
              name="image_detail"
              {...register("image_detail")}
              placeholder="Password"
            />
            {errors?.image_detail && (
              <p className="text-red-500 mt-1 text-sm">
                {errors.image_detail.message}
              </p>
            )}
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Description</Form.Label>

            <Editor
              apiKey="1dnd16pp1u3k2hu5r68h113r39yu55bku2pc760cem97t0t3"
              onInit={(evt, editor) => (editorRef.current = editor)}
              initialValue="<p>This is the initial content of the editor.</p>"
              init={{
                height: 500,
                menubar: false,
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "code",
                  "help",
                  "wordcount",
                ],
                toolbar:
                  "undo redo | blocks | " +
                  "bold italic forecolor | alignleft aligncenter " +
                  "alignright alignjustify | bullist numlist outdent indent | " +
                  "removeformat | help",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
            />
          </Form.Group>
        </div>

        <Button variant="primary" type="submit">
          {loading ? <Loading></Loading> : "Submit"}
        </Button>
      </Form>
    </>
  );
};

export default AddProduct;
