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
import { ExportExcel } from "../../trait/ExportExcel";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
const ListUser = () => {
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);
  const [users, setUsers] = useState();
  const [groups, setGroups] = useState();

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [groupSeach, setGroupSearch] = useState("");
  const FetchUsers = async () => {
    setLoading(true);
    try {
      const respone = await axios.get(
        `https://shoppet.fun/api/users/list?page=${page}&keyword=${query}&group=${groupSeach}`,
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
    FetchUsers();
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
            `https://shoppet.fun/api/users/delete/${id}`,
            {
              headers: { Authorization: "Bearer " + user?.token },
            }
          );
          FetchUsers();
          //console.log(data);
          Swal.fire("Deleted!", "Your post has been deleted.", "success");
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  const exportExcel = async () => {
    try {
      const response = await axios.get(
        `https://shoppet.fun/api/users/exportExcel`,
        {
          headers: { Authorization: "Bearer " + user?.token },
        }
      );
      console.log(response);
      if (response.status == 200) {
        await ExportExcel(response.data, "Danh sách khách hàng", "List_user");
      }
    } catch (e) {
      console.log(e);
    }
  };
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [importExcelLoading, setImportExcelLoading] = useState(false);
  const [fileImportExcel, setFileImportExcel] = useState("");
  const importExcel = async () => {
    try {
      setImportExcelLoading(true);
      const formData = new FormData();
      // file_path: values.file_path[0].name,
      // console.log(values);

      // console.log(values.file_path);
      formData.append("uploaded_file", fileImportExcel);
      console.log(fileImportExcel);
      const response = await axios({
        method: "POST",
        url: "https://shoppet.fun/api/users/importExcel",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user?.token,
        },
        data: formData,
      });
      console.log(response);
      if (response.status == 200) {
        FetchUsers();
        handleClose();
        setImportExcelLoading(false);
      }
    } catch (e) {
      setImportExcelLoading(false);

      console.log(e);
    }
  };
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Import File Excel</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="">
            <div className="flex gap-2">
              <span>name</span>
              <span className="text-red-500">(required)</span>
            </div>
            <div className="flex gap-2">
              <span>Email</span>
              <span className="text-red-500">(required)</span>
            </div>
            <div className="flex gap-2">
              <span>password</span>
              <span className="text-red-500">(required)</span>
            </div>
            <div className="flex gap-2">
              <span>group_id</span>
              <span className="text-red-500">(required vd:3)</span>
            </div>
          </div>
          <div className="my-3">
            <form onSubmit={importExcel} action="">
              <input
                onChange={(e) => setFileImportExcel(e.target.files[0])}
                type="file"
                name="import_excel"
              />
              <Modal.Footer>
                <p
                  className="px-4 py-2 bg-gray-600 rounded-lg text-white cursor-pointer"
                  onClick={handleClose}
                >
                  Close
                </p>
                <Button variant="primary" onClick={importExcel}>
                  {importExcelLoading ? "Đang upload...." : "Import"}
                </Button>
              </Modal.Footer>
            </form>
          </div>
        </Modal.Body>
      </Modal>
      <Header></Header>
      <div className="container mt-5">
        <div className="text-end flex justify-between">
          <div className="flex gap-3">
            <span
              onClick={exportExcel}
              className="text-white font-semibold px-4 cursor-pointer py-1 rounded-lg bg-green-500 flex items-center justify-center"
            >
              Export Excel
            </span>
            <span
              onClick={handleShow}
              className="text-white font-semibold px-4 cursor-pointer py-1 rounded-lg bg-green-500 flex items-center justify-center"
            >
              Import Excel
            </span>
          </div>
          <Link
            className="py-3 px-8 m-0 bg-green-500  rounded-lg text-white inline-block text-lg"
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

export default ListUser;
