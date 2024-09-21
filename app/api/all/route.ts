import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { Expense } from "@/app/types/expense";
import { Category } from "@/app/types/category";
import { Transaction } from "@/app/types/transaction";

export async function POST(req: Request) {
  const client = await clientPromise;
  const session = client.startSession();
  const db = client.db("expense_management_app");

  try {
    const { selectedMonth, selectedYear } = await req.json();
    console.log(selectedMonth, selectedYear);

    // Ensure month is in two-digit format (e.g., "09" for September)
    const monthIndex = (
      "0" +
      ([
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
      ].indexOf(selectedMonth) +
        1)
    ).slice(-2);

    // Construct string date range for the selected month and year
    const startDate = `${selectedYear}-${monthIndex}-01`;
    const endDate = `${selectedYear}-${("0" + (parseInt(monthIndex) + 1)).slice(
      -2
    )}-01`;

    const expensesAll = await db
      .collection<Expense>("expenses")
      .find({})
      .sort({ date: -1 })
      .toArray();
    const expenses = await db
      .collection<Expense>("expenses")
      .find({
        date: {
          $gte: startDate,
          $lt: endDate,
        },
      })
      .sort({ date: -1 })
      .toArray();

    const categories = await db
      .collection<Category>("categories")
      .find({})
      .toArray();

    // Extract the available years from the expenses
    const listOfAvailableYears = expensesAll.map((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getFullYear();
    });

    // Optionally, remove duplicates from the list of years
    const uniqueYears = [...new Set(listOfAvailableYears)];

    // latest Transaction
    const latestTrans = await db
      .collection<Transaction>("transactions")
      .find({})
      .sort({ date: -1 })
      .limit(1)
      .toArray();

    if (selectedMonth === "" && selectedYear === "") {
      return NextResponse.json({
        expenses: expensesAll,
        categories,
        availableYears: uniqueYears,
        latestTrans: latestTrans[0],
      });
    } else {
      return NextResponse.json({
        expenses: expenses,
        categories,
        availableYears: uniqueYears,
        latestTrans: latestTrans[0],
      });
    }
  } catch (e) {
    console.error("Transaction failed: ", e);
    await session.abortTransaction();

    return NextResponse.json(
      { message: `Failed to add expense` },
      { status: 500 }
    );
  } finally {
    session.endSession();
  }
}
