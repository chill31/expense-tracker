import { useState, useEffect } from "react";
import { Budget, Transaction } from "./types";

export function useTransactions(): [Transaction[], (transactions: Transaction[]) => void] {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const storedTransactions = localStorage.getItem("transactions");
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }
  }, []);

  const updateTransactions = (newTransactions: Transaction[]) => {
    setTransactions(newTransactions);
    localStorage.setItem("transactions", JSON.stringify(newTransactions));
  };

  return [transactions, updateTransactions];
}

export function useBudgets(): [Budget[], (budgets: Budget[]) => void] {
  const [budgets, setBudgets] = useState<Budget[]>([]);

  useEffect(() => {
    const storedBudgets = localStorage.getItem("budgets");
    if (storedBudgets) {
      setBudgets(JSON.parse(storedBudgets));
    }
  }, []);

  const updateBudgets = (newBudgets: Budget[]) => {
    setBudgets(newBudgets);
    localStorage.setItem("budgets", JSON.stringify(newBudgets));
  };

  return [budgets, updateBudgets];
}