"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
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

interface ModernBalanceCardProps {
  data: BalanceData;
}

export function ModernBalanceCard({ data }: ModernBalanceCardProps) {
  const isPositive = data.balance >= 0;
  const balancePercentage =
    data.totalRevenues > 0
      ? ((data.balance / data.totalRevenues) * 100).toFixed(1)
      : "0";

  const cards = [
    {
      title: "Receitas Totais",
      value: data.totalRevenues,
      count: data.revenuesCount,
      label: data.revenuesCount === 1 ? "receita" : "receitas",
      icon: TrendingUp,
      trend: "+12.5%",
      trendUp: true,
      gradient: "from-green-500 to-emerald-600",
      bgGradient: "from-green-50 to-emerald-50",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      textColor: "text-green-600",
    },
    {
      title: "Despesas Pagas",
      value: data.totalExpensesPaid,
      count: data.expensesPaidCount,
      label: data.expensesPaidCount === 1 ? "despesa paga" : "despesas pagas",
      icon: TrendingDown,
      trend: "-8.2%",
      trendUp: false,
      gradient: "from-red-500 to-rose-600",
      bgGradient: "from-red-50 to-rose-50",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      textColor: "text-red-600",
    },
    {
      title: "Despesas Pendentes",
      value: data.totalExpensesPending,
      count: data.expensesPendingCount,
      label: data.expensesPendingCount === 1 ? "pendente" : "pendentes",
      icon: Clock,
      trend: "3 vencendo",
      trendUp: false,
      gradient: "from-orange-500 to-amber-600",
      bgGradient: "from-orange-50 to-amber-50",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      textColor: "text-orange-600",
    },
    {
      title: "Saldo do Período",
      value: data.balance,
      count: null,
      label: isPositive ? "Lucro" : "Prejuízo",
      icon: DollarSign,
      trend: `${balancePercentage}%`,
      trendUp: isPositive,
      gradient: isPositive
        ? "from-blue-500 to-cyan-600"
        : "from-red-500 to-rose-600",
      bgGradient: isPositive
        ? "from-blue-50 to-cyan-50"
        : "from-red-50 to-rose-50",
      iconBg: isPositive ? "bg-blue-100" : "bg-red-100",
      iconColor: isPositive ? "text-blue-600" : "text-red-600",
      textColor: isPositive ? "text-blue-600" : "text-red-600",
    },
  ];

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => (
          <Card
            key={index}
            className={`relative overflow-hidden border-none bg-gradient-to-br ${card.bgGradient} transition-all hover:shadow-lg hover:scale-[1.02]`}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </p>
                  <div>
                    <p className={`text-3xl font-bold ${card.textColor}`}>
                      {formatCurrency(card.value)}
                    </p>
                    {card.count !== null && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {card.count} {card.label}
                      </p>
                    )}
                    {card.count === null && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {card.label}
                      </p>
                    )}
                  </div>
                </div>
                <div className={`rounded-full p-3 ${card.iconBg}`}>
                  <card.icon className={`h-5 w-5 ${card.iconColor}`} />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                {card.trendUp ? (
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-600" />
                )}
                <span
                  className={`text-xs font-medium ${
                    card.trendUp ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {card.trend}
                </span>
                <span className="text-xs text-muted-foreground">
                  vs. mês anterior
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {data.expensesOverdueCount > 0 && (
        <Card className="border-red-200 bg-gradient-to-r from-red-50 to-rose-50">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-red-100 p-3">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-red-900">
                  Atenção: Contas Atrasadas
                </h3>
                <Badge variant="destructive" className="rounded-full">
                  {data.expensesOverdueCount}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-red-700">
                Você tem {formatCurrency(data.totalExpensesOverdue)} em contas
                atrasadas que precisam de atenção imediata.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
