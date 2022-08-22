import axios from "axios";
import React, { useEffect, useState } from "react";
import Header from "../components/layouts/Header";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header></Header>
      <div>home</div>
    </>
  );
};

export default Home;
