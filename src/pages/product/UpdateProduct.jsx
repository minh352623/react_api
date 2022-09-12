import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/layouts/Header";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { useSelector } from "react-redux";
import { Editor } from "@tinymce/tinymce-react";

const UpdateProduct = () => {
  const { user } = useSelector((state) => state.user);
  const [category, setCategory] = useState();
  const editorRef = useRef(null);

  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
  });
  const [picture, setPicture] = useState(null);
  const [images, setImages] = useState(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
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
      setLoading(true);
      const result = await axios.get(
        "http://127.0.0.1:8000/api/product/update/" + id,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + user?.token,
          },
        }
      );
      console.log(result);
      if (result.data.data) {
        let detailData = await result.data.data;
        if (detailData) {
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
    fetchCate();
    FetchProductDetail(id);
  }, []);

  const onSubmitUpdate = async (e) => {
    // console.log(formData);
    // console.log(picture);
    console.log(images);

    e.preventDefault();
    const formDataNew = new FormData();

    formDataNew.append("name", formData.name);
    formDataNew.append("price", formData.price);
    formDataNew.append("description", editorRef.current.getContent());
    formDataNew.append("category", formData.category_id);
    if (picture) {
      formDataNew.append("file_path", picture);
    }

    images?.length > 0 &&
      [...images].forEach((file) => {
        formDataNew.append("image_detail[]", file);
      });
    try {
      const result = await axios({
        method: "POST",
        url: "http://127.0.0.1:8000/api/product/update/" + id,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + user?.token,
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
  const fetchCate = async () => {
    const response = await axios({
      method: "get",
      url: "http://127.0.0.1:8000/api/category/all",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + user?.token,
      },
    });
    if (response) {
      setCategory(response.data);
    }
  };

  console.log(formData.images);
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
        {loading && (
          <span className="text-center mx-auto flex justify-center w-8 h-8 rounded-full border-slate-600 border-4 border-r-4 border-r-transparent animate-spin inline-block"></span>
        )}
        {formData && !loading && (
          <div className="grid grid-cols-1 gap-x-5 gap-y-3">
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Name Product</Form.Label>
              <Form.Control
                type="text"
                defaultValue={formData.name}
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
                defaultValue={formData.price}
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
              {formData.file_path && (
                <img
                  className="mt-3 w-[100px] h-[100px] object-cover"
                  src={`http://127.0.0.1:8000${formData.file_path}`}
                  alt=""
                />
              )}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formControlsFile">
              <Form.Label>Image Detail</Form.Label>

              <Form.Control
                type="file"
                onChange={(e) => setImages(() => e.target.files)}
                multiple
                name="images"
              />
              <div className="flex items-center gap-x-3">
                {formData?.images.map((item) => (
                  <img
                    key={item.id}
                    src={`http://127.0.0.1:8000${item.image_path}`}
                    alt=""
                    className="mt-3 w-[100px] h-[100px] object-cover"
                  />
                ))}
              </div>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Category</Form.Label>

              <Form.Select
                aria-label="Default select example"
                name="category_id"
                defaultValue={formData.category_id}
                required
                onChange={(e) => onChange(e)}
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
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Description</Form.Label>

              <Editor
                apiKey="1dnd16pp1u3k2hu5r68h113r39yu55bku2pc760cem97t0t3"
                onInit={(evt, editor) => (editorRef.current = editor)}
                initialValue={formData.description}
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
        )}

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </>
  );
};

export default UpdateProduct;
