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

    const btnClear = this.page.locator('#clear-all-btn');
    if (await btnClear.count()) {
      await btnClear.first().waitFor({ state: 'visible', timeout: 10000 });
      await expect(btnClear.first()).toBeVisible();
      return;
    }

    const rolBtn = this.page.getByRole('button', { name: new RegExp(posiblesNombres.join('|'), 'i') });
    if (await rolBtn.count()) {
      await rolBtn.first().waitFor({ state: 'visible', timeout: 10000 });
      await expect(rolBtn.first()).toBeVisible();
      return;
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
    // Asegura que el bloque de filtros esté cargado (primer filtro de provincias)
    const filtro = this.page.locator('div#filtroBusqueda').first();
    await filtro.waitFor({ state: 'attached', timeout: 10000 });
    await filtro.waitFor({ state: 'visible', timeout: 10000 });

    const checkbox = filtro
      .locator('.checkbox-card')
      .filter({ hasText: new RegExp(nombre, 'i') })
      .locator('input[type="checkbox"]');
    await checkbox.first().scrollIntoViewIfNeeded();
    await checkbox.first().check({ force: true, timeout: 10000 });
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
    // Asegura que el desplegable esté abierto
    const header = this.page.locator('.multi-select-header');
    const contenedor = this.page.locator('.multi-select-options');
    if (await header.count()) {
      await header.click();
    }

    if (await contenedor.count()) {
      // reintenta abrir hasta que sea visible
      for (let i = 0; i < 3; i++) {
        if (await contenedor.first().isVisible()) break;
        if (await header.count()) {
          await header.click();
        }
        await this.page.waitForTimeout(500);
      }
      await contenedor.first().waitFor({ state: 'visible', timeout: 15000 });
    }

    const option = this.page
      .locator('.multi-select-option')
      .filter({ hasText: new RegExp(estacion, 'i') });

    await option.first().scrollIntoViewIfNeeded();
    await option.first().click({ force: true, timeout: 15000 });
  }

  async estacionSeleccionada(estacion) {
    const seleccionada = this.page
      .locator('.minicard-selected')
      .filter({ hasText: new RegExp(estacion, 'i') });
    await expect(seleccionada.first()).toBeVisible();
  }

  async quitarEstacionPorCruz(estacion) {
    const card = this.page
      .locator('.minicard-selected')
      .filter({ hasText: new RegExp(estacion, 'i') });
    await expect(card).toBeVisible();
    const closeBtn = card
      .locator(
        'button, .btn-close, .close, .icon-close, .fa-times, .fa-close, .remove, .minicard-close, [aria-label*="Cerrar"], [aria-label*="Eliminar"], [title*="Eliminar"], [title*="Cerrar"]'
      )
      .first();
    await closeBtn.click({ timeout: 10000 });
  }

  async estacionNoSeleccionada(estacion) {
    const seleccionada = this.page
      .locator('.minicard-selected')
      .filter({ hasText: new RegExp(estacion, 'i') });
    await expect(seleccionada).toHaveCount(0);
  }

  async mensajeCamposObligatorios() {
    await this.page.waitForSelector('.warning-warning-span', {
      state: 'visible',
      timeout: 3000,
    });
  }

  // --- Bloque periodo/fechas ---
  async seleccionarPeriodo(valor) {
    const select = this.page.locator('#rangoTemporal');
    await expect(select).toBeVisible();
    await select.selectOption(valor);
  }

  async completarRangoHorarios(rangoTexto) {
    const input = this.page.locator('#picker-horario-range');
    await expect(input).toBeVisible();
    await input.fill('');
    await input.fill(rangoTexto);
    await this.page.locator('#picker-horario-range').blur();
  }

  async validarDiasHorarios(expectedDias) {
    const dias = this.page.locator('#textHorarios');
    await expect(dias).toBeVisible();
    await expect(dias).toHaveText(String(expectedDias));
  }

  async completarRangoPersonalizado(rangoTexto) {
    // Asegura que el select este en "diarios"
    const select = this.page.locator('#rangoTemporal');
    if (await select.count()) {
      await select.selectOption('diarios');
    }

    const input = this.page.locator('#picker-day-range');
    const contenedor = this.page.locator('#diaRango');
    if (await contenedor.count()) {
      await contenedor.first().waitFor({ state: 'visible', timeout: 10000 });
    }
    await input.waitFor({ state: 'attached', timeout: 10000 });
    await this.page.waitForFunction(
      (id) => {
        const el = document.querySelector(id);
        return !!el && !el.disabled && el.offsetParent !== null;
      },
      '#picker-day-range',
      { timeout: 15000 }
    );
    await expect(input).toBeVisible({ timeout: 15000 });
    await expect(input).toBeEnabled({ timeout: 15000 });
    await input.fill('');
    await input.fill(rangoTexto);
    await input.blur();
  }

  async validarDiasPersonalizados(expectedDias) {
    const dias = this.page.locator('#textDias');
    await expect(dias).toBeVisible();
    await expect(dias).toHaveText(String(expectedDias));
  }

  async completarRangoSemanal(rangoTexto) {
    const input = this.page.locator('#picker-semana');
    await expect(input).toBeVisible();
    await input.fill('');
    await input.fill(rangoTexto);
    await input.blur();
  }

  async validarDiasSemanales(expectedDias) {
    const dias = this.page.locator('#textSemanas');
    await expect(dias).toBeVisible({ timeout: 10000 });
    await this.page.waitForFunction(
      (el) => el.innerText.trim().length > 0,
      dias,
      { timeout: 15000 }
    );
    await expect(dias).toHaveText(String(expectedDias));
  }

  async completarRangoMensual(rangoTexto) {
    const input = this.page.locator('#picker-mes');
    await expect(input).toBeVisible();
    await input.fill('');
    await input.fill(rangoTexto);
    await input.blur();
  }

  async validarMeses(expectedMeses) {
    const meses = this.page.locator('#textMes');
    await expect(meses).toBeVisible();
    await expect(meses).toHaveText(String(expectedMeses));
  }

  async completarRangoAnual(rangoTexto) {
    const input = this.page.locator('#picker-anyo');
    await expect(input).toBeVisible();
    await input.fill('');
    await input.fill(rangoTexto);
    await input.blur();
  }

  async validarAnos(expectedAnos) {
    const anos = this.page.locator('#textAnyos');
    await expect(anos).toBeVisible();
    await expect(anos).toHaveText(String(expectedAnos));
  }

  async clickCalcular() {
    const boton = this.page.locator('#calcular');
    await expect(boton).toBeVisible();
    await boton.click();
  }

  async esperarGraficaTemperatura() {
    const grafica = this.page.locator('#grafica1');
    await grafica.waitFor({ state: 'visible', timeout: 60000 });
    await expect(grafica).toBeVisible({ timeout: 60000 });
  }

  async clickResetear() {
    const boton = this.page.locator('#limpiarRangos');
    await expect(boton).toBeVisible();
    await boton.click();
  }

  async validarCamposPeriodoReseteados() {
    // Select vuelve al placeholder
    const select = this.page.locator('#rangoTemporal');
    await expect(await select.inputValue()).toBe('');

    // Inputs de rango vacíos
    const inputs = ['#picker-horario-range', '#picker-day-range', '#picker-semana', '#picker-mes', '#picker-anyo'];
    for (const sel of inputs) {
      const input = this.page.locator(sel);
      if (await input.count()) {
        const val = await input.inputValue();
        expect(val).toBe('');
      }
    }

    // Textos de resumen vacíos o en 0
    const resumenes = ['#textHorarios', '#textDias', '#textSemanas', '#textMes', '#textAnyos'];
    for (const sel of resumenes) {
      const span = this.page.locator(sel);
      if (await span.count()) {
        const text = (await span.innerText()).trim();
        expect(['', '0']).toContain(text);
      }
    }
  }
}

module.exports = { DatosMeteorologicosPage };
