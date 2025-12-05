Feature: Funcionamiento correcto al Calcular
    Background:
        Given que entro en la pagina de datos meteorologicos

    Scenario Outline: Render tras calcular con varias estaciones y distintos periodos
        When selecciono las estaciones <estaciones>
        And selecciono el periodo "<periodos>"
        And completo el rango de tiempo <tiempo>
        And hago click en el boton "Calcular"
        Then se muestran las pestañas de resultados

    Examples: Anuales
    | estaciones                         | periodos | tiempo        |
    | Agost                              | anuales  | "2020 - 2025" |
    | Agost, Benavites                   | anuales  | "2020 - 2025" |
    | Agost, Benavites, Burriana         | anuales  | "2020 - 2025" |
    | Agost, Benavites, Burriana, Sagunt | anuales  | "2020 - 2025" |

    Examples: Horarios
    | estaciones                         | periodos  | tiempo                    |
    | Agost                              | horarios  | "01/11/2020 - 01/12/2025" |
    | Agost, Benavites                   | horarios  | "01/11/2020 - 01/12/2025" |
    | Agost, Benavites, Burriana         | horarios  | "01/11/2020 - 01/12/2025" |
    | Agost, Benavites, Burriana, Sagunt | horarios  | "01/11/2020 - 01/12/2025" |

    Examples: Diarios
    | estaciones                         | periodos | tiempo                    |
    | Agost                              | diarios  | "01/11/2020 - 01/12/2025" |
    | Agost, Benavites                   | diarios  | "01/11/2020 - 01/12/2025" |
    | Agost, Benavites, Burriana         | diarios  | "01/11/2020 - 01/12/2025" |
    | Agost, Benavites, Burriana, Sagunt | diarios  | "01/11/2020 - 01/12/2025" |

    Examples: Semanales
    | estaciones                         | periodos  | tiempo                    |
    | Agost                              | semanales | "01/11/2020 - 01/12/2025" |
    | Agost, Benavites                   | semanales | "01/11/2020 - 01/12/2025" |
    | Agost, Benavites, Burriana         | semanales | "01/11/2020 - 01/12/2025" |
    | Agost, Benavites, Burriana, Sagunt | semanales | "01/11/2020 - 01/12/2025" |

    Examples: Mensuales
    | estaciones                         | periodos  | tiempo              |
    | Agost                              | mensuales | "01/2020 - 12/2025" |
    | Agost, Benavites                   | mensuales | "01/2020 - 12/2025" |
    | Agost, Benavites, Burriana         | mensuales | "01/2020 - 12/2025" |
    | Agost, Benavites, Burriana, Sagunt | mensuales | "01/2020 - 12/2025" |

