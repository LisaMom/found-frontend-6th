import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthLoaded: false,
  accessToken: "",
  refreshToken: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthLoaded = true;
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setRefreshToken: (state, action) => {
      state.refreshToken = action.payload;
    },
    setLogout: (state) => {
      state.user = null;
      state.isAuthLoaded = true;
      state.accessToken = "";
      state.refreshToken = "";
      sessionStorage.removeItem("refreshToken");
    },
  },
});

export const { setUser, setAccessToken, setLogout, setRefreshToken } = authSlice.actions;
export default authSlice.reducer;

