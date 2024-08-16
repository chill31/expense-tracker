import formatNumber from "@/utils/formatNumber";
import CategoryIcon from "./CategoryIcon";
import { Transaction } from "@/utils/types";

export default function RecentTransaction({
  category,
  transactionName,
  date,
  type,
  amount,
}: Transaction) {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex gap-4 w-[70%]">
        <span className="text-3xl h-12 w-12 bg-gray-300 rounded-full flex items-center justify-center">
          <CategoryIcon category={category} className="text-4xl" />
        </span>
        <div className="flex flex-col items-start justify-start gap-1 w-[100%]">
          <span className="text-lg max-sm:text-sm overflow-hidden whitespace-nowrap text-ellipsis w-[11ch]">
            {transactionName}
          </span>
          <span className="text-white/50 text-sm max-sm:text-[.7rem]">
            {new Date(date).toDateString()}
          </span>
        </div>
      </div>
      <span
        className={`${
          type !== "income" ? "text-error" : "text-success"
        } text-xl max-sm:text-base flex items-center justify-end overflow-hidden text-ellipsis whitespace-nowrap min-w-[30%]`}
      >
        {type !== "income" ? "-" : "+"}
        {formatNumber(amount)} ₹
      </span>
    </div>
  );
}
