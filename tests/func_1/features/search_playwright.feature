Feature: Buscar informacion sobre Playwright
  Como usuario curioso
  Quiero visitar el sitio de Playwright
  Para validar que la documentacion esta disponible

  Scenario: Abrir el sitio oficial
    Given que abro el sitio "https://playwright.dev"
    When navego al menu de "Docs"
    Then veo un titulo que contiene "Playwright"
