import "dotenv/config";
import {
    setWorldConstructor,
    setDefaultTimeout,
    BeforeAll,
    AfterAll,
    Before,
    After,
} from'@cucumber/cucumber';

import { Browser, BrowserContext, chromium, Page } from "playwright";
import { DatosMeteorologicosPage } from "../../pages/DatosMeteorologicosPage";

setDefaultTimeout(60 * 1000);

let browser: Browser;

export class CustomWorld {
    context!: BrowserContext;
    page!: Page;
    datosPage!: DatosMeteorologicosPage;

    env = process.env;
}

setWorldConstructor(CustomWorld);

BeforeAll(async function () {
    browser = await chromium.launch({ headless: true });
});

Before(async function (this: CustomWorld) {
    this.context = await browser.newContext();
    this.page = await this.context.newPage();
    this.datosPage = new DatosMeteorologicosPage(this.page);
});

After(async function (this: CustomWorld) {
    await this.page?.close();
    await this.context?.close();
});

AfterAll(async function () {
    await browser?.close();
});

