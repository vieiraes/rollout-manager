# 🚀 Quickstart - Novo Projeto BFF com Supabase

> **Guia Prático**: Como iniciar um NOVO projeto do zero usando o template BFF  
> **Tempo estimado**: 30-60 minutos  
> **Pré-requisitos**: Node.js 20+, npm/yarn, conta Supabase

---

## 📋 CHECKLIST RÁPIDO

```
[ ] 1. Setup inicial (10min)
[ ] 2. Supabase (10min)
[ ] 3. Autenticação (15min)
[ ] 4. Database Schema (15min)
[ ] 5. Primeiro Deploy (10min)
```

---

## 1️⃣ SETUP INICIAL (10min)

### **A. Criar projeto Next.js**

```bash
# Criar novo projeto
npx create-next-app@latest my-new-project

# Opções recomendadas:
# ✅ TypeScript: Yes
# ✅ ESLint: Yes
# ✅ Tailwind CSS: Yes
# ✅ src/ directory: No
# ✅ App Router: Yes
# ✅ Import alias: Yes (@/*)

cd my-new-project
```

### **B. Instalar dependências Supabase**

```bash
npm install @supabase/ssr @supabase/supabase-js
```

### **C. Criar estrutura de pastas**

```bash
# Criar pastas principais
mkdir -p lib/supabase lib/actions lib/helpers types components/ui supabase/migrations specs docs

# Criar arquivos base
touch .env.local .env.example
touch middleware.ts
touch lib/supabase/client.ts lib/supabase/server.ts lib/supabase/middleware.ts
touch types/database.ts
touch lib/helpers/index.ts lib/helpers/user.ts
```

---

## 2️⃣ CONFIGURAR SUPABASE (10min)

### **A. Criar projeto no Supabase**

1. Acesse https://supabase.com/dashboard
2. Clique em "New Project"
3. Preencha:
   - **Name**: Nome do seu projeto
   - **Database Password**: Senha forte (salve!)
   - **Region**: Mais próxima dos usuários
4. Aguarde criação (~2min)

### **B. Copiar credenciais**

Na dashboard do Supabase:
1. Vá em **Settings** → **API**
2. Copie:
   - `Project URL`
   - `anon public` key
   - `service_role` key (⚠️ SECRETA!)

### **C. Configurar variáveis de ambiente**

**Arquivo `.env.local`:**
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Arquivo `.env.example`:**
```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

⚠️ **IMPORTANTE**: Adicione ao `.gitignore`:
```
.env*.local
```

---

## 3️⃣ IMPLEMENTAR AUTENTICAÇÃO (15min)

### **A. Cliente Supabase - Browser**

**Arquivo `lib/supabase/client.ts`:**
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### **B. Cliente Supabase - Server**

**Arquivo `lib/supabase/server.ts`:**
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

### **C. Middleware de Sessão**

**Arquivo `lib/supabase/middleware.ts`:**
```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

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
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Rotas públicas
  const publicRoutes = ['/login', '/signup']
  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  // Redirecionar para login se não autenticado
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Redirecionar para dashboard se já autenticado
  if (user && isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
```

**Arquivo `middleware.ts` (raiz):**
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

### **D. Helper - Get Current User**

**Arquivo `lib/helpers/user.ts`:**
```typescript
import { createClient } from '@/lib/supabase/server'

export async function getCurrentUserProfile() {
  const supabase = await createClient()

  const { data: { user: authUser }, error: authError } = 
    await supabase.auth.getUser()

  if (authError || !authUser) {
    return null
  }

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
```

**Arquivo `lib/helpers/index.ts`:**
```typescript
export * from './user'
```

### **E. Página de Login**

**Arquivo `app/login/page.tsx`:**
```typescript
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default function LoginPage() {
  async function login(formData: FormData) {
    'use server'

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      redirect('/login?error=Invalid credentials')
    }

    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form action={login} className="space-y-4 w-80">
        <h1 className="text-2xl font-bold">Login</h1>
        
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="w-full px-4 py-2 border rounded"
        />
        
        <input
          type="password"
          name="password"
          placeholder="Senha"
          required
          className="w-full px-4 py-2 border rounded"
        />
        
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Entrar
        </button>
      </form>
    </div>
  )
}
```

---

## 4️⃣ DATABASE SCHEMA (15min)

### **A. Definir Roles da Aplicação**

**⚠️ IMPORTANTE**: Adapte para o seu domínio!

**Exemplos de hierarquia:**

**SaaS Multi-tenant (tipo FitPro):**
```
SUPERADMIN → ADMIN → MANAGER → USER → GUEST
```

**E-commerce:**
```
PLATFORM_ADMIN → STORE_OWNER → STORE_MANAGER → CUSTOMER
```

**LMS (Learning Management System):**
```
PLATFORM_ADMIN → SCHOOL_ADMIN → TEACHER → STUDENT
```

**CRM:**
```
SUPERADMIN → ACCOUNT_OWNER → SALES_MANAGER → SALES_REP
```

### **B. Tipos TypeScript**

**Arquivo `types/database.ts`:**
```typescript
// ⚠️ IMPORTANTE: Adapte conforme sua aplicação!

export type UserRole = 
  | 'SUPERADMIN'
  | 'ADMIN'
  | 'MANAGER'
  | 'USER'
  | 'GUEST'

export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string
          name: string
          slug: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['tenants']['Insert']>
      }
      users: {
        Row: {
          id: string
          tenant_id: string | null
          email: string
          name: string
          role: UserRole
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          tenant_id?: string | null
          email: string
          name: string
          role?: UserRole
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
    }
  }
}
```

### **C. Migration Inicial**

**Arquivo `supabase/migrations/001_initial_schema.sql`:**

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ⚠️ ADAPTE OS VALORES DO ENUM CONFORME SUA APLICAÇÃO!
CREATE TYPE user_role AS ENUM (
  'SUPERADMIN',
  'ADMIN',
  'MANAGER',
  'USER',
  'GUEST'
);

-- Tenants table (organizações, academias, lojas, etc.)
-- ⚠️ RENOMEIE PARA SEU DOMÍNIO: organizations, companies, stores, schools
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

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,  -- NULL para SUPERADMIN
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  role user_role DEFAULT 'USER',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, email)
);

-- Índices
CREATE INDEX idx_users_tenant_id ON users(tenant_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_tenants_slug ON tenants(slug);
CREATE INDEX idx_tenants_is_active ON tenants(is_active);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tenants_updated_at
  BEFORE UPDATE ON tenants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### **D. RLS Policies**

**Arquivo `supabase/migrations/002_enable_rls.sql`:**

```sql
-- Enable RLS on all tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- ============================================
-- TENANTS POLICIES
-- ============================================

-- SUPERADMIN pode ver todos os tenants
CREATE POLICY "superadmin_select_all_tenants"
  ON tenants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'SUPERADMIN'
    )
  );

-- ADMIN pode ver seu próprio tenant
CREATE POLICY "admin_select_own_tenant"
  ON tenants FOR SELECT
  USING (
    id IN (
      SELECT tenant_id FROM users 
      WHERE users.id = auth.uid()
    )
  );

-- SUPERADMIN pode criar/atualizar tenants
CREATE POLICY "superadmin_manage_tenants"
  ON tenants FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'SUPERADMIN'
    )
  );

-- ============================================
-- USERS POLICIES
-- ============================================

-- Usuários podem ver outros usuários do mesmo tenant
CREATE POLICY "users_select_same_tenant"
  ON users FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM users 
      WHERE users.id = auth.uid()
    )
    OR 
    -- SUPERADMIN vê todos
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'SUPERADMIN'
    )
  );

-- Usuários podem atualizar seu próprio perfil
CREATE POLICY "users_update_own_profile"
  ON users FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- ADMIN pode criar usuários no seu tenant
CREATE POLICY "admin_insert_users"
  ON users FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('ADMIN', 'SUPERADMIN')
    )
  );

-- ADMIN pode atualizar usuários do seu tenant
CREATE POLICY "admin_update_users"
  ON users FOR UPDATE
  USING (
    tenant_id IN (
      SELECT tenant_id FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('ADMIN', 'SUPERADMIN')
    )
  );
```

### **E. Aplicar Migrations no Supabase**

**Opção 1: Via Dashboard**
1. Acesse Supabase Dashboard → SQL Editor
2. Cole o conteúdo de `001_initial_schema.sql`
3. Execute
4. Repita para `002_enable_rls.sql`

**Opção 2: Via Supabase CLI** (Recomendado)
```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Link ao projeto
supabase link --project-ref your-project-ref

# Aplicar migrations
supabase db push
```

### **F. Criar primeiro tenant e usuário**

**Arquivo `supabase/seed.sql`:**
```sql
-- Criar primeiro tenant
INSERT INTO tenants (name, slug, email, is_active)
VALUES ('Tenant Demo', 'demo', 'demo@example.com', true);

-- Função para criar primeiro SUPERADMIN
-- Execute manualmente APÓS criar o usuário no auth
-- Substitua 'your-user-id' pelo UUID do usuário criado

-- INSERT INTO users (id, tenant_id, email, name, role)
-- VALUES (
--   'your-user-id',  -- UUID do auth.users
--   NULL,            -- SUPERADMIN não tem tenant
--   'admin@example.com',
--   'Super Admin',
--   'SUPERADMIN'
-- );
```

**Criar primeiro usuário:**
1. Vá em Supabase Dashboard → Authentication → Users
2. Clique em "Add User"
3. Preencha email e senha
4. Copie o UUID gerado
5. Execute no SQL Editor:

```sql
INSERT INTO users (id, tenant_id, email, name, role)
VALUES (
  'uuid-copiado-aqui',
  NULL,
  'admin@example.com',
  'Super Admin',
  'SUPERADMIN'
);
```

---

## 5️⃣ TESTAR LOCALMENTE

### **A. Iniciar servidor**

```bash
npm run dev
```

### **B. Testar fluxo de autenticação**

1. Acesse http://localhost:3000
2. Deve redirecionar para `/login`
3. Faça login com o usuário criado
4. Deve redirecionar para `/dashboard`

### **C. Criar página Dashboard básica**

**Arquivo `app/dashboard/page.tsx`:**
```typescript
import { createClient } from '@/lib/supabase/server'
import { getCurrentUserProfile } from '@/lib/helpers'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const user = await getCurrentUserProfile()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="mt-4">
        <p>Bem-vindo, {user.name}!</p>
        <p>Role: <span className="font-semibold">{user.role}</span></p>
        <p>Email: {user.email}</p>
      </div>
    </div>
  )
}
```

---

## 6️⃣ PRÓXIMOS PASSOS

### **Implementar RoleGuard**

Copie de `TEMPLATE_BFF_SUPABASE.md` seção "Sistema de Roles"

### **Criar Server Actions**

```bash
touch lib/actions/admin-actions.ts
touch lib/actions/user-actions.ts
```

### **Criar Specs para Features**

```bash
mkdir specs/001-primeira-feature
touch specs/001-primeira-feature/spec.md
touch specs/001-primeira-feature/data-model.md
touch specs/001-primeira-feature/plan.md
```

### **Documentação**

```bash
touch MULTITENANT.md
touch ROLE_HIERARCHY.md
```

---

## 🎯 RESUMO - COMANDOS ESSENCIAIS

```bash
# Setup inicial
npx create-next-app@latest my-project
cd my-project
npm install @supabase/ssr @supabase/supabase-js

# Criar estrutura
mkdir -p lib/supabase lib/actions lib/helpers types components supabase/migrations

# Desenvolvimento
npm run dev

# Deploy (exemplo Cloud Run)
docker build -t my-app .
docker run -p 8080:8080 my-app
```

---

## 📚 REFERÊNCIAS RÁPIDAS

- **Template completo**: `TEMPLATE_BFF_SUPABASE.md`
- **Supabase Dashboard**: https://supabase.com/dashboard
- **Next.js Docs**: https://nextjs.org/docs
- **Código de exemplo**: Este projeto (fitpro-bff)

---

## ⚠️ CHECKLIST FINAL

Antes de começar a desenvolver features:

- [ ] `.env.local` configurado e em `.gitignore`
- [ ] Middleware de autenticação funcionando
- [ ] Database schema criado e aplicado
- [ ] RLS policies habilitadas
- [ ] Primeiro usuário criado e testado
- [ ] Login/logout funcionando
- [ ] Dashboard básico acessível
- [ ] Tipos TypeScript definidos
- [ ] Estrutura de pastas criada

**Pronto! Agora você tem uma base sólida para desenvolver sua aplicação! 🚀**
