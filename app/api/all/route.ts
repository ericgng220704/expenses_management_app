import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma"; // Prisma client singleton import

export async function POST(req: Request) {
  const { selectedMonth, selectedYear } = await req.json();

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

  try {
    // Fetch all expenses
    const expensesAll = await prisma.expense.findMany({
      include: {
        category: true,
      },
      orderBy: { date: "desc" },
    });

    // Fetch expenses for the selected month/year
    const expenses = await prisma.expense.findMany({
      where: {
        date: {
          gte: new Date(startDate),
          lt: new Date(endDate),
        },
      },
      include: {
        category: true,
      },
      orderBy: { date: "desc" },
    });

    // Fetch categories
    const categories = await prisma.category.findMany();

    // Extract available years from expenses
    const listOfAvailableYears = expensesAll.map((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getFullYear();
    });

    // Optionally, remove duplicates from the list of years
    const uniqueYears = [...new Set(listOfAvailableYears)];

    // Fetch latest transaction
    const latestExpense = await prisma.expense.findFirst({
      orderBy: { date: "desc" },
      take: 1,
      include: {
        category: true,
      },
    });

    if (selectedMonth === "" && selectedYear === "") {
      return NextResponse.json({
        expenses: expensesAll,
        categories,
        availableYears: uniqueYears,
        latestExpense: latestExpense,
      });
    } else {
      return NextResponse.json({
        expenses: expenses,
        categories,
        availableYears: uniqueYears,
        latestExpense: latestExpense,
      });
    }
  } catch (e) {
    console.error("Transaction failed: ", e);
    return NextResponse.json(
      { message: `Failed to fetch data` },
      { status: 500 }
    );
  }
}
