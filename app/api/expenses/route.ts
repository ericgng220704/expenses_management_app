import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma"; // Prisma client singleton import

const months = [
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
];

export async function POST(req: Request) {
  try {
    const { title, category, amount, date, note, payer } = await req.json();

    const balance = await prisma.balance.findFirst({});

    if (!balance) {
      return;
    }

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

    const expenses = await prisma.expense.findMany({
      include: {
        category: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json({ newExpense, balance, expenses });
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

    const monthIndex = months.indexOf(selectedMonth) + 1; // Get 1-based month index

    // Construct date range for the selected month and year
    const startDate = `${selectedYear}-${monthIndex
      .toString()
      .padStart(2, "0")}-01`;

    let endDate;
    if (monthIndex === 12) {
      // If it's December, set endDate to January 1st of the next year
      endDate = `${parseInt(selectedYear) + 1}-01-01`;
    } else {
      // Otherwise, increment the month for the end date
      endDate = `${selectedYear}-${(monthIndex + 1)
        .toString()
        .padStart(2, "0")}-01`;
    }

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

export async function PUT(req: Request) {
  try {
    const { id, title, category, amount, date, note, payer } = await req.json();

    const editedExpense = await prisma.expense.update({
      where: {
        id: parseInt(id),
      },
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

    const expenses = await prisma.expense.findMany({
      include: {
        category: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json({ editedExpense, latestExpense, expenses });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { message: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
