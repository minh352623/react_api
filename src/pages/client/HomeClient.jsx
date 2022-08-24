import React from "react";
import Layout from "../../components/layouts/Layout";
import BestSaler from "../../modules/home/BestSaler";
import Category from "../../modules/home/Category";
import Discount from "../../modules/home/Discount";
import Option from "../../modules/home/Option";
import Partner from "../../modules/home/Partner";
import ProductNew from "../../modules/home/ProductNew";
import Slider from "../../modules/home/Slider";
import Slogan from "../../modules/home/Slogan";
import TopCategory from "../../modules/home/TopCategory";

const HomeClient = () => {
  return (
    <Layout>
      <div className="main px-5 mt-3 bg-[#f4f4f4]">
        <Slider></Slider>
        <Partner></Partner>
        <Category></Category>
        <TopCategory></TopCategory>
        <Slogan></Slogan>
        <ProductNew></ProductNew>
        <Discount></Discount>
        <BestSaler></BestSaler>
        <Option></Option>
      </div>
    </Layout>
  );
};

export default HomeClient;
