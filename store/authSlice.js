// store/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    user:null
  },
  reducers: {
    setAuthToken: (state, action) => {
      state.token = action.payload;
    },
    setUser:(state,action)=>{
      state.user=action.payload;
    },
    clearUser:(state,action)=>{
      state.user=null
      state.token=null
    }
  },
});

export const { setAuthToken, setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
