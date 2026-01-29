import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import LogoutButton from "@/components/logout-button";

export default function AppHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold">Financeiro Escolar</h1>
            <Badge variant="secondary">Administrador</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Controle completo de receitas, despesas e matrículas.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Separator orientation="vertical" className="h-8" />
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
