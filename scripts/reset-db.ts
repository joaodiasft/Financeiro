import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function reset() {
  console.log("🗑️  Limpando banco de dados...");

  try {
    // Deletar dados na ordem correta (respeitando constraints)
    await prisma.systemLog.deleteMany({});
    console.log("✓ Logs deletados");

    await prisma.report.deleteMany({});
    console.log("✓ Relatórios deletados");

    await prisma.revenue.deleteMany({});
    console.log("✓ Receitas deletadas");

    await prisma.expense.deleteMany({});
    console.log("✓ Despesas deletadas");

    await prisma.accountReceivable.deleteMany({});
    console.log("✓ Contas a receber deletadas");

    await prisma.accountPayable.deleteMany({});
    console.log("✓ Contas a pagar deletadas");

    await prisma.recurringBill.deleteMany({});
    console.log("✓ Contas fixas deletadas");

    await prisma.tuition.deleteMany({});
    console.log("✓ Mensalidades deletadas");

    await prisma.enrollment.deleteMany({});
    console.log("✓ Matrículas deletadas");

    await prisma.student.deleteMany({});
    console.log("✓ Alunos deletados");

    await prisma.scholarship.deleteMany({});
    console.log("✓ Bolsas deletadas");

    await prisma.discount.deleteMany({});
    console.log("✓ Descontos deletados");

    await prisma.financialSettings.deleteMany({});
    console.log("✓ Configurações financeiras deletadas");

    await prisma.user.deleteMany({});
    console.log("✓ Usuários deletados");

    console.log("\n✅ Banco de dados resetado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao resetar:", error);
    throw error;
  } finally {
    await pool.end();
    await prisma.$disconnect();
  }
}

reset();
