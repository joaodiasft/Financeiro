import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");
    const year = searchParams.get("year") || "2026";

    let startDate: Date;
    let endDate: Date;

    if (month) {
      startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);
    } else {
      startDate = new Date(parseInt(year), 0, 1);
      endDate = new Date(parseInt(year), 11, 31, 23, 59, 59);
    }

    // Receitas
    const revenues = await prisma.revenue.findMany({
      where: {
        receivedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const totalRevenues = revenues.reduce(
      (acc, r) => acc + Number(r.amount),
      0
    );

    // Despesas pagas
    const expensesPaid = await prisma.expense.findMany({
      where: {
        paidAt: {
          gte: startDate,
          lte: endDate,
        },
        status: "PAGO",
      },
    });

    const totalExpensesPaid = expensesPaid.reduce(
      (acc, e) => acc + Number(e.amount),
      0
    );

    // Despesas pendentes
    const expensesPending = await prisma.expense.findMany({
      where: {
        dueDate: {
          gte: startDate,
          lte: endDate,
        },
        status: "PENDENTE",
      },
    });

    const totalExpensesPending = expensesPending.reduce(
      (acc, e) => acc + Number(e.amount),
      0
    );

    // Despesas atrasadas
    const expensesOverdue = await prisma.expense.findMany({
      where: {
        dueDate: {
          lt: new Date(),
        },
        status: {
          in: ["PENDENTE", "ATRASADO"],
        },
      },
    });

    const totalExpensesOverdue = expensesOverdue.reduce(
      (acc, e) => acc + Number(e.amount),
      0
    );

    const balance = totalRevenues - totalExpensesPaid;

    return NextResponse.json({
      totalRevenues,
      totalExpensesPaid,
      totalExpensesPending,
      totalExpensesOverdue,
      balance,
      revenuesCount: revenues.length,
      expensesPaidCount: expensesPaid.length,
      expensesPendingCount: expensesPending.length,
      expensesOverdueCount: expensesOverdue.length,
    });
  } catch (error) {
    console.error("Erro ao calcular balanço:", error);
    return NextResponse.json(
      { error: "Erro ao calcular balanço" },
      { status: 500 }
    );
  }
}
