'use client';
import React, { useState, useEffect } from 'react';
import { AlertCircle, DollarSign, Calendar, Tag, FileText, RefreshCw, Save, Loader2, TrendingUp, TrendingDown, ArrowLeft } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useGetTransactionQuery, useUpdateTransactionMutation } from '@/store/api/transactionApi';

const EditTransactionForm = () => {
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    description: '',
    date: '',
    category: '',
    isRecurring: false
  });

  const searchParams = useSearchParams();
  const transactionId = searchParams.get('id');
  const accountName = searchParams.get('accountName');
  const { user } = useUser();

  const { data, isLoading, error: transactionError } = useGetTransactionQuery({
    clerkId: user?.id,
    accountName: accountName,
    transactionId: transactionId
  });

  const [updateTransaction, { isLoading: isUpdating }] = useUpdateTransactionMutation();

  const accountId = data?.id;

  // Updated categories with emojis and type separation
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

  // Fetch and populate form data
  useEffect(() => {
    if (data && data.transaction) {
      const transaction = data.transaction;
      setFormData({
        type: transaction.type || 'expense',
        amount: transaction.amount?.toString() || '',
        description: transaction.description || '',
        date: transaction.date ? transaction.date.split('T')[0] : '',
        category: transaction.category || '',
        isRecurring: transaction.isRecurring || false
      });
    }
  }, [data]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear category when type changes
    if (name === 'type') {
      setFormData(prev => ({
        ...prev,
        category: ''
      }));
    }
    
    // Clear messages on input change
    if (error) setError(null);
    if (successMessage) setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.amount || !formData.date || !formData.category) {
      setError('Please fill in all required fields');
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    try {
      // Prepare transaction data for update
      const transactionUpdateData = {
        type: formData.type,
        amount: parseFloat(formData.amount),
        description: formData.description || null,
        date: new Date(formData.date).toISOString(),
        category: formData.category,
        isRecurring: formData.isRecurring
      };
      console.log(transactionUpdateData,transactionId,accountId);
      await updateTransaction({
        transactionId: transactionId,
        transactionData: transactionUpdateData,
        accountId: accountId
      }).unwrap();

      setSuccessMessage('Transaction updated successfully!');
      
      // Auto-redirect after success
      setTimeout(() => {
        window.history.back();
      }, 2000);
      
    } catch (err) {
      setError(err?.data?.message || 'Failed to update transaction');
      console.error('Error updating transaction:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white rounded-xl shadow-lg p-8 flex items-center space-x-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-gray-700 font-medium">Loading transaction data...</span>
        </div>
      </div>
    );
  }

  if (transactionError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-pink-100">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md">
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
            <h2 className="text-xl font-bold text-gray-900">Error Loading Transaction</h2>
          </div>
          <p className="text-gray-600 mb-4">Failed to load transaction data. Please try again.</p>
          <button
            onClick={() => window.history.back()}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Transactions</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Edit Transaction</h1>
                <p className="text-blue-100">Update your transaction details</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-2">
                <div className="p-1 bg-green-100 rounded-full">
                  <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-green-700 font-medium">{successMessage}</span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                <span className="text-red-700">{error}</span>
              </div>
            )}

            <div className="space-y-6">
              {/* Transaction Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Transaction Type *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`relative flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.type === 'income' 
                      ? 'border-green-500 bg-green-50 text-green-700' 
                      : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="type"
                      value="income"
                      checked={formData.type === 'income'}
                      onChange={handleInputChange}
                      className="absolute opacity-0"
                    />
                    <TrendingUp className="h-5 w-5 mr-2" />
                    <span className="font-medium">Income</span>
                  </label>
                  
                  <label className={`relative flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.type === 'expense' 
                      ? 'border-red-500 bg-red-50 text-red-700' 
                      : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="type"
                      value="expense"
                      checked={formData.type === 'expense'}
                      onChange={handleInputChange}
                      className="absolute opacity-0"
                    />
                    <TrendingDown className="h-5 w-5 mr-2" />
                    <span className="font-medium">Expense</span>
                  </label>
                </div>
              </div>

              {/* Amount Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Amount *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    required
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-colors text-lg font-medium"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Category Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Category *
                </label>
                <div className="relative">
                  <Tag className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-gray-50 focus:bg-white transition-colors font-medium"
                  >
                    <option value="">Select a category</option>
                    {defaultCategories[formData.type].map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Description
                </label>
                <div className="relative">
                  <FileText className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-gray-50 focus:bg-white transition-colors"
                    placeholder="Enter transaction description..."
                  />
                </div>
              </div>

              {/* Date Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-colors font-medium"
                  />
                </div>
              </div>

              {/* Recurring Field */}
              <div className="bg-gray-50 rounded-xl p-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isRecurring"
                    checked={formData.isRecurring}
                    onChange={handleInputChange}
                    className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="h-5 w-5 text-gray-500" />
                    <div>
                      <span className="text-sm font-semibold text-gray-700">Recurring Transaction</span>
                      <p className="text-xs text-gray-500">This transaction repeats automatically</p>
                    </div>
                  </div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-6">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 font-semibold"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-2" />
                      Update Transaction
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  disabled={isUpdating}
                  className="px-6 py-4 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all font-semibold disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>

          {/* Transaction Info */}
          {data && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-600 mb-3">Transaction Details</h3>
              <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                <div>
                  <p className="font-medium">Transaction ID</p>
                  <p className="font-mono bg-white px-2 py-1 rounded mt-1">{data.transaction.id}</p>
                </div>
                <div>
                  <p className="font-medium">Account ID</p>
                  <p className="font-mono bg-white px-2 py-1 rounded mt-1">{data.id}</p>
                </div>
                <div>
                  <p className="font-medium">Created</p>
                  <p>{new Date(data.transaction.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="font-medium">Last Updated</p>
                  <p>{new Date(data.transaction.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditTransactionForm;