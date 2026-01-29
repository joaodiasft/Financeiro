"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModernBalanceCard } from "@/components/modern-balance-card";
import { ModernExpensesTable } from "@/components/modern-expenses-table";
import { RevenuesList } from "@/components/revenues-list";
import { AddRevenueDialog } from "@/components/add-revenue-dialog";
import { AddExpenseDialog } from "@/components/add-expense-dialog";
import { EmergencyReserveCard } from "@/components/emergency-reserve-card";
import { AnnualSummary } from "@/components/annual-summary";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Calendar as CalendarIcon } from "lucide-react";

interface BalanceData {
  totalRevenues: number;
  totalExpensesPaid: number;
  totalExpensesPending: number;
  totalExpensesOverdue: number;
  balance: number;
  revenuesCount: number;
  expensesPaidCount: number;
  expensesPendingCount: number;
  expensesOverdueCount: number;
}

interface Expense {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  paidAt: string | null;
  status: string;
  category: string;
}

interface Revenue {
  id: string;
  description: string;
  amount: number;
  receivedAt: string;
  category: string;
  paymentMethod?: string | null;
}

export default function DashboardPage() {
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [balanceData, setBalanceData] = useState<BalanceData | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [emergencyReserve, setEmergencyReserve] = useState(0);
  const [emergencyReserveGoal, setEmergencyReserveGoal] = useState(0);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const months = [
    { value: "all", label: "Ano Completo" },
    { value: "1", label: "Janeiro" },
    { value: "2", label: "Fevereiro" },
    { value: "3", label: "Março" },
    { value: "4", label: "Abril" },
    { value: "5", label: "Maio" },
    { value: "6", label: "Junho" },
    { value: "7", label: "Julho" },
    { value: "8", label: "Agosto" },
    { value: "9", label: "Setembro" },
    { value: "10", label: "Outubro" },
    { value: "11", label: "Novembro" },
    { value: "12", label: "Dezembro" },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const month = selectedMonth === "all" ? "" : selectedMonth;
      
      // Buscar balanço do período
      const balanceRes = await fetch(
        `/api/balance?year=2026${month ? `&month=${month}` : ""}`
      );
      const balanceJson = await balanceRes.json();
      setBalanceData(balanceJson);

      // Buscar despesas do período
      const expensesRes = await fetch(
        `/api/expenses?year=2026${month ? `&month=${month}` : ""}`
      );
      const expensesJson = await expensesRes.json();
      setExpenses(expensesJson);

      // Buscar receitas do período
      const revenuesRes = await fetch(
        `/api/revenues?year=2026${month ? `&month=${month}` : ""}`
      );
      const revenuesJson = await revenuesRes.json();
      setRevenues(revenuesJson);

      // Se for visualização anual, buscar dados de cada mês
      if (selectedMonth === "all") {
        const monthlyPromises = months.slice(1).map(async (m) => {
          const balRes = await fetch(`/api/balance?year=2026&month=${m.value}`);
          const balData = await balRes.json();
          
          const expRes = await fetch(`/api/expenses?year=2026&month=${m.value}`);
          const expData = await expRes.json();
          
          const expensesPending = expData.filter((e: any) => e.status !== "PAGO").length;
          
          return {
            month: m.label,
            revenues: balData.totalRevenues || 0,
            expenses: balData.totalExpensesPaid + balData.totalExpensesPending || 0,
            balance: balData.balance || 0,
            expensesPaid: balData.totalExpensesPaid || 0,
            expensesPending,
          };
        });
        
        const monthlyResults = await Promise.all(monthlyPromises);
        setMonthlyData(monthlyResults);
      }

      const settingsRes = await fetch("/api/financial-settings");
      const settingsJson = await settingsRes.json();
      setEmergencyReserve(settingsJson.emergencyReserve || 0);
      setEmergencyReserveGoal(settingsJson.emergencyReserveGoal || 0);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedMonth]);

  const monthName =
    selectedMonth === "all"
      ? "Ano Completo"
      : months.find((m) => m.value === selectedMonth)?.label || "";

  return (
    <div className="container mx-auto p-6">
      <Tabs
        value={selectedMonth}
        onValueChange={setSelectedMonth}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
          {months.slice(0, 7).map((month) => (
            <TabsTrigger key={month.value} value={month.value}>
              {month.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6">
          {months.slice(7).map((month) => (
            <TabsTrigger key={month.value} value={month.value}>
              {month.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="space-y-6 p-6 lg:p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground flex items-center gap-2 mt-1">
                  <CalendarIcon className="h-4 w-4" />
                  {monthName} 2026
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <AddRevenueDialog onSuccess={fetchData} />
              <AddExpenseDialog onSuccess={fetchData} />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : balanceData ? (
            <>
              {selectedMonth === "all" ? (
                /* Visão Anual - Apenas Resumo */
                <AnnualSummary
                  totalRevenues={balanceData.totalRevenues}
                  totalExpenses={balanceData.totalExpensesPaid + balanceData.totalExpensesPending}
                  totalBalance={balanceData.balance}
                  monthlyData={monthlyData}
                />
              ) : (
                /* Visão Mensal - Detalhes Completos */
                <>
                  <ModernBalanceCard data={balanceData} />

                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-1">
                      <EmergencyReserveCard
                        reserve={emergencyReserve}
                        goal={emergencyReserveGoal}
                        availableBalance={balanceData.balance - emergencyReserve}
                        onUpdate={fetchData}
                      />
                    </div>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span>Despesas - {monthName}</span>
                        <span className="text-sm font-normal text-muted-foreground">
                          ({expenses.length} registros)
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ModernExpensesTable
                        expenses={expenses}
                        onPaymentUpdate={fetchData}
                      />
                    </CardContent>
                  </Card>

                  {revenues.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <span>Receitas - {monthName}</span>
                          <span className="text-sm font-normal text-muted-foreground">
                            ({revenues.length} registros)
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <RevenuesList revenues={revenues} />
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </>
          ) : (
            <Alert>
              <AlertDescription>
                Erro ao carregar dados financeiros.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </Tabs>
    </div>
  );
}
