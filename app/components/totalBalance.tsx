import { Expense } from "../types/expense";

type TotalBalanceProps = {
  latestTrans: Expense;
};

export default function TotalBalance({ latestTrans }: TotalBalanceProps) {
  console.log(latestTrans);
  return (
    <div className="flex flex-col gap-1 sm:gap-2 w-full">
      <span className="text-md sm:text-xl text-stone-400">Total balance: </span>
      <h1 className="text-3xl sm:text-4xl font-extrabold">
        ${(latestTrans.balanceAfter / 100).toFixed(2)}
      </h1>
    </div>
  );
}
