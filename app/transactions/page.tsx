"use client";

import { Transaction, Budget, Category } from "@/types/types";

import { useEffect, useState } from "react";

import Container from "@/components/Container";
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { DatePicker } from "@nextui-org/date-picker";
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

import { SortDescriptor } from "@nextui-org/react";

import {
  DateValue,
  now,
  getLocalTimeZone,
  today,
  parseDate,
} from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";
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

  const [transactionNameInputValue, setTransactionNameInputValue] =
    useState("");
  const [transactionAmountInputValue, setTransactionAmountInputValue] =
    useState("");
  const [transactionCategory, setTransactionCategory] = useState<any>(
    new Set([])
  );
  const [date, setDate] = useState<DateValue>(today(getLocalTimeZone()));

  const [isFormInvalid, setIsFormInvalid] = useState(false);

  const currentDate = now(getLocalTimeZone());
  const previousYear = currentDate.year - 1;
  const janFirstPreviousYear = parseDate(`${previousYear}-01-01`);

  function addTransaction() {
    if (
      transactionNameInputValue.trim() === "" ||
      isNaN(parseFloat(transactionAmountInputValue)) ||
      transactionCategory.size === 0 ||
      date > now(getLocalTimeZone()) ||
      date < janFirstPreviousYear
    ) {
      setIsFormInvalid(true);
      setTimeout(() => {
        setIsFormInvalid(false);
      }, 2000);
      return;
    }

    // the actual function
    const newTransaction: Transaction = {
      transactionName: transactionNameInputValue,
      amount: parseFloat(transactionAmountInputValue),
      category: transactionCategory.values().next().value,
      date: new Date(date.toString()),
    };
    setTransactions((old) => [newTransaction, ...old]);
    setTransactionNameInputValue("");
    setTransactionAmountInputValue("");
    setTransactionCategory(new Set([]));
    setDate(today(getLocalTimeZone()));

    localStorage.setItem(
      "transactions",
      JSON.stringify([newTransaction, ...transactions])
    );
  }

  function removeTransaction(transactionKey: number) {
    const newTransactions = transactions.filter((_, k) => k !== transactionKey);
    setTransactions(newTransactions);
    localStorage.setItem("transactions", JSON.stringify(newTransactions));
  }

  const [sortConfig, setSortConfig] = useState<{ column?: React.Key; direction?: "ascending" | "descending" }>({});
  function sortTable({ column }: SortDescriptor) {
    let direction: 'ascending' | 'descending' | undefined = 'ascending';
    if (sortConfig.column === column && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
  
    const sortedTransactions = [...transactions].sort((a, b) => {
      if (column === 'amount') {
        return direction === 'ascending' ? a.amount - b.amount : b.amount - a.amount;
      } else if (column === 'name') {
        return direction === 'ascending' ? a.transactionName.localeCompare(b.transactionName) : b.transactionName.localeCompare(a.transactionName);
      } else if (column === 'date') {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return direction === 'ascending' ? dateA - dateB : dateB - dateA;
      } else {
        return 0;
      }
    });
  
    setSortConfig({ column, direction });
    setTransactions(sortedTransactions);
  }

  return (
    <Container>
      <div className="self-start flex flex-col items-start justify-center gap-1 rounded-lg bg-dark-secondary/50 p-4 py-8 max-md:p-6 max-w-full">
        <span className="text-gray">Balance</span>
        <h2
          className={`text-4xl text-ellipsis whitespace-nowrap overflow-hidden w-[15ch] ${
            totalExpenditure >= 0 ? "text-success" : "text-error"
          }`}
        >
          {formatNumber(totalExpenditure)} ₹
        </h2>
      </div>

      <div className="flex gap-2 items-center justify-start flex-wrap w-full">
        <span className="text-lg text-gray mb-4 w-full">Add Transactions</span>

        <Input
          aria-label="Enter transaction name"
          placeholder="Transaction name..."
          radius="none"
          className="w-96 max-w-full"
          size="lg"
          maxLength={50}
          value={transactionNameInputValue}
          onValueChange={setTransactionNameInputValue}
        />

        <Input
          aria-label="Enter transaction amount"
          type="number"
          radius="none"
          className="w-48 max-w-full"
          size="lg"
          placeholder="00.00"
          value={transactionAmountInputValue}
          onValueChange={setTransactionAmountInputValue}
          startContent={<span className="text-lg text-gray">₹</span>}
        />

        <Select
          aria-label="Select transaction category"
          className="w-60 max-w-full"
          radius="none"
          size="lg"
          placeholder="Select Category"
          selectedKeys={transactionCategory}
          onSelectionChange={setTransactionCategory}
          classNames={{
            base: "bg-red-500",
          }}
        >
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </Select>
        <I18nProvider locale="en-IN">
          <DatePicker
            value={date}
            onChange={setDate}
            className="w-56 max-w-full relative !p-0"
            size="lg"
            radius="none"
            aria-label="Transaction date"
            minValue={janFirstPreviousYear}
            maxValue={today(getLocalTimeZone())}
            dateInputClassNames={{
              errorMessage: "absolute top-full w-56 max-w-[calc(100vw-2rem)]",
            }}
          />
        </I18nProvider>
        <Popover isOpen={isFormInvalid}>
          <PopoverTrigger>
            <Button
              radius="none"
              size="lg"
              className="text-xl bg-primary rounded-md"
              onClick={addTransaction}
              disabled={isFormInvalid}
            >
              Add
            </Button>
          </PopoverTrigger>
          <PopoverContent className="bg-error">
            <div className="px-2 py-4">
              <div className="text-lg font-bold">Error</div>
              <div className="text-md">
                Fill out the specifications properly
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* eslint-disable-next-line react/jsx-no-bind  */}
      <Table aria-label="Transactions list" onSortChange={sortTable}>
        <TableHeader>
          <TableColumn key="name" allowsSorting>
            NAME
          </TableColumn>
          <TableColumn key="category">CATEGORY</TableColumn>
          <TableColumn key="amount" allowsSorting>
            AMOUNT
          </TableColumn>
          <TableColumn key="date" allowsSorting>
            DATE
          </TableColumn>
          <TableColumn className="w-2"> </TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={"No transactions to display."}
          loadingContent={<span className="text-gray text-lg">Loading...</span>}
        >
          {transactions.map((item, k) => (
            <TableRow key={item.transactionName}>
              <TableCell>{item.transactionName}</TableCell>
              <TableCell>
                <span className="flex items-center gap-1">
                  <CategoryIcon category={item.category} /> {item.category}
                </span>
              </TableCell>
              <TableCell>{formatNumber(item.amount)}</TableCell>
              <TableCell>{new Date(item.date).toDateString()}</TableCell>
              <TableCell>
                <Button
                  isIconOnly={true}
                  className="rounded-md bg-error"
                  tabIndex={0}
                  onClick={() => {
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
    </Container>
  );
}
