import { createAsyncThunk, createSlice, createAction } from "@reduxjs/toolkit";

export const fetchCurrentUser = createAction("getUser");
export const setLoading = createAction("setLoading");

const newUser = createSlice({
  name: "user",
  initialState: {
    user: null,
    cart: null,
    loading: true,
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
  },
});

export const { setUser } = newUser.actions;

export default newUser.reducer;
