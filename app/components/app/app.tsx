"use client";

import TotalBalance from "./totalBalance";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { Button, Field, Select } from "@headlessui/react";
import { Expense } from "@/app/types/expense";
import Summary from "./summary";
import BarChart from "./barChart";
import { Balance } from "@/app/types/balance";
import { Income } from "@/app/types/income";
import TransactionPage from "./transactionPage";
import AddTransactionModal from "./addTransactionModal";
import EditTransactionModal from "./editTransactionModal";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const today = new Date();

export default function App() {
  // Both
  const [availableYears, setAvailableYears] = useState([]);
  const [balance, setBalance] = useState<Balance>();
  const [categories, setCategories] = useState([]);

  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedMonth, setSelectedMonth] = useState(months[today.getMonth()]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isAddTransactionModal, setIsAddTransactionModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState("Expenses");
  // Expense
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const [isEditTransactionModal, setIsEditTransactionModal] = useState(false);
  const [expenseEditing, setExpenseEditing] = useState<Expense>();

  // Income
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [incomeEditing, setIncomeEditing] = useState<Income>();

  // Initialization call (fetchAll)
  useEffect(() => {
    const initData = async () => {
      await fetchAll();
    };
    initData();
  }, [view, expenses, incomes]);

  // Fetch expenses based on user-selected month/year or when "All" is selected
  useEffect(() => {
    if (selectedMonth === "" && selectedYear === "") {
      // User has selected "All"
      fetchAllEntity();
    } else {
      fetchEntity();
    }
  }, [selectedMonth, selectedYear, view]);

  // Fetch all data (categories, available years, etc.)
  const fetchAll = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/all?view=${view}`);

      const { categories, availableYears, balance } = await response.json();

      setCategories(categories);
      setAvailableYears(availableYears);
      setBalance(balance);
    } catch (e) {
      console.log(e);
      alert("Error fetching all data");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch only expenses/incomes for the selected month and year
  const fetchEntity = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(
        `/api/${
          view === "Expenses" ? "expenses" : "income"
        }?selectedMonth=${selectedMonth}&&selectedYear=${selectedYear}`
      );
      if (view === "Expenses") {
        const { expenses } = await response.json();
        setExpenses(expenses);
      } else {
        const { incomes } = await response.json();
        setIncomes(incomes);
      }
    } catch (e) {
      console.log(e);
      alert("Error fetching entity");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all expenses (used when "All" is selected)
  const fetchAllEntity = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(
        `/api/${view === "Expenses" ? "expenses" : "income"}?all=true`
      );
      if (view === "Expenses") {
        const { expenses } = await response.json();
        setExpenses(expenses);
      } else {
        const { incomes } = await response.json();
        setIncomes(incomes);
      }
    } catch (e) {
      console.log(e);
      alert("Error fetching all Entity");
    } finally {
      setIsLoading(false);
    }
  };

  const expenseFilter = (expenses: Expense[]) => {
    expenses = expenses.filter((expense) => expense.title.includes(searchTerm));

    if (selectedCategories.length > 0) {
      expenses = expenses.filter((expense) =>
        selectedCategories.find(
          (category) => category === expense.category.name
        )
      );
    }

    return expenses;
  };

  const incomesFilter = (incomes: Income[]) => {
    incomes = incomes.filter((income) => income.title.includes(searchTerm));

    if (selectedCategories.length > 0) {
      incomes = incomes.filter((income) =>
        selectedCategories.find((category) => category === income.category.name)
      );
    }

    return incomes;
  };

  const handleToggle = () => {
    setView((prev) => (prev === "Expenses" ? "Income" : "Expenses"));
  };

  const filteredExpenses = expenseFilter(expenses);
  const filteredIncomes = incomesFilter(incomes);
  return (
    <div className="flex justify-center items-start w-full bg-slate-50">
      <div className="py-4 px-3 sm:p-8 w-full sm:max-w-4xl">
        <div className="flex w-full items-center">
          {balance && <TotalBalance balance={balance} />}
          <button
            className="py-2 px-4 sm:p-4 bg-black text-white rounded-xl whitespace-nowrap h-fit"
            onClick={() => setIsAddTransactionModal(true)}
          >
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faPen} />{" "}
              <div className="flex items-center gap-1">
                <span className="sm:block hidden">
                  {view === "Expenses" ? "Expense" : "Income"}
                </span>
                <span>New +</span>
              </div>
            </div>
          </button>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between mt-8">
          <div
            onClick={handleToggle}
            className="flex bg-gray-200 rounded-full overflow-hidden max-w-fit cursor-pointer"
          >
            <button
              className={`px-4 py-2 rounded-full transition-all duration-300 ease-in-out ${
                view === "Expenses" ? "bg-black text-white" : "text-black"
              }`}
            >
              Expenses
            </button>
            <button
              className={`px-4 py-2 rounded-full transition-all duration-300 ease-in-out ${
                view === "Income" ? "bg-black text-white" : "text-black"
              }`}
            >
              Income
            </button>
          </div>

          <Field className="flex gap-2 items-center">
            <Button
              className={`px-4 py-2 ${
                selectedMonth === "" && selectedYear === ""
                  ? "bg-gray-200 text-black"
                  : "bg-black text-white"
              } rounded-lg`}
              onClick={() => {
                setSelectedMonth("");
                setSelectedYear("");
              }}
            >
              All
            </Button>
            <Select
              className="px-3 py-2 border rounded-lg"
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value.toString());

                if (selectedMonth === "") {
                  setSelectedMonth(months[today.getMonth()]);
                }
              }}
            >
              {availableYears &&
                availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
            </Select>
            <Select
              className="px-3 py-2 border rounded-lg"
              onChange={(e) => {
                setSelectedMonth(e.target.value);
                if (selectedYear === "") {
                  setSelectedYear(today.getFullYear().toString());
                }
              }}
              value={selectedMonth}
            >
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="mt-8 text-center rounded-xl">
          {categories && expenses ? (
            <BarChart
              view={view}
              incomes={incomes}
              expenses={expenses}
              categories={categories}
            />
          ) : (
            <p>Loading Bar Chart...</p>
          )}
        </div>

        <div className="mt-8 text-center">
          <Summary
            view={view}
            expenses={expenses}
            incomes={incomes}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
          />
        </div>

        <TransactionPage
          view={view}
          categories={categories}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          setSearchTerm={setSearchTerm}
          setIsEditTransactionModal={setIsEditTransactionModal}
          setExpenseEditing={setExpenseEditing}
          setIncomeEditing={setIncomeEditing}
          searchTerm={searchTerm}
          isLoading={isLoading}
          filteredExpenses={filteredExpenses}
          filteredIncomes={filteredIncomes}
          setExpenses={setExpenses}
          setIncomes={setIncomes}
          setBalance={setBalance}
        />
      </div>
      {categories && (
        <AddTransactionModal
          view={view}
          isOpen={isAddTransactionModal}
          setIsOpen={setIsAddTransactionModal}
          categories={categories}
          setExpenses={setExpenses}
          setIncomes={setIncomes}
          setBalance={setBalance}
        />
      )}

      {isEditTransactionModal && (
        <EditTransactionModal
          view={view}
          isOpen={isEditTransactionModal}
          setIsOpen={setIsEditTransactionModal}
          categories={categories}
          setExpenses={setExpenses}
          setIncomes={setIncomes}
          setBalance={setBalance}
          selectedExpense={expenseEditing}
          selectedIncome={incomeEditing}
        />
      )}
    </div>
  );
}
