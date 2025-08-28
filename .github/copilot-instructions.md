# Basketball Team - GitHub Copilot Instructions

**ALWAYS follow these instructions first and fallback to additional search and context gathering only if the information in the instructions is incomplete or found to be in error.**

Basketball Team is a full-stack web application for basketball team management with three main components:
- **Landing Page**: Static HTML/CSS/JS site (index.html + assets/)
- **Frontend**: React application for team management (frontend/)
- **Backend**: Node.js/Express API with MongoDB (backend/)

## Working Effectively

### Bootstrap and Build Process
Execute these commands in order to set up the development environment:

```bash
# Install backend dependencies
cd backend
npm install                    # Takes ~30 seconds. NEVER CANCEL.
cp .env.example .env          # Configure environment variables

# Install frontend dependencies  
cd ../frontend
npm install                    # Takes ~32 seconds. NEVER CANCEL.
```

**CRITICAL**: The npm install commands take 30-32 seconds each. Set timeout to 60+ minutes and NEVER CANCEL these operations.

### Environment Configuration
Always configure environment variables before running the application:

#### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/basketball_team
JWT_SECRET=tuSecretoMuySeguro_cambiame_en_produccion
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api/v1
```

### Building and Testing

#### Backend Commands
```bash
cd backend
npm run lint                   # ESLint check - ~1 second
npm run format                 # Prettier format - ~1 second  
npm run dev                    # Start development server
npm start                      # Start production server
npm test                       # FAILS: MongoDB binary download blocked
```

**IMPORTANT**: Backend tests fail due to network restrictions preventing MongoDB Memory Server downloads. This is expected in the current environment.

#### Frontend Commands
```bash
cd frontend
npm run lint                   # ESLint check - ~1 second
npm start                      # Start development server - ~15 seconds to compile
npm run build                  # Production build - ~8 seconds
npm test                       # React tests - ~13 seconds (has test failures)
```

**CRITICAL BUILD NOTE**: Frontend build fails in CI mode due to ESLint warnings treated as errors. Use `CI=false npm run build` to build successfully.

### Running the Application

#### Development Mode (3 terminals required)
1. **Terminal 1 - Backend**: 
   ```bash
   cd backend && npm run dev
   ```
   **LIMITATION**: Requires MongoDB connection. Without MongoDB, the server will crash after initial startup.

2. **Terminal 2 - Frontend**:
   ```bash
   cd frontend && npm start
   ```
   Compiles in ~15 seconds. Available at http://localhost:3000

3. **Terminal 3 - Landing Page**:
   ```bash
   npx serve . -p 8080
   ```
   Available at http://localhost:8080

#### URLs and Health Checks
- **Landing Page**: http://localhost:8080 ✅ WORKS WITHOUT DEPENDENCIES
- **Frontend React**: http://localhost:3000 ✅ WORKS (UI only, API calls fail without backend)
- **Backend API**: http://localhost:5000 ❌ REQUIRES MONGODB
- **Health Check**: http://localhost:5000/health ✅ WORKS BRIEFLY (crashes without MongoDB)
- **API Docs**: http://localhost:5000/api/v1/docs (when backend is running)

## Validation Scenarios

### ALWAYS test these scenarios after making changes:

1. **Landing Page Functionality**:
   ```bash
   npx serve . -p 8080
   curl -s http://localhost:8080 | head -5
   ```
   Verify HTML loads correctly and navigation works.

2. **Frontend Development Build**:
   ```bash
   cd frontend && npm start
   # Wait for "webpack compiled successfully"
   curl -s http://localhost:3000 | head -5
   ```
   Verify React app compiles and serves correctly.

3. **Frontend Production Build**:
   ```bash
   cd frontend && CI=false npm run build
   ```
   **CRITICAL**: Always use `CI=false` or build will fail on warnings.

4. **Backend Health Check** (without MongoDB):
   ```bash
   cd backend && npm start &
   sleep 5 && curl -s http://localhost:5000/health
   kill %1
   ```
   Verify basic server functionality.

## Database Limitations

**CRITICAL**: MongoDB is NOT available in this environment due to network restrictions:
- MongoDB Memory Server downloads fail (blocked network access)
- Local MongoDB installation fails (package not available)
- Backend tests fail (cannot download MongoDB binaries)
- Backend API crashes without database connection

**Workaround**: For development and testing:
1. Backend starts briefly for health checks
2. Frontend works in isolation for UI development
3. Landing page works completely standalone
4. Use external MongoDB service or skip database-dependent testing

## CI/CD Validation

Test the GitHub Actions workflow commands locally:

```bash
# Backend CI commands
npm ci --prefix backend         # ~11 seconds. NEVER CANCEL.
npm run lint --prefix backend   # ~1 second
# npm test --prefix backend    # SKIP: Fails due to MongoDB limitations

# Frontend CI commands  
npm ci --prefix frontend        # ~11 seconds. NEVER CANCEL.
npm run lint --prefix frontend  # ~1 second
npm test --prefix frontend      # ~13 seconds (has failing tests)
```

**TIMEOUT SETTINGS**: All npm ci commands need 60+ minute timeouts. NEVER CANCEL dependency installations.

## Code Quality and Standards

### Linting and Formatting
Always run before committing:
```bash
# Backend
cd backend && npm run lint && npm run format

# Frontend  
cd frontend && npm run lint
```

### Test Status
- **Backend**: Tests fail due to MongoDB limitations ❌
- **Frontend**: Tests have Router conflicts but run quickly (13s) ❌
- **Landing Page**: No automated tests, manual validation required ✅

**NOTE**: Test failures are environmental, not code quality issues.

## Key File Locations

### Configuration Files
- `backend/.env` - Backend environment variables
- `frontend/.env` - Frontend environment variables
- `backend/package.json` - Backend dependencies and scripts
- `frontend/package.json` - Frontend dependencies and scripts
- `.github/workflows/ci.yml` - CI/CD pipeline
- `.prettierrc` - Code formatting rules
- `backend/.eslintrc.json` - Backend linting rules

### Important Directories
- `backend/models/` - MongoDB data models
- `backend/routers/` - API endpoints
- `backend/middleware/` - Authentication middleware
- `frontend/src/components/` - React components
- `frontend/src/__tests__/` - Frontend tests
- `assets/` - Landing page static assets

### Entry Points
- `backend/server.js` - Backend main server
- `frontend/src/index.js` - React app entry point
- `index.html` - Landing page entry point

## Common Tasks

### After making changes:
1. **ALWAYS** run linting: `npm run lint`
2. **ALWAYS** test the working components (landing page, frontend UI)
3. **ALWAYS** run `CI=false npm run build` for frontend builds
4. **NEVER** expect database-dependent tests to pass

### When debugging:
- Landing page: Check browser console and network requests
- Frontend: Use React DevTools and check compilation messages
- Backend: Check logs for MongoDB connection errors (expected)

### Before committing:
```bash
# Root directory
npm run lint --prefix backend && npm run lint --prefix frontend
CI=false npm run build --prefix frontend
```

## Timing Expectations

**NEVER CANCEL** these operations - set appropriate timeouts:

- npm install: 30-35 seconds each (backend/frontend)
- npm ci: 11-12 seconds each (CI mode)
- Frontend compilation: 15 seconds for development, 8 seconds for build
- Backend startup: Immediate (but crashes without MongoDB)
- Tests: 13 seconds (frontend), fails immediately (backend)

**RECOMMENDATION**: Always use 60+ minute timeouts for any npm install/ci operations to prevent premature cancellation.