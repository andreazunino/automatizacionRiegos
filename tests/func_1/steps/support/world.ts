import { setWorldConstructor } from "@cucumber/cucumber";
import { Browser, Page } from "playwright";
import { DatosMeteorologicosPage } from "../pages/DatosMeteorologicosPage";

export class CustomWorld {
    browser!: Browser;
    page!: Page;
    datosPage!: DatosMeteorologicosPage;
}

setWorldConstructor(CustomWorld);