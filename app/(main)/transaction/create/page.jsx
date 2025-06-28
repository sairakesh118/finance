"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { AddTransactionForm } from "../_components/transaction-form";

import { Loader2 } from "lucide-react";
import { useGetTransactionsQuery } from "@/store/api/transactionApi";

export default function AddTransactionPage() {
  const searchParams = useSearchParams();
  const { user, isLoaded } = useUser();
  const editId = searchParams.get("edit");
  const accountName=searchParams.get("accountName");
  const [initialData, setInitialData] = useState(null);

  // If in edit mode, fetch the transaction data
  const {
    data: transactionData,
    isLoading: transactionLoading,
    error: transactionError,
  } = useGetTransactionsQuery({ clerkId: user?.id, accountName: accountName ,transactionId:editId}, {
    skip: !editId,
  });
  console.log("Transaction data:", transactionData);
  console.log(editId)

  // Update initial data when transaction data is loaded
  useEffect(() => {
    if (editId && transactionData) {
      setInitialData(transactionData);
    }
  }, [editId, transactionData]);

  // Show loading while Clerk is loading user data
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not signed in
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg mb-4">Please sign in to continue</p>
          {/* Add your sign-in component or redirect logic here */}
        </div>
      </div>
    );
  }

  // Show loading while fetching transaction data in edit mode
  if (editId && transactionLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Loading transaction data...</p>
        </div>
      </div>
    );
  }

  // Show error if transaction fetch failed
  if (editId && transactionError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg text-red-500 mb-4">
            Failed to load transaction data
          </p>
          <p className="text-sm text-gray-500">
            {transactionError?.data?.message || "Please try again later"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="min-w-full">
        {/* Page Header */}
        

        {/* Transaction Form */}
        <AddTransactionForm
          editMode={!!editId}
          initialData={initialData}
        />
      </div>
    </div>
  );
}
