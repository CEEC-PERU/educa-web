# Propuesta técnica: AppSidebar

## Objetivo

Diseñar un componente `AppSidebar` que unifique la navegación lateral principal de la aplicación sin romper el comportamiento actual por rol y sin exigir una reescritura masiva inmediata.

La idea no es solo "juntar sidebars", sino convertir la navegación lateral en una pieza de infraestructura del shell de la aplicación:

- reutilizable
- predecible
- tipada
- desacoplada de cada página
- fácil de extender para nuevos roles y módulos

## Problema actual

Hoy la base tiene una duplicación clara de navegación lateral por rol. Existen múltiples componentes con estructura, estilos y comportamiento muy parecidos:

- `components/Content/SideBar.tsx`
- `components/Corporate/CorporateSideBar.tsx`
- `components/comercial/ComercialSidebar.tsx`
- `components/Admin/SideBarAdmin.tsx`
- `components/admincorporative/CorporativeSideBar.tsx`
- `components/supervisor/SibebarSupervisor.tsx`
- `components/calidad/SibebarCalidad.tsx`
- `components/student/DrawerNavigation.tsx`
- `components/student/SideBarPrueba.tsx`

Problemas derivados:

1. la lógica de navegación está repartida por rol
2. el estilo visual está duplicado
3. el comportamiento `collapsed/expanded` no está estandarizado
4. el `router.push`, logout y badges viven mezclados con render en cada sidebar
5. agregar un nuevo item o patrón visual obliga a tocar varios archivos
6. el shell global de la app no está claramente separado de la feature navigation

## Objetivo de diseño

`AppSidebar` debe resolver la navegación lateral principal del sistema a partir de configuración declarativa.

Debe permitir:

- renderizar menús distintos por rol
- soportar items simples y grupos expandibles
- manejar badges o contadores
- desacoplar la definición del menú del render visual
- soportar `collapsed`, `expanded` y variante móvil
- mantener compatibilidad progresiva con el layout actual basado en `AppNavbar + AppSidebar`

## Alcance inicial

Incluido en esta propuesta:

- contrato del componente
- modelo de datos para items
- separación entre shell y configuración
- estrategia de migración incremental
- decisiones abiertas

Excluido en esta etapa:

- migración completa de todos los roles en una sola iteración
- rediseño visual profundo
- cambio completo de autenticación
- migración total a App Router

## Principios de diseño

1. `AppSidebar` representa la navegación lateral principal, no cualquier panel lateral.
2. La estructura del menú debe venir de datos, no de JSX hardcodeado por rol.
3. El componente no debe conocer reglas de negocio complejas.
4. El componente debe ser estable aunque cambie el sistema de routing futuro.
5. El render debe estar desacoplado de fuentes de datos como `requirements`, perfil o permisos.

## Diseño propuesto

### 1. Separación por capas

Se propone dividir la solución en tres capas:

#### Capa 1. Componente visual

`AppSidebar`

Responsabilidades:

- renderizar estructura visual
- manejar estado visual `collapsed/expanded`
- renderizar items, grupos, iconos y badges
- exponer callbacks de navegación

No debe:

- consultar APIs
- leer `localStorage`
- resolver permisos complejos
- conocer detalles de cada rol

#### Capa 2. Configuración del menú

`app-sidebar.config.ts` o equivalente

Responsabilidades:

- declarar qué items ve cada rol
- encapsular labels, hrefs, iconos y agrupaciones
- permitir badges opcionales o funciones de visibilidad

#### Capa 3. Adapter o container

`AppSidebarContainer`

Responsabilidades:

- obtener usuario actual
- resolver rol
- resolver datos dinámicos como badges
- leer y persistir el estado visual del sidebar desde una capa superior
- pasar props puras al componente visual

Esto permite mantener `AppSidebar` como pieza reusable y testeable.

#### Capa 4. UI state store

`navigation.store.ts`

Responsabilidades:

- persistir `isCollapsed`
- exponer acciones simples de UI del shell
- desacoplar el estado visual del árbol de páginas

Recomendación:

- introducir Zustand para este estado de shell

Razón:

- el estado `collapsed` sí debe persistir
- es un estado transversal del shell, no de una página puntual
- evita inflar `AuthContext` o crear otro context ad hoc

## API propuesta

### Tipo base del menú

```ts
export type AppSidebarItem = {
  id: string;
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  badgeCount?: number;
  isVisible?: boolean;
  children?: AppSidebarItem[];
  action?: "logout";
};
```

### Props del componente

```ts
type AppSidebarProps = {
  items: AppSidebarItem[];
  isCollapsed: boolean;
  onToggleCollapse?: () => void;
  onNavigate?: (href: string) => void;
  onAction?: (action: "logout") => void;
  currentPath?: string;
  variant?: "desktop" | "mobile";
  user?: {
    name?: string;
    profilePicture?: string;
  };
};
```

### Shape sugerido del store

```ts
type NavigationUiState = {
  isSidebarCollapsed: boolean;
  setSidebarCollapsed: (value: boolean) => void;
  toggleSidebarCollapsed: () => void;
};
```

### Ejemplo de configuración por rol

```ts
export const supervisorSidebarItems: AppSidebarItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/supervisor",
    icon: BookOpenIcon,
  },
  {
    id: "users",
    label: "Usuarios",
    href: "/supervisor/usuarios",
    icon: UserGroupIcon,
  },
  {
    id: "logout",
    label: "Cerrar sesión",
    icon: ArrowRightStartOnRectangleIcon,
    action: "logout",
  },
];
```

## Estructura recomendada

Si se hace como primer paso de orden arquitectónico, la propuesta sería:

```text
components/
  navigation/
    AppSidebar.tsx
    AppSidebarItem.tsx
    AppSidebarGroup.tsx
    AppSidebarHeader.tsx
    AppSidebarFooter.tsx
    AppNavbar.tsx

features/
  navigation/
    app-sidebar.config.ts
    app-sidebar.roles.ts
    useAppSidebar.ts
    AppSidebarContainer.tsx
    navigation.store.ts
```

Decisión tomada:

- se abre desde ahora `features/navigation`

Razón:

- la migración será progresiva
- conviene que el código nuevo ya entre con la estructura objetivo
- evita crear otra capa transicional que luego haya que volver a mover

## Comportamientos requeridos

### Estado collapsed / expanded

El componente debe soportar ambos estados con una sola implementación.

Comportamiento esperado:

- `collapsed`: muestra solo iconos y badges mínimos
- `expanded`: muestra labels, grupos y datos de usuario
- el estado debe ser controlado desde afuera y persistido en store

Decisión tomada:

- persistir `collapsed` con Zustand

Alcance inicial de persistencia:

- mantenerlo persistido en `localStorage` mediante el middleware de persistencia de Zustand
- no mezclar esta persistencia con auth ni con preferencias de backend en la primera fase

### Navegación activa

Debe existir soporte para resaltar el item activo mediante `currentPath`.

Opciones:

1. match exacto por `href`
2. match por prefijo para secciones hijas

Recomendación:

- usar prefijo controlado, porque varios módulos tienen subrutas profundas

Decisión tomada:

- `matchMode` vive en cada item
- la resolución del item activo se ejecuta mediante una función matcher centralizada

Razón:

- el comportamiento deseado queda explícito en la configuración
- el algoritmo de matching no se dispersa entre componentes
- se evita hardcodear reglas de ruta dentro de `AppSidebar`

### Acciones especiales

No todo item navega. Algunos items ejecutan acciones, por ejemplo logout.

La propuesta es modelarlas como `action` en lugar de hardcodearlas dentro del render.

### Badges

Los `badgeCount` no deben calcularse dentro de `AppSidebar`.

Decisión tomada:

- `AppSidebar` recibe los badges ya resueltos desde afuera
- el adapter, container o selectors por rol decide cómo construirlos

Implicancia:

- el componente visual sigue siendo puro
- no queda acoplado a servicios, queries o reglas específicas de negocio

### Groups o submenús

Debe existir soporte para items con `children`.

Necesario para evitar más variantes tipo `DrawerNavigation` con dropdowns hechos a mano.

## Decisiones cerradas

### 1. Control del estado visual

Opciones:

- `AppSidebar` controlado por props
- `AppSidebar` con estado interno

Decisión:

- controlado por props para el estado `isCollapsed`
- persistido en una store de Zustand

Razón:

- facilita integración con el layout actual
- permite sincronizar con `AppNavbar`, mobile drawer y preferencias de shell
- mantiene limpio el componente visual

### 2. Ubicación de la definición del menú

Opciones:

- junto al componente
- en `features/navigation`
- en `utils`

Decisión:

- vive en `features/navigation`

Razón:

- el menú ya no es un detalle visual, es parte del application shell
- el código nuevo debe entrar directamente en la estructura objetivo

### 3. Resolución de permisos y visibilidad

Opciones:

- el componente
- el container
- la config

Decisión:

- permisos y visibilidad se resuelven antes del render, en config o container

Razón:

- reduce complejidad interna
- mejora testeabilidad

### 4. Modelo de componente

Opciones:

- un solo `AppSidebar` con config por rol
- `AppSidebar` base más wrappers por rol

Decisión:

- un solo `AppSidebar` base con config por rol

Razón:

- elimina duplicación real sin volver a fragmentar el shell

### 5. Normalización de Navbar

Decisión:

- normalizar `Navbar` a `AppNavbar`
- mantener el alcance acotado para no rediseñar todo el shell en la misma iteración

Razón:

- alinea el naming del shell global
- evita ambigüedad futura entre navbars globales y navbars locales
- mantiene el cambio técnicamente ordenado sin exigir un rediseño total inmediato

## Estrategia de migración sugerida

### Fase 1. Base reusable

- crear `AppSidebar`
- crear tipos de navegación
- crear config por rol
- migrar primero un rol de menor complejidad

### Fase 2. Rol piloto

Rol recomendado para piloto:

- `content`

Razón:

- tiene una superficie acotada
- es suficientemente representativo para validar la API
- implica menos complejidad que `student` y menos variabilidad que `supervisor`

### Fase 3. Consolidación

- migrar `admin`, `comercial`, `corporate`, `calidad`, `admincorporative`
- estandarizar estilos y comportamiento

### Fase 4. Casos especiales

- migrar `student/DrawerNavigation`
- migrar variantes como `SideBarPrueba`
- resolver grupos expandibles y mobile behavior

## Riesgos

1. asumir que todas las sidebars actuales tienen el mismo comportamiento
2. mezclar demasiada lógica de permisos dentro del componente nuevo
3. intentar migrar todos los roles en un solo PR
4. no definir una convención clara para items activos y submenús
5. acoplar `AppSidebar` directamente a `next/router`

## Recomendación técnica final

La propuesta recomendada es:

1. crear un `AppSidebar` visual único
2. modelar navegación con configuración tipada
3. introducir un `AppSidebarContainer` para adaptar usuario, rol y badges
4. introducir Zustand para persistir el estado visual del shell
5. migrar primero el rol `content`
6. normalizar `Navbar` a `AppNavbar`

## Decisiones con impacto de implementación

1. `content` será el rol piloto.
2. Se abre desde ahora `features/navigation`.
3. El estado `collapsed` se persiste con Zustand.
4. Los badge counts entran ya preparados desde afuera.
5. El adapter o capa superior decide cómo construir badges y visibilidad según rol.
6. `Navbar` se normaliza a `AppNavbar`.

## Puntos todavía a discutir

Aunque las decisiones principales ya quedaron cerradas, todavía conviene validar estos detalles antes de implementar:

1. si `AppNavbar` y `AppSidebar` se migran en el mismo PR del piloto `content` o en dos PRs consecutivos
2. si `children` soportará múltiples niveles o solo un nivel en la primera fase
3. si badges se modelarán solo como `number` o si conviene soportar variantes futuras como `dot`, `warning` o `text`

## Resultado esperado de la primera implementación

Si esta propuesta se aprueba, la primera entrega no debería cambiar el comportamiento funcional global. Debería entregar:

- un `AppSidebar` reusable
- un `AppNavbar` normalizado en naming
- una configuración por rol piloto
- una store de navegación para persistir `collapsed`
- una migración de un rol real
- eliminación de duplicación inicial
- una base lista para continuar el refactor del shell de aplicación

## Desglose técnico de la primera iteración

Esta sección aterriza la primera implementación real del piloto `content`.

Objetivo de la iteración:

- introducir el shell base nuevo sin alterar la lógica funcional del módulo `content`
- reemplazar la navegación lateral actual de `content` por una implementación basada en configuración
- dejar preparado el patrón para migrar después otros roles

### Alcance de la iteración 1

Incluido:

- creación de `AppSidebar`
- creación de `AppNavbar`
- creación del store de navegación con Zustand
- creación de config para el rol `content`
- creación de un container de adaptación para `content`
- migración del módulo `content` a la nueva navegación

Excluido:

- migración de otros roles
- cambios de diseño visual grandes
- refactor completo de `Navbar` y todas las sidebars antiguas en el mismo paso
- reescritura del layout global de toda la aplicación

## Archivos a crear

### Shell visual

```text
components/
  navigation/
    AppSidebar.tsx
    AppSidebarItem.tsx
    AppSidebarGroup.tsx
    AppSidebarHeader.tsx
    AppSidebarFooter.tsx
    AppNavbar.tsx
```

Responsabilidades sugeridas:

- `AppSidebar.tsx`
  - composición principal
  - render del contenedor general
  - conexión de grupos, items, footer y estado visual

- `AppSidebarItem.tsx`
  - render de item simple
  - estado activo
  - badge y action/href

- `AppSidebarGroup.tsx`
  - render de item con `children`
  - expansión/colapso local del grupo

- `AppSidebarHeader.tsx`
  - branding/logo
  - información mínima del usuario si aplica
  - trigger visual de colapso si se mantiene ahí

- `AppSidebarFooter.tsx`
  - acciones globales como logout
  - espacio para futuras acciones transversales

- `AppNavbar.tsx`
  - renombre normalizado del navbar superior actual
  - wrapper transicional con la API actual o casi igual

### Feature navigation

```text
features/
  navigation/
    app-sidebar.types.ts
    app-sidebar.content.config.ts
    app-sidebar.roles.ts
    AppSidebarContainer.tsx
    useAppSidebar.ts
    navigation.store.ts
    selectors/
      getContentSidebarItems.ts
```

Responsabilidades sugeridas:

- `app-sidebar.types.ts`
  - tipos compartidos del sistema de navegación

- `app-sidebar.content.config.ts`
  - definición base del menú `content`

- `app-sidebar.roles.ts`
  - mapeo entre rol y config correspondiente

- `AppSidebarContainer.tsx`
  - lectura de usuario actual
  - lectura del estado de store
  - binding de navegación y acciones

- `useAppSidebar.ts`
  - hook adaptador para armar props del sidebar

- `navigation.store.ts`
  - estado UI persistido del shell

- `selectors/getContentSidebarItems.ts`
  - composición final de items para `content`
  - inyección de badges ya calculados

## Archivos a modificar

### Navegación actual de `content`

- `components/Content/SideBar.tsx`
  - destino esperado: dejar de ser usado por el módulo `content`
  - no eliminarlo en la primera iteración si todavía hay riesgo de rollback

### Navbar actual

- `components/Navbar.tsx`
  - opción recomendada: mantenerlo temporalmente y crear `AppNavbar` como wrapper o renombre controlado

### Páginas del módulo `content`

Archivos candidatos a migrar en esta fase:

- `pages/content/index.tsx`
- `pages/content/category.tsx`
- `pages/content/addCourse.tsx`
- `pages/content/addProfessor.tsx`
- `pages/content/addSession.tsx`
- `pages/content/addModule.tsx`
- `pages/content/detailModule.tsx`
- `pages/content/detailProfessor.tsx`
- `pages/content/detailFlashcard.tsx`
- `pages/content/editCourse.tsx`
- `pages/content/editSession.tsx`
- `pages/content/flashcards.tsx`
- `pages/content/professors.tsx`
- `pages/content/module.tsx`
- `pages/content/evaluation/index.tsx`

Objetivo del cambio en páginas:

- reemplazar imports del sidebar actual por el nuevo container o por `AppSidebar`
- reemplazar `Navbar` por `AppNavbar` donde toque la navegación del shell del piloto
- no cambiar lógica de fetch, formularios o negocio en esta fase

## Orden de implementación recomendado

### Paso 1. Tipos base

Crear:

- `features/navigation/app-sidebar.types.ts`

Debe incluir al menos:

```ts
export type AppSidebarAction = "logout";

export type AppSidebarItem = {
  id: string;
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  badgeCount?: number;
  isVisible?: boolean;
  children?: AppSidebarItem[];
  action?: AppSidebarAction;
  matchMode?: "exact" | "prefix";
};
```

### Paso 2. Store de navegación

Crear:

- `features/navigation/navigation.store.ts`

Diseño recomendado:

```ts
type NavigationUiState = {
  isSidebarCollapsed: boolean;
  setSidebarCollapsed: (value: boolean) => void;
  toggleSidebarCollapsed: () => void;
};
```

Recomendación de librería:

- Zustand con middleware `persist`

Decisión pendiente de detalle:

- ninguna en esta capa; la persistencia queda definida

Decisión:

- `localStorage`, porque la preferencia visual del shell normalmente debe sobrevivir refresh y nueva sesión del navegador

### Paso 3. Config del rol `content`

Crear:

- `features/navigation/app-sidebar.content.config.ts`

El archivo debe contener solo definición declarativa.

Ejemplo de shape esperada:

```ts
export const contentSidebarBaseItems: AppSidebarItem[] = [
  {
    id: "courses",
    label: "Cursos",
    href: "/content",
    icon: BookOpenIcon,
    matchMode: "prefix",
  },
  {
    id: "categories",
    label: "Categorias",
    href: "/content/category",
    icon: TagIcon,
    matchMode: "exact",
  },
  {
    id: "flashcards",
    label: "Flashcards",
    href: "/content/flashcards",
    icon: CubeIcon,
    matchMode: "prefix",
  },
  {
    id: "professors",
    label: "Profesores",
    href: "/content/professors",
    icon: UserGroupIcon,
    matchMode: "prefix",
  },
  {
    id: "modules",
    label: "Módulos",
    href: "/content/module",
    icon: CubeIcon,
    matchMode: "prefix",
  },
  {
    id: "evaluations",
    label: "Evaluaciones",
    href: "/content/evaluation",
    icon: DocumentTextIcon,
    matchMode: "prefix",
  },
  {
    id: "logout",
    label: "Cerrar Sesión",
    icon: ArrowRightStartOnRectangleIcon,
    action: "logout",
  },
];
```

### Paso 4. Selector o builder del menú

Crear:

- `features/navigation/selectors/getContentSidebarItems.ts`

Responsabilidad:

- tomar la config base
- aplicar badges ya calculados si existieran
- filtrar visibilidad si hiciera falta
- devolver el arreglo final listo para render

Regla importante:

- no llamar APIs dentro del selector

### Paso 5. Componente visual AppSidebar

Crear:

- `components/navigation/AppSidebar.tsx`
- subcomponentes relacionados

Responsabilidades mínimas:

- render del contenedor lateral
- lectura de `items`
- render de items simples y grupos
- render de item activo
- soporte de `collapsed`
- render del área inferior con acciones

No debe:

- usar `useAuth`
- usar servicios
- usar `localStorage`
- calcular badges

### Paso 6. AppNavbar transicional

Crear:

- `components/navigation/AppNavbar.tsx`

Estrategia recomendada:

- empezar como wrapper del componente actual `Navbar`
- mantener compatibilidad de props para reducir riesgo
- luego iterar el contrato si hace falta

Ejemplo de estrategia transicional:

```ts
import LegacyNavbar from '../Navbar';

export default function AppNavbar(props: LegacyNavbarProps) {
  return <LegacyNavbar {...props} />;
}
```

Esto permite normalizar naming sin forzar un rediseño inmediato.

### Paso 7. Container de integración

Crear:

- `features/navigation/AppSidebarContainer.tsx`
- `features/navigation/useAppSidebar.ts`

Responsabilidades:

- usar `useRouter` o equivalente actual
- leer usuario desde `useAuth`
- leer `isSidebarCollapsed` desde Zustand
- armar `onNavigate`
- armar `onAction`
- inyectar items finales del rol `content`

Responsabilidades explícitamente fuera de `AppSidebar`:

- `logout`
- reglas de rol
- composición de badges
- current path matching algorithm

Responsabilidad a introducir en la capa superior:

- una función matcher centralizada que resuelva `currentPath` contra `href` usando el `matchMode` declarado en cada item

Nombre recomendado:

- `isSidebarItemActive`

Ubicación recomendada:

- fuera del componente visual
- cerca de la lógica de navegación/layout, dentro de `features/navigation`

Ejemplo de ubicación:

```text
features/
  navigation/
    utils/
      isSidebarItemActive.ts
```

### Paso 8. Migración del módulo `content`

Cambios sugeridos:

1. reemplazar el sidebar actual por `AppSidebarContainer`
2. reemplazar `Navbar` por `AppNavbar`
3. mantener el resto del layout igual
4. no tocar formularios ni servicios en esta iteración

Recomendación:

- empezar por `pages/content/index.tsx`
- luego migrar el resto del módulo `content`

## Criterios de aceptación

La iteración se considera correcta si:

1. el módulo `content` sigue funcionando sin cambios de flujo
2. el menú lateral conserva sus entradas actuales
3. el item activo se resalta correctamente
4. el estado collapsed persiste tras refresh
5. logout sigue funcionando
6. el componente visual nuevo no depende de `useAuth`, servicios ni `localStorage`
7. el módulo `content` deja de depender de `components/Content/SideBar.tsx`
8. el navbar del piloto ya usa `AppNavbar`

## Riesgos específicos de la iteración 1

1. que `AppNavbar` como wrapper transicional arrastre props demasiado acopladas del componente viejo
2. que algunas páginas `content` dependan implícitamente del ancho o comportamiento del sidebar anterior
3. que el resaltado del item activo falle en subrutas de detalle o edición
4. que se intente meter badges dinámicos desde la UI en vez del adapter

## Recomendación de PRs

En lugar de un único cambio grande, la recomendación es dividirlo así:

### PR 1

- tipos
- store
- config del rol `content`
- `AppSidebar` visual base

### PR 2

- `AppNavbar` transicional
- `AppSidebarContainer`
- migración de `pages/content/index.tsx`

### PR 3

- migración del resto de páginas `content`
- limpieza de imports
- desuso controlado de `components/Content/SideBar.tsx`

## Decisiones abiertas de esta iteración

Antes de implementar, conviene cerrar estas dos:

1. si `AppNavbar` wrapper se crea en el mismo PR 1 o arranca en PR 2
2. ninguna adicional sobre matcher; ya quedó definida

Decisión ya cerrada:

- `matchMode` vive en cada item
- la resolución se hace mediante una función matcher centralizada
- la función se llamará `isSidebarItemActive`
- vivirá fuera del componente visual, cerca de la lógica de navegación/layout en `features/navigation`
