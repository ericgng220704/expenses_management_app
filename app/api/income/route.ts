import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma"; // Prisma client singleton import
import { withAuthApi } from "@/app/auth/withAuth";

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

async function postHandler(req: Request) {
  try {
    const { title, category, amount, date, note, authorizer, balanceId } =
      await req.json();

    const balance = await prisma.balance.findFirst({
      where: {
        id: parseInt(balanceId),
      },
    });

    if (!balance) {
      return NextResponse.json(
        { message: "Failed to retreive balance" },
        { status: 500 }
      );
    }

    const {
      newIncome,
      balance: returnBalance,
      incomes,
    } = await prisma.$transaction(async (prisma) => {
      const newIncome = await prisma.income.create({
        data: {
          title: title,
          category_id: parseInt(category),
          amount: parseInt(amount),
          balanceAfter: balance.amount - parseInt(amount),
          balanceBefore: balance.amount,
          date: new Date(date),
          note,
          receiver: authorizer,
          balanceId: balance.id,
        },
      });

      const returnBalance = await prisma.balance.update({
        where: {
          id: balance.id,
        },
        data: {
          amount: balance.amount + newIncome.amount,
        },
      });

      const incomes = await prisma.income.findMany({
        include: {
          category: true,
        },
        orderBy: {
          date: "desc",
        },
      });

      return {
        newIncome,
        balance: returnBalance,
        incomes,
      };
    });

    return NextResponse.json({
      newIncome,
      balance: returnBalance,
      incomes,
    });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { message: `Failed to add income` },
      { status: 500 }
    );
  }
}

async function getHandler(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const selectedMonth = searchParams.get("selectedMonth") || "";
    const selectedYear = searchParams.get("selectedYear") || "";
    const all = searchParams.get("all") === "true"; // Convert to boolean
    const balanceId = searchParams.get("balanceId") || "1";

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

    let incomes;

    if (all) {
      // Fetch all expenses if "all" is true
      incomes = await prisma.income.findMany({
        where: {
          balanceId: parseInt(balanceId),
        },
        include: {
          category: true,
        },
        orderBy: {
          date: "desc",
        },
      });
    } else if (selectedMonth && selectedYear) {
      // Fetch expenses for the selected month and year
      incomes = await prisma.income.findMany({
        where: {
          date: {
            gte: new Date(startDate),
            lt: new Date(endDate), // End date is exclusive
          },
          balanceId: parseInt(balanceId),
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
      incomes = await prisma.income.findMany({
        where: {
          balanceId: parseInt(balanceId),
        },
        include: {
          category: true,
        },
        orderBy: {
          date: "desc",
        },
      });
    }

    return NextResponse.json({ incomes });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { message: "Failed to fetch incomes" },
      { status: 500 }
    );
  }
}

async function putHandler(req: Request) {
  try {
    const { id, title, category, amount, date, note, authorizer, balanceId } =
      await req.json();

    const balance = await prisma.balance.findFirst({
      where: {
        id: parseInt(balanceId),
      },
    });

    const selectedIncome = await prisma.income.findFirst({
      where: {
        id: parseInt(id),
      },
    });

    if (!balance || !selectedIncome) {
      return NextResponse.json(
        { message: "Cant find the balance and selectedIncome" },
        { status: 500 }
      );
    }

    const revertedBalance = balance.amount - selectedIncome.amount;
    const modifiedBalance = revertedBalance + parseInt(amount);

    const {
      editedIncome,
      balance: returnBalance,
      incomes,
    } = await prisma.$transaction(async (prisma) => {
      const editedIncome = await prisma.income.update({
        where: {
          id: parseInt(id),
        },
        data: {
          title: title,
          category_id: parseInt(category),
          amount: parseInt(amount),
          balanceAfter: modifiedBalance,
          balanceBefore: revertedBalance,
          date: new Date(date),
          note,
          receiver: authorizer,
        },
      });

      const returnBalance = await prisma.balance.update({
        where: {
          id: balance.id,
        },
        data: {
          amount: modifiedBalance,
        },
      });

      const incomes = await prisma.income.findMany({
        where: {
          balanceId: balance.id,
        },
        include: {
          category: true,
        },
        orderBy: {
          date: "desc",
        },
      });

      return {
        editedIncome,
        balance: returnBalance,
        incomes,
      };
    });

    return NextResponse.json({
      editedIncome,
      balance: returnBalance,
      incomes,
    });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { message: "Failed to modify income" },
      { status: 500 }
    );
  }
}

async function deleteHandler(req: Request) {
  try {
    const { id, balanceId } = await req.json();
    const balance = await prisma.balance.findFirst({
      where: {
        id: parseInt(balanceId),
      },
    });

    const selectedIncome = await prisma.income.findFirst({
      where: {
        id: parseInt(id),
      },
    });

    if (!balance || !selectedIncome) {
      return NextResponse.json(
        { message: "Cant find the balance and selectedIncome" },
        { status: 500 }
      );
    }

    const { returnBalance } = await prisma.$transaction(async (prisma) => {
      await prisma.income.delete({
        where: {
          id: selectedIncome.id,
        },
      });

      const returnBalance = await prisma.balance.update({
        where: {
          id: balance.id,
        },
        data: {
          amount: balance.amount - selectedIncome.amount,
        },
      });

      return { returnBalance };
    });

    const incomes = await prisma.income.findMany({
      include: {
        category: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json({ balance: returnBalance, incomes });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { message: "Failed to delete income" },
      { status: 500 }
    );
  }
}

export const POST = withAuthApi(postHandler);
export const GET = withAuthApi(getHandler);
export const PUT = withAuthApi(putHandler);
export const DELETE = withAuthApi(deleteHandler);
