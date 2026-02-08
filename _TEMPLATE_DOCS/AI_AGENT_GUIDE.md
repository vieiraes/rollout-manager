# 🤖 GUIA PARA AGENTES DE IA - Template BFF Supabase

> **Audiência**: Agentes de IA (LLMs) que vão desenvolver aplicações usando este template  
> **Propósito**: Instruções específicas para compreender e aplicar corretamente os padrões deste boilerplate  
> **Versão**: 1.0.0

---

## 🎯 OBJETIVO DESTE TEMPLATE

Este é um **BOILERPLATE REUTILIZÁVEL** para criar aplicações modernas do tipo **BFF (Backend For Frontend)** usando:
- **Next.js 16+** (App Router)
- **Supabase** (Auth + PostgreSQL + RLS)
- **TypeScript**
- **Multi-tenant por padrão**

---

## 📖 COMO USAR ESTE TEMPLATE

### **Quando um usuário pedir para criar uma NOVA aplicação:**

1. **SEMPRE leia primeiro**:
   - `TEMPLATE_BFF_SUPABASE.md` - Arquitetura completa
   - `QUICKSTART_NOVO_PROJETO.md` - Passo a passo de setup

2. **Identifique o domínio da aplicação**:
   - Sistema de academia? → Tenants = gyms, Roles = ADMIN, MANAGER, INSTRUCTOR, STUDENT
   - E-commerce? → Tenants = stores, Roles = STORE_OWNER, MANAGER, CUSTOMER
   - LMS? → Tenants = schools, Roles = SCHOOL_ADMIN, TEACHER, STUDENT
   - CRM? → Tenants = companies, Roles = ADMIN, SALES_MANAGER, SALES_REP

3. **Adapte os conceitos**:
   - **NÃO copie literalmente** `gyms`, `personal`, `workout`
   - **ADAPTE** para o domínio específico do usuário
   - Mantenha a ESTRUTURA e PADRÕES, mas mude as ENTIDADES

---

## 🏗️ CONCEITOS FUNDAMENTAIS

### **1. BFF (Backend For Frontend)**

Esta **NÃO É** uma aplicação frontend pura:
- ❌ **ERRADO**: Fazer fetch direto do client para APIs externas
- ✅ **CORRETO**: Client → Server Components/Actions → Supabase

**Fluxo de dados:**
```
User Interaction (Client Component)
    ↓
Server Action ('use server')
    ↓
Validação + Autorização
    ↓
Supabase Query (com RLS)
    ↓
Return Data
    ↓
Revalidate + Update UI
```

### **2. Multi-tenancy SEMPRE**

Mesmo que o usuário não mencione, implemente multi-tenant:
- Tabela de tenants (adapte o nome)
- Campo `tenant_id` em TODAS as entidades
- RLS policies que filtram por tenant
- Role SUPERADMIN que acessa múltiplos tenants

**Por quê?**
- Escalabilidade futura
- Isolamento de dados
- Segurança robusta

### **3. Hierarquia de Roles**

Sempre defina uma hierarquia clara:

```
SUPERADMIN (multi-tenant, acesso total)
    ↓
ADMIN (acesso total no seu tenant)
    ↓
MANAGER/MID-LEVEL (acesso a uma equipe/departamento)
    ↓
USER/EMPLOYEE (acesso limitado)
    ↓
GUEST/STUDENT (somente leitura)
```

**Permissões cascateam para baixo:**
- ADMIN pode fazer tudo que MANAGER faz
- MANAGER pode fazer tudo que USER faz
- etc.

---

## 📋 WORKFLOW DE DESENVOLVIMENTO

### **Quando o usuário pedir uma NOVA FEATURE:**

```
1. CRIAR SPEC PRIMEIRO
   ├─ specs/[feature-id]/spec.md
   ├─ specs/[feature-id]/data-model.md
   └─ specs/[feature-id]/plan.md

2. IMPLEMENTAR DATABASE
   ├─ Criar migration SQL
   ├─ Adicionar RLS policies
   └─ Atualizar types/database.ts

3. IMPLEMENTAR BACKEND
   ├─ Criar Server Actions em lib/actions/
   ├─ Criar helpers em lib/helpers/
   └─ Validar permissões

4. IMPLEMENTAR FRONTEND
   ├─ Criar componentes em components/
   ├─ Criar páginas em app/
   └─ Adicionar RoleGuard nos layouts

5. TESTAR
   └─ Verificar todos os papéis (roles)
```

### **⚠️ NUNCA pule a etapa de SPEC!**

Especificações previnem:
- Features mal definidas
- Bugs de segurança
- Retrabalho
- Confusão sobre requisitos

---

## 🔐 SEGURANÇA EM CAMADAS

Este template usa **4 camadas de segurança**:

### **Camada 1: Middleware**
```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  // Valida sessão de autenticação
  // Redireciona não-autenticados para /login
}
```

### **Camada 2: RoleGuard (UI)**
```typescript
// Layout de rota protegida
<RoleGuard allowedRoles={['ADMIN', 'MANAGER']}>
  <AdminPanel />
</RoleGuard>
```

### **Camada 3: Server Actions**
```typescript
// lib/actions/admin-actions.ts
export async function createUser(data: UserData) {
  const currentUser = await getCurrentUserProfile()
  
  // Validação de permissão
  if (!['ADMIN', 'SUPERADMIN'].includes(currentUser.role)) {
    throw new Error('Unauthorized')
  }
  
  // ... lógica ...
}
```

### **Camada 4: RLS (Database)**
```sql
-- Policy no Supabase
CREATE POLICY "users_see_own_tenant"
  ON users FOR SELECT
  USING (tenant_id = (SELECT tenant_id FROM users WHERE id = auth.uid()));
```

**⚠️ TODAS as 4 camadas devem estar presentes!**

---

## 📁 ESTRUTURA DE ARQUIVOS - REGRAS

### **❌ NÃO FAÇA:**

```
lib/
  utils.ts              ← Tudo junto, desorganizado
  helpers.ts
  actions.ts

components/
  button1.tsx           ← Componentes sem agrupamento
  form1.tsx
  list1.tsx
```

### **✅ FAÇA:**

```
lib/
  actions/              ← Agrupado por domínio
    admin-actions.ts
    user-actions.ts
  helpers/              ← Agrupado por tipo
    user.ts
    validation.ts
    index.ts            ← Barrel exports

components/
  admin/                ← Agrupado por feature
    user-form.tsx
    user-list.tsx
  ui/                   ← Componentes genéricos
    button.tsx
    input.tsx
    index.ts
```

---

## 🗄️ PADRÕES DE DATABASE

### **Template de Tabela Multi-tenant:**

```sql
CREATE TABLE [entity_name] (
  -- Identificadores
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Campos de domínio
  -- ... seus campos aqui ...
  
  -- Relacionamentos (opcional)
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Timestamps (sempre incluir)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices (sempre incluir)
CREATE INDEX idx_[entity]_tenant_id ON [entity_name](tenant_id);

-- Trigger de updated_at (sempre incluir)
CREATE TRIGGER update_[entity]_updated_at
  BEFORE UPDATE ON [entity_name]
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS (sempre incluir)
ALTER TABLE [entity_name] ENABLE ROW LEVEL SECURITY;

CREATE POLICY "[entity]_tenant_isolation"
  ON [entity_name] FOR ALL
  USING (
    tenant_id IN (SELECT tenant_id FROM users WHERE id = auth.uid())
    OR
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'SUPERADMIN')
  );
```

### **Campos Obrigatórios:**

TODA tabela de entidade deve ter:
- ✅ `id` (UUID, PK)
- ✅ `tenant_id` (UUID, FK para tenants)
- ✅ `created_at` (TIMESTAMPTZ)
- ✅ `updated_at` (TIMESTAMPTZ)
- ✅ Índice em `tenant_id`
- ✅ RLS habilitado
- ✅ Policies de isolamento

---

## 🎨 PADRÕES DE CÓDIGO

### **Server Components vs Client Components**

```typescript
// ✅ PADRÃO: Server Component (sem 'use client')
// Use para: Buscar dados, SEO, performance
export default async function UserList() {
  const users = await fetchUsers()  // Fetch no servidor
  return <ul>{users.map(...)}</ul>
}

// ✅ Client Component APENAS quando necessário
// Use para: Interatividade, hooks, eventos
'use client'
export default function InteractiveForm() {
  const [value, setValue] = useState('')
  return <input value={value} onChange={e => setValue(e.target.value)} />
}
```

### **Server Actions Pattern**

```typescript
'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { getCurrentUserProfile } from '@/lib/helpers'
import { revalidatePath } from 'next/cache'

/**
 * Template padrão de Server Action
 */
export async function myAction(data: MyData) {
  // 1. Validar autenticação
  const user = await getCurrentUserProfile()
  if (!user) {
    throw new Error('Not authenticated')
  }

  // 2. Validar autorização
  if (!['ADMIN', 'MANAGER'].includes(user.role)) {
    throw new Error('Unauthorized')
  }

  // 3. Validar inputs
  if (!data.field) {
    return { success: false, error: 'Field required' }
  }

  try {
    // 4. Executar lógica
    const supabase = await createClient()
    const { data: result, error } = await supabase
      .from('table')
      .insert({
        ...data,
        tenant_id: user.tenant_id,  // ← SEMPRE incluir tenant_id
      })
      .select()
      .single()

    if (error) throw error

    // 5. Revalidar cache
    revalidatePath('/path')

    // 6. Retornar resultado
    return { success: true, data: result }
  } catch (error: any) {
    console.error('Action error:', error)
    return { success: false, error: error.message }
  }
}
```

### **Helpers Pattern**

```typescript
// lib/helpers/user.ts
import { createClient } from '@/lib/supabase/server'

/**
 * Busca perfil do usuário autenticado
 */
export async function getCurrentUserProfile() {
  const supabase = await createClient()
  
  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser) return null

  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single()

  return user
}

/**
 * Valida se usuário tem permissão
 */
export async function requireRole(allowedRoles: string[]) {
  const user = await getCurrentUserProfile()
  
  if (!user || !allowedRoles.includes(user.role)) {
    throw new Error('Unauthorized')
  }
  
  return user
}
```

---

## 🚨 ERROS COMUNS A EVITAR

### **1. Não adicionar tenant_id**

```typescript
// ❌ ERRADO
await supabase.from('entities').insert({ name: 'Test' })

// ✅ CORRETO
await supabase.from('entities').insert({
  name: 'Test',
  tenant_id: user.tenant_id  // ← SEMPRE incluir
})
```

### **2. Usar Admin Client quando não deve**

```typescript
// ❌ ERRADO (bypassa RLS sem necessidade)
const adminClient = createAdminClient()
await adminClient.from('users').select('*')

// ✅ CORRETO (respeita RLS)
const supabase = await createClient()
await supabase.from('users').select('*')
```

**Quando usar Admin Client:**
- Criar usuários (auth.admin.createUser)
- Operações de SUPERADMIN
- Migrations/seeds

### **3. Não validar permissões em Server Actions**

```typescript
// ❌ ERRADO
export async function deleteUser(id: string) {
  await supabase.from('users').delete().eq('id', id)
}

// ✅ CORRETO
export async function deleteUser(id: string) {
  const user = await getCurrentUserProfile()
  if (user.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }
  // ... delete
}
```

### **4. Esquecer de revalidar cache**

```typescript
// ❌ ERRADO
export async function updateUser(id: string, data: UserData) {
  await supabase.from('users').update(data).eq('id', id)
  return { success: true }
}

// ✅ CORRETO
export async function updateUser(id: string, data: UserData) {
  await supabase.from('users').update(data).eq('id', id)
  revalidatePath('/admin/users')  // ← Revalida cache
  return { success: true }
}
```

### **5. Client Component desnecessário**

```typescript
// ❌ ERRADO (força tudo ser client)
'use client'
export default function Page() {
  const [users, setUsers] = useState([])
  
  useEffect(() => {
    fetchUsers().then(setUsers)
  }, [])
  
  return <UserList users={users} />
}

// ✅ CORRETO (Server Component)
export default async function Page() {
  const users = await fetchUsers()  // Fetch no servidor
  return <UserList users={users} />
}
```

---

## 📚 VOCABULÁRIO E CONCEITOS

### **Termos do Template:**

| Termo | Significado | Adapte para |
|-------|-------------|-------------|
| **Tenant** | Organização/inquilino no sistema multi-tenant | gym, company, store, school, organization |
| **tenant_id** | ID do tenant (chave estrangeira) | gym_id, company_id, store_id |
| **SUPERADMIN** | Role com acesso multi-tenant | PLATFORM_ADMIN, SYSTEM_ADMIN |
| **ADMIN** | Admin do tenant | OWNER, SCHOOL_ADMIN, STORE_OWNER |
| **MANAGER** | Nível intermediário | COORDINATOR, TEAM_LEAD |
| **USER** | Usuário padrão | EMPLOYEE, MEMBER, CUSTOMER |

### **Arquitetura BFF:**

- **Server Component**: Componente React que roda no servidor
- **Client Component**: Componente React que roda no browser (usa 'use client')
- **Server Action**: Função server-side marcada com 'use server'
- **RLS**: Row Level Security - segurança a nível de linha no PostgreSQL
- **Middleware**: Função que intercepta requests antes de chegar às rotas

---

## 🎯 CHECKLIST PARA CADA NOVA APLICAÇÃO

Quando criar uma nova aplicação usando este template:

### **Análise Inicial**
- [ ] Identificar domínio da aplicação
- [ ] Definir hierarquia de roles (3-5 níveis)
- [ ] Mapear entidades principais
- [ ] Definir relacionamentos entre entidades

### **Adaptações Necessárias**
- [ ] Renomear `tenants` para nome do domínio
- [ ] Substituir roles genéricas por roles do domínio
- [ ] Atualizar ENUM `user_role` no SQL
- [ ] Atualizar type `UserRole` no TypeScript
- [ ] Adaptar RLS policies

### **Implementação**
- [ ] Seguir QUICKSTART_NOVO_PROJETO.md
- [ ] Criar specs antes de cada feature
- [ ] Implementar em camadas (DB → Backend → Frontend)
- [ ] Testar com todos os papéis (roles)
- [ ] Documentar padrões específicos do projeto

---

## 💡 DICAS PARA AGENTES DE IA

### **1. Sempre pergunte sobre o domínio**

Antes de iniciar, entenda:
- Qual o tipo de aplicação?
- Quem são os usuários?
- Quais os papéis (roles) principais?
- Há multi-tenancy?

### **2. Use os documentos de referência**

```
Dúvida sobre...               → Leia...
─────────────────────────────────────────────────────
Arquitetura geral             → TEMPLATE_BFF_SUPABASE.md
Setup inicial                 → QUICKSTART_NOVO_PROJETO.md
Padrões específicos           → Este documento
Multi-tenancy                 → MULTITENANT.md
Roles e permissões            → ROLE_HIERARCHY.md
```

### **3. Siga os padrões, não reinvente**

- Use a estrutura de pastas definida
- Use os patterns de Server Actions
- Use os templates de SQL
- Use os helpers existentes

### **4. Segurança primeiro**

Para TODA operação, verifique:
1. Usuário está autenticado?
2. Usuário tem a role correta?
3. Operação está no tenant correto?
4. RLS vai prevenir acesso indevido?

### **5. Adapte, não copie**

```
❌ ERRADO:
"Vou usar exatamente a estrutura de 'gyms' e 'workouts'"

✅ CORRETO:
"Entendi o padrão de multi-tenant com gym_id.
Vou aplicar o mesmo padrão mas usar 'stores' e 'store_id'
para este e-commerce"
```

---

## 📖 EXEMPLO PRÁTICO DE ADAPTAÇÃO

### **Usuário pede:** "Quero criar um sistema de gestão de restaurantes"

### **Análise:**

**Domínio:** Restaurantes (multi-tenant)

**Hierarquia de Roles:**
```
SUPERADMIN (plataforma)
  ↓
RESTAURANT_OWNER (dono do restaurante)
  ↓
MANAGER (gerente)
  ↓
WAITER (garçom)
  ↓
CUSTOMER (cliente)
```

**Entidades principais:**
- Restaurants (tenants)
- Users
- Menus
- MenuItems
- Orders
- Tables

### **Adaptações:**

1. **Renomear tenant:**
   ```sql
   -- Ao invés de 'gyms'
   CREATE TABLE restaurants (...)
   ```

2. **Atualizar roles:**
   ```sql
   CREATE TYPE user_role AS ENUM (
     'SUPERADMIN',
     'RESTAURANT_OWNER',
     'MANAGER',
     'WAITER',
     'CUSTOMER'
   );
   ```

3. **Criar entidades com tenant_id:**
   ```sql
   CREATE TABLE menus (
     id UUID PRIMARY KEY,
     restaurant_id UUID REFERENCES restaurants(id),
     -- ...
   );
   ```

4. **Implementar RLS:**
   ```sql
   -- Usuários veem apenas menus do seu restaurante
   CREATE POLICY "menus_tenant_isolation"
     ON menus FOR SELECT
     USING (
       restaurant_id IN (
         SELECT restaurant_id FROM users WHERE id = auth.uid()
       )
     );
   ```

### **Resultado:**

Mesma **arquitetura** e **padrões**, mas adaptado para **restaurantes**.

---

## 🎓 CONCLUSÃO

**Princípios fundamentais:**

1. **BFF Architecture**: Server Components + Server Actions + Supabase
2. **Multi-tenant**: Sempre, com RLS e isolamento
3. **Security Layers**: Middleware + RoleGuard + Actions + RLS
4. **Spec-driven**: Especificação antes de código
5. **Type-safe**: TypeScript em tudo
6. **Adaptável**: Mantenha padrões, mude entidades

**Este template não é para copiar-colar, é para ADAPTAR ao domínio específico mantendo os padrões de arquitetura e segurança.**

---

**Versão**: 1.0.0  
**Última atualização**: Fevereiro 2026  
**Mantenedores**: Time de desenvolvimento  

**Agente, boa sorte! 🚀**
