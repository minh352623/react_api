import axios from "axios";
import React, { useEffect, useState } from "react";
import Header from "../components/layouts/Header";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Chart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  ArcElement,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
);
const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "",
    },
  },
};

const Home = () => {
  const { user } = useSelector((state) => state.user);
  const [bills, setBills] = useState();
  const [billsPrice, setBillPrice] = useState();
  const [category, setCategory] = useState();
  const FetchBills = async () => {
    const response = await axios({
      method: "get",
      url: "https://shoppet-tm.herokuapp.com/api/bill/billTk",
      headers: {
        Authorization: "Bearer " + user?.token,
      },
    });
    if (response) {
      console.log(response.data);
      let dt = [];
      let month = [];
      for (let key in response.data) {
        dt.push(response.data[key]);
        month.push(key);
      }
      console.log(dt);
      setBills({
        labels: month,
        datasets: [
          {
            label: "Total order in month",
            data: dt.map((item) => item.length),
            backgroundColor: "#0d9488",
          },
        ],
      });
      setBillPrice({
        labels: month,
        datasets: [
          {
            fill: true,
            label: "Total price in month",
            data: dt.map((item) => {
              let total = 0;
              if (item.length > 0) {
                item.forEach((item2) => {
                  total += +item2.total;
                });
              }
              return total;
            }),
            borderColor: "rgb(53, 162, 235)",
            backgroundColor: "rgba(53, 162, 235, 0.5)",
          },
        ],
      });
    }
  };
  const FetchCate = async () => {
    try {
      const response = await axios({
        method: "get",
        url: "https://shoppet-tm.herokuapp.com/api/category/getCateTk",
        headers: {
          Authorization: "Bearer " + user?.token,
        },
      });
      if (response) {
        console.log(response);
        let labels = [];
        let data = [];
        response.data.forEach((item) => {
          labels.push(item.name);
          data.push(item.pro_count);
        });
        setCategory({
          labels,
          datasets: [
            {
              data,
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
              ],
              borderWidth: 1,
            },
          ],
        });
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    FetchBills();
    FetchCate();
  }, []);

  return (
    <>
      <Header></Header>
      <div className="container my-5">
        <h3 className="text-center">Statistical Order</h3>
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-6">
            {bills && <Bar options={options} data={bills} />}
          </div>
          <div className="col-span-6">
            {billsPrice && <Line options={options} data={billsPrice} />}
          </div>
        </div>
        <h3 className="text-center mt-5">Statistical Product</h3>
        <div className="grid grid-cols-12 gap-5 mt-5">
          <div className="col-span-6 w-75">
            {category && <Pie data={category} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
