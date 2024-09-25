import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma"; // Prisma client singleton import

export async function POST(req: Request) {
  try {
    const { title, category, amount, date, note, payer } = await req.json();
    console.log(category);

    const newExpense = await prisma.expense.create({
      data: {
        title: title,
        category_id: parseInt(category),
        amount: parseInt(amount),
        balanceAfter: 0,
        balanceBefore: 0,
        date: new Date(date),
        note,
        payer,
      },
    });

    const latestExpense = await prisma.expense.findFirst({
      take: 1,
      orderBy: {
        date: "desc",
      },
      include: {
        category: true,
      },
    });

    const expenses = await prisma.expense.findMany({});

    return NextResponse.json({ newExpense, latestExpense, expenses });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { message: `Failed to fetch data` },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const selectedMonth = searchParams.get("selectedMonth") || "";
    const selectedYear = searchParams.get("selectedYear") || "";
    const all = searchParams.get("all") === "true"; // Convert to boolean

    // Helper function to convert month name to month index (01 for January, 02 for February, etc.)
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

    // Construct date range for the selected month and year
    const startDate = `${selectedYear}-${monthIndex}-01`;
    const endDate = `${selectedYear}-${("0" + (parseInt(monthIndex) + 1)).slice(
      -2
    )}-01`;

    let expenses;

    if (all) {
      // Fetch all expenses if "all" is true
      expenses = await prisma.expense.findMany({
        include: {
          category: true,
        },
        orderBy: {
          date: "desc",
        },
      });
    } else if (selectedMonth && selectedYear) {
      // Fetch expenses for the selected month and year
      expenses = await prisma.expense.findMany({
        where: {
          date: {
            gte: new Date(startDate),
            lt: new Date(endDate), // End date is exclusive
          },
        },
        include: {
          category: true,
        },
        orderBy: {
          date: "desc",
        },
      });
    } else {
      // Fetch all expenses if no specific month and year is selected
      expenses = await prisma.expense.findMany({
        include: {
          category: true,
        },
        orderBy: {
          date: "desc",
        },
      });
    }

    return NextResponse.json({ expenses });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { message: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
