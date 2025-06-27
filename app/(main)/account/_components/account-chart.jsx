"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import { format, subDays, startOfDay, endOfDay, parseISO } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";

const DATE_RANGES = {
  "7D": { label: "Last 7 Days", days: 7 },
  "1M": { label: "Last Month", days: 30 },
  "3M": { label: "Last 3 Months", days: 90 },
  "6M": { label: "Last 6 Months", days: 180 },
  ALL: { label: "All Time", days: null },
};

const CHART_TYPES = {
  BAR: "bar",
  LINE: "line",
  AREA: "area",
};

export function AccountChart({ transactions = [] }) {
  const [dateRange, setDateRange] = useState("1M");
  const [chartType, setChartType] = useState(CHART_TYPES.BAR);

  const filteredData = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

    const range = DATE_RANGES[dateRange];
    const now = new Date();
    const startDate = range.days
      ? startOfDay(subDays(now, range.days))
      : startOfDay(new Date(0));

    // Filter transactions within date range
    const filtered = transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return transactionDate >= startDate && transactionDate <= endOfDay(now);
    });

    // Group transactions by date
    const grouped = filtered.reduce((acc, transaction) => {
      const date = format(parseISO(transaction.date), "MMM dd");
      if (!acc[date]) {
        acc[date] = { date, income: 0, expense: 0, net: 0 };
      }
      
      const amount = parseFloat(transaction.amount);
      if (transaction.type.toLowerCase() === "income") {
        acc[date].income += amount;
      } else {
        acc[date].expense += amount;
      }
      
      acc[date].net = acc[date].income - acc[date].expense;
      return acc;
    }, {});

    // Convert to array and sort by date
    return Object.values(grouped).sort((a, b) => {
      const dateA = new Date(a.date + ", " + new Date().getFullYear());
      const dateB = new Date(b.date + ", " + new Date().getFullYear());
      return dateA - dateB;
    });
  }, [transactions, dateRange]);

  // Calculate totals and statistics
  const stats = useMemo(() => {
    const totals = filteredData.reduce(
      (acc, day) => ({
        income: acc.income + day.income,
        expense: acc.expense + day.expense,
        transactionCount: acc.transactionCount + 1,
      }),
      { income: 0, expense: 0, transactionCount: 0 }
    );

    const net = totals.income - totals.expense;
    const avgDaily = filteredData.length > 0 ? net / filteredData.length : 0;
    
    // Calculate trend (comparing first half vs second half of period)
    const midPoint = Math.floor(filteredData.length / 2);
    const firstHalf = filteredData.slice(0, midPoint);
    const secondHalf = filteredData.slice(midPoint);
    
    const firstHalfAvg = firstHalf.length > 0 
      ? firstHalf.reduce((sum, day) => sum + day.net, 0) / firstHalf.length 
      : 0;
    const secondHalfAvg = secondHalf.length > 0 
      ? secondHalf.reduce((sum, day) => sum + day.net, 0) / secondHalf.length 
      : 0;
    
    const trend = secondHalfAvg > firstHalfAvg ? "up" : "down";
    const trendPercentage = firstHalfAvg !== 0 
      ? Math.abs(((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100) 
      : 0;

    return {
      ...totals,
      net,
      avgDaily,
      trend,
      trendPercentage,
    };
  }, [filteredData]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg p-3">
          <p className="font-medium text-foreground">{label}</p>
          {payload.map((entry, index) => (
            <p
              key={index}
              className="text-sm"
              style={{ color: entry.color }}
            >
              {entry.name}: ${entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const commonProps = {
      data: filteredData,
      margin: { top: 10, right: 30, left: 20, bottom: 5 },
    };

    switch (chartType) {
      case CHART_TYPES.LINE:
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="date" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              className="text-muted-foreground"
            />
            <YAxis 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
              className="text-muted-foreground"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="income"
              name="Income"
              stroke="#22c55e"
              strokeWidth={3}
              dot={{ fill: "#22c55e", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#22c55e", strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="expense"
              name="Expense"
              stroke="#ef4444"
              strokeWidth={3}
              dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#ef4444", strokeWidth: 2 }}
            />
          </LineChart>
        );

      case CHART_TYPES.AREA:
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="date" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              className="text-muted-foreground"
            />
            <YAxis 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
              className="text-muted-foreground"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="income"
              name="Income"
              stroke="#22c55e"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#incomeGradient)"
            />
            <Area
              type="monotone"
              dataKey="expense"
              name="Expense"
              stroke="#ef4444"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#expenseGradient)"
            />
          </AreaChart>
        );

      default:
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} className="opacity-30" />
            <XAxis
              dataKey="date"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              className="text-muted-foreground"
            />
            <YAxis
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
              className="text-muted-foreground"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey="income"
              name="Income"
              fill="#22c55e"
              radius={[4, 4, 0, 0]}
              className="drop-shadow-sm"
            />
            <Bar
              dataKey="expense"
              name="Expense"
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
              className="drop-shadow-sm"
            />
          </BarChart>
        );
    }
  };

  return (
    <Card className="w-full shadow-lg border-0 bg-gradient-to-br from-background to-muted/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold">
              Transaction Overview
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Financial activity for {DATE_RANGES[dateRange].label.toLowerCase()}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={chartType} onValueChange={setChartType}>
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={CHART_TYPES.BAR}>Bar</SelectItem>
              <SelectItem value={CHART_TYPES.LINE}>Line</SelectItem>
              <SelectItem value={CHART_TYPES.AREA}>Area</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(DATE_RANGES).map(([key, { label }]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        {/* Stats Cards */}
        <div className="grid gri-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/30 p-4 rounded-xl border border-green-200/50 dark:border-green-800/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">
                  Total Income
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ${stats.income.toFixed(2)}
                </p>
              </div>
              <div className="p-2 bg-green-200 dark:bg-green-800 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/30 p-4 rounded-xl border border-red-200/50 dark:border-red-800/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700 dark:text-red-300">
                  Total Expenses
                </p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  ${stats.expense.toFixed(2)}
                </p>
              </div>
              <div className="p-2 bg-red-200 dark:bg-red-800 rounded-lg">
                <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>

          <div className={`bg-gradient-to-br p-4 rounded-xl border ${
            stats.net >= 0 
              ? 'from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30 border-blue-200/50 dark:border-blue-800/50' 
              : 'from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/30 border-orange-200/50 dark:border-orange-800/50'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  stats.net >= 0 
                    ? 'text-blue-700 dark:text-blue-300' 
                    : 'text-orange-700 dark:text-orange-300'
                }`}>
                  Net Balance
                </p>
                <p className={`text-2xl font-bold ${
                  stats.net >= 0 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-orange-600 dark:text-orange-400'
                }`}>
                  ${stats.net.toFixed(2)}
                </p>
              </div>
              <div className={`p-2 rounded-lg ${
                stats.net >= 0 
                  ? 'bg-blue-200 dark:bg-blue-800' 
                  : 'bg-orange-200 dark:bg-orange-800'
              }`}>
                <DollarSign className={`h-5 w-5 ${
                  stats.net >= 0 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-orange-600 dark:text-orange-400'
                }`} />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/30 p-4 rounded-xl border border-purple-200/50 dark:border-purple-800/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  Daily Average
                </p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  ${stats.avgDaily.toFixed(2)}
                </p>
              </div>
              <Badge 
                variant={stats.trend === "up" ? "default" : "secondary"}
                className={`${
                  stats.trend === "up" 
                    ? "bg-green-100 text-green-700 hover:bg-green-200" 
                    : "bg-red-100 text-red-700 hover:bg-red-200"
                }`}
              >
                {stats.trend === "up" ? "↗" : "↘"} {stats.trendPercentage.toFixed(1)}%
              </Badge>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[400px] w-full">
          {filteredData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Activity className="h-12 w-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">No transactions found</p>
              <p className="text-sm">
                {dateRange === "ALL" 
                  ? "No transactions available" 
                  : `No transactions in the ${DATE_RANGES[dateRange].label.toLowerCase()}`
                }
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}