import React from "react";
import moment from "moment-timezone";

const ItemCouponShiping = ({ item }) => {
  return (
    <>
      {item && (
        <label htmlFor="voucher" className="w-full">
          <div className="col-span-6 my-2 rounded-lg shadow-lg flex cursor-pointer">
            <div className="w-[170px] p-3 flex justify-center items-center font-semibold rounded-l-md text-slate-50 bg-green-500">
              {item.name}
            </div>
            <div className="p-3 flex-1 text-gray-500 ">
              <p className="m-0 font-semibold">Tất cả hình thức thanh toán</p>
              <p className="m-0 font-semibold">Đơn tối thiểu 0$</p>

              <span>
                <span> HSD </span>
                {moment(item.expires)
                  .tz("Asia/Bangkok")
                  .format("DD/MM/YYYY h:mm:ss A")}
              </span>
            </div>
            <p className="mr-4 flex items-center">
              <input
                onChange={() => {
                  localStorage.setItem(
                    "infoVoucher",
                    JSON.stringify({
                      id: item.id,
                      feature: item.feature,
                      value: item.value,
                    })
                  );
                }}
                className="scale-[2]"
                type="radio"
                name="voucher"
                id="voucher"
              />
            </p>
          </div>
        </label>
      )}
    </>
  );
};

export default ItemCouponShiping;
