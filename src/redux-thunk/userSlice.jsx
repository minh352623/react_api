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
    provider:null,
    singer:null
  },
  reducers: {
    setUser: (state, action) => ({
      ...state,
      user: {
        ...state.user,
        ...action.payload,
      },
    }),
    setProvider: (state, action) => {
      console.log("🚀 ~ file: userSlice.jsx:33 ~ action:", action)
      return {

        ...state,
        provider: action.payload,
      }
    },
    setSinger: (state, action) => {
      console.log("🚀 ~ file: userSlice.jsx:41 ~ action:", action)
      return {

        ...state,
      
      singer: action.payload,
    }
    }
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

export const { setUser, setProvider ,setSinger } = newUser.actions;

export default newUser.reducer;
