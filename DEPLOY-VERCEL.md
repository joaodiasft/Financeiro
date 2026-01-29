# 🚀 Deploy no Vercel - Guia Completo

## ❌ Problema Comum

O erro no Vercel geralmente acontece por **falta de variáveis de ambiente**.

---

## ✅ SOLUÇÃO PASSO A PASSO

### 1️⃣ Configurar Variáveis de Ambiente no Vercel

1. **Acesse**: https://vercel.com/seu-usuario/seu-projeto/settings/environment-variables

2. **Adicione estas variáveis**:

#### DATABASE_URL
```
Nome: DATABASE_URL
Valor: postgres://SEU_USER:SUA_SENHA@db.prisma.io:5432/postgres?sslmode=require&pool=true
```
**Onde pegar**: https://cloud.prisma.io (seu projeto → Connection String)

#### AUTH_SECRET
```
Nome: AUTH_SECRET
Valor: [gere um valor aleatório]
```
**Como gerar**:
```bash
# No terminal:
openssl rand -base64 32

# Ou use qualquer string longa e aleatória
```

3. **Selecione os ambientes**:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

4. **Clique em "Save"**

---

### 2️⃣ Configurar package.json

O arquivo já está correto, mas verifique se tem:

```json
{
  "scripts": {
    "build": "next build",
    "postinstall": "prisma generate"
  }
}
```

---

### 3️⃣ Fazer Redeploy

#### Opção A - Pelo Dashboard Vercel:
1. Vá em: https://vercel.com/seu-projeto
2. Clique em "Deployments"
3. Clique nos 3 pontos (...) no último deploy
4. Clique em "Redeploy"

#### Opção B - Pelo GitHub:
1. Faça um commit qualquer:
```bash
git commit --allow-empty -m "Trigger redeploy"
git push
```

---

## 🔧 COMANDOS ÚTEIS

### Testar Build Localmente
```bash
# Limpar tudo
npm run clean

# Instalar dependências
npm install

# Gerar Prisma Client
npm run prisma:generate

# Build do Next.js
npm run build

# Se tudo funcionar, está pronto para o Vercel!
```

---

## 📋 CHECKLIST PRÉ-DEPLOY

Antes de fazer deploy, verifique:

- ✅ `DATABASE_URL` configurada no Vercel
- ✅ `AUTH_SECRET` configurada no Vercel
- ✅ Arquivo `vercel.json` existe
- ✅ Build local funciona (`npm run build`)
- ✅ Prisma Client gerado (`npm run prisma:generate`)
- ✅ Último commit está no GitHub

---

## 🐛 ERROS COMUNS E SOLUÇÕES

### Erro: "DATABASE_URL is not defined"
**Solução**: Configure a variável no Vercel (passo 1)

### Erro: "prisma generate failed"
**Solução**: Adicione `postinstall: prisma generate` no package.json

### Erro: "Module not found: @prisma/client"
**Solução**: Execute `npm run prisma:generate` localmente primeiro

### Erro: "Cannot connect to database"
**Solução**: Verifique se a `DATABASE_URL` está correta

### Erro: "Build exceeded memory limit"
**Solução**: Atualize o plano do Vercel ou otimize o build

---

## 🎯 CONFIGURAÇÃO RECOMENDADA

### vercel.json
```json
{
  "buildCommand": "prisma generate && next build",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

### package.json (scripts)
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "postinstall": "prisma generate",
    "prisma:generate": "prisma generate",
    "prisma:push": "prisma db push",
    "prisma:seed": "tsx prisma/seed.ts",
    "prisma:studio": "prisma studio"
  }
}
```

---

## 🌐 APÓS O DEPLOY

### Executar Seed (Popular Banco)

Como fazer seed no banco de produção:

#### Opção 1 - Prisma Studio:
1. Abra: https://cloud.prisma.io
2. Acesse seu projeto
3. Use a interface para inserir dados

#### Opção 2 - Script Local:
```bash
# Configure DATABASE_URL de produção localmente
export DATABASE_URL="postgres://..."

# Execute o seed
npm run prisma:seed

# OU diretamente:
npx tsx prisma/seed.ts
```

---

## 📊 MONITORAMENTO

Após o deploy, verifique:

1. **Logs do Vercel**: 
   - https://vercel.com/seu-projeto/deployments
   
2. **Status do Build**:
   - ✅ Verde = Sucesso
   - ❌ Vermelho = Erro (clique para ver logs)

3. **Teste a Aplicação**:
   - Acesse a URL do Vercel
   - Tente fazer login
   - Verifique o dashboard

---

## 🆘 AINDA COM PROBLEMAS?

### Ver Logs Completos:
1. Vá em: https://vercel.com/seu-projeto/deployments
2. Clique no deployment com erro
3. Clique em "View Function Logs"
4. Procure por mensagens de erro

### Testar Localmente com Build de Produção:
```bash
npm run build
npm start
```

Se funcionar localmente, o problema está na configuração do Vercel.

---

## 📝 VARIÁVEIS DE AMBIENTE NECESSÁRIAS

| Variável | Obrigatória | Onde Pegar |
|----------|-------------|------------|
| `DATABASE_URL` | ✅ Sim | https://cloud.prisma.io |
| `AUTH_SECRET` | ✅ Sim | Gere com `openssl rand -base64 32` |

---

## 🎉 DEPLOY BEM-SUCEDIDO!

Quando tudo estiver certo, você verá:
- ✅ Build completed successfully
- ✅ URL do projeto disponível
- ✅ Sistema acessível online

**Parabéns! Seu sistema está no ar! 🚀**
