import React from "react";
import Layout from "../../components/layouts/Layout";
import Slider from "../../modules/home/Slider";

const HomeClient = () => {
  return (
    <Layout>
      <div className="main px-5 mt-3">
        <Slider></Slider>
      </div>
    </Layout>
  );
};

export default HomeClient;
