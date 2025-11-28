const { Then } = require('@cucumber/cucumber');
const { expect } = require('chai');
const fs = require('fs');
const path = require('path');

Then('la pagina muestra el encabezado {string}', async function (expected) {
  const heading = this.page.locator('h1');
  await heading.waitFor();
  const text = await heading.innerText();
  expect(text).to.equal(expected);
});

Then('guardo una captura llamada {string}', async function (name) {
  const outputDir = path.join(process.cwd(), 'cucumber-report', 'screenshots');
  await fs.promises.mkdir(outputDir, { recursive: true });
  const filePath = path.join(outputDir, `${name}.png`);
  await this.page.screenshot({ path: filePath, fullPage: true });
});
