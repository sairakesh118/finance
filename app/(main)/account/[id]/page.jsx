'use client';

import { Suspense } from "react";
import { BarLoader } from "react-spinners";
import { TransactionTable } from "../_components/transaction-table";
import { AccountChart } from "../_components/account-chart";
import { useGetAccountWithIdQuery } from "@/store/api/accountApi";
import { useParams, notFound } from "next/navigation";

export default function AccountPage() {
  const params = useParams();
  const { data: accountData, isLoading, error, refetch } = useGetAccountWithIdQuery(params.id);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <BarLoader color="#9333ea" />
      </div>
    );
  }

  if (!accountData || error) {
    notFound();
  }

  const { transactions, ...account } = accountData;
  console.log(transactions);

  return (
    <div className="space-y-8 px-5">
      <div className="flex gap-4 items-end justify-between">
        <div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight gradient-title capitalize">
            {account.name}
          </h1>
          <p className="text-muted-foreground">
            {account.type.charAt(0) + account.type.slice(1).toLowerCase()} Account
          </p>
        </div>

        <div className="text-right pb-2">
          <div className="text-xl sm:text-2xl font-bold">
            ${parseFloat(account.balance).toFixed(2)}
          </div>
          <p className="text-sm text-muted-foreground">
            {transactions.length} Transactions
          </p>
        </div>
      </div>

      <Suspense fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}>
        <AccountChart transactions={transactions} />
      </Suspense>

      <Suspense fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}>
        <TransactionTable transactions={transactions} accountId={params.id} refetch={refetch} />
      </Suspense>
    </div>
  );
}
