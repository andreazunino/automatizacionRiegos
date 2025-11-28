const { Given, When, Then } = require('@cucumber/cucumber');

Given('que entro en la pagina de datos meteorologicos', async function () {
  await this.datosPage.navegar();
});

Then('la pagina deberia cargar correctamente', async function () {
  await this.datosPage.cargaCompleta();
});

Then('deberia ver las opciones de {string}', async function (bloque) {
  switch (bloque) {
    case 'provincias':
      await this.datosPage.cargaOpcionesBusqueda('.checkbox-card', 3);
      break;
    case 'estado':
      await this.datosPage.cargaOpcionesBusqueda('.form-check', 2);
      break;
    default:
      throw new Error(`Seccion ${bloque} no encontrada`);
  }
});

Then('deberia ver el desplegable de {string}', async function (opcion) {
  switch (opcion) {
    case 'estaciones':
      await this.datosPage.cargaDesplegable('#selectorEstaciones');
      break;
    default:
      throw new Error(`Desplegable ${opcion} no encontrado`);
  }
});

Then('deberia ver el boton {string}', async function (nombre) {
  switch (nombre) {
    case 'Eliminar seleccion':
      await this.datosPage.cargaBoton(nombre);
      break;
    default:
      throw new Error(`Boton ${nombre} no implementado`);
  }
});

When('hago click en estado {string}', async function (estado) {
  switch (estado) {
    case 'Todas':
      await this.datosPage.seleccionoEstado('#radioTodas');
      break;
    case 'Activas':
      await this.datosPage.seleccionoEstado('#radioActivas');
      break;
    default:
      throw new Error(`Estado ${estado} no valido.`);
  }
});

Then('despliego las estaciones', async function () {
  await this.datosPage.desplegarEstaciones();
});

Then('debo ver todas las estaciones', async function () {
  await this.datosPage.estacionesDesplegadasTodas();
});

When('hago click en provincias {string}', async function (provincia) {
  await this.datosPage.seleccionarProvincia(provincia);
});

Then('debo ver las estaciones {string}', async function (provincia) {
  await this.datosPage.estacionesProvinciaVisibles(provincia);
});

Then('debo ver las estaciones Activas', async function () {
  await this.datosPage.estacionesActivasVisibles();
});

When('selecciono la estacion {string}', async function (estacion) {
  await this.datosPage.seleccionarEstacion(estacion);
});

Then('{string} debe aparecer como seleccionada', async function (estacion) {
  await this.datosPage.estacionSeleccionada(estacion);
});

When('hago click en el boton {string}', async function (nombre) {
  switch (nombre) {
    case 'Eliminar seleccion':
      await this.datosPage.clickBoton('#clear-all-btn');
      break;
    case 'Calcular':
      await this.datosPage.clickBoton('#calcular');
      break;
    default:
      throw new Error(`Boton no implementado: ${nombre}`);
  }
});

Then('debe quitar todas las selecciones de estaciones', async function () {
  await this.datosPage.ceroEstacionesSeleccionadas();
});
