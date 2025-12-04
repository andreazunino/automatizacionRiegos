Feature: Funcionamiento correcto del bloque de busqueda de datos meteorologicos
  Background:
    Given que entro en la pagina de datos meteorologicos

  Scenario: Carga correcta de los elementos
    Then la pagina deberia cargar correctamente
    And deberia ver las opciones de "provincias"
    And deberia ver las opciones de "estado"
    And deberia ver el desplegable de "estaciones"
    And deberia ver el boton "Eliminar seleccion"

  Scenario: Con estado "Todas", mostrar todas las provincias
    When hago click en estado "Todas"
    And despliego las estaciones
    Then debo ver todas las estaciones

  Scenario: Seleccionar estacion
    When despliego las estaciones
    And selecciono la estacion "Agost"
    Then "Agost" debe aparecer como seleccionada

  Scenario: Eliminar todas las estaciones seleccionadas
    When despliego las estaciones
    And selecciono la estacion "Pedralba"
    And hago click en el boton "Eliminar seleccion"
    Then debe quitar todas las selecciones de estaciones

  Scenario: Con estado "Activas", mostrarlas provincias Activas
    When hago click en estado "Activas"
    And despliego las estaciones
    Then debo ver las estaciones Activas

  Scenario: Cuando provincias "Alicante", mostrar estaciones Alicante
    When hago click en provincias "Castellon"
    And hago click en provincias "Valencia"
    And despliego las estaciones
    Then debo ver las estaciones "Alicante"

  Scenario: Cuando provincias "Castellon", mostrar estaciones Castellon
    When hago click en provincias "Alicante"
    And hago click en provincias "Valencia"
    And despliego las estaciones
    Then debo ver las estaciones "Castellon"

  Scenario: Cuando provincias "Valencia", mostrar estaciones Valencia
    When hago click en provincias "Castellon"
    And hago click en provincias "Alicante"
    And despliego las estaciones
    Then debo ver las estaciones "Valencia"

  Scenario: Quitar una estación desde la cruz
    When despliego las estaciones
    And selecciono la estacion "Agost"
    And quito la estacion "Agost" desde la cruz
    Then "Agost" no debe aparecer como seleccionada

  Scenario: Seleccionar 4 estaciones
    When despliego las estaciones 
    And selecciono la estacion "Agost"
    And selecciono la estacion "Benavites"
    And selecciono la estacion "Catral"
    And selecciono la estacion "Cheste"
    Then "Agost" debe aparecer como seleccionada
    And "Benavites" debe aparecer como seleccionada
    And "Catral" debe aparecer como seleccionada
    And "Cheste" debe aparecer como seleccionada
