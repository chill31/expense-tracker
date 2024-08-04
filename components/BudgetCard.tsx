'use client';

import { Category } from "@/types/types";

type BudgetCardProps = {
  spent: number;
  total: number;
  categoryName: Category;
}

import {Card, CardFooter, CardHeader} from "@nextui-org/card";
import {CircularProgress} from "@nextui-org/progress";

export default function BudgetCard({ spent, total, categoryName }: BudgetCardProps) {

  const percent = (spent / total) * 100;

  return (
    <Card className={`${categoryName.toLowerCase() === 'total' ? 'bg-dark-secondary' : 'bg-dark-secondary/50'} w-[250px] h-fit p-4 flex flex-col items-center justify-center gap-2 relative isolate`}>
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
      {spent.toLocaleString()}/{total.toLocaleString()} ₹ used
    </CardFooter>
  </Card>
  );

}