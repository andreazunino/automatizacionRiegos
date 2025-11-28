import { When, Then } from "@cucumber/cucumber";
import { expect } from "chai";
import { CustomWorld } from "../../support/world";

When('navego al menu de {string}', async function (this: CustomWorld, linkText: string) {
  await this.page.getByRole('link', { name: linkText, exact: false }).click();
});

Then('veo un titulo que contiene {string}', async function (this: CustomWorld, expected: string) {
  const heading = this.page.locator('h1').first();
  await heading.waitFor();
  const text = await heading.innerText();
  expect(text).to.contain(expected);
});
