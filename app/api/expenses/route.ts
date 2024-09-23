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
