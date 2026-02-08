# 🎯 TEMPLATE BFF - Boilerplate para Aplicações Modernas com Supabase

> **Versão**: 1.0.0  
> **Data**: Fevereiro 2026  
> **Propósito**: Documento de referência completo para criar novas aplicações BFF (Backend For Frontend) usando a mesma arquitetura, padrões e estrutura deste projeto.

---

## 📋 VISÃO GERAL

Este template define a arquitetura padrão para desenvolver aplicações **modernas**, **escaláveis** e **multi-tenant** usando Next.js como BFF integrado ao Supabase para autenticação, banco de dados e Row Level Security (RLS).

### **O que é BFF?**
Backend For Frontend - Uma camada intermediária entre o frontend e os serviços backend que:
- Gerencia autenticação e sessões
- Executa lógica de negócio server-side
- Implementa autorização e validações
- Otimiza chamadas ao banco de dados
- Fornece APIs específicas para o frontend

---

## 🏗️ ARQUITETURA BASE

```
┌─────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                     │
│  - Pages (App Router)                                    │
│  - Components UI                                         │
│  - Client Components                                     │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│                   BFF LAYER (Next.js)                    │
│  - Server Components                                     │
│  - Server Actions ('use server')                         │
│  - Middleware (Auth & Routes)                            │
│  - API Routes (opcional)                                 │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│                 SUPABASE (Backend)                       │
│  - PostgreSQL Database                                   │
│  - Authentication (Auth.js)                              │
│  - Row Level Security (RLS)                              │
│  - Real-time Subscriptions                               │
│  - Storage                                               │
└──────────────────────────────────────────────────────────┘
```

### **Princípios Fundamentais**

1. **Server-First**: Maximize Server Components e Server Actions
2. **Type-Safe**: TypeScript em todo o código
3. **Security by Default**: RLS + Middleware + Role Guards
4. **Multi-Tenant Ready**: Isolamento de dados por tenant (gym_id, org_id, etc.)
5. **Modular & Scalable**: Estrutura de pastas organizada por domínio

---

## 🛠️ STACK TECNOLÓGICA

### **Core Stack**
```json
{
  "framework": "Next.js 16+ (App Router)",
  "language": "TypeScript 5+",
  "database": "Supabase (PostgreSQL)",
  "auth": "Supabase Auth",
  "styling": "Tailwind CSS 4+",
  "runtime": "Node.js 20+",
  "deployment": "Google Cloud Run / Firebase Hosting / Vercel"
}
```

### **Dependências Essenciais**

```json
{
  "dependencies": {
    "@supabase/ssr": "^0.8.0",
    "@supabase/supabase-js": "^2.93.3",
    "next": "16.1.6",
    "react": "19.2.3",
    "react-dom": "19.2.3"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.1.6",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

---

## 📁 ESTRUTURA DE PASTAS PADRÃO

```
project-root/
├── .env.local                    # Variáveis de ambiente (NUNCA commitar)
├── .env.example                  # Template de variáveis
├── next.config.ts                # Configuração Next.js
├── tsconfig.json                 # Configuração TypeScript
├── package.json                  # Dependências
├── middleware.ts                 # Autenticação global
├── schema.prisma                 # Schema Prisma (opcional, para tipagem)
│
├── app/                          # App Router (Next.js 13+)
│   ├── layout.tsx                # Layout raiz
│   ├── page.tsx                  # Página inicial
│   ├── globals.css               # Estilos globais
│   │
│   ├── login/                    # Autenticação
│   │   └── page.tsx
│   │
│   ├── [role1]/                  # Dashboard por role (ex: admin, manager)
│   │   ├── layout.tsx            # Layout com RoleGuard
│   │   ├── page.tsx              # Dashboard principal
│   │   └── [feature]/            # Features específicas da role
│   │       └── page.tsx
│   │
│   ├── [role2]/                  # Outro papel
│   │   └── ...
│   │
│   └── access-blocked/           # Página de acesso negado
│       └── page.tsx
│
├── components/                   # Componentes reutilizáveis
│   ├── role-guard.tsx            # HOC para proteção por role
│   ├── user-role-badge.tsx       # Badge de exibição de role
│   │
│   ├── [feature]/                # Componentes por feature
│   │   ├── feature-form.tsx
│   │   ├── feature-list.tsx
│   │   └── feature-card.tsx
│   │
│   └── ui/                       # Componentes UI genéricos
│       ├── button.tsx
│       ├── input.tsx
│       ├── card.tsx
│       └── index.ts              # Barrel export
│
├── lib/                          # Lógica de negócio e utilitários
│   ├── actions/                  # Server Actions (use server)
│   │   ├── [role1]-actions.ts    # Ações específicas de role
│   │   ├── [role2]-actions.ts
│   │   └── common-actions.ts     # Ações compartilhadas
│   │
│   ├── helpers/                  # Funções auxiliares
│   │   ├── index.ts
│   │   ├── user.ts               # Helpers de usuário
│   │   ├── [entity].ts           # Helpers de entidade
│   │   └── validation.ts         # Validações
│   │
│   └── supabase/                 # Clientes Supabase
│       ├── client.ts             # Cliente browser
│       ├── server.ts             # Cliente server + admin
│       └── middleware.ts         # Middleware de sessão
│
├── types/                        # Definições de tipos TypeScript
│   ├── database.ts               # Tipos do banco (gerados)
│   ├── ui.ts                     # Tipos de UI
│   └── [entity].ts               # Tipos de domínio
│
├── supabase/                     # Arquivos Supabase
│   ├── migrations/               # Migrações SQL
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_add_rls_policies.sql
│   │   └── ...
│   ├── seed.sql                  # Dados iniciais
│   └── create_superadmin.sql     # Script admin inicial
│
├── specs/                        # Especificações de features
│   └── [feature-id]/
│       ├── spec.md               # Especificação completa
│       ├── plan.md               # Plano de implementação
│       ├── data-model.md         # Modelo de dados
│       ├── tasks.md              # Tasks e checklist
│       └── contracts/            # Contratos de API
│
├── docs/                         # Documentação adicional
│   ├── MULTITENANT.md            # Arquitetura multi-tenant
│   ├── ROLE_HIERARCHY.md         # Hierarquia de roles
│   └── ui-patterns/              # Padrões de UI
│       └── *.md
│
└── public/                       # Arquivos estáticos
    ├── icons/
    └── images/
```

---

## 🔐 AUTENTICAÇÃO E SESSÃO

### **1. Configuração de Variáveis de Ambiente**

Arquivo `.env.local`:
```bash
# Supabase Credentials (obrigatórias)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Arquivo `.env.example` (para referência):
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-public-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### **2. Cliente Supabase - Browser**

**Arquivo**: `lib/supabase/client.ts`

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**Uso**: Client Components que precisam acessar Supabase

### **3. Cliente Supabase - Server**

**Arquivo**: `lib/supabase/server.ts`

```typescript
import { createServerClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component
          }
        },
      },
    }
  )
}

// Cliente admin com Service Role Key para operações administrativas
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY não configurada')
  }

  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}
```

**Uso**:
- `createClient()`: Server Components e Server Actions (respeitando RLS)
- `createAdminClient()`: Operações administrativas que bypassam RLS

### **4. Middleware de Autenticação**

**Arquivo**: `middleware.ts` (raiz do projeto)

```typescript
import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

**Arquivo**: `lib/supabase/middleware.ts`

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Proteção de rotas públicas vs privadas
  const isPublicRoute = request.nextUrl.pathname.startsWith('/login')
  
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
```

---

## 👥 SISTEMA DE ROLES E AUTORIZAÇÃO

### **1. Definição de Roles (Adaptar conforme a aplicação)**

**Arquivo**: `types/database.ts`

```typescript
// Defina as roles específicas da sua aplicação
export type UserRole = 
  | 'SUPERADMIN'    // Gerencia toda a plataforma (multi-tenant)
  | 'ADMIN'         // Administrador do tenant
  | 'MANAGER'       // Gerente/Coordenador
  | 'USER'          // Usuário padrão
  | 'GUEST'         // Visitante (acesso limitado)

// OU adapte conforme seu domínio:
// 'OWNER', 'EDITOR', 'VIEWER', 'CONTRIBUTOR', etc.
```

### **2. Hierarquia de Roles (Exemplo)**

```
SUPERADMIN (acesso total, multi-tenant)
    ↓
ADMIN (gerencia um tenant específico)
    ↓
MANAGER (gerencia uma equipe/departamento)
    ↓
USER (usuário padrão do sistema)
    ↓
GUEST (acesso somente leitura)
```

### **3. RoleGuard Component**

**Arquivo**: `components/role-guard.tsx`

```typescript
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { UserRole } from '@/types/database'

interface RoleGuardProps {
  allowedRoles: UserRole[]
  children: React.ReactNode
  fallbackPath?: string
  loadingComponent?: React.ReactNode
}

/**
 * RoleGuard component - Protege rotas baseado em roles
 * 
 * @example
 * <RoleGuard allowedRoles={['ADMIN', 'MANAGER']}>
 *   <AdminDashboard />
 * </RoleGuard>
 */
export function RoleGuard({
  allowedRoles,
  children,
  fallbackPath = '/access-blocked',
  loadingComponent = <div>Carregando...</div>
}: RoleGuardProps) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const { data: { user: authUser }, error: authError } = 
          await supabase.auth.getUser()
        
        if (authError || !authUser) {
          setIsAuthorized(false)
          router.push('/login')
          return
        }

        const { data: user, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', authUser.id)
          .single()

        if (userError || !user) {
          setIsAuthorized(false)
          router.push(fallbackPath)
          return
        }

        const hasPermission = allowedRoles.includes(user.role as UserRole)
        setIsAuthorized(hasPermission)

        if (!hasPermission) {
          router.push(fallbackPath)
        }
      } catch (error) {
        console.error('Authorization error:', error)
        setIsAuthorized(false)
        router.push(fallbackPath)
      }
    }

    checkAuthorization()
  }, [allowedRoles, fallbackPath, router, supabase])

  if (isAuthorized === null) {
    return <>{loadingComponent}</>
  }

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}
```

### **4. Uso do RoleGuard em Layouts**

**Arquivo**: `app/admin/layout.tsx`

```typescript
import { RoleGuard } from '@/components/role-guard'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RoleGuard allowedRoles={['SUPERADMIN', 'ADMIN']}>
      <div className="admin-layout">
        {/* Sidebar, Header, etc. */}
        <main>{children}</main>
      </div>
    </RoleGuard>
  )
}
```

---

## 🗄️ BANCO DE DADOS E MULTI-TENANCY

### **1. Schema Base Multi-Tenant**

Toda aplicação multi-tenant deve ter:

```sql
-- Tabela de Tenants (adapte o nome: gyms, companies, organizations, etc.)
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  email TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Usuários (estende auth.users do Supabase)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,  -- NULL para SUPERADMIN
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  role user_role DEFAULT 'USER',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, email)  -- Email único por tenant
);

-- Exemplo de tabela de domínio (substitua por suas entidades)
CREATE TABLE [your_entity] (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  -- ... outros campos ...
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **2. Row Level Security (RLS)**

**Template para TODAS as tabelas multi-tenant:**

```sql
-- Habilitar RLS
ALTER TABLE [table_name] ENABLE ROW LEVEL SECURITY;

-- Policy: Usuários veem apenas dados do seu tenant
CREATE POLICY "Users can only access their tenant data"
  ON [table_name]
  FOR ALL
  USING (
    tenant_id IN (
      SELECT tenant_id 
      FROM users 
      WHERE id = auth.uid()
    )
  );

-- Policy: SUPERADMIN vê tudo
CREATE POLICY "Superadmin can access all data"
  ON [table_name]
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 
      FROM users 
      WHERE id = auth.uid() 
      AND role = 'SUPERADMIN'
    )
  );

-- Policy de INSERT (garante que tenant_id é do usuário)
CREATE POLICY "Users can only insert into their tenant"
  ON [table_name]
  FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id 
      FROM users 
      WHERE id = auth.uid()
    )
  );
```

### **3. Migrações**

Organize migrações em ordem numérica:

```
supabase/migrations/
├── 001_create_base_schema.sql        # Tenants, Users, ENUMS
├── 002_create_domain_tables.sql      # Tabelas de domínio
├── 003_add_rls_policies.sql          # Políticas RLS
├── 004_add_indexes.sql               # Índices de performance
├── 005_seed_default_data.sql         # Dados padrão
└── ...
```

### **4. Tipos TypeScript do Banco**

**Arquivo**: `types/database.ts`

```typescript
export type UserRole = 'SUPERADMIN' | 'ADMIN' | 'MANAGER' | 'USER' | 'GUEST'

export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string
          name: string
          slug: string
          email: string | null
          phone: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          email?: string | null
          phone?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          email?: string | null
          phone?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          tenant_id: string | null
          email: string
          name: string
          phone: string | null
          role: UserRole
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          tenant_id?: string | null
          email: string
          name: string
          phone?: string | null
          role?: UserRole
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string | null
          email?: string
          name?: string
          phone?: string | null
          role?: UserRole
          created_at?: string
          updated_at?: string
        }
      }
      // ... outras tabelas ...
    }
  }
}
```

---

## 🎬 SERVER ACTIONS PATTERN

### **1. Estrutura Base de Action**

**Arquivo**: `lib/actions/[role]-actions.ts`

```typescript
'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { getCurrentUserProfile } from '@/lib/helpers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

/**
 * Template de Server Action com validação de role
 */
export async function actionName(data: ActionData) {
  // 1. Criar cliente Supabase
  const supabase = await createClient()
  
  // 2. Validar autenticação e role
  const currentUser = await getCurrentUserProfile()
  if (!currentUser || !['ADMIN', 'MANAGER'].includes(currentUser.role)) {
    throw new Error('Unauthorized: Insufficient permissions')
  }

  try {
    // 3. Executar lógica de negócio
    const { data: result, error } = await supabase
      .from('table_name')
      .insert({
        tenant_id: currentUser.tenant_id,
        // ... outros campos ...
      })
      .select()
      .single()

    if (error) throw error

    // 4. Revalidar cache (se necessário)
    revalidatePath('/path/to/revalidate')

    // 5. Retornar resultado
    return { success: true, data: result }
  } catch (error: any) {
    console.error('Action error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Action usando Admin Client (bypass RLS)
 */
export async function adminAction(data: ActionData) {
  const currentUser = await getCurrentUserProfile()
  
  // Apenas SUPERADMIN pode usar admin client
  if (!currentUser || currentUser.role !== 'SUPERADMIN') {
    throw new Error('Unauthorized: SUPERADMIN only')
  }

  try {
    const adminClient = createAdminClient()
    
    // Operações que bypassam RLS
    const { data, error } = await adminClient
      .from('table_name')
      .insert(data)

    if (error) throw error

    revalidatePath('/admin/path')
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
```

### **2. Helper: Get Current User Profile**

**Arquivo**: `lib/helpers/user.ts`

```typescript
import { createClient } from '@/lib/supabase/server'
import { Database } from '@/types/database'

type User = Database['public']['Tables']['users']['Row']

export async function getCurrentUserProfile(): Promise<User | null> {
  const supabase = await createClient()

  // Get authenticated user
  const {
    data: { user: authUser },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !authUser) {
    return null
  }

  // Get user profile
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single()

  if (userError) {
    return null
  }

  return user
}

export async function requireUserWithRole(allowedRoles: string[]) {
  const user = await getCurrentUserProfile()
  
  if (!user) {
    throw new Error('Unauthorized: Not authenticated')
  }

  if (!allowedRoles.includes(user.role)) {
    throw new Error(`Unauthorized: Requires one of roles: ${allowedRoles.join(', ')}`)
  }

  return user
}
```

---

## 🎨 PADRÕES DE UI

### **1. Componentes Client vs Server**

```typescript
// ❌ EVITAR: Client Component desnecessário
'use client'
export function ServerDataDisplay({ data }: Props) {
  return <div>{data.name}</div>
}

// ✅ PREFERIR: Server Component (padrão)
export function ServerDataDisplay({ data }: Props) {
  return <div>{data.name}</div>
}

// ✅ Client Component apenas quando necessário
'use client'
export function InteractiveButton() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

### **2. Loading States**

```typescript
// app/dashboard/loading.tsx
export default function Loading() {
  return <div>Carregando dashboard...</div>
}

// Ou usar Suspense
import { Suspense } from 'react'

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <DataComponent />
    </Suspense>
  )
}
```

### **3. Error Handling**

```typescript
// app/dashboard/error.tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>Algo deu errado!</h2>
      <button onClick={() => reset()}>Tentar novamente</button>
    </div>
  )
}
```

---

## 📋 SISTEMA DE ESPECIFICAÇÕES

Cada feature deve ter uma pasta em `specs/[feature-id]/` com:

### **1. spec.md** - Especificação Completa

```markdown
# Feature Specification: [Nome da Feature]

**Feature ID**: [unique-id]
**Created**: [data]
**Status**: Draft | In Progress | Completed
**Priority**: P0 (Critical) | P1 (High) | P2 (Medium) | P3 (Low)

## User Scenarios & Testing

### User Story 1 - [Título]
As a [role], I need to [action] so that [benefit].

**Acceptance Scenarios**:
1. Given [context], When [action], Then [result]
2. ...

### User Story 2 - [Título]
...

### Edge Cases
- What happens when...
- How does the system handle...

## Requirements

### Functional Requirements
- FR-001: System MUST...
- FR-002: System MUST...

### Non-Functional Requirements
- NFR-001: Performance...
- NFR-002: Security...

### Key Entities
- **Entity**: Description

## Success Criteria
- SC-001: Measurable outcome
- SC-002: ...
```

### **2. data-model.md** - Modelo de Dados

```markdown
# Data Model: [Feature Name]

## Database Tables

### Table: [table_name]
```sql
CREATE TABLE [table_name] (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  -- campos...
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## RLS Policies
- Policy 1: [description]
- Policy 2: [description]

## Relationships
- [entity] -> [entity]: [type] ([cardinality])
```

### **3. plan.md** - Plano de Implementação

```markdown
# Implementation Plan: [Feature Name]

## Phases

### Phase 1: Database
- [ ] Create migration
- [ ] Add RLS policies
- [ ] Test policies

### Phase 2: Backend
- [ ] Create server actions
- [ ] Add validation
- [ ] Write tests

### Phase 3: Frontend
- [ ] Create UI components
- [ ] Implement forms
- [ ] Add error handling

## Dependencies
- Requires: [feature-id]
- Blocks: [feature-id]
```

---

## 🚀 CONFIGURAÇÃO E DEPLOY

### **1. Next.js Config**

**Arquivo**: `next.config.ts`

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // Para deploy em Cloud Run/Docker
  
  // Se usar imagens externas
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'your-supabase-project.supabase.co',
      },
    ],
  },
};

export default nextConfig;
```

### **2. TypeScript Config**

**Arquivo**: `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### **3. Docker (Cloud Run)**

**Arquivo**: `Dockerfile`

```dockerfile
FROM node:20-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 8080
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

### **4. Deploy Script**

**Arquivo**: `deploy.sh`

```bash
#!/bin/bash

PROJECT_ID="your-gcp-project"
SERVICE_NAME="your-service"
REGION="us-central1"

# Build image
docker build -t gcr.io/$PROJECT_ID/$SERVICE_NAME .

# Push to GCR
docker push gcr.io/$PROJECT_ID/$SERVICE_NAME

# Deploy to Cloud Run
gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars "NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL" \
  --set-env-vars "NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  --set-secrets "SUPABASE_SERVICE_ROLE_KEY=SUPABASE_SERVICE_ROLE_KEY:latest"

echo "Deploy completed!"
```

---

## 📝 CHECKLIST INICIAL DE PROJETO

Ao iniciar um NOVO projeto usando este template:

### **Setup Inicial**
- [ ] Criar projeto Next.js: `npx create-next-app@latest`
- [ ] Criar projeto Supabase em https://supabase.com
- [ ] Configurar `.env.local` com credenciais Supabase
- [ ] Instalar dependências: `@supabase/ssr`, `@supabase/supabase-js`
- [ ] Configurar Tailwind CSS

### **Estrutura de Pastas**
- [ ] Criar estrutura `lib/supabase/` (client, server, middleware)
- [ ] Criar estrutura `lib/actions/`
- [ ] Criar estrutura `lib/helpers/`
- [ ] Criar estrutura `types/`
- [ ] Criar estrutura `components/`
- [ ] Criar estrutura `specs/`

### **Autenticação**
- [ ] Implementar `middleware.ts`
- [ ] Implementar `lib/supabase/middleware.ts`
- [ ] Criar página `/login`
- [ ] Criar componente `RoleGuard`

### **Banco de Dados**
- [ ] Definir roles do sistema (substituir ADMIN, MANAGER, etc.)
- [ ] Criar migração inicial com schema multi-tenant
- [ ] Implementar RLS policies
- [ ] Criar seed de dados iniciais
- [ ] Gerar tipos TypeScript do banco

### **Documentação**
- [ ] Criar `MULTITENANT.md` explicando arquitetura
- [ ] Criar `ROLE_HIERARCHY.md` com hierarquia de roles
- [ ] Documentar padrões de UI em `docs/ui-patterns/`

### **Deploy**
- [ ] Configurar `next.config.ts` para standalone
- [ ] Criar `Dockerfile`
- [ ] Criar script `deploy.sh`
- [ ] Configurar secrets no GCP/Vercel

---

## 🎓 CONCEITOS-CHAVE PARA NOVOS AGENTES

### **Para Agentes de IA que vão desenvolver usando este template:**

1. **Esta é uma aplicação BFF** (Backend For Frontend)
   - Next.js serve como camada intermediária
   - Supabase é o backend (auth + database)
   - Use Server Components e Server Actions sempre que possível

2. **Multi-tenant por padrão**
   - Toda entidade tem `tenant_id` (ou `gym_id`, `org_id`, etc.)
   - RLS garante isolamento de dados
   - SUPERADMIN é a única role que acessa múltiplos tenants

3. **Hierarquia de Roles**
   - Sempre respeite a hierarquia definida
   - Use RoleGuard para proteger rotas
   - Valide permissões em Server Actions

4. **Padrões de Código**
   - Server Actions em `lib/actions/`
   - Helpers em `lib/helpers/`
   - Tipos em `types/`
   - Componentes em `components/[feature]/`

5. **Segurança em Camadas**
   - Middleware valida sessão
   - RoleGuard valida acesso a rotas
   - RLS valida acesso a dados
   - Server Actions validam permissões

6. **Especificações Antes de Código**
   - Sempre crie spec.md antes de implementar
   - Defina user stories e acceptance criteria
   - Documente modelo de dados
   - Crie plano de implementação

---

## 🔄 WORKFLOW DE DESENVOLVIMENTO

### **1. Nova Feature**

```bash
# 1. Criar pasta da spec
mkdir -p specs/[feature-id]

# 2. Criar arquivos de spec
touch specs/[feature-id]/spec.md
touch specs/[feature-id]/data-model.md
touch specs/[feature-id]/plan.md

# 3. Preencher specs (NÃO pular esta etapa!)

# 4. Criar migration (se necessário)
touch supabase/migrations/[seq]_[description].sql

# 5. Implementar backend (actions)
touch lib/actions/[feature]-actions.ts

# 6. Implementar frontend (components + pages)
mkdir app/[role]/[feature]
touch app/[role]/[feature]/page.tsx

# 7. Testar e validar
# 8. Deploy
```

### **2. Modificação de Schema**

```bash
# 1. Criar nova migration
touch supabase/migrations/[seq]_[description].sql

# 2. Aplicar migration no Supabase Dashboard ou CLI

# 3. Atualizar tipos TypeScript em types/database.ts

# 4. Atualizar actions/helpers afetados

# 5. Testar
```

---

## 📚 RECURSOS E REFERÊNCIAS

### **Documentação Oficial**
- Next.js: https://nextjs.org/docs
- Supabase: https://supabase.com/docs
- Tailwind CSS: https://tailwindcss.com/docs

### **Exemplos de Código**
- Este projeto (fitpro-bff) serve como referência completa
- Veja `lib/actions/` para exemplos de Server Actions
- Veja `components/` para padrões de UI
- Veja `supabase/migrations/` para estrutura de banco

### **Padrões Importantes**
- App Router: https://nextjs.org/docs/app
- Server Actions: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
- RLS: https://supabase.com/docs/guides/auth/row-level-security

---

## 🎯 RESUMO EXECUTIVO

**Use este template quando precisar criar:**
- ✅ Aplicações SaaS multi-tenant
- ✅ Sistemas com autenticação e autorização robusta
- ✅ Aplicações que precisam de hierarquia de roles
- ✅ BFF (Backend For Frontend) moderno
- ✅ Apps com Next.js + Supabase
- ✅ Sistemas escaláveis e seguros

**Este template fornece:**
- 🏗️ Arquitetura completa e testada
- 🔐 Autenticação e autorização em múltiplas camadas
- 🗄️ Padrão de banco de dados multi-tenant com RLS
- 🎨 Padrões de UI e componentes
- 📋 Sistema de especificações
- 🚀 Scripts de deploy
- 📚 Documentação completa

**Próximos Passos:**
1. Leia este documento completamente
2. Clone/copie a estrutura de pastas
3. Adapte roles e entidades ao seu domínio
4. Siga o checklist inicial
5. Implemente feature por feature usando specs/
6. Mantenha a documentação atualizada

---

**Última Atualização**: Fevereiro 2026  
**Versão do Template**: 1.0.0  
**Autor**: Baseado no projeto fitpro-bff  
**Licença**: Use livremente para seus projetos

---

## 📞 SUPORTE E CONTRIBUIÇÕES

Para dúvidas específicas sobre este template, consulte:
1. Este documento (`TEMPLATE_BFF_SUPABASE.md`)
2. Documentação específica do projeto (MULTITENANT.md, ROLE_HIERARCHY.md)
3. Código de exemplo em `lib/`, `components/`, `app/`

**Boa sorte com seu novo projeto! 🚀**
