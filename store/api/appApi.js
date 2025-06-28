import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const appApi = createApi({
  reducerPath: "appApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://financebackend-xspt.onrender.com",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),


  endpoints: (builder) => ({
    post: builder.mutation({
      query: (credentials) => ({
        url: "/users/user",
        method: "POST",
        body: credentials,
      }),
  }),
})
});

export const { usePostMutation } = appApi;
