import { Transaction } from "../types/transaction";

type TotalBalanceProps = {
  latestTrans: Transaction;
};

export default function TotalBalance({ latestTrans }: TotalBalanceProps) {
  console.log(latestTrans);
  return (
    <div className="flex flex-col gap-2 w-full">
      <span className="text-xl text-stone-400">Total balance: </span>
      <h1 className="text-4xl font-extrabold">
        ${(latestTrans.balanceAfter / 100).toFixed(2)}
      </h1>
    </div>
  );
}
