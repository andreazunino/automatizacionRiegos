const { chromium } = require('playwright');
const {
  setWorldConstructor,
  setDefaultTimeout,
  BeforeAll,
  AfterAll,
  Before,
  After,
} = require('@cucumber/cucumber');

setDefaultTimeout(60 * 1000);

let browser;

BeforeAll(async () => {
  browser = await chromium.launch({ headless: true });
});

Before(async function () {
  this.context = await browser.newContext();
  this.page = await this.context.newPage();
});

After(async function () {
  await this.page?.close();
  await this.context?.close();
});

AfterAll(async () => {
  await browser?.close();
});

function CustomWorld() {
  this.context = null;
  this.page = null;
}

setWorldConstructor(CustomWorld);
