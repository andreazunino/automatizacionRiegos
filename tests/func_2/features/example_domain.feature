Feature: Validar sitio de ejemplo
  Para tener un caso rapido
  Quiero abrir una pagina estable
  Y validar su contenido principal

  Scenario: Capturar pagina de comunidad
    Given que abro el sitio "https://playwright.dev/community/welcome"
    Then la pagina muestra el encabezado "Welcome"
    And guardo una captura llamada "community-welcome"
