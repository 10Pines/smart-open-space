# Container

Esta sección es para construir y ejecutar rápidamente la aplicación con contenedores / docker, y utilizar el ecosistema de observabilidad y monitoreo de prometheus-grafana.

Se tomo como base este repositorio con su configuración: [github.com/Einsteinish/Docker-Compose-Prometheus-and-Grafana](https://github.com/Einsteinish/Docker-Compose-Prometheus-and-Grafana)

- [Grafana - Guía general](/docs/container/grafana/README.md)
- [Grafana - Guía de configuracion de alertas (ejemplo: apdex)](/docs/container/grafana/alerts/README.md)

### Herramientas

- **SOS-Front**: aplicación frontend.
- **SOS-Back**: aplicación backend.
- **Postgres**: base de datos.
- [**Prometheus**](https://prometheus.io/): Software para monitorear y alertar eventos. Persiste métricas en una time serie database (TSDB) alimentándose por llamadas HTTP. Posee queries flexibles y alertas en tiempo real. Este recopila dichas métricas utilizando la técnica “scrape”.
- [**Grafana**](https://grafana.com/): Aplicación web para visualizar analíticas, trazas, diagramas y gráficos. También, puede manejar alertas relacionados con los diagramas. Posee una fácil integración con Prometheus, Loki y Tempo.
- [**Node-exporter**](https://github.com/prometheus/node_exporter): Es una library de Prometheus que sirve para recolectar y exportar datos de infraestructura del host de docker.
- [**Blackbox (health-checker)**](https://github.com/prometheus/blackbox_exporter): Es una herramienta de Prometheus que en general permite sondear servicios utilizando HTTP, HTTPS, DNS; TCP y ICMP. Utilizado para obtener Liveness probe de los servicios.
- [**Postgres-exporter**](https://github.com/prometheus-community/postgres_exporter)
- [**Cadvisor**](https://github.com/google/cadvisor): Recolecta métricas de infraestructura de los contenedores que están corriendo de Docker. Es una library provista por google.
- [**Alertmanager**](https://github.com/prometheus/alertmanager): Es una herramienta de Prometheus. Recibe alertas de Prometheus, las gestiona y las envía a distintos canales (Slack, email, Discord, Webhooks, Telegram, etc).
- [**Promtail**](https://grafana.com/docs/loki/latest/send-data/promtail/): Servicio que se encarga de extraer logs de los contenedores que posean un label arbitrario y establecido por el equipo (en nuestro caso, el label es “logging: promtail”). Es un agente que le provee los logs a la instancia privada de Loki Grafana. Se deja pendiente la migración a Grafana Alloy.
- [**Loki**](https://grafana.com/docs/loki/latest/): Sistema de log aggregation provisto por Grafana y permite realizar queries a los logs.
- **Pgadmin**: cliente de base de datos postgres (opcional).


### Guía - set up

Observación: Cada vez que actualicemos la aplicación o su codigo fuente, debemos reconstruir las imagenes del backend y frontend para tener su ultima versión.

1. **[opcional]** Construir Dockerfile Back

    ```bash
    cd back && docker build -t sos-back .
    ```

2. **[opcional]** Construir Dockerfile Front

   - Estar en el directorio root del repositorio. Luego, ejecutar:

    ```bash 
    cd front && docker build --build-arg API_URL=http://localhost:8081 -t sos-front .
    ```


   - **Observaciones**: 
     - En caso de error, borrar carpetas temporales `node_modules` y `build`.
     - `API_URL` es el host y puerto donde se va a ejecutar el back.

3. Revisar variables de entorno (env vars), como `APP_PORT`, `SPRING_PROFILE`, `DB_PORT`, donde van a configurarse en los contenedores en el archivo [`docker-compose.yml`](/docs/container/docker-compose.yml).

4. Revisar que no tengamos una instancia local del servicio ejecutando o algun puerto ocupado de la configuración anterior. Luego, ejecutamos el comando en el directorio root del proyecto:
    ```bash
    docker-compose -p 'sos-full-app' up -d --build
    ```

5. Servicios principales disponibles:


| Servicio                                        | Endpoint                                     |
| ----------------------------------------------- | -------------------------------------------- |
| Frontend app server                             | [localhost:1234](http://localhost:1234)      |
| Backend app server                              | [localhost:8081](http://localhost:8081/ping) |
| Postgresql db                                   | localhost:6543                               |
| Pgadmin (user=postgres@asd.com, pass= postgres) | [localhost:8888](http://localhost:8888)      |
| Grafana (user=admin, pass=admin)                | [localhost:3000](http://localhost:3000)      |
| Prometheus                                      | [localhost:9090](http://localhost:9090)      |


   - **Observaciónes**: 
     - Los puertos pueden variar en base a la configuración establecida.
     - Existen mas servicios disponibles, pero son internos e integradores a Grafana y Prometheus.