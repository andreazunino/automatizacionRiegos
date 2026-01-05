require('dotenv/config');
const {
  setWorldConstructor,
  setDefaultTimeout,
  BeforeAll,
  AfterAll,
  Before,
  After,
} = require('@cucumber/cucumber');
const { chromium } = require('playwright');
const { DatosMeteorologicosPage } = require('../pages/DatosMeteorologicosPage');

setDefaultTimeout(180 * 1000);

let browser;

class CustomWorld {
  constructor() {
    this.context = null;
    this.page = null;
    this.datosPage = null;
    this.env = process.env;
    this.lastDownload = null;
  }
}

setWorldConstructor(CustomWorld);

BeforeAll(async () => {
  browser = await chromium.launch({ headless: true });
});

Before(async function () {
  this.context = await browser.newContext();
  this.page = await this.context.newPage();
  this.datosPage = new DatosMeteorologicosPage(this.page);
});

After(async function () {
  await this.page?.close();
  await this.context?.close();
});

AfterAll(async () => {
  await browser?.close();
});

module.exports = { CustomWorld };
