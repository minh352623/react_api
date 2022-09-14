import React from "react";

const FooterClientBot = () => {
  return (
    <div className="border-t">
      <div className="flex items-center justify-between py-4">
        <span className="text-gray-400">&copy; 2021 Petio Pets Store</span>
        <div className="pay">
          <img src="./payment.png" alt="" />
        </div>
      </div>
    </div>
  );
};

export default FooterClientBot;
