import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react"; // include `/react`!
import { get } from "react-hook-form";

export const transactionApi = createApi({
  reducerPath: "transactionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://financebackend-1.onrender.com",
  }),
  endpoints: (builder) => ({
    getTransactions: builder.query({
      query: ({ clerkId, accountName }) =>
        `/transactions/transaction/${clerkId}/${accountName}`,
    }),

    getTransaction: builder.query({
      query:({clerkId,accountName,transactionId})=>({
        url:`/transactions/gettransaction/${transactionId}`,
        method:"POST",
        body:{clerkId,accountName}
      })
    }),

    createTransaction: builder.mutation({
      query: ({ transactionData, clerkId, accountName }) => ({
        url: `/transactions/transaction/${clerkId}/${accountName}`,
        method: "POST",
        body: transactionData,
      }),
    }),

    updateTransaction: builder.mutation({
      query: ({transactionId, transactionData, accountId }) => ({
        url: `/transactions/edittransaction/${accountId}/${transactionId}`,
        method: "PUT",
        body: transactionData
      }),
    }),

    deleteTransactions: builder.mutation({
      query: ({ transactionData, accountId }) => ({
        url: `/transactions/deletebulk/${accountId}`,
        method: "post",
        body: transactionData,
      }),
    }),
    deleteTransaction: builder.mutation({
      query: ({clerkId,accountName,transactionId}) => ({
        url: `/transactions/deletetransaction/${transactionId}`,
        method: "POST",
        body: { clerkId, accountName },
      }),
    })
  }),
});

// ✅ Export hooks
export const {
  useGetTransactionsQuery,
  useGetTransactionQuery,
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionsMutation,
  useDeleteTransactionMutation
} = transactionApi;
