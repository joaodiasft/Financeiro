"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TrendingDown, Loader2 } from "lucide-react";

interface AddExpenseDialogProps {
  onSuccess?: () => void;
}

const expenseCategories = [
  { value: "SALARIOS", label: "Salários" },
  { value: "ALUGUEL", label: "Aluguel" },
  { value: "MATERIAIS", label: "Materiais" },
  { value: "AGUA_LUZ_INTERNET", label: "Água, Luz e Internet" },
  { value: "MARKETING", label: "Marketing" },
  { value: "MANUTENCAO", label: "Manutenção" },
  { value: "OPERACIONAL", label: "Operacional" },
  { value: "OUTROS", label: "Outros" },
];

const paymentMethods = [
  { value: "dinheiro", label: "Dinheiro" },
  { value: "pix", label: "PIX" },
  { value: "cartao_credito", label: "Cartão de Crédito" },
  { value: "cartao_debito", label: "Cartão de Débito" },
  { value: "transferencia", label: "Transferência Bancária" },
  { value: "boleto", label: "Boleto" },
];

export function AddExpenseDialog({ onSuccess }: AddExpenseDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    category: "",
    description: "",
    amount: "",
    dueDate: new Date().toISOString().split("T")[0],
    vendor: "",
    paymentMethod: "",
    paidAt: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.category || !formData.description || !formData.amount || !formData.dueDate) {
      setError("Preencha todos os campos obrigatórios");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: formData.category,
          description: formData.description,
          amount: parseFloat(formData.amount),
          dueDate: new Date(formData.dueDate).toISOString(),
          vendor: formData.vendor || null,
          paymentMethod: formData.paymentMethod || null,
          paidAt: formData.paidAt ? new Date(formData.paidAt).toISOString() : null,
        }),
      });

      if (response.ok) {
        setFormData({
          category: "",
          description: "",
          amount: "",
          dueDate: new Date().toISOString().split("T")[0],
          vendor: "",
          paymentMethod: "",
          paidAt: "",
        });
        setOpen(false);
        onSuccess?.();
      } else {
        setError("Erro ao adicionar despesa");
      }
    } catch (err) {
      setError("Erro ao adicionar despesa");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
          <TrendingDown className="h-4 w-4 mr-2" />
          Lançar Despesa
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Lançar Nova Despesa</DialogTitle>
          <DialogDescription>
            Adicione uma nova saída financeira ao sistema
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">
              Categoria <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                {expenseCategories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Descrição <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Ex: Compra de material escolar"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">
                Valor (R$) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">
                Data de Vencimento <span className="text-red-500">*</span>
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vendor">Fornecedor/Beneficiário</Label>
            <Input
              id="vendor"
              placeholder="Ex: Papelaria Central"
              value={formData.vendor}
              onChange={(e) =>
                setFormData({ ...formData, vendor: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Forma de Pagamento</Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value) =>
                  setFormData({ ...formData, paymentMethod: value })
                }
              >
                <SelectTrigger id="paymentMethod">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paidAt">Data de Pagamento</Label>
              <Input
                id="paidAt"
                type="date"
                value={formData.paidAt}
                onChange={(e) =>
                  setFormData({ ...formData, paidAt: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground">
                Deixe em branco se ainda não foi pago
              </p>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Despesa"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
