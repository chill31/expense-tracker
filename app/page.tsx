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

  const transactions: Transaction[] = [
    { category: 'food', transactionName: 'Grocery Store', amount: 50, date: new Date('2024-01-15') },
    { category: 'entertainment', transactionName: 'Movie Ticket', amount: 15, date: new Date('2024-01-25') },
    { category: 'utility', transactionName: 'Electricity Bill', amount: 75, date: new Date('2024-02-10') },
    { category: 'medical', transactionName: 'Doctor Visit', amount: 100, date: new Date('2024-02-20') },
    { category: 'shopping', transactionName: 'New Shoes', amount: 120, date: new Date('2024-03-05') },
    { category: 'loans', transactionName: 'Loan Payment', amount: 150, date: new Date('2024-03-15') },
    { category: 'gifts', transactionName: 'Birthday Gift', amount: 30, date: new Date('2024-04-01') },
    { category: 'misc', transactionName: 'Miscellaneous', amount: 20, date: new Date('2024-04-10') },
    { category: 'food', transactionName: 'Restaurant', amount: 30, date: new Date('2024-05-10') },
    { category: 'entertainment', transactionName: 'Concert', amount: 60, date: new Date('2024-05-20') },
    { category: 'utility', transactionName: 'Water Bill', amount: 40, date: new Date('2024-06-05') },
    { category: 'medical', transactionName: 'Medication', amount: 25, date: new Date('2024-06-15') },
    { category: 'shopping', transactionName: 'Groceries', amount: 70, date: new Date('2024-07-10') },
    { category: 'loans', transactionName: 'Loan Payment', amount: 150, date: new Date('2024-07-20') },
    { category: 'gifts', transactionName: 'Gift for Friend', amount: 40, date: new Date('2024-08-05') },
    { category: 'misc', transactionName: 'Office Supplies', amount: 25, date: new Date('2024-08-15') },
    { category: 'food', transactionName: 'Takeout', amount: 45, date: new Date('2024-09-10') },
    { category: 'entertainment', transactionName: 'Museum Ticket', amount: 25, date: new Date('2024-09-20') },
    { category: 'utility', transactionName: 'Internet Bill', amount: 60, date: new Date('2024-10-05') },
    { category: 'medical', transactionName: 'Physical Therapy', amount: 80, date: new Date('2024-10-15') },
    { category: 'shopping', transactionName: 'New Jacket', amount: 90, date: new Date('2024-11-10') },
    { category: 'loans', transactionName: 'Loan Payment', amount: 150, date: new Date('2024-11-20') },
    { category: 'gifts', transactionName: 'Holiday Gift', amount: 60, date: new Date('2024-12-05') },
    { category: 'misc', transactionName: 'Parking Fees', amount: 15, date: new Date('2024-12-15') },
    { category: 'income', transactionName: 'Salary', amount: 2000, date: new Date('2024-01-01') },
    { category: 'income', transactionName: 'Freelance Work', amount: 500, date: new Date('2024-06-01') }
  ];
  
  const budgets: Budget[] = [
    { category: 'food', spent: 80, budget: 200 },
    { category: 'entertainment', spent: 75, budget: 150 },
    { category: 'utility', spent: 115, budget: 120 },
    { category: 'medical', spent: 125, budget: 150 },
    { category: 'shopping', spent: 190, budget: 300 },
    { category: 'loans', spent: 450, budget: 600 },
    { category: 'gifts', spent: 70, budget: 100 },
    { category: 'misc', spent: 60, budget: 80 },
  ];

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
    amount: 0,
  }));

  transactions.forEach((transaction) => {
    const date = new Date(transaction.date);
    const month = date.getMonth();
    const amount =
      transaction.category !== "income"
        ? -transaction.amount
        : transaction.amount;
    if (amount >= 0) return (monthlyExpenditure[month].amount = 0);
    if(amount < 0) return (monthlyExpenditure[month].amount = -amount);
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

  console.log(categoryExpensesArray)

  return (
    <Container className="flex flex-col gap-16 items-center p-20">
      <div className="h-fit min-h-[500px] w-[calc(100vw-10rem)] grid grid-rows-2 grid-cols-3 max-lg:grid-cols-5 gap-8">
        <div className="bg-gray-200 row-span-2 max-lg:col-span-3 flex flex-col">
          <div className="flex flex-1 flex-col items-start justify-center gap-1 rounded-t-lg bg-dark-secondary px-4">
            <span className="text-gray">Balance</span>
            <h2
              className={`text-4xl text-ellipsis whitespace-nowrap overflow-hidden w-[90%] ${
                totalExpenditure >= 0 ? "text-success" : "text-error"
              }`}
            >
              {totalExpenditure.toLocaleString()} ₹
            </h2>
          </div>
          <div className="flex flex-[2] flex-col items-start justify-start gap-1 rounded-b-lg bg-dark-secondary/50 p-4">
            <div className="flex items-center justify-between w-full mb-12">
              <span className="text-gray">Recent Transactions</span>
              <Link href="/transactions">See All</Link>
            </div>

            {transactions.slice(0, 3).map((item, index) => (
              <>
                <div
                  key={index}
                  className="flex items-center justify-between gap-4 w-full"
                >
                  <div className="flex gap-4">
                    <span className="text-3xl h-12 w-12 bg-gray-300 rounded-full flex items-center justify-center">
                      <CategoryIcon
                        category={item.category}
                        className="text-4xl"
                      />
                    </span>
                    <div className="flex flex-col items-start justify-start gap-1">
                      <span className="text-lg">{item.category}</span>
                      <span className="text-white/50 text-small">
                        {new Date(item.date.toISOString()).toDateString()}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`${
                      item.category !== "income" ? "text-error" : "text-success"
                    } text-xl justify-self-end`}
                  >
                    {item.category !== "income" ? "-" : "+"}
                    {item.amount} ₹
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
          className={`col-span-2 ${transactions.length === 0 ? "hidden" : ""}`}
        >
          <BarChart width={730} height={250} data={monthlyExpenditure}>
            <XAxis dataKey="monthName" />
            <YAxis label={{ value: 'Expenses', angle: -90, position: 'insideLeft' }}  />
            <Bar dataKey="amount" fill="#4199FF" />
          </BarChart>
        </ResponsiveContainer>
        <ResponsiveContainer
          className={`col-span-2 flex items-center justify-center self-center ${
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
                <Cell key={`cell-${index}`} fill={colors[index]} />
              ))}
            </Pie>
            <Legend iconSize={20} iconType="square" />
          </PieChart>
        </ResponsiveContainer>
        {transactions.length === 0 && (
          <span className="col-span-2 row-span-2 h-full w-full flex items-center justify-center text-gray self-center text-2xl">
            No Data To Visualize
          </span>
        )}
      </div>

      <div className="h-fit w-[calc(100vw-10rem)] flex flex-col items-start justify-start max-sm:items-center">
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
