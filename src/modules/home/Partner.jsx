import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LoadingSkeleton from "../../components/LoadingSkeleton";

const Partner = () => {
  const { user } = useSelector((state) => state.user);
  const [partners, setPartners] = useState();
  const FetchPartner = async () => {
    try {
      const response = await axios({
        method: "GET",
        url: "https://shoppet.site/api/partner/all",

        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user?.token,
        },
      });
      if (response) {
        //   console.log(response);
        setPartners(response.data);
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    FetchPartner();
  }, []);
  console.log(partners);
  if (!partners || partners?.length <= 0)
    return (
      <div className="grid grid-cols-5 mt-3">
        <LoadingSkeleton className="w-full h-[200px]"></LoadingSkeleton>
        <LoadingSkeleton className="w-full h-[200px]"></LoadingSkeleton>
        <LoadingSkeleton className="w-full h-[200px]"></LoadingSkeleton>
        <LoadingSkeleton className="w-full h-[200px]"></LoadingSkeleton>
        <LoadingSkeleton className="w-full h-[200px]"></LoadingSkeleton>
      </div>
    );
  return (
    <div className="grid grid-cols-5  my-3 rounded-2xl">
      {partners &&
        partners.map((item) => (
          <div
            data-aos="zoom-in-up"
            data-aos-duration="1000"
            data-aos-delay="300"
            key={item.id}
            className="item bg-white first:rounded-l-2xl last:rounded-r-2xl border border-[.1px] text-center"
          >
            <img className="mx-auto" src={`${item.image}`} alt="" />
          </div>
        ))}
    </div>
  );
};

export default Partner;
