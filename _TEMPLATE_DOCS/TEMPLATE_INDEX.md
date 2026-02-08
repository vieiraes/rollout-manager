# 📘 TEMPLATE & DOCUMENTAÇÃO - BFF Supabase

> **Repositório de Boilerplate**: Arquitetura reutilizável para aplicações BFF (Backend For Frontend) com Next.js e Supabase

---

## 📚 DOCUMENTAÇÃO DISPONÍVEL

Este repositório contém documentação completa para servir como **template/boilerplate** para novos projetos. Abaixo está o guia de qual documento ler para cada situação:

### **🎯 Para Desenvolvedores Humanos**

| Documento | Quando Usar | Conteúdo |
|-----------|-------------|----------|
| **[TEMPLATE_BFF_SUPABASE.md](./TEMPLATE_BFF_SUPABASE.md)** | Entender a arquitetura completa | Arquitetura BFF, stack tecnológica, estrutura de pastas, padrões de código, sistema de roles, multi-tenancy, deploy |
| **[QUICKSTART_NOVO_PROJETO.md](./QUICKSTART_NOVO_PROJETO.md)** | Iniciar um novo projeto do zero | Guia passo a passo (30-60min) para configurar um novo projeto usando este template |
| **[CHECKLIST_NOVO_PROJETO.md](./CHECKLIST_NOVO_PROJETO.md)** | Acompanhar progresso do setup | Checklist completo e imprimível de todas as etapas para criar um novo projeto |
| **[ARCHITECTURE_DIAGRAMS.md](./ARCHITECTURE_DIAGRAMS.md)** | Visualizar arquitetura | Diagramas visuais da stack, fluxos de dados, segurança, multi-tenancy |
| **[MULTITENANT.md](./MULTITENANT.md)** | Entender multi-tenancy neste projeto | Arquitetura multi-tenant do FitPro, isolamento de dados, RLS policies específicas |
| **[ROLE_HIERARCHY.md](./ROLE_HIERARCHY.md)** | Entender hierarquia de roles no FitPro | Detalhes sobre SUPERADMIN, ADMIN, MANAGER, INSTRUCTOR, STUDENT e suas permissões |

### **🤖 Para Agentes de IA**

| Documento | Quando Usar | Conteúdo |
|-----------|-------------|----------|
| **[AI_AGENT_GUIDE.md](./AI_AGENT_GUIDE.md)** | **SEMPRE LER PRIMEIRO** | Instruções específicas para agentes de IA sobre como interpretar e aplicar este template, erros comuns, padrões obrigatórios |
| **[TEMPLATE_BFF_SUPABASE.md](./TEMPLATE_BFF_SUPABASE.md)** | Referência de arquitetura | Documentação técnica completa da arquitetura |
| **[QUICKSTART_NOVO_PROJETO.md](./QUICKSTART_NOVO_PROJETO.md)** | Implementar novo projeto | Checklist e comandos para setup inicial |
| **[CHECKLIST_NOVO_PROJETO.md](./CHECKLIST_NOVO_PROJETO.md)** | Acompanhar progresso | Lista completa de tarefas para implementação |
| **[ARCHITECTURE_DIAGRAMS.md](./ARCHITECTURE_DIAGRAMS.md)** | Entender visualmente a arquitetura | Diagramas e fluxos do sistema |

---

## 🚀 INÍCIO RÁPIDO

### **Sou um desenvolvedor e quero criar um NOVO projeto:**

1. **Leia**: [QUICKSTART_NOVO_PROJETO.md](./QUICKSTART_NOVO_PROJETO.md)
2. **Siga**: O checklist passo a passo
3. **Consulte**: [TEMPLATE_BFF_SUPABASE.md](./TEMPLATE_BFF_SUPABASE.md) quando tiver dúvidas
4. **Adapte**: Roles e entidades para o seu domínio específico

### **Sou um agente de IA e recebi uma solicitação:**

1. **Leia PRIMEIRO**: [AI_AGENT_GUIDE.md](./AI_AGENT_GUIDE.md)
2. **Identifique** o domínio da aplicação solicitada
3. **Adapte** conceitos (tenants, roles, entidades)
4. **Siga** os padrões e estruturas definidos
5. **NUNCA** copie literalmente - sempre adapte!

### **Estou trabalhando NO projeto FitPro (este repo):**

1. **Entenda multi-tenancy**: [MULTITENANT.md](./MULTITENANT.md)
2. **Entenda hierarquia**: [ROLE_HIERARCHY.md](./ROLE_HIERARCHY.md)
3. **Veja especificações**: [specs/](./specs/)
4. **Siga padrões UI**: [docs/ui-patterns/](./docs/ui-patterns/)

---

## 📁 ESTRUTURA DESTE REPOSITÓRIO

```
fitpro-bff/                           ← PROJETO ATUAL (exemplo de implementação)
│
├── 📘 DOCUMENTAÇÃO TEMPLATE (use como boilerplate)
│   ├── TEMPLATE_BFF_SUPABASE.md      ← Arquitetura completa do template
│   ├── QUICKSTART_NOVO_PROJETO.md    ← Guia de início rápido
│   ├── AI_AGENT_GUIDE.md             ← Guia para agentes de IA
│   └── TEMPLATE_INDEX.md             ← Este arquivo
│
├── 📘 DOCUMENTAÇÃO ESPECÍFICA DO FITPRO
│   ├── MULTITENANT.md                ← Multi-tenancy no FitPro
│   ├── ROLE_HIERARCHY.md             ← Roles do FitPro
│   ├── DEPLOYMENT.md                 ← Deploy do FitPro
│   └── docs/                         ← Documentação adicional
│
├── 📋 ESPECIFICAÇÕES (exemplo de como fazer specs)
│   └── specs/
│       ├── 001-gym-deactivation/
│       └── 002-firebase-deploy/
│
├── 🏗️ CÓDIGO FONTE (exemplo de implementação)
│   ├── app/                          ← App Router (Next.js)
│   ├── components/                   ← Componentes React
│   ├── lib/                          ← Lógica de negócio
│   │   ├── supabase/                 ← Clientes Supabase
│   │   ├── actions/                  ← Server Actions
│   │   └── helpers/                  ← Funções auxiliares
│   ├── types/                        ← Tipos TypeScript
│   ├── supabase/                     ← Migrations e seeds
│   │   └── migrations/
│   └── public/                       ← Assets estáticos
│
└── ⚙️ CONFIGURAÇÃO
    ├── next.config.ts
    ├── tsconfig.json
    ├── package.json
    ├── middleware.ts
    └── Dockerfile
```

---

## 🎯 CASOS DE USO

### **Caso 1: "Quero criar um sistema de e-commerce multi-tenant"**

**Você é:** Desenvolvedor humano

**Faça:**
1. Leia [QUICKSTART_NOVO_PROJETO.md](./QUICKSTART_NOVO_PROJETO.md)
2. Siga os passos de setup
3. Adapte:
   - `tenants` → `stores`
   - `tenant_id` → `store_id`
   - Roles: `SUPERADMIN`, `STORE_OWNER`, `MANAGER`, `CUSTOMER`
4. Crie seu primeiro spec em `specs/001-product-catalog/`
5. Implemente seguindo os padrões do template

### **Caso 2: "Como agente de IA, desenvolver sistema de LMS"**

**Você é:** Agente de IA (ChatGPT, Claude, etc.)

**Faça:**
1. **PRIMEIRO**: Leia [AI_AGENT_GUIDE.md](./AI_AGENT_GUIDE.md)
2. Identifique:
   - Domínio: Learning Management System
   - Tenants: `schools` (escolas)
   - Roles: `PLATFORM_ADMIN`, `SCHOOL_ADMIN`, `TEACHER`, `STUDENT`
3. Adapte schema SQL:
   ```sql
   CREATE TABLE schools (...);
   CREATE TYPE user_role AS ENUM ('PLATFORM_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT');
   ```
4. Mantenha padrões:
   - Estrutura de pastas
   - RLS policies
   - Server Actions
   - RoleGuard

### **Caso 3: "Adicionar feature no FitPro"**

**Você é:** Desenvolvedor trabalhando neste projeto

**Faça:**
1. Leia [MULTITENANT.md](./MULTITENANT.md) e [ROLE_HIERARCHY.md](./ROLE_HIERARCHY.md)
2. Crie spec em `specs/[feature-id]/`
3. Implemente seguindo padrões existentes
4. Veja `specs/001-gym-deactivation/` como exemplo

---

## 🧠 CONCEITOS-CHAVE

### **O que é BFF?**

**Backend For Frontend** - Arquitetura onde Next.js atua como camada intermediária:

```
Frontend (React) 
    ↓
BFF Layer (Next.js Server Components + Server Actions)
    ↓
Backend (Supabase: Auth + Database + RLS)
```

**Benefícios:**
- Segurança (lógica no servidor)
- Performance (Server Components)
- SEO (renderização server-side)
- Type-safety (TypeScript end-to-end)

### **O que é Multi-tenancy?**

Sistema onde múltiplas organizações (tenants) compartilham a mesma instância:

- **SaaS**: Cada cliente é um tenant
- **Isolamento**: RLS garante que dados não vazem entre tenants
- **Eficiência**: Um deploy serve todos os clientes

**Exemplo:**
- FitPro: Cada academia é um tenant
- E-commerce: Cada loja é um tenant
- LMS: Cada escola é um tenant

### **O que é RLS?**

**Row Level Security** - Segurança a nível de linha no PostgreSQL:

```sql
-- Usuários só veem dados do seu tenant
CREATE POLICY "tenant_isolation"
  ON users FOR SELECT
  USING (tenant_id = (SELECT tenant_id FROM users WHERE id = auth.uid()));
```

---

## 📖 ANATOMIA DE UMA FEATURE

### **1. Especificação** (`specs/[feature-id]/`)

```
specs/001-product-catalog/
├── spec.md           ← User stories, requisitos, critérios de sucesso
├── data-model.md     ← Schema SQL, relacionamentos
├── plan.md           ← Plano de implementação, fases
└── tasks.md          ← Checklist de tarefas
```

### **2. Database** (`supabase/migrations/`)

```sql
-- Migration: 003_create_products.sql
CREATE TABLE products (
  id UUID PRIMARY KEY,
  store_id UUID REFERENCES stores(id),  -- tenant_id
  name TEXT,
  price DECIMAL,
  created_at TIMESTAMPTZ
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "products_tenant_isolation" ...
```

### **3. Backend** (`lib/actions/`)

```typescript
// lib/actions/product-actions.ts
'use server'

export async function createProduct(data: ProductData) {
  const user = await getCurrentUserProfile()
  if (!['STORE_OWNER', 'ADMIN'].includes(user.role)) {
    throw new Error('Unauthorized')
  }

  const supabase = await createClient()
  const { data: product } = await supabase
    .from('products')
    .insert({ ...data, store_id: user.tenant_id })

  revalidatePath('/admin/products')
  return { success: true, data: product }
}
```

### **4. Frontend** (`app/` e `components/`)

```tsx
// app/admin/products/page.tsx
import { ProductList } from '@/components/product/product-list'
import { fetchProducts } from '@/lib/actions/product-actions'

export default async function ProductsPage() {
  const products = await fetchProducts()
  return <ProductList products={products} />
}
```

---

## ⚠️ AVISOS IMPORTANTES

### **Para Desenvolvedores:**

1. **NÃO COPIE CEGAMENTE**
   - Este é um TEMPLATE, não um projeto específico
   - Adapte nomes de entidades para seu domínio
   - Mantenha padrões, mude conteúdo

2. **SEGURANÇA É CRÍTICA**
   - Sempre valide permissões em Server Actions
   - Sempre use RLS no banco
   - Nunca exponha service_role_key no client

3. **ESPECIFIQUE ANTES DE CODIFICAR**
   - Sempre crie spec.md antes de implementar
   - Defina critérios de sucesso claros
   - Planeje o modelo de dados

### **Para Agentes de IA:**

1. **LEIA AI_AGENT_GUIDE.md PRIMEIRO**
   - Contém instruções específicas para você
   - Explica erros comuns e como evitá-los
   - Mostra exemplos de adaptação

2. **ADAPTE, NÃO COPIE**
   - Usuário diz "e-commerce" → NÃO use `gyms` e `workouts`
   - Mantenha arquitetura → Mude entidades

3. **SIGA TODOS OS PADRÕES**
   - 4 camadas de segurança
   - Estrutura de pastas
   - Naming conventions
   - RLS policies

---

## 🔗 LINKS ÚTEIS

### **Documentação Oficial**

- [Next.js App Router](https://nextjs.org/docs/app)
- [Supabase Docs](https://supabase.com/docs)
- [Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### **Tutoriais**

- [Next.js + Supabase Auth](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)

---

## 📞 SUPORTE

### **Dúvidas sobre o template:**

1. Consulte a documentação relevante (veja tabela acima)
2. Veja código de exemplo neste repositório
3. Leia especificações em `specs/` para ver padrão de specs

### **Problemas específicos:**

- **Autenticação**: Ver `lib/supabase/` e `middleware.ts`
- **Permissões**: Ver [ROLE_HIERARCHY.md](./ROLE_HIERARCHY.md)
- **Multi-tenancy**: Ver [MULTITENANT.md](./MULTITENANT.md)
- **Deploy**: Ver [DEPLOYMENT.md](./DEPLOYMENT.md) (FitPro específico)

---

## 🎓 PRÓXIMOS PASSOS

### **Se você é NOVO aqui:**

```
1. Leia TEMPLATE_BFF_SUPABASE.md (20min)
   ↓
2. Leia QUICKSTART_NOVO_PROJETO.md (10min)
   ↓
3. Defina seu domínio e roles (30min)
   ↓
4. Siga o quickstart e crie seu projeto (60min)
   ↓
5. Desenvolva sua primeira feature com spec (2h)
```

### **Se você é um AGENTE DE IA:**

```
1. Leia AI_AGENT_GUIDE.md completamente
   ↓
2. Identifique domínio da solicitação do usuário
   ↓
3. Adapte conceitos (tenants, roles)
   ↓
4. Siga padrões rigorosamente
   ↓
5. Crie specs antes de implementar
```

### **Se está CONTRIBUINDO no FitPro:**

```
1. Leia MULTITENANT.md e ROLE_HIERARCHY.md
   ↓
2. Veja specs existentes em specs/
   ↓
3. Crie spec para sua feature
   ↓
4. Implemente seguindo padrões
   ↓
5. Teste com todas as roles
```

---

## 📊 ESTATÍSTICAS DO TEMPLATE

- **Linguagem**: TypeScript
- **Framework**: Next.js 16+ (App Router)
- **Backend**: Supabase (PostgreSQL + Auth)
- **Estilo**: Tailwind CSS 4+
- **Padrão**: BFF (Backend For Frontend)
- **Arquitetura**: Multi-tenant com RLS
- **Segurança**: 4 camadas (Middleware + RoleGuard + Actions + RLS)

---

## 🏆 OBJETIVOS DESTE TEMPLATE

✅ **Reduzir tempo de setup** de novos projetos  
✅ **Garantir boas práticas** de segurança e arquitetura  
✅ **Facilitar onboarding** de novos desenvolvedores  
✅ **Padronizar** estrutura de código  
✅ **Documentar** decisões arquiteturais  
✅ **Servir como referência** para agentes de IA  

---

## 📜 LICENÇA

Este template é fornecido como referência educacional e arquitetural.  
Use livremente para seus projetos.

---

**Criado em**: Fevereiro 2026  
**Versão**: 1.0.0  
**Baseado em**: FitPro BFF (projeto real em produção)  
**Mantenedores**: Time de desenvolvimento  

---

**Boa sorte com seus projetos! 🚀**

> 💡 **Dica**: Marque este repositório como favorito e use como referência sempre que iniciar um novo projeto BFF com Supabase.
