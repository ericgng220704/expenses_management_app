"use client";

import { colorMap } from "@/app/types/colorMap";
import { Category } from "@/app/types/category";
import Icon from "./icons";
import { Expense } from "@/app/types/expense";
import { Income } from "../types/income";
import {
  SwipeableList,
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
} from "react-swipeable-list";
import "react-swipeable-list/dist/styles.css";
import toast from "react-hot-toast";
import { Balance } from "../types/balance";

type TransactionListProps = {
  view: string;
  expenses: Expense[];
  incomes: Income[];
  categories: Category[];
  setIsEditTransactionModal: React.Dispatch<React.SetStateAction<boolean>>;
  setExpenseEditing: React.Dispatch<React.SetStateAction<Expense | undefined>>;
  setIncomeEditing: React.Dispatch<React.SetStateAction<Income | undefined>>;
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  setIncomes: React.Dispatch<React.SetStateAction<Income[]>>;
  setBalance: React.Dispatch<React.SetStateAction<Balance | undefined>>;
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
        delete
      </div>
    </SwipeAction>
  </TrailingActions>
);

export default function TransactionList({
  view,
  expenses,
  incomes,
  categories,
  setIsEditTransactionModal,
  setExpenseEditing,
  setIncomeEditing,
  setExpenses,
  setIncomes,
  setBalance,
}: TransactionListProps) {
  let transactions;
  const isExpenseView = view === "Expenses";

  if (isExpenseView) {
    transactions = expenses;
  } else {
    transactions = incomes;
  }

  const handleDelete = async (id: number | undefined) => {
    try {
      const response = await fetch(
        `/api/${isExpenseView ? "expenses" : "income"}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        }
      );

      if (!response.ok) {
        toast.error("something wrong");
        return;
      }

      if (isExpenseView) {
        const { balance, expenses } = await response.json();
        setExpenses(expenses);
        setBalance(balance);
      } else {
        const { balance, incomes } = await response.json();
        setIncomes(incomes);
        setBalance(balance);
      }
    } catch (e) {
      console.log(e);
      toast.error("Failed to delete transact");
    }
  };
  return (
    <div className="space-y-4 min-h-20">
      <SwipeableList>
        {transactions.map((transaction) => (
          <SwipeableListItem
            key={transaction.id}
            trailingActions={trailingActions({
              id: parseInt(transaction.id || "") || undefined,
              handleDelete,
            })}
            onClick={() => {
              setIsEditTransactionModal(true);
              if (isExpenseView) {
                setExpenseEditing(
                  expenses.find((expense) => {
                    return expense.id === transaction.id;
                  })
                );
              } else {
                setIncomeEditing(
                  incomes.find((income) => {
                    return income.id === transaction.id;
                  })
                );
              }
            }}
            threshold={1}
          >
            <div
              key={transaction.id}
              className={`flex justify-between items-center px-4 py-3 sm:py-4 w-full cursor-auto ${
                colorMap[transaction.category.color] || "bg-white"
              } rounded-lg mb-2 border border-stone-200 `}
            >
              <div className="flex items-center gap-4">
                <Icon
                  categories={categories}
                  category={`${transaction.category.name}`}
                />
                <div>
                  <p className="font-bold">{transaction?.title}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(transaction.date).toISOString().split("T")[0]}
                  </p>
                </div>
              </div>
              <div className="flex">
                <p className="font-bold">
                  ${(transaction.amount / 100).toFixed(2)}
                </p>
              </div>
            </div>
          </SwipeableListItem>
        ))}
      </SwipeableList>
    </div>
  );
}
