Feature: Funcionamiento correcto al Calcular
    Background:
        Given que entro en la pagina de datos meteorologicos

    Scenario: Render tras calcular con 1 estación y Anual
        When selecciono la estacion "Agost"
        And selecciono el periodo "anuales"
        And completo el rango de tiempo "2020 - 2025"
        And hago click en el boton "Calcular"
        Then se muestran las pestañas de resultados
