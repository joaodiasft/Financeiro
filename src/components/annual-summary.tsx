"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  PieChart,
  Wallet,
} from "lucide-react";

interface MonthSummary {
  month: string;
  revenues: number;
  expenses: number;
  balance: number;
  expensesPaid: number;
  expensesPending: number;
}

interface AnnualSummaryProps {
  totalRevenues: number;
  totalExpenses: number;
  totalBalance: number;
  monthlyData: MonthSummary[];
}

export function AnnualSummary({
  totalRevenues,
  totalExpenses,
  totalBalance,
  monthlyData,
}: AnnualSummaryProps) {
  const isPositive = totalBalance >= 0;
  const averageMonthly = totalExpenses / 12;
  const bestMonth = monthlyData.reduce((best, month) =>
    month.balance > best.balance ? month : best
  );
  const worstMonth = monthlyData.reduce((worst, month) =>
    month.balance < worst.balance ? month : worst
  );

  return (
    <div className="space-y-6">
      {/* Cards Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Receitas Totais 2026
                </p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {formatCurrency(totalRevenues)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Média: {formatCurrency(totalRevenues / 12)}/mês
                </p>
              </div>
              <div className="rounded-full p-3 bg-green-100">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Despesas Totais 2026
                </p>
                <p className="text-3xl font-bold text-red-600 mt-2">
                  {formatCurrency(totalExpenses)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Média: {formatCurrency(averageMonthly)}/mês
                </p>
              </div>
              <div className="rounded-full p-3 bg-red-100">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`bg-gradient-to-br ${
            isPositive
              ? "from-blue-50 to-cyan-50 border-blue-200"
              : "from-red-50 to-rose-50 border-red-200"
          }`}
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Saldo Anual 2026
                </p>
                <p
                  className={`text-3xl font-bold mt-2 ${
                    isPositive ? "text-blue-600" : "text-red-600"
                  }`}
                >
                  {formatCurrency(totalBalance)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {isPositive ? "Lucro" : "Prejuízo"} no ano
                </p>
              </div>
              <div
                className={`rounded-full p-3 ${
                  isPositive ? "bg-blue-100" : "bg-red-100"
                }`}
              >
                <DollarSign
                  className={`h-6 w-6 ${
                    isPositive ? "text-blue-600" : "text-red-600"
                  }`}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Contas Fixas/Mês
                </p>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  R$ 1.400
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  4 contas recorrentes
                </p>
              </div>
              <div className="rounded-full p-3 bg-purple-100">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumo Mensal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Resumo Mensal 2026
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {monthlyData.map((month) => (
              <div
                key={month.month}
                className="flex items-center justify-between p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div>
                  <p className="font-medium">{month.month}</p>
                  <p className="text-xs text-muted-foreground">
                    {month.expensesPending > 0
                      ? `${month.expensesPending} pendente(s)`
                      : "Tudo pago"}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`font-bold ${
                      month.balance >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {formatCurrency(month.balance)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(month.expenses)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Destaques */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Melhor Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              {bestMonth.month}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Saldo de {formatCurrency(bestMonth.balance)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-900 flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Pior Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">
              {worstMonth.month}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Saldo de {formatCurrency(worstMonth.balance)}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
