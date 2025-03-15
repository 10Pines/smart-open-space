# Performance Test

Los tests de performance estan basados con la herramienta [Artillery](https://www.artillery.io/).

## Ejecución de tests de performance

En la carpeta artillery, se encuentran archivos preconfigurados para ejecutar para los tests de performance con artillery. Es necesario instalar las dependencias y además artillery de forma global para ejercutarlos por comando.

### Docker

0. Requiere docker.
1. Estar en la carpeta raíz del proyecto.
2. Dirigirse a la carpeta de performance_test:
```bash
cd ./docs/performance_test
```
3. Ejecutar el comando:
```bash
docker run --rm -it -v ${PWD}:/repo artilleryio/artillery:latest run /repo/docs/performance_test/artillery/<test-file>.yml
```

Ejemplo:
```bash
docker run --rm -it -v ${PWD}:/repo artilleryio/artillery:latest run /repo/docs/performance_test/artillery/low-load-test.yml
```

### Local

0. Requiere node 22.x
1. Estar en la carpeta raíz del proyecto.
2. Dirigirse a la carpeta de performance_test:
```bash
cd ./docs/performance_test
```
3. Ejecutar el comando:
```bash
artillery run artillery/<test-file>.yml
```

Ejemplo:
```bash
artillery run artillery/low-load-test.yml
```

4. Ejecutar test con reporte

- Json report
```bash
artillery run --output tp_report.json artillery/low-load-test.yml
```

- Artillery cloud report (require API_KEY). Una vez ejecutado, se imprimira un URL para visualizar el reporte.
```bash
artillery run artillery/low-load-test.yml --record --key <YOUR_API_KEY>
```

[Execution url example](https://app.artillery.io/share/sh_6f861ae8b732f8de905e7cfb80e559c88929ea2c2ff0bdafb7c640ff0b386d85)