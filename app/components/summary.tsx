import { Expense } from "../types/expense";

type SummaryProps = {
  expenses: Expense[];
  selectedMonth: string;
  selectedYear: string;
};

export default function Summary({
  expenses,
  selectedMonth,
  selectedYear,
}: SummaryProps) {
  const today = new Date();
  const currentMonth = today.toLocaleString("default", { month: "long" });
  const currentYear = today.getFullYear().toString();

  // Get start and end dates for the current day
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1
  );

  // Get start and end dates for the current week (assuming the week starts on Monday)
  const dayOfWeek = today.getDay(); // Get day of the week (0 is Sunday, 1 is Monday, etc.)
  const startOfWeek = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - (dayOfWeek - 1)
  );
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 7); // Add 7 days to get the end of the week

  // Calculate total for the day
  const daySum = expenses
    .filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startOfDay && expenseDate < endOfDay;
    })
    .reduce((sum, expense) => sum + expense.amount / 100, 0);

  // Calculate total for the week
  const weekSum = expenses
    .filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startOfWeek && expenseDate < endOfWeek;
    })
    .reduce((sum, expense) => sum + expense.amount / 100, 0);

  // Calculate total for the month (already filtered for the selected month and year)
  const monthSum = expenses.reduce(
    (sum, expense) => sum + expense.amount / 100,
    0
  );

  const showWeekAndDay =
    selectedMonth === currentMonth && selectedYear === currentYear;

  return (
    <div className="flex justify-around gap-4 text-md sm:text-lg">
      {showWeekAndDay && (
        <div>
          <p>Today</p>
          <p className="font-bold">${daySum.toFixed(2)}</p>
        </div>
      )}

      {showWeekAndDay && (
        <div>
          <p>This Week</p>
          <p className="font-bold">${weekSum.toFixed(2)}</p>
        </div>
      )}

      <div>
        <p>Month</p>
        <p className="font-bold">${monthSum.toFixed(2)}</p>
      </div>
    </div>
  );
}
