import { combineReducers } from "@reduxjs/toolkit";
import cartSlice from "./cartSlice";
import userSlice from "./userSlice";

export const reducer = combineReducers({
  user: userSlice,
  cart: cartSlice,
});
