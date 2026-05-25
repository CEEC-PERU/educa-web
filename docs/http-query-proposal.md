# Propuesta técnica: unificación de capa HTTP + TanStack Query

## Objetivo

Definir una estrategia incremental para resolver dos problemas actuales del frontend:

1. La aplicación tiene más de un punto de entrada HTTP y patrones de consumo inconsistentes.
2. El estado remoto (`data`, `loading`, `error`) se resuelve manualmente en muchas pantallas.

La propuesta busca llevar el proyecto a una base más mantenible y enterprise usando:

- un cliente HTTP único
- contratos de acceso por dominio
- TanStack Query como capa estándar de server state
- migración gradual, sin big bang

---

## Problema actual

### 1. Dos clientes HTTP y uso mixto de axios

Actualmente conviven al menos estos puntos de entrada:

- `services/axios.ts`
- `services/api.ts`
- múltiples servicios que importan `axios` directo

Esto genera varios problemas:

- configuración duplicada
- `baseURL` inconsistente
- headers de autenticación armados manualmente en varios archivos
- manejo de errores dispar
- más de una forma de hacer exactamente lo mismo

### 2. URLs completas en `Endpoints.ts`

Hoy `utils/Endpoints.ts` expone URLs absolutas construidas con `baseURL`.

Eso acopla demasiado la definición del endpoint con la infraestructura HTTP. En la práctica, cada servicio queda parcialmente responsable del transporte.

### 3. Server state manejado manualmente en páginas

Hay páginas y hooks con este patrón repetido:

- `useEffect` para disparar fetch
- `useState` para `data`
- `useState` para `loading`
- `useState` para `error`
- `Promise.all` local en la pantalla

Eso aparece tanto en hooks genéricos como `useDataLoader` como en pantallas de `pages/content/`.

Consecuencias:

- duplicación de lógica
- re-fetches no coordinados
- falta de caché compartida
- invalidación manual después de mutaciones
- UX inconsistente en carga y error

---

## Principios de diseño

La solución propuesta sigue estos principios:

1. Un único cliente HTTP para toda la aplicación.
2. La autenticación se resuelve en infraestructura, no en cada servicio.
3. Los servicios de dominio deben ser funciones puras de acceso a datos.
4. TanStack Query debe ser la capa oficial de server state.
5. El estado de UI local no debe mezclarse con server state.
6. La migración debe ser incremental y de bajo riesgo.

---

## Arquitectura objetivo

### Capas

```text
UI (pages/components)
  -> query hooks / mutation hooks
    -> api functions por dominio
      -> cliente HTTP único
        -> backend
```

### Responsabilidades por capa

#### 1. Cliente HTTP único

Responsable de:

- `baseURL`
- headers comunes
- token `Authorization`
- interceptores
- normalización de errores
- comportamiento estándar ante `401`

#### 2. API functions por dominio

Responsables de:

- llamar endpoints concretos
- tipar request/response
- devolver `data`
- no contener lógica de UI

Ejemplos:

- `courses.api.ts`
- `categories.api.ts`
- `evaluations.api.ts`

#### 3. Query hooks / Mutation hooks

Responsables de:

- caché
- invalidación
- retries
- stale time
- estados `isLoading`, `isError`, `isSuccess`

#### 4. UI

Responsable de:

- renderizado
- formularios
- modales
- loaders visuales
- toasts / alertas

La UI no debe orquestar manualmente el fetch remoto salvo casos excepcionales.

---

## Cliente HTTP unificado

### Decisión

Reemplazar `services/axios.ts` y `services/api.ts` por una sola instancia, por ejemplo:

- `lib/http/client.ts`

La infraestructura HTTP compartida vivirá en `lib/http`, y la organización funcional del consumo de datos quedará por dominio dentro de `features/`.

### Responsabilidades del cliente

Debe resolver de forma centralizada:

- `baseURL` manteniendo la convención actual del proyecto
- header `Authorization` usando el token actual
- timeouts
- errores de red
- parsing, normalización y adaptación de errores del backend hacia `AppError`
- comportamiento estándar ante `401`: logout automático, limpieza de sesión, redirección y notificación global

### Ejemplo de estructura

```ts
import axios from "axios";
import { baseURL } from "@/utils/Endpoints";

export const http = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});
```

### Beneficios

- una sola política de auth
- una sola política de errores
- una sola política de transporte
- menos duplicación
- más trazabilidad operativa

---

## Replanteo de `Endpoints.ts`

### Estado actual

`utils/Endpoints.ts` construye URLs completas con `baseURL`.

### Decisión

Mantener `utils/Endpoints.ts` como está actualmente durante esta iniciativa. La prioridad no será reescribir los endpoints, sino unificar el transporte, la autenticación y el manejo de server state.

### Nota de migración

Los endpoints absolutos actuales convivirán con la nueva capa HTTP. El refactor de endpoints queda fuera del alcance inmediato de esta propuesta.

---

## TanStack Query como estándar de server state

### Qué problema resuelve aquí

TanStack Query encaja bien en este repo porque resuelve directamente los dolores actuales:

- caché compartida entre pantallas
- deduplicación de requests
- invalidación después de mutaciones
- estado remoto estandarizado
- menos `useEffect` de carga manual
- mejor soporte para refetch y retry

### Configuración base

Se agregará:

- `@tanstack/react-query`
- opcionalmente `@tanstack/react-query-devtools` en desarrollo

Y registrar `QueryClientProvider` en `pages/_app.tsx`.

Ejemplo:

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 300_000,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 0,
    },
  },
});
```

### Defaults operativos

#### Queries

- `staleTime`: 5 minutos para catálogos y datos relativamente estables
- `retry`: 1 para GET idempotentes
- `refetchOnWindowFocus`: `false` inicialmente para evitar ruido en formularios y pantallas operativas
- `refetchOnReconnect`: `true`
- `enabled`: explícito cuando la query dependa de params, auth o precondiciones de negocio

#### Mutations

- `retry`: `0`
- invalidación explícita por `queryKey`

---

## Organización por feature

La adopción de TanStack Query no debe meter toda la lógica en `services/` ni en las páginas. La organización funcional quedará por dominio dentro de `features/`, mientras la infraestructura HTTP común vive en `lib/http`.

Ejemplo:

```text
lib/
  http/
    client.ts
    error.ts
    interceptors.ts

features/
  courses/
    courses.api.ts
    courses.query-keys.ts
    courses.queries.ts
    courses.mutations.ts
  professors/
    professors.api.ts
    professors.query-keys.ts
    professors.queries.ts
```

### Ejemplo: API functions

```ts
import { http } from "@/lib/http/client";
import type { Course } from "@/interfaces/Courses/Course";

export async function getCourses(): Promise<Course[]> {
  const { data } = await http.get<Course[]>("/api/courses");
  return data;
}
```

### Ejemplo: query keys

```ts
export const coursesKeys = {
  all: ["courses"] as const,
  list: () => [...coursesKeys.all, "list"] as const,
  detail: (id: string | number) => [...coursesKeys.all, "detail", id] as const,
};
```

La convención oficial será **Query Key Factory por dominio**, por ejemplo:

- `usersKeys`
- `coursesKeys`
- `evaluationsKeys`
- `professorsKeys`

### Ejemplo: query hook

```ts
import { useQuery } from "@tanstack/react-query";

export function useCoursesQuery() {
  return useQuery({
    queryKey: coursesKeys.list(),
    queryFn: getCourses,
  });
}
```

### Ejemplo: mutation hook

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateCourseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: coursesKeys.all });
    },
  });
}
```

---

## Qué debe ir a TanStack Query y qué no

### Sí debe ir

- catálogos remotos
- listas
- detalles
- búsquedas remotas
- métricas y dashboards
- recursos compartidos entre pantallas
- mutaciones con impacto en caché

### No debe ir

- estado de formularios
- `touchedFields`
- previews de archivos
- estado de modales
- step actual de wizards
- colapso del sidebar
- alertas efímeras puramente visuales

Regla práctica: si el estado representa datos del backend, es candidato a Query. Si representa interacción local de UI, no.

---

## Ejemplo aplicado al repo: `pages/content/addCourse.tsx`

Hoy esa pantalla:

- carga categorías
- carga profesores
- carga evaluaciones
- maneja `loading` manual
- hace `Promise.all` dentro de `useEffect`

Con TanStack Query, esa pantalla debería consumir tres queries separadas:

```tsx
const categoriesQuery = useCategoriesQuery();
const professorsQuery = useProfessorsQuery();
const evaluationsQuery = useAvailableEvaluationsQuery();

const isBootstrapping =
  categoriesQuery.isLoading ||
  professorsQuery.isLoading ||
  evaluationsQuery.isLoading;
```

Y la creación del curso debería pasar por una mutation:

```tsx
const createCourseMutation = useCreateCourseMutation();

await createCourseMutation.mutateAsync(formData);
```

### Resultado esperado

- menos `useEffect`
- menos `useState` para datos remotos
- mejor reutilización entre pantallas
- invalidación automática del listado de cursos
- mejor legibilidad de la pantalla

---

## Auth y manejo de errores

Para que la solución sea realmente enterprise, no alcanza con instalar TanStack Query. La política de auth y errores debe quedar centralizada.

### Decisión

#### 1. Fuente de token única

Definir una sola convención para el token. Hoy hay indicios de uso mixto entre `token` y `userToken`.

Debe quedar una sola clave canónica.

Decisión para este repo:

- `userToken` como única clave persistida en `localStorage`
- `token` solo como nombre runtime en `AuthContext` o parámetros internos mientras exista código legado
- eliminar cualquier uso de `localStorage.getItem("token")`

#### 2. Interceptor de request

Adjuntar automáticamente el token a cada request autenticado.

Además, la capa HTTP será responsable de interceptar respuestas `401` y ejecutar la política global definida.

#### 3. Normalización de errores

Mapear errores HTTP a un tipo propio en la capa HTTP. El parsing, la normalización y la adaptación deben ocurrir ahí, no en páginas, hooks ni servicios de dominio.

Contrato base actual:

```ts
export type AppError = {
  status: number;
  message: string;
  code?: string;
  details?: unknown;
};
```

#### 4. Política de `401`

Decisión tomada para este repo:

- limpiar sesión
- ejecutar logout automático
- redirigir a login
- mostrar una notificación global consistente

Implementación:

- resolver la notificación global desde un provider montado en `_app.tsx`
- disparar la notificación desde la capa HTTP, no desde páginas individuales
- usar un canal único para eventos globales de sesión expirada
- limitar esta notificación global a eventos transversales como `401`, no a errores de negocio del formulario

#### 5. Retry controlado

- GET: retry limitado
- POST/PUT/DELETE: sin retry automático

#### 6. Contrato inicial de `AppError`

`AppError` tendrá dos niveles:

1. un contrato base estable para toda la app
2. un `details` flexible para conservar información específica del backend sin contaminar la UI

Contrato inicial oficial:

```ts
export type AppError = {
  status: number;
  message: string;
  code?: string;
  kind?: "auth" | "validation" | "network" | "server" | "unknown";
  details?: unknown;
  cause?: unknown;
};
```

Uso en la UI:

- `status` para decisiones técnicas
- `message` para fallback de UI
- `code` para lógica específica cuando el backend la provea
- `kind` para evitar parseo repetido en componentes
- `details` para validaciones o payloads específicos
- `cause` para debugging o logging

---

## Riesgos si se adopta mal

### 1. Poner Query encima de una capa HTTP inconsistente

Si se adopta TanStack Query sin unificar el cliente HTTP, solo se mueve el problema de lugar.

### 2. Mezclar server state con UI state

Si se lleva a Query lo que debería seguir local, la complejidad sube innecesariamente.

### 3. Migración big bang

Cambiar todos los servicios y páginas al mismo tiempo elevaría el riesgo de regresión.

### 4. Query keys sin convención

Sin factories por dominio, la invalidación se vuelve frágil.

---

## Estrategia de migración

### Enfoque de ejecución

La implementación no debe hacerse como un refactor transversal único. La estrategia correcta es avanzar en capas, cerrando infraestructura primero, validando un piloto real después y retirando legado solo cuando exista reemplazo probado.

### PR 1. Infraestructura base

Objetivo: dejar lista la base técnica sin migrar todavía una pantalla compleja de negocio.

Cambios esperados:

1. instalar `@tanstack/react-query`
2. registrar `QueryClientProvider` en `_app.tsx`
3. crear `lib/http/client.ts`
4. crear `lib/http/interceptors.ts`
5. crear `lib/http/error.ts` con `AppError`
6. centralizar lectura de `userToken`
7. implementar política global de `401`

Criterios de salida:

1. toda request nueva ya puede salir por `lib/http/client.ts`
2. existe parsing y normalización de errores en la capa HTTP
3. `401` dispara logout, limpieza de sesión, redirección y notificación global
4. `pages/_app.tsx` ya expone QueryClient a toda la app

Riesgo principal:

- introducir interceptores sin una política clara de notificación puede producir efectos duplicados en UI

### PR 2. Primer piloto de lectura

Objetivo: validar el patrón end-to-end sobre un slice real, pero controlado.

Decisión tomada:

- usar `pages/content/addCourse.tsx` como pantalla piloto del rol `content`
- extraer primero las lecturas de soporte, no la mutación principal

Alcance del piloto:

1. categorías
2. profesores
3. evaluaciones disponibles

Cambios esperados:

1. crear `features/categories/`
2. crear `features/professors/`
3. crear `features/evaluations/`
4. mover lecturas a `*.api.ts`
5. crear `*.query-keys.ts`
6. crear `*.queries.ts`
7. reemplazar `useEffect` + `Promise.all` de bootstrap en `addCourse`

Criterios de salida:

1. `addCourse` deja de manejar `loading/error/data` manualmente para esas tres lecturas
2. los catálogos se resuelven vía Query
3. las query keys siguen la factory por dominio
4. no hay regresión visual ni funcional en el formulario

### PR 3. Mutaciones del dominio piloto

Objetivo: cerrar el circuito de escritura usando TanStack Query.

Cambios esperados:

1. crear `courses.api.ts`
2. crear `courses.query-keys.ts`
3. crear `courses.mutations.ts`
4. migrar `createCourse`
5. invalidar caché por `coursesKeys`

Criterios de salida:

1. la creación de curso ya no depende de refresh manual
2. las mutaciones usan `useMutation`
3. el error mostrado al usuario sale de un error ya normalizado

### PR 4. Expansión del módulo `content`

Objetivo: consolidar el patrón en el módulo donde ya existe mejor orden estructural.

Orden de migración dentro de `content`:

1. cursos
2. módulos
3. profesores
4. evaluaciones
5. categorías
6. flashcards

Criterios de salida:

1. las pantallas migradas ya no usan `useDataLoader`
2. disminuye el uso de `axios` directo
3. los recursos compartidos ya tienen caché reutilizable entre páginas

### PR 5. Expansión a otros roles

Objetivo: llevar el patrón a módulos fuera de `content`.

Orden de ejecución:

1. `supervisor`
2. `admin`
3. `corporate`
4. otros módulos operativos

Motivo:

- `supervisor` ya tiene varios puntos con fetch manual y auth repetida
- `admin` y `corporate` se benefician rápido de caché y error handling consistente

### PR 6. Retiro de legado

Objetivo: eliminar caminos redundantes cuando el reemplazo ya esté probado.

Decisión tomada:

- la deprecación ocurrirá por feature migrada

Cambios esperados:

1. deprecar `services/api.ts`
2. deprecar `services/axios.ts`
3. retirar servicios con `axios` crudo donde ya exista reemplazo
4. retirar o reescribir `useDataLoader`

Criterios de salida:

1. ningún código nuevo usa los clientes legacy
2. los módulos migrados no dependen de servicios con auth manual
3. la deuda remanente queda inventariada por feature

### Regla de migración

Cada feature migrada debe seguir esta secuencia:

1. crear API functions
2. definir query keys
3. crear query hooks
4. crear mutation hooks
5. reemplazar fetch manual en UI
6. validar comportamiento
7. recién después retirar legado local

### Qué no hacer

1. no migrar todas las pantallas de una vez
2. no mezclar normalización HTTP dentro de páginas o hooks de dominio
3. no retirar `services/api.ts` o `services/axios.ts` antes de tener reemplazo real
4. no mover estado de formulario a Query

---

## Criterios de éxito

La migración puede considerarse exitosa si se cumple lo siguiente:

1. todo request nuevo usa el cliente HTTP unificado
2. las pantallas migradas ya no manejan `loading/error/data` manualmente para datos remotos
3. las mutaciones invalidan caché en lugar de forzar recargas manuales
4. `401`, errores de red y mensajes de backend se manejan de forma consistente
5. agregar un recurso nuevo sigue una convención clara y repetible

---

## Lista de tareas técnicas

### Infraestructura base

1. Instalar `@tanstack/react-query`.
2. Registrar `QueryClientProvider` en `_app.tsx`.
3. Crear `lib/http/client.ts`.
4. Crear `lib/http/interceptors.ts`.
5. Crear `lib/http/error.ts`.
6. Centralizar la lectura de `userToken` en la capa HTTP.
7. Implementar el provider global de notificación en `_app.tsx`.
8. Implementar manejo global de `401` desde interceptores.
9. Exponer helpers de error: `isAuthError`, `isValidationError`, `getUserFacingMessage`.

### Piloto `content/addCourse`

1. Crear `features/categories/categories.api.ts`.
2. Crear `features/categories/categories.query-keys.ts`.
3. Crear `features/categories/categories.queries.ts`.
4. Crear `features/professors/professors.api.ts`.
5. Crear `features/professors/professors.query-keys.ts`.
6. Crear `features/professors/professors.queries.ts`.
7. Crear `features/evaluations/evaluations.api.ts` para evaluaciones disponibles.
8. Crear `features/evaluations/evaluations.query-keys.ts`.
9. Crear `features/evaluations/evaluations.queries.ts`.
10. Reemplazar el `useEffect` de bootstrap en `pages/content/addCourse.tsx`.
11. Sustituir `Promise.all` manual por queries independientes.
12. Mantener el estado del formulario y uploads fuera de Query.

### Mutación del piloto

1. Crear `features/courses/courses.api.ts`.
2. Crear `features/courses/courses.query-keys.ts`.
3. Crear `features/courses/courses.mutations.ts`.
4. Migrar `createCourse` a `useMutation`.
5. Invalidar caché con `coursesKeys`.
6. Adaptar el manejo de errores del submit a `AppError`.

### Expansión del módulo `content`

1. Migrar lecturas y mutaciones de cursos.
2. Migrar lecturas y mutaciones de módulos.
3. Migrar lecturas y mutaciones de profesores.
4. Migrar lecturas y mutaciones de evaluaciones.
5. Migrar lecturas y mutaciones de categorías.
6. Migrar lecturas y mutaciones de flashcards.
7. Retirar `useDataLoader` donde ya exista reemplazo por Query.

### Expansión a otros roles

1. Migrar `supervisor`.
2. Migrar `admin`.
3. Migrar `corporate`.
4. Migrar módulos operativos restantes.

### Retiro de legado

1. Marcar `services/api.ts` como deprecated por feature reemplazada.
2. Marcar `services/axios.ts` como deprecated por feature reemplazada.
3. Retirar usos de `axios` crudo en features ya migradas.
4. Retirar o reescribir `useDataLoader` cuando no tenga consumidores válidos.
5. Inventariar deuda remanente por feature no migrada.

---

## Decisiones cerradas

- `userToken` es la única clave persistida de autenticación
- `lib/http` será el hogar de la infraestructura HTTP compartida
- la organización funcional se hará por dominio dentro de `features/`
- `utils/Endpoints.ts` se mantiene como está en esta fase
- la convención de caché será Query Key Factory por dominio
- el primer piloto será `pages/content/addCourse.tsx`
- la deprecación del legado ocurrirá por feature migrada, no por corte transversal único
- la notificación global de `401` se implementará con un provider propio en `_app.tsx`
- los defaults base de Query serán:
  - `staleTime: 5 min`
  - `retry: 1`
  - `refetchOnWindowFocus: false`
  - `refetchOnReconnect: true`
  - `enabled` explícito cuando dependa de params o auth
- habrá un `AppError` normalizado en la capa HTTP con `status`, `message`, `code`, `kind`, `details` y `cause`
- la política de `401` será: logout automático + limpieza de sesión + redirección + notificación global

## Qué sigue abierto

No quedan decisiones abiertas de arquitectura para iniciar la implementación. Los ajustes futuros sobre notificación global o `AppError` se tratarán como refinamientos de implementación, no como bloqueantes de diseño.

## Riesgos de implementación

1. Si el primer piloto incluye demasiadas mutaciones además de lecturas, el costo de entrada puede ser más alto de lo necesario.
2. Si la notificación global de `401` no se centraliza bien, puede duplicarse con errores locales ya existentes.
3. Si no se define una política de retiro del legado por feature, la convivencia puede alargarse demasiado y diluir el beneficio del cambio.
4. Si `AppError` no se prueba contra respuestas reales del backend antes de expandir el patrón, puede aparecer parsing ad hoc otra vez en la UI.

## Implementación puntual

### Notificación global de `401`

Implementación acordada:

- usar un provider global montado en `_app.tsx` con una API mínima tipo `notify({ type, message })`

Decisión tomada:

- la notificación global de `401` se implementará con un provider propio montado en `_app.tsx`

Rationale:

- evita acoplar la capa HTTP a componentes concretos
- permite reutilizar la misma infraestructura luego para eventos globales de sesión
- reduce el riesgo de duplicar `alert()` o `AlertComponent` locales

Alcance de uso:

- usar la notificación global solo para eventos transversales como sesión expirada, caída de red general o mantenimiento
- mantener los errores de negocio y validación cerca de la pantalla que los originó

### Manejo de errores

Implementación acordada:

- normalizar todos los errores en `lib/http/error.ts`
- exportar helpers tipo `isAuthError`, `isValidationError`, `getUserFacingMessage`

Decisión tomada:

- `AppError` usará como contrato inicial oficial el shape con `status`, `message`, `code`, `kind`, `details` y `cause`

Rationale:

- evita que cada hook o pantalla vuelva a interpretar `AxiosError`
- permite que Query y las páginas trabajen sobre un contrato propio
- deja el backend desacoplado de la UI

Lineamiento de logging:

- la capa HTTP debería conservar `cause` y `details` para debugging
- la UI debería consumir solo `message`, `code` y `kind` salvo casos especiales

---

## Cierre

Sí conviene adoptar TanStack Query en este proyecto, pero solo como parte de una normalización más amplia.

La secuencia correcta no es:

1. instalar Query
2. reemplazar algunos `useEffect`

La secuencia correcta es:

1. unificar la capa HTTP
2. definir convención de endpoints y errores
3. introducir TanStack Query como estándar de server state
4. migrar por dominios, empezando por `content`

Con ese enfoque, la adopción no solo mejora DX; también mejora consistencia operativa, mantenibilidad y escalabilidad del frontend.
