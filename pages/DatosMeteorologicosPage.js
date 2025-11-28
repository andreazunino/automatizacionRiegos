const { expect } = require('playwright/test');

class DatosMeteorologicosPage {
  constructor(page) {
    this.page = page;
    this.url = 'http://10.0.1.252:8080/webriegos/meteorologia/datos-meteorologicos?lang=es';
    this.botonCalcular = '#calcular';
    this.mensajeError = '.warning-warning-span';
  }

  async navegar() {
    await this.page.goto(this.url, { waitUntil: 'domcontentloaded' });
    await this.esperarLoader();
  }

  async cargaCompleta() {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle');
    await this.esperarLoader();
  }

  async esperarLoader() {
    try {
      await this.page.waitForSelector('.loader-container', {
        state: 'visible',
        timeout: 3000,
      });
    } catch (err) {
      /* ignore loader not appearing briefly */
    }

    await this.page.waitForSelector('.loader-container', {
      state: 'hidden',
      timeout: 20000,
    });
  }

  async cargaOpcionesBusqueda(selector, cantidad) {
    await expect(this.page.locator(`#filtroBusqueda ${selector}`)).toHaveCount(cantidad);
  }

  async cargaDesplegable(opcion) {
    await expect(this.page.locator(opcion)).toBeVisible();
  }

  async cargaBoton(nombre) {
    await expect(this.page.getByRole('button', { name: nombre })).toBeVisible();
  }

  async seleccionoEstado(selector) {
    await this.page.locator('#radioTodas').check();
  }

  async estacionesDesplegadasTodas() {
    const desplegadas = this.page.locator('.multi-select-options');
    return (await desplegadas.locator('.multi-select-option').count()) > 2;
  }

  async estacionesProvinciaVisibles(nombreProvincia) {
    const options = this.page.locator(`.multi-select-option:has-text("${nombreProvincia}")`);
    await expect(options).toHaveCountGreaterThan(0);
  }

  async seleccionarProvincia(nombreProvincia) {
    const checkbox = this.page.locator('.checkbox-card', { hasText: nombreProvincia });
    await checkbox.locator('input[type="checkbox"]').check({ force: true });
  }

  async estacionesActivasVisibles() {
    const count = await this.page
      .locator('.multi-select-options .multi-select-option')
      .count();
    await expect(count).toBeGreaterThan(0);
  }

  async desplegarEstaciones() {
    await this.page.locator('.multi-select-header').click();
  }

  async ceroEstacionesSeleccionadas() {
    const seleccionadas = this.page.locator('.cards-container .minicard-selected');
    return (await seleccionadas.count()) === 0;
  }

  async clickBoton(selector) {
    await this.page.locator(selector).click();
  }

  async seleccionarEstacion(estacion) {
    await this.page
      .locator(`.multi-select-option:has(.multi-select-option-text:text("${estacion}"))`)
      .click();
  }

  async estacionSeleccionada(estacion) {
    const seleccionada = this.page.locator(`.minicard-selected:has-text("${estacion}")`);
    await expect(seleccionada).toBeVisible();
  }

  async mensajeCamposObligatorios() {
    await this.page.waitForSelector('.warning-warning-span', {
      state: 'visible',
      timeout: 3000,
    });
  }
}

module.exports = { DatosMeteorologicosPage };
