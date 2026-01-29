"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type FinanceChartProps = {
  data: {
    month: string;
    receitas: number;
    despesas: number;
  }[];
};

export default function FinanceChart({ data }: FinanceChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Receitas x Despesas (últimos meses)</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="4 4" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--popover))",
                borderColor: "hsl(var(--border))",
                color: "hsl(var(--popover-foreground))",
              }}
            />
            <Legend />
            <Bar dataKey="receitas" fill="hsl(var(--chart-1))" radius={[6, 6, 0, 0]} />
            <Bar dataKey="despesas" fill="hsl(var(--chart-2))" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
