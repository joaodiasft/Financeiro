import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { createSessionToken, SESSION_COOKIE } from "@/lib/session";

type LoginBody = {
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as LoginBody;
  if (!body.password) {
    return NextResponse.json({ error: "Senha obrigatória." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: body.email ?? "admin@redas.com.br" },
  });

  if (!user) {
    return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
  }

  const valid = await bcrypt.compare(body.password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Senha inválida." }, { status: 401 });
  }

  const token = createSessionToken(user.id);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  await prisma.systemLog.create({
    data: {
      userId: user.id,
      action: "LOGIN",
      entity: "AUTH",
    },
  });

  return NextResponse.json({ ok: true });
}
