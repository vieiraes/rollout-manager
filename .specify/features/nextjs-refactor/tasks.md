---
description: "Complete refactor from NestJS to Next.js 15 BFF with mobile-first UI"
---

# Tasks: Next.js 15 BFF Refactor - Mobile-First

**Context**: Complete migration from NestJS backend to Next.js 15 BFF (Backend for Frontend) with unified API + Frontend, optimized for mobile-first experience and Firebase deployment.

**Key Requirements**:
- ✅ Mobile-first responsive design (primary focus)
- ✅ Single unified project (API + Frontend)
- ✅ Maintain all existing functionality
- ✅ Keep Prisma + SQLite database intact
- ✅ Firebase deployment ready
- 🔮 Prepared for QR Code scanning (future feature)

**Tests**: Not included in this refactor - focus is on migration and functional UI.

---

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, etc.)
- All file paths are absolute from project root

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Create Next.js 15 project structure and install dependencies

- [X] T001 Create new Next.js 15 project with TypeScript, Tailwind CSS, and App Router in root directory (replace current structure)
- [X] T002 Install core dependencies: zod, react-hook-form, @hookform/resolvers, exceljs, date-fns, date-fns-tz in package.json
- [X] T003 [P] Install Prisma dependencies: @prisma/client, prisma in package.json
- [X] T004 [P] Setup Shadcn/ui: run npx shadcn@latest init with default config
- [X] T005 [P] Copy entire prisma/ directory from current project (schema.prisma + migrations/) to new structure
- [X] T006 [P] Configure next.config.js for Firebase deployment (output: 'standalone')
- [X] T007 [P] Create .env.example with DATABASE_URL and other env vars
- [X] T008 Setup mobile-first viewport meta tags in app/layout.tsx
- [X] T009 Configure Tailwind with mobile-first breakpoints in tailwind.config.ts

---

## Phase 2: Foundational (Core Infrastructure)

**Purpose**: Core infrastructure required by ALL user stories - MUST complete before proceeding

**⚠️ CRITICAL**: Block all other phases until complete

- [X] T010 Create Prisma Client singleton in lib/prisma.ts with optimized connection pooling
- [X] T011 [P] Create error handling utilities in lib/exceptions.ts (replaces NestJS exceptions)
- [X] T012 [P] Create date utilities in lib/utils/date.util.ts (copy from src/utils/date.util.ts)
- [X] T013 [P] Create TypeScript types in types/index.ts for all Prisma models
- [X] T014 [P] Setup base API route error handler middleware in lib/middleware/error-handler.ts
- [X] T015 Create Zod validation schemas in lib/validations/notebook.schema.ts
- [X] T016 [P] Create Zod validation schemas in lib/validations/movement.schema.ts
- [X] T017 [P] Create Zod validation schemas in lib/validations/place.schema.ts
- [X] T018 [P] Install and configure shadcn/ui components: Button, Table, Form, Input, Select, Card, Dialog, Badge
- [X] T019 Create mobile-optimized layout component in components/layout/mobile-layout.tsx
- [X] T020 Create responsive navigation component in components/layout/navigation.tsx with bottom tab bar for mobile

**Checkpoint**: Foundation ready - can now implement user stories in parallel

---

## Phase 3: User Story 1 - Backend Notebooks API (Priority: P1) 🎯 MVP

**Goal**: Migrate all Notebooks API endpoints from NestJS to Next.js API Routes

**Independent Test**: All notebooks CRUD operations work via API calls (GET, POST, PATCH, DELETE)

### Implementation for User Story 1

- [ ] T021 [P] [US1] Create NotebooksService class in lib/services/notebooks.service.ts (migrate from src/notebooks/notebooks.service.ts)
- [ ] T022 [P] [US1] Create GET/POST handler in app/api/notebooks/route.ts
- [ ] T023 [P] [US1] Create GET/PATCH/DELETE handler in app/api/notebooks/[id]/route.ts
- [ ] T024 [P] [US1] Create GET handler in app/api/notebooks/service-tag/[tag]/route.ts
- [ ] T025 [P] [US1] Create GET handler in app/api/notebooks/inventory/route.ts with query params support
- [ ] T026 [US1] Add request validation using Zod schemas in all notebook routes
- [ ] T027 [US1] Add error handling and proper HTTP status codes in all notebook routes
- [ ] T028 [US1] Add pagination logic to GET /api/notebooks endpoint
- [ ] T029 [US1] Test all notebook API endpoints with Postman/curl

**Checkpoint**: Notebooks API fully functional and returning proper responses

---

## Phase 4: User Story 2 - Backend Movements & Places API (Priority: P1) 🎯 MVP

**Goal**: Migrate Movements and Places API endpoints from NestJS to Next.js API Routes

**Independent Test**: All movements and places CRUD operations work via API

### Implementation for User Story 2

- [ ] T030 [P] [US2] Create MovementsService class in lib/services/movements.service.ts (migrate from src/movements/movements.service.ts)
- [ ] T031 [P] [US2] Create PlacesService class in lib/services/places.service.ts (migrate from src/places/places.service.ts)
- [ ] T032 [P] [US2] Create GET/POST handler in app/api/movements/route.ts
- [ ] T033 [P] [US2] Create POST handler in app/api/movements/by-service-tag/route.ts
- [ ] T034 [P] [US2] Create GET handler in app/api/movements/[id]/route.ts
- [ ] T035 [P] [US2] Create GET handler in app/api/movements/notebook/[id]/route.ts
- [ ] T036 [P] [US2] Create GET/POST handler in app/api/places/route.ts
- [ ] T037 [P] [US2] Create GET/PATCH/DELETE handler in app/api/places/[id]/route.ts
- [ ] T038 [US2] Add request validation using Zod schemas in all movement and place routes
- [ ] T039 [US2] Add error handling in all movement and place routes
- [ ] T040 [US2] Test movements and places API endpoints

**Checkpoint**: Movements and Places APIs fully functional

---

## Phase 5: User Story 3 - Backend Export API (Priority: P2)

**Goal**: Migrate Excel export functionality to Next.js API Route

**Independent Test**: Export endpoint generates valid Excel file with notebooks and movements data

### Implementation for User Story 3

- [ ] T041 [US3] Create ExportService class in lib/services/export.service.ts (migrate from src/export/export.service.ts)
- [ ] T042 [US3] Create GET handler in app/api/export/notebooks/route.ts with Excel download response
- [ ] T043 [US3] Ensure exports/ directory is created and writable
- [ ] T044 [US3] Add proper headers for file download (Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet)
- [ ] T045 [US3] Test Excel export generates valid file with correct data

**Checkpoint**: Export functionality works and generates proper Excel files

---

## Phase 6: User Story 4 - UI Mobile-First Notebooks Module (Priority: P1) 🎯 MVP

**Goal**: Create mobile-first UI for notebooks CRUD with responsive design optimized for smartphones

**Independent Test**: Can create, list, view, edit, and delete notebooks from mobile browser

### Implementation for User Story 4

- [ ] T046 [P] [US4] Create notebook list page in app/(dashboard)/notebooks/page.tsx with mobile-optimized cards
- [ ] T047 [P] [US4] Create notebook detail page in app/(dashboard)/notebooks/[id]/page.tsx with mobile layout
- [ ] T048 [P] [US4] Create new notebook page in app/(dashboard)/notebooks/novo/page.tsx
- [ ] T049 [P] [US4] Create NotebookCard component in components/notebooks/notebook-card.tsx optimized for touch/tap
- [ ] T050 [P] [US4] Create NotebookList component in components/notebooks/notebook-list.tsx with virtual scrolling for performance
- [ ] T051 [US4] Create NotebookForm component in components/notebooks/notebook-form.tsx with mobile-friendly inputs
- [ ] T052 [US4] Add form validation with React Hook Form + Zod in NotebookForm
- [ ] T053 [US4] Create server action in lib/actions/notebooks.actions.ts for form submissions
- [ ] T054 [US4] Add loading states and optimistic updates for better mobile UX
- [ ] T055 [US4] Add pull-to-refresh functionality for notebook list on mobile
- [ ] T056 [US4] Add search and filter UI optimized for mobile (bottom sheet style)
- [ ] T057 [US4] Add pagination controls with infinite scroll for mobile
- [ ] T058 [US4] Test responsive layout on mobile viewport (375px width)
- [ ] T059 [US4] Add touch-friendly action buttons (min 44px tap targets)

**Checkpoint**: Notebooks module fully functional on mobile devices with excellent UX

---

## Phase 7: User Story 5 - UI Mobile-First Movements & Places (Priority: P2)

**Goal**: Create mobile-first UI for movements and places management

**Independent Test**: Can create movements and manage places from mobile browser

### Implementation for User Story 5

- [ ] T060 [P] [US5] Create movements list page in app/(dashboard)/movements/page.tsx with timeline view for mobile
- [ ] T061 [P] [US5] Create new movement page in app/(dashboard)/movements/novo/page.tsx
- [ ] T062 [P] [US5] Create places list page in app/(dashboard)/places/page.tsx with grid layout for mobile
- [ ] T063 [P] [US5] Create place detail page in app/(dashboard)/places/[id]/page.tsx
- [ ] T064 [P] [US5] Create MovementCard component in components/movements/movement-card.tsx with timeline style
- [ ] T065 [P] [US5] Create MovementForm component in components/movements/movement-form.tsx with mobile inputs
- [ ] T066 [P] [US5] Create PlaceCard component in components/places/place-card.tsx
- [ ] T067 [P] [US5] Create PlaceForm component in components/places/place-form.tsx
- [ ] T068 [US5] Add service tag scanner placeholder in movement form (text input for now, camera icon for future)
- [ ] T069 [US5] Create server actions in lib/actions/movements.actions.ts
- [ ] T070 [US5] Create server actions in lib/actions/places.actions.ts
- [ ] T071 [US5] Add form validation for all forms
- [ ] T072 [US5] Test movements and places UI on mobile viewport

**Checkpoint**: Movements and Places modules work perfectly on mobile

---

## Phase 8: User Story 6 - UI Dashboard & Reports (Priority: P2)

**Goal**: Create mobile-first dashboard with analytics and export functionality

**Independent Test**: Dashboard displays key metrics and export works from mobile

### Implementation for User Story 6

- [ ] T073 [P] [US6] Create dashboard page in app/(dashboard)/page.tsx with mobile-first card layout
- [ ] T074 [P] [US6] Create StatsCard component in components/dashboard/stats-card.tsx
- [ ] T075 [P] [US6] Create RecentActivity component in components/dashboard/recent-activity.tsx
- [ ] T076 [US6] Add real-time stats queries (total notebooks, by status, by type)
- [ ] T077 [US6] Create export button component in components/export/export-button.tsx
- [ ] T078 [US6] Add client-side export trigger that calls /api/export/notebooks
- [ ] T079 [US6] Add download progress indicator for mobile
- [ ] T080 [US6] Create shared layout in app/(dashboard)/layout.tsx with mobile bottom navigation
- [ ] T081 [US6] Test dashboard loads fast on mobile (< 2s)

**Checkpoint**: Dashboard provides clear overview and export works smoothly on mobile

---

## Phase 9: User Story 7 - Firebase Deployment Configuration (Priority: P3)

**Goal**: Configure project for Firebase deployment with Cloud Functions

**Independent Test**: Project deploys successfully to Firebase and runs in production

### Implementation for User Story 7

- [ ] T082 [P] [US7] Create firebase.json in root with hosting and functions configuration
- [ ] T083 [P] [US7] Create .firebaserc in root with project configuration
- [ ] T084 [P] [US7] Update next.config.js with Firebase-optimized settings (standalone output)
- [ ] T085 [P] [US7] Create deployment documentation in DEPLOY.md for Firebase setup
- [ ] T086 [US7] Add npm scripts for Firebase deployment in package.json
- [ ] T087 [US7] Configure environment variables for Firebase Functions
- [ ] T088 [US7] Add .gitignore entries for Firebase cache and build artifacts
- [ ] T089 [US7] Test local build with firebase emulators:start

**Checkpoint**: Project ready for Firebase deployment

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Final touches and optimizations across the entire application

- [ ] T090 [P] Update README.md with new tech stack and setup instructions
- [ ] T091 [P] Create MIGRATION.md documenting NestJS → Next.js migration guide
- [ ] T092 [P] Add mobile PWA manifest.json for installable app
- [ ] T093 [P] Add mobile app icons and splash screens in public/
- [ ] T094 [P] Update postman_collection.json with new Next.js API endpoints
- [ ] T095 Performance audit on mobile (Lighthouse score > 90)
- [ ] T096 Add offline support preparation (service worker stub)
- [ ] T097 Add QR Code scanner placeholder UI (camera icon with "Coming Soon" toast)
- [ ] T098 Security audit: sanitize all inputs, check CORS settings
- [ ] T099 Add proper meta tags for mobile sharing (Open Graph)
- [ ] T100 Final mobile testing on real devices (iOS Safari, Chrome Android)

---

## Dependencies & Execution Order

### Phase Dependencies

1. **Setup (Phase 1)**: No dependencies - START HERE
2. **Foundational (Phase 2)**: Depends on Setup - BLOCKS ALL user stories
3. **Backend APIs (Phases 3-5)**: All depend on Foundational - Can run in parallel
4. **Frontend UI (Phases 6-8)**: Depends on respective Backend APIs being complete
5. **Firebase (Phase 9)**: Depends on all core features being complete
6. **Polish (Phase 10)**: Depends on everything else

### User Story Dependencies

```
Setup (Phase 1)
    ↓
Foundational (Phase 2) ← MUST COMPLETE FIRST
    ↓
    ├─→ US1: Notebooks API (Phase 3) ────→ US4: Notebooks UI (Phase 6) ──┐
    ├─→ US2: Movements/Places API (Phase 4) ─→ US5: Movements/Places UI (Phase 7) ─┤
    ├─→ US3: Export API (Phase 5) ────────────────────────────────────────┘
    │                                                ↓
    │                                          US6: Dashboard (Phase 8)
    │                                                ↓
    └──────────────────────────────────────→ US7: Firebase Config (Phase 9)
                                                    ↓
                                              Polish (Phase 10)
```

### Parallel Opportunities

**Within Setup (Phase 1)**:
- T003, T004, T005, T006, T007 can all run in parallel after T001-T002

**Within Foundational (Phase 2)**:
- T011, T012, T013, T014 can run in parallel
- T015, T016, T017 can run in parallel
- T018, T019, T020 can run in parallel

**Backend APIs (Phases 3-5)**:
- ALL three user stories (US1, US2, US3) can be implemented in parallel
- US1 tasks T021-T025 can run in parallel (all independent services/routes)
- US2 tasks T030-T037 can run in parallel
- US3 is small and sequential

**Frontend UI (Phases 6-8)**:
- After respective APIs are done, UI can be built in parallel
- Within US4: T046-T050 can run in parallel (different files)
- Within US5: T060-T067 can run in parallel (different components)
- Within US6: T073-T075 can run in parallel

**Firebase (Phase 9)**:
- T082-T085 can run in parallel (independent config files)

**Polish (Phase 10)**:
- T090-T094 can run in parallel (documentation)

### Critical Path for MVP (Fastest Route to Working Product)

**MVP = Mobile app that can manage notebooks**

1. Phase 1: Setup (T001-T009) - ~2-4 hours
2. Phase 2: Foundational (T010-T020) - ~4-6 hours
3. Phase 3: US1 Notebooks API (T021-T029) - ~6-8 hours
4. Phase 6: US4 Notebooks UI (T046-T059) - ~8-12 hours

**Total MVP Time**: ~20-30 hours

**Full Project Time**: ~50-70 hours

---

## Mobile-First Requirements Checklist

- ✅ Viewport meta tag configured
- ✅ Touch targets minimum 44px (WCAG AAA)
- ✅ Bottom navigation for primary actions
- ✅ Pull-to-refresh on list views
- ✅ Infinite scroll for long lists
- ✅ Mobile-optimized forms (large inputs, native selectors)
- ✅ Fast loading (< 2s on 3G)
- ✅ Responsive breakpoints (mobile-first approach)
- ✅ PWA manifest for installable app
- 🔮 QR Code scanner placeholder (future feature)
- 🔮 Camera API integration (future feature)
- 🔮 Offline support (future enhancement)

---

## Future Enhancements (Not in Scope)

These are mentioned for planning but NOT implemented in this refactor:

1. **QR Code Scanner** (Future US8)
   - Integrate with device camera
   - Scan service tags for quick lookup
   - Barcode scanner support
   - Tasks: ~8 hours

2. **Advanced PWA Features** (Future US9)
   - Full offline mode
   - Background sync
   - Push notifications
   - Tasks: ~12-16 hours

3. **Analytics Dashboard** (Future US10)
   - Charts and graphs
   - Advanced filtering
   - Export to multiple formats
   - Tasks: ~16-20 hours

---

## Testing Strategy

**Manual Testing Focus Areas**:
1. All API endpoints respond correctly
2. CRUD operations work end-to-end
3. Mobile responsive on 375px, 768px, 1024px viewports
4. Touch interactions work smoothly
5. Forms validate properly
6. Export generates valid Excel
7. Navigation works on mobile

**Test Devices**:
- Chrome DevTools mobile emulation
- Real device: iPhone (Safari)
- Real device: Android (Chrome)

---

## Success Criteria

**Technical**:
- ✅ All NestJS functionality migrated
- ✅ Database schema unchanged (Prisma + SQLite)
- ✅ All API endpoints functional
- ✅ Mobile-first UI works on smartphones
- ✅ Firebase deployment ready

**User Experience**:
- ✅ App usable on mobile without desktop
- ✅ Touch-friendly interface
- ✅ Fast loading and smooth interactions
- ✅ Clear mobile navigation

**Code Quality**:
- ✅ TypeScript strict mode
- ✅ Zod validation on all inputs
- ✅ Error handling consistent
- ✅ Code organized and maintainable

---

**Total Tasks**: 100
**Estimated Hours**: 50-70 hours
**MVP Tasks**: 40 (T001-T059 excluding US2, US3, US5)
**MVP Hours**: 20-30 hours
