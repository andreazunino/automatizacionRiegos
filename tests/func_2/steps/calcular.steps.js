const { Given, When, Then } = require('@cucumber/cucumber');

When(/^selecciono las estaciones (.+)$/, async function (estacionesString) {
    const estaciones = estacionesString.split(',').map(e => e.trim());
    for (const estacion of estaciones) {
        await this.datosPage.seleccionarEstacion(estacion);
    }
});

Then('se muestran las pestañas de resultados', async function () {
  await this.datosPage.esperarResultadosCalculo();
});