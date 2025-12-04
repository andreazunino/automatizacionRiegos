const { Given, When, Then } = require('@cucumber/cucumber');

// Seleccion de estacion ya existe en steps de func_1 (selecciono la estacion {string})
// Aqui solo manejamos el bloque de periodo/fechas

When('selecciono el periodo {string}', async function (valor) {
  this.periodoSeleccionado = valor.toLowerCase(); 
  await this.datosPage.seleccionarPeriodo(valor);
});

When('completo el rango de tiempo {string}', async function (rango) {
  switch (this.periodoSeleccionado) {
    case 'horarios':
      await this.datosPage.completarRangoHorarios(rango);
      break;
    case 'diarios':
      await this.datosPage.completarRangoPersonalizado(rango);
      break;
    case 'semanales':
      await this.datosPage.completarRangoSemanal(rango);
      break;
    case 'mensuales':
      await this.datosPage.completarRangoMensual(rango);
      break;
    case 'anuales':
      await this.datosPage.completarRangoAnual(rango);
      break;
    default:
      throw new Error(`No se reconoce el periodo seleccionado: ${this.periodoSeleccionado}`);
  }
});

Then('el campo dias horarios muestra {string}', async function (dias) {
  await this.datosPage.validarDiasHorarios(dias);
});

Then('el campo dias personalizados muestra {string}', async function (dias) {
  await this.datosPage.validarDiasPersonalizados(dias);
});

Then('el campo dias semanales muestra {string}', async function (dias) {
  await this.datosPage.validarDiasSemanales(dias);
});

Then('el campo meses muestra {string}', async function (meses) {
  await this.datosPage.validarMeses(meses);
});

Then('el campo anos muestra {string}', async function (anos) {
  await this.datosPage.validarAnos(anos);
});

Then('los campos de periodo quedan limpios', async function () {
  await this.datosPage.validarCamposPeriodoReseteados();
});

Then('se renderiza la pagina de resultados', async function () {
  await this.datosPage.esperarResultados();
});
