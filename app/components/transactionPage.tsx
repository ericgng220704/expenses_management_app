"use client";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { Category } from "@/app/types/category";
import CategoryList from "./categoryList";
import { Expense } from "@/app/types/expense";
import { Income } from "../types/income";
import TransactionList from "./transactionList";
import { Balance } from "../types/balance";

type TransactionPageProps = {
  view: string;
  categories: Category[];
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  searchTerm: string;
  isLoading: boolean;
  filteredExpenses: Expense[];
  filteredIncomes: Income[];
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setIsEditTransactionModal: React.Dispatch<React.SetStateAction<boolean>>;
  setExpenseEditing: React.Dispatch<React.SetStateAction<Expense | undefined>>;
  setIncomeEditing: React.Dispatch<React.SetStateAction<Income | undefined>>;
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  setIncomes: React.Dispatch<React.SetStateAction<Income[]>>;
  setBalance: React.Dispatch<React.SetStateAction<Balance | undefined>>;
};

export default function TransactionPage({
  view,
  categories,
  selectedCategories,
  setSelectedCategories,
  searchTerm,
  isLoading,
  filteredExpenses,
  filteredIncomes,
  setSearchTerm,
  setIsEditTransactionModal,
  setExpenseEditing,
  setIncomeEditing,
  setExpenses,
  setIncomes,
  setBalance,
}: TransactionPageProps) {
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
        {!isLoading && (
          <TransactionList
            view={view}
            expenses={filteredExpenses}
            incomes={filteredIncomes}
            categories={categories}
            setIsEditTransactionModal={setIsEditTransactionModal}
            setExpenseEditing={setExpenseEditing}
            setIncomeEditing={setIncomeEditing}
            setExpenses={setExpenses}
            setIncomes={setIncomes}
            setBalance={setBalance}
          />
        )}
      </div>
    </>
  );
}
