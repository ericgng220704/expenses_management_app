import { Balance } from "@/app/types/balance";

type TotalBalanceProps = {
  balance: Balance;
};

export default function TotalBalance({ balance }: TotalBalanceProps) {
  return (
    <div className="flex flex-col gap-1 sm:gap-2 w-full">
      <span className="text-md sm:text-xl text-stone-400">Total balance: </span>
      <h1 className="text-3xl sm:text-4xl font-extrabold">
        ${(balance.amount / 100).toFixed(2)}
      </h1>
    </div>
  );
}
