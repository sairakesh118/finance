"use client";

import { Suspense, useMemo, useCallback } from "react";
import { AccountCard } from "./_components/account-card";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { BudgetProgress } from "./_components/budget-progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Plus, 
  Wallet, 
  TrendingUp, 
  PiggyBank, 
  CreditCard, 
  DollarSign,
  Activity,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles
} from "lucide-react";
import { DashboardOverview } from "./_components/transaction-overview";
import { useGetAccountQuery, useGetUserAccountsQuery, useMonthlyExpensesQuery } from "@/store/api/accountApi";
import { useUser } from "@clerk/nextjs";
import Accounts from "./_components/accounts";

// Enhanced loading skeleton with proper visibility
const AccountSkeleton = () => (
  <Card className="relative overflow-hidden bg-white border border-gray-200 shadow-md rounded-2xl w-80 h-96">
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-gray-200/60 to-transparent"></div>
    <CardContent className="p-6 space-y-4">
      <div className="h-4 bg-gray-200 rounded-lg w-3/4"></div>
      <div className="h-8 bg-gray-200 rounded-lg w-1/2"></div>
      <div className="h-3 bg-gray-200 rounded-lg w-1/3"></div>
      <div className="space-y-2 mt-8">
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
    </CardContent>
    <style jsx>{`
      @keyframes shimmer {
        100% {
          transform: translateX(100%);
        }
      }
    `}</style>
  </Card>
);

// Premium loading component with staggered animations
const DashboardLoading = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Skeleton */}
      <div className="text-center space-y-4 py-8">
        <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl w-96 mx-auto animate-pulse"></div>
        <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-64 mx-auto animate-pulse delay-100"></div>
      </div>

      {/* Budget Progress Skeleton */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-sm opacity-20"></div>
        <Card className="relative backdrop-blur-sm bg-white/70 border-0 shadow-xl rounded-2xl animate-pulse">
          <CardContent className="p-8 space-y-4">
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/4"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-full"></div>
            <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/2"></div>
          </CardContent>
        </Card>
      </div>
      
      {/* Overview Skeleton */}
      <Card className="backdrop-blur-sm bg-white/70 border-0 shadow-xl rounded-2xl animate-pulse">
        <CardContent className="p-8 space-y-6">
          <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/3"></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-3" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/2"></div>
                <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-3/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Accounts Skeleton */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-48 animate-pulse"></div>
          <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-24 animate-pulse"></div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ animationDelay: `${i * 150}ms` }}>
              <AccountSkeleton />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Enhanced stats card component
const StatsCard = ({ title, value, icon: Icon, trend, color = "blue" }) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600 text-blue-600",
    green: "from-green-500 to-green-600 text-green-600",
    purple: "from-purple-500 to-purple-600 text-purple-600",
    orange: "from-orange-500 to-orange-600 text-orange-600"
  };

  return (
    <Card className="group relative overflow-hidden backdrop-blur-sm bg-white/60 hover:bg-white/80 border-0 shadow-lg hover:shadow-xl rounded-2xl transition-all duration-300 hover:scale-105">
      <div className={`absolute inset-0 bg-gradient-to-r ${colorClasses[color]} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
      <CardContent className="relative p-6">
        <div className="flex items-center justify-between mb-3">
          <div className={`p-2 rounded-xl bg-gradient-to-r ${colorClasses[color]} bg-opacity-10`}>
            <Icon className={`h-5 w-5 ${colorClasses[color].split(' ')[2]}`} />
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-xs font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {Math.abs(trend)}%
            </div>
          )}
        </div>
        <div className="space-y-1">
          <div className={`text-2xl font-bold ${colorClasses[color].split(' ')[2]}`}>
            {value}
          </div>
          <div className="text-sm text-gray-600 font-medium">{title}</div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main Dashboard Component
export default function DashboardPage() {
  const { user } = useUser();

  const { data: userAccounts = [], isLoading: accountsLoading, error: accountsError } = useGetUserAccountsQuery(
    user?.id,
    { 
      skip: !user?.id,
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true
    }
  );
  
  const { data: budgetData = {}, isLoading: budgetLoading } = useMonthlyExpensesQuery(user?.id, {
    skip: !user?.id,
    refetchOnMountOrArgChange: true
  });

  // Memoized calculations for better performance
  const dashboardStats = useMemo(() => {
    const totalBalance = userAccounts.reduce((sum, acc) => sum + parseFloat(acc.balance || 0), 0);
    const totalExpenses = budgetData?.totalExpense || 0;
    const budgetUtilization = budgetData?.budget ? (totalExpenses / budgetData.budget) * 100 : 0;
    const savingsRate = totalBalance > 0 ? ((totalBalance - totalExpenses) / totalBalance) * 100 : 0;

    return {
      totalBalance,
      totalExpenses,
      budgetUtilization,
      savingsRate,
      accountCount: userAccounts.length
    };
  }, [userAccounts, budgetData]);

  // Error handling
  if (accountsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full backdrop-blur-sm bg-white/80 border-0 shadow-xl rounded-2xl">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <Activity className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Unable to Load Dashboard</h3>
            <p className="text-gray-600">We're having trouble loading your financial data. Please try refreshing the page.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
            >
              Refresh Page
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (accountsLoading || budgetLoading) return <DashboardLoading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        {/* Enhanced Header Section */}
        <div className="text-center space-y-4 py-6 md:py-8">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl blur-lg opacity-20 animate-pulse"></div>
            <h1 className="relative text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Financial Dashboard
            </h1>
          </div>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            Welcome back, {user?.firstName || 'User'}! Track your wealth, manage your future with intelligent insights.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Sparkles className="h-4 w-4" />
            <span>Last updated: {new Date().toLocaleString()}</span>
          </div>
        </div>

        {/* Quick Stats Overview */}
        <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4">
          <Card className="group relative overflow-hidden bg-white hover:bg-gray-50 border border-gray-200 shadow-md hover:shadow-lg rounded-xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-xl bg-green-100">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-green-600">
                  <ArrowUpRight className="h-3 w-3" />
                  5.2%
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-green-600">
                  ${dashboardStats.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-gray-600 font-medium">Total Balance</div>
              </div>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden bg-white hover:bg-gray-50 border border-gray-200 shadow-md hover:shadow-lg rounded-xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-xl bg-blue-100">
                  <Wallet className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-blue-600">
                  {dashboardStats.accountCount}
                </div>
                <div className="text-sm text-gray-600 font-medium">Active Accounts</div>
              </div>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden bg-white hover:bg-gray-50 border border-gray-200 shadow-md hover:shadow-lg rounded-xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-xl bg-orange-100">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-red-600">
                  <ArrowDownRight className="h-3 w-3" />
                  2.1%
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-orange-600">
                  ${dashboardStats.totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-gray-600 font-medium">Monthly Expenses</div>
              </div>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden bg-white hover:bg-gray-50 border border-gray-200 shadow-md hover:shadow-lg rounded-xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-xl bg-purple-100">
                  <Target className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.min(dashboardStats.budgetUtilization, 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600 font-medium">Budget Usage</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Budget Progress */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-sm opacity-20"></div>
          <Card className="relative backdrop-blur-sm bg-white/70 border-0 shadow-xl rounded-2xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600"></div>
            <CardContent className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Budget Progress</h3>
              </div>
              <BudgetProgress 
                initialBudget={budgetData?.budget ?? 0}
                currentExpenses={budgetData?.totalExpense ?? 0}
                accountId={budgetData?.accountId}
              />
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Dashboard Overview */}
        <Card className="backdrop-blur-sm bg-white/70 border-0 shadow-xl rounded-2xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600"></div>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl md:text-2xl font-semibold text-gray-800 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              Financial Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <DashboardOverview accounts={userAccounts} />
          </CardContent>
        </Card>

        {/* Enhanced Accounts Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
                <Wallet className="h-5 w-5 text-white" />
              </div>
              Your Accounts
            </h2>
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-500 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border">
                {userAccounts.length} {userAccounts.length === 1 ? 'Account' : 'Accounts'}
              </div>
              <div className="text-sm text-gray-500 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border">
                ${dashboardStats.totalBalance.toLocaleString()} Total
              </div>
            </div>
          </div>

          {/* Enhanced Accounts Grid - Matching Your Design */}
          <div className="flex flex-wrap gap-6">
            {/* Enhanced Add New Account Card - Matching Your Design */}
            <CreateAccountDrawer>
              <Card className="group relative overflow-hidden hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer border-2 border-dashed border-gray-300 bg-white hover:bg-gray-50 rounded-2xl w-80 h-96">
                <CardContent className="flex flex-col items-center justify-center text-center p-8 h-full">
                  <div className="relative mb-6">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-2xl">
                      <Plus className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-lg font-semibold text-gray-800">Add New Account</p>
                    <p className="text-sm text-gray-600 leading-relaxed">Create a new financial account to track your money</p>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-2 justify-center">
                    <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                      <PiggyBank className="h-3 w-3" />
                      Savings
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                      <CreditCard className="h-3 w-3" />
                      Current
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CreateAccountDrawer>
            
            {/* Existing Accounts with Enhanced Suspense */}
            <Suspense fallback={
              <>
                {[...Array(Math.max(2, userAccounts.length || 4))].map((_, i) => (
                  <div key={i} style={{ animationDelay: `${i * 100}ms` }}>
                    <AccountSkeleton />
                  </div>
                ))}
              </>
            }>
              <Accounts />
            </Suspense>
          </div>
        </div>

        {/* Enhanced Footer Stats */}
        <div className="mt-8 md:mt-12 pt-8 border-t border-gray-200/50">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Financial Summary</h3>
            <p className="text-sm text-gray-500">Your complete financial overview at a glance</p>
          </div>
          <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-white border border-gray-200 shadow-md hover:shadow-lg rounded-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-xl bg-green-100">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-green-600">
                    ${dashboardStats.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">Total Assets</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-md hover:shadow-lg rounded-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-xl bg-orange-100">
                    <TrendingUp className="h-5 w-5 text-orange-600" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-orange-600">
                    ${dashboardStats.totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">Monthly Spending</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-md hover:shadow-lg rounded-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-xl bg-purple-100">
                    <Target className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-purple-600">
                    ${Math.max(0, (budgetData?.budget || 0) - dashboardStats.totalExpenses).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">Budget Remaining</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-md hover:shadow-lg rounded-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-xl bg-blue-100">
                    <PiggyBank className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.max(0, dashboardStats.savingsRate).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600 font-medium">Savings Rate</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}