import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Iniciando seed...");

  // Criar 3 usuários
  const users = [
    { name: "JC", email: "jc@redas.com", password: "jc29" },
    { name: "MA", email: "ma@redas.com", password: "ma19" },
    { name: "CL", email: "cl@redas.com", password: "cl07" },
  ];

  for (const user of users) {
    const passwordHash = await bcrypt.hash(user.password, 10);
    await prisma.user.upsert({
      where: { email: user.email },
      update: { passwordHash },
      create: {
        name: user.name,
        email: user.email,
        passwordHash,
        role: "ADMIN",
      },
    });
    console.log(`✓ Usuário ${user.name} criado/atualizado`);
  }

  // Criar contas fixas recorrentes
  const recurringBills = [
    { name: "Internet", category: "AGUA_LUZ_INTERNET", amount: 110, dayOfMonth: 5 },
    { name: "Alarme", category: "OPERACIONAL", amount: 140, dayOfMonth: 5 },
    { name: "Segurança", category: "OPERACIONAL", amount: 50, dayOfMonth: 5 },
    { name: "Aluguel", category: "ALUGUEL", amount: 1100, dayOfMonth: 10 },
  ];

  for (const bill of recurringBills) {
    const existing = await prisma.recurringBill.findFirst({
      where: { name: bill.name },
    });

    if (!existing) {
      await prisma.recurringBill.create({
        data: bill,
      });
      console.log(`✓ Conta fixa ${bill.name} criada`);
    } else {
      console.log(`✓ Conta fixa ${bill.name} já existe`);
    }
  }

  // Gerar despesas mensais para 2026
  const year = 2026;
  const createdBills = await prisma.recurringBill.findMany();
  
  for (let month = 1; month <= 12; month++) {
    for (const bill of recurringBills) {
      const dueDate = new Date(year, month - 1, bill.dayOfMonth);
      const recurringBill = createdBills.find((b) => b.name === bill.name);
      
      // Verificar se já existe essa despesa
      const existing = await prisma.expense.findFirst({
        where: {
          description: bill.name,
          dueDate: dueDate,
        },
      });

      if (!existing && recurringBill) {
        await prisma.expense.create({
          data: {
            category: bill.category as any,
            description: bill.name,
            amount: bill.amount,
            dueDate: dueDate,
            status: "PENDENTE",
            vendor: bill.name,
            recurringBillId: recurringBill.id,
          },
        });
      }
    }
  }

  console.log("✓ Despesas recorrentes de 2026 criadas");
  console.log("\n✅ Seed concluído!");
  console.log("\nUsuários criados:");
  console.log("- jc@redas.com (senha: jc29)");
  console.log("- ma@redas.com (senha: ma19)");
  console.log("- cl@redas.com (senha: cl07)");
}

main()
  .catch((e) => {
    console.error("Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
    await prisma.$disconnect();
  });
