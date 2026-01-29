import { NextRequest, NextResponse } from "next/server";
import { ExpenseCategory } from "@prisma/client";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

type ExpenseBody = {
  category?: ExpenseCategory;
  description?: string;
  amount?: number;
  dueDate?: string;
  paidAt?: string;
  vendor?: string;
  paymentMethod?: string;
};

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");
    const year = searchParams.get("year") || "2026";

    let startDate: Date | undefined;
    let endDate: Date | undefined;

    if (month) {
      startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);
    } else {
      startDate = new Date(parseInt(year), 0, 1);
      endDate = new Date(parseInt(year), 11, 31, 23, 59, 59);
    }

    const expenses = await prisma.expense.findMany({
      where: {
        dueDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { dueDate: "asc" },
    });

    return NextResponse.json(
      expenses.map((e) => ({
        id: e.id,
        description: e.description,
        amount: Number(e.amount),
        dueDate: e.dueDate.toISOString(),
        paidAt: e.paidAt?.toISOString() || null,
        status: e.status,
        category: e.category,
      }))
    );
  } catch (error) {
    console.error("Erro ao buscar despesas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar despesas" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = (await request.json()) as ExpenseBody;

  if (!body.category || !body.description || body.amount == null || !body.dueDate) {
    return NextResponse.json({ error: "Campos obrigatórios ausentes." }, { status: 400 });
  }

  const expense = await prisma.expense.create({
    data: {
      category: body.category,
      description: body.description,
      amount: body.amount,
      dueDate: new Date(body.dueDate),
      paidAt: body.paidAt ? new Date(body.paidAt) : null,
      vendor: body.vendor,
      paymentMethod: body.paymentMethod,
    },
  });

  await prisma.systemLog.create({
    data: {
      userId: user.id,
      action: "CRIAR_DESPESA",
      entity: "Expense",
      entityId: expense.id,
    },
  });

  return NextResponse.json(expense);
}
