import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { Expense } from "@/app/types/expense";
import { Category } from "@/app/types/category";
import { Transaction } from "@/app/types/transaction";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("expense_management_app");
  const expenses = await db.collection<Expense>("expenses").find({}).toArray();
  return NextResponse.json(expenses);
}

export async function POST(request: Request) {
  const client = await clientPromise;
  const session = client.startSession(); // Start a session for the transaction
  const db = client.db("expense_management_app");

  try {
    // Start the transaction
    session.startTransaction();

    // Parse the incoming expense data from the request
    const newExpense = await request.json();
    console.log(newExpense);

    // Find the category by name to get the associated color and icon
    const category = await db
      .collection<Category>("categories")
      .findOne({ name: newExpense.category });

    // If the category is not found, return an error response
    if (!category) {
      throw new Error("Category not found");
    }

    // Create the new expense entry
    const newExpenseEntry: Expense = {
      title: newExpense.title,
      category: newExpense.category,
      categoryInfo: {
        color: category.color,
        icon: category.icon,
      },
      amount: newExpense.amount,
      date: newExpense.date,
      note: newExpense.note,
      payer: newExpense.payer,
    };

    // Insert the new expense entry into the "expenses" collection
    const result = await db
      .collection<Expense>("expenses")
      .insertOne(newExpenseEntry, { session });

    // Find the latest transaction to get the current balance
    const latestTrans = await db
      .collection<Transaction>("transactions")
      .find({})
      .sort({ date: -1 })
      .limit(1)
      .toArray();

    const currentBalance =
      latestTrans.length > 0 ? latestTrans[0].balanceAfter : 0;

    // Create the new transaction entry
    const newTransactionEntry: Transaction = {
      type: "expense",
      amount: newExpense.amount,
      balanceBefore: currentBalance,
      balanceAfter: currentBalance - newExpense.amount,
      date: newExpense.date,
      transacter: newExpense.payer,
      expenseInfo: {
        category: newExpense.category,
        note: newExpense.note,
      },
    };

    // Insert the new transaction entry into the "transactions" collection
    const createTransaction = await db
      .collection<Transaction>("transactions")
      .insertOne(newTransactionEntry, { session });

    // Commit the transaction
    await session.commitTransaction();

    // Fetch all expenses after the transaction is committed
    const expenses = await db
      .collection<Expense>("expenses")
      .find({})
      .sort({ date: -1 })
      .toArray();

    return NextResponse.json({
      message: "Expense and transaction added successfully",
      expenses,
      createTransaction,
    });
  } catch (error) {
    // If an error occurs, abort the transaction and rollback
    console.error("Transaction failed: ", error);
    await session.abortTransaction();

    return NextResponse.json(
      { message: `Failed to add expense` },
      { status: 500 }
    );
  } finally {
    // End the session
    session.endSession();
  }
}

export async function DELETE(request: Request) {
  const client = await clientPromise;
  const db = client.db("expense_management_app");

  const body = await request.json();
}
