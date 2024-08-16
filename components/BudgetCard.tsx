"use client";

import { Category } from "@/utils/types";

type BudgetCardProps = {
  spent: number;
  total: number;
  categoryName: Category;
};

import { Card, CardFooter, CardHeader } from "@nextui-org/card";
import { CircularProgress } from "@nextui-org/progress";
import { Chip } from "@nextui-org/chip";
import { BsExclamationTriangle } from "react-icons/bs";

export default function BudgetCard({
  spent,
  total,
  categoryName,
}: BudgetCardProps) {
  const percent = (spent / total) * 100;

  return (
    <div className="w-[250px] flex flex-col items-start justify-start gap-2">
      {percent > 100 && (
        <Chip
          color="danger"
          size="lg"
          className="!w-[250px] max-w-[unset] relative"
          classNames={{
            content: "flex items-center justify-center gap-1",
          }}
          endContent={
            <span className="absolute top-full left-[50%] translate-x-[-50%] border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[10px] border-t-danger-400" />
          }
        >
          <BsExclamationTriangle /> Budget Exceeded
        </Chip>
      )}
      {percent <= 100 && (
        <Chip
          aria-hidden="true"
          aria-label="Budget not exceeded"
          color="success"
          size="lg"
          className="!w-[250px] max-w-[unset] opacity-0"
        >
          Hello
        </Chip>
      )}
      <Card className="bg-dark-secondary/50 w-[250px] h-fit p-4 flex flex-col items-center justify-center gap-2 relative isolate">
        <CardHeader className="flex items-center justify-center text-xl text-gray">
          {categoryName}
        </CardHeader>
        <CircularProgress
          classNames={{
            svg: "w-36 h-36 drop-shadow-md",
            value: "text-3xl font-semibold text-white p-4",
          }}
          strokeWidth={2}
          value={percent}
          color={percent > 75 ? "danger" : percent > 50 ? "warning" : "success"}
          showValueLabel={true}
          aria-label={`${categoryName} budget progress`}
        />
        <CardFooter className="flex items-center justify-center text-center text-gray">
          <span className={percent > 100 ? "text-error" : ""}>
            {spent.toLocaleString()}
          </span>
          /{total.toLocaleString()} ₹ used
        </CardFooter>
      </Card>
    </div>
  );
}
