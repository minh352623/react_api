import React, { useEffect, useState } from "react";
import Header from "../../components/layouts/Header";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment-timezone";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";
import lodash from "lodash";
import Form from "react-bootstrap/Form";
import { formatter } from "../../trait/FormatMoney";
import { getStatusBill } from "../../trait/GetStatusBill";

const ListBills = () => {
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const FetchBills = async () => {
    setLoading(true);
    try {
      const respone = await axios.get(
        `https://shoppet.fun/api/bill/listBillAdmin?page=${page}&query=${query}&status=${status}`,
        {
          headers: { Authorization: "Bearer " + user?.token },
        }
      );
      if (respone.data.data) {
        console.log(respone);
        setBills(respone.data);
        setLoading(false);
      }
      console.log(respone);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    FetchBills();
  }, [page, query, status]);
  //
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const { per_page } = bills || [];
  console.log(per_page);
  useEffect(() => {
    if (!bills || !bills.total) return;

    bills && setPageCount(Math.ceil(bills.total / per_page));
  }, [itemOffset, bills]);
  const handlePageClick = (event) => {
    const newOffset = (event.selected * per_page) % bills.total;
    setItemOffset(newOffset);
    setPage(event.selected + 1);
  };
  //

  const handleSearch = lodash.debounce((e) => {
    setQuery(e.target.value);
  }, 500);
  const handleSearchStatus = (status) => {
    setStatus(status);
  };

  const setIdUser = (id) => {
    localStorage.removeItem("user_id_noti");

    localStorage.setItem("user_id_noti", JSON.stringify(id));
  };
  return (
    <>
      <Header></Header>
      <div className="container mt-5">
        <div className="flex gap-3">
          <p
            onClick={() => handleSearchStatus(-1)}
            className="py-3 font-semibold min-w-[150px] text-center self-center rounded-lg px-3 cursor-pointer bg-gray-300 text-gray-700 m-0 leading-none "
          >
            All
          </p>
          <p
            onClick={() => handleSearchStatus(0)}
            className="py-3 font-semibold min-w-[150px] text-center self-center rounded-lg px-3 cursor-pointer bg-yellow-300 text-yellow-700 m-0 leading-none "
          >
            Processing
          </p>
          <p
            onClick={() => handleSearchStatus(1)}
            className="py-3 font-semibold min-w-[150px] text-center self-center rounded-lg px-3 cursor-pointer bg-blue-300 text-blue-700 m-0 leading-none "
          >
            In Transit
          </p>
          <p
            onClick={() => handleSearchStatus(2)}
            className="py-3 font-semibold min-w-[150px] text-center self-center rounded-lg px-3 cursor-pointer bg-green-300 text-green-700 m-0 leading-none "
          >
            Delivered
          </p>
          <Form.Control
            className="my-3 py-3"
            type="text"
            name="name"
            placeholder="Enter search"
            onChange={handleSearch}
          />
        </div>

        {loading && (
          <span className="text-center mx-auto flex justify-center w-8 h-8 rounded-full border-slate-600 border-4 border-r-4 border-r-transparent animate-spin inline-block"></span>
        )}
        {!loading && (
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
                {bills?.data.length > 0 &&
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

                      <TableCell align="left">
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
                      </TableCell>
                    </TableRow>
                  ))}
                {bills?.data.length <= 0 && (
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
      </div>
    </>
  );
};

export default ListBills;
