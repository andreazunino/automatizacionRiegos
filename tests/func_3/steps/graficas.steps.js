const { Given, When, Then } = require('@cucumber/cucumber');

When('hago click en Calcular', async function () {
  await this.datosPage.clickBoton('#calcular');
});

When('espero la grafica de {string}', async function (tipo) {
    await this.datosPage.esperarGrafica(tipo);
});

Then('se muestra la grafica {string}', async function (tipo) {
  const cont = this.page.locator('#graficaContainer');

  // Asegura que el contenedor tiene algo dibujado
  await expect(
    cont.locator('.highcharts-container, svg, canvas, .grafica')
  ).toBeVisible({ timeout: 10000 });
});