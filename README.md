<h1 align="center">
  Smart Open Space 
</h1>
<p align="center">
  <img src="/docs/other/logo.svg" width="150" height="150" />
</p>
<p align="center">
  Organizá tu Open Space! :sunglasses:
</p>

<hr />

[![Heroku][heroku-badge]][heroku]
[![Build Back Status][build-back-badge]][build-back]
[![Build Front Status][build-front-badge]][build-front]
[![Dependabot Status][dependabot-badge]][dependabot]
[![Backlog][backlog-badge]][backlog]
[![License: GPLv3][license-badge]][license]
[![Issues][issues-badge]][issues]

## :book: Índice
- [:-1: Problema](#-1-problema)
- [:trophy: Solución](#trophy-solución)
- [:tada: Diferencial](#tada-diferencial)
- [:wrench: Instalación](#wrench-instalación)
- [:scroll: Documentación](#scroll-documentación)
- [:computer: Demo](#computer-demo)
- [:cop: Licencia](#cop-licencia)

## :-1: Problema
En una primera versión atacamos el siguiente problema: Los asistentes de un Open Space no logran captar los datos de una charla, en la agenda se cambian de sala u horario, se superponen charlas del mismo tópico, y algunas salas suelen llenarse muy rápido.
En esta segunda, buscamos construir la mínima herramienta que permita gestionar un Open Space virtual con tracks/votaciones y que se desarrolle múltiples días.

## :trophy: Solución
- **Smart Open Space** es una web app que permite gestionar la organización de un open space. Soporta la creación de un open space con multiples tracks que se desarrolla en múltiples días. Los asistentes pueden votar las charlas más populares. Soporta la gestión del marketplace (oradores se encolan para pitchear su charla. El organizador puede proyectar la charla que se está pitcheando). Las charlas pueden ser agendadas por el organizador (en caso que no haya marketplace) o los oradores.

## :tada: Diferencial
- Herramienta gratis y open-source que permite gestionar tanto el envio de charlas como la creación de la agenda.

## :wrench: Instalación
### Antes de empezar, vas a necesitar:
  - [Git][git]
  - [PostgreSQL][postgresql] o Docker
  - [Java 21 / JDK 21][java] (Asegurate que la variable de entorno `JAVA_HOME` apunte a la carpeta del jdk que sacaste de la descarga del JDK).
  - [NodeJS][node]

### Descargar el código fuente
```sh
git clone git@github.com:10PinesLabs/smart-open-space.git
cd smart-open-space
```

### Levantar backend

#### Con Docker:
```sh
docker-compose up
```
Esto va a generar una carpeta `./db-data` con el volumen.

#### Sin docker, con postgreSQL local
Crear la base de datos, ejemplo:
```sh
psql -c 'create database SOS;' -U postgres
```

#### Config
- Crear el archivo `application-default.properties` en la ruta `/back/src/main/resources/`. Configurando url, usuario y contraseña:

Si usaste Docker, el puerto y las credenciales serian:
```groovy
spring.datasource.url=jdbc:postgresql://localhost:6543/sos
spring.datasource.username=openminded
spring.datasource.password=openheart
```

Si usas postgresql directo:
```groovy
spring.datasource.url=jdbc:postgresql://localhost:5432/sos
spring.datasource.username=postgres
spring.datasource.password=root
```

Ademas para ambos casos hay que agregar al final:
```groovy
logging.appender.email.username=""
logging.appender.email.password=""
logging.appender.email.to=""
```

#### Ejecucion
```sh
cd back && ./gradlew bootRun
```

### Levantar frontend
Asegurate de tener la version de node correspondiente (revisar .tool-versions):
```sh
cd front && nvm use
```


Para instalar dependencias y levantar el proyecto:
```sh
npm install && npm run watch
```

### Flyway plugin

Util para realizar diferentes acciones de Flyway como migrations, repairs de checksums de los archivos de migración, etc.

Requiere configurar las siguientes environments:
  - `JDBC_DATABASE_URL`: url del jdbc.
  - `JDBC_DATABASE_USERNAME`: username de la db.
  - `JDBC_DATABASE_PASSWORD`: password de la db.

Ejemplo:

```text
JDBC_DATABASE_URL=jdbc:postgresql://localhost:6543/sos
JDBC_DATABASE_USERNAME=openminded
JDBC_DATABASE_PASSWORD=openheart
```

## :scroll: Documentación

[Ir a documentación](/docs/README.md)

## :computer: Demo
[![Youtube demo][demo-prev]][demo-link]

## :cop: LICENCIA
- [GPLv3](LICENSE)

[backlog]: https://trello.com/b/A3IsSe1r/smartopenspace
[backlog-badge]: https://img.shields.io/badge/trello-backlog-blue?style=flat-square&logo=trello
[build-back]: https://github.com/10Pines/smart-open-space/actions/workflows/ci-backend.yml
[build-back-badge]: https://github.com/10Pines/smart-open-space/actions/workflows/ci-backend.yml/badge.svg
[build-front]: https://github.com/10Pines/smart-open-space/actions/workflows/ci-frontend.yml
[build-front-badge]: https://github.com/10Pines/smart-open-space/actions/workflows/ci-frontend.yml/badge.svg
[demo-link]:https://www.youtube.com/watch?v=cm3D5IztoL0
[demo-prev]:https://img.youtube.com/vi/cm3D5IztoL0/0.jpg
[dependabot]: https://dependabot.com
[dependabot-badge]: https://api.dependabot.com/badges/status?host=github&repo=10Pines/smart-open-space
[git]: https://help.github.com/set-up-git-redirect
[heroku]: https://smartopenspace.herokuapp.com
[heroku-badge]: https://img.shields.io/badge/heroku-deploy-ff69b4?style=flat-square&logo=heroku
[issues]: https://github.com/10Pines/smart-open-space/issues
[issues-badge]: https://img.shields.io/github/issues-raw/10Pines/smart-open-space?style=flat-square
[java]: https://www.oracle.com/technetwork/java/javase/downloads/index.html
[license]: LICENCIA
[license-badge]: https://img.shields.io/github/license/AugustoConti/smart-open-space?style=flat-square
[node]: https://nodejs.org
[postgresql]: https://www.postgresql.org/download/
