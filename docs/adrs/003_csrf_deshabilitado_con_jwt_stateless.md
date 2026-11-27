# [ADR 003] CSRF deshabilitado con autenticación JWT stateless

- Fecha de ultima actualización: 2026/11/27
- Autor: Nahuel Garbezza
- Participantes: Nahuel Garbezza
- Fecha de decisión: 2026/11/27

----

En el contexto de la issue [#291](https://github.com/10Pines/smart-open-space/issues/291) ("Enable csrf"), que pedía habilitar la protección CSRF en `SecurityConfig` del back, decidimos mantener `csrf.disable()` y documentar el motivo.

La API se autentica únicamente con el header `Authorization: Bearer <jwt>`. El front guarda el token en `localStorage` y lo agrega a mano en cada `fetch` (`front/src/helpers/api/api-client.js`). El back no emite ni lee cookies: la política de sesión es `STATELESS` y `formLogin` y `httpBasic` están deshabilitados. Un ataque CSRF necesita que el navegador adjunte credenciales por su cuenta, y eso ocurre con cookies, no con un header que JavaScript agrega explícitamente. Además, CORS limita los orígenes permitidos (`CorsProps` y `WebConfig`). Spring Security recomienda deshabilitar CSRF en APIs stateless con bearer token.

Descartamos habilitar CSRF con `CookieCsrfTokenRepository`: obliga a introducir una cookie con el token CSRF y a que el front mande `X-XSRF-TOKEN` en cada POST, PUT, PATCH y DELETE. Eso agrega código y superficie de ataque sin mejorar la seguridad actual, y complica a los clientes de la API que no son un navegador.

## Condición de revisión

**Si el token de sesión pasa a guardarse en una cookie (por ejemplo `httpOnly`, como alternativa a `localStorage`), CSRF pasa a ser obligatorio.** Ese cambio tiene que habilitar CSRF en el mismo PR y revisar este ADR. Es un punto a considerar en la issue [#268](https://github.com/10Pines/smart-open-space/issues/268) (Enhance Auth Security).

También hay que revisarlo si el back empieza a emitir cualquier otra cookie que autentique requests.
