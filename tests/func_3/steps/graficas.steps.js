const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

When('hago click en Calcular', async function () {
  await this.datosPage.clickBoton('#calcular');
});

When('espero la grafica de {string}', async function (tipo) {
    await this.datosPage.esperarGrafica(tipo);
});

When('espero la tabla de {string}', async function (tipo) {
  await this.datosPage.esperarTabla(tipo);
});

When('hago click en la pestaña de temperatura de la grafica', async function () {
  await this.datosPage.seleccionarTabTemperaturaGrafica();
});

Then('se muestra la grafica {string}', async function (tipo) {
  await expect(
    this.page.locator('#graficaContainer .grafica-contenedor figure')
  ).toBeVisible();
});

Then('se visualiza la grafica de {string}', async function (tipo) {
  await this.datosPage.esperarGrafica(tipo);
  const selector = this.datosPage.graficaSelectorPorTipo(tipo);
  await expect(this.page.locator(selector)).toBeVisible();
  const titulo = this.page.locator(`${selector} .highcharts-title`);
  await expect(titulo).toHaveText(new RegExp(tipo, 'i'));
});

Then(
  'la grafica de temperatura muestra los datos consultados para {string}',
  async function (estacion) {
    await this.datosPage.validarGraficaTemperatura(estacion);
  }
);

Then(
  'la tabla de temperatura muestra los datos consultados para {string}',
  async function (estacion) {
    await this.datosPage.validarTablaTemperatura(estacion);
  }
);

When('descargo la grafica de temperatura en formato {string}', async function (formato) {
  this.lastDownload = await this.datosPage.descargarGraficaTemperatura(formato);
});

Then('la descarga de la grafica de temperatura en {string} es correcta', async function (formato) {
  expect(this.lastDownload).toBeTruthy();
  expect(this.lastDownload.formato).toBe(formato.toLowerCase());
  await this.datosPage.validarArchivoDescargado(this.lastDownload);
});
