import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, roles }) => {
  const { user } = useSelector((state) => state.user);
  if (!user) {
    alert("Ban chua dang nhap");

    return <Navigate to="/login" />;
  }
  if (roles && !roles?.some((r) => user.group_id == r)) {
    alert("Not authorised to access this area");
    return <Navigate to="/home" />;
  }
  return children;
};

export default PrivateRoute;
