import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// API de configurações financeiras e reserva de emergência
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  try {
    let settings = await prisma.financialSettings.findFirst();

    if (!settings) {
      settings = await prisma.financialSettings.create({
        data: {
          emergencyReserve: 0,
          emergencyReserveGoal: 0,
        },
      });
    }

    return NextResponse.json({
      emergencyReserve: Number(settings.emergencyReserve),
      emergencyReserveGoal: Number(settings.emergencyReserveGoal),
    });
  } catch (error) {
    console.error("Erro ao buscar configurações:", error);
    return NextResponse.json(
      { error: "Erro ao buscar configurações" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { emergencyReserve, emergencyReserveGoal } = body;

    let settings = await prisma.financialSettings.findFirst();

    if (!settings) {
      settings = await prisma.financialSettings.create({
        data: {
          emergencyReserve: emergencyReserve || 0,
          emergencyReserveGoal: emergencyReserveGoal || 0,
        },
      });
    } else {
      settings = await prisma.financialSettings.update({
        where: { id: settings.id },
        data: {
          emergencyReserve: emergencyReserve !== undefined ? emergencyReserve : settings.emergencyReserve,
          emergencyReserveGoal: emergencyReserveGoal !== undefined ? emergencyReserveGoal : settings.emergencyReserveGoal,
        },
      });
    }

    await prisma.systemLog.create({
      data: {
        userId: user.id,
        action: "ATUALIZAR_RESERVA_EMERGENCIA",
        entity: "FinancialSettings",
        entityId: settings.id,
        metadata: {
          emergencyReserve,
          emergencyReserveGoal,
        },
      },
    });

    return NextResponse.json({
      emergencyReserve: Number(settings.emergencyReserve),
      emergencyReserveGoal: Number(settings.emergencyReserveGoal),
    });
  } catch (error) {
    console.error("Erro ao atualizar configurações:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar configurações" },
      { status: 500 }
    );
  }
}
