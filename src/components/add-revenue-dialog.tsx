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
import { TrendingUp, Loader2 } from "lucide-react";

interface AddRevenueDialogProps {
  onSuccess?: () => void;
}

const revenueCategories = [
  { value: "MATRICULA", label: "Matrícula" },
  { value: "MENSALIDADE", label: "Mensalidade" },
  { value: "PARCELAMENTO", label: "Parcelamento" },
  { value: "TAXA_EXTRA", label: "Taxa Extra" },
  { value: "PAGAMENTO_AVULSO", label: "Pagamento Avulso" },
  { value: "OUTRAS_RECEITAS", label: "Outras Receitas" },
];

const paymentMethods = [
  { value: "dinheiro", label: "Dinheiro" },
  { value: "pix", label: "PIX" },
  { value: "cartao_credito", label: "Cartão de Crédito" },
  { value: "cartao_debito", label: "Cartão de Débito" },
  { value: "transferencia", label: "Transferência Bancária" },
  { value: "boleto", label: "Boleto" },
];

export function AddRevenueDialog({ onSuccess }: AddRevenueDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    category: "",
    description: "",
    amount: "",
    receivedAt: new Date().toISOString().split("T")[0],
    referenceMonth: new Date().toISOString().split("T")[0].slice(0, 7),
    paymentMethod: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.category || !formData.description || !formData.amount) {
      setError("Preencha todos os campos obrigatórios");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/revenues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: formData.category,
          description: formData.description,
          amount: parseFloat(formData.amount),
          receivedAt: new Date(formData.receivedAt).toISOString(),
          referenceMonth: new Date(formData.referenceMonth + "-01").toISOString(),
          paymentMethod: formData.paymentMethod || null,
        }),
      });

      if (response.ok) {
        setFormData({
          category: "",
          description: "",
          amount: "",
          receivedAt: new Date().toISOString().split("T")[0],
          referenceMonth: new Date().toISOString().split("T")[0].slice(0, 7),
          paymentMethod: "",
        });
        setOpen(false);
        onSuccess?.();
      } else {
        setError("Erro ao adicionar receita");
      }
    } catch (err) {
      setError("Erro ao adicionar receita");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">
          <TrendingUp className="h-4 w-4 mr-2" />
          Lançar Receita
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Lançar Nova Receita</DialogTitle>
          <DialogDescription>
            Adicione uma nova entrada financeira ao sistema
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
                {revenueCategories.map((cat) => (
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
              placeholder="Ex: Mensalidade do aluno João Silva"
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
              <Label htmlFor="receivedAt">Data de Recebimento</Label>
              <Input
                id="receivedAt"
                type="date"
                value={formData.receivedAt}
                onChange={(e) =>
                  setFormData({ ...formData, receivedAt: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="referenceMonth">Mês de Referência</Label>
              <Input
                id="referenceMonth"
                type="month"
                value={formData.referenceMonth}
                onChange={(e) =>
                  setFormData({ ...formData, referenceMonth: e.target.value })
                }
              />
            </div>

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
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Receita"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
