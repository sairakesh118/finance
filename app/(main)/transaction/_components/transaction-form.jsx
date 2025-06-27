"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Loader2, Upload, X, DollarSign, Receipt, Repeat, TrendingUp, TrendingDown, Eye, EyeOff, Sparkles, CreditCard, Wallet } from "lucide-react";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import {
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
} from "@/store/api/transactionApi";
import { useGetUserAccountsQuery } from "@/store/api/accountApi";
import { useUser } from "@clerk/nextjs";

// Transaction schema with proper handling of recurringInterval
const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.string().min(1, "Amount is required").refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
    "Amount must be a positive number"
  ),
  description: z.string().optional(),
  date: z.date({
    required_error: "Date is required",
  }),
  category: z.string().min(1, "Category is required"),
  accountName: z.string().min(1, "Account is required"),
  receiptUrl: z.string().optional(),
  isRecurring: z.boolean().default(false),
  recurringInterval: z.enum(["none", "daily", "weekly", "monthly", "yearly"]).default("none"),
}).refine(
  (data) => {
    if (data.isRecurring && data.recurringInterval === "none") {
      return false;
    }
    return true;
  },
  {
    message: "Please select a recurring interval",
    path: ["recurringInterval"],
  }
);

// Default categories
const defaultCategories = {
  income: [
    "💰 Salary",
    "💼 Freelance",
    "🏢 Business",
    "📈 Investment",
    "🎁 Gift",
    "💸 Other Income"
  ],
  expense: [
    "🍽️ Food & Dining",
    "🚗 Transportation",
    "🛍️ Shopping",
    "🎬 Entertainment",
    "💡 Bills & Utilities",
    "🏥 Healthcare",
    "📚 Education",
    "✈️ Travel",
    "💳 Other Expense"
  ]
};

export function AddTransactionForm({ editMode = false, initialData = null }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const { user, isLoaded } = useUser();
  
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  // Get user accounts
  const { data: accounts = [], isLoading: accountsLoading } = useGetUserAccountsQuery(
    user?.id,
    { skip: !user?.id }
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
    trigger,
  } = useForm({
    resolver: zodResolver(transactionSchema),
    mode: "onChange",
    defaultValues: editMode && initialData
      ? {
          type: initialData.type,
          amount: initialData.amount.toString(),
          description: initialData.description || "",
          accountName: initialData.accountName,
          category: initialData.category,
          date: new Date(initialData.date),
          isRecurring: initialData.isRecurring || false,
          recurringInterval: initialData.isRecurring && initialData.recurringInterval 
            ? initialData.recurringInterval 
            : "none",
          receiptUrl: initialData.receiptUrl || "",
        }
      : {
          type: "expense",
          amount: "",
          description: "",
          accountName: "",
          category: "",
          date: new Date(),
          isRecurring: false,
          recurringInterval: "none",
          receiptUrl: "",
        },
  });

  const [createTransaction, { isLoading: creating }] = useCreateTransactionMutation();
  const [updateTransaction, { isLoading: updating }] = useUpdateTransactionMutation();

  // Watch form values
  const type = watch("type");
  const isRecurring = watch("isRecurring");
  const date = watch("date");
  const selectedAccountName = watch("accountName");
  const amount = watch("amount");
  const category = watch("category");
  const description = watch("description");
  const recurringInterval = watch("recurringInterval");

  // Handle recurring interval changes
  useEffect(() => {
    if (!isRecurring) {
      setValue("recurringInterval", "none");
    } else if (recurringInterval === "none") {
      setValue("recurringInterval", "monthly");
    }
    trigger("recurringInterval");
  }, [isRecurring, setValue, trigger, recurringInterval]);

  // Set default account when accounts load
  useEffect(() => {
    if (accounts.length > 0 && !editMode && !selectedAccountName) {
      const defaultAccountName = typeof accounts[0] === 'string' ? accounts[0] : accounts[0]?.name;
      if (defaultAccountName) {
        setValue("accountName", defaultAccountName);
        trigger("accountName");
      }
    }
  }, [accounts, editMode, selectedAccountName, setValue, trigger]);

  // Handle receipt upload
  const handleReceiptUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setReceiptFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setReceiptPreview(e.target.result);
      };
      reader.readAsDataURL(file);
      setValue("receiptUrl", URL.createObjectURL(file));
    }
  };

  const removeReceipt = () => {
    setReceiptFile(null);
    setReceiptPreview(null);
    setValue("receiptUrl", "");
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return "Pick a date";
    return format(date, "EEEE, MMMM do, yyyy");
  };

  // Get account icon based on account name
  const getAccountIcon = (accountName) => {
    if (accountName?.toLowerCase().includes('credit')) return <CreditCard className="w-4 h-4" />;
    if (accountName?.toLowerCase().includes('saving')) return <Wallet className="w-4 h-4" />;
    return <DollarSign className="w-4 h-4" />;
  };

  // Get account balance if available
  const getAccountBalance = (accountName) => {
    const account = accounts.find(acc => 
      (typeof acc === 'string' ? acc : acc.name) === accountName
    );
    return account && typeof account === 'object' ? account.balance : null;
  };

  // Submit function with proper recurringInterval handling
  const onSubmit = async (data) => {
    console.log("=== FORM SUBMISSION STARTED ===");
    console.log("Form data received:", data);
    
    // Validate user authentication
    if (!user?.id) {
      console.error("User not authenticated");
      toast.error("User not authenticated");
      return;
    }

    // Validate account selection
    if (!data.accountName) {
      console.error("No account selected");
      toast.error("Please select an account");
      return;
    }

    // Prepare transaction data with proper recurringInterval handling
    const transactionData = {
      type: data.type,
      amount: parseFloat(data.amount),
      description: data.description || null,
      date: data.date.toISOString(),
      category: data.category,
      receiptUrl: data.receiptUrl || null,
      isRecurring: data.isRecurring,
      recurringInterval: data.isRecurring && data.recurringInterval !== "none" 
        ? data.recurringInterval 
        : null,
    };

    console.log("Prepared transaction data:", transactionData);

    try {
      console.log("Attempting to create/update transaction...");
      
      const result = editMode
        ? await updateTransaction({
            transactionData,
            clerkId: user.id,
            accountName: data.accountName,
          }).unwrap()
        : await createTransaction({
            transactionData,
            clerkId: user.id,
            accountName: data.accountName,
          }).unwrap();

      console.log("Transaction result:", result);

      toast.success(
        editMode
          ? "Transaction updated successfully"
          : "Transaction created successfully"
      );

      if (!editMode) {
        reset();
        setReceiptFile(null);
        setReceiptPreview(null);
      }
    
    } catch (err) {
      console.error("Transaction error:", err);
      toast.error(
        err?.data?.message || 
        `Failed to ${editMode ? "update" : "create"} transaction`
      );
    }
  };

  // Loading state
  if (!isLoaded || accountsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-indigo-600" />
          <p className="text-slate-700 font-medium">
            {!isLoaded ? "Loading user..." : "Loading accounts..."}
          </p>
        </div>
      </div>
    );
  }

  const filteredCategories = defaultCategories[type] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header with animated gradient */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-white/20 mb-6">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <span className="text-sm font-medium text-slate-700">Smart Finance Tracker</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 bg-clip-text text-transparent mb-2">
            {editMode ? "Edit Transaction" : "Add Transaction"}
          </h1>
          <p className="text-slate-600">
            {editMode 
              ? "Update your transaction details below" 
              : "Track your finances with style and precision"
            }
          </p>
        </div>

        {/* Main Card with glassmorphism effect */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Transaction Type Toggle */}
          <div className="p-6 border-b border-slate-200/50">
            <div className="flex bg-slate-100/50 rounded-2xl p-1 mb-4">
              <button
                type="button"
                onClick={() => {
                  setValue("type", "expense");
                  setValue("category", "");
                  trigger("type");
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                  type === "expense"
                    ? "bg-red-500 text-white shadow-lg transform scale-105"
                    : "text-slate-600 hover:bg-white/50"
                }`}
              >
                <TrendingDown className="w-4 h-4" />
                Expense
              </button>
              <button
                type="button"
                onClick={() => {
                  setValue("type", "income");
                  setValue("category", "");
                  trigger("type");
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                  type === "income"
                    ? "bg-green-500 text-white shadow-lg transform scale-105"
                    : "text-slate-600 hover:bg-white/50"
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Income
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Amount Input with enhanced styling */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Amount
              </label>
              <div className="relative">
                <input
                  {...register("amount")}
                  type="number"
                  step="0.01"
                  className={`w-full text-3xl font-bold bg-slate-50/50 border-2 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 transition-all duration-300 ${
                    errors.amount
                      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                      : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"
                  }`}
                  placeholder="0.00"
                />
                <div className="absolute right-6 top-1/2 transform -translate-y-1/2 text-2xl font-bold text-slate-400">
                  $
                </div>
              </div>
              {errors.amount && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <X className="w-3 h-3" />
                  {errors.amount.message}
                </p>
              )}
            </div>

            {/* Description with floating label effect */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Description</label>
              <textarea
                {...register("description")}
                className="w-full bg-slate-50/50 border-2 border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 resize-none"
                placeholder="What was this transaction for?"
                rows="3"
              />
              {errors.description && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <X className="w-3 h-3" />
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Account Selection with visual indicators */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Account</label>
              
              {accounts.length > 0 ? (
                <div className="grid gap-3">
                  {accounts.map((account, index) => {
                    const accountName = typeof account === 'string' ? account : account.name;
                    const isDefault = typeof account === 'object' ? account.isDefault : index === 0;
                    const balance = typeof account === 'object' ? account.balance : null;
                    
                    return (
                      <button
                        key={accountName}
                        type="button"
                        onClick={() => {
                          setValue("accountName", accountName);
                          trigger("accountName");
                        }}
                        className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-300 ${
                          selectedAccountName === accountName
                            ? "border-indigo-500 bg-indigo-50 shadow-lg transform scale-105"
                            : "border-slate-200 bg-white/50 hover:border-slate-300 hover:bg-white/80"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl ${
                            selectedAccountName === accountName ? "bg-indigo-100" : "bg-slate-100"
                          }`}>
                            {getAccountIcon(accountName)}
                          </div>
                          <div className="text-left">
                            <div className="font-semibold text-slate-900">{accountName}</div>
                            {balance !== null && (
                              <div className="text-sm text-slate-500">
                                Balance: ${Math.abs(balance).toLocaleString()}
                                {balance < 0 && " (Credit)"}
                              </div>
                            )}
                          </div>
                        </div>
                        {isDefault && (
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                            Default
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-sm text-amber-600 bg-amber-50 p-4 rounded-2xl border border-amber-200">
                  No accounts found. Please create an account first.
                </div>
              )}
              
              {errors.accountName && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <X className="w-3 h-3" />
                  {errors.accountName.message}
                </p>
              )}
            </div>

            {/* Category Selection with emojis */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Category</label>
              <div className="grid grid-cols-2 gap-2">
                {filteredCategories.map((categoryOption) => (
                  <button
                    key={categoryOption}
                    type="button"
                    onClick={() => {
                      setValue("category", categoryOption);
                      trigger("category");
                    }}
                    className={`p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                      category === categoryOption
                        ? "border-indigo-500 bg-indigo-50 text-indigo-900 shadow-md transform scale-105"
                        : "border-slate-200 bg-white/50 hover:border-slate-300 hover:bg-white/80"
                    }`}
                  >
                    <span className="text-sm font-medium">{categoryOption}</span>
                  </button>
                ))}
              </div>
              {errors.category && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <X className="w-3 h-3" />
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Date Selection */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date
              </label>
              <button
                type="button"
                onClick={() => setShowCalendar(!showCalendar)}
                className={`w-full flex items-center justify-between p-4 bg-slate-50/50 border-2 rounded-2xl hover:border-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 ${
                  errors.date ? "border-red-300" : "border-slate-200"
                }`}
              >
                <span className="font-medium text-slate-900">{formatDate(date)}</span>
                <Calendar className="w-5 h-5 text-slate-400" />
              </button>
              {errors.date && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <X className="w-3 h-3" />
                  {errors.date.message}
                </p>
              )}
            </div>

            {/* Advanced Options Toggle */}
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200"
            >
              {showAdvanced ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showAdvanced ? "Hide" : "Show"} Advanced Options
            </button>

            {/* Advanced Options */}
            {showAdvanced && (
              <div className="space-y-6 p-6 bg-slate-50/30 rounded-2xl border border-slate-200/50">
                {/* Receipt Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Receipt className="w-4 h-4" />
                    Receipt
                  </label>
                  <div className="flex gap-4">
                    <input
                      {...register("receiptUrl")}
                      type="text"
                      className="flex-1 bg-white border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300"
                      placeholder="Receipt URL or upload image"
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById("receipt-upload").click()}
                      className="px-6 py-3 bg-slate-100 hover:bg-slate-200 border-2 border-slate-200 rounded-xl transition-all duration-200"
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    id="receipt-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleReceiptUpload}
                    className="hidden"
                  />
                  {receiptPreview && (
                    <div className="relative inline-block">
                      <img
                        src={receiptPreview}
                        alt="Receipt preview"
                        className="h-24 w-24 object-cover rounded-xl border-2 border-slate-200"
                      />
                      <button
                        type="button"
                        onClick={removeReceipt}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors duration-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  {errors.receiptUrl && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <X className="w-3 h-3" />
                      {errors.receiptUrl.message}
                    </p>
                  )}
                </div>

                {/* Recurring Transaction */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setValue("isRecurring", !isRecurring);
                        trigger("isRecurring");
                      }}
                      className={`w-12 h-6 rounded-full transition-all duration-300 ${
                        isRecurring ? "bg-indigo-500" : "bg-slate-300"
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                        isRecurring ? "translate-x-6" : "translate-x-0.5"
                      }`} />
                    </button>
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Repeat className="w-4 h-4" />
                      Recurring Transaction
                    </label>
                  </div>
                  
                  {isRecurring && (
                    <div className="flex gap-2">
                      {["daily", "weekly", "monthly", "yearly"].map((interval) => (
                        <button
                          key={interval}
                          type="button"
                          onClick={() => {
                            setValue("recurringInterval", interval);
                            trigger("recurringInterval");
                          }}
                          className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                            recurringInterval === interval
                              ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                              : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                        >
                          {interval.charAt(0).toUpperCase() + interval.slice(1)}
                        </button>
                      ))}
                    </div>
                  )}
                  {errors.recurringInterval && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <X className="w-3 h-3" />
                      {errors.recurringInterval.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => router.back()}
                disabled={creating || updating || isSubmitting}
                className="flex-1 py-4 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={creating || updating || isSubmitting || accounts.length === 0}
                className="flex-1 py-4 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {creating || updating || isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {editMode ? "Updating..." : "Creating..."}
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    {editMode ? "Update Transaction" : "Create Transaction"}
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-slate-500 text-sm">
          <p>Secure • Fast • Beautiful</p>
        </div>
      </div>
    </div>
  );
}