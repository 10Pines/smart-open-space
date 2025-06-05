
# :scroll: Documentación

## Índice
- [:scroll: Documentación](#scroll-documentación)
  - [Índice](#índice)
  - [Architecture Decision Records (ADRs)](#architecture-decision-records-adrs)
  - [Métricas](#métricas)
  - [Set up Container](#set-up-container)
  - [Performance tests](#performance-tests)
  - [Automatización de despliegues](#automatización-de-despliegues)
  - [Diagramas de Arquitectura](#diagramas-de-arquitectura)
  - [Documentación Legacy](#documentación-legacy)
    - [Visualización del Open Space](#visualización-del-open-space)
    - [Casos de uso](#casos-de-uso)
      - [Entrega 1](#entrega-1)
      - [Entrega 2](#entrega-2)
      - [Entrega 3](#entrega-3)
      - [Entrega 4](#entrega-4)

## Architecture Decision Records (ADRs)

- [001 - ID de nuevas entidades de dominio](/docs/adrs/001_id_nuevas_entidades_dominio.md)
- [002 - Automatización y gestión de despliegues](/docs/adrs/002_automatizacion_y_gestion_de_despliegues.md)

## Métricas

[Guia Métricas del backend](/docs/metrics/metrics-backend.md) para consultar por API (actuator) y/o configurar métricas en el backend.

## Set up Container

[Guía set up containers/docker](/docs/container/README.md) para configurar la aplicación de smart-open-space con todas las herramientas de observabilidad utilizando docker-compose.

## Performance tests

[Sección de performance tests](/docs/performance_test/README.md)

## Automatización de despliegues

[Sección de automatización de despliegues - Kamal](/docs/kamal/README.md)

## Diagramas de Arquitectura

- Diagrama actual de docker-compose containers

![Architecture diagram with docker compose container running](/docs/assets/sos_architecture_diagram.drawio.png)

---
## Documentación Legacy

### Visualización del Open Space

![Diagrama de arquitectura](/docs/other/Arquitectura.png)

- Frontend:
  - **App.js**: Punto de entrada de la aplicación.
  - **Routes**: Detecta la ruta, y elige qué componente que corresponde renderizar.
  - **OpenSpace.js**: Renderiza la pantalla con los datos del Open Space.
  - **os-client.js**: Conseguir los datos del Open Space, conectandose con el backend.
- Backend:
  - **OpenSpaceController**: Exponer los endpoints del OpenSpaceService, como REST-Json.
  - **OpenSpaceService**: Exponer un servicio para manipular un Open Space.
  - **OpenSpaceRepository**: Persistir y recuperar objetos OpenSpace de la base de datos.
  - **OpenSpace**: Objeto que representa un Open Space.

### Casos de uso
#### Entrega 1
![Caso de uso entrega 1](/docs/other/CasoDeUso.png)
- Organizador:
  - **Crear Open Space**: Nombre, fecha, horarios y salas.
- Orador:
  - **Registro / Login**: Registrarse con nombre, email y contraseña. Loguearse con email y contraseña
  - **Cargar charla**: con título y descripción en un Open Space.
  - **Agendar charla**: en una sala y un horario disponible en el Open Space.
- Asistente:
  - **Ver agenda**: con todas las charlas en su horario y sala de un Open Space.
  - **Ver detalle de charla**: Título, descripción, orador, sala y horario.

#### Entrega 2
![Caso de uso entrega 2](/docs/other/CasoDeUso2.png)
- Organizador:
  - **Iniciar Marketplace**: Habilitar encolamiento de los oradores para poder exponer su charla.
  - **Mostrar modo proyección**: Mientras orador expone, mostrar datos de su charla.
- Orador:
  - **Encolarse para exponer**: Ponerse en la fila, para exponer su charla.

#### Entrega 3
![Caso de uso entrega 3](/docs/other/CasoDeUso3.png)
- Organizador:
  - **Finalizar Marketplace**: Deshabilitar encolamiento para que no se puedan agendar más charlas.
- Orador:
  - **Ingresar con mail**: Ingresar a la app solo con email y nombre.

#### Entrega 4
![Caso de uso entrega 4](/docs/other/CasoDeUso4.png)
- Organizador:
  - **Crear Open Space** (modificado): Cargar estructura de slots (charla - otro).
  - **Gestionar charlas**: Cargar, encolar y agendar charlas de cualquier orador.
  - **Intercambiar charlas**: de cualquier orador a otra sala y horario.

