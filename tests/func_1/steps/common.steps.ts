import { Given } from "@cucumber/cucumber";
import { CustomWorld } from "../../support/world";

Given('que abro el sitio {string}', async function (this: CustomWorld, url: string) {
  await this.page.goto(url);
});
