<h1 align="center">
  Smart Open Space
</h1>
<p align="center">
  <img src="/other/logo.svg" width="150" height="150" />
</p>
<p align="center">
  Organizá tu Open Space! :sunglasses:
</p>

<hr />

[![Heroku][heroku-badge]][heroku]
[![Build Status][build-badge]][build]
[![Issues][issues-badge]][issues]
[![Backlog][backlog-badge]][backlog]
[![License: GPLv3][license-badge]][license]

## 📖 Índice
- [👎 Problema](#-problema)
- [🏆 Solución](#-solución)
- [🎉 Diferencial](#-diferencial)
- [🔧 Instalación](#-instalación)
- [👮 Licencia](#-licencia)

## 👎 Problema
- Los asistentes de un Open Space no logran captar los datos de una charla, en la agenda se cambian de sala u horario, se superponen charlas del mismo tópico, y algunas salas suelen llenarse muy rápido.

## 🏆 Solución
- **Smart Open Space** es una web app que permite ver los datos de una charla por un proyector mientras su orador está
exponiendo, me ofrece una agenda actualizada y, optimizada por tópicos y agrupando las charlas muy requeridas en espacios más grandes.

## 🎉 Diferencial
- A diferencia del método actual, Pizarrón + Google SpreedSheet, el nuestro no requiere carga manual, se encuentra siempre actualizado, y sugiere optimizaciones inteligentes.

## 🔧 Instalación
### Antes de empezar, vas a necesitar:
  - [Git][git]
  - [JDK 8 update 60 o superior][java8] (Asegurate que la variable de entorno `JAVA_HOME` apunte a la carpeta `jdk1.8.0` que sacaste de la descarga del JDK).
  - [NodeJS][node]
  - [Yarn][yarn]

### Clonar el repo
```bash
git clone git@github.com:AugustoConti/smart-open-space.git
cd smart-open-space
```

### Levantar backend
```bash
cd back && ./gradlew bootRun
```

### Levantar frontend
```bash
cd front && yarn && yarn watch
```

## 👮 LICENCIA
- [GPLv3](LICENSE)

[backlog]: https://trello.com/b/A3IsSe1r/smartopenspace
[backlog-badge]: https://img.shields.io/badge/trello-backlog-blue?style=flat-square&logo=trello
[build]: https://travis-ci.org/AugustoConti/smart-open-space
[build-badge]: https://img.shields.io/travis/AugustoConti/smart-open-space?logo=travis&style=flat-square
[git]: https://help.github.com/set-up-git-redirect
[heroku]: https://smartopenspace.herokuapp.com
[heroku-badge]: https://img.shields.io/badge/heroku-deploy-ff69b4?style=flat-square&logo=heroku
[issues]: https://github.com/AugustoConti/smart-open-space/issues
[issues-badge]: https://img.shields.io/github/issues-raw/AugustoConti/smart-open-space?style=flat-square
[java8]: https://www.oracle.com/technetwork/java/javase/downloads/index.html
[license]: LICENCIA
[license-badge]: https://img.shields.io/github/license/AugustoConti/smart-open-space?style=flat-square
[node]: https://nodejs.org
[yarn]: https://yarnpkg.com/en/docs/install
