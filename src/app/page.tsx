"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Limpar qualquer sessão antiga automaticamente
    const limparSessaoAntiga = async () => {
      try {
        // Chamar API de logout para limpar cookie do servidor
        await fetch("/api/auth/logout", { method: "POST" });
      } catch (error) {
        console.log("Limpando sessão local...");
      }
      
      // Limpar storage local
      if (typeof window !== "undefined") {
        localStorage.clear();
        sessionStorage.clear();
      }
      
      // Redirecionar para login
      router.replace("/login");
    };

    limparSessaoAntiga();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="text-center text-white">
        <div className="mb-4 text-4xl">🔄</div>
        <h1 className="text-2xl font-bold">Preparando Sistema...</h1>
        <p className="mt-2 text-blue-100">Limpando sessão e redirecionando...</p>
      </div>
    </div>
  );
}
