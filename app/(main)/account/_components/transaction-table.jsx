"use client";

import { useState, useEffect, useMemo } from "react";
import {
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Trash,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Clock,
  Edit,
  TrendingUp,
  TrendingDown,
  Filter,
  Calendar,
  DollarSign,
  Tag,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { categoryColors } from "@/data/categories";
import { BarLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import { useDeleteTransactionsMutation, useUpdateTransactionMutation } from "@/store/api/transactionApi";

const ITEMS_PER_PAGE = 12;

const RECURRING_INTERVALS = {
  DAILY: "Daily",
  WEEKLY: "Weekly", 
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};

const categoryColorMap = {
  Business: "#8B5CF6",
  Food: "#EF4444",
  Transport: "#3B82F6",
  Entertainment: "#F59E0B",
  Health: "#10B981",
  Shopping: "#EC4899",
  Education: "#6366F1",
  Travel: "#84CC16",
  Other: "#6B7280",
};

export function TransactionTable({ transactions, accountId ,refetch}) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    field: "date",
    direction: "desc",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [recurringFilter, setRecurringFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  // RTK Query mutations
  const [updateTransaction] = useUpdateTransactionMutation();
  const [deleteTransactions, { isLoading: deleteLoading }] = useDeleteTransactionsMutation();

  // Memoized filtered and sorted transactions
  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter((transaction) =>
        transaction.description?.toLowerCase().includes(searchLower) ||
        transaction.category?.toLowerCase().includes(searchLower)
      );
    }

    // Apply type filter
    if (typeFilter) {
      result = result.filter((transaction) => transaction.type.toUpperCase() === typeFilter);
    }

    // Apply recurring filter
    if (recurringFilter) {
      result = result.filter((transaction) => {
        if (recurringFilter === "recurring") return transaction.isRecurring;
        return !transaction.isRecurring;
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;

      switch (sortConfig.field) {
        case "date":
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case "amount":
          comparison = parseFloat(a.amount) - parseFloat(b.amount);
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        default:
          comparison = 0;
      }

      return sortConfig.direction === "asc" ? comparison : -comparison;
    });

    return result;
  }, [transactions, searchTerm, typeFilter, recurringFilter, sortConfig]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedTransactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedTransactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedTransactions, currentPage]);

  const handleSort = (field) => {
    setSortConfig((current) => ({
      field,
      direction: current.field === field && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleSelect = (id) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedIds((current) =>
      current.length === paginatedTransactions.length ? [] : paginatedTransactions.map((t) => t.id)
    );
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} transactions?`)) return;

    try {
      console.log(accountId, selectedIds);
      await deleteTransactions({ accountId, transactionData: selectedIds })
      toast.success(`${selectedIds.length} transactions deleted successfully`);
      setSelectedIds([]);
      refetch()
    } catch (error) {
      toast.error("Failed to delete transactions");
      console.error("Delete error:", error);
    }
  };

  const handleSingleDelete = async (transactionId) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;

    try {
      await deleteTransactions({ accountId, transactionIds: [transactionId] }).unwrap();
      toast.success("Transaction deleted successfully");
    } catch (error) {
      toast.error("Failed to delete transaction");
      console.error("Delete error:", error);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setTypeFilter("");
    setRecurringFilter("");
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setSelectedIds([]);
  };

  const getSortIcon = (field) => {
    if (sortConfig.field === field) {
      return sortConfig.direction === "asc" ? (
        <ChevronUp className="ml-2 h-4 w-4 text-blue-500" />
      ) : (
        <ChevronDown className="ml-2 h-4 w-4 text-blue-500" />
      );
    }
    return <ChevronDown className="ml-2 h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />;
  };

  return (
    <div className="space-y-6">
      {deleteLoading && (
        <div className="w-full">
          <BarLoader width="100%" color="#8B5CF6" height={3} />
        </div>
      )}

      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <DollarSign className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Transactions</h2>
            <p className="text-sm text-gray-500">{filteredAndSortedTransactions.length} total transactions</p>
          </div>
        </div>
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-lg border border-red-200">
            <span className="text-sm text-red-600 font-medium">{selectedIds.length} selected</span>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              disabled={deleteLoading}
              className="bg-red-500 hover:bg-red-600"
            >
              <Trash className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* Enhanced Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search transactions or categories..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex gap-3">
            <Select value={typeFilter} onValueChange={(value) => { setTypeFilter(value); setCurrentPage(1); }}>
              <SelectTrigger className="w-[140px] h-11 border-gray-200">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="All Types" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INCOME">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    Income
                  </div>
                </SelectItem>
                <SelectItem value="EXPENSE">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-red-500" />
                    Expense
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={recurringFilter} onValueChange={(value) => { setRecurringFilter(value); setCurrentPage(1); }}>
              <SelectTrigger className="w-[160px] h-11 border-gray-200">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  <SelectValue placeholder="All Transactions" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recurring">Recurring Only</SelectItem>
                <SelectItem value="non-recurring">One-time Only</SelectItem>
              </SelectContent>
            </Select>

            {(searchTerm || typeFilter || recurringFilter) && (
              <Button
                variant="outline"
                size="icon"
                onClick={handleClearFilters}
                className="h-11 w-11 border-gray-200 hover:bg-gray-50"
                title="Clear filters"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50 border-b border-gray-200">
              <TableHead className="w-[50px] pl-6">
                <Checkbox
                  checked={selectedIds.length === paginatedTransactions.length && paginatedTransactions.length > 0}
                  onCheckedChange={handleSelectAll}
                  className="border-gray-300"
                />
              </TableHead>
              <TableHead className="cursor-pointer group font-semibold text-gray-700" onClick={() => handleSort("date")}>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  Date
                  {getSortIcon("date")}
                </div>
              </TableHead>
              <TableHead className="font-semibold text-gray-700">Description</TableHead>
              <TableHead className="cursor-pointer group font-semibold text-gray-700" onClick={() => handleSort("category")}>
                <div className="flex items-center">
                  <Tag className="h-4 w-4 mr-2 text-gray-500" />
                  Category
                  {getSortIcon("category")}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer group font-semibold text-gray-700 text-right" onClick={() => handleSort("amount")}>
                <div className="flex items-center justify-end">
                  <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                  Amount
                  {getSortIcon("amount")}
                </div>
              </TableHead>
              <TableHead className="font-semibold text-gray-700">Type</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500 py-12">
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-3 bg-gray-100 rounded-full">
                      <Search className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium">No transactions found</p>
                      <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedTransactions.map((transaction, index) => (
                <TableRow key={transaction.id} className={cn("hover:bg-gray-50 transition-colors", index % 2 === 0 ? "bg-white" : "bg-gray-50/50")}>
                  <TableCell className="pl-6">
                    <Checkbox
                      checked={selectedIds.includes(transaction.id)}
                      onCheckedChange={() => handleSelect(transaction.id)}
                      className="border-gray-300"
                    />
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">
                    {format(new Date(transaction.date), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[200px]">
                      <p className="font-medium text-gray-900 truncate">
                        {transaction.description || "No description"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {format(new Date(transaction.createdAt), "HH:mm")}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="px-3 py-1 font-medium text-white border-0"
                      style={{
                        backgroundColor: categoryColorMap[transaction.category] || categoryColorMap.Other,
                      }}
                    >
                      {transaction.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className={cn("font-bold text-lg", transaction.type.toLowerCase() === "expense" ? "text-red-500" : "text-green-500")}>
                      {transaction.type.toLowerCase() === "expense" ? "-" : "+"}${parseFloat(transaction.amount).toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {transaction.isRecurring ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge variant="secondary" className="gap-1 bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200">
                              <RefreshCw className="h-3 w-3" />
                              {RECURRING_INTERVALS[transaction.recurringInterval] || "Recurring"}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-sm">
                              <div className="font-medium">Next Date:</div>
                              <div>{format(new Date(transaction.nextRecurringDate || transaction.date), "PPP")}</div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <Badge variant="outline" className="gap-1 border-gray-300 text-gray-600">
                        <Clock className="h-3 w-3" />
                        One-time
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="pr-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          onClick={() => router.push(`/transaction/create?edit=${transaction.id}`)}
                          className="cursor-pointer"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Transaction
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600 cursor-pointer focus:text-red-600"
                          onClick={() => handleSingleDelete(transaction.id)}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete Transaction
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-6 py-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-500">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedTransactions.length)} of{" "}
            {filteredAndSortedTransactions.length} transactions
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="border-gray-300 hover:bg-gray-50"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                if (pageNum > totalPages) return null;
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    className={cn(
                      "w-8 h-8 p-0",
                      currentPage === pageNum
                        ? "bg-blue-500 hover:bg-blue-600 text-white"
                        : "border-gray-300 hover:bg-gray-50"
                    )}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="border-gray-300 hover:bg-gray-50"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}