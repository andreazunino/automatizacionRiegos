Feature: Seleccion de periodo y fechas
  Background:
    Given que entro en la pagina de datos meteorologicos
    And selecciono la estacion "Agost"

  Scenario: Calculo semihorario con rango de fechas
    When selecciono el periodo "horarios"
    And completo el rango de tiempo "01/11/2020 - 01/12/2025"
    Then el campo dias horarios muestra "1857"

  Scenario: Calculo personalizado con rango de fechas
    When selecciono el periodo "diarios"
    And completo el rango de tiempo "01/11/2020 - 01/12/2025"
    Then el campo dias personalizados muestra "1857"

  Scenario: Calculo semanal con rango de fechas
    When selecciono el periodo "semanales"
    And completo el rango de tiempo "01/11/2020 - 01/12/2025"
    Then el campo dias semanales muestra "1857"

  Scenario: Calculo mensual con rango de fechas
    When selecciono el periodo "mensuales"
    And completo el rango de tiempo "01/2020 - 12/2025"
    Then el campo meses muestra "72"

  Scenario: Calculo anual con rango de fechas
    When selecciono el periodo "anuales"
    And completo el rango de tiempo "2020 - 2025"
    Then el campo anos muestra "6"

  Scenario: Calculo anual y visualizacion de grafica
    When selecciono el periodo "anuales"
    And completo el rango de tiempo "2020 - 2025"
    And hago click en Calcular
    Then se muestra la grafica de temperatura

  Scenario: Resetear limpia todos los filtros de periodo
    When selecciono el periodo "anuales"
    And completo el rango de tiempo "2020 - 2025"
    And hago click en Resetear
    Then los campos de periodo quedan limpios
