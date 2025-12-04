const { Given, When, Then } = require('@cucumber/cucumber');

Then('se muestran las pestañas de resultados', async function () {
  await this.datosPage.esperarResultadosCalculo();
});