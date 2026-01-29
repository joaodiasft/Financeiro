"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertCircle,
  Clock,
} from "lucide-react";

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

interface BalanceCardProps {
  data: BalanceData;
}

export function BalanceCard({ data }: BalanceCardProps) {
  const isPositive = data.balance >= 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Receitas Totais
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(data.totalRevenues)}
          </div>
          <p className="text-xs text-muted-foreground">
            {data.revenuesCount} {data.revenuesCount === 1 ? "receita" : "receitas"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Despesas Pagas
          </CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {formatCurrency(data.totalExpensesPaid)}
          </div>
          <p className="text-xs text-muted-foreground">
            {data.expensesPaidCount} {data.expensesPaidCount === 1 ? "despesa paga" : "despesas pagas"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Despesas Pendentes
          </CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">
            {formatCurrency(data.totalExpensesPending)}
          </div>
          <p className="text-xs text-muted-foreground">
            {data.expensesPendingCount} {data.expensesPendingCount === 1 ? "conta pendente" : "contas pendentes"}
          </p>
        </CardContent>
      </Card>

      <Card className={isPositive ? "border-green-200" : "border-red-200"}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Saldo do Período
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {formatCurrency(data.balance)}
          </div>
          <p className="text-xs text-muted-foreground">
            {isPositive ? "Lucro" : "Prejuízo"}
          </p>
        </CardContent>
      </Card>

      {data.expensesOverdueCount > 0 && (
        <Card className="border-destructive md:col-span-2 lg:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-destructive">
              <AlertCircle className="inline-block h-4 w-4 mr-2" />
              Contas Atrasadas
            </CardTitle>
            <Badge variant="destructive">{data.expensesOverdueCount}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {formatCurrency(data.totalExpensesOverdue)}
            </div>
            <p className="text-xs text-muted-foreground">
              {data.expensesOverdueCount} {data.expensesOverdueCount === 1 ? "conta atrasada" : "contas atrasadas"} precisam de atenção
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
