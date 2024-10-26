import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { withAuthApi } from "@/app/auth/withAuth";

async function getHandler(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const view = searchParams.get("view");
    const balanceId = searchParams.get("balanceId") || "1";

    // Fetch categories
    const categories = await prisma.category.findMany({
      where: {
        type: view?.toString(),
      },
    });

    let listOfAvailableYears = [];

    if (view === "Expenses") {
      const expensesAll = await prisma.expense.findMany({
        where: {
          balanceId: parseInt(balanceId),
        },
      });

      // Extract available years from expenses
      listOfAvailableYears = expensesAll.map((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getFullYear();
      });
    } else {
      const incomesAll = await prisma.income.findMany({
        where: {
          balanceId: parseInt(balanceId),
        },
      });

      // Extract available years from incomes
      listOfAvailableYears = incomesAll.map((income) => {
        const incomeDate = new Date(income.date);
        return incomeDate.getFullYear();
      });
    }

    // Optionally, remove duplicates from the list of years
    const uniqueYears = [...new Set(listOfAvailableYears)];

    // Fetch latest transaction
    const balance = await prisma.balance.findFirst({
      where: {
        id: parseInt(balanceId),
      },
    });

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

export const GET = withAuthApi(getHandler);
