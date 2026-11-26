# Tests E2E (Playwright)

Suite de regresión que ejercita la app real en un navegador: el front (Vite, puerto 1234) contra el back
(Spring Boot, puerto 8080) con H2 en memoria y sin Flyway, igual que los tests del back. No necesita
Docker ni Postgres.

## Correr

```bash
cd front
npx playwright install chromium   # una sola vez
npm run test:e2e                  # levanta back y front solos si no están corriendo
npm run test:e2e:ui               # modo interactivo
```

- Si ya tenés el back en `:8080` y el front en `:1234`, Playwright los reutiliza (fuera de CI), lo que acelera
  mucho la iteración. El front debe apuntar al back con `VITE_API_URL=http://localhost:8080`.
- Para usar el Chrome instalado en vez del Chromium de Playwright: `PW_CHANNEL=chrome npm run test:e2e`.
- Un solo spec o test: `npm run test:e2e -- projector.spec.js -g "socket"`.
- En CI (`.github/workflows/ci-e2e.yml`) el reporte HTML y las trazas de los tests que fallan se suben como
  artefacto `playwright-report`. Localmente: `npx playwright show-report` y `npx playwright show-trace <trace.zip>`.

## Qué cubre

| Spec | Flujos |
| --- | --- |
| `auth.spec.js` | redirect a login sin sesión, registro, login OK y con error (toast), recuperación de contraseña, ruta inexistente |
| `navigation.spec.js` | visitante en un open space, "Proponé una charla!" → login/registro → vuelta al open space, rutas protegidas, toast de error de la API |
| `open-space.spec.js` | home, abrir un open space, convocatoria, editar/"Cancelar", alta/"Cancelar", agenda, manual y design system |
| `talks.spec.js` | cargar/crear/editar una charla, validación del eje, detalle y "Volver", agendar una charla en sala y horario |
| `projector.spec.js` | marketplace, proyector vacío, charla encolada, contador de 30", "Siguiente" y actualización en vivo por socket |

## Convenciones

- **Cada test arma su propio estado por API** (`support/api.js`) con usuarios de email único, así que corren
  en paralelo contra la misma instancia del back y no dependen del orden. La UI se ejercita en el test, no en el setup.
- Para entrar con sesión iniciada: `login(usuario)` (fixture). Para probar el login en sí, usar la UI.
- Fixtures en `support/fixtures.js`: `api`, `organizer`, `speaker`, `openSpace`, `login`.
- Preferir selectores por rol/texto (la app está en español). Los botones de sólo ícono llevan `a11yTitle`
  para poder seleccionarlos (`Editar open space`, `Abrir proyector`, …).
- `test.fixme` marca bugs conocidos con el motivo en un comentario; al arreglarlos, quitar el `fixme`.
