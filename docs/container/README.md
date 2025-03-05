# Container

Esta sección es para construir y ejecutar rápidamente la aplicación con contenedores / docker.

### Herramientas

- SOS-Front
- SOS-Back
- Postgres
- Pgadmin (UI client for postgress)
- Prometheus
- Grafana
- Node-exporter
- Alertmanager
- Blackbox (health-checker)


#### WIP :construction:
- Promptail
- Cadvisor
- Tempo 
- Loki 
- Otel
- Zipkin




### Guía

Observación: Cada vez que actualicemos la aplicación o su codigo fuente, debemos reconstruir las imagenes del backend y frontend para tener su ultima versión.

1. Construir dockerfile Back

Estar en el directorio root del repositorio. Luego, ejecutar:

```bash
./gradlew clean && ./gradlew build -x check
```

Despues ejecutar:

```bash
cd back && docker build -t sos-back .
```

2. Construir dockerfile Front

Estar en el directorio root del repositorio. Luego, ejecutar:
```bash
cd front && docker build -t sos-front .
```

3. Revisar variables de entorno (env vars), como `APP_PORT`, `SPRING_PROFILE`, `DB_PORT`, donde van a configurarse en los contenedores en el archivo [`docker-compose.yml`](/docs/container/docker-compose.yml).

4. Revisar que no tengamos una instancia local del servicio ejecutando o algun puerto ocupado de la configuración anterior. Luego, ejecutamos el comando en el root del proyecto:
```bash
docker-compose -p 'sos-full-app' up -d --build
```

5. Servicios disponibles:

- [Frontend app server](http://localhost:1234): `localhost:1234` 
- Backend app server: `localhost:8081` (example: [ping url](http://localhost:8081/ping))
- Postgresql db: `localhost:6543`
- [Pgadmin](http://localhost:8888): `localhost:8888`
    - email: postgres@asd.com
    - password: postgres

- [Grafana (integración con Prometheus, Loki y Tempo)](http://localhost:3000) `localhost:3000`
    - user: admin
    - pass: admin
- [Prometheus](http://localhost:9090)

Observación: Los puertos pueden variar en base a la configuración establecida.