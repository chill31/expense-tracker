"use client";

import { Transaction, Category } from "@/types/types";

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
import { Skeleton } from "@nextui-org/skeleton";
import { Spinner } from "@nextui-org/spinner";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";

import {
  DateValue,
  now,
  getLocalTimeZone,
  today,
  parseDate,
} from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";
import { BsChevronDown, BsTrash3 } from "react-icons/bs";
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
      curr.category !== "income" ? acc - curr.amount : acc + curr.amount,
    0
  );

  const [cardVisible, setCardVisible] = useState(false);

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

    const newTransaction: Transaction = {
      transactionName: transactionNameInputValue,
      amount: parseFloat(transactionAmountInputValue),
      category: transactionCategory.values().next().value,
      date: new Date(date.toString()),
    };
    setTransactions((old) => [newTransaction, ...old]);
    setOriginalTransactions((old) => [newTransaction, ...old]);
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
      if (column === "amount") {
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

      <Card className="flex flex-col w-full max-w-[50rem] self-start gap-8 p-4 max-sm:p-2 bg-dark-secondary/20">
        <CardHeader
          className="text-2xl font-bold flex items-center justify-center max-sm:justify-start cursor-pointer"
          onClick={() => setCardVisible((prev) => !prev)}
        >
          Add Transaction
          <BsChevronDown
            className={`text-xl ml-2 absolute right-8 max-sm:right-4 transition-transform ${
              cardVisible && "rotate-180"
            }`}
          />
        </CardHeader>

        <CardBody className={`gap-8 ${!cardVisible && "hidden"}`}>
          <Input
            isClearable={true}
            aria-label="Enter transaction name"
            placeholder="Enter a name for your transaction"
            radius="sm"
            className="w-full"
            label="Transaction Name"
            labelPlacement="outside"
            classNames={{
              inputWrapper: "bg-white/10 hover:!bg-dark-secondary/50",
              label: "!text-gray",
            }}
            size="lg"
            maxLength={50}
            value={transactionNameInputValue}
            onValueChange={setTransactionNameInputValue}
          />

          <Select
            aria-label="Select transaction category"
            className="w-64 max-w-full"
            radius="sm"
            size="lg"
            placeholder="Select a category"
            selectedKeys={transactionCategory}
            onSelectionChange={setTransactionCategory}
            classNames={{
              label: "!text-gray",
            }}
          >
            {categories.map((category) => (
              <SelectItem
                key={category}
                value={category}
                startContent={<CategoryIcon category={category} />}
              >
                {category}
              </SelectItem>
            ))}
          </Select>

          <div className="flex flex-wrap w-full items-center justify-start gap-2">
            <Input
              className="w-64 max-w-full"
              aria-roledescription="number input"
              aria-label="Enter transaction amount"
              placeholder="00.00"
              size="lg"
              radius="sm"
              label="Transaction Amount"
              labelPlacement="outside"
              classNames={{
                inputWrapper: "bg-white/10 hover:!bg-dark-secondary/50",
                label: "!text-gray",
              }}
              value={transactionAmountInputValue}
              onValueChange={setTransactionAmountInputValue}
              startContent={<span className="text-lg text-gray">₹</span>}
            />

            <I18nProvider locale="en-IN">
              <DatePicker
                value={date}
                onChange={setDate}
                className="w-64 max-w-full"
                size="lg"
                radius="sm"
                aria-label="Transaction date"
                label="Transaction Date"
                labelPlacement="outside"
                minValue={janFirstPreviousYear}
                maxValue={today(getLocalTimeZone())}
                dateInputClassNames={{
                  errorMessage:
                    "absolute top-full w-56 max-w-[calc(100vw-2rem)]",
                  label: "!text-gray text-md",
                  inputWrapper: "bg-white/10 hover:!bg-dark-secondary/50",
                }}
              />
            </I18nProvider>
          </div>
        </CardBody>
        <CardFooter
          className={`w-full flex justify-end items-center ${
            !cardVisible && "hidden"
          }`}
        >
          <Popover isOpen={isFormInvalid} radius="sm">
            <PopoverTrigger>
              <Button
                radius="none"
                size="lg"
                className="bg-primary rounded-md z-0"
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
        </CardFooter>
      </Card>

      <div className="w-full flex flex-col gap-2">
        <Button
          className="rounded-md self-end"
          size="md"
          color='default'
          onClick={resetSort}
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
            <TableColumn key="name" allowsSorting className="w-[30ch]">
              NAME{" "}
              {sortConfig.column === "name" &&
                (sortConfig.direction === "ascending"
                  ? " (alphabetical)"
                  : "(reversed)")}
            </TableColumn>
            <TableColumn key="category" allowsSorting className="w-[20ch]">
              CATEGORY
            </TableColumn>
            <TableColumn key="amount" allowsSorting className="w-[20ch]">
              AMOUNT{" "}
              {sortConfig.column === "amount" &&
                (sortConfig.direction === "ascending"
                  ? " (lowest)"
                  : "(highest)")}
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
            emptyContent={"No transactions to display."}
            isLoading={isLoading}
            loadingContent={<Spinner color="default" size="lg" />}
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
                <TableCell className="w-[20rem] min-w-max">
                  {new Date(item.date).toDateString()}
                </TableCell>
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
      </div>
    </Container>
  );
}
