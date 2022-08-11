import { Fragment, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddProduct from "./pages/product/AddProduct";
import UpdateProduct from "./pages/product/UpdateProduct";
import ListProduct from "./pages/product/ListProduct";

function App() {
  return (
    <Fragment>
      <Routes>
        <Route path="/" element={<Home></Home>}></Route>

        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/register" element={<Register></Register>}></Route>
        <Route path="/product" element={<ListProduct></ListProduct>}></Route>
        <Route path="/addProduct" element={<AddProduct></AddProduct>}></Route>
        <Route
          path="/updateProduct/:id"
          element={<UpdateProduct></UpdateProduct>}
        ></Route>
      </Routes>
    </Fragment>
  );
}

export default App;
