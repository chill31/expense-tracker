"use client";

import Container from "@/components/Container";

import { Transaction, Category, IncomeCategory, Budget } from "@/types/types";

import { useEffect, useState } from "react";

import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { DatePicker } from "@nextui-org/date-picker";
import { Button } from "@nextui-org/button";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";

import { Card, CardBody, CardFooter } from "@nextui-org/card";

import {
  DateValue,
  now,
  getLocalTimeZone,
  today,
  parseDate,
} from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";
import CategoryIcon from "@/components/CategoryIcon";
import { BsCheckLg, BsDash, BsPlus } from "react-icons/bs";

const categories: Category[] = [
  "medical",
  "entertainment",
  "food",
  "utility",
  "shopping",
  "loans",
  "gifts",
  "misc",
];

const incomeCategories: IncomeCategory[] = [
  "salary",
  "business",
  "freelance",
  "gifts",
  "misc",
];

const types = ["expense", "income"];

export default function AddTransaction() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const storedTransactions = localStorage.getItem("transactions");

    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }
  }, []);

  const [transactionNameInputValue, setTransactionNameInputValue] =
    useState("");
  const [transactionAmountInputValue, setTransactionAmountInputValue] =
    useState("");
  const [transactionType, setTransactionType] = useState<any>(new Set([]));
  const [transactionCategory, setTransactionCategory] = useState<any>(
    new Set([])
  );
  const [date, setDate] = useState<DateValue>(today(getLocalTimeZone()));

  const [isFormInvalid, setIsFormInvalid] = useState(false);
  const [added, setAdded] = useState(false);

  const currentDate = now(getLocalTimeZone());
  const previousYear = currentDate.year - 1;
  const janFirstPreviousYear = parseDate(`${previousYear}-01-01`);

  // so that users cant add invalid category to either expense or income, since both have different categories.
  function setTypeAndCategory([type]: any) {
    setTransactionType(type);
    setTransactionCategory(new Set([]));
  }

  function addTransaction() {
    if (
      transactionNameInputValue.trim() === "" ||
      isNaN(parseFloat(transactionAmountInputValue)) ||
      parseFloat(transactionAmountInputValue) < 0 ||
      transactionType.size === 0 ||
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
      type: transactionType.values().next().value,
    };
    setTransactions((prev) => [newTransaction, ...prev]);
    setBudgets();

    setTransactionNameInputValue("");
    setTransactionAmountInputValue("");
    setTransactionCategory(new Set([]));
    setDate(today(getLocalTimeZone()));

    localStorage.setItem(
      "transactions",
      JSON.stringify([newTransaction, ...transactions])
    );

    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 2000);
  }

  function setBudgets() {
    if (transactionType.values().next().value === "income") return;
    const storedBudgets = localStorage.getItem("budgets") ?? "[]";

    const budgets: Budget[] = JSON.parse(storedBudgets);

    const category = transactionCategory.values().next().value;
    const amount = parseFloat(transactionAmountInputValue);

    const categoryBudget = budgets.find(
      (budget) => budget.category === category
    );
    if (!categoryBudget || categoryBudget.budget === 0) return;

    categoryBudget.spent += amount;

    localStorage.setItem("budgets", JSON.stringify(budgets));
  }

  return (
    <Container>
      <h1 className="text-4xl font-bold text-center">Add Transactions</h1>

      <Card className="flex flex-col w-full max-w-[50rem] gap-8 p-4 max-sm:p-2 bg-transparent shadow-none">
        <CardBody className="gap-8 flex flex-wrap [flex-direction:unset]">
          <Input
            isClearable={true}
            aria-label="Enter transaction name"
            placeholder="Enter a name for your transaction"
            radius="sm"
            className="w-full"
            size="lg"
            maxLength={50}
            value={transactionNameInputValue}
            onValueChange={setTransactionNameInputValue}
          />

          <Select
            aria-label="Select transaction type"
            className="w-64 max-w-full"
            radius="sm"
            size="lg"
            placeholder="Select type of transaction"
            selectedKeys={transactionType}
            onSelectionChange={(...args) => setTypeAndCategory(args)}
            disallowEmptySelection={true}
            classNames={{
              label: "!text-gray",
            }}
          >
            {types.map((type) => (
              <SelectItem
                key={type}
                value={type}
                startContent={type === "expense" ? <BsDash /> : <BsPlus />}
              >
                {type}
              </SelectItem>
            ))}
          </Select>
          {transactionType.values().next().value === "income" && (
            <Select
              aria-label="Select transaction category"
              className="w-64 max-w-full"
              radius="sm"
              size="lg"
              placeholder="Select a category"
              selectedKeys={transactionCategory}
              onSelectionChange={setTransactionCategory}
              disallowEmptySelection={true}
              classNames={{
                label: "!text-gray",
              }}
            >
              {incomeCategories.map((category) => (
                <SelectItem
                  key={category}
                  value={category}
                  startContent={<CategoryIcon category={category} />}
                >
                  {category}
                </SelectItem>
              ))}
            </Select>
          )}
          {transactionType.values().next().value !== "income" && (
            <Select
              aria-label="Select transaction category"
              className="w-64 max-w-full"
              radius="sm"
              size="lg"
              placeholder="Select a category"
              selectedKeys={transactionCategory}
              onSelectionChange={setTransactionCategory}
              disallowEmptySelection={true}
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
          )}

          <Input
            className="w-64 max-w-full"
            aria-roledescription="number input"
            aria-label="Enter transaction amount"
            placeholder="00.00"
            size="lg"
            radius="sm"
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
              minValue={janFirstPreviousYear}
              maxValue={today(getLocalTimeZone())}
              dateInputClassNames={{
                errorMessage: "absolute top-full w-56 max-w-[calc(100vw-2rem)]",
              }}
            />
          </I18nProvider>
        </CardBody>
        <CardFooter className="w-full flex justify-end items-center">
          <Popover isOpen={isFormInvalid} radius="sm">
            <PopoverTrigger>
              <Button
                radius="none"
                size="lg"
                className={`${
                  added ? "bg-success" : "bg-primary"
                } rounded-md z-0`}
                startContent={added ? <BsCheckLg /> : ""}
                onClick={addTransaction}
                disabled={isFormInvalid || added}
              >
                {added ? "Added" : "Add"}
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
    </Container>
  );
}
