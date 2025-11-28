const fs = require('fs');
const path = require('path');
const reporter = require('cucumber-html-reporter');

const jsonReport = path.join(__dirname, 'report.json');
const htmlReport = path.join(__dirname, 'index.html');

if (!fs.existsSync(jsonReport)) {
  console.error('No se encontró el archivo JSON de reporte. Ejecuta el comando con el formato json configurado.');
  process.exit(1);
}

reporter.generate({
  theme: 'bootstrap',
  jsonFile: jsonReport,
  output: htmlReport,
  reportSuiteAsScenarios: true,
  launchReport: false,
  screenshotsDirectory: path.join(__dirname, 'screenshots'),
  storeScreenshots: true,
  metadata: {
    Plataforma: process.platform,
    Navegador: 'Chromium (Playwright)',
    Ejecutado: new Date().toISOString(),
  },
});

console.log(`Reporte generado en ${htmlReport}`);
