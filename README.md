# 🎓 REDAS - Sistema Financeiro Escolar

Sistema completo de gestão financeira para instituições de ensino, desenvolvido com Next.js 16, shadcn/ui e Prisma.

## 🚀 Início Rápido

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Banco de Dados
```bash
npm run prisma:generate
npm run prisma:push
npm run prisma:seed
```

### 3. Iniciar Servidor
```bash
npm run dev
```

### 4. Acessar Sistema
Abra: **http://localhost:3000**

## 🔐 Credenciais de Acesso

| Email | Senha | Nome |
|-------|-------|------|
| jc@redas.com | jc29 | Administrador JC |
| ma@redas.com | ma19 | Administrador MA |
| cl@redas.com | cl07 | Administrador CL |

## 💰 Despesas Fixas Mensais (2026)

O sistema cria automaticamente despesas fixas para todos os 12 meses:

| Descrição | Valor | Vencimento |
|-----------|-------|------------|
| Internet Vivo Fibra | R$ 110,00 | Dia 5 |
| Alarme Monitorado | R$ 140,00 | Dia 5 |
| Segurança Patrimonial | R$ 50,00 | Dia 5 |
| Aluguel do Imóvel | R$ 1.100,00 | Dia 10 |

**Total Mensal**: R$ 1.400,00  
**Total Anual**: R$ 16.800,00

## 📊 Funcionalidades

### Dashboard Completo
- **Ano Completo**: Resumo geral com cards totais
- **Por Mês**: Visão detalhada com:
  - 4 cards principais (Receitas, Despesas Pagas, Pendentes, Saldo)
  - Card de Reserva de Emergência
  - Tabela de despesas com botão "Pagar"
  - Tabela de receitas

### Adicionar Movimentações
- **Nova Receita** (botão verde):
  - Categorias: Matrícula, Mensalidade, Taxa Extra, etc.
  - Valor, data de recebimento, método de pagamento
  
- **Nova Despesa** (botão vermelho):
  - Categorias: Aluguel, Salários, Materiais, etc.
  - Valor, vencimento, fornecedor, método
  - Opção de marcar como paga ao criar

### Reserva de Emergência
- Bloqueio de valor para emergências
- Meta configurável
- Saldo disponível = Saldo Total - Reserva
- Barra de progresso visual

### Sistema de Pagamento
- Despesas marcadas como:
  - **Pago** (verde): despesa quitada
  - **Pendente** (laranja): dentro do prazo
  - **Atrasado** (vermelho pulsante): vencimento ultrapassado
- Botão "Pagar" para marcar despesa como paga

## 🛠️ Tecnologias

- **Next.js 16** (App Router + Turbopack)
- **shadcn/ui** (Componentes UI)
- **Prisma 7** (ORM)
- **PostgreSQL** (Banco de dados Prisma Cloud)
- **TypeScript**
- **Tailwind CSS**
- **bcrypt** (Hash de senhas)

## 📁 Estrutura do Projeto

```
fina-redas/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/          # Página de login
│   │   ├── (protected)/
│   │   │   └── dashboard/      # Dashboard principal (única página)
│   │   └── api/
│   │       ├── auth/           # Login/Logout
│   │       ├── balance/        # Cálculo de saldo
│   │       ├── expenses/       # CRUD de despesas
│   │       ├── revenues/       # CRUD de receitas
│   │       └── financial-settings/  # Reserva de emergência
│   ├── components/
│   │   ├── ui/                 # Componentes shadcn
│   │   ├── app-sidebar.tsx     # Sidebar moderna
│   │   ├── login-form.tsx      # Formulário de login
│   │   ├── add-revenue-dialog.tsx
│   │   └── add-expense-dialog.tsx
│   ├── lib/
│   │   ├── auth.ts             # Autenticação
│   │   ├── session.ts          # Gestão de sessão
│   │   ├── prisma.ts           # Cliente Prisma
│   │   └── format.ts           # Formatação de moeda/data
│   └── proxy.ts                # Proteção de rotas (Next.js 16)
├── prisma/
│   ├── schema.prisma           # Schema do banco
│   ├── seed.ts                 # Dados iniciais
│   └── prisma.config.ts        # Config Prisma 7
└── package.json
```

## 🔄 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Prisma
npm run prisma:generate    # Gerar Prisma Client
npm run prisma:push        # Sincronizar schema
npm run prisma:seed        # Popular banco inicial
npm run prisma:studio      # Interface visual do banco

# Resetar banco (cuidado!)
npm run db:reset
```

## ⚙️ Configuração

### Variáveis de Ambiente (.env)
```env
DATABASE_URL="sua-connection-string-aqui"
AUTH_SECRET="seu-secret-aqui"
```

## 🎯 Características Especiais

### Cálculo de Saldo Preciso
- Receitas: soma de todas as receitas recebidas no período
- Despesas Pagas: soma de despesas pagas no período
- Despesas Pendentes: soma de despesas não pagas com vencimento no período
- **Saldo = Receitas - Despesas Pagas**

### Reserva de Emergência
- Valor bloqueado separado do saldo operacional
- Meta configurável
- Progresso visual em %
- Saldo disponível considerando reserva

### Responsividade
- Layout adaptativo para desktop, tablet e mobile
- Sidebar fixa em desktop
- Cards com grid responsivo
- Tabelas com scroll horizontal em telas pequenas

## 📝 Notas de Desenvolvimento

### Migração Next.js 16
- Arquivos `middleware.ts` foram substituídos por `proxy.ts`
- Função exportada deve se chamar `proxy` (não `middleware`)
- Configuração de matcher permanece a mesma

### Prisma 7
- `DATABASE_URL` movida de `schema.prisma` para `prisma.config.ts`
- Uso de adapter `PrismaPg` para PostgreSQL
- Decimal convertido para Number para exibição

## 🐛 Troubleshooting

### Erro 401 (Não Autorizado)
1. Limpe os cookies do navegador
2. Acesse em modo anônimo
3. Faça login novamente

### Servidor não inicia
```bash
taskkill /F /IM node.exe
Remove-Item -Recurse -Force .next
npm run dev
```

### Banco de dados dessincronizado
```bash
npm run prisma:push
npm run prisma:seed
```

## 📊 Status do Projeto

✅ **Sistema 100% Funcional**
- [x] Autenticação com 3 usuários
- [x] Dashboard único e completo
- [x] Visão anual resumida
- [x] Visão mensal detalhada
- [x] Despesas fixas automáticas (2026)
- [x] Reserva de emergência
- [x] Adicionar receitas/despesas
- [x] Marcar despesas como pagas
- [x] Interface moderna e responsiva
- [x] Sistema de segurança robusto

## 📧 Suporte

Para dúvidas ou problemas, verifique:
1. Servidor rodando em http://localhost:3000
2. Banco de dados conectado
3. Cookies habilitados no navegador
4. Console do navegador para erros JavaScript
