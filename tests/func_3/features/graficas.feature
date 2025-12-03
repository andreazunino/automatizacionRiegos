Feature: Visualizacion de graficas
    Background:
        Given que entro en la pagina de datos meteorologicos
        And selecciono la estacion "Agost"
        And selecciono el periodo "horarios"
        And completo el rango de tiempo "01/11/2020 - 01/12/2025"
        And hago click en Calcular

    Scenario: Grafica de temperatura muestra los datos consultados
        When espero la grafica de "temperatura"
        Then la grafica de temperatura muestra los datos consultados para "Agost"

    Scenario: Tabla de temperatura muestra los datos consultados
        When espero la tabla de "temperatura"
        Then la tabla de temperatura muestra los datos consultados para "Agost"

    Scenario: Descarga grafica de temperatura en PNG
        When descargo la grafica de temperatura en formato "png"
        Then la descarga de la grafica de temperatura en "png" es correcta

    
        
