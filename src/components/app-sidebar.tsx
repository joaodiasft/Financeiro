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
    <aside className="fixed left-0 top-0 z-40 h-screen w-72 border-r bg-card">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="border-b px-6 py-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 shadow-lg">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">REDAS</h1>
              <p className="text-xs text-muted-foreground">Sistema Financeiro</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
            <CalendarIcon className="h-3.5 w-3.5" />
            <span>{currentDate}</span>
          </div>
        </div>

        {/* Menu */}
        <div className="p-4">
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
              pathname === "/dashboard"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <LayoutDashboard className="h-5 w-5" />
            <div>
              <p className="font-semibold">Dashboard</p>
              <p className="text-xs opacity-80">Visão Completa</p>
            </div>
          </Link>
        </div>

        {/* Info */}
        <div className="flex-1 px-4 space-y-3">
          <Separator />
          <div className="space-y-2 px-2 py-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Sistema
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/50">
                <span className="text-muted-foreground">Ano Fiscal</span>
                <span className="font-semibold">2026</span>
              </div>
              <div className="flex items-center gap-2 py-2 px-3 rounded-lg bg-green-50 border border-green-200">
                <Shield className="h-4 w-4 text-green-600" />
                <div className="flex-1">
                  <p className="text-xs text-green-600 font-medium">Reserva OK</p>
                  <p className="text-xs text-muted-foreground">Emergência</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User */}
        <div className="border-t p-4 space-y-3">
          <Card className="bg-gradient-to-br from-muted to-muted/50 border">
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center text-white font-bold shadow-md">
                  AD
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">Administrador</p>
                  <p className="text-xs text-muted-foreground">Acesso Total</p>
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
