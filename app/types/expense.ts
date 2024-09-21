export interface Expense {
  _id?: string;
  title: string;
  category: string;
  categoryInfo: {
    color: string;
    icon: string;
  };
  amount: number;
  date: string;
  note: string;
  payer: string;
}
