# Contribuir a smart-open-space

¡Gracias por tu interés en contribuir! Este documento resume las convenciones y acuerdos para que el flujo sea consistente y fácil de mantener.

Última actualización: 2025-09-15

## 1. Principios

- Preferimos claridad sobre exhaustividad: pocos labels bien reutilizados.
- Evitamos duplicar semántica entre Issue Type (Feature / Task / Enhancement / Bug) y labels.
- Máximo recomendado: 2 labels de área + (opcional) 1 label de tipo adicional si agrega valor.
- Idioma consistente (minúsculas, sin acentos en los nombres de labels para facilitar búsqueda CLI).
- Descripciones de issues con foco en valor y criterios claros.

## 2. Issue Types (GitHub)

Usamos los Issue Types nativos para clasificar el "qué" principal:

| Issue Type   | Cuándo usarlo |
|--------------|---------------|
| Feature      | Nueva capacidad visible para el usuario final. |
| Enhancement  | Mejora perceptible de algo existente (refinamiento visual/UX, ajuste menor) sin introducir un concepto nuevo. |
| Task         | Trabajo de soporte: instrumentación, configuración, integración, deuda técnica, plumbing. |
| Bug          | Comportamiento incorrecto respecto a lo esperado. |

Regla práctica:  
- "Ahora puedo hacer algo nuevo" → Feature.  
- "Funciona / se ve mejor" → Enhancement.  
- "No se ve pero habilita / mantiene" → Task.  
- "Rompe lo esperado" → Bug.

## 3. Labels

Se dividen en grupos principales. No abuses de ellos: priorizamos reutilización.

### 3.1. Área / Dominio (`area:*`)

| Label           | Uso |
|-----------------|-----|
| area:ui         | Cambios en interfaz / presentación. |
| area:analytics  | Métricas, eventos, tracking. |
| area:agenda     | Lógica, visuales o mejoras específicas de la agenda. |
| area:sharing    | Funcionalidad de compartir / Web Share / links. |
| area:infra      | Infraestructura, base técnica, plataforma (usar solo si aplica realmente). |

### 3.2. Tipo adicional (`tipo:*`) (Opcional)

| Label        | Uso |
|--------------|-----|
| tipo:mejora  | Cuando no podemos (o aún no queremos) usar Issue Type Enhancement pero queremos marcar una mejora incremental. |
| tipo:refactor (si se crea) | Cambios internos sin modificar comportamiento observable. |

Estos son opcionales; si el Issue Type ya comunica la idea, omitir.

### 3.3. Meta / Estado (solo si aparece necesidad futura)

(No crear hasta que realmente se use con disciplina)

| Label            | Uso |
|------------------|-----|
| needs:design     | Falta definición visual/interacción antes de implementar. |
| needs:discussion | Requiere alineación / decisión. |

## 4. Normas de Asignación Rápida

Al crear un issue:
1. Elegir Issue Type correcto.
2. Agregar 1–2 `area:*` (solo las que realmente correspondan).
3. Agregar `tipo:mejora` solo si:
   - No usamos Enhancement como Issue Type y
   - Queremos diferenciar de una Feature nueva.
4. No usar labels para estados (in progress, done) — se gestionan con Projects / board.

Checklist mental:
- ¿Se ve nuevo? → Feature.
- ¿Se ve igual pero mejorado? → Enhancement.
- ¿No se ve? → Task.
- ¿Rompe lo esperado? → Bug.

## 5. Migración de Labels Antiguos (Histórico)

Labels que se consideran obsoletos / a eliminar:
- `feature` (duplicado del Issue Type Feature).
- `enhancement` (si adoptamos Issue Type Enhancement).
- `CambioVisual` (reemplazado por `area:ui`).
- `técnica` / `tecnica` (casos van a `area:infra`).

## 6. Script de Migración (Referencia)

Existe un script sugerido para migrar labels (ver PR asociado o pedirlo si no está):
`scripts/label_migration.sh`

Uso:
```bash
# Simulación
DRY_RUN=1 ./scripts/label_migration.sh
# Aplicar
DRY_RUN=0 ./scripts/label_migration.sh
```

Al finalizar y antes de borrar labels viejos: validar que no queden issues asociados.

## 7. Ejemplos

Ejemplo 1: "Agregar toggle de vista compacta"  
- Issue Type: Feature  
- Labels: area:ui, area:agenda  

Ejemplo 2: "Instrumentar eventos de filtros y favoritos"  
- Issue Type: Task  
- Labels: area:analytics  

Ejemplo 3: "Mejorar jerarquía visual agenda"  
- Issue Type: Enhancement  
- Labels: area:ui, area:agenda  

Ejemplo 4 (hipotético): "Refactorizar módulo de persistencia de sesiones"  
- Issue Type: Task  
- Labels: area:infra (opcional tipo:refactor si existe)  

Ejemplo 5 (Bug): "El toggle de vista compacta no persiste al refrescar"  
- Issue Type: Bug  
- Labels: area:ui, area:agenda  

## 8. Revisión Periódica

Cada 1–2 meses:
1. Listar labels existentes: `gh label list -R owner/repo`.
2. Detectar labels sin uso (0 issues abiertos + cerrados) o con muy baja utilización.
3. Eliminar los que no aporten segmentación analítica real.
4. Revisar que nuevos issues sigan la convención.

## 9. Buenas Prácticas de Descripción de Issues

Estructura recomendada:
1. Contexto (por qué).
2. Objetivo (1–2 frases).
3. Criterios de aceptación (bullets concretos).
4. Consideraciones técnicas (si aplica).
5. Métrica / impacto (si aplica).

Ejemplo:
```
Contexto: Los usuarios no pueden compartir charlas rápidamente.
Objetivo: Permitir compartir charla vía Web Share API con tracking UTM.
Criterios:
- Botón "Compartir" visible en cada charla.
- Usa Web Share API si está disponible; fallback: copiar link.
- Agrega parámetros UTM (?utm_source=app&utm_medium=share).
Impacto: Incrementar difusión y medir fuentes externas.
```

## 10. Dudas / Cambios

Si algo no encaja:
- Crear issue con label `needs:discussion` (si existe), o
- Abrir un PR modificando esta guía.

---

Gracias por mantener la consistencia. Cualquier mejora a esta guía es bienvenida.