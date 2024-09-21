export interface Transaction {
  _id?: string;
  type: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  date: string;
  transacter: string;
  expenseInfo?: {
    category: string;
    note: string;
  };
}
