import { combineReducers } from "@reduxjs/toolkit";
import userSlice from "./userSlice";

export const reducer = combineReducers({
  user: userSlice,
});
