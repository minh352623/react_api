import { createAsyncThunk, createSlice, createAction } from "@reduxjs/toolkit";
import requestGetCart, { requestAddCart, requestDeleteCart } from "./request";
import React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
export const ShowCart = createAction("isShowCart");
export const SetCart = createAction("SetCart");
import Cookies from "universal-cookie";

const cookies = new Cookies();
export const handleFetchCart = createAsyncThunk(
  "cart/handleFetchCart",
  async (_, thunkAPI) => {
    try {
      const user = cookies.get("user");
      if (user) {
        const response = await requestGetCart(user);
        return response.data?.carts?.length > 0
          ? JSON.parse(response.data.carts)
          : [];
      }

      return null;
    } catch (e) {
      console.log(e);
    }
  }
);
export const handleAddCart = createAsyncThunk(
  "cart/handleAddCart",
  async (data, thunkAPI) => {
    try {
      const user = cookies.get("user");
      const { idpro, number } = data;
      if (user) {
        const response = await requestAddCart(idpro, number, user);
        if (response.status === 200) {
          return JSON.parse(response.data.carts);
        }
      }

      return null;
    } catch (e) {
      console.log(e);

      return e.response;
    }
  }
);
export const handleDeleteCart = createAsyncThunk(
  "cart/handleDeleteCart",
  async (data, thunkAPI) => {
    try {
      const user = cookies.get("user");
      const { idpro } = data;
      if (user) {
        const response = await requestDeleteCart(idpro, user);
        return JSON.parse(response.data.carts);
      }

      return null;
    } catch (e) {
      console.log(e);
    }
  }
);
const newCart = createSlice({
  name: "cart",
  initialState: {
    isShowCart: false,
    carts: null,
    loading: true,
    success: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(ShowCart, (state, action) => {
      state.isShowCart = action.payload;
    });
    builder.addCase(SetCart, (state, action) => {
      state.carts = action.payload;
    });
    builder.addCase(handleFetchCart.fulfilled, (state, action) => {
      state.carts = action.payload;
      state.loading = false;
    });
    builder.addCase(handleFetchCart.pending, (state, action) => {
      state.loading = true;
      state.carts = [];
    });
    builder.addCase(handleFetchCart.rejected, (state, action) => {
      state.loading = false;
    });

    builder.addCase(handleAddCart.fulfilled, (state, action) => {
      console.log("fullfilled", action);
      if (action.payload.status === 400) {
        Swal.fire({
          position: "center-center",
          icon: "error",
          title: action.payload.data.message,
          showConfirmButton: false,
          timer: 1000,
        });
      } else {
        state.carts = action.payload;
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: "Thêm vào giỏ hàng thành công!",
          showConfirmButton: false,
          timer: 1000,
        });
      }
    });
    builder.addCase(handleAddCart.pending, (state, action) => {
      state.success = false;
    });
    builder.addCase(handleAddCart.rejected, (state, action) => {
      state.success = false;
    });

    builder.addCase(handleDeleteCart.fulfilled, (state, action) => {
      state.carts = action.payload;
      toast.success("Xóa sản phẩm thành công!", {
        position: "top-left",
        autoClose: 2000,
      });
    });
  },
});

export default newCart.reducer;
