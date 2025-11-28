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
      await this.page.waitForSelector('.loader-container', { state: 'visible', timeout: 3000 });
    } catch (err) {
      /* ignore loader not appearing briefly */
    }

    await this.page.waitForSelector('.loader-container', { state: 'hidden', timeout: 20000 });
  }

  async cargaOpcionesBusqueda(selector, cantidad) {
    await expect(this.page.locator(`#filtroBusqueda ${selector}`)).toHaveCount(cantidad);
  }

  async cargaDesplegable(opcion) {
    await expect(this.page.locator(opcion)).toBeVisible();
  }

  async cargaBoton(nombre) {
    const posiblesNombres = [nombre];
    if (nombre.toLowerCase() === 'eliminar seleccion') {
      posiblesNombres.push('Eliminar seleccion');
      posiblesNombres.push('Eliminar selección');
    }

    const candidatos = [
      this.page.getByRole('button', { name: new RegExp(posiblesNombres.join('|'), 'i') }),
      this.page.locator('#clear-all-btn'),
    ];

    for (const candidato of candidatos) {
      if ((await candidato.count()) > 0) {
        await expect(candidato.first()).toBeVisible();
        return;
      }
    }

    throw new Error(`Boton "${nombre}" no encontrado con selectores conocidos`);
  }

  async seleccionoEstado(selector) {
    await this.page.locator('#radioTodas').check();
  }

  async estacionesDesplegadasTodas() {
    const desplegadas = this.page.locator('.multi-select-options');
    return (await desplegadas.locator('.multi-select-option').count()) > 2;
  }

  provinciaPattern(nombre) {
    const mapa = {
      castellon: 'Castell[oó]n|Castell[oó]',
      valencia: 'Valencia|València',
      alicante: 'Alicante|Alacant',
    };
    const key = nombre.toLowerCase();
    return mapa[key] || nombre;
  }

  async estacionesProvinciaVisibles(nombreProvincia) {
    const pattern = this.provinciaPattern(nombreProvincia);
    await this.page.waitForSelector('.multi-select-options .multi-select-option', {
      state: 'visible',
      timeout: 10000,
    });
    const count = await this.page.$$eval(
      '.multi-select-option',
      (els, regexStr) => {
        const reg = new RegExp(regexStr, 'i');
        return els.filter((el) => {
          const data = el.getAttribute('data-value') || '';
          const text = el.innerText || '';
          return reg.test(data) || reg.test(text);
        }).length;
      },
      pattern
    );
    await expect(count).toBeGreaterThan(0);
  }

  async seleccionarProvincia(nombreProvincia) {
    const nombre = this.provinciaPattern(nombreProvincia);
    const checkbox = this.page
      .locator('.checkbox-card')
      .filter({ hasText: new RegExp(nombre, 'i') })
      .locator('input[type="checkbox"]');
    await checkbox.first().check({ force: true });
    await this.esperarLoader();
  }

  async estacionesActivasVisibles() {
    const count = await this.page.locator('.multi-select-options .multi-select-option').count();
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

  async quitarEstacionPorCruz(estacion) {
    const card = this.page.locator(`.minicard-selected:has-text("${estacion}")`);
    await expect(card).toBeVisible();
    const closeBtn = card
      .locator(
        'button, .btn-close, .close, .icon-close, .fa-times, .fa-close, .remove, .minicard-close, [aria-label*="Cerrar"], [aria-label*="Eliminar"], [title*="Eliminar"], [title*="Cerrar"]'
      )
      .first();
    await closeBtn.click({ timeout: 10000 });
  }

  async estacionNoSeleccionada(estacion) {
    const seleccionada = this.page.locator(`.minicard-selected:has-text("${estacion}")`);
    await expect(seleccionada).toHaveCount(0);
  }

  async mensajeCamposObligatorios() {
    await this.page.waitForSelector('.warning-warning-span', {
      state: 'visible',
      timeout: 3000,
    });
  }
}

module.exports = { DatosMeteorologicosPage };
