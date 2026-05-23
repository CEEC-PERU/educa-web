# Propuesta técnica: AppLayout

## Objetivo

Introducir un componente `AppLayout` que encapsule el shell visual de una página (navbar superior + sidebar + área de contenido) y eliminé la repetición del mismo boilerplate de navegación en las 18 páginas del módulo `content`.

El objetivo no es solo quitar imports repetidos. Es establecer una separación clara entre **shell de aplicación** y **contenido de página**, lo que simplifica futuras iteraciones del shell sin afectar las páginas.

---

## Problema actual

Después del PR 3 de migración, cada una de las 18 páginas de `pages/content/` repite este bloque de layout:

```tsx
import AppNavbar from "@/components/navigation/AppNavbar";
import AppSidebarContainer from "@/features/navigation/AppSidebarContainer";
import { useNavigationStore } from "@/features/navigation/navigation.store";

export default function MiPagina() {
  const isSidebarCollapsed = useNavigationStore((s) => s.isSidebarCollapsed);

  return (
    <ProtectedRoute>
      <div className="relative min-h-screen flex flex-col">
        <AppNavbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
        <div className="flex flex-1 pt-16">
          <AppSidebarContainer />
          <main
            className={`p-6 flex-grow transition-all duration-300 ease-in-out ${
              isSidebarCollapsed ? "ml-16" : "ml-64"
            }`}
          >
            {/* contenido */}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
```

Consecuencias directas:

1. Cambiar el `bgColor` del navbar exige tocar 18 archivos
2. Cambiar el margen `ml-16` / `ml-64` exige tocar 18 archivos
3. Cambiar la clase del `<main>` exige tocar 18 archivos
4. Añadir un `<ProtectedRoute>` distinto, un banner global o un breadcrumb exige tocar 18 archivos
5. Las páginas mezclan lógica de negocio con preocupaciones de shell

---

## Solución propuesta

### Patrón: `getLayout` de Next.js Pages Router

Next.js Pages Router tiene un patrón oficial para layouts por página: la función `getLayout`.

Cada página declara su layout de forma estática. `_app.tsx` lo aplica. Las páginas en sí devuelven únicamente su contenido.

```tsx
// Cada página
export default function MiPagina() {
  return <div>{/* solo contenido */}</div>;
}

MiPagina.getLayout = (page: ReactElement) => <AppLayout>{page}</AppLayout>;
```

```tsx
// pages/_app.tsx
const getLayout = Component.getLayout ?? ((page) => page);
return getLayout(<Component {...pageProps} />);
```

### Componente `AppLayout`

Incorpora todas las decisiones cerradas: `ProtectedRoute` incluido, `navbarColor` configurable con default, `noPadding` opcional, sidebar dinámico por rol via `AppSidebarContainer`.

```tsx
// components/layouts/AppLayout.tsx
import type { ReactNode } from "react";
import AppNavbar from "@/components/navigation/AppNavbar";
import AppSidebarContainer from "@/features/navigation/AppSidebarContainer";
import { useNavigationStore } from "@/features/navigation/navigation.store";
import ProtectedRoute from "@/components/ScreenSecurity";

const DEFAULT_NAVBAR_COLOR =
  "bg-gradient-to-r from-blue-500 to-violet-500 opacity-90";

type AppLayoutProps = {
  children: ReactNode;
  noPadding?: boolean;
  navbarColor?: string;
};

export default function AppLayout({
  children,
  noPadding = false,
  navbarColor = DEFAULT_NAVBAR_COLOR,
}: AppLayoutProps) {
  const isSidebarCollapsed = useNavigationStore((s) => s.isSidebarCollapsed);

  return (
    <ProtectedRoute>
      <div className="relative min-h-screen flex flex-col">
        <AppNavbar bgColor={navbarColor} />
        <div className="flex flex-1 pt-16">
          <AppSidebarContainer />
          <main
            className={`flex-grow transition-all duration-300 ease-in-out ${
              isSidebarCollapsed ? "ml-16" : "ml-64"
            } ${noPadding ? "" : "p-6"}`}
          >
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
```

`AppSidebarContainer` resuelve internamente qué items mostrar según el rol y permisos del usuario activo. `AppLayout` no tiene condicionales por rol.

### Resultado en cada página

```tsx
// pages/content/category.tsx — antes
import AppNavbar from "@/components/navigation/AppNavbar";
import AppSidebarContainer from "@/features/navigation/AppSidebarContainer";
import { useNavigationStore } from "@/features/navigation/navigation.store";

export default function Categorias() {
  const isSidebarCollapsed = useNavigationStore((s) => s.isSidebarCollapsed);
  return (
    <ProtectedRoute>
      <div className="relative min-h-screen flex flex-col">
        <AppNavbar bgColor="..." />
        <div className="flex flex-1 pt-16">
          <AppSidebarContainer />
          <main className={`... ${isSidebarCollapsed ? "ml-16" : "ml-64"}`}>
            {/* contenido */}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
```

```tsx
// pages/content/category.tsx — después
import AppLayout from "@/components/layouts/AppLayout";

export default function Categorias() {
  return <div>{/* solo contenido */}</div>;
}

Categorias.getLayout = (page: ReactElement) => <AppLayout>{page}</AppLayout>;
```

---

## Tipado necesario en `_app.tsx`

Para que TypeScript reconozca `getLayout` en los componentes de página:

```ts
// types/next.d.ts o declarations.d.ts
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import type { ReactElement, ReactNode } from "react";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};
```

```tsx
// pages/_app.tsx
import type { AppPropsWithLayout } from "@/types/next";

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  return getLayout(<Component {...pageProps} />);
}
```

---

## Estructura de archivos

```text
components/
  layouts/
    AppLayout.tsx         Layout principal del shell (navbar + sidebar + main)
    // futuros:
    // AdminLayout.tsx
    // StudentLayout.tsx
    // GuestLayout.tsx
```

Se usa `components/layouts/` en lugar de `features/` porque `AppLayout` es un componente visual, no una feature de dominio.

---

## Extensibilidad futura

### Props opcionales para variaciones menores

Si algunas páginas necesitan padding distinto, sin contenido de sidebar, o sin un `ProtectedRoute`:

```tsx
type AppLayoutProps = {
  children: ReactNode;
  noPadding?: boolean; // útil para páginas con tabla full-width
  sidebar?: ReactNode; // permite inyectar un sidebar distinto en el futuro
};
```

### Layouts por rol

Una vez migrado `content`, el mismo patrón aplica a otros roles:

```tsx
AdminPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
StudentPage.getLayout = (page) => <StudentLayout>{page}</StudentLayout>;
```

Cada layout puede encapsular su propio `AppSidebarContainer` de rol sin compartir estado ni configuración con los demás.

---

## Decisiones abiertas

### 1. ¿`ProtectedRoute` vive dentro o fuera de `AppLayout`?

**Situación actual**: cada página envuelve todo con `<ProtectedRoute>` dentro de su propio JSX.

**Opciones**:

A. `ProtectedRoute` dentro de `AppLayout` — la protección queda automáticamente en todas las páginas que usen el layout. Sin repetición.

B. `ProtectedRoute` fuera de `AppLayout` — el caller decide si proteger la página. El layout es agnóstico a la autenticación.

C. `ProtectedRoute` en `_app.tsx` — basado en la ruta, decide si aplicar autenticación antes de renderizar cualquier layout.

**Consideraciones**:

- La opción A es la más simple y cubre el caso de uso mayoritario del proyecto.
- La opción B es más flexible si alguna página bajo `/content/` debe ser pública.
- La opción C centraliza la autenticación pero requiere una estrategia de rutas protegidas más elaborada (ej. lista de rutas públicas).

**Decisión: opción A.** `ProtectedRoute` vive dentro de `AppLayout`. Todas las páginas que usen el layout quedan protegidas automáticamente. Si en el futuro aparece una página bajo `/content/` que deba ser pública, se resuelve no asignando `getLayout` en esa página.

---

### 2. ¿`AppLayout` es único o hay uno por rol?

**Opciones**:

A. Un único `AppLayout` que recibe el `AppSidebarContainer` como prop o lo resuelve internamente según el rol activo del usuario.

B. Un `AppLayout` por rol: `ContentLayout`, `AdminLayout`, `StudentLayout`, etc., cada uno con su sidebar hardcodeado.

**Consideraciones**:

- La opción A minimiza la cantidad de componentes de layout pero acoplado al rol activo en runtime.
- La opción B es más explícita: cada página sabe qué layout usa sin necesidad de lógica de rol dentro del layout. Es más fácil de entender, testear y mantener. Es el patrón recomendado cuando los layouts son visualmente distintos entre roles.
- Dado que los distintos roles del sistema tienen sidebars y colores distintos, la opción B es más sostenible a largo plazo.

**Decisión: opción A con variación.** Un único `AppLayout` compartido, pero los items de navegación, módulos visibles y acciones disponibles se resuelven dinámicamente en función del rol y los permisos del usuario activo. `AppSidebarContainer` ya encapsula esa lógica de selección. El layout en sí no tiene condicionales por rol: recibe lo que el container le pasa. Esto mantiene el componente visual limpio y permite que la variación por rol esté confinada en los selectores y containers de `features/navigation`.

---

### 3. ¿El `<main>` con `p-6` pertenece al layout o a la página?

**Situación**: el layout actual incluye `p-6` en `<main>`. Algunas páginas podrían necesitar un contenido sin padding (tablas full-width, dashboards con tiles que tocan el borde, etc.).

**Opciones**:

A. Padding en el layout por defecto, con una prop `noPadding` para desactivarlo.

B. Sin padding en el layout. Cada página aplica su propio padding en su contenido raíz.

C. Padding en el layout siempre, sin excepción. Las páginas que quieran romper el padding usan márgenes negativos.

**Consideraciones**:

- La opción A equilibra conveniencia y flexibilidad con una prop simple.
- La opción B obliga a repetir `p-6` en cada página pero da control total. No mejora mucho sobre la situación actual.
- La opción C es la más restrictiva y puede crear problemas en casos reales de diseño.

**Decisión: opción A.** Padding `p-6` incluido por defecto en el `<main>` del layout. `AppLayout` acepta una prop `noPadding?: boolean` para desactivarlo en páginas que lo necesiten (tablas full-width, dashboards con tiles, reproductores, etc.). Se pasa desde `getLayout`:

```tsx
MiPagina.getLayout = (page) => <AppLayout noPadding>{page}</AppLayout>;
```

---

### 4. ¿Cómo manejar páginas de la misma ruta que no usan el layout?

Ejemplo: una futura página `/content/preview` que renderice un SCORM o un video en fullscreen sin navbar ni sidebar.

**Opciones**:

A. No declarar `getLayout` — `_app.tsx` no aplica ningún layout (ya manejado por el patrón `getLayout ?? identity`).

B. Declarar `getLayout = (page) => page` explícitamente para que quede visible en el código de la página.

**Consideraciones**:

- La opción A funciona por defecto sin cambios. El riesgo es que la ausencia de `getLayout` no sea obvia para quien lea el código.
- La opción B añade una línea pero hace explícita la intención.

**Decisión: opción A.** El layout no es un wrapper global obligatorio sino una composición declarativa por sección o ruta. Las páginas que no necesiten el shell (login, SCORM fullscreen, error pages) simplemente no declaran `getLayout` y `_app.tsx` las renderiza sin ningún wrapper. No se añade ningún `getLayout = (page) => page` explícito: la ausencia es la convención.

---

### 5. ¿El `bgColor` del navbar es fijo en `AppLayout` o configurable?

**Situación**: actualmente `bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90"` está repetido en las 18 páginas. Con `AppLayout`, se centraliza en un lugar.

**Opciones**:

A. Hardcodeado en `AppLayout` — valor único, sin prop. Cambio en un lugar afecta todo el módulo.

B. Prop con default — `AppLayout` acepta `navbarColor?: string` con el gradiente actual como valor por defecto.

C. Constante exportada — definir `CONTENT_NAVBAR_COLOR` en un archivo de constantes y usarla en `AppLayout`.

**Consideraciones**:

- La opción A es la más simple si el color no varía dentro del módulo `content`.
- La opción B añade flexibilidad innecesaria si el color es uniforme en todos los layouts del mismo rol.
- La opción C desacopla el valor del componente, útil si el mismo color se usa en otros contextos (e.g., para emails, para SVGs de splash).

**Decisión: opción B.** `AppLayout` acepta una prop `navbarColor?: string` con el gradiente actual como valor por defecto. Dado que la decisión 2 establece un único `AppLayout` compartido entre roles, y cada rol puede tener un color de navbar distinto, la prop es necesaria. El default cubre el caso `content` sin que las páginas tengan que pasarlo explícitamente:

```tsx
// Valor por defecto en AppLayout
const DEFAULT_NAVBAR_COLOR = "bg-gradient-to-r from-blue-500 to-violet-500 opacity-90";

export default function AppLayout({
  children,
  noPadding = false,
  navbarColor = DEFAULT_NAVBAR_COLOR,
}: AppLayoutProps) { ... }
```

Las páginas que usen un color distinto lo pasan desde `getLayout`:

```tsx
MiPagina.getLayout = (page) => (
  <AppLayout navbarColor="bg-red-600">{page}</AppLayout>
);
```

---

## Estrategia de migración sugerida

### Fase 1 — Crear `AppLayout` y adaptar `_app.tsx`

- Crear `components/layouts/AppLayout.tsx`
- Añadir `NextPageWithLayout` al tipado en `declarations.d.ts`
- Actualizar `pages/_app.tsx` para usar `getLayout`
- No modificar ninguna página todavía

### Fase 2 — Migrar páginas `content` una a una (o en batch)

- Retirar los imports de `AppNavbar`, `AppSidebarContainer`, `useNavigationStore` de cada página
- Retirar el JSX de layout de cada página
- Añadir `MiPagina.getLayout = (page) => <AppLayout>{page}</AppLayout>`

### Fase 3 — Aplicar el patrón a nuevos roles

- Crear `AdminLayout`, `StudentLayout`, etc.
- Migrar sus páginas al mismo patrón

---

## Riesgos

1. Si `_app.tsx` ya tiene wrappers globales (context providers, error boundaries), la integración de `getLayout` debe preservarlos
2. Si `ProtectedRoute` queda dentro del layout, un error de autenticación bloqueará el render del layout completo incluyendo el navbar, lo que puede ser inesperado
3. Páginas con SSR / `getServerSideProps` que dependan del estado del sidebar deben gestionar la hidratación con cuidado (Zustand + `localStorage` puede causar diferencias entre servidor y cliente)
4. Si se decide tener props en `AppLayout`, deben pasarse a través de `getLayout` — no pueden venir de `pageProps`

---

## Recomendación técnica

La propuesta está cerrada con las siguientes decisiones:

| Decisión            | Elección                                                                |
| ------------------- | ----------------------------------------------------------------------- |
| `ProtectedRoute`    | Dentro de `AppLayout`                                                   |
| Variación por rol   | Un único `AppLayout`; sidebar dinámico vía `AppSidebarContainer`        |
| Padding en `<main>` | `p-6` por defecto; prop `noPadding` para desactivarlo                   |
| Páginas sin layout  | Sin `getLayout` — ausencia es la convención                             |
| Color del navbar    | Prop `navbarColor` con default `from-blue-500 to-violet-500 opacity-90` |

Plan de implementación (PR 4):

1. Crear `components/layouts/AppLayout.tsx` con el diseño acordado
2. Añadir los tipos `NextPageWithLayout` / `AppPropsWithLayout` en `declarations.d.ts`
3. Actualizar `pages/_app.tsx` para usar `getLayout`
4. Migrar las 18 páginas de `pages/content/`: retirar boilerplate de layout, añadir `getLayout`
5. Actualizar `docs/navigation.md` con el nuevo patrón
