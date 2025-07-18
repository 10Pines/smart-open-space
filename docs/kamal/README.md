# Automatización de despliegues - Kamal

Actualmente, smart-open-space soporta kamal 2. Sin embargo, requiere de una personalización dependiendo de los servidores y herramientas que se requieran utilizar para su despliegue. 

[Documentación oficial de kamal](https://kamal-deploy.org/docs/installation/)

## Introducción CD (Despligue Continuo)

En este proyecto, se tienen dos jobs para poder realizar el CD de la aplicación dentro de un mismo github action workflow:
- [CD App](/.github/workflows/cd-app.yml)

Los jobs se llaman en el siguiente orden:
 1. `deploy_back` dedicado a construir la imagen del servicio back y desplegarla en el servidor
 2. `deploy_front` dedicado a construir la imagen del servicio front y desplegarla en el servidor. 

Tambien, existen dos github variables para activar/desactivar el CD de cada servicio:
- `IS_ENABLE_KAMAL_CD_BACK` si es igual a `true`, entonces permitira ejecutar el job.
- `IS_ENABLE_KAMAL_CD_FRONT` si es igual a `true`, entonces permitira ejecutar el job.

:warning: En caso de errores al desplegar con kamal, existen dos github actions ejecutables manualmente para ejecutar comandos a demanda:
- [Workflow manual para el server back](/.github/workflows/kamal-back-command.yml)
- [Workflow manual para el server front](/.github/workflows/kamal-back-command.yml)

Posibles casos de error (revisar previamente guía de kamal con sus configuraciones y recomendaciones, y su documentación oficial):

| Caso                                       | Solución                                  | Posible comando solución           | Causas                                                                                                                                                                                                                   |
| ------------------------------------------ | ----------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Error de lock                              | Ejecutar un lock release                  | kamal lock release | Errores inesperados o se rompe el pipeline de CD                                                                                                                                                                         |
| No existen el proxy ni los accesorios de los servicios | Ejecutar kamal setup                      | kamal setup      | Puede deberse a ser un servidor nuevo, o bien, tener un accesorio nuevo. Tener cuidado con kamal setup que intenta recrear un kamal proxy nuevo (si ya existe uno, puede romper el comando). n el caso de requerir solo los accesorios revisar comandos de kamal accessory                               |
| No levanta el servicio / deploy timeout    | Liberar recursos (memoria principalmente) | N/A                | Al no poseer recursos la aplicación no puede levantar correctamente. Aca se puede liberar recursos, o bien, brindar mas memoria al servidor. Esto siempre descartando que no sea un error introducido a nivel aplicación o usuario |

## Guía manual y de configuraciónes 

### Requisitos minimos
- Tener un ambiente de ruby (o sino usando Docker [docs info](https://kamal-deploy.org/docs/installation/dockerized/) teniendo funcionalidades limitadas).
- Tener las SSH keys configuradas en los servidores y usuarios a utilizar para realizar los despliegues automatizados. Estos usuarios van a ser utilizados en el `deploy.yml` para realizar la conexión (el default es root).
- Tener Docker instalado tanto en el servidor/ambiente que realiza el despliegue como en el servidor a desplegar.
- Tener un container registry (ejemplo: dockerhub) con un usuario y token para poder acceder. Esto es requerido para realizar el push y pull de las imagenes de los servicios a desplegar. Se debe configurar las siguientes variables de entorno: 
  - `$KAMAL_REGISTRY_USERNAME` con el nombre de usuario de acceso al container registry.
  - `$KAMAL_REGISTRY_PASSWORD` con el token secreto de acceso perteneciente del usuario al container registry.

### Requisitos opcionales
- Es altamente recomendado tener los hostnames de los dominios configurados con algun DNS y listos para usar. Esto es para utilizar HTTPS en los servicios. Kamal utiliza "Let's encrypt" si esta habilitada su propiedad "ssl". Sino se puede realizar con HTTP.

### Pasos (seguir en orden)

1. Si se ejecuta con Docker, se puede ignorar este paso. Sino, instalar kamal globalmente en el sistema que va a realizar el despliegue.

    ```bash
    gem install kamal
    ```

2. Ir al directorio del servicio a desplegar (back/front) y configurar las variables de entorno de los secrets que se requieren utilizar (eliminar o agregar en caso de ser necesario):
   - `./back/.kamal/secrets`
   - `./front/.kamal/secrets`

    **ADVERTENCIA**: usar siempre las variables del sistema o algun gestor de contraseñas/secrets compatible con kamal como 1password (revisar documentación oficial para configurarlo).

    **RECOMENDACIÓN**: se pueden leer los archivos `./back/config/.env.sample` y `./front/config/.env.sample` para tener un template de las variables de entorno (envs) que se deben configurar en el host de despliegue con algunos valores de ejemplo. Se recomienda cambiar los valores en la información sensible (contraseñas, usuarios, etc).


3. Personaliza el archivo de despligue `deploy.yml` con las siguientes propiedades:

   - `ssh.user`: usuario de conexión SSH.
   - `ssh.port`: puerto SSH de conexión (por defecto `22`).
   - `servers.web`: lista de IPs de los servidores donde desplegar el servicio.
   - `registry`: configuración del registro de contenedores.
   - `env.clear`: diccionario de variables de entorno en texto plano (no debe contener datos sensibles).
   - `env.secret`: lista de claves en modo secreto (se buscan en el archivo `./kamal/secrets`).
   - `accessories`: servicios adicionales a instanciar junto con el servicio principal (opcional). Pueden ser base de datos, etc.
   - `builder`: argumentos para usar al construir el Dockerfile del servicio. En el caso del front, existen dos `args`:
     - `API_URL`: Necesario para especificar el host o ip donde va a estar deployado el back.
     - `SKIP_HTTPS_IPS`: Es opcional. Son ips o hostnames para evitar realizar el redireccionamiento a HTTPS automatico. Útil para realizar pruebas o ambientes bajos.
   - `proxy`: configuración de kamal-proxy, incluyendo SSL (`ssl`), puerto de la app (`app_port`), ruta de healthcheck (`healthcheck.path`), nombre de host (`host`), entre otros.

    Consulta la [documentación oficial de Kamal](https://kamal-deploy.org/docs/installation/) para más opciones e información. Tambien, se pueden tener multiple archivos `deploy.<ambiente>.yml` por ambiente, consultar la documentación para configurarlo adecuadamente.

4. Si es la primera vez ejecutando kamal en el servidor, ejecutar el comando:

    ```bash
    kamal setup
    ```

    Esto ejecutará en orden:
   - Se conecta a los servidores a través de SSH (usando root por defecto, autenticado con tu clave SSH).  
   - Se instala Docker en cualquier servidor que no lo tenga (usando get.docker.com): se requiere acceso root vía SSH (o en el usuario configurado sin password).
   - Se inicia sesión en el container registry tanto localmente como de forma remota.  
   - Se construye la imagen usando el Dockerfile en el root del servicio.  
   - Se hace un push de la imagen al container registry.  
   - Se hace un pull de la imagen desde el container registry en los servidores.
   - Se asegura de que kamal-proxy esté en ejecución y acepte tráfico en los puertos 80 y 443.
   - Se inicia un nuevo contenedor con la versión de la aplicación que coincida con el hash de la versión actual de Git.  
   - Se indica a kamal-proxy que redirija el tráfico al nuevo contenedor una vez que responda con `200 OK` en el health check endpoint configurado.  
   - Se detiene el contenedor antiguo que ejecuta la versión anterior de la aplicación.
   - Se limpia las imágenes sin usar y los contenedores detenidos para evitar que los servidores se llenen.


5. Si ya se ejecutó el comando `kamal setup`, se debe utilizar el siguiente comando para evitar errores indeseados (crear otra vez kamal proxy y algunos accessories):

    ```bash
    kamal deploy 
    ```

    O bien, con una version especifica:
    ```bash
    kamal deploy --version=<new-version>
    ```

    Se pueden ver mas opciones de comandos en la [documentación oficial de Kamal](https://kamal-deploy.org/docs/installation/).


6. (EXTRA) Si existen problemas con el CORS, revisar si los hostnames estan presentes en las `application.properties` del back (se puede configurar por ENV si se usa el profile `kamal`).

```yaml
app.cors.allowed.methods=GET,POST,PUT,PATCH,DELETE,OPTIONS
app.cors.allowed.origins=http://localhost:1234,...,https://smartopenspace.10pines.com
app.cors.allowed.socket-origins=http://localhost:1234,...,https://smartopenspace.10pines.com
```

Si se desea usar HTTP, se debe agregar la IP / hostname en el listado de ENV del deploy.yml del ./front `SKIP_HTTPS_IPS`.