import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/constants";
import prisma from "@/lib/prisma";
import crypto from "crypto";

function verifySessionToken(token?: string) {
  if (!token) return null;
  try {
    const [encoded, signature] = token.split(".");
    if (!encoded || !signature) return null;
    
    const secret = process.env.AUTH_SECRET || "seu-secret-super-seguro-aqui-change-in-production";
    const expected = crypto.createHmac("sha256", secret).update(encoded).digest("base64url");
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
    
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
    if (!payload?.userId || payload.exp < Date.now()) return null;
    
    return payload;
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    
    console.log("Token:", token);
    
    const session = verifySessionToken(token);
    console.log("Session:", session);
    
    if (!session) {
      return NextResponse.json({ 
        error: "Não autenticado",
        hasToken: !!token,
        sessionCookieName: SESSION_COOKIE
      }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ 
      where: { id: session.userId } 
    });
    
    console.log("User:", user);
    
    if (!user) {
      return NextResponse.json({ 
        error: "Usuário não encontrado",
        userId: session.userId
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Error in test-auth:", error);
    return NextResponse.json({ 
      error: "Erro interno",
      details: String(error)
    }, { status: 500 });
  }
}
