Feature: Funcionamiento correcto al Calcular
    Background:
        Given que entro en la pagina de datos meteorologicos

    Scenario Outline: Render tras calcular con varias estaciones y ANUAL
        When selecciono las estaciones <estaciones>
        And selecciono el periodo "anuales"
        And completo el rango de tiempo "2020 - 2025"
        And hago click en el boton "Calcular"
        Then se muestran las pestañas de resultados

    Examples:
        | estaciones                       |
        | Agost                            |
        | Agost, Benavites                 |
        | Agost, Benavites, Burriana       |
        | Agost, Benavites, Burriana, Puig |

