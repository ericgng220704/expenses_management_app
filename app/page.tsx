"use client";

import TotalBalance from "./components/totalBalance";
import CategoryList from "./components/categoryList";
import ExpenseList from "./components/expenseList";
import { useEffect, useState } from "react";
import AddExpenseModal from "./components/addExpenseModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { Button, Field, Select } from "@headlessui/react";
import { Expense } from "./types/expense";
import Summary from "./components/summary";
import BarChart from "./components/barChart";

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
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [latestTransaction, setLatestTransaction] = useState<Expense>();

  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedMonth, setSelectedMonth] = useState(months[today.getMonth()]);

  useEffect(() => {
    fetchAll();
  }, [selectedMonth, selectedYear]);

  const fetchAll = async () => {
    try {
      const response = await fetch("/api/all", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedMonth, selectedYear }),
      });

      const { expenses, categories, availableYears, latestExpense } =
        await response.json();

      setExpenses(expenses);
      console.log(expenses);
      setCategories(categories);
      setAvailableYears(availableYears);
      setLatestTransaction(latestExpense);
    } catch (e) {
      console.log(e);
      alert("Error fetch all");
    }
  };
  console.log(latestTransaction);
  return (
    <div className="flex justify-center items-start w-full bg-slate-50">
      <div className="p-8 w-full max-w-4xl">
        <div className="flex w-full items-center">
          {latestTransaction && (
            <TotalBalance latestTrans={latestTransaction} />
          )}
          <button
            className="px-4 py-4 bg-black text-white rounded-xl whitespace-nowrap h-fit"
            onClick={() => setIsAddExpenseModal(true)}
          >
            <p className="flex items-center gap-2">
              <FontAwesomeIcon icon={faPen} /> <span>New Expense +</span>
            </p>
          </button>
        </div>
        <div className="flex justify-between items-center mt-8">
          <div className="flex gap-2 bg-gray-200 rounded-full overflow-hidden">
            <button className={`px-4 py-2 bg-black text-white rounded-full`}>
              Expenses
            </button>
            <button className="px-4 py-2">Income</button>
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
          {categories && expenses && (
            <BarChart expenses={expenses} categories={categories} />
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
          <h2 className="text-xl mb-2">Categories:</h2>
          {categories && <CategoryList categories={categories} />}
        </div>

        <div className="mt-8">
          <input
            type="text"
            placeholder="Search..."
            className="w-full p-3 border rounded-lg mb-4"
          />
          {expenses && (
            <ExpenseList expenses={expenses} categories={categories} />
          )}
        </div>

        <div className="mt-8 flex justify-between">
          <button className="px-4 py-2 border rounded-lg">Previous</button>
          <button className="px-4 py-2 border rounded-lg">Next</button>
        </div>
      </div>
      {categories && latestTransaction && (
        <AddExpenseModal
          isOpen={isAddExpenseModal}
          setIsOpen={setIsAddExpenseModal}
          categories={categories}
          setExpenses={setExpenses}
          setLatestTransaction={setLatestTransaction}
        />
      )}
    </div>
  );
}
