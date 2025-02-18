# Container

Esta sección es para construir y ejecutar rápidamente la aplicación con contenedores / docker.

### Herramientas

- Back-app
- Postgres
- Pgadmin (UI client for postgress)
- Prometheus
- Grafana
- Front-app :construction: \<WIP> 


### Guía

Observación: Cada vez que actualicemos la aplicación o su codigo fuente, debemos reconstruir las imagenes del backend y frontend para tener su ultima versión.

1. Construir la imagen del back a partir de su Dockerfile:
```bash
docker build -t sos-back .
```

2. Revisar variables de entorno (env vars), como `PORT`, `SPRING_PROFILE`, `DB_PORT`, donde van a configurarse en los contenedores en el archivo [`docker-compose.yml`](/docs/container/docker-compose.yml).

3. Revisar que no tengamos una instancia local del servicio ejecutando o algun puerto ocupado de la configuración anterior. Luego, ejecutamos el comando:
```bash
docker-compose -p 'sos-full-app' up -d --build
```

4. Servicios disponibles:

- Backend app server: `localhost:8080` (example: [ping url](http://localhost:8080/ping))
- Postgresql db: `localhost:6543`
- [Pgadmin](http://localhost:8888): `localhost:8888`
    - email: postgres@asd.com
    - password: postgres

- Grafana:
- Prometheus: 
- Frontend app server: :construction:

Observación: Los puertos pueden varias en base a la configuración establecida.