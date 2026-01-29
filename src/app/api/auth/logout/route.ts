import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const session = verifySessionToken(token);

  cookieStore.delete(SESSION_COOKIE);

  if (session?.userId) {
    await prisma.systemLog.create({
      data: {
        userId: session.userId,
        action: "LOGOUT",
        entity: "AUTH",
      },
    });
  }

  return NextResponse.json({ ok: true });
}
