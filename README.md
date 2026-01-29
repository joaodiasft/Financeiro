# 🎓 REDAS - Sistema Financeiro Escolar

Sistema financeiro completo desenvolvido em Next.js 16 para gestão escolar, com controle de receitas, despesas, contas fixas e reserva de emergência.

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-7.3.0-2D3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-336791?logo=postgresql)

## 🚀 Tecnologias

- **Framework**: Next.js 16 (App Router + Turbopack)
- **Linguagem**: TypeScript
- **Banco de Dados**: PostgreSQL (Prisma ORM)
- **UI Components**: shadcn/ui
- **Estilização**: Tailwind CSS v4
- **Autenticação**: Session-based com cookies
- **Gráficos**: Recharts

## ✨ Funcionalidades

### 🔐 Autenticação
- Login seguro com email e senha
- 3 usuários administradores configurados
- Sessão criptografada com cookies HTTP-only

### 💰 Gestão Financeira
- **Dashboard Completo**: Visão geral com cards animados
- **Receitas**: Cadastro com categorias e formas de pagamento
- **Despesas**: Gestão completa com status e vencimentos
- **Contas Fixas Recorrentes**: Internet, Alarme, Segurança, Aluguel
- **Reserva de Emergência**: Configurável com meta e progresso

### 📊 Relatórios
- Balanço mensal e anual
- Filtros por período (Janeiro a Dezembro + Ano Completo)
- Indicadores de tendência
- Alertas de contas atrasadas

### 🎨 Interface Moderna
- Sidebar fixa com navegação
- Cards com gradientes e animações
- Tabelas interativas com busca
- Hover effects e micro-interações
- Design responsivo

## 🛠️ Instalação

### Pré-requisitos
- Node.js 18+
- PostgreSQL ou conta no Prisma.io

### Passo a Passo

1. **Clone o repositório**
```bash
git clone https://github.com/joaodiasft/Financeiro.git
cd Financeiro
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o banco de dados**

Crie um arquivo `.env` na raiz:
```env
DATABASE_URL="sua-connection-string-postgresql"
AUTH_SECRET="seu-secret-aleatorio-de-32-caracteres"
```

4. **Configure o Prisma**
```bash
npm run prisma:generate
npx prisma db push
npm run prisma:seed
```

5. **Inicie o servidor**
```bash
npm run dev
```

Acesse: http://localhost:3000

## 👥 Credenciais de Login

| Email | Senha |
|-------|-------|
| jc@redas.com | jc29 |
| ma@redas.com | ma19 |
| cl@redas.com | cl07 |

## 💳 Contas Fixas Pré-configuradas

| Conta | Valor | Vencimento |
|-------|-------|------------|
| Internet | R$ 110,00 | Dia 05 |
| Alarme | R$ 140,00 | Dia 05 |
| Segurança | R$ 50,00 | Dia 05 |
| Aluguel | R$ 1.100,00 | Dia 10 |

**Total Mensal**: R$ 1.400,00

## 📁 Estrutura do Projeto

```
├── prisma/
│   ├── schema.prisma      # Modelos do banco
│   └── seed.ts            # Dados iniciais
├── src/
│   ├── app/
│   │   ├── (auth)/        # Páginas de autenticação
│   │   ├── (protected)/   # Páginas protegidas
│   │   └── api/           # API Routes
│   ├── components/
│   │   ├── ui/            # Componentes shadcn/ui
│   │   └── ...            # Componentes customizados
│   └── lib/
│       ├── prisma.ts      # Cliente Prisma
│       ├── auth.ts        # Funções de autenticação
│       └── ...
└── scripts/
    └── reset-db.ts        # Script de reset do banco
```

## 🔄 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Prisma
npm run prisma:generate  # Gera o Prisma Client
npm run prisma:seed      # Popula o banco

# Reset completo do banco
npx tsx scripts/reset-db.ts
npm run prisma:seed
```

## 📊 Modelos do Banco

- **User**: Usuários administradores
- **Revenue**: Receitas
- **Expense**: Despesas
- **RecurringBill**: Contas fixas recorrentes
- **FinancialSettings**: Configurações (reserva de emergência)
- **Student**: Alunos
- **Enrollment**: Matrículas
- **Tuition**: Mensalidades
- **Scholarship**: Bolsas
- **Discount**: Descontos
- **AccountReceivable**: Contas a receber
- **AccountPayable**: Contas a pagar
- **Report**: Relatórios
- **SystemLog**: Logs do sistema

## 🎨 Componentes Principais

### Cards Modernos
- `ModernBalanceCard`: Cards com gradientes e animações
- `EmergencyReserveCard`: Card de reserva de emergência

### Tabelas Interativas
- `ModernExpensesTable`: Tabela de despesas com busca e filtros
- `RevenuesList`: Lista de receitas

### Diálogos
- `AddRevenueDialog`: Formulário de nova receita
- `AddExpenseDialog`: Formulário de nova despesa

## 🔒 Segurança

- Autenticação baseada em sessão
- Cookies HTTP-only e Secure
- Middleware de proteção de rotas
- Logs de auditoria no sistema
- Senhas hasheadas com bcrypt

## 📱 Responsividade

O sistema é totalmente responsivo e se adapta a:
- Desktop (1280px+)
- Tablet (768px - 1279px)
- Mobile (< 768px)

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Autor

**João Dias**

- GitHub: [@joaodiasft](https://github.com/joaodiasft)

---

⭐ Se este projeto te ajudou, considere dar uma estrela!
