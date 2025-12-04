Feature: Visualizacion de graficas
    Scenario: Grafica de temperatura muestra los datos consultados
        Given que entro en la pagina de datos meteorologicos
        And hago click en estado "Activas"
        And selecciono la estacion "Agost"
        And selecciono el periodo "anuales"
        And completo el rango de tiempo "2020 - 2025"
        And hago click en Calcular
        And hago click en la pestaña de temperatura de la grafica
        When espero la grafica de "temperatura"
        Then se visualiza la grafica de "temperatura"

    

    
        
