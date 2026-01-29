import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/constants";

export async function POST() {
  try {
    const cookieStore = await cookies();
    
    // Deletar o cookie de sessão
    cookieStore.delete(SESSION_COOKIE);
    
    // Também tentar deletar com diferentes configurações para garantir
    cookieStore.set(SESSION_COOKIE, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0, // Expirar imediatamente
    });

    return NextResponse.json({ success: true, message: "Logout realizado" });
  } catch (error) {
    console.error("Erro no logout:", error);
    return NextResponse.json({ success: true, message: "Logout realizado (com avisos)" });
  }
}

export async function GET() {
  // Permitir também via GET para facilitar
  return POST();
}
