const { Given } = require('@cucumber/cucumber');

Given('que abro el sitio {string}', async function (url) {
  await this.page.goto(url);
});
