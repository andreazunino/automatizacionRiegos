# Playwright + Cucumber (Node.js, Windows, npm)

Guia rapida para instalar el stack desde cero y comenzar a crear tests.

## Requisitos

- Windows
- Node.js LTS (incluye npm)


Verificar instalacion:

```bash
node -v
npm -v
```

## Instalacion desde cero

1) Crear carpeta y proyecto

```bash
mkdir playwright_cucumber
cd playwright_cucumber
npm init -y
```

2) Instalar dependencias

```bash
npm i -D @cucumber/cucumber @playwright/test playwright chai cucumber-html-reporter
npm i dotenv
npx playwright install
```

3) Crear estructura base

```
tests/
  func_1/
    features/
    steps/
  func_2/
    features/
    steps/
  pages/
  support/
```

4) Configurar scripts en `package.json`

```json
"scripts": {
  "test": "cucumber-js --config cucumber.json",
  "test:report": "cucumber-js --config cucumber.json --format json:./cucumber-report/report.json && node ./cucumber-report/generate-report.js",
  "pw:test": "playwright test",
  "pw:test:ui": "playwright test --ui",
  "pw:test:headed": "playwright test --headed",
  "pw:show-report": "playwright show-report"
}
```
Notas:
- `npm test` corre Cucumber con la config del proyecto.
- `npm run test:report` genera el reporte HTML.
- Los `pw:*` son para specs Playwright (.spec.js).


5) Crear `cucumber.json`

```json
{
  "default": {
    "formatOptions": { "snippetInterface": "async-await" },
    "dryRun": false,
    "require": [
      "tests/**/steps/**/*.js",
      "tests/support/**/*.js"
    ],
    "paths": [
      "tests/**/features/**/*.feature"
    ],
    "format": [
      "progress-bar",
      "html:cucumber-report/cucumber-report.html"
    ]
  }
}

Notas:
- `require` carga steps y soporte.
- `paths` indica donde estan los .feature.
- `format` define la salida y el reporte.
- `snippetInterface` fuerza async/await en snippets.
```

6) Crear `.env` (variables locales)

```env
URL=https://desa.example.com
USER=desa-user
PASS=desa-pass
```

## Base tecnica (Cucumber + Playwright)

- `tests/support/world.js` inicializa Playwright y expone `page` y el Page Object en cada escenario.
- `tests/pages/*Page.js` contiene acciones y validaciones de la UI.
- `tests/**/features/*.feature` describe escenarios en Gherkin.
- `tests/**/steps/*.steps.js` implementa los pasos.

## Creacion primer test

1) Feature: `tests/func_1/features/mi-feature.feature`

```gherkin
Feature: Mi feature
  Scenario: Acceso a la pagina
    Given que entro en la pagina de datos meteorologicos
    Then la pagina deberia cargar correctamente
```

2) Steps: `tests/func_1/steps/mi-feature.steps.js`

```js
const { Given, Then } = require('@cucumber/cucumber');

Given('que entro en la pagina de datos meteorologicos', async function () {
  await this.datosPage.navegar();
});

Then('la pagina deberia cargar correctamente', async function () {
  await this.datosPage.cargaCompleta();
});
```

3) Si se necesitan nuevas acciones, se agregan al Page Object en `tests/pages/DatosMeteorologicosPage.js`.


## CI ejecutar tests

- Todos los escenarios Cucumber:

```bash
npm test
```

- Reporte HTML:

```bash
npm run test:report
```

- Ejecutar un feature puntual:

```bash
npx cucumber-js tests/func_1/features/datosm-bloque-busqueda.feature --config cucumber.json
```

- Ejecutar Playwright (specs `.spec.js`):

```bash
npm run pw:test
```

