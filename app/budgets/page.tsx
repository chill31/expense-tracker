"use client";

import CategoryIcon from "@/components/CategoryIcon";
import Container from "@/components/Container";
import { Category } from "@/utils/types";

import { Select, SelectItem } from "@nextui-org/select";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { useState } from "react";
import BudgetCard from "@/components/BudgetCard";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import { BsCheckLg } from "react-icons/bs";
import { useBudgets } from "@/utils/LocalStorage";

const categories: Category[] = [
  "medical",
  "entertainment",
  "travel",
  "food",
  "utility",
  "shopping",
  "loans",
  "gifts",
  "misc",
];

export default function Budgets() {
  const [budgets, setBudgets] = useBudgets();

  const [isValid, setIsValid] = useState(true);
  const [added, setBtnUpdated] = useState(false);

  const [category, setCategory] = useState<any>(new Set([]));
  const [budgetAmount, setBudgetAmount] = useState("");

  function addBudget() {
    if (
      category.size === 0 ||
      budgetAmount === "" ||
      isNaN(parseFloat(budgetAmount)) ||
      parseFloat(budgetAmount) < 0
    ) {
      setIsValid(false);
      setTimeout(() => {
        setIsValid(true);
      }, 2000);
      return;
    }

    const newBudgets = [...budgets];
    const newBudget = {
      category: category.values().next().value,
      budget: parseFloat(budgetAmount),
      spent: 0,
    };

    setBudgetAmount("");
    setCategory(new Set([]));

    for (let i = 0; i < newBudgets.length; i++) {
      if (newBudgets[i].category === newBudget.category) {
        newBudget.spent = newBudgets[i].spent;
        newBudgets[i] = newBudget;
        setBudgets(newBudgets);

        setBtnUpdated(true);
        setTimeout(() => {
          setBtnUpdated(false);
        }, 2000);
        return;
      }
    }

    newBudgets.push(newBudget);
    setBudgets(newBudgets);

    setBtnUpdated(true);
    setTimeout(() => {
      setBtnUpdated(false);
    }, 2000);
  }

  return (
    <Container>
      <h1 className="text-4xl font-bold text-center">Manage Budgets</h1>

      <div className="flex flex-col items-start justify-start gap-2 w-[30rem] max-w-[calc(100%-1rem)]">
        <span className="text-xl font-[600]">Add/Modify Budget</span>
        <div className="flex flex-col items-start justify-start gap-4 w-full p-4 bg-dark-secondary/40 rounded-md">
          <Select
            aria-label="Select category"
            placeholder="Select category"
            radius="sm"
            size="lg"
            className="max-w-[20rem]"
            value={category}
            onSelectionChange={setCategory}
          >
            {categories.map((category) => (
              <SelectItem
                key={category}
                startContent={<CategoryIcon category={category} />}
              >
                {category}
              </SelectItem>
            ))}
          </Select>
          <Input
            aria-label="Budget amount"
            className="border-none outline-none !text-3xl"
            radius="none"
            size="lg"
            placeholder="00.00"
            startContent="₹"
            classNames={{
              input: "bg-transparent text-3xl",
              inputWrapper: "!bg-transparent",
            }}
            value={budgetAmount}
            onValueChange={setBudgetAmount}
          />

          <Popover isOpen={!isValid} radius="sm">
            <PopoverTrigger>
              <Button
                radius="sm"
                size="lg"
                className={`${
                  added ? "bg-success" : "bg-primary"
                } z-0 mt-8 self-end`}
                startContent={added ? <BsCheckLg /> : ""}
                onClick={addBudget}
                disabled={!isValid || added}
              >
                {added ? "Updated" : "Add"}
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
        <span className="text-gray text-base">
          Setting an amount to an existing category updates the budget limit.
          Setting the amount to 0 removes the budget
        </span>
      </div>

      <div className="w-full flex flex-wrap justify-center gap-4">
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
      </div>
    </Container>
  );
}
