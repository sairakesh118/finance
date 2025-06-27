// store/store.js
import { configureStore } from "@reduxjs/toolkit";
import { appApi } from "./api/appApi";
import { accountApi } from "./api/accountApi"; // Already added
import authReducer from "./authSlice";
import { transactionApi } from "./api/transactionApi";

export const store = configureStore({
  reducer: {
    [appApi.reducerPath]: appApi.reducer,
    [accountApi.reducerPath]: accountApi.reducer,
    [transactionApi.reducerPath]: transactionApi.reducer, // ✅ Add this line

    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(appApi.middleware)
      .concat(accountApi.middleware)
      .concat(transactionApi.middleware),
});
