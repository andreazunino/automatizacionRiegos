import { Page } from "playwright";
import {expect} from "playwright/test";
import {Integer} from "type-fest";

export class DatosMeteorologicosPage {
    private url = 'http://10.0.1.252:8080/webriegos/meteorologia/datos-meteorologicos?lang=es';

    constructor(private page: Page) {}

    botonCalcular = "#calcular"
    mensajeError = ".warning-warning-span"

    async navegar() {
        await this.page.goto(this.url, { waitUntil: "domcontentloaded" });
        await this.esperarLoader();
    }

    async cargaCompleta() {
        await this.page.waitForLoadState("domcontentloaded");
        await this.page.waitForLoadState("networkidle"); // Requests
        await this.esperarLoader();
    }

    async esperarLoader() {
        try {
            await this.page.waitForSelector(".loader-container", {
                state: "visible",
                timeout: 3000
            });
        } catch {} // Si no aparece en 3s, seguimos igual

        await this.page.waitForSelector(".loader-container", {
            state: "hidden",
            timeout: 20000
        });
    }

    async cargaOpcionesBusqueda(selector: string, cantidad: number) {
        await expect(this.page.locator(`#filtroBusqueda ${selector}`)).toHaveCount(cantidad);
    }

    async cargaDesplegable(opcion: string) {
        await expect(this.page.locator(opcion)).toBeVisible();
    }

    async cargaBoton(nombre: string) {
        await expect(this.page.getByRole("button", { name: nombre })).toBeVisible();
    }

    async seleccionoEstado(selector: string) {
        await this.page.locator("#radioTodas").check();
    }

    async estacionesDesplegadasTodas() {
        const desplegadas = this.page.locator(".multi-select-options");
        return (await desplegadas.locator(".multi-select-option").count() > 2); // Para que no cuente el "Todas" y el "Buscar..."
    }

    async desplegarEstaciones() {
        await this.page.locator(".multi-select-header").click();
    }

    async ceroEstacionesSeleccionadas(): Promise<boolean> {
        const seleccionadas = this.page.locator(".cards-container .minicard-selected");
        return (await seleccionadas.count()) == 0;
    }

    async clickBoton(selector: string) {
        await this.page.locator(selector).click();
    }

    async seleccionarEstacion(estacion: string) {
        await this.page.locator(`.multi-select-option:has(.multi-select-option-text:text("${estacion}"))`).click();
    }

    async estacionSeleccionada(estacion: string) {
        const seleccionada = this.page.locator(`.minicard-selected:has-text("${estacion}")`);
        await expect(seleccionada).toBeVisible();
    }

    async mensajeCamposObligatorios() {
        await this.page.waitForSelector(".warning-warning-span", {
            state: "visible",
            timeout: 3000
        });
    }
}