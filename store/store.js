// store/store.js
import { configureStore } from "@reduxjs/toolkit";
import { appApi } from "./api/appApi";
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    [appApi.reducerPath]: appApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(appApi.middleware),
});
