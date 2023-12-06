import React, { useEffect, useState } from "react";
import Layout from "../../components/layouts/Layout";
import SliderShop from "../../modules/shop/SliderShop";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Checkbox, FormControlLabel, FormGroup, Slider } from "@mui/material";
import ListProduct from "../../modules/product/ListProduct";
import Loading from "../../components/Loading";
import LoadingSkeleton from "../../components/LoadingSkeleton";
import ReactPaginate from "react-paginate";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import lodash from "lodash";
import Form from "react-bootstrap/Form";
import Interested from "../../modules/shop/Interested";
import { useParams, useSearchParams } from "react-router-dom";
const theme = createTheme({
  palette: {
    primary: {
      main: "#00bfa5",
    },
    secondary: {
      main: "#f44336",
    },
  },
});
const ShopClient = () => {
  const { user, searchVoice } = useSelector((state) => state.user);
  const [cates, setCates] = useState();
  const [products, setProduct] = useState();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState({
    cate: [],
    price: 0,
  });
  const [order, setOrder] = React.useState("asc");
  const [priceFilter, setPriceFilter] = React.useState("asc");

  const handleChangeOrder = (e) => {
    setOrder(e.target.value);
  };
  const handleChangePrice = (e) => {
    setPriceFilter(e.target.value);
  };

  const [value, setValue] = React.useState([1, 100]);
  const [deboundValue, setDeboundValue] = useState(value);
  const handleChange2 = (event, newValue) => {
    setValue(newValue);
  };
  const [searchParams] = useSearchParams();
 
  const FetchCate = async () => {
    const response = await axios({
      method: "get",
      url: "https://shoppet.fun/api/category/all",
      headers: {
        Authorization: "Bearer " + user?.token,
      },
    });
    if (response) {
      setCates(response.data);
    }
  };
  const handleChange = async (e) => {
    setPage(1);
    let checked = document.querySelectorAll('input[type="checkbox"]');
    console.log(checked);
    const cate = [];
    checked.length > 0 &&
      [...checked].map((item) => {
        if (item.checked) {
          console.log(+item.value);
          cate.push(+item.value);
        }
      });
    // console.log(cate);
    setFilter((filter) => {
      return { ...filter, cate };
    });
  };
  const fetchProduct = async () => {
    const formData = new FormData();
    if (filter.cate.length > 0) {
      filter.cate.forEach((item) => {
        formData.append("cate[]", item);
      });
    }
    if (deboundValue.length > 0) {
      console.log("lllllllllllll");
      deboundValue.forEach((item) => {
        formData.append("price[]", +item);
      });
    }
    formData.append("order", order);
    if (searchVoice) {
      formData.append("searchVoice", searchVoice);
    }

    formData.append("priceFilter", priceFilter);

    try {
      setLoading(true);
      // setProduct(null);
      const response = await axios({
        method: "POST",
        url: `https://shoppet.fun/api/product/filter?page=${page}`,

        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + user?.token,
        },
        data: formData,
      });
      // if (response) {
      console.log(response.data);
      setProduct(response.data);
      setLoading(false);
      return response.data;
      // }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    FetchCate();
  }, []);

  useEffect(() => {
    fetchProduct();
  }, [filter, page, deboundValue, order, priceFilter, searchVoice]);
  const handleSetDeboundValue = lodash.debounce(() => {
    setLoading(true);

    setDeboundValue(value);
    setLoading(false);
  }, 200);

  //phân trang
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const { per_page } = products || [];
  console.log(per_page);
  useEffect(() => {
    if (!products || !products.total) return;

    products && setPageCount(Math.ceil(products.total / per_page));
  }, [itemOffset, products]);
  const handlePageClick = (event) => {
    window.scrollTo(0, 700);
    const newOffset = (event.selected * per_page) % products.total;
    setItemOffset(newOffset);
    setPage(event.selected + 1);
  };

  //end phân trang
  useEffect( () => {
    console.log('keyword');
    const search  = async ()=>{
      console.log(searchParams.get('keyword').split(','));
      const keywords = searchParams.get('keyword').split(',');
      const newResults = []
      const products = await fetchProduct()
      products?.data?.forEach((item) => {
        
        const hasKeyword = keywords.some((keyword) =>
              keyword!= "" && (item.name.toLowerCase().includes(keyword.toLowerCase()) || item.description.toLowerCase().includes(keyword.toLowerCase()))
        );
        if( hasKeyword ) newResults.push(item);
      });
      setProduct({
        ...products,
        total:newResults.length,
        data:newResults
      })
    }
    if(searchParams.get('keyword')){
      search();
    }
  }, [searchParams]);
  return (
    <Layout>
      <div className="main  bg-white">
        {cates && <SliderShop data={cates}></SliderShop>}
        <div className="container-content p-5">
          <div className="grid grid-cols-12 gap-5">
            <div id="product_page" className="col-span-3">
              <h4 className="border-b pb-3 border-gray-300">
                Product categories
              </h4>
              <div className="cates">
                <FormGroup>
                  {cates &&
                    cates.map((item) => (
                      <FormControlLabel
                        key={item.id}
                        className="text-gray-500"
                        control={
                          <Checkbox
                            value={item.id}
                            onChange={(e) => handleChange(e)}
                            // defaultChecked
                          />
                        }
                        label={item.name}
                      />
                    ))}
                </FormGroup>
              </div>
              <h4 className="border-b mt-5 pb-3 border-gray-300">Price</h4>
              <div className="range mt-4">
                {value && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="start text-2xl px-3 py-2 w-[120px] text-center border border-gray-400 text-orange-500 font-semibold">
                      ${value[0]}
                    </span>
                    <span> ---- </span>
                    <span className="end text-2xl px-6 py-2 w-[120px] text-center border border-gray-400 text-orange-600 font-semibold">
                      ${value[1]}
                    </span>
                  </div>
                )}
                <ThemeProvider theme={theme}>
                  <Slider
                    className="text-orange-500"
                    getAriaLabel={() => "Temperature range"}
                    value={value}
                    onChange={handleChange2}
                    valueLabelDisplay="auto"
                    color="secondary"
                  />
                </ThemeProvider>
                <p
                  onClick={handleSetDeboundValue}
                  className="px-4 py-2 bg-green-400 cursor-pointer hover:bg-green-700 transition-all text-white font-semibold text-xl text-center rounded-lg"
                >
                  Tìm kiếm
                </p>
              </div>

              <Interested></Interested>
            </div>
            <div className="col-span-9">
              <div className="grid grid-cols-12 gap-5 mb-3">
                <div className="col-span-4"></div>
                <div className="col-span-4 ">
                  <div className="flex w-full gap-3 items-center">
                    <h5 className="text-orange-500">Price</h5>
                    <Form.Select
                      onChange={handleChangePrice}
                      aria-label="Default select example"
                    >
                      <option value="asc">Low to Hight</option>
                      <option value="desc">Hight to Low</option>
                    </Form.Select>
                  </div>
                </div>
                <div className="col-span-4 ">
                  <div className="flex w-full items-center  gap-3">
                    <h5 className="text-orange-500">Name</h5>
                    <Form.Select
                      onChange={handleChangeOrder}
                      aria-label="Default select example"
                    >
                      <option value="asc">A - Z</option>
                      <option value="desc">Z - A</option>
                    </Form.Select>
                  </div>
                </div>
              </div>
              {products?.data?.length > 0 && !loading && (
                <>
                  <ListProduct
                    loading={loading}
                    data={products.data}
                  ></ListProduct>
                </>
              )}

              {products?.data?.length <= 0 && !loading && (
                <div className=" flex h-[80%] items-center justify-center flex-col border rounded-2xl bg-gray-200 border-gray-500">
                  <h2 className="text-center text-red-500">No data</h2>
                </div>
              )}

              {(loading || !products) && (
                <div className="">
                  <div className="grid grid-cols-3 gap-5 ">
                    {Array(9)
                      .fill()
                      .map((item, index) => (
                        <div key={index}>
                          <LoadingSkeleton className="w-full h-[300px] rounded-3xl"></LoadingSkeleton>
                          <div className="px-2 mt-3">
                            <LoadingSkeleton className="w-[50px] h-[10px] my-2"></LoadingSkeleton>
                            <LoadingSkeleton className="w-[150px] h-[10px]"></LoadingSkeleton>
                            <LoadingSkeleton className="w-[50px] h-[10px] my-2"></LoadingSkeleton>
                            <LoadingSkeleton className="my-2 h-[30px] w-[150px] cursor-pointer rounded-3xl text-white text-center"></LoadingSkeleton>
                          </div>
                        </div>
                      ))}
                  </div>
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
      </div>
    </Layout>
  );
};

export default ShopClient;
