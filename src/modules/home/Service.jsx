import React from "react";

const Service = () => {
  return (
    <div className="mt-5">
      <div className="grid grid-cols-4 gap-5">
        <div className="service-box text-center">
          <img src="./card1.png" alt="" className="mx-auto" />
          <h4 className="my-3">Free Same-Day Delivery</h4>
          <p className="text-gray-400">
            Order by 2pm local time to get free delivery on orders $35+ today.
          </p>
        </div>
        <div className="service-box text-center">
          <img src="./card2.png" alt="" className="mx-auto" />
          <h4 className="my-3">30 Day Return</h4>
          <p className="text-gray-400">
            35% off your first order plus 5% off all future orders.
          </p>
        </div>
        <div className="service-box text-center">
          <img src="./card3.png" alt="" className="mx-auto" />
          <h4 className="my-3">Security payment</h4>
          <p className="text-gray-400">
            25% off your online order of $50+. Available at most locations.
          </p>
        </div>
        <div className="service-box text-center">
          <img src="./card4.png" alt="" className="mx-auto" />
          <h4 className="my-3">24/7 Support</h4>
          <p className="text-gray-400">
            Shop online to get orders over $35 shipped fast and free.*
          </p>
        </div>
      </div>
    </div>
  );
};

export default Service;
