import React from "react";

const ButtonHome = ({ children, className = "" }) => {
  return (
    <p
      className={`px-6 py-2 cursor-pointer transition-all rounded-3xl ${className}`}
    >
      {children}
    </p>
  );
};

export default ButtonHome;
