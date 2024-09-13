
## :scroll: Documentación

### Diagrama de Arquitectura

#### Visualización del Open Space

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

