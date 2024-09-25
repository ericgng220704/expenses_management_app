export interface Income {
  id?: string;
  title: string;
  balanceBefore: number;
  balanceAfter: number;
  amount: number;
  date: string;
  note: string;
  receiver: string;
}
