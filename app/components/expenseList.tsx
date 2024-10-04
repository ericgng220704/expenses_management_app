"use client";

import { Expense } from "../types/expense";
import { colorMap } from "../types/colorMap";
import { Category } from "../types/category";
import Icon from "./icons";
import {
  SwipeableList,
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
} from "react-swipeable-list";
import "react-swipeable-list/dist/styles.css";
import toast from "react-hot-toast";

type ExpenseListProps = {
  expenses: Expense[];
  categories: Category[];
  setIsEditExpenseModal: React.Dispatch<React.SetStateAction<boolean>>;
  setExpenseEditing: React.Dispatch<React.SetStateAction<Expense | undefined>>;
};

type trailingActionsProps = {
  id: number | undefined;
  handleDelete: (id: number | undefined) => Promise<void>;
};

const trailingActions = ({ id, handleDelete }: trailingActionsProps) => (
  <TrailingActions>
    <SwipeAction destructive={true} onClick={() => handleDelete(id)}>
      <div
        style={{
          backgroundColor: "#ffffff",
          color: "#ff8787",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "0.5rem",
          marginBottom: "0.5rem",
        }}
      >
        DELETE
      </div>
    </SwipeAction>
  </TrailingActions>
);

export default function ExpenseList({
  expenses,
  categories,
  setIsEditExpenseModal,
  setExpenseEditing,
}: ExpenseListProps) {
  const handleDelete = async (id: number | undefined) => {
    try {
      const response = await fetch("/api/expenses", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        toast.error("something wrong");
        return;
      }

      const { expenses, balance } = await response.json();
      console.log(expenses, balance);
    } catch (e) {
      console.log(e);
      toast.error("Failed to delete expense");
    }
  };
  return (
    <div className="space-y-4 min-h-20">
      <SwipeableList>
        {expenses.map((expense) => (
          <SwipeableListItem
            key={expense.id}
            trailingActions={trailingActions({
              id: parseInt(expense.id || "") || undefined,
              handleDelete,
            })}
            onClick={() => {
              setIsEditExpenseModal(true);
              setExpenseEditing(expense);
            }}
            threshold={1}
          >
            <div
              key={expense.id}
              className={`flex justify-between items-center px-4 py-3 sm:py-4 w-full cursor-auto ${
                colorMap[expense.category.color] || "bg-white"
              } rounded-lg mb-2 border border-stone-200 `}
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
                <p className="font-bold">
                  ${(expense.amount / 100).toFixed(2)}
                </p>
              </div>
            </div>
          </SwipeableListItem>
        ))}
      </SwipeableList>
    </div>
  );
}
