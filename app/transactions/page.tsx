'use client';

import { Transaction, Budget } from "@/types/types";

import { useEffect, useState } from "react";

import Container from "@/components/Container";

export default function Transactions() {

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);

  useEffect(() => {
    const storedTransactions = localStorage.getItem("transactions");
    const storedBudgets = localStorage.getItem("budgets");

    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }
    if (storedBudgets) {
      setBudgets(JSON.parse(storedBudgets));
    }
  }, []);

  return (
    <Container>
      e
    </Container>
  )
}