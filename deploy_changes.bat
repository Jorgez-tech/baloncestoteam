@echo off
echo Iniciando proceso de commit y push...

cd /d "c:\Users\jzuta\proyectos\baloncestoteam"

echo.
echo Verificando estado de git...
git status

echo.
echo Agregando archivos al staging...
git add .

echo.
echo Haciendo commit...
git commit -m "feat: complete admin panel implementation with security

- Add AdminDashboard.jsx with 500+ lines of secure admin functionality
- Implement triple-layer security (auth + role + validation)
- Add comprehensive form validation and error handling
- Include audit logging for all admin actions
- Add confirmation dialogs for destructive actions
- Create 12 automated security tests for admin panel
- Add responsive admin dashboard styling (300+ lines CSS)
- Update documentation with security reports and changelog
- Add environment configuration examples for production
- Implement backend validation middleware with express-validator

Security features:
- Role-based access control
- Input sanitization and validation
- Audit trail logging
- Self-deletion prevention
- Number uniqueness validation
- CRUD operations with security checks

Testing coverage:
- Access control tests
- Form validation tests
- Destructive action confirmation tests
- Audit logging verification
- Functionality and navigation tests

Documentation updates:
- ADMIN_SECURITY_REPORT.md with 10/10 security rating
- CHANGELOG.md with detailed version history
- Environment variables documentation
- Development guide updates"

echo.
echo Haciendo push al repositorio remoto...
git push origin chore/limpieza-rutas-estructura

echo.
echo Proceso completado!
pause
