"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LineChart,
  Line,
} from "recharts";
import { format, isThisMonth, parseISO } from "date-fns";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp, 
  TrendingDown,
  CreditCard,
  Wallet,
  PieChart as PieChartIcon,
  Calendar,
  DollarSign,
  Activity
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeleteTransactionMutation, useGetTransactionsQuery } from "@/store/api/transactionApi";
import { useRouter } from "next/navigation";

const COLORS = [
  "#8B5CF6", // Purple
  "#06B6D4", // Cyan
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5A2B", // Brown
  "#EC4899", // Pink
  "#6366F1", // Indigo
];

const CATEGORY_ICONS = {
  "Food & Dining": "🍽️",
  "Transportation": "🚗",
  "Shopping": "🛍️",
  "Entertainment": "🎭",
  "Bills & Utilities": "💡",
  "Healthcare": "🏥",
  "Education": "📚",
  "Travel": "✈️",
  "Other": "📋"
};

export function DashboardOverview({ accounts = [] }) {
  const { user } = useUser();
  const [selectedAccount, setSelectedAccount] = useState("");

  // Set default account
  useEffect(() => {
    if (accounts.length > 0) {
      setSelectedAccount(accounts[0]);
    }
  }, [accounts]);

  // Fetch transactions with Redux

  const [deleteTransaction] = useDeleteTransactionMutation();

  const {
    data: transactionData,
    isLoading,
    error,
    refetch
  } = useGetTransactionsQuery(
    {
      clerkId: user?.id,
      accountName: selectedAccount,
    },
    {
      skip: !user?.id || !selectedAccount,
      refetchOnMountOrArgChange: true,
    }
  );

  const clerkId=user?.id;
  const accountName=selectedAccount;

  const router=useRouter();

  const handleEdit = (id) => {
  // Redirect to the edit page
  router.push(`/transaction/create?edit=${id}&accountName=`);
};

const  handleDelete = async(transactionId) => {
  console.log("Transaction ID:", transactionId);
  if (confirm("Are you sure you want to delete this transaction?")) {
    // Call your API or RTK mutation to delete it
    await deleteTransaction({transactionId,clerkId,accountName});
    await refetch()
  }
};

  // Normalize transactions data
  const transactions = (() => {
    if (Array.isArray(transactionData)) {
      return transactionData;
    } else if (Array.isArray(transactionData?.transactions)) {
      return transactionData.transactions;
    } else if (transactionData && typeof transactionData === "object") {
      return [transactionData];
    }
    return [];
  })();

  // Calculate statistics
  const stats = (() => {
    const currentMonth = transactions.filter(t => isThisMonth(new Date(t.date)));
    const expenses = currentMonth.filter(t => t.type?.toLowerCase() === "expense");
    const income = currentMonth.filter(t => t.type?.toLowerCase() === "income");
    
    const totalExpenses = expenses.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    const totalIncome = income.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    const netBalance = totalIncome - totalExpenses;
    
    return {
      totalExpenses,
      totalIncome,
      netBalance,
      transactionCount: currentMonth.length,
      averageTransaction: currentMonth.length ? (totalExpenses + totalIncome) / currentMonth.length : 0
    };
  })();

  // Get recent transactions (sorted by date)
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

  // Group expenses by category for current month
  const currentMonthExpenses = transactions
    .filter(t => t.type?.toLowerCase() === "expense" && isThisMonth(new Date(t.date)));

  const expensesByCategory = currentMonthExpenses.reduce((acc, t) => {
    const category = t.category || "Other";
    acc[category] = (acc[category] || 0) + (Number(t.amount) || 0);
    return acc;
  }, {});

  const chartData = Object.entries(expensesByCategory)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Stats Cards Skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Main Cards Skeleton */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6 text-center">
          <div className="text-red-600 mb-2">
            <Activity className="h-8 w-8 mx-auto mb-2" />
            <p className="font-medium">Unable to load dashboard data</p>
            <p className="text-sm text-red-500 mt-1">
              {error.message || "Please try refreshing the page"}
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Account Selector */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of your financial activity
          </p>
        </div>
        <Select value={selectedAccount} onValueChange={setSelectedAccount}>
          <SelectTrigger className="w-64 bg-white shadow-sm">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              <SelectValue placeholder="Select account" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {accounts.map((account) => (
              <SelectItem key={account} value={account}>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  {account}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Income</p>
                <p className="text-2xl font-bold text-blue-900">
                  ${stats.totalIncome.toFixed(2)}
                </p>
                <p className="text-xs text-blue-500">This month</p>
              </div>
              <div className="p-3 bg-blue-600 rounded-full">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Total Expenses</p>
                <p className="text-2xl font-bold text-red-900">
                  ${stats.totalExpenses.toFixed(2)}
                </p>
                <p className="text-xs text-red-500">This month</p>
              </div>
              <div className="p-3 bg-red-600 rounded-full">
                <TrendingDown className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br ${stats.netBalance >= 0 ? 'from-green-50 to-green-100 border-green-200' : 'from-orange-50 to-orange-100 border-orange-200'}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${stats.netBalance >= 0 ? 'text-green-600' : 'text-orange-600'}`}>
                  Net Balance
                </p>
                <p className={`text-2xl font-bold ${stats.netBalance >= 0 ? 'text-green-900' : 'text-orange-900'}`}>
                  ${Math.abs(stats.netBalance).toFixed(2)}
                </p>
                <p className={`text-xs ${stats.netBalance >= 0 ? 'text-green-500' : 'text-orange-500'}`}>
                  {stats.netBalance >= 0 ? 'Surplus' : 'Deficit'}
                </p>
              </div>
              <div className={`p-3 rounded-full ${stats.netBalance >= 0 ? 'bg-green-600' : 'bg-orange-600'}`}>
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Transactions</p>
                <p className="text-2xl font-bold text-purple-900">
                  {stats.transactionCount}
                </p>
                <p className="text-xs text-purple-500">This month</p>
              </div>
              <div className="p-3 bg-purple-600 rounded-full">
                <Activity className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Transactions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Transactions
              </CardTitle>
              <Badge variant="outline">{recentTransactions.length} recent</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No recent transactions</p>
                  <p className="text-sm">Your transactions will appear here</p>
                </div>
              ) : (
                recentTransactions.map((transaction, index) => (
                  <div
  key={index}
  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
>
  {/* Left: Icon + Description + Date */}
  <div className="flex items-center gap-3">
    <div
      className={`p-2 rounded-full ${
        transaction.type?.toLowerCase() === "expense"
          ? "bg-red-100 text-red-600"
          : "bg-green-100 text-green-600"
      }`}
    >
      {transaction.type?.toLowerCase() === "expense" ? (
        <ArrowDownRight className="h-4 w-4" />
      ) : (
        <ArrowUpRight className="h-4 w-4" />
      )}
    </div>
    <div>
      <p className="font-medium text-gray-900">
        {transaction.description || "Transaction"}
      </p>
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>{format(new Date(transaction.date), "MMM dd, yyyy")}</span>
        {transaction.category && (
          <>
            <span>•</span>
            <Badge variant="secondary" className="text-xs">
              {transaction.category}
            </Badge>
          </>
        )}
      </div>
    </div>
  </div>

  {/* Right: Amount + Actions */}
  <div className="text-right flex flex-col items-end gap-2">
    <p
      className={`font-bold ${
        transaction.type?.toLowerCase() === "expense"
          ? "text-red-600"
          : "text-green-600"
      }`}
    >
      {transaction.type?.toLowerCase() === "expense" ? "-" : "+"}
      ${Number(transaction.amount).toFixed(2)}
    </p>

    <div className="flex gap-2">
      <button
        onClick={() => handleEdit(transaction.id)}
        className="text-blue-600 hover:underline text-sm"
      >
        Edit
      </button>
      <button
        onClick={() => handleDelete(transaction.id)}
        className="text-red-600 hover:underline text-sm"
      >
        Delete
      </button>
    </div>
  </div>
</div>

                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Expense Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Monthly Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <PieChartIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="font-medium">No expenses this month</p>
                <p className="text-sm">Start tracking your expenses</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Amount']}
                        labelStyle={{ color: '#374151' }}
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Category Legend */}
                <div className="space-y-2">
                  {chartData.slice(0, 5).map((entry, index) => (
                    <div key={entry.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="font-medium">
                          {CATEGORY_ICONS[entry.name] || "📋"} {entry.name}
                        </span>
                      </div>
                      <span className="text-gray-600 font-medium">
                        ${entry.value.toFixed(2)}
                      </span>
                    </div>
                  ))}
                  {chartData.length > 5 && (
                    <p className="text-xs text-gray-500 text-center pt-2">
                      +{chartData.length - 5} more categories
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}