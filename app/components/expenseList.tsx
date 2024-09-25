import { Expense } from "../types/expense";
import { colorMap } from "../types/colorMap";
import { Category } from "../types/category";
import Icon from "./icons";

type ExpenseListProps = {
  expenses: Expense[];
  categories: Category[];
  setIsEditExpenseModal: React.Dispatch<React.SetStateAction<boolean>>;
  setExpenseEditing: React.Dispatch<React.SetStateAction<Expense | undefined>>;
};

export default function ExpenseList({
  expenses,
  categories,
  setIsEditExpenseModal,
  setExpenseEditing,
}: ExpenseListProps) {
  return (
    <ul className="space-y-4 min-h-20">
      {expenses.map((expense) => (
        <li
          key={expense.id}
          className={`flex justify-between items-center px-4 py-3 sm:py-4 ${
            colorMap[expense.category.color] || "bg-white"
          } rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-stone-200`}
          onClick={() => {
            setIsEditExpenseModal(true);
            setExpenseEditing(expense);
          }}
        >
          <div className="flex items-center gap-4">
            <Icon
              categories={categories}
              category={`${expense.category.name}`}
            />
            <div>
              <p className="font-bold">{expense?.title}</p>
              <p className="text-sm text-gray-500">
                {new Date(expense.date).toISOString().split("T")[0]}
              </p>
            </div>
          </div>
          <div className="flex">
            <p className="hidden sm:block text-sm text-stone-700 mr-4">
              <span className="text-xs">by</span> {expense.payer}
            </p>
            <p className="font-bold">${(expense.amount / 100).toFixed(2)}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
