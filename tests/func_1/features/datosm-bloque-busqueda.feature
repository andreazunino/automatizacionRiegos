Feature: Funcionamiento correcto del bloque de búsqueda de datos meteorológicos
  Background:
    Given que entro en la página de datos meteorológicos

  Scenario: Carga correcta de los elementos
    Then la página debería cargar correctamente
    And debería ver las opciones de "provincias"
    And debería ver las opciones de "estado"
    And debería ver el desplegable de "estaciones"
    And debería ver el botón "Eliminar selección"

  Scenario: Con estado "Todas", mostrar todas las provincias
    When hago click en estado "Todas"
    And despliego las estaciones
    Then debo ver todas las estaciones

  Scenario: Seleccionar estación
    When despliego las estaciones
    And selecciono la estación "Agost"
    Then "Agost" debe aparecer como seleccionada

  Scenario: Eliminar todas las estaciones seleccionadas
    When despliego las estaciones
    And selecciono la estación "Pedralba"
    And hago click en el botón "Eliminar selección"
    Then debe quitar todas las selecciones de estaciones