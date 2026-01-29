"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/format";

interface Revenue {
  id: string;
  description: string;
  amount: number;
  receivedAt: string;
  category: string;
  paymentMethod?: string | null;
}

interface RevenuesListProps {
  revenues: Revenue[];
}

const categoryLabels: Record<string, string> = {
  MATRICULA: "Matrícula",
  MENSALIDADE: "Mensalidade",
  PARCELAMENTO: "Parcelamento",
  TAXA_EXTRA: "Taxa Extra",
  PAGAMENTO_AVULSO: "Pagamento Avulso",
  OUTRAS_RECEITAS: "Outras Receitas",
};

const paymentMethodLabels: Record<string, string> = {
  dinheiro: "Dinheiro",
  pix: "PIX",
  cartao_credito: "Cartão de Crédito",
  cartao_debito: "Cartão de Débito",
  transferencia: "Transferência",
  boleto: "Boleto",
};

export function RevenuesList({ revenues }: RevenuesListProps) {
  if (revenues.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhuma receita encontrada
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
            <TableHead>Data</TableHead>
            <TableHead>Forma de Pagamento</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {revenues.map((revenue) => (
            <TableRow key={revenue.id}>
              <TableCell className="font-medium max-w-xs">
                {revenue.description}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {categoryLabels[revenue.category] || revenue.category}
                </Badge>
              </TableCell>
              <TableCell className="font-semibold text-green-600">
                {formatCurrency(revenue.amount)}
              </TableCell>
              <TableCell>{formatDate(revenue.receivedAt)}</TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {revenue.paymentMethod
                  ? paymentMethodLabels[revenue.paymentMethod] || revenue.paymentMethod
                  : "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
