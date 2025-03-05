# Métricas backend

## Contenido

- [Introducción](#introducción)
- [¿Cómo agregar una metrica?](#cómo-agregar-una-métrica)
- [¿Cómo visualizar las métricas?](#cómo-visualizar-las-métricas)

## Introducción

Para las métricas de la aplicación del lado del backend, tendremos spring boot actuator junto a micrometer. Además, tenemos a prometheus como registry de las metricas (base de datos timeseries) para luego ser consumidas por alguna aplicación de visualización y monitoreo.

Se dividió la métricas en dos grupos de métricas y van a poseer dichos prefijos:

- Metricas de performance: `server_request`
- Métricas de negocio: `sos_business`

Un ejempo de métrica de performance sería: `server_request_some_sdk_some_client`

Un ejemplo de métrica de negocio sería: `sos_business_user_register`


## ¿Cómo agregar una métrica?


Para agregar una metrica, debemos crear nuestra clase y annotations en el package `com.sos.smartopenspace.aspect.metrics`. La annotation debe ser siempre creada para que sea por cada caso en particular, pero la clase se puede reutilizar en base a la relación que posea con la entidad o caso de uso, por ejemplo la clase `UserMetricAspects` puede contener todo lo que tenga relación con metricas al usuario o casos de usos relacionados. Una vez, creada dichas clases debemos implementarlas en los métodos que quisieramos medir.


Dejamos un ejemplo de como deberían ser la annotation y los métodos de aspectos, usando el caso de medición registro de usuarios:

```kotlin
@Target(AnnotationTarget.FUNCTION)
@Retention(AnnotationRetention.RUNTIME)
annotation class UserRegisterMetric
```

Despues, dentro de la clase `UserMetricAspects` agregaremos los métodos utilizando el `ObservationMetricHelper` como dependencia:

```kotlin
@Around("@annotation(com.sos.smartopenspace.aspect.metrics.UserRegisterMetric)")
    fun observeAroundUserRegisterMetric(joinPoint: ProceedingJoinPoint): Any? {
        // En este punto, se puede agregar en los KeyValues los tags que se desean agregar
        //  siempre y cuando sean de baja cardinalidad.
        val defaultEmptyTags = KeyValues.of(
            TAG_ERROR_NAME, TAG_EMPTY_VALUE,
            TAG_ERROR_CODE, TAG_EMPTY_VALUE,
            TAG_ERROR_MESSAGE, TAG_EMPTY_VALUE,
        )
        return observationMetricHelper.observeBusinessChecked<Any, Throwable>(
            USER_REGISTER_METRIC,
            defaultEmptyTags,
            joinPoint::proceed
        )
    }

@AfterThrowing(
    value = "@annotation(com.sos.smartopenspace.aspect.metrics.UserRegisterMetric)",
    throwing = "ex"
)
fun observeAfterThrowingUserRegisterMetric(ex: Exception) {
    val tags = mutableMapOf(
        TAG_ERROR_NAME to TAG_EMPTY_VALUE,
        TAG_ERROR_CODE to TAG_EMPTY_VALUE,
        TAG_ERROR_MESSAGE to TAG_EMPTY_VALUE,
    )
    when (ex) {
        is BadRequestException -> {
            tags[TAG_ERROR_NAME] = "invalid_client_request"
            tags[TAG_ERROR_CODE] = HttpStatus.BAD_REQUEST.value().toString()
            tags[TAG_ERROR_MESSAGE] = getAtMaxWidthOrEmptyValueIfBlankOrNull(ex.message)
        }
    }
    observationMetricHelper.addMetricTags(tags.toMap())
}

```

Por ultimo, agregamos la annotation en el método donde vamos a realizar la medición:

```kotlin
    ...

    @UserRegisterMetric
    override fun register(newUser: User): AuthSession {
        ...
    }
    
    ...
```


## ¿Cómo visualizar las métricas?

En spring boot, poseemos spring boot actuator que nos disponibiliza endpoints de consulta de métricas. Para ello, deberíamos consultar con el siguiente request para:

- Ver todas las métricas (el puerto puede cambiar):

```bash
curl --location 'http://localhost:8080/actuator/metrics'
```


- Ver una métrica en particular:

```bash
curl --location 'http://localhost:8080/actuator/metrics/server_request'
```

- Filtrar dentro de una métrica en particular:

```bash
curl --location 'http://localhost:8080/actuator/metrics/server_request?tag=uri%3A%2FopenSpace%2F%7Bid%7D'
```