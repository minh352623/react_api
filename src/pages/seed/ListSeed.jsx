import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../../components/layouts/Header";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Swal from "sweetalert2";
import Form from "react-bootstrap/Form";
import lodash from "lodash";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import { formatter } from "../../trait/FormatMoney";
import parse from "html-react-parser";
import Loading from "../../components/Loading";
const ListSeed = () => {
  const { user } = useSelector((state) => state.user);

  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const deleteProduct = async (id) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const data = await axios.delete(
            `https://shoppet.fun/api/seed/delete/${id}`,
            {
              headers: { Authorization: "Bearer " + user?.token },
            }
          );

          FetchData();
          Swal.fire("Deleted!", "Your post has been deleted.", "success");
        }
      });
    } catch (e) {
      //console.log(e);
    }
  };

  const navigate = useNavigate();

  const handleSearch = lodash.debounce((e) => {
    setQuery(e.target.value);
  }, 500);

  const FetchData = async () => {
    try {
      setLoading(true);
      ////console.log(page);
      const respone = await axios.get(
        "https://shoppet.fun/api/seed/list?query=" + query + "&page=" + page,
        {
          headers: { Authorization: "Bearer " + user?.token },
        }
      );
      console.log(respone);
      if (respone.data.data) {
        setProduct(respone.data);

        setLoading(false);
      }
    } catch (e) {
      ////console.log(e);
      // alert("bạn chưa đăng nhập");
      navigate("/login");
    }
  };

  useEffect(() => {
    FetchData();
    ////console.log(product);
  }, [query, page]);
  const { current_page, total, per_page } = product || [];
  ////console.log(total);

  useEffect(() => {
    if (!product || !product.total) return;

    product && setPageCount(Math.ceil(product.total / per_page));
  }, [itemOffset, product]);
  const handlePageClick = (event) => {
    const newOffset = (event.selected * per_page) % product.total;
    setItemOffset(newOffset);
    setPage(event.selected + 1);
  };

  return (
    <>
      <Header></Header>

      <div className="container mt-3">
        <div className="text-end">
          <Link
            className="py-3 px-8 bg-green-500 mb-3 rounded-lg text-white inline-block text-lg"
            to="/addSeed"
          >
            Create
          </Link>
        </div>
        <Form.Control
          className="my-3"
          type="text"
          name="name"
          placeholder="Enter search"
          onChange={handleSearch}
        />
        {loading && <Loading></Loading>}
        {!loading && (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow className="text-center">
                  <TableCell className="w-[5%]">#</TableCell>
                  <TableCell align="left">Name</TableCell>
                  <TableCell align="left" className="w-[10%]">
                    image_1
                  </TableCell>

                  <TableCell className="w-[10%]" align="left">
                    image_2
                  </TableCell>
                  <TableCell align="left" className="w-[10%]">
                    image_3
                  </TableCell>
                  <TableCell className="w-[10%]" align="left">
                    Coin_cost
                  </TableCell>
                  <TableCell className="w-[10%]" align="left">
                    Warter_cost
                  </TableCell>
                  <TableCell className="w-[10%]" align="left">
                    Receive_coin
                  </TableCell>
                  <TableCell className="w-[5%]" align="left">
                    Edit
                  </TableCell>
                  <TableCell className="w-[5%]" align="left">
                    Delete
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {product?.data?.length > 0 &&
                  product.data?.map((item) => (
                    <TableRow
                      key={item.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {item.id}
                      </TableCell>
                      <TableCell align="left" scope="row">
                        {item.name}
                      </TableCell>
                      {/* <TableCell align="left" scope="row">
                        {formatter.format(item.price)}
                      </TableCell> */}
                      <TableCell
                        align="left"
                        component="th"
                        scope="row"
                        className="max-w-[50px] h-[150px] inline-block"
                      >
                        <img
                          className="w-full h-full object-cover"
                          src={`${item.img}`}
                          alt=""
                        />
                      </TableCell>
                      <TableCell
                        align="left"
                        component="th"
                        scope="row"
                        className="max-w-[50px] h-[150px] inline-block"
                      >
                        <img
                          className="w-full h-full object-cover"
                          src={`${item.img_2}`}
                          alt=""
                        />
                      </TableCell>
                      <TableCell
                        align="left"
                        component="th"
                        scope="row"
                        className="max-w-[50px] h-[150px] inline-block"
                      >
                        <img
                          className="w-full h-full object-cover"
                          src={`${item.img_3}`}
                          alt=""
                        />
                      </TableCell>
                      <TableCell align="left" scope="row">
                        <p className="flex">
                          <span className="font-bold text-green-500">
                            {item.coin_cost}
                          </span>
                          <span>
                            <img
                              className="w-[20px]"
                              src="./coin2.gif"
                              alt=""
                            />
                          </span>
                        </p>
                      </TableCell>
                      <TableCell align="left" scope="row">
                        <p className="flex">
                          <span className="font-bold text-green-500">
                            {item.water_cost}
                          </span>
                          <span>
                            <img class="w-[20px]" src="./water.jpg" alt="" />
                          </span>
                        </p>
                      </TableCell>
                      <TableCell align="left" scope="row">
                        <p className="flex">
                          <span className="font-bold text-green-500">
                            {item.receive_coin}
                          </span>
                          <span>
                            <img
                              className="w-[20px]"
                              src="./coin2.gif"
                              alt=""
                            />
                          </span>
                        </p>
                      </TableCell>
                      <TableCell align="left">
                        <Link to={"/updateSeed/" + item.id}>
                          <span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 text-yellow-500 hover:scale-125 cursor-pointer"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </span>
                        </Link>
                      </TableCell>
                      <TableCell align="left" className="flex justify-end">
                        {!loading && (
                          <span onClick={() => deleteProduct(item.id)}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 text-red-500 hover:scale-125 cursor-pointer"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
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

export default ListSeed;
