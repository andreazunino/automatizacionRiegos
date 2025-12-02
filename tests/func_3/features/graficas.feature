Feature: Visualizacion de graficas
    Background:
        Given que entro en la pagina de datos meteorologicos
        And selecciono la estacion "Agost"
        And selecciono el periodo "horarios"
        And completo el rango de tiempo "01/11/2020 - 01/12/2025"
        And hago click en Calcular

    Scenario Outline: Visualizacion de la grafica <tipo>
        When espero la grafica de "<tipo>"
        Then se muestra la grafica "<tipo>"

    Examples: 
        | tipo |
        | temperatura |
        | precipitacion |
        | velocidad_viento |
        | direccion_viento |
        