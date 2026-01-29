"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, TrendingUp, TrendingDown, Wallet, CircleDollarSign, Calendar as CalendarIcon, PlusCircle } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AddRevenueDialog } from "@/components/add-revenue-dialog";
import { AddExpenseDialog } from "@/components/add-expense-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface BalanceData {
  totalRevenues: number;
  totalExpensesPaid: number;
  totalExpensesPending: number;
  totalExpensesOverdue: number;
  balance: number;
}

interface Expense {
  id: string;
  description: string;
  amount: number | { toNumber: () => number };
  dueDate: string | Date;
  paidAt: string | Date | null;
  status: string;
  category: string;
}

interface Revenue {
  id: string;
  description: string;
  amount: number | { toNumber: () => number };
  receivedAt: string | Date;
  category: string;
}

interface FinancialSettings {
  emergencyReserve: number;
  emergencyReserveGoal: number;
}

const months = [
  { value: "0", label: "Ano Completo" },
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

export default function DashboardPage() {
  const [selectedMonth, setSelectedMonth] = useState<string>("0");
  const [balanceData, setBalanceData] = useState<BalanceData | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [settings, setSettings] = useState<FinancialSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payingExpenseId, setPayingExpenseId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const month = selectedMonth === "0" ? "" : `&month=${selectedMonth}`;
      
      const [balanceRes, expensesRes, revenuesRes, settingsRes] = await Promise.all([
        fetch(`/api/balance?year=2026${month}`),
        fetch(`/api/expenses?year=2026${month}`),
        fetch(`/api/revenues?year=2026${month}`),
        fetch("/api/financial-settings"),
      ]);

      // Verificar qual API falhou
      if (!balanceRes.ok) {
        const errorData = await balanceRes.json().catch(() => ({}));
        console.error("Balance API error:", balanceRes.status, errorData);
        throw new Error(`Erro ao carregar balanço (${balanceRes.status}). Por favor, faça login novamente.`);
      }
      
      if (!expensesRes.ok) {
        const errorData = await expensesRes.json().catch(() => ({}));
        console.error("Expenses API error:", expensesRes.status, errorData);
        throw new Error(`Erro ao carregar despesas (${expensesRes.status}). Por favor, faça login novamente.`);
      }
      
      if (!revenuesRes.ok) {
        const errorData = await revenuesRes.json().catch(() => ({}));
        console.error("Revenues API error:", revenuesRes.status, errorData);
        throw new Error(`Erro ao carregar receitas (${revenuesRes.status}). Por favor, faça login novamente.`);
      }
      
      if (!settingsRes.ok) {
        const errorData = await settingsRes.json().catch(() => ({}));
        console.error("Settings API error:", settingsRes.status, errorData);
        throw new Error(`Erro ao carregar configurações (${settingsRes.status}). Por favor, faça login novamente.`);
      }

      const balance = await balanceRes.json();
      const exp = await expensesRes.json();
      const rev = await revenuesRes.json();
      const sett = await settingsRes.json();

      setBalanceData(balance);
      setExpenses(Array.isArray(exp) ? exp : []);
      setRevenues(Array.isArray(rev) ? rev : []);
      setSettings(sett);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setError(err instanceof Error ? err.message : "Erro ao carregar dados. Por favor, faça login novamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedMonth]);

  const handlePayExpense = async (expenseId: string) => {
    setPayingExpenseId(expenseId);
    try {
      const response = await fetch(`/api/expenses/${expenseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paidAt: new Date().toISOString(),
          status: "PAGO",
        }),
      });

      if (!response.ok) throw new Error("Erro ao pagar despesa");
      
      await fetchData(); // Recarregar dados
    } catch (err) {
      console.error("Erro ao pagar:", err);
      alert("Erro ao marcar despesa como paga");
    } finally {
      setPayingExpenseId(null);
    }
  };

  const monthName = months.find((m) => m.value === selectedMonth)?.label || "";
  const availableBalance = balanceData && settings 
    ? balanceData.balance - settings.emergencyReserve 
    : 0;

  const getAmount = (amount: number | { toNumber: () => number }): number => {
    return typeof amount === "number" ? amount : amount.toNumber();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 space-y-4">
        <Alert variant="destructive">
          <AlertDescription className="space-y-3">
            <p className="font-semibold">{error}</p>
            <p className="text-sm">
              Isso geralmente acontece quando sua sessão expirou ou você precisa fazer login novamente.
            </p>
            <Button 
              onClick={async () => {
                await fetch("/api/auth/logout", { method: "POST" });
                window.location.href = "/login";
              }}
              variant="outline"
              className="mt-2"
            >
              Ir para Login
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Dashboard Financeiro</h1>
          <p className="text-muted-foreground flex items-center gap-2 mt-2">
            <CalendarIcon className="h-4 w-4" />
            Ano Fiscal 2026
          </p>
        </div>
        <div className="flex gap-3">
          <AddRevenueDialog onSuccess={fetchData} />
          <AddExpenseDialog onSuccess={fetchData} />
        </div>
      </div>

      {/* Tabs de Meses */}
      <Tabs value={selectedMonth} onValueChange={setSelectedMonth} className="w-full">
        <div className="space-y-4">
          <TabsList className="grid w-full grid-cols-7 lg:grid-cols-13">
            {months.map((month) => (
              <TabsTrigger key={month.value} value={month.value} className="text-xs">
                {month.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {months.map((month) => (
            <TabsContent key={month.value} value={month.value} className="space-y-6 mt-6">
              {/* Visão Anual */}
              {month.value === "0" && balanceData ? (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Resumo Anual 2026</h2>
                  
                  {/* Cards de Resumo Anual */}
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center justify-between">
                          <span>Receitas Totais</span>
                          <TrendingUp className="h-5 w-5" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{formatCurrency(balanceData.totalRevenues)}</div>
                        <p className="text-xs text-white/80 mt-1">Ano completo</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-red-500 to-rose-600 text-white">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center justify-between">
                          <span>Despesas Pagas</span>
                          <TrendingDown className="h-5 w-5" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{formatCurrency(balanceData.totalExpensesPaid)}</div>
                        <p className="text-xs text-white/80 mt-1">Ano completo</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-orange-500 to-amber-600 text-white">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center justify-between">
                          <span>Despesas Pendentes</span>
                          <Wallet className="h-5 w-5" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{formatCurrency(balanceData.totalExpensesPending)}</div>
                        <p className="text-xs text-white/80 mt-1">Ano completo</p>
                      </CardContent>
                    </Card>

                    <Card className={`bg-gradient-to-br ${balanceData.balance >= 0 ? 'from-blue-500 to-cyan-600' : 'from-red-600 to-rose-700'} text-white`}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center justify-between">
                          <span>Saldo Anual</span>
                          <CircleDollarSign className="h-5 w-5" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{formatCurrency(balanceData.balance)}</div>
                        <p className="text-xs text-white/80 mt-1">Receitas - Despesas Pagas</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Resumo por Categoria */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Informações Gerais</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Total de Receitas</p>
                          <p className="text-2xl font-bold text-green-600">{formatCurrency(balanceData.totalRevenues)}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Total de Despesas</p>
                          <p className="text-2xl font-bold text-red-600">
                            {formatCurrency(balanceData.totalExpensesPaid + balanceData.totalExpensesPending)}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Resultado do Ano</p>
                          <p className={`text-2xl font-bold ${balanceData.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                            {formatCurrency(balanceData.balance)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {settings && (
                    <Card className="border-yellow-200 bg-yellow-50/50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-yellow-800">
                          <CircleDollarSign className="h-5 w-5" />
                          Reserva de Emergência
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-3">
                          <div>
                            <p className="text-sm text-muted-foreground">Reserva Atual</p>
                            <p className="text-2xl font-bold text-yellow-700">{formatCurrency(settings.emergencyReserve)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Meta da Reserva</p>
                            <p className="text-2xl font-bold text-yellow-700">{formatCurrency(settings.emergencyReserveGoal)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Saldo Disponível</p>
                            <p className="text-2xl font-bold text-blue-700">{formatCurrency(availableBalance)}</p>
                          </div>
                        </div>
                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-yellow-500 transition-all duration-300"
                            style={{ 
                              width: `${settings.emergencyReserveGoal > 0 
                                ? Math.min((settings.emergencyReserve / settings.emergencyReserveGoal) * 100, 100) 
                                : 0}%` 
                            }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                /* Visão Mensal Detalhada */
                balanceData && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold">{monthName} 2026</h2>

                    {/* Cards Principais do Mês */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
                      <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white hover:scale-105 transition-transform">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium flex items-center justify-between">
                            <span>Receitas</span>
                            <TrendingUp className="h-5 w-5" />
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">{formatCurrency(balanceData.totalRevenues)}</div>
                          <p className="text-xs text-white/80 mt-1">Recebidas no mês</p>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-red-500 to-rose-600 text-white hover:scale-105 transition-transform">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium flex items-center justify-between">
                            <span>Despesas Pagas</span>
                            <TrendingDown className="h-5 w-5" />
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">{formatCurrency(balanceData.totalExpensesPaid)}</div>
                          <p className="text-xs text-white/80 mt-1">Pagas no mês</p>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-orange-500 to-amber-600 text-white hover:scale-105 transition-transform">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium flex items-center justify-between">
                            <span>Pendentes</span>
                            <Wallet className="h-5 w-5" />
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">{formatCurrency(balanceData.totalExpensesPending)}</div>
                          <p className="text-xs text-white/80 mt-1">A pagar no mês</p>
                        </CardContent>
                      </Card>

                      <Card className={`bg-gradient-to-br ${balanceData.balance >= 0 ? 'from-blue-500 to-cyan-600' : 'from-red-600 to-rose-700'} text-white hover:scale-105 transition-transform`}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium flex items-center justify-between">
                            <span>Saldo</span>
                            <CircleDollarSign className="h-5 w-5" />
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">{formatCurrency(balanceData.balance)}</div>
                          <p className="text-xs text-white/80 mt-1">Receitas - Despesas</p>
                        </CardContent>
                      </Card>

                      {/* Reserva de Emergência - Simplificado */}
                    {settings && (
                      <Card className="bg-gradient-to-br from-yellow-500 to-amber-600 text-white hover:scale-105 transition-transform">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium flex items-center justify-between">
                            <span>Reserva de Emergência</span>
                            <CircleDollarSign className="h-5 w-5" />
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">{formatCurrency(settings.emergencyReserve)}</div>
                          <p className="text-xs text-white/80 mt-1">Bloqueado para emergências</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Tabela de Despesas */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>Despesas - {monthName}</span>
                          <span className="text-sm font-normal text-muted-foreground">
                            {expenses.length} registro(s)
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Descrição</TableHead>
                                <TableHead>Categoria</TableHead>
                                <TableHead>Valor</TableHead>
                                <TableHead>Vencimento</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Ação</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {expenses.length === 0 ? (
                                <TableRow>
                                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    Nenhuma despesa neste mês
                                  </TableCell>
                                </TableRow>
                              ) : (
                                expenses.map((expense) => {
                                  const amount = getAmount(expense.amount);
                                  const dueDate = typeof expense.dueDate === 'string' 
                                    ? new Date(expense.dueDate) 
                                    : expense.dueDate;
                                  const isOverdue = expense.status !== "PAGO" && dueDate < new Date();

                                  return (
                                    <TableRow key={expense.id}>
                                      <TableCell className="font-medium">{expense.description}</TableCell>
                                      <TableCell>
                                        <Badge variant="outline">
                                          {expense.category.replace(/_/g, " ")}
                                        </Badge>
                                      </TableCell>
                                      <TableCell>{formatCurrency(amount)}</TableCell>
                                      <TableCell>{formatDate(expense.dueDate)}</TableCell>
                                      <TableCell>
                                        <Badge
                                          className={
                                            expense.status === "PAGO"
                                              ? "bg-green-500 text-white"
                                              : isOverdue
                                              ? "bg-red-500 text-white animate-pulse"
                                              : "bg-orange-500 text-white"
                                          }
                                        >
                                          {expense.status === "PAGO" 
                                            ? "Pago" 
                                            : isOverdue 
                                            ? "Atrasado" 
                                            : "Pendente"}
                                        </Badge>
                                      </TableCell>
                                      <TableCell className="text-right">
                                        {expense.status !== "PAGO" && (
                                          <Button
                                            size="sm"
                                            className="bg-green-600 hover:bg-green-700 text-white"
                                            onClick={() => handlePayExpense(expense.id)}
                                            disabled={payingExpenseId === expense.id}
                                          >
                                            {payingExpenseId === expense.id ? "Pagando..." : "Pagar"}
                                          </Button>
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  );
                                })
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Tabela de Receitas */}
                    {revenues.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <span>Receitas - {monthName}</span>
                            <span className="text-sm font-normal text-muted-foreground">
                              {revenues.length} registro(s)
                            </span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="rounded-md border">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Descrição</TableHead>
                                  <TableHead>Categoria</TableHead>
                                  <TableHead>Valor</TableHead>
                                  <TableHead>Data de Recebimento</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {revenues.map((revenue) => {
                                  const amount = getAmount(revenue.amount);
                                  return (
                                    <TableRow key={revenue.id}>
                                      <TableCell className="font-medium">{revenue.description}</TableCell>
                                      <TableCell>
                                        <Badge variant="outline" className="bg-green-50">
                                          {revenue.category.replace(/_/g, " ")}
                                        </Badge>
                                      </TableCell>
                                      <TableCell className="text-green-600 font-semibold">
                                        {formatCurrency(amount)}
                                      </TableCell>
                                      <TableCell>{formatDate(revenue.receivedAt)}</TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )
              )}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}
