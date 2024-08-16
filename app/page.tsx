"use client";

import Container from "@/components/Container";
import { Link } from "@nextui-org/link";

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
import { useMemo } from "react";
import NextLink from "next/link";
import formatNumber from "@/utils/formatNumber";
import RecentTransaction from "@/components/RecentTransaction";

import { useBudgets, useTransactions } from "@/utils/LocalStorage";

const colors = [
  "#69BCC4", // Teal
  "#A8B768", // Olive
  "#C6C1BA", // Gray
  "#7893B8", // Blue
  "#A46262", // Maroon
  "#8F8CDF", // Green
  "#C89595", // Rose
  "#FF6F61", // Coral
];

export default function Home() {
  const [transactions] = useTransactions();
  const [budgets] = useBudgets();

  const {
    totalExpenditure,
    onlyExpensesTransactions,
    monthlyExpenditure,
    categoryExpensesArray,
    recentTransactions,
  } = useMemo(() => {
    const totalExpenditure = transactions.reduce(
      (acc, curr) =>
        curr.type !== "income" ? acc - curr.amount : acc + curr.amount,
      0
    );
    const onlyExpensesTransactions = transactions.filter(
      (item) => item.type !== "income"
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

      if (transaction.type !== "income") {
        monthlyExpenditure[month].expenses += amount;
      } else {
        monthlyExpenditure[month].income += amount;
      }
    });

    const categoryExpenses: { [key: string]: number } = transactions.reduce(
      (acc, curr) => {
        if (curr.type !== "income") {
          if (acc[curr.category]) {
            acc[curr.category] += curr.amount;
          } else {
            acc[curr.category] = curr.amount;
          }
        }
        return acc;
      },
      {} as { [key: string]: number }
    );

    const categoryExpensesArray = Object.entries(categoryExpenses).map(
      ([category, amount]) => ({
        category,
        amount,
      })
    );

    const recentTransactions = transactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);

    return {
      totalExpenditure,
      onlyExpensesTransactions,
      monthlyExpenditure,
      categoryExpensesArray,
      recentTransactions,
    };
  }, [transactions]);

  return (
    <Container>
      <div className="h-fit min-h-[500px] w-[calc(100vw-10rem)] max-[900px]:w-[calc(100vw-5rem)] flex gap-8 max-md:flex-col">
        <div className="bg-gray-200 flex-[3] max-md:flex-[unset] flex flex-col shadow-large">
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
              <span className="text-gray max-sm:text-sm">
                Recent Transactions
              </span>
              <Link
                href="/transactions"
                className="max-sm:text-sm"
                as={NextLink}
              >
                See All
              </Link>
            </div>

            {recentTransactions.map((item, index) => (
              <>
                <RecentTransaction
                  amount={item.amount}
                  category={item.category}
                  transactionName={item.transactionName}
                  date={item.date}
                  type={item.type}
                  key={index}
                />
                {index !== recentTransactions.length - 1 && (
                  <Divider className="my-4"></Divider>
                )}
              </>
            ))}
            {transactions.length === 0 && (
              <span className="text-gray self-center justify-self-center text-center text-lg">
                No transactions. Add transactions{" "}
                <Link href="/add" size="lg" as={NextLink}>
                  here
                </Link>
              </span>
            )}
          </div>
        </div>
        <ResponsiveContainer
          className={`flex-[5] h-fit min-h-[400px] flex items-center justify-center self-center ${
            categoryExpensesArray.length === 0 ? "hidden" : ""
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
        {categoryExpensesArray.length === 0 && (
          <span className="h-full w-full flex items-center justify-center text-gray self-center text-2xl max-md:mt-24">
            No Expenses To Visualize
          </span>
        )}
      </div>

      <ResponsiveContainer
        className={`min-h-[400px] max-md:min-h-[200px] w-[calc(100vw-10rem)] max-[900px]:w-[calc(100vw-5rem)] ${
          transactions.length === 0 ? "hidden" : ""
        }`}
      >
        <BarChart width={730} height={250} data={monthlyExpenditure}>
          <XAxis dataKey="monthName" />
          <YAxis />
          <Bar dataKey="income" fill="#41FF71" barSize={"5%"} />
          <Bar dataKey="expenses" fill="#FF4141" barSize={"5%"} />
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
