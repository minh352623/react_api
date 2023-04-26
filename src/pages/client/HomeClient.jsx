import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Layout from "../../components/layouts/Layout";
import BestSaler from "../../modules/home/BestSaler";
import Category from "../../modules/home/Category";
import Discount from "../../modules/home/Discount";
import Option from "../../modules/home/Option";
import Partner from "../../modules/home/Partner";
import ProductNew from "../../modules/home/ProductNew";
import Service from "../../modules/home/Service";
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
        <Service></Service>
      </div>
    </Layout>
  );
};

export default HomeClient;
