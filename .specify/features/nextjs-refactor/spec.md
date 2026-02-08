# Feature Specification: Next.js 15 BFF Refactor

## Overview

Complete migration from NestJS backend architecture to Next.js 15 BFF (Backend for Frontend) with unified API + Frontend in a single project, optimized for mobile-first experience.

---

## User Stories

### 🎯 User Story 1 (P1) - Backend Notebooks API Migration

**As a** developer  
**I want** all Notebooks API endpoints migrated to Next.js API Routes  
**So that** I can maintain CRUD functionality while using Next.js framework

**Acceptance Criteria**:
- All NestJS notebook endpoints work in Next.js
- GET /api/notebooks with pagination
- POST /api/notebooks creates notebook
- GET /api/notebooks/[id] returns notebook details
- PATCH /api/notebooks/[id] updates notebook
- DELETE /api/notebooks/[id] removes notebook
- GET /api/notebooks/service-tag/[tag] finds by service tag
- Zod validation on all inputs
- Proper error handling with HTTP status codes

---

### 🎯 User Story 2 (P1) - Backend Movements & Places API Migration

**As a** developer  
**I want** Movements and Places API endpoints migrated to Next.js  
**So that** I can track device movements and locations in the new architecture

**Acceptance Criteria**:
- All movement endpoints functional
- All place endpoints functional
- Relationships between notebooks, movements, and places maintained
- Validation and error handling consistent

---

### User Story 3 (P2) - Backend Export API Migration

**As a** user  
**I want** to export data to Excel from the new system  
**So that** I can generate reports for management

**Acceptance Criteria**:
- Export endpoint generates valid Excel file
- File includes notebooks and movements sheets
- Download works on mobile devices
- Proper MIME types and headers

---

### 🎯 User Story 4 (P1) - Mobile-First Notebooks UI

**As a** field technician using a smartphone  
**I want** to manage notebooks from my mobile device  
**So that** I can work efficiently without needing a desktop computer

**Acceptance Criteria**:
- Notebook list displays well on 375px width screens
- Can create new notebook with mobile keyboard
- Can edit notebook with touch-friendly forms
- Can delete notebook with confirmation
- Cards optimized for touch (min 44px tap targets)
- Pull-to-refresh works on list
- Fast loading (< 2s on 3G)
- Search and filters work on mobile

---

### User Story 5 (P2) - Mobile-First Movements & Places UI

**As a** warehouse staff using a tablet/phone  
**I want** to record device movements and manage locations on mobile  
**So that** I can update inventory in real-time from the warehouse floor

**Acceptance Criteria**:
- Movement creation form works on mobile
- Timeline view shows movement history
- Places grid displays well on small screens
- Service tag input ready for barcode scanner (placeholder for now)
- Touch-friendly action buttons

---

### User Story 6 (P2) - Mobile-First Dashboard & Reports

**As a** manager  
**I want** to see key metrics on my phone  
**So that** I can monitor rollout progress from anywhere

**Acceptance Criteria**:
- Dashboard cards show total notebooks, by status, by type
- Recent activity displays latest movements
- Export button triggers Excel download on mobile
- Navigation works via bottom tab bar
- Dashboard loads in < 2s

---

### User Story 7 (P3) - Firebase Deployment Configuration

**As a** DevOps engineer  
**I want** the project configured for Firebase deployment  
**So that** I can host the application in production

**Acceptance Criteria**:
- firebase.json configured correctly
- Cloud Functions work with Next.js API Routes
- Static assets served via Firebase Hosting
- Environment variables configured
- Deployment documentation complete

---

## Future Features (Out of Scope)

These are planned for future iterations:

### User Story 8 (Future) - QR Code Scanner

**As a** technician  
**I want** to scan service tag barcodes with my phone camera  
**So that** I can quickly look up devices without typing

**Acceptance Criteria** (Future):
- Camera API integration
- QR code and barcode recognition
- Auto-fill service tag field
- Works on iOS and Android

---

## Non-Functional Requirements

### Performance
- Mobile page load < 2s on 3G
- Lighthouse mobile score > 90
- First Contentful Paint < 1.5s
- Time to Interactive < 3s

### Accessibility
- Touch targets minimum 44px (WCAG AAA)
- Keyboard navigation works
- Screen reader compatible
- Color contrast ratio > 4.5:1

### Mobile-First
- Responsive design breakpoints: 375px, 768px, 1024px
- Touch-optimized interactions
- Bottom navigation for primary actions
- Pull-to-refresh on lists
- Native mobile inputs (date pickers, selectors)

### Browser Support
- iOS Safari 15+
- Chrome Android 100+
- Chrome Desktop (latest)
- Firefox (latest)

### Security
- Input validation with Zod
- SQL injection prevention via Prisma
- XSS protection
- CORS configured properly
- Environment secrets not exposed

---

## Out of Scope

- Push notifications
- Offline-first functionality (PWA full mode)
- Multi-language support
- Dark mode (nice to have, not required)
- Advanced analytics/charts
- Real-time collaboration
- User authentication (future enhancement)
