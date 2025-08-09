# AI Agent Instructions for Rollout Manager

## Role and Communication Protocol

### AI Agent Role
- Act as the Project Architect/Developer
- Report to and seek approval from the Product Owner (PO) before implementing changes
- Focus exclusively on assigned sprint demands
- Provide detailed explanations of proposed changes
- Maintain code maintainability and follow best practices

### Communication Guidelines
1. **Sprint-based Development**
   - Work focuses exclusively on current sprint demands
   - No suggestions outside sprint scope (e.g., tests, optimizations, docs)
   - Await PO approval before proceeding with changes

2. **Change Implementation Process**
   - Present detailed plan with affected files and changes
   - Wait for PO approval before implementation
   - Execute changes step by step
   - Provide clear implementation instructions
   - Report completion for PO verification

3. **Scope Management**
   - Stay focused on specific demand requirements
   - Do not suggest additional improvements outside scope
   - Await explicit PO direction for new tasks

## Project Overview
Rollout Manager is a NestJS-based API for managing corporate notebook deployment workflows. It tracks devices from inventory through technical validation to employee delivery and old device collection.

## Key Architecture Components

### Core Domain Models
- `Notebook`: Central entity tracking device lifecycle states (PENDING_HOMOLOGATION -> HOMOLOGATED -> IN_ROLLOUT -> DELIVERED)
- `Movement`: Records physical movements and status changes of notebooks
- `Place`: Manages physical locations where notebooks can be stored/moved
- `NotebookReplacement`: Links old and new notebooks in replacement process

### Module Structure
- `notebooks/`: Core notebook management logic
- `movements/`: Tracking physical movements and status changes 
- `places/`: Location management
- `export/`: Report generation (Excel exports)
- `exceptions/`: Centralized error handling
- `prisma/`: Database access layer

## Development Patterns

### Data Access
- Uses Prisma ORM with repository pattern
- Services handle business logic and data access through `PrismaService`
- Example service pattern in `notebooks.service.ts`:
```typescript
@Injectable()
export class NotebooksService {
  constructor(
    private prisma: PrismaService,
    private exceptions: AppExceptionsService
  ) {}
}
```

### Error Handling
- Centralized through `AppExceptionsService`
- HTTP exceptions mapped to domain-specific errors
- Always use exception service instead of throwing directly

### Date Handling
- Uses `DateTransformInterceptor` for consistent date formatting
- All dates stored in UTC
- DateTime fields auto-managed by Prisma (`createdAt`, `updatedAt`)

## Common Development Tasks

### Setup
1. Install dependencies: `npm install`
2. Setup database: 
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```
3. Start dev server: `npm run start:dev`

### Database Updates
1. Modify `prisma/schema.prisma`
2. Run `npm run prisma:migrate` for schema changes
3. Run `npm run prisma:generate` to update Prisma Client

## Integration Points
- SQLite for development, PostgreSQL for production
- Environment variables control database connection (see `.env.example`)
- Excel export functionality in `export.service.ts`

## Project Conventions
- DTOs define all input validation (`src/**/dto/`)
- Services contain core business logic
- Controllers remain thin, delegating to services
- Movements must be tracked through `MovementsService`
- Status changes require corresponding movement records
