// store/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
  },
  reducers: {
    setAuthToken: (state, action) => {
      state.token = action.payload;
    },
  },
});

export const { setAuthToken } = authSlice.actions;
export default authSlice.reducer;
