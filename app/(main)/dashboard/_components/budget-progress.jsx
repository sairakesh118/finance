"use client";

import { useEffect, useState } from "react";
import { Pencil, Check, X } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBudgetUpdateMutation } from "@/store/api/accountApi";


export function BudgetProgress({ initialBudget, currentExpenses,accountId }) {
  console.log("Account ID:", accountId);
  console.log("Initial Budget:", initialBudget);
  console.log("Current Expenses:", currentExpenses);
  const [isEditing, setIsEditing] = useState(false);
  const [budgetAmount, setBudgetAmount] = useState(initialBudget || 0);
  const [newBudget, setNewBudget] = useState(budgetAmount.toString());
  const [updateBudget,{isLoading,error}]=useBudgetUpdateMutation()

  const percentUsed =
    budgetAmount > 0 ? (currentExpenses / budgetAmount) * 100 : 0;

useEffect(() => {
  setBudgetAmount(initialBudget || 0);
  setNewBudget((initialBudget || 0).toString());
}, [initialBudget]);

  const handleUpdateBudget = async() => {
    const amount = parseFloat(newBudget);
    console.log("Amount type:", typeof amount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    try {
      
  await updateBudget({ accountId,  budget: amount  }).unwrap();
  setBudgetAmount(amount);
  setIsEditing(false);
} catch (err) {
  console.error("Update failed", err);
  alert("Failed to update budget");
}

  };

  const handleCancel = () => {
    setNewBudget(budgetAmount.toString());
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex-1">
          <CardTitle className="text-sm font-medium">
            Monthly Budget (Default Account)
          </CardTitle>
          <div className="flex items-center gap-2 mt-1">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  className="w-32"
                  placeholder="Enter amount"
                  autoFocus
                />
                <Button variant="ghost" size="icon" onClick={handleUpdateBudget}>
                  <Check className="h-4 w-4 text-green-500" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleCancel}>
                  <X className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ) : (
              <>
                <CardDescription>
                  {budgetAmount > 0
                    ? `$${currentExpenses.toFixed(2)} of $${budgetAmount.toFixed(2)} spent`
                    : "No budget set"}
                </CardDescription>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                  className="h-6 w-6"
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {budgetAmount > 0 && (
          <div className="space-y-2">
            <Progress
              value={percentUsed}
              extraStyles={`${
                percentUsed >= 90
                  ? "bg-red-500"
                  : percentUsed >= 75
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
            />
            <p className="text-xs text-muted-foreground text-right">
              {percentUsed.toFixed(1)}% used
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
