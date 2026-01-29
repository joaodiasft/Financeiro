import { NextRequest, NextResponse } from "next/server";
import { RevenueCategory } from "@prisma/client";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

type RevenueBody = {
  category?: RevenueCategory;
  description?: string;
  amount?: number;
  receivedAt?: string;
  referenceMonth?: string;
  paymentMethod?: string;
  studentId?: string;
  enrollmentId?: string;
};

function toMonthStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

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

    const revenues = await prisma.revenue.findMany({
      where: {
        receivedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { receivedAt: "desc" },
    });

    return NextResponse.json(
      revenues.map((r) => ({
        id: r.id,
        description: r.description,
        amount: Number(r.amount),
        receivedAt: r.receivedAt.toISOString(),
        category: r.category,
        paymentMethod: r.paymentMethod,
      }))
    );
  } catch (error) {
    console.error("Erro ao buscar receitas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar receitas" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = (await request.json()) as RevenueBody;

  if (!body.category || !body.description || body.amount == null || !body.receivedAt) {
    return NextResponse.json({ error: "Campos obrigatórios ausentes." }, { status: 400 });
  }

  const receivedAt = new Date(body.receivedAt);
  const referenceMonth = body.referenceMonth ? new Date(body.referenceMonth) : toMonthStart(receivedAt);

  const revenue = await prisma.revenue.create({
    data: {
      category: body.category,
      description: body.description,
      amount: body.amount,
      receivedAt,
      referenceMonth,
      paymentMethod: body.paymentMethod,
      studentId: body.studentId,
      enrollmentId: body.enrollmentId,
    },
  });

  await prisma.systemLog.create({
    data: {
      userId: user.id,
      action: "CRIAR_RECEITA",
      entity: "Revenue",
      entityId: revenue.id,
    },
  });

  return NextResponse.json(revenue);
}
