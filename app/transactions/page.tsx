"use client";

import { Transaction, Category } from "@/types/types";

import { useEffect, useState } from "react";

import NextLink from "next/link";

import Container from "@/components/Container";
import { Button } from "@nextui-org/button";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/table";

import { Link } from "@nextui-org/link";
import { SortDescriptor } from "@nextui-org/react";
import { Skeleton } from "@nextui-org/skeleton";
import { Spinner } from "@nextui-org/spinner";
import { BsTrash3 } from "react-icons/bs";
import CategoryIcon from "@/components/CategoryIcon";

const categories: Category[] = [
  "medical",
  "entertainment",
  "food",
  "utility",
  "shopping",
  "loans",
  "gifts",
  "misc",
  "income",
];

export default function Transactions() {
  function formatNumber(num: number) {
    if (num >= 10000000) {
      return Math.floor(num / 1000000) / 10 + " Cr";
    } else if (num >= 100000) {
      return Math.floor(num / 10000) / 10 + " L";
    } else {
      return num.toLocaleString();
    }
  }

  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [originalTransactions, setOriginalTransactions] = useState<
    Transaction[]
  >([]);

  useEffect(() => {
    const storedTransactions = localStorage.getItem("transactions");

    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
      setOriginalTransactions(JSON.parse(storedTransactions));
      setIsLoading(false);
    }
  }, []);

  const totalExpenditure = transactions.reduce(
    (acc, curr) =>
      curr.type !== "income" ? acc - curr.amount : acc + curr.amount,
    0
  );

  function removeTransaction(transactionKey: number) {
    const newTransactions = transactions.filter((_, k) => k !== transactionKey);
    setTransactions(newTransactions);
    setOriginalTransactions(newTransactions);
    localStorage.setItem("transactions", JSON.stringify(newTransactions));
  }

  const [sortConfig, setSortConfig] = useState<{
    column?: React.Key;
    direction?: "ascending" | "descending";
  }>({});
  function sortTable({ column }: SortDescriptor) {
    let direction: "ascending" | "descending" | undefined = "ascending";
    if (sortConfig.column === column && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    const sortedTransactions = [...transactions].sort((a, b) => {
      if (column === "type") {
        return direction === "ascending"
          ? a.type === "income"
            ? -1
            : 1
          : a.type === "income"
          ? 1
          : -1;
      } else if (column === "amount") {
        return direction === "ascending"
          ? a.amount - b.amount
          : b.amount - a.amount;
      } else if (column === "name") {
        return direction === "ascending"
          ? a.transactionName.localeCompare(b.transactionName)
          : b.transactionName.localeCompare(a.transactionName);
      } else if (column === "category") {
        return direction === "ascending"
          ? a.category.localeCompare(b.category)
          : b.category.localeCompare(a.category);
      } else if (column === "date") {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return direction === "ascending" ? dateA - dateB : dateB - dateA;
      } else {
        return 0;
      }
    });

    setSortConfig({ column, direction });
    setTransactions(sortedTransactions);
  }

  function resetSort() {
    setSortConfig({});
    setTransactions(originalTransactions);
  }

  return (
    <Container>
      <div className="self-center flex flex-col items-start justify-center gap-1 rounded-lg bg-dark-secondary/20 shadow-large p-4 py-8 max-md:p-6 max-w-full">
        <span className="text-gray">Balance</span>
        <h2
          className={`text-4xl text-ellipsis whitespace-nowrap overflow-hidden w-[15ch] ${
            totalExpenditure >= 0 ? "text-success" : "text-error"
          }`}
        >
          {!isLoading && formatNumber(totalExpenditure) + " ₹"}
          {isLoading ? (
            <Skeleton
              className="w-[50%] p-4"
              classNames={{
                base: "!bg-dark-secondary/20 rounded-full",
              }}
            />
          ) : (
            ""
          )}
        </h2>
      </div>

      <span className="text-lg">Add transactions <Link href='/add' className="text-lg underline">here</Link></span>

      <div className="w-full flex flex-col gap-2">
        <Button
          className="rounded-md self-end"
          size="md"
          color="default"
          onPress={() => resetSort()}
        >
          Reset Sort
        </Button>
        <Table
          aria-label="Transactions list"
          onSortChange={sortTable}
          sortDescriptor={sortConfig as SortDescriptor}
          isStriped={true}
          classNames={{}}
        >
          <TableHeader>
            <TableColumn key="type" allowsSorting className="w-[10ch]">
              TYPE
            </TableColumn>
            <TableColumn key="name" allowsSorting className="w-[30ch]">
              NAME
            </TableColumn>
            <TableColumn key="category" allowsSorting className="w-[20ch]">
              CATEGORY
            </TableColumn>
            <TableColumn key="amount" allowsSorting className="w-[20ch]">
              AMOUNT
            </TableColumn>
            <TableColumn key="date" allowsSorting className="w-[25ch]">
              DATE{" "}
              {sortConfig.column === "date" &&
                (sortConfig.direction === "ascending"
                  ? " (oldest)"
                  : "(newest)")}
            </TableColumn>
            <TableColumn className="w-2"> </TableColumn>
          </TableHeader>
          <TableBody
            emptyContent={
              <span>
                No transactions to display. Go to the{" "}
                <Link href="/add" as={NextLink}>
                  add transactions
                </Link>{" "}
                page to add your transactions
              </span>
            }
            isLoading={isLoading}
            loadingContent={<Spinner color="default" size="lg" />}
          >
            {transactions.map((item, k) => (
              <TableRow key={item.transactionName}>
                <TableCell>
                  {item.type === "income" ? (
                    <span className="bg-success h-7 aspect-square rounded-full flex items-center justify-center text-3xl">
                      +
                    </span>
                  ) : (
                    <span className="bg-error h-7 aspect-square rounded-full flex items-center justify-center text-3xl">
                      -
                    </span>
                  )}
                </TableCell>
                <TableCell>{item.transactionName}</TableCell>
                <TableCell>
                  <span className="flex items-center gap-1">
                    <CategoryIcon category={item.category} /> {item.category}
                  </span>
                </TableCell>
                <TableCell
                  className={`${
                    item.type === "income" ? "text-success" : "text-error"
                  }`}
                >
                  {(item.type === "income" ? "+" : "-") +
                    formatNumber(item.amount) +
                    " ₹"}
                </TableCell>
                <TableCell className="w-[20rem] min-w-max">
                  {new Date(item.date).toDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    isIconOnly={true}
                    className="rounded-md bg-error"
                    tabIndex={0}
                    onPress={() => {
                      removeTransaction(k);
                    }}
                  >
                    <BsTrash3 />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Container>
  );
}
