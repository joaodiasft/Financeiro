"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/format";
import { Shield, Edit, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EmergencyReserveCardProps {
  reserve: number;
  goal: number;
  availableBalance: number;
  onUpdate?: () => void;
}

export function EmergencyReserveCard({
  reserve,
  goal,
  availableBalance,
  onUpdate,
}: EmergencyReserveCardProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    reserve: reserve.toString(),
    goal: goal.toString(),
  });

  const percentage = goal > 0 ? (reserve / goal) * 100 : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/financial-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emergencyReserve: parseFloat(formData.reserve),
          emergencyReserveGoal: parseFloat(formData.goal),
        }),
      });

      if (response.ok) {
        setOpen(false);
        onUpdate?.();
      } else {
        setError("Erro ao atualizar reserva");
      }
    } catch (err) {
      setError("Erro ao atualizar reserva");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-blue-900">
          <Shield className="inline-block h-4 w-4 mr-2" />
          Reserva de Emergência
        </CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Configurar Reserva de Emergência</DialogTitle>
              <DialogDescription>
                Defina o valor atual e a meta da sua reserva de emergência
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reserve">Valor Atual da Reserva (R$)</Label>
                <Input
                  id="reserve"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.reserve}
                  onChange={(e) =>
                    setFormData({ ...formData, reserve: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal">Meta da Reserva (R$)</Label>
                <Input
                  id="goal"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.goal}
                  onChange={(e) =>
                    setFormData({ ...formData, goal: e.target.value })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Recomenda-se 3 a 6 meses de despesas
                </p>
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
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <div className="text-2xl font-bold text-blue-900">
              {formatCurrency(reserve)}
            </div>
            <p className="text-xs text-blue-700">
              Meta: {formatCurrency(goal)}
            </p>
          </div>

          {goal > 0 && (
            <div className="space-y-1">
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
              <p className="text-xs text-blue-700">
                {percentage.toFixed(0)}% da meta alcançada
              </p>
            </div>
          )}

          <div className="pt-2 border-t border-blue-200">
            <p className="text-sm font-medium text-blue-900">
              Saldo Disponível
            </p>
            <p className="text-xl font-bold text-green-700">
              {formatCurrency(availableBalance)}
            </p>
            <p className="text-xs text-muted-foreground">
              (Saldo total menos reserva bloqueada)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
