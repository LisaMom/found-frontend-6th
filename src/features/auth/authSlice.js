import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: ''
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    
    setLogout: (state) => {
      state.accessToken = null;
    }
  }
})

export const {setAccessToken, setLogout} = authSlice.actions;
export default authSlice.reducer;
