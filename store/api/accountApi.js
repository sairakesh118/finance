import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const accountApi = createApi({
  reducerPath: "accountApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://financebackend-xspt.onrender.com",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Account"],
  endpoints: (builder) => ({
    getAccount: builder.query({
      query: ({clerkId}) => `/accounts/account/${clerkId}`,
      providesTags: ["Account"],
    }),
    updateAccount: builder.mutation({
      query: ({ id, ...accountData }) => ({
        url: `accounts/account/${id}`,
        method: "PUT",
        body: accountData,
      }),
      invalidatesTags: ["Account"],
    }),
    createAccount: builder.mutation({
      query: (accountData) => ({
        url: "accounts/account",
        method: "POST",
        body: accountData,
      }),
      invalidatesTags: ["Account"],
    }),
    deleteAccount: builder.mutation({
      query: (accountId) => ({
        url: `accounts/account/${accountId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Account"],
    }),
    updateDefaultAccount: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `accounts/defaultaccount/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Account"],
    }),
    getUserAccounts: builder.query({
      query: (userId) => `/accounts/useraccount/${userId}`,
      providesTags: ["Account"],
    }),
    monthlyExpenses: builder.query({
      query: (clerkId) => `accounts/expenses/monthly/${clerkId}`,
      providesTags: ["Account"],
    }),
    getAccountWithId:builder.query({
      query:(accountId)=>`/accounts/singleaccount/${accountId}`,
      providesTags: ["Account"],
    }),
    budgetUpdate:builder.mutation({
       query:({budget,accountId})=>({
        url:`accounts/budget/${accountId}`,
        method:"POST",
         headers: {
      "Content-Type": "application/json", // ✅ Ensure JSON header
    },
    body: JSON.stringify({ budget })
       })
    })
  }),
});

// ✅ Export hooks
export const {
  useGetAccountQuery,
  useUpdateAccountMutation,
  useCreateAccountMutation,
  useDeleteAccountMutation,
  useUpdateDefaultAccountMutation,
  useGetUserAccountsQuery,
  useMonthlyExpensesQuery, // ✅ This will now be defined
  useGetAccountWithIdQuery, // ✅ Renamed for clarity
  useBudgetUpdateMutation
} = accountApi;
