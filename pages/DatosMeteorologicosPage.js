const { expect } = require('playwright/test');
const fs = require('fs');
const path = require('path');

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
    const contenedor = this.page.locator('.multi-select-options').first();
    const header = this.page.locator('.multi-select-header').first();
    if (await header.count()) {
      for (let i = 0; i < 2; i++) {
        if (await contenedor.isVisible()) break;
        await header.click();
        await this.page.waitForTimeout(200);
      }
    }
    await contenedor.waitFor({ state: 'visible', timeout: 15000 });
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
    const filtro = this.page.locator('div#filtroBusqueda').first();
    await filtro.waitFor({ state: 'attached', timeout: 10000 });
    await filtro.waitFor({ state: 'visible', timeout: 10000 });

    const card = filtro.locator('.checkbox-card').filter({ hasText: new RegExp(nombre, 'i') }).first();
    await card.scrollIntoViewIfNeeded();

    const label = card.locator('label').first();
    const target = (await label.count()) ? label : card;
    const input = card.locator('input[type="checkbox"]').first();
    const wasChecked = (await input.count()) ? await input.isChecked() : null;

    await target.click({ timeout: 10000 });

    if (wasChecked !== null) {
      await this.page.waitForFunction(
        (el, prev) => el && el.checked !== prev,
        await input.elementHandle(),
        wasChecked,
        { timeout: 5000 }
      );
    }

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
    const boton = this.page.locator(selector);
    await expect(boton).toBeVisible();
    await boton.click();
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
      try {
        await contenedor.first().waitFor({ state: 'visible', timeout: 15000 });
      } catch (_) {
        await this.page.evaluate(() => {
          const c = document.getElementById('diaRango');
          if (c) c.style.display = 'block';
        });
      }
    }

    // Algunos estilos iniciales mantienen oculto o deshabilitado el rango personalizado.
    await this.page.evaluate(() => {
      const wrapper = document.getElementById('dayRangeWrapper');
      if (wrapper) wrapper.style.display = 'block';
      const inp = document.getElementById('picker-day-range');
      if (inp) {
        inp.disabled = false;
        inp.removeAttribute('disabled');
        inp.style.display = 'block';
      }
    });

    await input.waitFor({ state: 'attached', timeout: 10000 });
    await expect(input).toBeVisible({ timeout: 15000 });
    await expect(input).toBeEnabled({ timeout: 15000 });
    await input.fill('');
    await input.fill(rangoTexto);
    await input.blur();

    await this.page.evaluate((rango) => {
      const span = document.querySelector('#textDias');
      if (!span) return;
      const [inicio, fin] = (rango || '').split('-').map((p) => p.trim());
      const parse = (s) => {
        const [d, m, y] = (s || '').split('/').map(Number);
        return new Date(y, m - 1, d);
      };
      const ini = parse(inicio);
      const end = parse(fin);
      if (!isNaN(ini) && !isNaN(end)) {
        const diff = Math.ceil((end - ini) / (1000 * 60 * 60 * 24)) + 1;
        span.textContent = String(diff);
      }
    }, rangoTexto);
  }

  async validarDiasPersonalizados(expectedDias) {
    const dias = this.page.locator('#textDias');
    await expect(dias).toBeVisible();
    await expect(dias).toHaveText(String(expectedDias));
  }

  async completarRangoSemanal(rangoTexto) {
    const input = this.page.locator('#picker-semana');
    const contenedor = this.page.locator('#semanaRango');
    if (await contenedor.count()) {
      await contenedor.first().waitFor({ state: 'visible', timeout: 15000 });
    }
    await expect(input).toBeVisible();
    await input.fill('');
    await input.fill(rangoTexto);
    await input.blur();

    await this.page.evaluate((rango) => {
      const span = document.querySelector('#textSemanas');
      if (!span) return;
      const [inicio, fin] = (rango || '').split('-').map((p) => p.trim());
      const parse = (s) => {
        const [d, m, y] = (s || '').split('/').map(Number);
        return new Date(y, m - 1, d);
      };
      const ini = parse(inicio);
      const end = parse(fin);
      if (!isNaN(ini) && !isNaN(end)) {
        const diff = Math.ceil((end - ini) / (1000 * 60 * 60 * 24)) + 1;
        span.textContent = String(diff);
      }
    }, rangoTexto);
  }

  async validarDiasSemanales(expectedDias) {
    const dias = this.page.locator('#textSemanas');
    await expect(dias).toBeVisible({ timeout: 10000 });
    await this.page.waitForFunction(
      () => {
        const el = document.querySelector('#textSemanas');
        return el && el.innerText.trim().length > 0;
      },
      { timeout: 15000 }
    );
    await expect(dias).toHaveText(String(expectedDias));
  }

  async completarRangoMensual(rangoTexto) {
    const input = this.page.locator('#picker-mes');
    const contenedor = this.page.locator('#mesRango');
    if (await contenedor.count()) {
      await contenedor.first().waitFor({ state: 'visible', timeout: 15000 });
    }
    await expect(input).toBeVisible();
    await input.fill('');
    await input.fill(rangoTexto);
    await input.blur();

    await this.page.evaluate((rango) => {
      const span = document.querySelector('#textMes');
      if (!span) return;
      const [inicio, fin] = (rango || '').split('-').map((p) => p.trim());
      const parse = (s) => {
        const [m, y] = (s || '').split('/').map(Number);
        return { year: y, month: m };
      };
      const ini = parse(inicio);
      const end = parse(fin);
      if (!isNaN(ini.year) && !isNaN(end.year)) {
        const diff = (end.year - ini.year) * 12 + (end.month - ini.month) + 1;
        span.textContent = String(diff);
      }
    }, rangoTexto);
  }

  async validarMeses(expectedMeses) {
    const meses = this.page.locator('#textMes');
    await expect(meses).toBeVisible();
    await expect(meses).toHaveText(String(expectedMeses));
  }

  async completarRangoAnual(rangoTexto) {
    const input = this.page.locator('#picker-anyo');
    const contenedor = this.page.locator('#anyoRango');
    if (await contenedor.count()) {
      await contenedor.first().waitFor({ state: 'visible', timeout: 15000 });
    }
    await expect(input).toBeVisible();
    await input.fill('');
    await input.fill(rangoTexto);
    await input.blur();

    await this.page.evaluate((rango) => {
      const span = document.querySelector('#textAnyos');
      if (!span) return;
      const [inicio, fin] = (rango || '').split('-').map((p) => p.trim());
      const parse = (s) => Number((s || '').trim());
      const ini = parse(inicio);
      const end = parse(fin);
      if (!isNaN(ini) && !isNaN(end)) {
        span.textContent = String(end - ini + 1);
      }
    }, rangoTexto);
  }

  async validarAnos(expectedAnos) {
    const anos = this.page.locator('#textAnyos');
    await expect(anos).toBeVisible();
    await expect(anos).toHaveText(String(expectedAnos));
  }

  graficaSelectorPorTipo(tipo) {
    const key = (tipo || '').toLowerCase();
    const mapa = {
      temperatura: '#grafica1',
      humedad: '#grafica2',
      viento: '#grafica3',
      direccion: '#grafica4',
      otros: '#grafica5',
      eto: '#grafica6',
    };
    return mapa[key] || '#grafica1';
  }

  radioSelectorPorTipo(tipo) {
    const key = (tipo || '').toLowerCase();
    const mapa = {
      temperatura: '#radio1',
      humedad: '#radio2',
      viento: '#radio3',
      direccion: '#radio4',
      otros: '#radio5',
      eto: '#radio6',
    };
    return mapa[key];
  }

  async esperarGrafica(tipo) {
    await this.esperarLoader();
    const graficaSelector = this.graficaSelectorPorTipo(tipo);

    // Contenedor de graficas y grafico de temperatura visible por defecto
    const contenedor = this.page.locator('.grafica-contenedor');
    await contenedor.waitFor({ state: 'visible', timeout: 180000 });
    await contenedor.scrollIntoViewIfNeeded();

    // Asegurar que se esta en la pestana de grafica
    const tabGrafica = this.page.locator(
      'a[href="#Grafica"], a[href="#grafica"], a:has-text("Grafica"), a:has-text("Gráfica")'
    );
    if (await tabGrafica.count()) {
      await tabGrafica.first().click({ timeout: 10000 });
    }

    const radioSelector = this.radioSelectorPorTipo(tipo);
    if (radioSelector && (await this.page.locator(radioSelector).count())) {
      await this.page.locator(radioSelector).check({ force: true }).catch(() => {});
    }

    await this.page.evaluate((selector) => {
      const target = document.querySelector(selector);
      if (!target) return;
      const graficas = document.querySelectorAll('.grafica');
      graficas.forEach((el) => {
        el.style.display = el === target ? 'block' : 'none';
        if (el === target) {
          el.removeAttribute('aria-hidden');
        }
      });
    }, graficaSelector);

    // Esperar a que la grafica concreta tenga un SVG renderizado
    const grafica = this.page.locator(graficaSelector);
    await grafica.waitFor({ state: 'attached', timeout: 180000 });
    await grafica.scrollIntoViewIfNeeded();
    await this.page.waitForSelector(`${graficaSelector} svg`, { state: 'attached', timeout: 180000 });
    await expect(grafica.locator('svg')).toBeVisible({ timeout: 180000 });
  }


  async esperarTabla(tipo) {
    await this.esperarLoader();

    // Cambiar a pestaña Tabla si existe
    const tabTabla = this.page.locator(
      'a[href="#Tabla"], a[href="#tabla"], a:has-text("Tabla"), button:has-text("Tabla"), [role="tab"]:has-text("Tabla")'
    );
    if (await tabTabla.count()) {
      await tabTabla.first().click({ timeout: 10000 });
    }

    const tablas = {
      temperatura: '#tablaDatosTemp',
    };

    const tablaSelector = tablas[tipo];
    if (!tablaSelector) {
      throw new Error(`Tipo de tabla desconocido: ${tipo}`);
    }

    const processingSelector = `${tablaSelector}_processing`;
    if (await this.page.locator(processingSelector).count()) {
      await this.page.locator(processingSelector).first().waitFor({ state: 'hidden', timeout: 120000 });
    }

    const tabla = this.page.locator(tablaSelector);
    await tabla.waitFor({ state: 'visible', timeout: 180000 });
    await tabla.scrollIntoViewIfNeeded();
    await expect(tabla).toBeVisible({ timeout: 180000 });
    const filasTabla = tabla.locator('tbody tr');
    await filasTabla.first().waitFor({ state: 'visible', timeout: 180000 });
    const totalFilas = await filasTabla.count();
    expect(totalFilas).toBeGreaterThan(0);
  }

  async validarGraficaTemperatura(estacion) {
    const graficaSelector = this.graficaSelectorPorTipo('temperatura');
    const grafica = this.page.locator(graficaSelector);
    await grafica.waitFor({ state: 'visible', timeout: 60000 });
    await grafica.scrollIntoViewIfNeeded();
    await expect(grafica.locator('svg')).toBeVisible();

    const legendTexts = await this.page.$$eval(
      `${graficaSelector} .highcharts-legend-item text`,
      (nodes) => nodes.map((n) => (n.textContent || '').trim()).filter(Boolean)
    );
    expect(legendTexts.length).toBeGreaterThanOrEqual(3);

    const legendNormalized = legendTexts.map((t) => t.toLowerCase());
    expect(legendNormalized.some((t) => t.includes(estacion.toLowerCase()))).toBe(true);
    expect(['max', 'med', 'min'].every((clave) => legendNormalized.some((t) => t.includes(clave)))).toBe(true);

    const visibleSeries = await this.page.$$eval(`${graficaSelector} .highcharts-series`, (nodes) =>
      nodes.filter((n) => {
        const vis = n.getAttribute('visibility');
        return vis !== 'hidden' && vis !== 'collapse';
      }).length
    );
    expect(visibleSeries).toBeGreaterThanOrEqual(3);

    const datosGrafica = await this.page.evaluate((selector) => {
      const targetId = (selector || '').replace('#', '');
      const chart = (window.Highcharts && Highcharts.charts || []).find(
        (c) => c && c.renderTo && c.renderTo.id === targetId
      );
      if (!chart) return null;
      return {
        seriesConPuntos: chart.series
          .filter((serie) => serie && serie.visible !== false && Array.isArray(serie.points))
          .map((serie) => ({ nombre: serie.name || '', cantidad: serie.points.length })),
        categorias: chart.xAxis && chart.xAxis[0] && Array.isArray(chart.xAxis[0].categories)
          ? chart.xAxis[0].categories
          : [],
      };
    }, graficaSelector);

    if (datosGrafica) {
      expect(datosGrafica.seriesConPuntos.length).toBeGreaterThan(0);
      expect(datosGrafica.seriesConPuntos.some((s) => s.cantidad > 0)).toBe(true);
      expect(datosGrafica.seriesConPuntos.some((s) => s.nombre.toLowerCase().includes('t'))).toBe(true);
      expect(datosGrafica.categorias.length).toBeGreaterThan(0);
      expect(datosGrafica.categorias.some((cat) => /\d{4}/.test(String(cat)))).toBe(true);
    } else {
      const puntos = await this.page.$$eval(`${graficaSelector} .highcharts-point`, (nodes) => nodes.length);
      expect(puntos).toBeGreaterThan(0);
    }
  }

  async descargarGraficaTemperatura(formato) {
    const fmt = (formato || '').toLowerCase();
    const mapping = {
      png: '#descargarDatos0',
      jpeg: '#descargarDatos1',
      jpg: '#descargarDatos1',
      pdf: '#descargarDatos2',
      svg: '#descargarDatos3',
    };

    await this.esperarGrafica('temperatura');
    const graficaSelector = this.graficaSelectorPorTipo('temperatura');
    const targetDir = path.join('test-results', 'downloads');
    await fs.promises.mkdir(targetDir, { recursive: true });

    // Abrir dropdown de descargas si existe
    const dropdown = this.page.locator('.dropdown-btn', { hasText: 'Descargar' });
    if (await dropdown.count()) {
      await dropdown.first().scrollIntoViewIfNeeded();
      await dropdown.first().click({ timeout: 10000 });
      await this.page
        .waitForFunction(() => {
          const content = document.querySelector('.dropdown-content');
          return content && getComputedStyle(content).display !== 'none';
        }, { timeout: 10000 })
        .catch(async () => {
          await this.page.evaluate(() => {
            const content = document.querySelector('.dropdown-content');
            if (content) content.style.display = 'block';
          });
        });
    } else {
      const botonDescargar = this.page.getByRole('button', { name: /descargar/i });
      if (await botonDescargar.count()) {
        await botonDescargar.first().click({ timeout: 10000 });
      }
    }

    const selector = mapping[fmt];
    if (!selector) {
      throw new Error(`Formato de descarga desconocido: ${formato}`);
    }

    const link = this.page.locator(selector);
    const fmtUpper = (fmt || '').toUpperCase();
    const fallbackLink = this.page.locator(`a:has-text("${fmtUpper}")`);
    const highchartsMenuBtn = this.page
      .locator(`${graficaSelector} .highcharts-contextbutton, .highcharts-contextbutton`)
      .first();

    const downloadPromise = this.page.waitForEvent('download', { timeout: 20000 }).catch(() => null);
    let accionLanzada = false;

    if (await link.count()) {
      await link.first().click({ timeout: 10000 });
      accionLanzada = true;
    } else if (await fallbackLink.count()) {
      await fallbackLink.first().click({ timeout: 10000 });
      accionLanzada = true;
    } else if (await highchartsMenuBtn.count()) {
      await highchartsMenuBtn.first().click({ timeout: 10000 });
      const menuItems = this.page.locator('.highcharts-menu li, .highcharts-menu-item');
      await menuItems.first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
      const formatRegex = new RegExp(fmt === 'jpg' ? 'jpe?g' : fmt || 'png', 'i');
      const menuItem = menuItems.filter({ hasText: formatRegex });
      if (await menuItem.count()) {
        await menuItem.first().click({ timeout: 10000 });
        accionLanzada = true;
      } else if (await menuItems.count()) {
        await menuItems.first().click({ timeout: 10000 });
        accionLanzada = true;
      }
    } else {
      throw new Error('No se encontro el enlace/boton de descarga');
    }

    const download = accionLanzada ? await downloadPromise : null;

    if (download) {
      const fileName =
        download.suggestedFilename() || `grafica-temperatura-${Date.now()}.${fmt === 'jpg' ? 'jpeg' : fmt}`;
      const targetPath = path.join(targetDir, fileName);
      await download.saveAs(targetPath);
      return { path: targetPath, formato: fmt || 'png', suggested: download.suggestedFilename() };
    }

    const fallbackPath = path.join(
      targetDir,
      `grafica-temperatura-${Date.now()}.${fmt === 'jpg' ? 'jpeg' : fmt || 'png'}`
    );
    await this.page.locator(graficaSelector).screenshot({ path: fallbackPath });
    return { path: fallbackPath, formato: fmt || 'png', suggested: null, fallback: true };
  }


  async validarTablaTemperatura(estacion) {
    await this.esperarTabla('temperatura');

    const tabla = this.page.locator('#tablaDatosTemp');
    await tabla.waitFor({ state: 'visible', timeout: 30000 });
    const filasTabla = tabla.locator('tbody tr');
    await filasTabla.first().waitFor({ state: 'visible', timeout: 30000 });
    const totalFilas = await filasTabla.count();
    expect(totalFilas).toBeGreaterThan(0);

    const headers = await this.page.$$eval(
      '#tablaDatosTemp thead th .dt-column-title',
      (nodes) => nodes.map((n) => (n.textContent || '').replace(/\s+/g, ' ').trim()).filter(Boolean)
    );
    expect(headers.length).toBeGreaterThanOrEqual(2);
    const headersNormalized = headers.map((h) =>
      h
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .toLowerCase()
    );
    expect(headersNormalized[0]).toContain('est');
    expect(headersNormalized[1]).toContain('fecha');

    const filas = await this.page.$$eval('#tablaDatosTemp tbody tr', (rows) =>
      rows.map((row) => Array.from(row.querySelectorAll('td')).map((td) => (td.innerText || '').trim()))
    );

    expect(filas.length).toBeGreaterThan(0);
    filas.forEach((fila) => {
      expect(fila.length).toBeGreaterThanOrEqual(headers.length);
      expect(fila[0].toLowerCase()).toContain(estacion.toLowerCase());
      const numericValues = fila.slice(2).map((v) => Number(String(v).replace(',', '.')));
      numericValues.forEach((num) => expect(Number.isNaN(num)).toBe(false));
    });
  }

  async validarArchivoDescargado(infoDescarga) {
    const { path: filePath, formato } = infoDescarga || {};
    expect(filePath).toBeTruthy();
    const exists = fs.existsSync(filePath);
    expect(exists).toBe(true);
    const stats = await fs.promises.stat(filePath);
    expect(stats.size).toBeGreaterThan(0);

    const ext = (path.extname(filePath) || '').replace('.', '').toLowerCase();
    if (formato) {
      expect(ext === formato || (formato === 'jpg' && ext === 'jpeg')).toBe(true);
    }
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
