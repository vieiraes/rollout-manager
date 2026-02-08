# Implementation Plan: Next.js 15 BFF Refactor

## Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.7+
- **UI Library**: React 18
- **Styling**: Tailwind CSS 3.x
- **Component Library**: Shadcn/ui (Radix UI primitives)
- **Forms**: React Hook Form + Zod validation
- **State Management**: React Server Components (built-in)

### Backend
- **Framework**: Next.js API Routes (replaces NestJS)
- **Language**: TypeScript 5.7+
- **Validation**: Zod schemas
- **Error Handling**: Custom error utilities

### Database
- **Current**: SQLite (development)
- **ORM**: Prisma 6.6.0
- **Future**: Firestore (easy migration path)

### Libraries
- **Date Handling**: date-fns, date-fns-tz
- **Excel Export**: exceljs
- **HTTP Client**: Native fetch (built into Next.js)

### Deployment
- **Platform**: Firebase (Hosting + Cloud Functions)
- **Runtime**: Node.js 20
- **Build**: Next.js standalone output

### Development Tools
- **Package Manager**: npm
- **Linter**: ESLint
- **Formatter**: Prettier
- **Git**: GitHub

---

## Project Structure

```
rollout-manager/
│
├── app/                                 # Next.js App Router
│   ├── layout.tsx                       # Root layout
│   ├── page.tsx                         # Landing page
│   │
│   ├── (dashboard)/                     # Route group with layout
│   │   ├── layout.tsx                   # Dashboard layout (navigation)
│   │   ├── page.tsx                     # Dashboard home
│   │   │
│   │   ├── notebooks/
│   │   │   ├── page.tsx                 # List notebooks
│   │   │   ├── novo/page.tsx            # Create notebook
│   │   │   └── [id]/page.tsx            # Notebook details
│   │   │
│   │   ├── movements/
│   │   │   ├── page.tsx                 # List movements
│   │   │   └── novo/page.tsx            # Create movement
│   │   │
│   │   └── places/
│   │       ├── page.tsx                 # List places
│   │       └── [id]/page.tsx            # Place details
│   │
│   └── api/                             # Backend API Routes
│       ├── notebooks/
│       │   ├── route.ts                 # GET, POST /api/notebooks
│       │   ├── [id]/route.ts            # GET, PATCH, DELETE /api/notebooks/:id
│       │   ├── service-tag/[tag]/route.ts
│       │   └── inventory/route.ts
│       │
│       ├── movements/
│       │   ├── route.ts                 # GET, POST /api/movements
│       │   ├── [id]/route.ts
│       │   ├── notebook/[id]/route.ts
│       │   └── by-service-tag/route.ts
│       │
│       ├── places/
│       │   ├── route.ts                 # GET, POST /api/places
│       │   └── [id]/route.ts            # GET, PATCH, DELETE
│       │
│       └── export/
│           └── notebooks/route.ts       # Excel export
│
├── components/                          # React components
│   ├── ui/                              # Shadcn/ui base components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── table.tsx
│   │   ├── dialog.tsx
│   │   ├── select.tsx
│   │   └── badge.tsx
│   │
│   ├── layout/
│   │   ├── navigation.tsx               # Mobile bottom nav
│   │   └── mobile-layout.tsx
│   │
│   ├── notebooks/
│   │   ├── notebook-card.tsx
│   │   ├── notebook-list.tsx
│   │   └── notebook-form.tsx
│   │
│   ├── movements/
│   │   ├── movement-card.tsx
│   │   └── movement-form.tsx
│   │
│   ├── places/
│   │   ├── place-card.tsx
│   │   └── place-form.tsx
│   │
│   ├── dashboard/
│   │   ├── stats-card.tsx
│   │   └── recent-activity.tsx
│   │
│   └── export/
│       └── export-button.tsx
│
├── lib/                                 # Utilities and business logic
│   ├── actions/                         # Server Actions
│   │   ├── notebooks.actions.ts
│   │   ├── movements.actions.ts
│   │   └── places.actions.ts
│   │
│   ├── services/                        # Business logic (migrated from NestJS)
│   │   ├── notebooks.service.ts
│   │   ├── movements.service.ts
│   │   ├── places.service.ts
│   │   └── export.service.ts
│   │
│   ├── validations/                     # Zod schemas
│   │   ├── notebook.schema.ts
│   │   ├── movement.schema.ts
│   │   └── place.schema.ts
│   │
│   ├── middleware/
│   │   └── error-handler.ts
│   │
│   ├── utils/
│   │   ├── date.util.ts
│   │   └── helpers.ts
│   │
│   ├── prisma.ts                        # Prisma client singleton
│   ├── exceptions.ts                    # Error handling
│   └── constants.ts
│
├── types/                               # TypeScript types
│   ├── index.ts                         # Exported types
│   ├── notebook.types.ts
│   ├── movement.types.ts
│   └── place.types.ts
│
├── prisma/                              # Database (UNCHANGED from NestJS)
│   ├── schema.prisma
│   └── migrations/
│       └── 20250809000330_initial_database/
│
├── public/                              # Static assets
│   ├── icons/
│   ├── manifest.json                    # PWA manifest
│   └── robots.txt
│
├── firebase/                            # Firebase configuration
│   └── .gitkeep
│
├── .env                                 # Environment variables
├── .env.example
├── .firebaserc                          # Firebase project config
├── firebase.json                        # Firebase deployment config
├── next.config.js                       # Next.js configuration
├── tailwind.config.ts                   # Tailwind configuration
├── tsconfig.json                        # TypeScript configuration
├── package.json
├── README.md
├── MIGRATION.md                         # Migration guide
└── DEPLOY.md                            # Deployment guide
```

---

## Architecture Decisions

### Why Next.js 15 over NestJS?

1. **Unified Stack**: Frontend + Backend in one project
2. **Better Mobile Experience**: Server Components optimize mobile performance
3. **Firebase Native**: Next.js has first-class Firebase support
4. **Simpler Deployment**: One deploy command instead of separate frontend/backend
5. **Developer Experience**: Hot reload for both frontend and backend
6. **Type Safety**: End-to-end TypeScript without API client generation

### Why App Router over Pages Router?

1. **Server Components**: Better performance on mobile (less JS to download)
2. **Streaming**: Progressive page rendering for faster perceived load times
3. **Layouts**: Shared UI without prop drilling
4. **Future-proof**: App Router is the recommended approach

### Why Shadcn/ui over Material-UI?

1. **Lightweight**: Only includes components you use
2. **Customizable**: Full control over styling
3. **Accessible**: Built on Radix UI primitives
4. **Tailwind Native**: Works perfectly with Tailwind CSS
5. **Mobile Optimized**: Touch-friendly by default

### Why Keep SQLite (for now)?

1. **Zero Migration**: Prisma schema unchanged
2. **Fast Development**: No cloud database setup needed
3. **Easy Transition**: Prisma supports multiple databases
4. **Future Firestore**: Can migrate when needed

---

## Mobile-First Design Principles

### Breakpoints
```css
/* Mobile First Approach */
default: 375px (mobile)
sm: 640px (large mobile)
md: 768px (tablet)
lg: 1024px (desktop)
xl: 1280px (large desktop)
```

### Touch Targets
- Minimum 44x44px for all interactive elements
- 8px spacing between touch targets
- Large, clear buttons and icons

### Navigation
- Bottom tab bar for primary navigation (mobile)
- Hamburger menu for secondary actions
- Sticky headers for context

### Forms
- Large input fields (min 44px height)
- Native mobile inputs (date, select)
- Clear validation messages
- Submit buttons always visible

### Performance
- Images lazy-loaded
- Virtual scrolling for long lists
- Optimistic updates for better perceived speed
- Skeleton screens during loading

---

## Data Flow

### Server Components (Default)
```
User → Next.js Server Component → Prisma → Database → Response
```
- Fast initial page load
- SEO friendly
- Less JavaScript to download

### API Routes (for mutations)
```
Client Form → POST /api/notebooks → Service Layer → Prisma → Database
```
- Standard REST API
- Can be called from any client
- Proper HTTP semantics

### Server Actions (for forms)
```
<form action={serverAction}> → Server Function → Prisma → Database
```
- No API endpoint needed
- Automatic form handling
- Progressive enhancement

---

## Migration Strategy

### Phase-by-Phase Approach

1. **Setup** (Phase 1)
   - Create Next.js project
   - Install dependencies
   - Copy Prisma schema

2. **Foundation** (Phase 2)
   - Setup utilities
   - Create base components
   - Configure Tailwind

3. **Backend First** (Phases 3-5)
   - Migrate API endpoints
   - Migrate services
   - Ensure all endpoints work

4. **Frontend** (Phases 6-8)
   - Build mobile UI
   - Connect to APIs
   - Polish UX

5. **Deployment** (Phase 9)
   - Firebase configuration
   - Production testing

6. **Polish** (Phase 10)
   - Documentation
   - Performance optimization
   - Final testing

---

## Testing Strategy

### Manual Testing Focus
- API endpoints with Postman/curl
- UI on mobile viewports (Chrome DevTools)
- Real device testing (iOS Safari, Chrome Android)
- Form validation edge cases
- Error handling scenarios

### Test Checklists
- [ ] All CRUD operations work
- [ ] Pagination works correctly
- [ ] Search and filters return correct results
- [ ] Forms validate properly
- [ ] Excel export generates valid files
- [ ] Mobile layout renders correctly at 375px
- [ ] Touch targets are tappable
- [ ] Navigation works smoothly

---

## Environment Variables

```env
# Database
DATABASE_URL="file:./dev.db"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Firebase (for deployment)
NEXT_PUBLIC_FIREBASE_PROJECT_ID=""
FIREBASE_SERVICE_ACCOUNT=""

# App Configuration
NODE_ENV="development"
```

---

## Future Enhancements

### Phase 2 (After Initial Refactor)
1. QR Code Scanner
   - Integrate `@zxing/browser` or `html5-qrcode`
   - Use device camera API
   - Scan service tags for quick lookup

2. PWA Features
   - Service worker for offline support
   - Install prompt
   - App shortcuts

3. Advanced UI/UX
   - Dark mode
   - Animations with Framer Motion
   - Charts with Recharts
   - Advanced filtering

4. Backend Enhancements
   - User authentication (Firebase Auth)
   - Role-based access control
   - Audit logs
   - Real-time updates (Firebase Realtime)

---

## Success Metrics

### Technical
- All 100 tasks completed
- No regression in functionality
- Mobile Lighthouse score > 90
- API response time < 200ms

### User Experience
- App usable on mobile exclusively
- Forms easy to fill on smartphone
- Fast perceived performance
- Clear visual feedback

### Code Quality
- TypeScript strict mode enabled
- Zero ESLint errors
- Consistent code style
- Well-documented code

---

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Data loss during migration | Keep current NestJS code intact, run in parallel initially |
| Mobile performance issues | Use Next.js Server Components, lazy loading, code splitting |
| Firebase deployment complexity | Thorough testing with emulators, comprehensive documentation |
| Breaking changes in dependencies | Lock dependency versions, test before upgrading |
| Learning curve for team | Detailed migration docs, code comments, pair programming |

---

## Timeline

**MVP (Notebooks Module Only)**:
- Phases 1-3 + Phase 6
- 40 tasks
- 20-30 hours
- ~1 week with one developer

**Full Refactor**:
- All phases (1-10)
- 100 tasks
- 50-70 hours
- ~2-3 weeks with one developer

**With Parallelization** (2 developers):
- ~1.5 weeks for full refactor
- Developer 1: Backend (Phases 3-5)
- Developer 2: Frontend (Phases 6-8)
