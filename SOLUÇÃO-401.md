# 🔧 Solução para Erro 401 - Não Autorizado

## ❌ Problema
Você está vendo "Erro ao carregar dados" no dashboard porque as APIs estão retornando 401 (Não Autorizado).

## ✅ Solução Rápida

### Opção 1: Limpar Cookies (Recomendado)
1. No navegador, pressione **Ctrl + Shift + Delete**
2. Selecione "Cookies e outros dados de sites"
3. Clique em "Limpar dados"
4. Acesse novamente: `http://localhost:3000`
5. Faça login com:
   ```
   Email: jc@redas.com
   Senha: jc29
   ```

### Opção 2: Modo Anônimo/Privado
1. Abra uma janela anônima/privada:
   - Chrome: **Ctrl + Shift + N**
   - Firefox: **Ctrl + Shift + P**
   - Edge: **Ctrl + Shift + N**
2. Acesse: `http://localhost:3000`
3. Faça login normalmente

### Opção 3: Usar Botão "Ir para Login"
1. Quando ver o erro no dashboard
2. Clique no botão **"Ir para Login"**
3. Faça login novamente

## 🔍 Por Que Isso Acontece?

Durante o desenvolvimento, mudamos a estrutura da sessão várias vezes:
- De `middleware.ts` para `proxy.ts`
- Refatoramos as funções de autenticação
- Alteramos a forma de validar tokens

As **sessões antigas** (cookies antigos) não são compatíveis com o novo sistema.

## 📊 Como Saber Se Funcionou?

Após fazer login, você deve ver:
- ✅ Dashboard com 13 abas (Ano Completo + 12 meses)
- ✅ 4 cards coloridos (Receitas, Despesas, etc.)
- ✅ Tabelas de despesas e receitas
- ✅ Sem mensagens de erro

## 🐛 Debug Adicional

Se ainda não funcionar:

### 1. Verificar Console do Navegador
Pressione **F12** e vá na aba "Console". Procure por:
```
Balance API error: 401
Expenses API error: 401
Revenues API error: 401
Settings API error: 401
```

### 2. Verificar Network
Na aba "Network" do DevTools (F12):
- Procure requisições para `/api/balance`, `/api/expenses`, etc.
- Clique nelas e veja a resposta
- Se retornar `{"error": "Não autenticado"}`, é problema de sessão

### 3. Verificar Cookies
Na aba "Application" do DevTools (F12):
- Vá em "Cookies" > `http://localhost:3000`
- Procure por um cookie chamado `fina_redas_session`
- Se não existir ou estiver vazio, você precisa fazer login
- Se existir mas ainda der 401, delete-o manualmente e faça login de novo

## 🚀 Teste da API de Debug

Acesse esta URL no navegador (após fazer login):
```
http://localhost:3000/api/test-auth
```

**Resposta esperada:**
```json
{
  "success": true,
  "user": {
    "id": "...",
    "email": "jc@redas.com",
    "name": "Administrador JC"
  }
}
```

**Se der erro:**
```json
{
  "error": "Não autenticado",
  "hasToken": false
}
```
Isso confirma que você precisa fazer login.

## 💡 Dica Final

**Sempre que mudar código de autenticação:**
1. Limpe os cookies
2. Reinicie o servidor (já feito)
3. Faça login novamente
4. Teste o sistema

Isso garante que você está usando a versão mais recente do sistema de autenticação.
