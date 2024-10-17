export interface Income {
  id?: string;
  title: string;
  category: {
    id: number;
    name: string;
    icon: string;
    color: string;
    type: string;
  };
  balanceBefore: number;
  balanceAfter: number;
  amount: number;
  date: string;
  note: string;
  receiver: string;
}
