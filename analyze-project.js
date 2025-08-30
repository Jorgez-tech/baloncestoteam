#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 GENERANDO INFORME DE ESTADO DEL PROYECTO...\n');

const report = {
    timestamp: new Date().toISOString(),
    project: 'baloncestoteam',
    branch: 'backup/antes-recuperacion',
    analysis: {}
};

// 1. Verificar estructura de archivos
console.log('📁 Analizando estructura de archivos...');
const checkFile = (filePath) => {
    try {
        const stats = fs.statSync(filePath);
        return {
            exists: true,
            size: stats.size,
            lastModified: stats.mtime
        };
    } catch (error) {
        return {
            exists: false,
            error: error.message
        };
    }
};

report.analysis.files = {
    backend: {
        'package.json': checkFile('./backend/package.json'),
        'jest.config.js': checkFile('./backend/jest.config.js'),
        'jest.setup.js': checkFile('./backend/jest.setup.js'),
        '__test__/players.test.js': checkFile('./backend/__test__/players.test.js'),
        'middleware/validation.js': checkFile('./backend/middleware/validation.js'),
        '.eslintrc.js': checkFile('./backend/.eslintrc.js')
    },
    frontend: {
        'package.json': checkFile('./frontend/package.json'),
        '.eslintrc.js': checkFile('./frontend/.eslintrc.js'),
        'src/pages/AdminDashboard.jsx': checkFile('./frontend/src/pages/AdminDashboard.jsx')
    }
};

// 2. Verificar dependencias
console.log('📦 Verificando dependencias...');
try {
    const backendPkg = JSON.parse(fs.readFileSync('./backend/package.json', 'utf8'));
    const frontendPkg = JSON.parse(fs.readFileSync('./frontend/package.json', 'utf8'));

    report.analysis.dependencies = {
        backend: {
            dependencies: Object.keys(backendPkg.dependencies || {}),
            devDependencies: Object.keys(backendPkg.devDependencies || {}),
            scripts: backendPkg.scripts
        },
        frontend: {
            dependencies: Object.keys(frontendPkg.dependencies || {}),
            devDependencies: Object.keys(frontendPkg.devDependencies || {}),
            scripts: frontendPkg.scripts
        }
    };
} catch (error) {
    report.analysis.dependencies = { error: error.message };
}

// 3. Verificar tests
console.log('🧪 Verificando configuración de tests...');
try {
    const jestConfig = fs.readFileSync('./backend/jest.config.js', 'utf8');
    report.analysis.testing = {
        jestConfigExists: true,
        jestConfigContent: jestConfig.substring(0, 200) + '...'
    };
} catch (error) {
    report.analysis.testing = {
        jestConfigExists: false,
        error: error.message
    };
}

// 4. Verificar git status
console.log('📊 Verificando estado de Git...');
try {
    const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
    const gitBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();

    report.analysis.git = {
        currentBranch: gitBranch,
        uncommittedChanges: gitStatus.split('\n').filter(line => line.trim()).length,
        changes: gitStatus.split('\n').filter(line => line.trim()).slice(0, 10) // Primeros 10
    };
} catch (error) {
    report.analysis.git = { error: error.message };
}

// 5. Problemas detectados
console.log('⚠️ Identificando problemas...');
const issues = [];

// Verificar si Jest está configurado correctamente
if (!report.analysis.files.backend['jest.config.js'].exists) {
    issues.push('❌ Jest config faltante en backend');
}

if (!report.analysis.files.backend['__test__/players.test.js'].exists) {
    issues.push('❌ Tests de players faltantes');
}

// Verificar dependencias críticas
const backendDeps = report.analysis.dependencies?.backend?.devDependencies || [];
if (!backendDeps.includes('jest')) {
    issues.push('❌ Jest no está instalado como dependencia');
}

if (!backendDeps.includes('supertest')) {
    issues.push('❌ Supertest no está instalado para tests');
}

report.analysis.issues = issues;
report.analysis.healthScore = Math.max(0, 100 - (issues.length * 10));

// 6. Recomendaciones
const recommendations = [];

if (issues.length > 0) {
    recommendations.push('🔧 Arreglar configuración de Jest');
    recommendations.push('📝 Actualizar dependencias faltantes');
    recommendations.push('🧪 Verificar que tests funcionen localmente');
}

if (report.analysis.git.uncommittedChanges > 0) {
    recommendations.push('💾 Hacer commit de cambios pendientes');
}

report.analysis.recommendations = recommendations;

// Generar archivo de reporte
console.log('\n📄 Generando reporte...');
fs.writeFileSync('PROJECT_HEALTH_REPORT.json', JSON.stringify(report, null, 2));

// Mostrar resumen en consola
console.log('\n' + '='.repeat(60));
console.log('📊 RESUMEN DEL ANÁLISIS');
console.log('='.repeat(60));
console.log(`🏥 Estado de Salud del Proyecto: ${report.analysis.healthScore}/100`);
console.log(`📅 Fecha: ${report.timestamp}`);
console.log(`🌿 Rama: ${report.analysis.git.currentBranch}`);
console.log(`📝 Cambios sin commit: ${report.analysis.git.uncommittedChanges}`);
console.log('\n🚨 PROBLEMAS DETECTADOS:');
report.analysis.issues.forEach(issue => console.log(`  ${issue}`));
console.log('\n💡 RECOMENDACIONES:');
report.analysis.recommendations.forEach(rec => console.log(`  ${rec}`));
console.log('\n📄 Reporte completo guardado en: PROJECT_HEALTH_REPORT.json');
console.log('='.repeat(60));
