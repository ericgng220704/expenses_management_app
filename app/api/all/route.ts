import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma"; // Prisma client singleton import

export async function GET() {
  try {
    // Fetch categories
    const categories = await prisma.category.findMany();

    const expensesAll = await prisma.expense.findMany();

    // Extract available years from expenses
    const listOfAvailableYears = expensesAll.map((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getFullYear();
    });

    // Optionally, remove duplicates from the list of years
    const uniqueYears = [...new Set(listOfAvailableYears)];

    // Fetch latest transaction
    const balance = await prisma.balance.findFirst({});

    return NextResponse.json({
      categories,
      availableYears: uniqueYears,
      balance,
    });
  } catch (e) {
    console.error("Transaction failed: ", e);
    return NextResponse.json(
      { message: `Failed to fetch data` },
      { status: 500 }
    );
  }
}
