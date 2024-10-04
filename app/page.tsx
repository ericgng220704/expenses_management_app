"use client";

import TotalBalance from "./components/totalBalance";
import CategoryList from "./components/categoryList";
import ExpenseList from "./components/expenseList";
import { useEffect, useState } from "react";
import AddExpenseModal from "./components/addExpenseModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faMagnifyingGlass,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import {
  Button,
  Field,
  Select,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Expense } from "./types/expense";
import Summary from "./components/summary";
import BarChart from "./components/barChart";
import EditExpenseModal from "./components/editExpenseModal";
import { Balance } from "./types/balance";
import { Switch } from "@headlessui/react";

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

export default function Home() {
  const [isAddExpenseModal, setIsAddExpenseModal] = useState(false);
  const [isEditExpenseModal, setIsEditExpenseModal] = useState(false);
  const [expenseEditing, setExpenseEditing] = useState<Expense>();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [balance, setBalance] = useState<Balance>();
  const [isLoading, setIsLoading] = useState(false);

  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedMonth, setSelectedMonth] = useState(months[today.getMonth()]);

  const [selected, setSelected] = useState("Expenses");

  // Initialization call (fetchAll)
  useEffect(() => {
    const initData = async () => {
      await fetchAll();
    };
    initData();
  }, []);

  // Fetch expenses based on user-selected month/year or when "All" is selected
  useEffect(() => {
    if (selectedMonth === "" && selectedYear === "") {
      // User has selected "All"
      fetchAllExpenses();
    } else {
      fetchExpenses();
    }
  }, [selectedMonth, selectedYear]);

  // Fetch all data (categories, available years, etc.)
  const fetchAll = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/all");

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

  // Fetch only expenses for the selected month and year
  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/expenses?selectedMonth=${selectedMonth}&&selectedYear=${selectedYear}`
      );
      const { expenses } = await response.json();
      setExpenses(expenses);
    } catch (e) {
      console.log(e);
      alert("Error fetching expenses");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all expenses (used when "All" is selected)
  const fetchAllExpenses = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/expenses?all=true");
      const { expenses } = await response.json();
      setExpenses(expenses);
    } catch (e) {
      console.log(e);
      alert("Error fetching all expenses");
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

  const handleToggle = () => {
    setSelected((prev) => (prev === "Expenses" ? "Income" : "Expenses"));
  };

  const filteredExpenses = expenseFilter(expenses);
  return (
    <div className="flex justify-center items-start w-full bg-slate-50">
      <div className="py-4 px-3 sm:p-8 w-full sm:max-w-4xl">
        <div className="flex w-full items-center">
          {balance && <TotalBalance balance={balance} />}
          <button
            className="py-2 px-4 sm:p-4 bg-black text-white rounded-xl whitespace-nowrap h-fit"
            onClick={() => setIsAddExpenseModal(true)}
          >
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faPen} />{" "}
              <div className="flex items-center gap-1">
                <span className="sm:block hidden">Expense</span>
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
                selected === "Expenses" ? "bg-black text-white" : "text-black"
              }`}
            >
              Expenses
            </button>
            <button
              className={`px-4 py-2 rounded-full transition-all duration-300 ease-in-out ${
                selected === "Income" ? "bg-black text-white" : "text-black"
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
            <BarChart expenses={expenses} categories={categories} />
          ) : (
            <p>Loading Bar Chart...</p>
          )}
        </div>

        <div className="mt-8 text-center">
          <Summary
            expenses={expenses}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
          />
        </div>

        <div className="mt-6">
          <Disclosure defaultOpen={true}>
            <DisclosureButton className="group flex items-center gap-2">
              <h2 className="text-base sm:text-xl mb-2">Categories</h2>
              <FontAwesomeIcon
                className="group-data-[open]:rotate-180 mb-2"
                icon={faChevronDown}
              />
            </DisclosureButton>
            <DisclosurePanel>
              {categories && (
                <CategoryList
                  categories={categories}
                  selectedCategories={selectedCategories}
                  setSelectedCategories={setSelectedCategories}
                />
              )}
            </DisclosurePanel>
          </Disclosure>
        </div>

        <div className="mt-8">
          <div className="flex gap-0 items-center h-11 bg-white mb-4 rounded-xl w-full">
            <FontAwesomeIcon className="p-4" icon={faMagnifyingGlass} />
            <input
              type="text"
              placeholder="Search..."
              className="w-full focus:outline-none focus:border-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {isLoading && <p>Loading....</p>}
          {!isLoading && filteredExpenses && (
            <ExpenseList
              expenses={filteredExpenses}
              categories={categories}
              setIsEditExpenseModal={setIsEditExpenseModal}
              setExpenseEditing={setExpenseEditing}
            />
          )}
        </div>

        {/* <div className="mt-8 flex justify-between">
          <button className="px-4 py-2 border rounded-lg">Previous</button>
          <button className="px-4 py-2 border rounded-lg">Next</button>
        </div> */}
      </div>
      {categories && (
        <AddExpenseModal
          isOpen={isAddExpenseModal}
          setIsOpen={setIsAddExpenseModal}
          categories={categories}
          setExpenses={setExpenses}
          setBalance={setBalance}
        />
      )}

      {isEditExpenseModal && expenseEditing && (
        <EditExpenseModal
          isOpen={isEditExpenseModal}
          setIsOpen={setIsEditExpenseModal}
          categories={categories}
          setExpenses={setExpenses}
          setBalance={setBalance}
          selectedExpense={expenseEditing}
        />
      )}
    </div>
  );
}
