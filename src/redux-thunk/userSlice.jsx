import { createAsyncThunk, createSlice, createAction } from "@reduxjs/toolkit";

export const fetchCurrentUser = createAction("getUser");
export const setLoading = createAction("setLoading");
export const setInfoPayment = createAction("setInfoPayment");

const newUser = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: true,
    infoPayment: null,
  },
  reducers: {
    setUser: (state, action) => ({
      ...state,
      user: {
        ...state.user,
        ...action.payload,
      },
    }),
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCurrentUser, (state, action) => {
      state.user = action.payload;
    });
    builder.addCase(setLoading, (state, action) => {
      state.loading = action.payload;
    });
    builder.addCase(setInfoPayment, (state, action) => {
      state.infoPayment = action.payload;
    });
  },
});

export const { setUser } = newUser.actions;

export default newUser.reducer;
