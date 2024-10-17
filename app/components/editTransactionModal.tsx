// "use client";

// import { Fragment, useState } from "react";
// import {
//   Dialog,
//   DialogPanel,
//   DialogTitle,
//   Label,
//   Select,
//   Transition,
//   TransitionChild,
//   Field,
// } from "@headlessui/react";
// import { Category } from "@/app/types/category";
// import { Expense } from "@/app/types/expense";
// import toast from "react-hot-toast";
// import { Balance } from "@/app/types/balance";
// import { Income } from "../types/income";

// type EditTransactionModalProps = {
//   view: string;
//   isOpen: boolean;
//   setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
//   categories: Category[];
//   setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
//   setIncomes: React.Dispatch<React.SetStateAction<Income[]>>;
//   setBalance: React.Dispatch<React.SetStateAction<Balance | undefined>>;
//   selectedExpense: Expense | undefined;
//   selectedIncome: Income | undefined;
// };

// export default function EditTransactionModal({
//   view,
//   isOpen,
//   setIsOpen,
//   categories,
//   setExpenses,
//   setIncomes,
//   setBalance,
//   selectedExpense,
//   selectedIncome,
// }: EditTransactionModalProps) {
//   let selectedTransaction;
//   const isExpenseView = view === "Expenses";

//   if (isExpenseView) {
//     selectedTransaction = selectedExpense;
//   } else {
//     selectedTransaction = selectedIncome;
//   }

//   if (!selectedTransaction) {
//     return <p>Ditme</p>;
//   }

//   const [title, setTitle] = useState(selectedTransaction.title);
//   const [category, setCategory] = useState(
//     selectedTransaction.category.id.toString()
//   );
//   const [amount, setAmount] = useState(
//     (selectedTransaction.amount / 100).toString()
//   );
//   const [date, setDate] = useState(
//     new Date(selectedTransaction.date).toISOString().split("T")[0]
//   );
//   const [note, setNote] = useState(selectedTransaction.note);
//   const [authorizer, setAuthorizer] = useState(
//     isExpenseView ? selectedExpense?.payer : selectedIncome?.receiver
//   );
//   const [submitDisable, setSubmitDisable] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     setSubmitDisable(true);

//     const editedTransactionData = {
//       id: selectedTransaction.id,
//       title,
//       category,
//       amount: parseFloat(amount) * 100,
//       date,
//       note,
//       authorizer,
//     };

//     try {
//       const response = await fetch(
//         `/api/${isExpenseView ? "expenses" : "income"}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(editedTransactionData),
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Something went wrong");
//       }

//       if (isExpenseView) {
//         const { balance, expenses } = await response.json();

//         setBalance(balance);
//         setExpenses(expenses);
//       } else {
//         const { balance, incomes } = await response.json();

//         setBalance(balance);
//         setIncomes(incomes);
//       }

//       setIsOpen(false);

//       toast.success("Expense edited successfully!");
//     } catch (error) {
//       console.error(error);
//       toast.error("Error adding expense");
//       setSubmitDisable(false);
//     }
//   };

//   return (
//     <>
//       {/* Headless UI modal */}
//       <Transition appear show={isOpen} as={Fragment}>
//         <Dialog as="div" className="relative z-10" onClose={setIsOpen}>
//           <TransitionChild
//             as={Fragment}
//             // enter="ease-out duration-300"
//             // enterFrom="opacity-0 scale-95"
//             // enterTo="opacity-100 scale-100"
//             // leave="ease-in duration-200"
//             // leaveFrom="opacity-100 scale-100"
//             // leaveTo="opacity-0 scale-95"
//             enter="ease-out duration-300"
//             enterFrom="opacity-0"
//             enterTo="opacity-100"
//             leave="ease-in duration-200"
//             leaveFrom="opacity-100"
//             leaveTo="opacity-0"
//           >
//             {/* <div className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" /> */}
//             <div className="fixed inset-0 bg-black bg-opacity-25" />
//           </TransitionChild>

//           <div className="fixed inset-0 overflow-y-auto">
//             <div className="flex min-h-full items-center justify-center p-4 text-center">
//               <TransitionChild
//                 as={Fragment}
//                 enter="ease-out duration-300"
//                 enterFrom="opacity-0 scale-95"
//                 enterTo="opacity-100 scale-100"
//                 leave="ease-in duration-200"
//                 leaveFrom="opacity-100 scale-100"
//                 leaveTo="opacity-0 scale-95"
//               >
//                 <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
//                   <DialogTitle
//                     as="h3"
//                     className="text-lg font-medium leading-6 text-gray-900"
//                   >
//                     Edit Expense
//                   </DialogTitle>

//                   <form onSubmit={handleSubmit} className="mt-4">
//                     <Field className="mb-4">
//                       <Label className="block text-sm font-medium text-gray-700">
//                         Title
//                       </Label>
//                       <input
//                         type="text"
//                         value={title}
//                         onChange={(e) => setTitle(e.target.value)}
//                         className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//                         required
//                       />
//                     </Field>

//                     <Field className="mb-4">
//                       <Label
//                         className={`block text-sm font-medium text-gray-700`}
//                       >
//                         Category
//                       </Label>
//                       <Select
//                         className={`mt-1 block w-full p-2 border border-gray-300 rounded-md`}
//                         name="category"
//                         aria-label="Expense category"
//                         onChange={(e) => setCategory(e.target.value)}
//                         value={category}
//                       >
//                         {categories.map((category) => (
//                           <option key={category.id} value={`${category.id}`}>
//                             {category.name}
//                           </option>
//                         ))}
//                       </Select>
//                     </Field>

//                     <Field className="mb-4">
//                       <Label className="block text-sm font-medium text-gray-700">
//                         Amount
//                       </Label>
//                       <input
//                         type="number"
//                         value={amount}
//                         onChange={(e) => setAmount(e.target.value)}
//                         className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//                         required
//                       />
//                     </Field>

//                     <Field className="mb-4">
//                       <Label className="block text-sm font-medium text-gray-700">
//                         Date
//                       </Label>
//                       <input
//                         type="date"
//                         value={date}
//                         onChange={(e) => setDate(e.target.value)}
//                         className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//                         required
//                       />
//                     </Field>

//                     <Field className="mb-4">
//                       <Label className="block text-sm font-medium text-gray-700">
//                         Note
//                       </Label>
//                       <textarea
//                         value={note}
//                         onChange={(e) => setNote(e.target.value)}
//                         className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//                       />
//                     </Field>

//                     <Field className="mb-4">
//                       <Label className="block text-sm font-medium text-gray-700">
//                         {isExpenseView ? "Payer" : "Receiver"}
//                       </Label>
//                       <input
//                         type="text"
//                         value={authorizer}
//                         onChange={(e) => setAuthorizer(e.target.value)}
//                         className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//                         required
//                       />
//                     </Field>

//                     <Field className="mt-6">
//                       <button
//                         type="submit"
//                         className={`inline-flex justify-center px-4 py-2 ${
//                           submitDisable
//                             ? "bg-gray-200 text-white"
//                             : "bg-blue-600 text-white hover:bg-blue-700"
//                         } font-medium text-sm leading-5 rounded-md focus:outline-none`}
//                         disabled={submitDisable}
//                       >
//                         Save
//                       </button>
//                     </Field>
//                   </form>
//                 </DialogPanel>
//               </TransitionChild>
//             </div>
//           </div>
//         </Dialog>
//       </Transition>
//     </>
//   );
// }

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
import { Category } from "@/app/types/category";
import { Expense } from "@/app/types/expense";
import toast from "react-hot-toast";
import { Balance } from "@/app/types/balance";
import { Income } from "../types/income";

type EditTransactionModalProps = {
  view: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  categories: Category[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  setIncomes: React.Dispatch<React.SetStateAction<Income[]>>;
  setBalance: React.Dispatch<React.SetStateAction<Balance | undefined>>;
  selectedExpense: Expense | undefined;
  selectedIncome: Income | undefined;
};

export default function EditTransactionModal({
  view,
  isOpen,
  setIsOpen,
  categories,
  setExpenses,
  setIncomes,
  setBalance,
  selectedExpense,
  selectedIncome,
}: EditTransactionModalProps) {
  const isExpenseView = view === "Expenses";
  const selectedTransaction = isExpenseView ? selectedExpense : selectedIncome;

  // Initialize state with default values, and conditionally update if selectedTransaction exists
  const [title, setTitle] = useState(selectedTransaction?.title || "");
  const [category, setCategory] = useState(
    selectedTransaction?.category.id.toString() || ""
  );
  const [amount, setAmount] = useState(
    selectedTransaction ? (selectedTransaction.amount / 100).toString() : ""
  );
  const [date, setDate] = useState(
    selectedTransaction
      ? new Date(selectedTransaction.date).toISOString().split("T")[0]
      : ""
  );
  const [note, setNote] = useState(selectedTransaction?.note || "");
  const [authorizer, setAuthorizer] = useState(
    isExpenseView ? selectedExpense?.payer : selectedIncome?.receiver || ""
  );
  const [submitDisable, setSubmitDisable] = useState(false);

  if (!selectedTransaction) {
    return <p>No transaction selected</p>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitDisable(true);

    const editedTransactionData = {
      id: selectedTransaction.id,
      title,
      category,
      amount: parseFloat(amount) * 100,
      date,
      note,
      authorizer,
    };

    try {
      const response = await fetch(
        `/api/${isExpenseView ? "expenses" : "income"}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedTransactionData),
        }
      );

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const { balance, expenses, incomes } = await response.json();

      setBalance(balance);
      if (isExpenseView) {
        setExpenses(expenses);
      } else {
        setIncomes(incomes);
      }

      setIsOpen(false);
      toast.success("Transaction edited successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Error editing transaction");
      setSubmitDisable(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setIsOpen}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
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
                  Edit Transaction
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
                      {isExpenseView ? "Payer" : "Receiver"}
                    </Label>
                    <input
                      type="text"
                      value={authorizer}
                      onChange={(e) => setAuthorizer(e.target.value)}
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
  );
}
