import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import * as React from "react";
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import StarIcon from "@mui/icons-material/Star";
import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import Comment from "./Comment";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import { useRef } from "react";

const TabDetail = ({ description, product, isShow }) => {
  const { user } = useSelector((state) => state.user);
  const feedback = useRef();
  const [tabACtive, setTabActive] = React.useState(3);
  const labels = {
    0.5: "Useless",
    1: "Useless+",
    1.5: "Poor",
    2: "Poor+",
    2.5: "Ok",
    3: "Ok+",
    3.5: "Good",
    4: "Good+",
    4.5: "Excellent",
    5: "Excellent+",
  };
  const [comments, setComments] = useState();
  const [comment, setComment] = useState();
  const [value, setValue] = React.useState(4);
  const [hover, setHover] = React.useState(-1);
  const [page, setPage] = useState(1);
  const form = useRef();
  function getLabelText(value) {
    return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
  }
  const getComment = async () => {
    try {
      const response = await axios({
        method: "get",
        url:
          "https://shoppet.fun/api/comment/get/" +
          product +
          "?page=" +
          page,
        headers: {
          Authorization: "Bearer " + user?.token,
        },
      });
      if (response) {
        console.log(response.data);
        setComments(response.data);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const hanldeComment = async (e) => {
    e.preventDefault();
    if (comment) {
      const formData = new FormData();
      formData.append("comment", comment);
      formData.append("user_id", user.id);
      formData.append("product_id", product);
      formData.append("rating", value);

      try {
        const response = await axios({
          method: "post",
          url: "https://shoppet.fun/api/comment/add",
          headers: {
            Authorization: "Bearer " + user?.token,
          },
          data: formData,
        });
        if (response) {
          toast.success("Thêm bình luận thành công!", {
            position: "bottom-left",
            autoClose: 2000,
          });
          console.log(response);
          getComment();
          form.current.reset();
        }
      } catch (e) {
        console.log(e);
        toast.error("Thêm bình luận thất bại!", {
          position: "bottom-left",
          autoClose: 2000,
        });
      }
    }
  };
  useEffect(() => {
    getComment();
  }, [page]);

  //
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const { per_page } = comments || [];
  console.log(per_page);
  useEffect(() => {
    if (!comments || !comments.total) return;

    comments && setPageCount(Math.ceil(comments.total / per_page));
  }, [itemOffset, comments]);
  const handlePageClick = (event) => {
    window.scrollTo(0, 700);
    const newOffset = (event.selected * per_page) % comments.total;
    setItemOffset(newOffset);
    setPage(event.selected + 1);
  };

  //feedback
  const handleFeedBack = (e) => {
    console.log(feedback.current.getBoundingClientRect());
    window.scrollTo(0, feedback.current.getBoundingClientRect().right - 500);
    feedback.current.value = e.target.dataset.name;
  };
  return (
    <>
      <div className="tabs mx-auto mb-5 text-center flex items-center justify-center gap-5">
        <div className={`tab `}>
          <span
            onClick={() => setTabActive(1)}
            className={`${
              tabACtive == 1
                ? "text-slate-900  before:w-full"
                : "text-gray-400 hover:text-slate-900  hover:before:block hover:before:w-full  before:w-0"
            } relative inline-block before:origin-center transition-all before:transition-all cursor-pointer transition-all before:bottom-[-2px] before:content-[''] before:absolute  before:h-[2px] before:bg-black font-bold text-xl`}
          >
            Description
          </span>
        </div>
        <div className="tab">
          <span
            onClick={() => setTabActive(2)}
            className={`${
              tabACtive == 2
                ? "text-slate-900 before:w-full"
                : "text-gray-400 hover:text-slate-900  hover:before:block hover:before:w-full  before:w-0"
            } relative inline-block  before:origin-center transition-all before:transition-all cursor-pointer transition-all before:bottom-[-2px] before:content-[''] before:absolute  before:h-[2px] before:bg-black font-bold text-xl`}
          >
            Additional
          </span>
        </div>
        <div className="tab">
          <span
            onClick={() => setTabActive(3)}
            className={`${
              tabACtive == 3
                ? "text-slate-900 before:w-full"
                : "text-gray-400 hover:text-slate-900  hover:before:block hover:before:w-full  before:w-0"
            } relative inline-block  before:origin-center transition-all before:transition-all cursor-pointer transition-all before:bottom-[-2px] before:content-[''] before:absolute  before:h-[2px] before:bg-black font-bold text-xl`}
          >
            Shipping & Return
          </span>
        </div>
        <div className="tab">
          <span
            onClick={() => setTabActive(4)}
            className={`${
              tabACtive == 4
                ? "text-slate-900 before:w-full"
                : "text-gray-400 hover:text-slate-900  hover:before:block hover:before:w-full  before:w-0"
            } relative inline-block   before:origin-center transition-all before:transition-all cursor-pointer  transition-all before:bottom-[-2px] before:content-[''] before:absolute  before:h-[2px] before:bg-black font-bold text-xl`}
          >
            Reviews
          </span>
        </div>
      </div>
      <div className="contents mt-5">
        <div
          className={`content ${
            tabACtive == 1 ? "block" : "hidden"
          } text-justify text-gray-400`}
        >
          {description}
          {description}

          {description}
        </div>
        <div
          className={`content ${
            tabACtive == 2 ? "block" : "hidden"
          } text-justify text-gray-400 w-[57%] mx-auto`}
        >
          <ol className="flex flex-col justify-center text-justify  mx-auto list-decimal">
            <li>
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur.
            </li>
            <li>
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
              officia deserunt mollit anim id est laborum.
            </li>
            <li>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
              accusantium doloremque laudantium.
            </li>
            <li>
              eaque ipsa quae ab illo inventore veritatis et quasi architecto
              beatae vitae dicta sunt explicabo.
            </li>
          </ol>
        </div>
        <div
          className={`content ${
            tabACtive == 3 ? "block" : "hidden"
          } text-justify text-gray-400`}
        >
          <h4 className="text-slate-900">Returns Policy</h4>
          <div>
            <p>
              You may return most new, unopened items within 30 days of delivery
              for a full refund. We'll also pay the return shipping costs if the
              return is a result of our error (you received an incorrect or
              defective item, etc.).
            </p>
            <p>
              You should expect to receive your refund within four weeks of
              giving your package to the return shipper, however, in many cases
              you will receive a refund more quickly. This time period includes
              the transit time for us to receive your return from the shipper (5
              to 10 business days), the time it takes us to process your return
              once we receive it (3 to 5 business days), and the time it takes
              your bank to process our refund request (5 to 10 business days).
            </p>
            <p>
              If you need to return an item, simply login to your account, view
              the order using the 'Complete Orders' link under the My Account
              menu and click the Return Item(s) button. We'll notify you via
              e-mail of your refund once we've received and processed the
              returned item.
            </p>
          </div>
          <h4 className="text-slate-900 mt-5">Shipping</h4>
          <div>
            <p>
              We can ship to virtually any address in the world. Note that there
              are restrictions on some products, and some products cannot be
              shipped to international destinations.
            </p>
            <p>
              When you place an order, we will estimate shipping and delivery
              dates for you based on the availability of your items and the
              shipping options you choose. Depending on the shipping provider
              you choose, shipping date estimates may appear on the shipping
              quotes page.
            </p>
            <p>
              Please also note that the shipping rates for many items we sell
              are weight-based. The weight of any such item can be found on its
              detail page. To reflect the policies of the shipping companies we
              use, all weights will be rounded up to the next full pound.
            </p>
          </div>
        </div>
        <div
          className={`content ${
            tabACtive == 4 ? "block" : "hidden"
          } border p-5 border-gray-400`}
        >
          {isShow && (
            <Form ref={form} onSubmit={hanldeComment}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Box
                  sx={{
                    width: 200,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Rating
                    name="hover-feedback"
                    value={value}
                    precision={1}
                    getLabelText={getLabelText}
                    onChange={(event, newValue) => {
                      setValue(newValue);
                    }}
                    onChangeActive={(event, newHover) => {
                      setHover(newHover);
                    }}
                    emptyIcon={
                      <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
                    }
                  />
                  {value !== null && (
                    <Box sx={{ ml: 2 }}>
                      {labels[hover !== -1 ? hover : value]}
                    </Box>
                  )}
                </Box>
                <Form.Label className="mt-3">Comment</Form.Label>
                <Form.Control
                  ref={feedback}
                  onChange={(e) => setComment(e.target.value)}
                  type="text"
                  placeholder="Enter comment"
                />
              </Form.Group>
              <div className="block text-end">
                <button
                  className="bg-slate-700 px-6 py-2 rounded-3xl hover:bg-orange-400 transition-all text-white"
                  type="submit"
                >
                  Submit Review
                </button>
              </div>
            </Form>
          )}
          <div className="list gap-1 flex flex-col">
            {comments?.data?.length > 0 &&
              comments.data.map((item) => (
                <Comment
                  handleFeedBack={handleFeedBack}
                  key={item.id}
                  item={item}
                ></Comment>
              ))}
            {comments?.data.length <= 0 && (
              <div className="text-gray-500 p-3 text-center mt-5">
                Bạn có thể là người bình luân đầu tiên ngay bây giờ
              </div>
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
        </div>
      </div>
    </>
  );
};

export default TabDetail;
