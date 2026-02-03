# Performance Test

Los tests de performance estan basados con la herramienta [Artillery](https://www.artillery.io/).

## Reportes

Los reportes de los archivos de pruebas se guardarán en el directorio `/artillery/reports/<nombre-test>`.

Los siguientes reportes están disponibles (actualizar esta tabla si se agregan reportes nuevos):

| Fecha (dd-MM-yyyyThh:mm) | Nombre de test | Descripción | Reportes disponibles |
|---|---|---|---|
| 29-01-2026T03:30Z | [prod-low-load-test](artillery/prod-low-load-test.yml) | Pruebas de carga básicas para la instancia productiva de SOS | [report.json](artillery/reports/prod-low-load-test/report_29_01_2026_00_30_prod-low-load-test.json) |
| 30-01-2026T00:00Z | [prod-low-load-csv-test](artillery/prod-low-load-csv-test.yml) | Prueba de carga básicas para prod con CSV balanceado de OpenSpace ids | [report.json](artillery/reports/prod-low-load-csv-test/report_30_01_2026_01_53.json) |

## Guía de ejecución de tests de performance

En la carpeta artillery, se encuentran archivos preconfigurados para ejecutar para los tests de performance con artillery. Es necesario instalar las dependencias y además artillery de forma global para ejercutarlos por comando.

### Docker

- Requiere docker instalado.

- Estar en la carpeta raíz del proyecto y ejecutar el comando:
```bash
docker run --rm -it -v ${PWD}:/repo artilleryio/artillery:latest run /repo/docs/performance_test/artillery/<test-file>.yml
```

Ejemplo:
```bash
docker run --rm -it -v ${PWD}:/repo artilleryio/artillery:latest run /repo/docs/performance_test/artillery/low-load-test.yml
```

### Local

- Requiere node 24.x
- Estar en la carpeta raíz del proyecto.

#### Ejecutar test sin reporte
```bash
artillery run ./docs/performance_test/artillery/<test-file>.yml
```

Ejemplo:
```bash
artillery run ./docs/performance_test/artillery/low-load-test.yml
```

#### Ejecutar test con reporte local (JSON report)

```bash
artillery run --output tp_report.json ./docs/performance_test/artillery/low-load-test.yml
```

#### Ejecutar test con reporte cloud en Artillery
- Require una API_KEY donde esta es proveída en una cuenta en Artillery. 

```bash
artillery run ./docs/performance_test/artillery/low-load-test.yml --record --key <YOUR_API_KEY>
```

Una vez ejecutado, se imprimira un URL para visualizar el reporte. [Ejemplo de reporte (el mismo URL de abajo)](https://app.artillery.io/share/sh_c3c75baadbe7bc4a150ed05b1cb1bbed925ef7e593ef9631f0f15474cd51fe7a)

```
https://app.artillery.io/share/sh_c3c75baadbe7bc4a150ed05b1cb1bbed925ef7e593ef9631f0f15474cd51fe7a
```

**CUIDADO**: Este reporte es temporal. Se recomienda exportarlo en formato JSON o PDF (en el mismo enlace te permite exportarlo) para guardarlo a largo plazo.

### Datos de entrada (input)

En el directorio `./artillery/data`, se guardarán los archivos de entrada (input) que se utilizan para las pruebas de performance con artillery. Estos archivos dependen de si son requeridos en los tests. Por lo general, son archivos `.csv`.

Archivos disponibles:
- [Archivo CSV de ids de Open Spaces que existen (exist_openspace_ids.csv)](artillery/data/exist_openspace_ids.csv)
- [CSV de ids balanceados (openspace_ids_balanced.csv)](artillery/data/openspace_ids_balanced.csv)