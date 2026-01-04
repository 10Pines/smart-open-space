# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Smart Open Space** is a full-stack web application for managing Open Space events. It supports multi-day events, multiple tracks, talk submissions, voting, marketplace management (speaker queuing for pitch presentations), and real-time schedule updates.

**Architecture**: Monorepo with separate backend and frontend

- **Backend**: Spring Boot 3.3 + Kotlin 2.1 REST API with JWT authentication, WebSocket support, PostgreSQL database
- **Frontend**: React 16 + Vite 6 SPA with client-side routing, styled-components, WebSocket clients

## Development Setup

### Prerequisites

- **Java 21** (backend) - verify with `java -version`
- **Node.js 24.x** (frontend) - specified in `front/package.json` engines
- **PostgreSQL** (via Docker or local installation)
- **Git** for version control

### Quick Start

**1. Start Database (Docker)**
```bash
docker compose up db -d
# PostgreSQL available at localhost:6543
# Credentials: openminded/openheart
# Database: sos
```

**2. Configure Backend**
```bash
# Create application-default.properties
cat > back/src/main/resources/application-default.properties << EOF
spring.datasource.url=jdbc:postgresql://localhost:6543/sos
spring.datasource.username=openminded
spring.datasource.password=openheart

logging.appender.email.username=""
logging.appender.email.password=""
logging.appender.email.to=""
EOF
```

**3. Start Backend (Terminal 1)**
```bash
cd back
./gradlew bootRun -x downloadNewrelic -x unzipAndSetUpNewrelic
# Backend runs on http://localhost:8080
```

**4. Start Frontend (Terminal 2)**
```bash
cd front
npm install  # First time only
npm run dev
# Frontend runs on http://localhost:1234
```

## Common Commands

### Backend (`/back`)

**Build and Test:**
```bash
cd back

# Build project (skip NewRelic tasks due to network restrictions)
./gradlew build -x downloadNewrelic -x unzipAndSetUpNewrelic

# Run tests (takes ~60 seconds)
./gradlew test

# Run specific tests
./gradlew test --tests "com.sos.smartopenspace.services.*"
./gradlew test --tests "*.UserServiceTest"
./gradlew test --tests "*.UserServiceTest.shouldCreateUser"

# Generate code coverage report
./gradlew jacocoTestReport
# Report: build/reports/jacoco/test/jacocoTestReport.xml
```

**Database Migrations:**
```bash
# Set environment variables first:
# JDBC_DATABASE_URL=jdbc:postgresql://localhost:6543/sos
# JDBC_DATABASE_USERNAME=openminded
# JDBC_DATABASE_PASSWORD=openheart

./gradlew flywayMigrate    # Apply pending migrations
./gradlew flywayInfo       # Show migration status
./gradlew flywayValidate   # Validate applied migrations
```

**Development:**
```bash
./gradlew bootRun -x downloadNewrelic -x unzipAndSetUpNewrelic
./gradlew dependencies     # View dependency tree
./gradlew clean            # Clean build artifacts
```

**See `/back/CLAUDE.md` for detailed backend architecture and patterns.**

### Frontend (`/front`)

**Development:**
```bash
cd front

npm install         # Install dependencies (30-45 seconds)
npm run dev         # Start dev server on port 1234
npm run watch       # Alias for npm run dev
npm run build       # Production build to dist/
npm run preview     # Preview production build

# Testing
npm test            # Run tests with Vitest (~3 seconds)
npm run test:watch  # Run tests in watch mode
```

**Known Limitation:**
- `npm run lint` fails (ESLint config missing) - this is expected, not used in CI

## Repository Structure

```
smart-open-space/
├── back/                     # Spring Boot backend (Java 21 + Kotlin)
│   ├── src/main/kotlin/      # Application source
│   │   └── com/sos/smartopenspace/
│   │       ├── controllers/  # REST endpoints (v1/)
│   │       ├── services/     # Business logic (impl/)
│   │       ├── persistence/  # JPA repositories
│   │       ├── domain/       # JPA entities with domain logic
│   │       ├── dto/          # Request/response DTOs
│   │       ├── translators/  # Entity ↔ DTO conversion
│   │       ├── config/       # Spring configuration
│   │       ├── websockets/   # WebSocket handlers
│   │       └── aspect/       # AOP logging/metrics
│   ├── src/main/resources/
│   │   └── db/migration/     # Flyway SQL migrations (V*.sql, U*.sql)
│   ├── src/test/kotlin/      # Tests (MockK, JUnit 5)
│   ├── build.gradle.kts      # Gradle build configuration
│   └── CLAUDE.md             # Detailed backend documentation
│
├── front/                    # React frontend (Node 24.x)
│   ├── src/
│   │   ├── App/              # Main application components
│   │   │   ├── OpenSpace/    # Open Space management screens
│   │   │   ├── EditOpenSpace/ # OS editing interface
│   │   │   ├── Talk/         # Talk detail views
│   │   │   ├── TalkForm/     # Talk creation/editing forms
│   │   │   ├── MyTalks/      # Speaker's talk management
│   │   │   ├── Login/        # Authentication screens
│   │   │   ├── Register/     # User registration
│   │   │   ├── OSProjector/  # Marketplace projector view
│   │   │   └── components/   # Shared components
│   │   ├── helpers/          # Utility functions
│   │   │   ├── api/          # API client (api-client.js, os-client.js, user-client.js)
│   │   │   ├── routes.jsx    # Route helpers and navigation
│   │   │   ├── useAuth.jsx   # Authentication hook
│   │   │   └── time.js       # Date/time utilities
│   │   ├── shared/           # Shared UI components
│   │   ├── assets/           # Static assets
│   │   └── statics/          # Constants (apiConstants.js, messages.js)
│   ├── package.json          # Dependencies and scripts
│   ├── vite.config.js        # Vite bundler configuration
│   └── tsconfig.json         # TypeScript configuration
│
├── docs/                     # Documentation
│   ├── adrs/                 # Architecture Decision Records
│   ├── container/            # Docker/observability setup
│   ├── metrics/              # Metrics documentation
│   ├── performance_test/     # Load testing
│   └── kamal/                # Kamal deployment
│
├── docker-compose.yml        # Full stack + observability (Prometheus, Grafana, etc.)
├── .github/workflows/        # CI/CD pipelines
│   ├── ci-backend.yml        # Backend tests + SonarQube
│   ├── ci-frontend.yml       # Frontend tests (Node 18.x, 22.x, 24.x)
│   └── cd-app.yml            # Deployment workflow
└── README.md                 # General project information
```

## Architecture Overview

### Backend Architecture

**Layered Architecture:**
```
Controllers → Services → Repositories → Database
     ↓
   DTOs ← Translators ← Domain Entities
```

**Key Patterns:**
- **Domain-Driven Design**: Rich domain entities with embedded business logic (not anemic models)
- **Stateful JWT**: JWT tokens validated against `AuthSession` database table for revocation/multi-device support
- **WebSocket Broadcasting**: Real-time updates via `/scheduleSocket` and `/queueSocket` with SockJS fallback
- **AOP Cross-Cutting**: `@LoggingExecution`, `@LoggingInputExecution`, rate limiting (1500 req/30s)
- **Flyway Migrations**: Versioned + undo migrations for PostgreSQL (prod) and H2 (test)

**Core Domain Entities:**
- `OpenSpace` - Event with tracks, days, rooms, slots
- `Talk` - Submitted presentations with voting
- `User` - Organizers and speakers with JWT auth
- `AuthSession` - Persisted JWT sessions for revocation
- `Room`, `Slot`, `Track` - Scheduling components

### Frontend Architecture

**Component-Based SPA:**
```
App (Main Router)
  ├── MainLayout (Header + Footer)
  ├── OpenSpace Views (Home, Schedule, Marketplace)
  ├── Talk Management (MyTalks, TalkForm)
  ├── Authentication (Login, Register, Recovery)
  └── Projector (Marketplace Presentation Mode)
```

**Key Patterns:**
- **Client-Side Routing**: React Router v5 with custom hooks (`usePushToOpenSpace`, etc.)
- **API Client Layer**: Centralized fetch wrapper with JWT token injection
- **Session Management**: Dual storage (localStorage for JWT, sessionStorage for session ID)
- **WebSocket Integration**: SockJS clients for real-time schedule/queue updates
- **Path Aliases**: Vite configured with `#helpers`, `#api`, `#components`, `#shared` shortcuts
- **Styling**: Styled-components + Grommet design system

**API Communication:**
- Base client: `helpers/api/api-client.js` - handles auth headers, error toasts, 401 redirects
- Domain clients: `os-client.js` (Open Space), `user-client.js` (authentication)
- Environment: API URL via `import.meta.env.VITE_API_URL` (Vite env variable)

## Critical Workflows

### Adding a Backend Feature

1. **Define DTOs** in `dto/request/` and `dto/response/`
2. **Implement service** interface + impl in `services/` and `services/impl/`
3. **Create controller** endpoint in `controllers/v1/`
4. **Add translator** methods in `translators/` if new entities involved
5. **Write tests** for service and controller layers
6. If schema changes needed: create `V*__description.sql` + `U*__description.sql` migrations

### Adding a Frontend Feature

1. **Create component** in appropriate `App/` subdirectory
2. **Add route** in `App.jsx` and helpers in `helpers/routes.jsx`
3. **Implement API client** methods in `helpers/api/*-client.js`
4. **Handle state** with React hooks (useState, useEffect, custom hooks)
5. **Add navigation** using route helpers (`usePushTo*` hooks)
6. **Style** with styled-components or Grommet components
7. **Write tests** in `__tests__/` using Vitest + React Testing Library

### Database Migrations

**Always create paired migrations:**
```bash
# Create new migration files
back/src/main/resources/db/migration/
  ├── V1_XX__add_feature.sql      # Forward migration
  └── U1_XX__add_feature.sql      # Undo migration (for H2 tests)
```

**Test locally:**
```bash
export JDBC_DATABASE_URL=jdbc:postgresql://localhost:6543/sos
export JDBC_DATABASE_USERNAME=openminded
export JDBC_DATABASE_PASSWORD=openheart
cd back && ./gradlew flywayMigrate
./gradlew test  # Verify H2 migrations work
```

## Known Issues and Workarounds

### NewRelic Download Failures
**Always exclude NewRelic tasks** - network restrictions prevent download:
```bash
./gradlew build -x downloadNewrelic -x unzipAndSetUpNewrelic
./gradlew bootRun -x downloadNewrelic -x unzipAndSetUpNewrelic
```

### Frontend ESLint Configuration Missing
`npm run lint` fails (no ESLint config file). This is expected - not used in CI pipeline.

### Node Version Flexibility
`package.json` specifies Node 24.x, but app works with 18.x, 20.x, 22.x. CI tests against 18.x, 22.x, 24.x.

### Docker Compose Issues
Full Docker setup (`docker-compose up`) has backend Dockerfile issues. For development:
- Use `docker compose up db -d` (database only)
- Run backend/frontend locally

## Testing and Validation

### Verify Application Health

**Backend:**
```bash
curl http://localhost:8080/actuator/health
# Expected: {"status":"UP"} with database component

curl http://localhost:8080/ping
# Expected: "pong"
```

**Frontend:**
```bash
curl -I http://localhost:1234
# Expected: HTTP/1.1 200 OK

curl -s http://localhost:1234 | grep -o '<title>[^<]*</title>'
# Expected: <title>Smart Open Space</title>
```

### Run Test Suites

```bash
# Backend tests (~60 seconds)
cd back && ./gradlew test

# Frontend tests (~3 seconds)
cd front && npm test
```

## Tech Stack Summary

**Backend:**
- Java 21 (OpenJDK 21.0.2)
- Kotlin 2.1.20
- Spring Boot 3.3.13
- Gradle 8.x (Kotlin DSL)
- PostgreSQL (prod), H2 (test)
- Flyway 11.0.0
- JWT (jjwt 0.12.6)
- Spring Security 6
- WebSockets + SockJS
- Micrometer + Prometheus
- New Relic APM (optional)
- JUnit 5 + MockK

**Frontend:**
- Node.js 24.x
- React 16.13.1
- React Router v5
- Vite 6.4.1
- TypeScript 3.8.3
- Vitest 3.2.4
- Grommet 2.39.0 (design system)
- styled-components 5.0.1
- SockJS client 1.4.0
- date-fns 2.28.0
- JWT decode 4.0.0

**Infrastructure:**
- Docker + Docker Compose
- PostgreSQL 17 (alpine)
- Prometheus + Grafana (monitoring)
- Loki + Promtail (logging)
- Kamal (deployment automation)

## Additional Resources

- **Backend Details**: See `/back/CLAUDE.md` for layered architecture, authentication flow, WebSocket patterns, and testing guidelines
- **Documentation**: See `/docs/README.md` for ADRs, metrics, performance tests, and deployment guides
- **Contributing**: See `/CONTRIBUTING.md` for contribution guidelines
- **Docker Setup**: See `/docs/container/README.md` for observability stack
- **Deployment**: See `/docs/kamal/README.md` for deployment automation
