import { Before, After } from "@cucumber/cucumber";
import { chromium } from "playwright";
import { setDefaultTimeout } from "@cucumber/cucumber";
import {CustomWorld} from "./world";
import {DatosMeteorologicosPage} from "../pages/DatosMeteorologicosPage";

setDefaultTimeout(30000);

Before(async function (this: CustomWorld) {
    this.browser = await chromium.launch({ headless: false });
    this.page = await this.browser.newPage();
    this.datosPage = new DatosMeteorologicosPage(this.page);
});

After(async function () {
    await this.page.close();
    await this.browser.close();
});