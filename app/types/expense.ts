export interface Expense {
  id?: string;
  title: string;
  category: {
    id: number;
    name: string;
    icon: string;
    color: string;
  };
  balanceBefore: number;
  balanceAfter: number;
  amount: number;
  date: string;
  note: string;
  payer: string;
}
