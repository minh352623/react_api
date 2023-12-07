import React, { useState } from "react";
import Calendar from "moedim";
import { useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2";
import { useRef } from "react";
import moment from "moment-timezone";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { formatter } from "../trait/FormatMoney";
import { getStatusBill } from "../trait/GetStatusBill";
import Loading from "./Loading";
import { ExportExcel } from "../trait/ExportExcel";
import Modal from "react-bootstrap/Modal";

const FilterOrder = () => {
  const { user } = useSelector((state) => state.user);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  const [valueFrom, setValueFrom] = useState(new Date("2022-01-01"));
  const [valueTo, setValueTo] = useState(date);
  const [showCalendarFrom, setShowCalendarFrom] = useState(false);
  const [showCalendarTo, setShowCalendarTo] = useState(false);
  const [showMoal, setShowModal] = useState(false);
  const [stateCompare, setStateCompare] = useState(false);
  const [dataOrderOne, setDataOrderOne] = useState(false);
  const [dataOrderTwo, setDataOrderTwo] = useState(false);



  const hadnleFilter = () => {
    console.log(valueFrom);
    console.log(valueTo);
    fetchFilterOrder();
  };

  const fetchFilterOrder = async () => {
    try {
      setLoading(true);
      // if()
      let valueFromNew = moment(valueFrom)
        .tz("Asia/Bangkok")
        .format("YYYY/MM/DD")
        .toString();
      let valueToNew = moment(valueTo)
        .tz("Asia/Bangkok")
        .format("YYYY/MM/DD")
        .toString();
      const formData = new FormData();
      formData.append("valueFrom", valueFromNew);
      formData.append("valueTo", valueToNew);

      console.log(valueToNew, valueFromNew);
      const response = await axios({
        method: "POST",

        url: "https://shoppet.fun/api/bill/getAllFilter?page=" + page,



        headers: { Authorization: "Bearer " + user?.token },
        data: formData,
      });
      if (response.status === 200) {
        console.log(response);
        setLoading(false);

        setBills(response.data.data);
      }
    } catch (e) {
      setLoading(false);

      console.log(e);
      if (e.response.status === 401) {
        navigate("/login");
      }
    }
  };
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const { per_page } = bills || [];
  useEffect(() => {
    if (!bills || !bills.total) return;

    bills && setPageCount(Math.ceil(bills.total / per_page));
  }, [itemOffset, bills]);
  const handlePageClick = (event) => {
    const newOffset = (event.selected * per_page) % bills.total;
    setItemOffset(newOffset);
    setPage(event.selected + 1);
  };
  useEffect(() => {
    fetchFilterOrder();
  }, [page]);

  const [loadingExport, setLoadingExport] = useState(false);
  const exportExcel = async () => {
    try {
      setLoadingExport(true);
      // if()
      let valueFromNew = moment(valueFrom)
        .tz("Asia/Bangkok")
        .format("YYYY/MM/DD")
        .toString();
      let valueToNew = moment(valueTo)
        .tz("Asia/Bangkok")
        .format("YYYY/MM/DD")
        .toString();
      const formData = new FormData();
      formData.append("valueFrom", valueFromNew);
      formData.append("valueTo", valueToNew);
      const response = await axios({
        method: "POST",
        url: "https://shoppet.fun/api/bill/exportExcelFilter",

        headers: { Authorization: "Bearer " + user?.token },
        data: formData,
      });
      console.log(response);
      if (response.status == 200) {
        setLoadingExport(false);
        if (response.data?.data?.length > 0) {
          await ExportExcel(
            response.data?.data,
            "Danh sách khách hàng",
            "List_user"
          );
        } else {
          Swal.fire("Tải xuống!", "No data!.", "info");
        }
      }
    } catch (e) {
      setLoadingExport(false);

      console.log(e);
    }
  };
  return (
    <>
       <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={showMoal}
        onHide={() => setShowModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Compare</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="flex gap-3 flex-col">
            {stateCompare == "Error" && stateCompare != null ? <span className="font-medium text-red-500">Error</span>
            :
            <span className="font-medium text-green-500">Success</span>
            }

            <table>
              <thead>
                <tr>
                <th>Type</th>

                  <th>Order Id</th>
                  <th>Email</th>
                  <th>Total Price</th>
                  <th>Date</th>

                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Data Blockchain</td>
                  <td>{dataOrderOne.orderId}</td>
                  <td>{dataOrderOne.email}</td>
                  <td>{dataOrderOne.totalPrice}</td>
                  <td>{dataOrderOne.date}</td>


                </tr>
                <tr>
                  <td>Data Database</td>
                  <td>{dataOrderTwo.orderId}</td>
                  <td>{dataOrderTwo.email}</td>
                  <td>{dataOrderTwo.totalPrice}</td>
                  <td>{dataOrderTwo.date}</td>


                </tr>
              </tbody>
            </table>
          </div>
        </Modal.Body>
      </Modal>
      <div className="flex justify-between px-3 py-2 rounded-2xl shadow_main">
        <div className="flex gap-3 items-center ">
          <span className="font-bold ">Từ:</span>
          <div
            onClick={() => {
              setShowCalendarTo(false);

              setShowCalendarFrom((show) => !show);
            }}
            className="px-5 py-2 cursor-pointer hover:bg-orange-500 transition-all hover:text-white rounded-full relative border border-2 border-black"
          >
            <div className="flex gap-3">
              <span className="text-orange-500 font-bold hover:text-white">
                {" "}
                {moment(valueFrom).tz("Asia/Bangkok").format("DD/MM/YYYY")}
              </span>
            </div>
            {showCalendarFrom && (
              <div className="absolute right-0 top-full">
                <Calendar
                  value={valueFrom}
                  onChange={(d) => {
                    setValueFrom(d);
                  }}
                />
              </div>
            )}
          </div>
          <span className="font-bold ">Đến:</span>

          <div
            onClick={() => {
              setShowCalendarFrom(false);

              setShowCalendarTo((show) => !show);
            }}
            className="px-5 py-2 cursor-pointer hover:bg-orange-500 transition-all hover:text-white relative rounded-full border border-2 border-black"
          >
            <span className="text-orange-500 font-bold hover:text-white">
              {" "}
              {moment(valueTo).tz("Asia/Bangkok").format("DD/MM/YYYY")}
            </span>
            {showCalendarTo && (
              <div className="absolute right-0 top-full">
                <Calendar value={valueTo} onChange={(d) => setValueTo(d)} />
              </div>
            )}
          </div>
          <span
            onClick={hadnleFilter}
            className="px-4 py-2 cursor-pointer hover:scale-105 transition-all bg-green-500 font-bold text-white rounded-xl"
          >
            Tìm kiếm
          </span>
        </div>
        {!loadingExport && (
          <span
            onClick={exportExcel}
            className="px-4 py-2 cursor-pointer hover:scale-105 transition-all bg-green-500 font-bold text-white rounded-xl"
          >
            Tải xuống excel
          </span>
        )}
        {loadingExport && (
          <span className="px-4 py-2 cursor-pointer hover:scale-105 transition-all bg-green-500 font-bold text-white rounded-xl">
            <Loading></Loading>
          </span>
        )}
      </div>
      {loading && <Loading></Loading>}
      {!loading && (
        <div className="p-2 shadow_main rounded-2xl mt-3">
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow className="text-center">
                  <TableCell className="w-[5%]">#</TableCell>
                  <TableCell className="w-[30%]" align="left">
                    Info
                  </TableCell>
                  <TableCell align="left" className="w-[15%]">
                    Total
                  </TableCell>
                  <TableCell align="left" className="w-[20%]">
                    Status
                  </TableCell>

                  <TableCell className="w-[20%]" align="left">
                    Date
                  </TableCell>
                  <TableCell className="w-[10%]" align="left">
                    View
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bills?.data?.length > 0 &&
                  bills?.data.map((item) => (
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
                            <span>Name:</span>
                            <span className="text-slate-900 uppercase font-semibold">
                              {item.user.name}
                            </span>
                          </span>
                          <span className="text-gray-500 flex gap-2">
                            <span>Email:</span>
                            <span className="text-slate-900 uppercase font-semibold">
                              {item.user.email}
                            </span>
                          </span>
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
                        <>
                          {moment(item.created_at)
                            .tz("Asia/Bangkok")
                            .format("DD/MM/YYYY h:mm:ss A")}
                        </>
                      </TableCell>

                      <TableCell align="center">
                       
                        <Link to={"/bill/" + item.id}>
                          <span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              onClick={() => setIdUser(item.user_id)}
                              className="w-8 h-8 text-slate-800 hover:scale-110 hover:text-blue-500"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                          </span>
                        </Link>
                        <button onClick={async()=>{

                          //8 = 215 order Id
                          const res = await axios({
                            url:"https://chiase.shoppet.fun/api/blockchain/getOrderById/8",
                            method:"GET"
                          });
                          const data = (res.data);
                          console.log("🚀 ~ file: FilterOrder.jsx:339 ~ <buttononClick={async ~ data:", data,data[0] == item.id.toString())
                          setShowModal(true)
                          if(data[0] == item.id.toString()){
                            setDataOrderOne({orderId: data[0],email: data[1],totalPrice: data[2],date: data[3]})
                            setDataOrderTwo({orderId: item.id,email: item.user.email,totalPrice: item.total,date: item.created_at})


                            if(data[1] == item.user.email && data[2] == item.total && data[3] == item.created_at){
                              setStateCompare("success");
                            }else{
                              setStateCompare("error");
                            }
                          }else{
                            const oldOrderId = parseInt(data[0]);
                            const id = +item.id - oldOrderId +8;
                            console.log("🚀 ~ file: FilterOrder.jsx:374 ~ <buttononClick={async ~ id:", id)
                            const res2 = await axios({
                              url:"https://chiase.shoppet.fun/api/blockchain/getOrderById/"+id,
                              method:"GET"
                            }); 
                            const data2 = res2.data;
                            setDataOrderTwo({orderId: item.id,email: item.user.email,totalPrice: item.total,date: item.created_at})
                            setDataOrderOne({orderId: data2[0],email: data2[1],totalPrice: data2[2],date: data2[3]})
                            if(data2[1] == item.user.email && data2[2] == item.total && data2[3] == item.created_at){
                              setStateCompare("success")
                            }else{
                              setStateCompare("error")
                            }
                            console.log("🚀 ~ file: FilterOrder.jsx:379 ~ <buttononClick={async ~ res2:", res2)
                          }
                        }} className="px-3 py-2 bg-orange-400 rounded-lg text-white ">Compare</button>
                      </TableCell>
                    </TableRow>
                  ))}
                {bills?.data2?.length <= 0 && (
                  <TableRow>
                    <TableCell colSpan="6">
                      <span className=" text-center block text-xl text-red-500">
                        No data
                      </span>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
      <ReactPaginate
        breakLabel="..."
        nextLabel={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        }
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        }
        renderOnZeroPageCount={null}
        className="pagination"
      />
    </>
  );
};

export default FilterOrder;
