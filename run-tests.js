// script para iniciar tests en modo watch con informes de cobertura
const { execSync } = require('child_process');
const path = require('path');

// Carpeta raíz donde ejecutar los tests (frontend o backend)
const targetFolder = process.argv[2] || 'frontend';

// Validar que la carpeta es correcta
if (!['frontend', 'backend'].includes(targetFolder)) {
    console.error('Especificar "frontend" o "backend" como argumento');
    process.exit(1);
}

try {
    console.log(`Ejecutando tests en ${targetFolder}...`);

    // Comando para ejecutar los tests con cobertura en modo watch
    const command = targetFolder === 'frontend'
        ? 'npm test -- --coverage --watchAll'
        : 'npm run test:watch';

    // Cambiamos al directorio correspondiente y ejecutamos
    process.chdir(path.join(__dirname, targetFolder));
    execSync(command, { stdio: 'inherit' });
} catch (error) {
    console.error(`Error al ejecutar los tests: ${error.message}`);
    process.exit(1);
}
