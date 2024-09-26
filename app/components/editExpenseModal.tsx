"use client";

import { Fragment, useState } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Label,
  Select,
  Transition,
  TransitionChild,
  Field,
} from "@headlessui/react";
import { Category } from "../types/category";
import { Expense } from "../types/expense";
import toast from "react-hot-toast";
import { Balance } from "../types/balance";

type EditExpenseModalProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  categories: Category[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  setBalance: React.Dispatch<React.SetStateAction<Balance | undefined>>;
  selectedExpense: Expense;
};

export default function EditExpenseModal({
  isOpen,
  setIsOpen,
  categories,
  setExpenses,
  setBalance,
  selectedExpense,
}: EditExpenseModalProps) {
  const [title, setTitle] = useState(selectedExpense.title);
  const [category, setCategory] = useState(
    selectedExpense.category.id.toString()
  );
  const [amount, setAmount] = useState(
    (selectedExpense.amount / 100).toString()
  );
  const [date, setDate] = useState(
    new Date(selectedExpense.date).toISOString().split("T")[0]
  );
  const [note, setNote] = useState(selectedExpense.note);
  const [payer, setPayer] = useState(selectedExpense.payer);
  const [submitDisable, setSubmitDisable] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitDisable(true);

    const editedExpenseData = {
      id: selectedExpense.id,
      title,
      category,
      amount: parseFloat(amount) * 100,
      date,
      note,
      payer,
    };

    try {
      const response = await fetch("/api/expenses", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedExpenseData),
      });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const { balance, expenses } = await response.json();

      setBalance(balance);
      setExpenses(expenses);
      setIsOpen(false);

      toast.success("Expense edited successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Error adding expense");
      setSubmitDisable(false);
    }
  };

  return (
    <>
      {/* Headless UI modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setIsOpen}>
          <TransitionChild
            as={Fragment}
            // enter="ease-out duration-300"
            // enterFrom="opacity-0 scale-95"
            // enterTo="opacity-100 scale-100"
            // leave="ease-in duration-200"
            // leaveFrom="opacity-100 scale-100"
            // leaveTo="opacity-0 scale-95"
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            {/* <div className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" /> */}
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <DialogTitle
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Edit Expense
                  </DialogTitle>

                  <form onSubmit={handleSubmit} className="mt-4">
                    <Field className="mb-4">
                      <Label className="block text-sm font-medium text-gray-700">
                        Title
                      </Label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </Field>

                    <Field className="mb-4">
                      <Label
                        className={`block text-sm font-medium text-gray-700`}
                      >
                        Category
                      </Label>
                      <Select
                        className={`mt-1 block w-full p-2 border border-gray-300 rounded-md`}
                        name="category"
                        aria-label="Expense category"
                        onChange={(e) => setCategory(e.target.value)}
                        value={category}
                      >
                        {categories.map((category) => (
                          <option key={category.id} value={`${category.id}`}>
                            {category.name}
                          </option>
                        ))}
                      </Select>
                    </Field>

                    <Field className="mb-4">
                      <Label className="block text-sm font-medium text-gray-700">
                        Amount
                      </Label>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </Field>

                    <Field className="mb-4">
                      <Label className="block text-sm font-medium text-gray-700">
                        Date
                      </Label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </Field>

                    <Field className="mb-4">
                      <Label className="block text-sm font-medium text-gray-700">
                        Note
                      </Label>
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      />
                    </Field>

                    <Field className="mb-4">
                      <Label className="block text-sm font-medium text-gray-700">
                        Payer
                      </Label>
                      <input
                        type="text"
                        value={payer}
                        onChange={(e) => setPayer(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </Field>

                    <Field className="mt-6">
                      <button
                        type="submit"
                        className={`inline-flex justify-center px-4 py-2 ${
                          submitDisable
                            ? "bg-gray-200 text-white"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        } font-medium text-sm leading-5 rounded-md focus:outline-none`}
                        disabled={submitDisable}
                      >
                        Save
                      </button>
                    </Field>
                  </form>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
