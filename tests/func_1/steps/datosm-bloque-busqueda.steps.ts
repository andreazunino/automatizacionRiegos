import { Given, When, Then } from "@cucumber/cucumber";
import { CustomWorld } from "../support/world";

Given("que entro en la página de datos meteorológicos", async function (this: CustomWorld) {
    await this.datosPage.navegar();
});

Then("la página debería cargar correctamente", async function (this: CustomWorld) {
    await this.datosPage.cargaCompleta();
});

Then("debería ver las opciones de {string}", async function (this: CustomWorld, bloque: string) {
    switch (bloque) {
        case "provincias":
            await this.datosPage.cargaOpcionesBusqueda(".checkbox-card", 3);
            break;
        case "estado":
            await this.datosPage.cargaOpcionesBusqueda(".form-check", 2);
            break;
        default:
            throw new Error(`Sección ${bloque} no encontrada`);
    }
});

Then("debería ver el desplegable de {string}", async function (this: CustomWorld, opcion: string) {
    switch (opcion) {
        case "estaciones":
            await this.datosPage.cargaDesplegable("#selectorEstaciones");
            break
        default:
            throw new Error(`Desplegable ${opcion} no encontrado`);
    }
});

Then("debería ver el botón {string}", async function (this: CustomWorld, nombre: string) {
   switch (nombre) {
       case "Eliminar selección":
           await this.datosPage.cargaBoton(nombre);
           break
       default:
           throw new Error(`Botón ${nombre} no implementado`);
   }
});

When("hago click en estado {string}", async function (this: CustomWorld, estado: string) {
   switch (estado) {
       case "Todas":
           await this.datosPage.seleccionoEstado("#radioTodas");
           break
       case "Activas":
           await this.datosPage.seleccionoEstado("#radioActivas");
           break
       default:
           throw new Error(`Estado ${estado} no válido.`);
   }
});

Then("despliego las estaciones", async function (this: CustomWorld) {
   await this.datosPage.desplegarEstaciones();
});

Then("debo ver todas las estaciones", async function (this: CustomWorld) {
    await this.datosPage.estacionesDesplegadasTodas();
});

When("selecciono la estación {string}", async function (this:CustomWorld, estacion: string) {
    await this.datosPage.seleccionarEstacion(estacion);
});

Then("{string} debe aparecer como seleccionada", async function (this: CustomWorld, estacion: string) {
    await this.datosPage.estacionSeleccionada(estacion);
});

When("hago click en el botón {string}", async function (this: CustomWorld, nombre: string) {
    switch (nombre) {
        case "Eliminar selección":
            await this.datosPage.clickBoton("#clear-all-btn");
            break;
        case "Calcular":
            await this.datosPage.clickBoton("#calcular");
            break;
        default:
            throw new Error(`Botón no implementado: ${nombre}`);
    }
});

Then("debe quitar todas las selecciones de estaciones", async function (this: CustomWorld) {
    await this.datosPage.ceroEstacionesSeleccionadas();
});
