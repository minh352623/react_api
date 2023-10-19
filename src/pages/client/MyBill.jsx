import React, { useState } from "react";
import Layout from "../../components/layouts/Layout";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import moment from "moment-timezone";

import { Link } from "react-router-dom";
import { formatter } from "../../trait/FormatMoney";
import { getStatusBill } from "../../trait/GetStatusBill";
import Loading from "../../components/Loading";
import capitalizeFirstLetter from "../../trait/FirstUpper";
const MyBill = () => {
  const { user } = useSelector((state) => state.user);
  const [bills, setBills] = useState();
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const listBill = async () => {
    const formData = new FormData();
    if (user) {
      formData.append("user_id", user.id);
      try {
        setLoading(true);
        const response = await axios({
          method: "post",
          url:
            "https://shoppet.fun/api/bill/list?status=" + status,
          headers: {
            Authorization: "Bearer " + user?.token,
          },
          data: formData,
        });
        if (response) {
          console.log(response);
          setBills(response.data);
          setLoading(false);
        }
      } catch (e) {
        console.log(e);
      }
    }
  };
  useEffect(() => {
    listBill();
  }, [status]);
  const handleSearchStatus = (status) => {
    setStatus(status);
  };
  return (
    <Layout>
      <div className="w-[80%] mx-auto my-5">
        <div className="flex gap-3 mb-3">
          <p
            onClick={() => handleSearchStatus(-1)}
            className="py-3 hover:scale-105 transtion-all font-semibold min-w-[150px] text-center self-center rounded-lg px-3 cursor-pointer bg-gray-300 text-gray-700 m-0 leading-none "
          >
            All
          </p>
          <p
            onClick={() => handleSearchStatus(0)}
            className="py-3 hover:scale-105 transtion-all font-semibold min-w-[150px] text-center self-center rounded-lg px-3 cursor-pointer bg-yellow-300 text-yellow-700 m-0 leading-none "
          >
            Processing
          </p>
          <p
            onClick={() => handleSearchStatus(1)}
            className="py-3 hover:scale-105 transtion-all font-semibold min-w-[150px] text-center self-center rounded-lg px-3 cursor-pointer bg-blue-300 text-blue-700 m-0 leading-none "
          >
            In Transit
          </p>
          <p
            onClick={() => handleSearchStatus(2)}
            className="py-3 hover:scale-105 transtion-all font-semibold min-w-[150px] text-center self-center rounded-lg px-3 cursor-pointer bg-green-300 text-green-700 m-0 leading-none "
          >
            Delivered
          </p>
        </div>
        {loading && <Loading></Loading>}
        {!loading && (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow className="text-center">
                  <TableCell className="w-[5%]">#</TableCell>
                  <TableCell className="w-[25%]" align="left">
                    Info
                  </TableCell>
                  <TableCell align="left" className="w-[15%]">
                    Total
                  </TableCell>
                  <TableCell align="left" className="w-[12%]">
                    Status
                  </TableCell>
                  <TableCell align="left" className="w-[15%]">
                    Method
                  </TableCell>
                  <TableCell align="left">Date</TableCell>
                  <TableCell className="w-[10%]" align="left">
                    View
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bills?.length > 0 &&
                  bills?.map((item) => (
                    <TableRow
                      key={item.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {item.id}
                      </TableCell>
                      <TableCell align="left" scope="row">
                        <p className="flex-col flex gap-2 m-0">
                          <span className="text-gray-500 flex gap-2">
                            <span>Address:</span>
                            <span className="text-slate-900 uppercase font-semibold">
                              {item.address}
                            </span>
                          </span>
                          <span className="text-gray-500 flex gap-2">
                            <span>Phone:</span>

                            <span className="text-slate-900 uppercase font-semibold">
                              {item.tel}
                            </span>
                          </span>
                        </p>
                      </TableCell>
                      <TableCell align="left" scope="row">
                        <span className="font-semibold text-xl text-orange-500">
                          {formatter.format(item.total)}
                        </span>
                      </TableCell>
                      <TableCell align="left" scope="row">
                        <span
                          className={`font-semibold ${
                            parseInt(item.status) == 0
                              ? "text-yellow-400"
                              : parseInt(item.status) == 1
                              ? "text-blue-500"
                              : "text-green-500"
                          }`}
                        >
                          {getStatusBill(parseInt(item.status))}
                        </span>
                      </TableCell>
                      <TableCell align="left" scope="row">
                        <span className="text-blue-900 block font-bold">
                          {item.pttt
                            ? capitalizeFirstLetter(item.pttt)
                            : "Pay after recieve"}
                        </span>
                      </TableCell>
                      <TableCell align="left" scope="row">
                        <>
                          {moment(item.created_at)
                            .tz("Asia/Bangkok")
                            .format("DD/MM/YYYY h:mm:ss A")}
                        </>
                      </TableCell>

                      <TableCell align="left">
                        <Link to={"/payment/" + item.id}>
                          <span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.5"
                              stroke="currentColor"
                              class="w-8 h-8 text-slate-800 hover:scale-110 hover:text-blue-500"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                              />
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                          </span>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                {bills?.length <= 0 && (
                  <TableRow>
                    <TableCell colSpan="6">
                      <span className=" text-center block text-xl text-red-500">
                        Không có dữ liệu
                      </span>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </Layout>
  );
};

export default MyBill;
