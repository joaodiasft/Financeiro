"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, TrendingUp, TrendingDown, Wallet, CircleDollarSign, Calendar as CalendarIcon, PlusCircle, DollarSign, AlertCircle } from "lucide-react";
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
  { value: "0", label: "Resumo Anual", short: "Anual" },
  { value: "1", label: "Janeiro", short: "Jan" },
  { value: "2", label: "Fevereiro", short: "Fev" },
  { value: "3", label: "Março", short: "Mar" },
  { value: "4", label: "Abril", short: "Abr" },
  { value: "5", label: "Maio", short: "Mai" },
  { value: "6", label: "Junho", short: "Jun" },
  { value: "7", label: "Julho", short: "Jul" },
  { value: "8", label: "Agosto", short: "Ago" },
  { value: "9", label: "Setembro", short: "Set" },
  { value: "10", label: "Outubro", short: "Out" },
  { value: "11", label: "Novembro", short: "Nov" },
  { value: "12", label: "Dezembro", short: "Dez" },
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
      
      await fetchData();
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg font-medium text-slate-600">Carregando dados financeiros...</p>
        </div>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto space-y-8 p-6 lg:p-8">
        {/* Header Aprimorado */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 text-transparent bg-clip-text">
              Dashboard Financeiro
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-2 text-slate-600">
                <CalendarIcon className="h-4 w-4" />
                <span className="font-medium">Ano Fiscal 2026</span>
              </div>
              <span className="text-slate-400">•</span>
              <span className="text-sm text-slate-500">{new Date().toLocaleDateString('pt-BR', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <AddRevenueDialog onSuccess={fetchData} />
            <AddExpenseDialog onSuccess={fetchData} />
          </div>
        </div>

        {/* Tabs Melhoradas */}
        <Tabs value={selectedMonth} onValueChange={setSelectedMonth} className="w-full">
          <TabsList className="w-full bg-white border border-slate-200 p-2 rounded-xl grid grid-cols-7 lg:grid-cols-13 gap-1">
            {months.map((month) => (
              <TabsTrigger 
                key={month.value} 
                value={month.value}
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white rounded-lg transition-all"
              >
                <span className="hidden lg:inline">{month.label}</span>
                <span className="lg:hidden">{month.short}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {months.map((month) => (
            <TabsContent key={month.value} value={month.value} className="space-y-6 mt-6">
              {month.value === "0" && balanceData ? (
                /* ===== VISÃO ANUAL ===== */
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-slate-800">Resumo Anual 2026</h2>
                  
                  {/* Cards Anuais */}
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Receitas Totais
                          </span>
                          <TrendingUp className="h-5 w-5" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-4xl font-bold mb-1">{formatCurrency(balanceData.totalRevenues)}</div>
                        <p className="text-xs text-emerald-100">Todas as entradas de 2026</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-rose-500 via-rose-600 to-rose-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Despesas Pagas
                          </span>
                          <TrendingDown className="h-5 w-5" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-4xl font-bold mb-1">{formatCurrency(balanceData.totalExpensesPaid)}</div>
                        <p className="text-xs text-rose-100">Pagamentos realizados</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            Despesas Pendentes
                          </span>
                          <Wallet className="h-5 w-5" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-4xl font-bold mb-1">{formatCurrency(balanceData.totalExpensesPending)}</div>
                        <p className="text-xs text-amber-100">Aguardando pagamento</p>
                      </CardContent>
                    </Card>

                    <Card className={`bg-gradient-to-br ${
                      balanceData.balance >= 0 
                        ? 'from-blue-500 via-blue-600 to-blue-700' 
                        : 'from-red-600 via-red-700 to-red-800'
                    } text-white border-0 shadow-xl hover:shadow-2xl transition-all hover:scale-105`}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <CircleDollarSign className="h-4 w-4" />
                            {balanceData.balance >= 0 ? 'Lucro Anual' : 'Prejuízo Anual'}
                          </span>
                          {balanceData.balance >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-4xl font-bold mb-1">{formatCurrency(balanceData.balance)}</div>
                        <p className="text-xs opacity-90">Resultado do exercício</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Card de Informações Gerais */}
                  <Card className="border-slate-200 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
                      <CardTitle className="text-slate-800">Informações Gerais do Ano</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid gap-6 md:grid-cols-3">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-slate-600">
                            <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                            <span className="text-sm font-medium">Total de Receitas</span>
                          </div>
                          <p className="text-3xl font-bold text-emerald-600">{formatCurrency(balanceData.totalRevenues)}</p>
                          <p className="text-xs text-slate-500">Todas as entradas do ano</p>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-slate-600">
                            <div className="h-2 w-2 rounded-full bg-rose-500"></div>
                            <span className="text-sm font-medium">Total de Despesas</span>
                          </div>
                          <p className="text-3xl font-bold text-rose-600">
                            {formatCurrency(balanceData.totalExpensesPaid + balanceData.totalExpensesPending)}
                          </p>
                          <p className="text-xs text-slate-500">Pagas + Pendentes</p>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-slate-600">
                            <div className={`h-2 w-2 rounded-full ${balanceData.balance >= 0 ? 'bg-blue-500' : 'bg-red-500'}`}></div>
                            <span className="text-sm font-medium">Resultado Final</span>
                          </div>
                          <p className={`text-3xl font-bold ${balanceData.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                            {formatCurrency(balanceData.balance)}
                          </p>
                          <p className="text-xs text-slate-500">{balanceData.balance >= 0 ? 'Lucro no ano' : 'Prejuízo no ano'}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Reserva de Emergência */}
                  {settings && (
                    <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100 shadow-lg">
                      <CardHeader className="border-b border-amber-200">
                        <CardTitle className="flex items-center gap-2 text-amber-800">
                          <CircleDollarSign className="h-5 w-5" />
                          Reserva de Emergência Anual
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="text-4xl font-bold text-amber-700 mb-2">{formatCurrency(settings.emergencyReserve)}</div>
                        <p className="text-sm text-amber-600">Valor bloqueado para emergências e imprevistos</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                /* ===== VISÃO MENSAL ===== */
                balanceData && (
                  <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-slate-800">{monthName} 2026</h2>

                    {/* Cards Mensais - 5 Cards */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
                      <Card className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium flex items-center justify-between">
                            <span>Receitas</span>
                            <TrendingUp className="h-5 w-5" />
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">{formatCurrency(balanceData.totalRevenues)}</div>
                          <p className="text-xs text-emerald-100 mt-1">Recebidas</p>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-rose-500 via-rose-600 to-rose-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium flex items-center justify-between">
                            <span>Pagas</span>
                            <TrendingDown className="h-5 w-5" />
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">{formatCurrency(balanceData.totalExpensesPaid)}</div>
                          <p className="text-xs text-rose-100 mt-1">Despesas</p>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium flex items-center justify-between">
                            <span>Pendentes</span>
                            <Wallet className="h-5 w-5" />
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">{formatCurrency(balanceData.totalExpensesPending)}</div>
                          <p className="text-xs text-amber-100 mt-1">A pagar</p>
                        </CardContent>
                      </Card>

                      <Card className={`bg-gradient-to-br ${
                        balanceData.balance >= 0 
                          ? 'from-blue-500 via-blue-600 to-blue-700' 
                          : 'from-red-600 via-red-700 to-red-800'
                      } text-white border-0 shadow-xl hover:shadow-2xl transition-all hover:scale-105`}>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium flex items-center justify-between">
                            <span>Saldo</span>
                            <CircleDollarSign className="h-5 w-5" />
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">{formatCurrency(balanceData.balance)}</div>
                          <p className="text-xs opacity-90 mt-1">Do mês</p>
                        </CardContent>
                      </Card>

                      {/* Card de Reserva Simplificado */}
                      {settings && (
                        <Card className="bg-gradient-to-br from-yellow-500 via-amber-500 to-amber-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium flex items-center justify-between">
                              <span>Reserva</span>
                              <CircleDollarSign className="h-5 w-5" />
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-bold">{formatCurrency(settings.emergencyReserve)}</div>
                            <p className="text-xs text-amber-100 mt-1">Emergência</p>
                          </CardContent>
                        </Card>
                      )}
                    </div>

                    {/* Tabela de Despesas Aprimorada */}
                    <Card className="border-slate-200 shadow-lg">
                      <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
                        <CardTitle className="flex items-center justify-between text-slate-800">
                          <div className="flex items-center gap-3">
                            <Wallet className="h-5 w-5 text-rose-600" />
                            <span>Despesas - {monthName}</span>
                          </div>
                          <Badge variant="outline" className="text-sm">
                            {expenses.length} registro(s)
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="rounded-lg border border-slate-200 overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-slate-50">
                                <TableHead className="font-semibold">Descrição</TableHead>
                                <TableHead className="font-semibold">Categoria</TableHead>
                                <TableHead className="font-semibold">Valor</TableHead>
                                <TableHead className="font-semibold">Vencimento</TableHead>
                                <TableHead className="font-semibold">Status</TableHead>
                                <TableHead className="text-right font-semibold">Ação</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {expenses.length === 0 ? (
                                <TableRow>
                                  <TableCell colSpan={6} className="h-32 text-center">
                                    <div className="flex flex-col items-center justify-center text-slate-400">
                                      <Wallet className="h-12 w-12 mb-2" />
                                      <p className="font-medium">Nenhuma despesa neste mês</p>
                                    </div>
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
                                    <TableRow key={expense.id} className="hover:bg-slate-50 transition-colors">
                                      <TableCell className="font-medium">{expense.description}</TableCell>
                                      <TableCell>
                                        <Badge variant="outline" className="font-medium">
                                          {expense.category.replace(/_/g, " ")}
                                        </Badge>
                                      </TableCell>
                                      <TableCell className="font-semibold">{formatCurrency(amount)}</TableCell>
                                      <TableCell className="text-slate-600">{formatDate(expense.dueDate)}</TableCell>
                                      <TableCell>
                                        <Badge
                                          className={
                                            expense.status === "PAGO"
                                              ? "bg-emerald-500 text-white hover:bg-emerald-600"
                                              : isOverdue
                                              ? "bg-red-500 text-white animate-pulse hover:bg-red-600"
                                              : "bg-amber-500 text-white hover:bg-amber-600"
                                          }
                                        >
                                          {expense.status === "PAGO" 
                                            ? "✓ Pago" 
                                            : isOverdue 
                                            ? "! Atrasado" 
                                            : "⏳ Pendente"}
                                        </Badge>
                                      </TableCell>
                                      <TableCell className="text-right">
                                        {expense.status !== "PAGO" && (
                                          <Button
                                            size="sm"
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
                                            onClick={() => handlePayExpense(expense.id)}
                                            disabled={payingExpenseId === expense.id}
                                          >
                                            {payingExpenseId === expense.id ? "Pagando..." : "✓ Pagar"}
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

                    {/* Tabela de Receitas Aprimorada */}
                    {revenues.length > 0 && (
                      <Card className="border-slate-200 shadow-lg">
                        <CardHeader className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-b border-emerald-200">
                          <CardTitle className="flex items-center justify-between text-slate-800">
                            <div className="flex items-center gap-3">
                              <TrendingUp className="h-5 w-5 text-emerald-600" />
                              <span>Receitas - {monthName}</span>
                            </div>
                            <Badge variant="outline" className="text-sm">
                              {revenues.length} registro(s)
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <div className="rounded-lg border border-slate-200 overflow-hidden">
                            <Table>
                              <TableHeader>
                                <TableRow className="bg-emerald-50">
                                  <TableHead className="font-semibold">Descrição</TableHead>
                                  <TableHead className="font-semibold">Categoria</TableHead>
                                  <TableHead className="font-semibold">Valor</TableHead>
                                  <TableHead className="font-semibold">Data</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {revenues.map((revenue) => {
                                  const amount = getAmount(revenue.amount);
                                  return (
                                    <TableRow key={revenue.id} className="hover:bg-emerald-50/50 transition-colors">
                                      <TableCell className="font-medium">{revenue.description}</TableCell>
                                      <TableCell>
                                        <Badge variant="outline" className="bg-emerald-50 border-emerald-200 text-emerald-700">
                                          {revenue.category.replace(/_/g, " ")}
                                        </Badge>
                                      </TableCell>
                                      <TableCell className="text-emerald-600 font-bold text-lg">
                                        {formatCurrency(amount)}
                                      </TableCell>
                                      <TableCell className="text-slate-600">{formatDate(revenue.receivedAt)}</TableCell>
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
        </Tabs>
      </div>
    </div>
  );
}
