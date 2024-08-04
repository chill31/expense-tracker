"use client";

import Container from "@/components/Container";
import { Link } from "@nextui-org/link";

import { Transaction, Budget } from "@/types/types";

import {
  BarChart,
  XAxis,
  YAxis,
  Bar,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { Divider } from "@nextui-org/divider";

import BudgetCard from "@/components/BudgetCard";
import CategoryIcon from "@/components/CategoryIcon";
import { useEffect, useState } from "react";
import NextLink from "next/link";

const colors = [
  "#69BCC4", // Teal
  "#A8B768", // Olive
  "#C6C1BA", // Gray
  "#7893B8", // Blue
  "#A46262", // Maroon
  "#9EAD88", // Green
  "#C89595", // Rose
  "#FF6F61", // Coral
];

export default function Home() {

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

  const totalExpenditure = transactions.reduce(
    (acc, curr) =>
      curr.category !== "income" ? acc - curr.amount : acc + curr.amount,
    0
  );
  const onlyExpensesTransactions = transactions.filter(
    (item) => item.category !== "income"
  );

  const monthlyExpenditure = Array.from({ length: 12 }, (_, i) => ({
    monthNumber: i,
    monthName: new Date(0, i).toLocaleString("default", { month: "short" }),
    expenses: 0,
    income: 0,
  }));
  
  transactions.forEach((transaction) => {
    const date = new Date(transaction.date);
    const month = date.getMonth();
    const amount = transaction.amount;
  
    if (transaction.category !== "income") {
      monthlyExpenditure[month].expenses += amount;
    } else {
      monthlyExpenditure[month].income += amount;
    }
  });

  const categoryExpenses: { [key: string]: number } = transactions.reduce((acc, curr) => {
    if (curr.category !== "income") {
      if (acc[curr.category]) {
        acc[curr.category] += curr.amount;
      } else {
        acc[curr.category] = curr.amount;
      }
    }
    return acc;
  }, {} as { [key: string]: number });

  const categoryExpensesArray = Object.entries(categoryExpenses).map(([category, amount]) => ({
    category,
    amount,
  }));

  function formatNumber(num: number) {
    if (num >= 10000000) {
      return (Math.floor(num / 1000000) / 10) + ' Cr';
    } else if (num >= 100000) {
      return (Math.floor(num / 10000) / 10) + ' L';
    } else {
      return num.toLocaleString();
    }
  }

  return (
    <Container>

      <div className="h-fit min-h-[500px] w-[calc(100vw-10rem)] max-[900px]:w-[calc(100vw-5rem)] flex gap-8 max-md:flex-col">

        <div className="bg-gray-200 flex-[3] max-md:flex-[unset] flex flex-col">
          <div className="flex flex-1 flex-col items-start justify-center gap-1 rounded-t-lg bg-dark-secondary px-4 max-md:p-6">
            <span className="text-gray">Balance</span>
            <h2
              className={`text-4xl text-ellipsis whitespace-nowrap overflow-hidden w-[15ch] ${
                totalExpenditure >= 0 ? "text-success" : "text-error"
              }`}
            >
              {formatNumber(totalExpenditure)} ₹
            </h2>
          </div>
          <div className="flex flex-[2] max-md:flex-[unset] flex-col items-start justify-start gap-1 rounded-b-lg bg-dark-secondary/50 p-4">
            <div className="flex items-center justify-between w-full mb-12">
              <span className="text-gray max-sm:text-sm">Recent Transactions</span>
              <Link href="/transactions" className="max-sm:text-sm" as={NextLink}>See All</Link>
            </div>

            {transactions.slice(0, 3).map((item, index) => (
              <>
                <div
                  key={index}
                  className="flex items-center justify-between w-full"
                >
                  <div className="flex gap-4 w-[70%]">
                    <span className="text-3xl h-12 w-12 bg-gray-300 rounded-full flex items-center justify-center">
                      <CategoryIcon
                        category={item.category}
                        className="text-4xl"
                      />
                    </span>
                    <div className="flex flex-col items-start justify-start gap-1 w-[100%]">
                      <span className="text-lg max-sm:text-sm overflow-hidden whitespace-nowrap text-ellipsis w-[11ch]">{item.transactionName}</span>
                      <span className="text-white/50 text-sm max-sm:text-[.7rem]">
                        {new Date(item.date).toDateString()}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`${
                      item.category !== "income" ? "text-error" : "text-success"
                    } text-xl max-sm:text-base flex items-center justify-end overflow-hidden text-ellipsis whitespace-nowrap min-w-[30%]`}
                  >
                    {item.category !== "income" ? "-" : "+"}
                    {formatNumber(item.amount)} ₹
                  </span>
                </div>
                {index !== 2 && <Divider className="my-4"></Divider>}
              </>
            ))}
            {transactions.length === 0 && (
              <span className="text-gray self-center text-2xl">
                No transactions
              </span>
            )}
          </div>
        </div>
        <ResponsiveContainer
          className={`flex-[5] h-fit min-h-[400px] flex items-center justify-center self-center ${
            transactions.length === 0 ? "hidden" : ""
          }`}
        >
          <PieChart>
            <Pie
              data={categoryExpensesArray}
              dataKey="amount"
              nameKey="category"
              startAngle={0}
            >
              {onlyExpensesTransactions.map((entry, index) => (
                <Cell key={index} fill={colors[index]} />
              ))}
            </Pie>
            <Legend iconSize={20} iconType="plainline" />
          </PieChart>
        </ResponsiveContainer>
        {transactions.length === 0 && (
          <span className="h-full w-full flex items-center justify-center text-gray self-center text-2xl max-md:mt-24">
            No Data To Visualize
          </span>
        )}

      </div>

      <ResponsiveContainer
          className={`min-h-[400px] max-md:min-h-[200px] w-[calc(100vw-10rem)] max-[900px]:w-[calc(100vw-5rem)] ${transactions.length === 0 ? "hidden" : ""}`}
        >
          <BarChart width={730} height={250} data={monthlyExpenditure}>
            <XAxis dataKey="monthName" />
            <YAxis />
            <Bar dataKey="income" fill="#41FF71" />
            <Bar dataKey="expenses" fill="#FF4141" />
            <Legend />
          </BarChart>
        </ResponsiveContainer>

      <div className="h-fit w-[calc(100vw-10rem)] max-[900px]:w-[calc(100vw-5rem)] flex flex-col items-start justify-start max-sm:items-center">
        <div
          className={`w-full flex flex-wrap justify-center gap-4 ${
            budgets.length === 0 ? "items-center" : "items-start"
          }`}
        >
          {budgets
            .filter((item) => item.budget !== 0)
            .map((item, index) => (
              <BudgetCard
                key={index}
                categoryName={item.category}
                spent={item.spent}
                total={item.budget}
              />
            ))}
          {budgets.filter((item) => item.budget !== 0).length === 0 && (
            <span className="text-gray self-center text-2xl">
              No Budgets Set
            </span>
          )}
        </div>
      </div>

    </Container>
  );
}
