const { Given, When, Then } = require('@cucumber/cucumber');

// Seleccion de estacion ya existe en steps de func_1 (selecciono la estacion {string})
// Aqui solo manejamos el bloque de periodo/fechas

When('selecciono el periodo {string}', async function (valor) {
  await this.datosPage.seleccionarPeriodo(valor);
});

When('completo el rango horario {string}', async function (rango) {
  await this.datosPage.completarRangoHorarios(rango);
});

Then('el campo dias horarios muestra {string}', async function (dias) {
  await this.datosPage.validarDiasHorarios(dias);
});

When('completo el rango personalizado {string}', async function (rango) {
  await this.datosPage.completarRangoPersonalizado(rango);
});

Then('el campo dias personalizados muestra {string}', async function (dias) {
  await this.datosPage.validarDiasPersonalizados(dias);
});

When('completo el rango semanal {string}', async function (rango) {
  await this.datosPage.completarRangoSemanal(rango);
});

Then('el campo dias semanales muestra {string}', async function (dias) {
  await this.datosPage.validarDiasSemanales(dias);
});

When('completo el rango mensual {string}', async function (rango) {
  await this.datosPage.completarRangoMensual(rango);
});

Then('el campo meses muestra {string}', async function (meses) {
  await this.datosPage.validarMeses(meses);
});

When('completo el rango anual {string}', async function (rango) {
  await this.datosPage.completarRangoAnual(rango);
});

Then('el campo anos muestra {string}', async function (anos) {
  await this.datosPage.validarAnos(anos);
});

When('hago click en Calcular', async function () {
  await this.datosPage.clickCalcular();
});

Then('se muestra la grafica de temperatura', async function () {
  await this.datosPage.esperarGraficaTemperatura();
});

When('hago click en Resetear', async function () {
  await this.datosPage.clickResetear();
});

Then('los campos de periodo quedan limpios', async function () {
  await this.datosPage.validarCamposPeriodoReseteados();
});
