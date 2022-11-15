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

const ListGroup = () => {
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");

  const FetchGroups = async () => {
    setLoading(true);
    try {
      const respone = await axios.get(
        `https://shoppet.site/api/groups/list?page=${page}&query=${query}`,
        {
          headers: { Authorization: "Bearer " + user?.token },
        }
      );
      if (respone.data.data) {
        respone.data.data && setGroups(respone.data);
        setLoading(false);
      }
      console.log(respone);
    } catch (err) {
      console.log(err);
      navigate("/login");
    }
  };

  useEffect(() => {
    FetchGroups();
  }, [page, query]);
  //
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const { per_page } = groups || [];
  console.log(per_page);
  useEffect(() => {
    if (!groups || !groups.total) return;

    groups && setPageCount(Math.ceil(groups.total / per_page));
  }, [itemOffset, groups]);
  const handlePageClick = (event) => {
    const newOffset = (event.selected * per_page) % groups.total;
    setItemOffset(newOffset);
    setPage(event.selected + 1);
  };
  //
  const handleDelete = async (id) => {
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
            `https://shoppet.site/api/groups/delete/${id}`,
            {
              headers: { Authorization: "Bearer " + user?.token },
            }
          );
          FetchGroups();
          //console.log(data);
          Swal.fire("Deleted!", "Your post has been deleted.", "success");
        }
      });
    } catch (err) {
      console.log(err);
    }
  };
  console.log(groups.data);

  const handleSearch = lodash.debounce((e) => {
    setQuery(e.target.value);
  }, 500);
  return (
    <>
      <Header></Header>
      <div className="container mt-5">
        <div className="text-end">
          <Link
            className="py-3 px-8 bg-green-500 mb-3 rounded-lg text-white inline-block text-lg"
            to="/addGroup"
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
        {loading && (
          <span className="text-center mx-auto flex justify-center w-8 h-8 rounded-full border-slate-600 border-4 border-r-4 border-r-transparent animate-spin inline-block"></span>
        )}
        {!loading && (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow className="text-center">
                  <TableCell className="w-[5%]">#</TableCell>
                  <TableCell align="left">Name</TableCell>
                  <TableCell align="left" className="w-[20%]">
                    Created
                  </TableCell>
                  <TableCell align="left" className="w-[20%]">
                    Permisstion
                  </TableCell>

                  <TableCell className="w-[10%]" align="left">
                    Edit
                  </TableCell>
                  <TableCell className="w-[10%]" align="left">
                    Delete
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {groups.data.length > 0 &&
                  groups.data.map((item) => (
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

                      <TableCell align="left" scope="row">
                        <>
                          {moment(item.created_at)
                            .tz("Asia/Bangkok")
                            .format("DD/MM/YYYY h:mm:ss A")}
                        </>
                      </TableCell>
                      <TableCell align="left" scope="row">
                        <span className="p-3 cursor-pointer hover:bg-blue-800 text-white bg-blue-500 rounded-lg w-[50px]">
                          Permisstion
                        </span>
                      </TableCell>
                      <TableCell align="left">
                        <Link to={"/updateGroup/" + item.id}>
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
                        <span onClick={() => handleDelete(item.id)}>
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

export default ListGroup;
