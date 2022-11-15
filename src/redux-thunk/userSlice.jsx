import { createAsyncThunk, createSlice, createAction } from "@reduxjs/toolkit";

export const fetchCurrentUser = createAction("getUser");
export const setLoading = createAction("setLoading");
export const setInfoPayment = createAction("setInfoPayment");
export const setFaceioInstance = createAction("setFaceioInstance");
export const setNotifycations = createAction("setNotifycations");
export const setSearchVoice = createAction("setSearchVoice");
export const setChangeMoney = createAction("setChangeMoney");

const newUser = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: true,
    infoPayment: null,
    faceioInstance: null,
    notifycations: [],
    searchVoice: null,
    changeMoney: false,
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
    builder.addCase(setFaceioInstance, (state, action) => {
      state.faceioInstance = action.payload;
    });
    builder.addCase(setNotifycations, (state, action) => {
      state.notifycations = action.payload;
    });
    builder.addCase(setSearchVoice, (state, action) => {
      state.searchVoice = action.payload;
    });
    builder.addCase(setChangeMoney, (state, action) => {
      state.searchVoice = action.payload;
    });
  },
});

export const { setUser } = newUser.actions;

export default newUser.reducer;
