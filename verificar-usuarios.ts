import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("\n🔍 Verificando usuários no banco de dados...\n");

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  if (users.length === 0) {
    console.log("❌ Nenhum usuário encontrado! Execute: npm run prisma:seed\n");
    return;
  }

  console.log(`✅ ${users.length} usuário(s) encontrado(s):\n`);
  
  users.forEach((user, index) => {
    console.log(`${index + 1}. ${user.name}`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Criado em: ${user.createdAt.toLocaleString('pt-BR')}`);
    console.log("");
  });

  console.log("📝 Para fazer login, use:");
  console.log("   jc@redas.com / jc29");
  console.log("   ma@redas.com / ma19");
  console.log("   cl@redas.com / cl07\n");
}

main()
  .catch((e) => {
    console.error("Erro:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
