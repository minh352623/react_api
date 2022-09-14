import React from "react";
import FooterClientBot from "./FooterClientBot";
import FooterClientCenter from "./FooterClientCenter";
import FooterCLientTop from "./FooterCLientTop";

const FooterClient = ({ settings }) => {
  return (
    <div className="px-5 border border-gray-500">
      <FooterCLientTop></FooterCLientTop>
      <FooterClientCenter settings={settings}></FooterClientCenter>
      <FooterClientBot></FooterClientBot>
    </div>
  );
};

export default FooterClient;
