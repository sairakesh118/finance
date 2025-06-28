"use client";

import { ArrowUpRight, ArrowDownRight, Star, Wallet, PiggyBank, CreditCard, Building, TrendingUp, TrendingDown, Calendar, DollarSign } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  useUpdateDefaultAccountMutation,
} from "@/store/api/accountApi";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

// Enhanced account type configurations with better gradients and effects
const getAccountTypeConfig = (type) => {
  const configs = {
    savings: {
      icon: PiggyBank,
      bgGradient: "from-emerald-400 via-green-500 to-teal-600",
      textColor: "text-emerald-700",
      bgColor: "bg-gradient-to-br from-emerald-50 to-green-100",
      borderColor: "border-emerald-300",
      shadowColor: "shadow-emerald-500/20",
      accentColor: "emerald"
    },
    current: {
      icon: Wallet,
      bgGradient: "from-blue-400 via-cyan-500 to-indigo-600",
      textColor: "text-blue-700",
      bgColor: "bg-gradient-to-br from-blue-50 to-cyan-100",
      borderColor: "border-blue-300",
      shadowColor: "shadow-blue-500/20",
      accentColor: "blue"
    },
    credit: {
      icon: CreditCard,
      bgGradient: "from-purple-400 via-pink-500 to-rose-600",
      textColor: "text-purple-700",
      bgColor: "bg-gradient-to-br from-purple-50 to-pink-100",
      borderColor: "border-purple-300",
      shadowColor: "shadow-purple-500/20",
      accentColor: "purple"
    },
    business: {
      icon: Building,
      bgGradient: "from-orange-400 via-red-500 to-pink-600",
      textColor: "text-orange-700",
      bgColor: "bg-gradient-to-br from-orange-50 to-red-100",
      borderColor: "border-orange-300",
      shadowColor: "shadow-orange-500/20",
      accentColor: "orange"
    }
  };
  
  return configs[type?.toLowerCase()] || configs.current;
};

// Sample account data based on your provided structure
const sampleAccount = {
  balance: "1000.0",
  budget: null,
  clerkUserId: "user_2yUR1CM4lBekOMmst8GRAeKRDPH",
  createdAt: "2025-06-17T09:09:06.569000",
  id: "685130b286d04e484ef81253",
  isDefault: false,
  name: "SAIRAKESH GUNDAPANENI",
  transactions: [
    {
      amount: "100.0",
      category: "Business",
      createdAt: "2025-06-17T09:10:07.982000",
      date: "2025-06-17T09:09:48.716000",
      description: null,
      id: "0e61c4c4-d30e-4a15-9b79-969c92a7c7f8",
      isRecurring: false,
      lastProcessed: "2025-06-17T09:10:07.982000",
      nextRecurringDate: null,
      receiptUrl: null,
      recurringInterval: null,
      type: "income",
      updatedAt: "2025-06-17T09:10:07.982000"
    }
  ],
  type: "CURRENT",
  updatedAt: "2025-06-18T09:55:53.221000"
};

export function AccountCard({ account = sampleAccount, refetch }) {
  console.log(account);
  const { name, type, balance, id, isDefault, transactions = [] } = account;
  const [defaultToggle, setDefaultToggle] = useState(isDefault);
  const { user } = useUser();

  const [updateAccount, { isLoading: isUpdating }] = useUpdateDefaultAccountMutation();
  const typeConfig = getAccountTypeConfig(type);
  const IconComponent = typeConfig.icon;

  // Calculate transaction statistics
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
  
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

  const recentTransaction = transactions.length > 0 ? transactions[0] : null;

  // Sync local state with prop when it changes from refetch
  useEffect(() => {
    setDefaultToggle(isDefault);
  }, [isDefault]);

  const handleDefaultChange = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (defaultToggle) {
      toast.warning("At least one account must be default");
      return;
    }

    try {
      await updateAccount({
        ...account,
        isDefault: true,
        clerkUserId: user?.id,
      }).unwrap();

      toast.success("Set as default account");
      
      if (refetch) {
        await refetch();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update default account");
    }
  };

  const balanceAmount = parseFloat(balance || 0);
  const isPositive = balanceAmount >= 0;
  const formattedBalance = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(Math.abs(balanceAmount));

  return (
    <div className="group perspective-1000">
      <Card className={`
        relative overflow-hidden transition-all duration-500 ease-out
        hover:shadow-2xl hover:shadow-blue-500/10 hover:scale-[1.02] hover:-translate-y-2
        ${typeConfig.borderColor} border-2 rounded-3xl
        ${typeConfig.bgColor} backdrop-blur-xl
        transform-gpu will-change-transform
        before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent before:opacity-0 before:transition-opacity before:duration-500
        hover:before:opacity-100
      `}>
        
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] animate-pulse"></div>
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-xl animate-bounce"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-white/20 to-transparent rounded-full blur-lg animate-pulse delay-1000"></div>
        </div>

        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl"></div>

        {/* Default Badge with enhanced styling - positioned to avoid overlap */}
        {defaultToggle && (
          <div className="absolute top-4 left-4 z-20">
            <div className={`
              bg-gradient-to-r ${typeConfig.bgGradient} 
              text-white px-3 py-1.5 rounded-full text-xs font-semibold
              flex items-center gap-1.5 shadow-xl ${typeConfig.shadowColor}
              animate-pulse
            `}>
              <Star className="h-3 w-3 fill-current animate-spin" style={{ animationDuration: '3s' }} />
              Default
            </div>
          </div>
        )}

        {/* Header with enhanced icon and switch */}
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4 pt-6 relative z-10">
          <div className="flex items-center space-x-4">
            <div className={`
              p-4 rounded-2xl bg-gradient-to-br ${typeConfig.bgGradient} 
              shadow-2xl ${typeConfig.shadowColor} group-hover:shadow-3xl transition-all duration-500
              relative overflow-hidden
              before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/30 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300
              hover:before:opacity-100
            `}>
              <IconComponent className="h-6 w-6 text-white relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl font-bold text-gray-800 mb-1">
                {name.split(' ').slice(0, 2).join(' ')}
              </CardTitle>
              <div className="flex items-center gap-2">
                <p className={`text-sm ${typeConfig.textColor} font-semibold`}>
                  {type && type[0].toUpperCase() + type.slice(1).toLowerCase()} Account
                </p>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  {new Date(account.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center space-y-2 ml-4 flex-shrink-0">
            <Switch 
              checked={defaultToggle} 
              onClick={handleDefaultChange}
              disabled={isUpdating}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-purple-500 scale-110"
            />
            <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
              {isUpdating ? "Updating..." : "Set Default"}
            </span>
          </div>
        </CardHeader>

        {/* Clickable Content Area */}
        <Link href={`/account/${id}`} className="block">
          <CardContent className="relative z-10 pb-6 space-y-6">
            {/* Enhanced Balance Display */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <DollarSign className={`h-8 w-8 ${isPositive ? 'text-green-600' : 'text-red-600'}`} />
                <div className={`
                  text-4xl font-black tracking-tight
                  ${isPositive ? 'text-green-600' : 'text-red-600'}
                  bg-gradient-to-r ${isPositive ? 'from-green-600 to-emerald-600' : 'from-red-600 to-rose-600'} 
                  bg-clip-text text-transparent
                `}>
                  {formattedBalance}
                </div>
              </div>
              {!isPositive && (
                <div className="inline-flex items-center gap-1 text-sm text-red-500 font-semibold bg-red-50 px-3 py-1 rounded-full">
                  <TrendingDown className="h-4 w-4" />
                  Overdrawn
                </div>
              )}
            </div>

            {/* Enhanced Balance Visualization */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 font-medium">Account Health</span>
                <span className={`font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositive ? 'Excellent' : 'Needs Attention'}
                </span>
              </div>
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`
                      h-full rounded-full transition-all duration-1000 ease-out
                      ${isPositive 
                        ? `bg-gradient-to-r ${typeConfig.bgGradient}` 
                        : 'bg-gradient-to-r from-red-400 to-red-600'
                      }
                      relative overflow-hidden
                    `}
                    style={{ 
                      width: isPositive 
                        ? `${Math.min((balanceAmount / 10000) * 100, 100)}%`
                        : '100%'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Insights */}
            {recentTransaction && (
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 space-y-3">
                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Recent Activity
                </h4>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`
                      p-2 rounded-lg 
                      ${recentTransaction.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}
                    `}>
                      {recentTransaction.type === 'income' ? 
                        <ArrowUpRight className="h-4 w-4" /> : 
                        <ArrowDownRight className="h-4 w-4" />
                      }
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{recentTransaction.category}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(recentTransaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className={`
                    font-bold text-lg
                    ${recentTransaction.type === 'income' ? 'text-green-600' : 'text-red-600'}
                  `}>
                    {recentTransaction.type === 'income' ? '+' : '-'}${recentTransaction.amount}
                  </div>
                </div>
              </div>
            )}
          </CardContent>

          {/* Enhanced Footer with Better Stats */}
          <CardFooter className="flex justify-between items-center text-sm border-t border-white/20 pt-4 relative z-10 bg-white/10 backdrop-blur-sm">
            <div className="flex items-center space-x-2 text-green-600">
              <div className="p-1.5 bg-green-100 rounded-lg">
                <ArrowUpRight className="h-4 w-4" />
              </div>
              <div>
                <span className="font-semibold">Income</span>
                <p className="text-xs text-gray-500">${totalIncome.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="w-px h-8 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
            
            <div className="flex items-center space-x-2 text-red-500">
              <div className="p-1.5 bg-red-100 rounded-lg">
                <ArrowDownRight className="h-4 w-4" />
              </div>
              <div>
                <span className="font-semibold">Expenses</span>
                <p className="text-xs text-gray-500">${totalExpense.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="w-px h-8 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
            
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="p-1.5 bg-gray-100 rounded-lg">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <span className="font-semibold">{transactions.length}</span>
                <p className="text-xs text-gray-500">Transactions</p>
              </div>
            </div>
          </CardFooter>
        </Link>

        {/* Enhanced Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-3xl pointer-events-none"></div>
        
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
      </Card>
    </div>
  );
}