import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import Header from "../../components/layouts/Header";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Form from "react-bootstrap/Form";
import ReactPaginate from "react-paginate";
import moment from "moment-timezone";
import lodash from "lodash";
import Swal from "sweetalert2";

const ListUser = () => {
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);
  const [users, setUsers] = useState();
  const [groups, setGroups] = useState();

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [groupSeach, setGroupSearch] = useState("");
  const FetchGroups = async () => {
    setLoading(true);
    try {
      const respone = await axios.get(
        `https://shoppet-tm.herokuapp.com/api/users/list?page=${page}&keyword=${query}&group=${groupSeach}`,
        {
          headers: { Authorization: "Bearer " + user?.token },
        }
      );
      if (respone.status == 200 && respone.data) {
        console.log(respone.data);
        setUsers(respone.data.users);
        setGroups(respone.data.groups);
        setLoading(false);
      }
    } catch (err) {
      //console.log(err);
      navigate("/login");
    }
  };
  useEffect(() => {
    FetchGroups();
  }, [page, query, groupSeach]);

  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const { per_page } = users || [];
  //   //console.log(per_page);
  useEffect(() => {
    if (!users || !users.total) return;

    users && setPageCount(Math.ceil(users.total / per_page));
  }, [itemOffset, users]);
  const handlePageClick = (event) => {
    const newOffset = (event.selected * per_page) % users.total;
    setItemOffset(newOffset);
    setPage(event.selected + 1);
  };

  //search
  const handleSearch = lodash.debounce((e) => {
    setQuery(e.target.value);
  }, 700);
  const searchGroup = (e) => {
    setGroupSearch(e.target.value);
  };

  const handleDelete = (id) => {
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
            `https://shoppet-tm.herokuapp.com/api/users/delete/${id}`,
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
  return (
    <>
      <Header></Header>
      <div className="container mt-5">
        <div className="text-end">
          <Link
            className="py-3 px-8 bg-green-500 mb-3 rounded-lg text-white inline-block text-lg"
            to="/addUser"
          >
            Create
          </Link>
        </div>
        <div className="flex items-center gap-x-5">
          <Form.Select
            aria-label="Default select example"
            onChange={searchGroup}
          >
            <option value="">Group</option>
            {groups?.length > 0 &&
              groups.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
          </Form.Select>
          <Form.Control
            className="my-3"
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
                  <TableCell align="left">Name</TableCell>
                  <TableCell align="left">Email</TableCell>
                  <TableCell align="left">Group</TableCell>

                  <TableCell align="left" className="w-[20%]">
                    Created
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
                {users.data.length > 0 &&
                  users.data.map((item) => (
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
                        {item.email}
                      </TableCell>
                      <TableCell align="left" scope="row">
                        <span className="font-bold text-green-600">
                          {item.name_group}
                        </span>
                      </TableCell>
                      <TableCell align="left" scope="row">
                        <>
                          {moment(item.created_at)
                            .tz("Asia/Bangkok")
                            .format("DD/MM/YYYY h:mm:ss")}
                        </>
                      </TableCell>

                      <TableCell align="left">
                        <Link to={"/updateUser/" + item.id}>
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
                        {user.id != item.id && (
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
                        )}
                        {user.id === item.id && <span>----</span>}
                      </TableCell>
                    </TableRow>
                  ))}
                {users.data.length <= 0 && (
                  <TableRow>
                    <TableCell colSpan="7">
                      <span className="text-center text-red-500 block text-xl">
                        {" "}
                        Không có dữ liệu
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

export default ListUser;
