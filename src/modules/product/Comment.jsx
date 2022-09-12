import * as React from "react";
import Rating from "@mui/material/Rating";
import moment from "moment-timezone";

const Comment = ({ item, handleFeedBack }) => {
  return (
    <div>
      <div className="flex  gap-3 p-3 bg-gray-200 mt-3 rounded-xl">
        <div className="image w-[50px] h-[50px]">
          <img
            className="w-full h-full rounded-full"
            src={`http://127.0.0.1:8000${item.user.image}`}
            alt=""
          />
        </div>
        <div className="content w-50">
          <div className="message">
            <p className="m-0 text-xl font-semibold mb-2">{item.user.name}</p>
          </div>
          <div className="rating">
            <Rating name="read-only" value={+item.rating} readOnly />
          </div>
          <div className="message">
            <p>{item.comment}</p>
          </div>
        </div>
        <div className="created flex-1 justify-between flex-col text-end">
          <p className="h-25">
            {moment(item.created_at)
              .tz("Asia/Bangkok")
              .format("DD/MM/YYYY h:mm:ss A")}
          </p>
          <span
            onClick={handleFeedBack}
            data-user={item.user.id}
            data-name={item.user.name}
            className="font-semibold  cursor-pointer hover:underline"
          >
            Phản hồi
          </span>
        </div>
      </div>
    </div>
  );
};

export default Comment;
