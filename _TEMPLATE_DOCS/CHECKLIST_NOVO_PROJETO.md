# ✅ CHECKLIST - Novo Projeto BFF Supabase

> **Versão para impressão/referência rápida**  
> Use este checklist para não esquecer nenhum passo ao criar um novo projeto

---

## 📋 FASE 1: PLANEJAMENTO (30min)

### Definir Domínio e Contexto

- [ ] **Tipo de aplicação**: ___________________________
- [ ] **Nome do projeto**: ___________________________
- [ ] **Nome dos tenants**: ___________________________ 
  - Exemplo: gyms, stores, schools, companies
- [ ] **Campo tenant_id**: ___________________________
  - Exemplo: gym_id, store_id, school_id

### Definir Hierarquia de Roles (3-5 níveis)

- [ ] **Nível 1 (Multi-tenant)**: ___________________________ (ex: SUPERADMIN)
- [ ] **Nível 2 (Admin tenant)**: ___________________________ (ex: ADMIN, OWNER)
- [ ] **Nível 3 (Gerente)**: ___________________________ (ex: MANAGER, COORDINATOR)
- [ ] **Nível 4 (Usuário)**: ___________________________ (ex: USER, EMPLOYEE)
- [ ] **Nível 5 (Guest)**: ___________________________ (ex: GUEST, STUDENT)

### Listar Entidades Principais (3-10)

1. [ ] Tenants: ___________________________
2. [ ] Users: ___________________________
3. [ ] ___________________________ (entidade de domínio 1)
4. [ ] ___________________________ (entidade de domínio 2)
5. [ ] ___________________________ (entidade de domínio 3)
6. [ ] ___________________________ (entidade de domínio 4)
7. [ ] ___________________________ (entidade de domínio 5)

---

## 🚀 FASE 2: SETUP INICIAL (30min)

### Criar Projeto Next.js

- [ ] Executar: `npx create-next-app@latest meu-projeto`
- [ ] Opções:
  - [ ] TypeScript: **Yes**
  - [ ] ESLint: **Yes**
  - [ ] Tailwind CSS: **Yes**
  - [ ] src/ directory: **No**
  - [ ] App Router: **Yes**
  - [ ] Import alias (@/*): **Yes**
- [ ] Entrar na pasta: `cd meu-projeto`

### Instalar Dependências Supabase

- [ ] Executar: `npm install @supabase/ssr @supabase/supabase-js`

### Criar Estrutura de Pastas

- [ ] `mkdir -p lib/supabase lib/actions lib/helpers types components/ui`
- [ ] `mkdir -p supabase/migrations specs docs`
- [ ] `touch .env.local .env.example middleware.ts`

### Criar Arquivos Base

- [ ] `touch lib/supabase/client.ts`
- [ ] `touch lib/supabase/server.ts`
- [ ] `touch lib/supabase/middleware.ts`
- [ ] `touch lib/helpers/index.ts`
- [ ] `touch lib/helpers/user.ts`
- [ ] `touch types/database.ts`

---

## ☁️ FASE 3: CONFIGURAR SUPABASE (15min)

### Criar Projeto no Supabase

- [ ] Acessar: https://supabase.com/dashboard
- [ ] Clicar em "New Project"
- [ ] Preencher:
  - [ ] Name: ___________________________
  - [ ] Database Password: ___________________________ (GUARDAR!)
  - [ ] Region: ___________________________
- [ ] Aguardar criação (~2min)

### Copiar Credenciais

- [ ] Ir em **Settings** → **API**
- [ ] Copiar `Project URL`: ___________________________
- [ ] Copiar `anon public` key (primeiros 20 chars): ___________________________...
- [ ] Copiar `service_role` key (primeiros 20 chars): ___________________________...
  - ⚠️ **NUNCA commitar a service_role key!**

### Configurar Variáveis de Ambiente

- [ ] Criar arquivo `.env.local` com:
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://...
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
  SUPABASE_SERVICE_ROLE_KEY=eyJ...
  ```
- [ ] Criar arquivo `.env.example` (sem valores reais)
- [ ] Verificar que `.env*.local` está no `.gitignore`

---

## 🔐 FASE 4: IMPLEMENTAR AUTENTICAÇÃO (30min)

### Implementar Clientes Supabase

- [ ] Copiar código para `lib/supabase/client.ts` 
  - Fonte: [QUICKSTART_NOVO_PROJETO.md](QUICKSTART_NOVO_PROJETO.md#3%EF%B8%8F⃣-implementar-autenticação-15min)
- [ ] Copiar código para `lib/supabase/server.ts`
- [ ] Copiar código para `lib/supabase/middleware.ts`

### Implementar Middleware

- [ ] Copiar código para `middleware.ts` (raiz do projeto)
- [ ] Verificar matcher pattern

### Implementar Helpers

- [ ] Copiar código para `lib/helpers/user.ts`
  - Funções: `getCurrentUserProfile()`, `requireUserWithRole()`
- [ ] Exportar em `lib/helpers/index.ts`

### Criar Página de Login

- [ ] Criar `app/login/page.tsx`
- [ ] Implementar formulário de login
- [ ] Implementar Server Action de login

### Criar Página de Dashboard Básica

- [ ] Criar `app/dashboard/page.tsx`
- [ ] Exibir informações do usuário logado

---

## 🗄️ FASE 5: DATABASE SCHEMA (45min)

### Definir Tipos TypeScript

- [ ] Editar `types/database.ts`
- [ ] Definir `export type UserRole = ...` com suas roles
- [ ] Definir interface `Database` com tabelas:
  - [ ] `tenants` (Row, Insert, Update)
  - [ ] `users` (Row, Insert, Update)

### Criar Migration Inicial

- [ ] Criar `supabase/migrations/001_initial_schema.sql`
- [ ] Incluir:
  - [ ] `CREATE EXTENSION "uuid-ossp"`
  - [ ] `CREATE TYPE user_role AS ENUM (...)` com suas roles
  - [ ] `CREATE TABLE tenants (...)` (adaptar nome!)
  - [ ] `CREATE TABLE users (...)`
  - [ ] Índices em tenant_id, role, email
  - [ ] Trigger `update_updated_at_column()`

### Criar RLS Policies

- [ ] Criar `supabase/migrations/002_enable_rls.sql`
- [ ] Para tabela `tenants`:
  - [ ] `ALTER TABLE tenants ENABLE ROW LEVEL SECURITY`
  - [ ] Policy: SUPERADMIN vê todos
  - [ ] Policy: ADMIN vê sua organização
- [ ] Para tabela `users`:
  - [ ] `ALTER TABLE users ENABLE ROW LEVEL SECURITY`
  - [ ] Policy: Usuários veem mesmo tenant
  - [ ] Policy: SUPERADMIN vê todos
  - [ ] Policy: UPDATE próprio perfil
  - [ ] Policy: ADMIN insere/atualiza no tenant

### Aplicar Migrations

**Opção 1: Dashboard**
- [ ] Acessar Supabase Dashboard → SQL Editor
- [ ] Executar `001_initial_schema.sql`
- [ ] Executar `002_enable_rls.sql`

**Opção 2: CLI** (Recomendado)
- [ ] `npm install -g supabase`
- [ ] `supabase login`
- [ ] `supabase link --project-ref ___________`
- [ ] `supabase db push`

### Criar Primeiro Usuário

- [ ] Ir em Dashboard → Authentication → Users
- [ ] Clicar "Add User"
- [ ] Email: ___________________________
- [ ] Password: ___________________________
- [ ] Copiar UUID gerado: ___________________________
- [ ] Executar no SQL Editor:
  ```sql
  INSERT INTO users (id, tenant_id, email, name, role)
  VALUES ('uuid-aqui', NULL, 'email', 'Nome', 'SUPERADMIN');
  ```

---

## 🧪 FASE 6: TESTAR (15min)

### Testes de Autenticação

- [ ] Executar: `npm run dev`
- [ ] Acessar: http://localhost:3000
- [ ] Deve redirecionar para `/login`
- [ ] Fazer login com usuário criado
- [ ] Deve redirecionar para `/dashboard`
- [ ] Verificar dados do usuário exibidos
- [ ] Testar logout

### Testes de Banco de Dados

- [ ] Verificar RLS: Tentar query sem auth (deve falhar)
- [ ] Verificar policies: Usuário vê apenas seu tenant
- [ ] Verificar SUPERADMIN: Vê todos os tenants

---

## 📚 FASE 7: PRIMEIRA FEATURE (2-4h)

### Criar Especificação

- [ ] `mkdir specs/001-nome-da-feature`
- [ ] Criar `specs/001-nome-da-feature/spec.md`
  - [ ] User stories
  - [ ] Requisitos funcionais
  - [ ] Critérios de sucesso
- [ ] Criar `specs/001-nome-da-feature/data-model.md`
  - [ ] Schema SQL
  - [ ] Relacionamentos
- [ ] Criar `specs/001-nome-da-feature/plan.md`
  - [ ] Fases de implementação

### Implementar Database

- [ ] Criar migration: `003_feature_schema.sql`
- [ ] Criar tabelas com `tenant_id`
- [ ] Adicionar RLS policies
- [ ] Aplicar migration

### Implementar Backend

- [ ] Criar `lib/actions/feature-actions.ts`
- [ ] Implementar Server Actions:
  - [ ] Validar autenticação
  - [ ] Validar autorização (roles)
  - [ ] Executar lógica com `tenant_id`
  - [ ] Revalidar cache

### Implementar Frontend

- [ ] Criar componentes em `components/feature/`
- [ ] Criar página em `app/[role]/feature/page.tsx`
- [ ] Adicionar RoleGuard no layout
- [ ] Testar com diferentes roles

---

## 📖 FASE 8: DOCUMENTAÇÃO (30min)

### Documentar Projeto

- [ ] Criar `MULTITENANT.md` (adaptado do template)
- [ ] Criar `ROLE_HIERARCHY.md` (com suas roles)
- [ ] Atualizar `README.md` com instruções
- [ ] Documentar variáveis de ambiente necessárias

### Documentar Padrões

- [ ] Criar `docs/ui-patterns/` se necessário
- [ ] Documentar componentes customizados
- [ ] Criar guia de contribuição

---

## 🚀 FASE 9: DEPLOY (opcional, 30min)

### Preparar para Deploy

- [ ] Configurar `next.config.ts`:
  ```typescript
  output: 'standalone'
  ```

### Deploy Vercel

- [ ] Push para GitHub
- [ ] Conectar no Vercel: https://vercel.com
- [ ] Importar projeto do GitHub
- [ ] Configurar Environment Variables:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Deploy!

### Deploy Cloud Run (alternativa)

- [ ] Criar `Dockerfile` (copiar do template)
- [ ] Build: `docker build -t my-app .`
- [ ] Push para GCR
- [ ] Deploy no Cloud Run
- [ ] Configurar env vars e secrets

---

## ✅ CHECKLIST FINAL

Antes de considerar o projeto pronto:

### Segurança
- [ ] `.env.local` não está commitado
- [ ] Service role key está protegida
- [ ] Todas as tabelas têm RLS habilitado
- [ ] Todas as Server Actions validam permissões
- [ ] Middleware está protegendo rotas

### Funcionalidade
- [ ] Login/logout funcionando
- [ ] Multi-tenancy funcionando (usuários isolados)
- [ ] SUPERADMIN consegue acessar todos os tenants
- [ ] Roles corretas atribuídas e validadas
- [ ] RoleGuard protegendo rotas sensíveis

### Código
- [ ] TypeScript sem erros
- [ ] ESLint sem warnings
- [ ] Estrutura de pastas organizada
- [ ] Código seguindo padrões do template
- [ ] Comentários em código complexo

### Documentação
- [ ] README.md completo
- [ ] Specs criadas para features
- [ ] Variáveis de ambiente documentadas
- [ ] Instruções de setup claras

### Testes
- [ ] Testado com todas as roles
- [ ] Edge cases considerados
- [ ] Verificado isolamento de tenants
- [ ] Testado em diferentes navegadores

---

## 📞 RECURSOS DE AJUDA

### Em caso de dúvidas:

1. **Consultar documentação**:
   - [ ] [TEMPLATE_INDEX.md](TEMPLATE_INDEX.md) - Índice geral
   - [ ] [TEMPLATE_BFF_SUPABASE.md](TEMPLATE_BFF_SUPABASE.md) - Arquitetura
   - [ ] [QUICKSTART_NOVO_PROJETO.md](QUICKSTART_NOVO_PROJETO.md) - Setup
   - [ ] [AI_AGENT_GUIDE.md](AI_AGENT_GUIDE.md) - Para agentes de IA

2. **Ver código de exemplo**: Repositório fitpro-bff

3. **Documentação oficial**:
   - [ ] Next.js: https://nextjs.org/docs
   - [ ] Supabase: https://supabase.com/docs
   - [ ] RLS: https://supabase.com/docs/guides/auth/row-level-security

---

## 🎉 PARABÉNS!

Se completou todos os checkboxes, seu projeto está pronto!

**Próximos passos:**
- [ ] Desenvolver features adicionais
- [ ] Refinar UI/UX
- [ ] Adicionar testes automatizados
- [ ] Monitorar performance
- [ ] Coletar feedback de usuários

---

**Data de conclusão**: _____ / _____ / _________

**Tempo total**: __________ horas

**Notas adicionais**:
_____________________________________________________________________
_____________________________________________________________________
_____________________________________________________________________

---

**Versão**: 1.0.0  
**Última atualização**: Fevereiro 2026  
**Baseado em**: Template BFF Supabase (fitpro-bff)
