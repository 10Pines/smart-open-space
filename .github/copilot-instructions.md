# Smart Open Space

Smart Open Space is a web application for managing Open Space events with backend (Spring Boot/Kotlin) and frontend (React/Vite) components. The application supports multiple tracks, voting, marketplace management, and multi-day events.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Prerequisites
Set up Java 21 (REQUIRED):
```bash
export JAVA_HOME=/usr/lib/jvm/temurin-21-jdk-amd64
export PATH=$JAVA_HOME/bin:$PATH
java -version  # Should show Java 21
```

Bootstrap, build, and test the repository:
```bash
# Start database (required for backend)
docker compose up db -d

# Create backend configuration file (REQUIRED before running backend)
cat > back/src/main/resources/application-default.properties << EOF
spring.datasource.url=jdbc:postgresql://localhost:6543/sos
spring.datasource.username=openminded
spring.datasource.password=openheart

logging.appender.email.username=""
logging.appender.email.password=""
logging.appender.email.to=""
EOF
```

Backend commands:
```bash
cd back
# Build backend -- takes 2+ minutes first time, under 1 second when cached. NEVER CANCEL. Set timeout to 3+ minutes.
./gradlew build -x downloadNewrelic -x unzipAndSetUpNewrelic

# Test backend -- takes 60 seconds. NEVER CANCEL. Set timeout to 2+ minutes.
./gradlew test

# Run backend (starts on port 8080)
./gradlew bootRun -x downloadNewrelic -x unzipAndSetUpNewrelic
```

Frontend commands:
```bash
cd front
# Install dependencies -- takes 30-45 seconds. NEVER CANCEL. Set timeout to 2+ minutes.
npm install

# Test frontend -- takes 3-5 seconds. NEVER CANCEL. Set timeout to 1+ minute.
npm test

# Build frontend -- takes 10-15 seconds. NEVER CANCEL. Set timeout to 1+ minute.
npm run build

# Run frontend dev server (starts on port 1234)
npm run dev
```

## Validation

Always manually validate the application is working after making changes:

```bash
# Test backend health
curl http://localhost:8080/actuator/health
# Expected: {"status":"UP"} with database and ping components

# Test backend API
curl http://localhost:8080/ping
# Expected: "pong"

# Test frontend accessibility
curl -I http://localhost:1234
# Expected: HTTP/1.1 200 OK

# Test frontend title
curl -s http://localhost:1234 | grep -o '<title>[^<]*</title>'
# Expected: <title>Smart Open Space</title>
```

Run validation commands in sequence to ensure full application stack is functional.

## Known Issues and Workarounds

### NewRelic Download Fails
Always exclude NewRelic tasks from Gradle builds:
```bash
./gradlew build -x downloadNewrelic -x unzipAndSetUpNewrelic
./gradlew bootRun -x downloadNewrelic -x unzipAndSetUpNewrelic
```
This is due to network restrictions. The application works without NewRelic.

### ESLint Configuration Missing
`npm run lint` fails because ESLint configuration file is missing. 
**DO NOT** try to fix this unless specifically asked - it's a known limitation.
The CI workflow (`.github/workflows/ci-frontend.yml`) does not run linting.

### Node.js Version Mismatch
Package.json requires Node 24.x but the application works with Node 18.x , Node 20.x and Node 22.x as well. 
Always use Node 24.x!
You may see warnings during `npm install` - these are safe to ignore.

### Docker Build Issues
The Docker setup in `docker-compose.yml` has issues with the backend Dockerfile.
For development, use local setup (database via Docker + local backend/frontend).

## Common Tasks

### Start Development Environment
```bash
# 1. Start database
docker compose up db -d

# 2. Create backend config (if not exists)
cat > back/src/main/resources/application-default.properties << EOF
spring.datasource.url=jdbc:postgresql://localhost:6543/sos
spring.datasource.username=openminded
spring.datasource.password=openheart
logging.appender.email.username=""
logging.appender.email.password=""
logging.appender.email.to=""
EOF

# 3. Start backend (in terminal 1)
cd back && ./gradlew bootRun -x downloadNewrelic -x unzipAndSetUpNewrelic

# 4. Start frontend (in terminal 2)  
cd front && npm run dev
```

### Run Tests
```bash
# Backend tests (60 seconds)
cd back && ./gradlew test

# Frontend tests (3 seconds)
cd front && npm test
```

### Build for Production
```bash
# Backend
cd back && ./gradlew build -x downloadNewrelic -x unzipAndSetUpNewrelic

# Frontend
cd front && npm run build
```

## Key Repository Locations

### Backend (`/back`)
- Main application: `src/main/kotlin/com/sos/smartopenspace/`
- Tests: `src/test/kotlin/`
- Configuration: `src/main/resources/`
- Build file: `build.gradle.kts`
- Database migrations: `src/main/resources/db/migration/`

### Frontend (`/front`)
- Source code: `src/`
- Tests: `src/__tests__/`
- Build configuration: `vite.config.js`
- Package config: `package.json`

### Docker & Infrastructure
- Main Docker setup: `docker-compose.yml`
- Container docs: `docs/container/`
- Performance tests: `docs/performance_test/`

### CI/CD
- Backend CI: `.github/workflows/ci-backend.yml`
- Frontend CI: `.github/workflows/ci-frontend.yml`
- Deployment: `.github/workflows/cd-app.yml`

## Timing Expectations

All timing measurements include 50% buffer for safety:

- **Backend first build**: 3+ minutes (downloads dependencies)
- **Backend cached build**: Under 1 minute  
- **Backend tests**: 2+ minutes (60 seconds actual)
- **Backend startup**: 30 seconds (8 seconds actual)
- **Frontend npm install**: 2+ minutes (30-45 seconds actual)
- **Frontend tests**: 1+ minute (3 seconds actual)
- **Frontend build**: 1+ minute (10 seconds actual)
- **Frontend dev startup**: 10 seconds (instant actual)

**CRITICAL**: NEVER CANCEL long-running builds or tests. Set appropriate timeouts and wait for completion.

## Technologies

- **Backend**: Java 21, Kotlin, Spring Boot 3.2.7, Gradle 8.8, PostgreSQL, Flyway
- **Frontend**: Node.js 24.x/20.x, React 16, Vite 6, TypeScript/JavaScript, Vitest
- **Database**: PostgreSQL 15
- **Deployment**: Docker, Kamal, Heroku
- **Monitoring**: Prometheus, Grafana (container setup)
