import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Swal from "sweetalert2";

const PrivateRoute = ({ children, roles }) => {
  const { user } = useSelector((state) => state.user);
  if (!user) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Vui lòng đăng nhập để tiếp tục!",
    });

    return <Navigate to="/login" />;
  }
  if (roles && !roles?.some((r) => user.group_id == r)) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Bạn không có quyền truy cập!",
    });
    return <Navigate to="/home" />;
  }
  return children;
};

export default PrivateRoute;
