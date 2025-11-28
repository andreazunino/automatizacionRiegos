const { When, Then } = require('@cucumber/cucumber');
const { expect } = require('chai');

When('navego al menu de {string}', async function (linkText) {
  await this.page.getByRole('link', { name: linkText, exact: false }).click();
});

Then('veo un titulo que contiene {string}', async function (expected) {
  const heading = this.page.locator('h1').first();
  await heading.waitFor();
  const text = await heading.innerText();
  expect(text).to.contain(expected);
});
