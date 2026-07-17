# Smart Open Space — Ops

## Repos
- 10Pines/smart-open-space (repo canónico; hay un remote `upstream` hacia `AugustoConti/smart-open-space` que es un fork, no usar como target de operaciones)

## CI / Builds
- rama vigilada / base: `main`
- workflows relevantes: `Backend CI`, `Frontend CI`, `CodeQL`, `CD App`

## Dependencias
- tipos automergeables: `patch`, `minor` (siempre con CI en verde)
- `major` siempre se escala a revisión humana
- requisito de checks: CI en verde (sin pendientes) en `Backend CI` / `Frontend CI` según corresponda
- agrupación: un solo PR

## Seguridad
- tope de auto-fast-lane: hasta `high` inclusive (con CI verde)
- `critical` siempre se escala a decisión humana, incluso con CI verde
- overrides (siempre escalar): ninguno declarado
- severidades a destacar en el digest: `critical`, `high`

## Ambientes
- production:
  - health: https://smartopenspace-10pines.herokuapp.com/actuator/health

## Despliegue
- production:
  - plataforma: heroku
  - app: smartopenspace-10pines

Nota: el repo también tiene soporte para Kamal (ver `docs/kamal/`), pero hoy no está en uso para deploys reales — la plataforma vigente es Heroku.
