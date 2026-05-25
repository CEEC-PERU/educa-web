# Propuesta técnica: reestructuración de `content` tras la migración HTTP + Query

## Objetivo

Definir cómo reorganizar el módulo `content` ahora que la capa de acceso a datos ya empezó a consolidarse en `features/*` con `lib/http/*` y TanStack Query.

La pregunta central no es si conviene separar carpetas por rol por una preferencia estética. La pregunta correcta es esta:

1. qué parte del sistema representa dominio compartido
2. qué parte representa composición de UI por rol
3. qué parte representa reglas de acceso y capacidades

La propuesta de este documento es **no dividir el dominio de `content` por rol** como regla general. En cambio, conviene separar:

1. dominio compartido por recurso
2. UI reutilizable por flujo
3. páginas por rol
4. permisos y capacidades en una capa explícita

---

## Estado actual

Después de la migración de `content`, el repo ya tiene una señal arquitectónica clara:

```text
features/
  categories/
  courses/
  evaluations/
  flashcards/
  modules/
  navigation/
  professors/

pages/
  content/
    addCourse.tsx
    addFlashcard.tsx
    addModule.tsx
    addProfessor.tsx
    addSession.tsx
    category.tsx
    detailFlashcard.tsx
    detailModule.tsx
    detailProfessor.tsx
    editCourse.tsx
    editModule.tsx
    editSession.tsx
    flashcards.tsx
    module.tsx
    professors.tsx
    session.tsx
    evaluation/

components/
  Content/
    ActionButtons.tsx
    ButtonContent.tsx
    CardCourses.tsx
```

La parte relevante es esta:

1. el dominio ya no está viviendo principalmente en `pages/content/*`
2. los recursos principales ya quedaron modelados por feature
3. `pages/content/*` sigue siendo una superficie operativa y no una capa de dominio

Eso es una buena base. Si ahora se reestructura mal, se corre el riesgo de volver a fragmentar lo que se acaba de ordenar.

---

## Problema a resolver

El crecimiento a otros roles puede empujar a una decisión equivocada: copiar la estructura de `content` dentro de cada rol y terminar con variantes paralelas de cursos, módulos, evaluaciones y categorías.

Ejemplo de deriva que conviene evitar:

```text
features/
  content/
    courses/
  supervisor/
    courses/
  admin/
    courses/
```

Ese tipo de separación solo es conveniente si el mismo recurso deja de ser realmente el mismo recurso.

Si no se cumple esa condición, aparecen estos costos:

1. duplicación de API functions y query keys
2. invalidación de caché más frágil
3. bugs corregidos en un rol y olvidados en otros
4. ifs por rol repartidos entre hooks, services y pantallas
5. más costo al evolucionar el contrato del backend

---

## Decisión propuesta

### 1. Mantener el dominio por recurso, no por rol

`courses`, `modules`, `evaluations`, `categories`, `professors` y `flashcards` deben seguir viviendo como features compartidas.

Eso incluye:

1. `*.api.ts`
2. `*.query-keys.ts`
3. `*.queries.ts`
4. `*.mutations.ts`
5. tipos de variables o payloads de esa feature cuando aplique

La razón es simple: esos recursos siguen siendo conceptos del negocio, no conceptos del rol.

### 2. Mantener las pantallas por rol

Las páginas sí deben seguir separadas por rol en `pages/`.

Ejemplo:

```text
pages/
  content/
  supervisor/
  admin/
  corporate/
  student/
```

La separación por rol en `pages/` tiene sentido porque ahí sí cambian:

1. las rutas
2. la navegación
3. la composición visual
4. las acciones habilitadas
5. el flujo operativo

### 3. Extraer UI reutilizable fuera de `pages/content/*`

Si una tabla, card, formulario o bloque de detalle puede ser usado por más de un rol, no debe quedarse amarrado a `pages/content/*` ni a nombres demasiado específicos de un rol.

Conviene mover gradualmente esa UI a una capa compartida.

### 4. Separar permisos de fetch

Las diferencias por rol no deben resolverse duplicando queries salvo que el backend tenga contratos distintos. Lo correcto es modelar permisos o capacidades de forma explícita.

Ejemplos de capacidades:

1. `canCreateCourse`
2. `canEditModule`
3. `canDeleteFlashcard`
4. `canPublishEvaluation`

---

## Qué sí conviene separar por rol

Conviene separar por rol cuando lo que cambia es la experiencia operativa, no el recurso de dominio.

Esto sí debería quedarse por rol:

1. páginas en `pages/<role>/...`
2. layouts y navegación contextual
3. guards de acceso
4. decisiones de visibilidad
5. columnas o acciones específicas de una tabla
6. copy y estados vacíos orientados al caso de uso de cada rol

Ejemplo:

1. `content` puede ver acciones de crear, editar y borrar
2. `supervisor` puede ver detalle y seguimiento, pero no crear
3. `student` puede consumir, no administrar

En ese caso el recurso `course` sigue siendo uno solo. Lo que cambia es la capacidad del actor sobre ese recurso.

---

## Qué no conviene separar por rol, por ahora

No conviene abrir variantes por rol para estas capas mientras compartan contrato y comportamiento base:

1. API functions
2. query keys
3. query hooks
4. mutation hooks
5. normalización de errores
6. transporte HTTP

Ejemplo de lo que no conviene hacer todavía:

```text
features/
  supervisor-courses/
  admin-courses/
  content-courses/
```

Eso solo mueve la duplicación a otra carpeta.

---

## Arquitectura objetivo

### Capas recomendadas

```text
pages/<role>/...              Superficie por rol
  -> shared UI / role UI      Composición visual
    -> features/<resource>    Dominio remoto compartido
      -> lib/http             Infraestructura HTTP
```

### Estructura sugerida

```text
features/
  categories/
    categories.api.ts
    categories.query-keys.ts
    categories.queries.ts
    categories.mutations.ts
  courses/
    courses.api.ts
    courses.query-keys.ts
    courses.queries.ts
    courses.mutations.ts
  evaluations/
    evaluations.api.ts
    evaluations.query-keys.ts
    evaluations.queries.ts
    evaluations.mutations.ts
  flashcards/
    flashcards.api.ts
    flashcards.query-keys.ts
    flashcards.queries.ts
    flashcards.mutations.ts
  modules/
    modules.api.ts
    modules.query-keys.ts
    modules.queries.ts
    modules.mutations.ts
  professors/
    professors.api.ts
    professors.query-keys.ts
    professors.queries.ts
    professors.mutations.ts
  authorization/
    role-capabilities.ts
    useCapabilities.ts

components/
  resource-forms/
    CourseForm.tsx
    ModuleForm.tsx
    ProfessorForm.tsx
  resource-tables/
    CoursesTable.tsx
    ModulesTable.tsx
  resource-details/
    ModuleDetailPanel.tsx
    FlashcardDetailPanel.tsx
  content/
    ActionButtons.tsx
    ButtonContent.tsx
    CardCourses.tsx

pages/
  content/
    ...
  supervisor/
    ...
  admin/
    ...
  corporate/
    ...
  student/
    ...
```

La idea no es imponer exactamente esos nombres. La idea es fijar la responsabilidad de cada capa.

---

## Criterio de reutilización de componentes

La reestructuración de `content` no solo debe responder dónde vive el dominio. También debe definir **qué conviene compartir** a nivel de UI.

La regla general propuesta es esta:

1. compartir componentes semánticos por recurso
2. compartir primitives visuales por debajo
3. evitar componentes base demasiado abstractos cuando esconden más complejidad de la que resuelven

### Formularios

Sí conviene tener componentes como:

1. `CourseForm`
2. `ModuleForm`
3. `ProfessorForm`

Eso suele pagar bien porque alta y edición de un mismo recurso comparten:

1. campos
2. estructura visual
3. validaciones visuales
4. secciones repetidas
5. integración con uploads o inputs complejos

Lo que no conviene, salvo que exista un caso muy claro, es construir un `Form` universal para todo el sistema.

Un `Form` demasiado genérico suele terminar recibiendo demasiadas props:

1. `fields`
2. `mode`
3. `layout`
4. `schema`
5. `customSections`
6. `permissions`
7. `footerActions`

Cuando eso pasa, la abstracción deja de simplificar. Solo mueve la complejidad a un contenedor más opaco.

La recomendación para este repo es:

1. usar formularios semánticos por recurso arriba
2. reutilizar primitives abajo, por ejemplo `FormField`, `FormSection`, `FormActions`, `ImageUploadField`

### Tablas

Con tablas aplica la misma regla.

Sí conviene tener una base liviana compartida si resuelve estructura común, por ejemplo:

1. loading state
2. empty state
3. shell visual
4. estilos consistentes
5. slots para acciones o columnas personalizadas

Pero arriba de esa base, normalmente conviene conservar tablas semánticas por recurso:

1. `CoursesTable`
2. `ModulesTable`
3. `ProfessorsTable`
4. `EvaluationsTable`

No conviene forzar una `Table` universal si cada recurso cambia mucho en:

1. columnas
2. acciones
3. orden
4. formato de celdas
5. estados o filtros específicos

En ese caso, lo correcto es una composición en dos niveles:

1. una base visual mínima reutilizable
2. una tabla semántica por recurso

### Botones y acciones

Con botones también conviene distinguir dos niveles.

Sí conviene compartir primitives como:

1. `Button`
2. `IconButton`
3. `SubmitButton`
4. `ActionButtons`

Pero no conviene crear botones de negocio genéricos si solo cambian el texto.

Por ejemplo, un componente vale la pena si encapsula comportamiento o contrato de uso real. Si solo cambia la etiqueta, probablemente alcanza con una primitive más simple.

### Regla práctica

Usar esta heurística antes de extraer un componente compartido:

1. si representa un recurso o flujo real, hacerlo semántico
2. si resuelve interacción o presentación básica, hacerlo reusable y pequeño
3. si necesita demasiadas props o flags para servir a todos, no está listo para ser base compartida
4. si alta y edición comparten la mayor parte de la estructura, crear un formulario por recurso
5. si dos roles usan la misma pieza con diferencias menores, compartirla y resolver capacidades desde arriba

La consecuencia directa para esta propuesta es esta:

1. sí vale la pena tener `CourseForm`, `ModuleForm`, `ProfessorForm`
2. sí vale la pena tener una base liviana tipo `TableShell` o `DataTable` si resuelve estructura visual
3. no vale la pena introducir ahora un `Form` universal ni una `Table` universal para todo el sistema

---

## Regla de diseño recomendada

Usar esta regla práctica al crear o mover código:

### Si cambia el dato o su persistencia

Va a `features/<resource>`.

Ejemplos:

1. endpoint nuevo
2. query key nueva
3. mutation nueva
4. transformación estable del response
5. invalidación de caché

### Si cambia quién lo ve o cómo opera la pantalla

Va a `pages/<role>` o a componentes específicos del rol.

Ejemplos:

1. botón visible solo en `content`
2. tabla resumida para `supervisor`
3. breadcrumb distinto por contexto
4. layout o navegación por rol

### Si cambia solo la representación visual pero puede reutilizarse

Va a componentes compartidos.

Ejemplos:

1. formulario de curso
2. panel lateral de detalle de flashcard
3. tabla de profesores
4. modal de confirmación orientado a recurso

---

## Cómo aplicar esta reestructuración a `content`

### 1. No crear `features/content/*`

No hace falta envolver el dominio actual dentro de una carpeta `content`.

Eso solo agregaría profundidad sin mejorar la separación de responsabilidades.

### 2. Mantener `pages/content/*` como superficie operativa

`pages/content/*` debe contener sobre todo:

1. lectura de params de ruta
2. wiring de queries y mutations
3. estado local de UI
4. composición de componentes
5. navegación entre pantallas

### 3. Reducir el peso de cada página

Las páginas más grandes deben ir quedando como contenedores delgados.

Ejemplos claros dentro de `content`:

1. pantallas de detalle que mezclan listado, panel lateral, edición y borrado
2. formularios de alta/edición con mucha lógica visual
3. tablas con acciones repetidas entre vistas

La reducción de peso debería hacerse extrayendo componentes, no duplicando features.

### 4. Tratar `components/Content/*` como zona de transición

La carpeta actual `components/Content/` parece responder más al origen histórico del módulo que a una taxonomía estable.

No es necesario cambiarla en bloque ahora. Pero sí conviene establecer este criterio:

1. si el componente es exclusivo de `content`, puede quedarse ahí temporalmente
2. si empieza a usarse fuera de `content`, debe moverse a una carpeta compartida con nombre semántico

---

## Casos donde sí valdría la pena dividir por rol

Separar una misma feature por rol solo vale la pena si aparece una divergencia real y sostenida.

### Señales válidas

1. el backend expone endpoints distintos por rol para el mismo concepto
2. el shape del response cambia de forma relevante según rol
3. la misma entidad tiene lifecycle distinto según rol
4. los permisos alteran el flujo completo y no solo botones o vistas
5. empiezan a aparecer branches por rol dentro de casi todos los hooks y mutations

### Ejemplos plausibles

1. `student` consume progreso o material asignado con contratos distintos a `content`
2. `supervisor` trabaja con agregados operativos que no existen en `content`
3. `admin` gestiona catálogos globales con endpoints diferentes al flujo operativo

En esos casos no conviene forzar una unificación artificial.

---

## Heurística de decisión

Antes de abrir una variante por rol, responder estas preguntas:

1. ¿El recurso sigue siendo semánticamente el mismo?
2. ¿El backend expone el mismo contrato o casi el mismo?
3. ¿La diferencia está en la vista o en el dato?
4. ¿La divergencia es estable o incidental?
5. ¿La duplicación reducirá complejidad o solo la moverá de lugar?

Regla:

1. si 1, 2 y 3 apuntan a recurso compartido, mantener la feature compartida
2. si 2 y 3 cambian de forma estructural, evaluar feature específica por rol

---

## Propuesta de migración interna antes de PR 5

Antes de expandir a otros roles, conviene hacer una reestructuración acotada dentro de `content`.

### Fase 1. Congelar la frontera del dominio

Objetivo: declarar que `features/*` es la fuente oficial para datos remotos compartidos.

Criterios:

1. ninguna pantalla nueva en `content` agrega fetch manual si ya existe feature compartida
2. ninguna query key nueva nace dentro de una página
3. ninguna mutation nueva queda en `services/*` si el recurso ya tiene feature migrada

### Fase 2. Extraer UI repetida

Objetivo: adelgazar páginas sin alterar el dominio.

Candidatos típicos:

1. formularios reutilizables de alta y edición
2. tablas con acciones repetidas
3. paneles de detalle laterales
4. toolbars y encabezados de pantallas operativas

### Fase 3. Introducir capacidades por rol

Objetivo: preparar PR 5 sin clonar features.

Ejemplo:

```ts
export type RoleCapabilities = {
  canCreateCourse: boolean;
  canEditCourse: boolean;
  canDeleteCourse: boolean;
  canManageFlashcards: boolean;
};
```

Esto permite que una misma pantalla o componente compartido cambie acciones visibles sin romper la capa de datos.

### Fase 4. Recién después expandir a otros roles

Con el dominio horizontal y la UI más reusable, PR 5 puede enfocarse en superficies por rol en lugar de volver a discutir fetch, errores o caché.

---

## Decisiones cerradas

1. no conviene dividir el dominio de `content` por rol en esta etapa
2. `features/*` debe seguir siendo la capa de recursos compartidos
3. `pages/<role>/*` debe seguir siendo la superficie de composición por actor
4. la reutilización futura debe resolverse con componentes compartidos y capacidades, no con duplicación de queries
5. `components/Content/*` puede mantenerse como zona de transición, pero no como destino final universal

---

## Decisiones abiertas

Sí quedan decisiones abiertas de implementación. No bloquean la dirección arquitectónica, pero conviene cerrarlas antes de una refactorización más amplia.

### 1. Dónde ubicar la capa de capacidades por rol

Opciones razonables:

1. `features/authorization/`
2. `lib/auth/`
3. `context/` si se vuelve muy dependiente del usuario activo

Recomendación inicial:

1. `features/authorization/` si incluye lógica reutilizable de negocio
2. `lib/auth/` si solo serán helpers puros

### 2. Qué hacer con `components/Content/`

Opciones:

1. dejarla como está y solo mover componentes cuando se reutilicen
2. renombrarla gradualmente a una taxonomía semántica

Recomendación inicial:

No hacer un rename masivo ahora. Mover por oportunidad real de reutilización para evitar churn innecesario.

### 3. Cuándo extraer componentes desde páginas grandes

No toda página grande necesita desarmarse de inmediato.

Criterio sugerido:

extraer cuando se cumpla al menos una de estas condiciones:

1. supera un tamaño difícil de mantener
2. mezcla más de una responsabilidad visual clara
3. una pieza empieza a repetirse en otra página o rol
4. la prueba manual de cambios se vuelve costosa por acoplamiento visual

### 4. Cuánto conviene abstraer formularios, tablas y botones

La dirección general ya está definida: conviene reutilizar por semántica de recurso y por primitives pequeñas, no mediante componentes universales demasiado configurables.

Lo que queda abierto no es la dirección, sino el punto exacto de corte en cada caso:

1. cuándo un formulario merece volverse `CourseForm` o `ModuleForm`
2. cuándo una tabla necesita una base compartida adicional
3. cuándo `ActionButtons` debe seguir como primitive y cuándo conviene una variante más semántica

Recomendación inicial:

1. extraer primero formularios semánticos por recurso donde ya exista alta y edición
2. introducir una base de tabla solo cuando haya al menos dos tablas con estructura visual realmente común
3. evitar por ahora componentes universales con demasiados flags

### 5. Si algunos recursos terminarán requiriendo variantes por rol

Esto no está cerrado todavía para `supervisor`, `student` o `corporate` porque depende de contratos y flujos reales.

La decisión correcta no es anticiparlo de forma abstracta. La decisión correcta es observar PR 5 y abrir variantes solo si aparece divergencia estructural.

---

## Riesgos si se reestructura mal

### 1. Separar por rol demasiado pronto

Duplica dominio que hoy sigue siendo compartido.

### 2. Mover demasiado a shared sin criterio

Termina creando componentes genéricos ambiguos y difíciles de mantener.

### 3. Mezclar permisos con fetch

Hace que una misma query tenga ramas por rol cuando el problema real es de UI o autorización.

### 4. Reestructurar nombres sin beneficio operativo

Un rename masivo de carpetas puede generar mucho ruido de diff con poco retorno.

---

## Criterios de éxito

La reestructuración puede considerarse correcta si se cumple lo siguiente:

1. agregar un rol nuevo no obliga a duplicar una feature completa
2. cambiar un endpoint o contrato de `courses`, `modules` o `evaluations` exige tocar una sola feature compartida
3. las pantallas por rol siguen siendo simples contenedores de composición
4. los permisos y capacidades no se resuelven con branches repartidos por toda la capa de datos
5. la expansión a PR 5 ocurre sin reabrir la discusión sobre HTTP, errores o caché

---

## Recomendación final

Para este repo, la estrategia más sólida es esta:

1. mantener `features/*` por dominio compartido
2. mantener `pages/*` por rol
3. extraer UI reutilizable desde `content` cuando aparezca necesidad real
4. introducir una capa explícita de capacidades por rol antes de expandir a otros módulos
5. abrir variantes por rol solo cuando el contrato o el lifecycle del recurso realmente diverjan

La conclusión es clara: **sí conviene reestructurar `content`, pero no partiéndolo por rol en la capa de dominio**.

La reestructuración correcta es por responsabilidades.
