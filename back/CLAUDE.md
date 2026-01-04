# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Smart Open Space backend - A Spring Boot 3.3 + Kotlin 2.1 application for managing open space events, talks, scheduling, and user authentication. Uses PostgreSQL, WebSockets for real-time updates, JWT authentication, and includes observability with New Relic and Prometheus.

## Development Commands

### Build and Run
```bash
./gradlew build              # Build project (runs tests, creates JAR, sets up New Relic)
./gradlew bootRun            # Run application locally
./gradlew clean              # Clean build artifacts and newrelic directory
```

### Testing
```bash
./gradlew test               # Run all tests
./gradlew test --tests "com.sos.smartopenspace.services.*"  # Run specific test package
./gradlew test --tests "*.UserServiceTest"                   # Run specific test class
./gradlew test --tests "*.UserServiceTest.shouldCreateUser"  # Run single test method
./gradlew jacocoTestReport   # Generate code coverage report (build/reports/jacoco/test/jacocoTestReport.xml)
```

### Database Migrations
```bash
# Requires environment variables: JDBC_DATABASE_URL, JDBC_DATABASE_USERNAME, JDBC_DATABASE_PASSWORD
./gradlew flywayMigrate      # Apply pending migrations
./gradlew flywayInfo         # Show migration status
./gradlew flywayValidate     # Validate applied migrations
```

### Code Quality
```bash
./gradlew sonar              # Run SonarQube analysis (requires SONAR_TOKEN env var)
```

### Dependency Management
```bash
./gradlew dependencies       # Show dependency tree
./gradlew dependencyUpdates  # Check for outdated dependencies (if plugin available)
```

## Architecture

### Layered Architecture Pattern
```
Controllers (REST/WebSocket) → Services (Business Logic) → Repositories (Data Access) → Database
                ↓
              DTOs ← Translators ← Domain Entities
```

### Package Structure
- **`domain/`** - JPA entities with rich domain logic (not anemic models)
  - Core entities: `OpenSpace`, `User`, `Talk`, `AuthSession`, `Room`, `Slot`, `Track`
  - Domain exceptions and value objects
  - Business rules embedded in entity methods (e.g., `OpenSpace.scheduleTalk()`, `OpenSpace.enqueueTalk()`)

- **`persistence/`** - Spring Data JPA repositories
  - Custom query methods for complex lookups
  - Example: `AuthSessionRepository.findByTokenIdAndIsRevokedFalseAndExpiresAtAfter()`

- **`services/`** - Business logic layer
  - Service interfaces (e.g., `AuthServiceI`) and implementations in `services/impl/`
  - `JwtService` handles token generation/validation
  - `OpenSpaceService` orchestrates complex operations

- **`controllers/`** - REST API endpoints
  - Base controllers and versioned API in `v1/`
  - All use `@RateLimiter` (1500 requests/30s) and custom logging aspects
  - Exception handling centralized in `ExceptionHandler.kt`

- **`dto/`** - Data transfer objects
  - `request/` - Input DTOs with Bean Validation annotations
  - `response/` - Output DTOs
  - Separated by feature (auth, purge, etc.)

- **`translators/`** - Manual entity-to-DTO conversion
  - Pattern: `EntityTranslator.toResponseDTO(entity)`, `EntityTranslator.toEntity(requestDTO)`

- **`config/`** - Spring configuration
  - `SecurityConfig` - JWT filter, CSRF disabled, stateless sessions
  - `WebSocketConfig` - `/scheduleSocket` and `/queueSocket` endpoints
  - `filter/JwtAuthFilter` - Custom authentication filter with AuthSession validation

- **`websockets/`** - WebSocket handlers extending `AbstractSocket<T>`
  - Session tracking per OpenSpace ID
  - Broadcast pattern for real-time updates

- **`aspect/`** - AOP cross-cutting concerns
  - `@LoggingExecution` / `@LoggingInputExecution` - method logging
  - Metrics collection via Micrometer aspects

### Authentication Architecture

**Stateful JWT Implementation** - Unlike typical stateless JWT, this app persists sessions in `AuthSession` entity:
- JWT tokens are validated against database for revocation/expiration
- Supports multi-device sessions and "logout all devices" functionality
- `JwtAuthFilter` extracts token → validates JWT signature → checks `AuthSession` → creates Spring Security `Authentication`
- Public endpoints bypass filter via `PublicEndpointsConfig`

**Password Handling**:
- BCrypt encoding via `PasswordEncoderService`
- SHA256 hashing for User entity password field
- Reset tokens with 10-minute expiration (`user.reset.token.lifetime`)

### WebSocket Real-Time Updates

Two socket endpoints with SockJS fallback:
- `/scheduleSocket` - Broadcasts schedule changes when talks are assigned/moved
- `/queueSocket` - Broadcasts queue state updates (pending/active/finished talk lists)

Pattern: Services call `socket.sendFor(openSpace)` to notify all connected clients after state changes.

### Database Schema Management

**Flyway Migrations** in `src/main/resources/db/migration/`:
- Versioned migrations: `V1_*__description.sql`
- Undo migrations: `U1_*__description.sql` (for H2 testing)
- Both PostgreSQL (prod) and H2 (test) support
- JPA set to `ddl-auto=validate` - schema changes MUST go through Flyway

**Important**: Always create matching V and U migration pairs when modifying schema.

### Environment Configuration

**Profiles**:
- `dev` (default) - Local development with H2 database
- `test` - Test profile for Spring Boot tests
- `docker` - Docker container deployment
- `kamal` - Kamal deployment
- `prod` - Production Heroku deployment

**Required Environment Variables** (see `config/.env.sample`):
```
JWT_SECRET                  # Secret key for JWT signing
JWT_EXPIRATION_IN_MINUTES   # Token expiration (default: 21600 = 15 days)
JDBC_DATABASE_URL           # PostgreSQL connection URL
MAILGUN_SMTP_SERVER         # Mailgun SMTP host
MAILGUN_SMTP_PORT
MAILGUN_SMTP_LOGIN
MAILGUN_SMTP_PASSWORD
PURGE_PASSWORD              # Password for auth purge endpoint
```

**Observability Configuration**:
- New Relic: Auto-instrumentation via Java agent (downloaded in `unzipAndSetUpNewrelic` task)
- Prometheus: Metrics exposed at `/actuator/prometheus`
- Health checks: `/actuator/health` (shows detailed status)

## Key Implementation Patterns

### Domain-Driven Design
Domain entities contain business logic, not just data. Examples:
- `OpenSpace.assignableSlots()` - filters slots available for scheduling
- `OpenSpace.canScheduleMoreTalks()` - validates business rule
- `User.cannotBeEdited(currentUser)` - enforces ownership rules

Custom exceptions (`DomainException`, `AuthException`, `NotFoundException`) defined in `domain/Exceptions.kt`.

### Service Layer Responsibilities
- Transaction management (`@Transactional`)
- Orchestration of multiple repository calls
- Business logic that spans multiple entities
- External service integration (email, JWT)

### DTO Translation Pattern
Never expose entities directly via REST API. Always use translators:
```kotlin
// Controller receives RequestDTO → Service translates to Entity → Repository saves
// Repository returns Entity → Service translates to ResponseDTO → Controller returns
```

### AOP Logging and Metrics
Apply custom annotations to controllers/services:
- `@LoggingExecution` - logs method name, execution time
- `@LoggingInputExecution` - includes method parameters
- `@UserMetricAnnotation` - records user operation metrics

Aspects automatically intercept and handle cross-cutting concerns.

## Testing Guidelines

### Test Structure
- Unit tests: `src/test/kotlin/com/sos/smartopenspace/`
- Mirror main package structure
- Use MockK for Kotlin-friendly mocking

### Test Database
- H2 in-memory database for tests (configured in `application-test.properties`)
- Flyway migrations applied automatically (`baseline-on-migrate=true`)
- Use `@ActiveProfiles("test")` and `@SpringBootTest` for integration tests

### Test Data Factory
`TestingObjectFactory.kt` provides helper methods for creating test entities.

## Common Development Workflows

### Adding a New Endpoint
1. Create request/response DTOs in `dto/request` and `dto/response`
2. Add service method in appropriate service interface and implementation
3. Create controller method with validation annotations
4. Add translator methods if introducing new entities
5. Write controller and service tests

### Adding a Database Migration
1. Create versioned migration: `src/main/resources/db/migration/V1_XX__description.sql`
2. Create undo migration: `src/main/resources/db/migration/U1_XX__description.sql`
3. Test locally with `./gradlew flywayMigrate`
4. Verify JPA entity annotations match new schema
5. Run `./gradlew test` to ensure H2 migrations work

### Modifying Authentication
- JWT configuration in `application.properties` (`jwt.*`)
- Token validation logic in `JwtService`
- Filter logic in `config/filter/JwtAuthFilter`
- Session persistence in `AuthSession` entity and `AuthSessionRepository`
- Public endpoint configuration in `PublicEndpointsConfig`

### Adding WebSocket Events
1. Identify which socket handles the event (`ScheduleSocket` or `QueueSocket`)
2. Update socket's generic type parameter if response DTO changes
3. Call `socket.sendFor(openSpace)` in service after state mutation
4. Ensure all connected sessions receive broadcast via `AbstractSocket.sendToAllClientsWatching()`

## Tech Stack Reference

- **Spring Boot**: 3.3.13 with Kotlin plugin support
- **Kotlin**: 2.1.20
- **Java**: 21 (openjdk-21.0.2, see `.tool-versions`)
- **Build**: Gradle 8.x with Kotlin DSL
- **Database**: PostgreSQL (prod), H2 (test)
- **Migrations**: Flyway 11.0.0
- **Authentication**: JWT (jjwt 0.12.6), Spring Security 6
- **WebSockets**: Spring WebSocket + SockJS
- **Caching**: Caffeine (10 entries, 150s TTL)
- **Rate Limiting**: Resilience4j (3000 rpm)
- **Email**: Mailgun via Spring Mail
- **Observability**: Micrometer, Prometheus, New Relic APM
- **Testing**: JUnit 5, MockK, Spring Boot Test
- **Code Coverage**: JaCoCo
