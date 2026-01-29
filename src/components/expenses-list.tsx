"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/format";
import { Check } from "lucide-react";

interface Expense {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  paidAt: string | null;
  status: string;
  category: string;
}

const categoryLabels: Record<string, string> = {
  SALARIOS: "Salários",
  ALUGUEL: "Aluguel",
  MATERIAIS: "Materiais",
  AGUA_LUZ_INTERNET: "Água, Luz e Internet",
  MARKETING: "Marketing",
  MANUTENCAO: "Manutenção",
  OPERACIONAL: "Operacional",
  OUTROS: "Outros",
};

interface ExpensesListProps {
  expenses: Expense[];
  onPaymentUpdate: () => void;
}

export function ExpensesList({ expenses, onPaymentUpdate }: ExpensesListProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleMarkAsPaid = async (id: string) => {
    setLoading(id);
    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paidAt: new Date().toISOString(),
          status: "PAGO",
        }),
      });

      if (response.ok) {
        onPaymentUpdate();
      }
    } catch (error) {
      console.error("Erro ao marcar como pago:", error);
    } finally {
      setLoading(null);
    }
  };

  const getStatusBadge = (status: string, dueDate: string) => {
    if (status === "PAGO") {
      return <Badge variant="default" className="bg-green-600">Pago</Badge>;
    }
    if (new Date(dueDate) < new Date() && status === "PENDENTE") {
      return <Badge variant="destructive">Atrasado</Badge>;
    }
    return <Badge variant="secondary">Pendente</Badge>;
  };

  if (expenses.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhuma despesa encontrada
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Descrição</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell className="font-medium max-w-xs">{expense.description}</TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  {categoryLabels[expense.category] || expense.category}
                </Badge>
              </TableCell>
              <TableCell className="font-semibold text-red-600">
                {formatCurrency(expense.amount)}
              </TableCell>
              <TableCell>{formatDate(expense.dueDate)}</TableCell>
              <TableCell>
                {getStatusBadge(expense.status, expense.dueDate)}
              </TableCell>
              <TableCell className="text-right">
                {expense.status !== "PAGO" ? (
                  <Button
                    size="sm"
                    onClick={() => handleMarkAsPaid(expense.id)}
                    disabled={loading === expense.id}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    {loading === expense.id ? "..." : "Pagar"}
                  </Button>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    Pago em {formatDate(expense.paidAt!)}
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
