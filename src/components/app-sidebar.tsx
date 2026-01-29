"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, GraduationCap, Shield, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import LogoutButton from "@/components/logout-button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

export function AppSidebar() {
  const pathname = usePathname();
  const currentDate = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-72 border-r bg-gradient-to-b from-slate-900 to-slate-800 shadow-2xl">
      <div className="flex h-full flex-col">
        {/* Logo Melhorada */}
        <div className="border-b border-slate-700 px-6 py-6 bg-gradient-to-r from-slate-800 to-slate-900">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-cyan-500 shadow-xl">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">REDAS</h1>
              <p className="text-xs text-emerald-400 font-medium">Sistema Financeiro</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/50 rounded-lg px-3 py-2.5 border border-slate-700">
            <CalendarIcon className="h-3.5 w-3.5 text-emerald-400" />
            <span>{currentDate}</span>
          </div>
        </div>

        {/* Menu Melhorado */}
        <div className="p-4">
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-all group",
              pathname === "/dashboard"
                ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/50"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            )}
          >
            <LayoutDashboard className={cn(
              "h-5 w-5 transition-transform group-hover:scale-110",
              pathname === "/dashboard" && "text-white"
            )} />
            <div>
              <p className="font-semibold">Dashboard</p>
              <p className="text-xs opacity-80">Visão Financeira</p>
            </div>
          </Link>
        </div>

        {/* Info Melhorada */}
        <div className="flex-1 px-4 space-y-3">
          <Separator className="bg-slate-700" />
          <div className="space-y-2 px-2 py-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Informações
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-slate-800/50 border border-slate-700">
                <span className="text-slate-400">Ano Fiscal</span>
                <span className="font-bold text-emerald-400">2026</span>
              </div>
              <div className="flex items-center gap-2 py-2.5 px-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                <Shield className="h-4 w-4 text-emerald-400" />
                <div className="flex-1">
                  <p className="text-xs text-emerald-400 font-semibold">Sistema Ativo</p>
                  <p className="text-xs text-slate-400">Operacional</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Melhorado */}
        <div className="border-t border-slate-700 p-4 space-y-3 bg-slate-900/50">
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 shadow-xl">
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white font-bold shadow-lg">
                  <span className="text-lg">AD</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-white">Administrador</p>
                  <p className="text-xs text-emerald-400">Acesso Completo</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <LogoutButton />
        </div>
      </div>
    </aside>
  );
}
