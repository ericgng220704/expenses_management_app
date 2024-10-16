"use client";

import {
  Button,
  Field,
  Select,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faMagnifyingGlass,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { Category } from "@/app/types/category";
import ExpenseList from "./expenseList";
import CategoryList from "./categoryList";
import { useState } from "react";
import { Expense } from "@/app/types/expense";

type ExpensePageProps = {
  categories: Category[];
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  searchTerm: string;
  isLoading: boolean;
  filteredExpenses: Expense[];
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setIsEditExpenseModal: React.Dispatch<React.SetStateAction<boolean>>;
  setExpenseEditing: React.Dispatch<React.SetStateAction<Expense | undefined>>;
};

export default function ExpensePage({
  categories,
  selectedCategories,
  setSelectedCategories,
  searchTerm,
  isLoading,
  filteredExpenses,
  setSearchTerm,
  setIsEditExpenseModal,
  setExpenseEditing,
}: ExpensePageProps) {
  return (
    <>
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
    </>
  );
}
