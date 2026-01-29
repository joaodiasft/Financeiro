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
import { Input } from "@/components/ui/input";
import { formatCurrency, formatDate } from "@/lib/format";
import {
  Check,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Expense {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  paidAt: string | null;
  status: string;
  category: string;
}

interface ModernExpensesTableProps {
  expenses: Expense[];
  onPaymentUpdate: () => void;
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

const categoryColors: Record<string, string> = {
  SALARIOS: "bg-purple-100 text-purple-700 border-purple-200",
  ALUGUEL: "bg-blue-100 text-blue-700 border-blue-200",
  MATERIAIS: "bg-amber-100 text-amber-700 border-amber-200",
  AGUA_LUZ_INTERNET: "bg-cyan-100 text-cyan-700 border-cyan-200",
  MARKETING: "bg-pink-100 text-pink-700 border-pink-200",
  MANUTENCAO: "bg-orange-100 text-orange-700 border-orange-200",
  OPERACIONAL: "bg-indigo-100 text-indigo-700 border-indigo-200",
  OUTROS: "bg-gray-100 text-gray-700 border-gray-200",
};

export function ModernExpensesTable({
  expenses,
  onPaymentUpdate,
}: ModernExpensesTableProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredExpenses = (expenses || []).filter((expense) =>
    expense.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      return (
        <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
          <Check className="h-3 w-3 mr-1" />
          Pago
        </Badge>
      );
    }
    if (new Date(dueDate) < new Date() && status === "PENDENTE") {
      return (
        <Badge variant="destructive" className="animate-pulse">
          Atrasado
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200">
        Pendente
      </Badge>
    );
  };

  const totalAmount = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const paidAmount = filteredExpenses
    .filter((exp) => exp.status === "PAGO")
    .reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar despesas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtrar
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="flex gap-4 rounded-lg bg-muted/50 p-4">
        <div>
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="text-lg font-bold">{formatCurrency(totalAmount)}</p>
        </div>
        <div className="border-l pl-4">
          <p className="text-xs text-muted-foreground">Pago</p>
          <p className="text-lg font-bold text-green-600">
            {formatCurrency(paidAmount)}
          </p>
        </div>
        <div className="border-l pl-4">
          <p className="text-xs text-muted-foreground">Pendente</p>
          <p className="text-lg font-bold text-orange-600">
            {formatCurrency(totalAmount - paidAmount)}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Descrição</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExpenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Nenhuma despesa encontrada
                </TableCell>
              </TableRow>
            ) : (
              filteredExpenses.map((expense) => (
                <TableRow
                  key={expense.id}
                  className="group hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="font-medium max-w-xs">
                    {expense.description}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={categoryColors[expense.category]}
                    >
                      {categoryLabels[expense.category] || expense.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-red-600">
                    {formatCurrency(expense.amount)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDate(expense.dueDate)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(expense.status, expense.dueDate)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
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
                          {formatDate(expense.paidAt!)}
                        </span>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
