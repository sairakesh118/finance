'use client';

import { Suspense } from "react";
import { BarLoader } from "react-spinners";
import { TransactionTable } from "../_components/transaction-table";
import { AccountChart } from "../_components/account-chart";
import { useGetAccountWithIdQuery } from "@/store/api/accountApi";
import { useParams, notFound } from "next/navigation";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Wallet, Activity } from "lucide-react";

export default function AccountPage() {
  const params = useParams();
  const { data: accountData, isLoading, error, refetch } = useGetAccountWithIdQuery(params.id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
        <div className="flex flex-col justify-center items-center h-96">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center animate-pulse">
              <Wallet className="w-8 h-8 text-white" />
            </div>
          </div>
          <BarLoader color="#9333ea" width={200} height={4} />
          <p className="text-slate-600 mt-4 animate-pulse">Loading account details...</p>
        </div>
      </div>
    );
  }

  if (!accountData || error) {
    notFound();
  }

  const { transactions, ...account } = accountData;
  
  // Calculate quick stats
  const recentTransactions = transactions.slice(0, 5);
  const totalIncome = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-end justify-between">
            {/* Account Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 bg-clip-text text-transparent capitalize leading-tight">
                    {account.name}
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 border border-purple-200">
                      {account.type.charAt(0) + account.type.slice(1).toLowerCase()} Account
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Balance Card */}
            <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl shadow-purple-100/50 min-w-[280px]">
              <div className="text-right">
                <p className="text-sm text-slate-600 mb-1">Current Balance</p>
                <div className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
                  ${parseFloat(account.balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="flex items-center justify-end gap-2 text-sm text-slate-600">
                  <Activity className="w-4 h-4" />
                  <span>{transactions.length} Transaction{transactions.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg shadow-green-100/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Total Income</p>
                <p className="text-2xl font-bold text-green-600">
                  +${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <ArrowUpRight className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg shadow-red-100/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">
                  -${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <ArrowDownRight className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="mb-8">
          <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl shadow-purple-100/50">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-semibold text-slate-900">Account Activity</h2>
            </div>
            <Suspense fallback={
              <div className="flex justify-center items-center h-64">
                <BarLoader color="#9333ea" width={300} height={4} />
              </div>
            }>
              <AccountChart transactions={transactions} />
            </Suspense>
          </div>
        </div>

        {/* Transactions Section */}
        <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl shadow-purple-100/50 overflow-hidden">
          <div className="p-6 border-b border-slate-200/50">
            <h2 className="text-xl font-semibold text-slate-900">Recent Transactions</h2>
            <p className="text-sm text-slate-600 mt-1">
              Manage and track your account transactions
            </p>
          </div>
          <Suspense fallback={
            <div className="flex justify-center items-center h-32">
              <BarLoader color="#9333ea" width={300} height={4} />
            </div>
          }>
            <TransactionTable 
              transactions={transactions} 
              accountId={params.id} 
              refetch={refetch} 
              accountName={account.name}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}