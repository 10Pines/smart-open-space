# [ADR 002] Automatización y gestión de despliegues

- Fecha de ultima actualización: 2025/05/05
- Autor: Jose Cassano
- Participantes: Nahuel Garbezza y Jose Cassano
- Fecha de decisión: 2025/05/05

----

En el contexto de elegir e implementar una tecnología para automatizar y gestionar los despliegues, enfrentando la necesidad de tener una herramienta simple de usar y flexible con cualquier proveedor de servicio o infraestructura.

Ante este escenario, decidimos utilizar Kamal y descartamos opciones como Docker Swarm y Kubernetes. 

La decisión se basa en tener una herramienta eficiente, altamente portable, facil de implementar y mantener.

Aceptamos como consecuencia sacrificar la escalabilidad y flexibilidad para entornos multi-cloud o infraestructura más compleja.

Esta elección se justifica porque Kamal se alinea estrechamente con tecnologías web, tiene una curva de aprendizaje mínima y sirve para cualquier infraestructura que posea un entorno ejecutable de Docker.


## Cuadro comparativo

| Característica                           | **Kamal**                          | **Docker Swarm**             | **Kubernetes**                                |
| ---------------------------------------- | ---------------------------------- | ---------------------------- | --------------------------------------------- |
| **Modelo de despliegue**                 | Imperativo                         | Declarativo                  | Declarativo                                   |
| **Escalabilidad**                        | Baja                               | Media                        | Muy alta                                      |
| **Complejidad de configuración**         | Muy baja                           | Media                        | Alta                                          |
| **Preparación previa del servidor**      | SSH y Docker                       | Requiere configuración Swarm | Requiere instalación y configuración compleja |
| **Curva de aprendizaje**                 | Baja                               | Media                        | Alta                                          |
| **Visibilidad de procesos**              | Alta (usa comandos Docker simples) | Moderada                     | Baja (controladores y reconciliadores opacos) |
| **Portabilidad entre entornos**          | Total                              | Parcial                      | Parcial (requiere mucho esfuerzo)             |
| **Soporte para múltiples lenguajes**     | Total (usa Docker)                 | Total (usa Docker)           | Total (usa Docker o containerd)               |
| **Requisitos para correr en on-premise** | Bajos                              | Bajos                        | Altos                                         |
| **Costo de migración entre plataformas** | Ninguno                            | Bajo                         | Alto                                          |

