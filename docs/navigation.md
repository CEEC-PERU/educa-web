## Estructura de archivos

```
features/navigation/
  app-sidebar.types.ts              Tipos compartidos del sistema (incluye SidebarRoleConfig)
  navigation.store.ts               Zustand store para estado de UI del shell
  sidebar.registry.ts               Registro de configs de sidebar por rol
  app-sidebar.content.config.ts     Configuración declarativa del rol `content` (roleId 3)
  AppSidebarContainer.tsx           Container de integración — resuelve rol y delega a AppSidebar
  utils/
    isSidebarItemActive.ts          Función de matching de ruta activa
  selectors/
    getContentSidebarItems.ts       Builder de items con overrides opcionales para `content`

components/navigation/
  AppSidebar.tsx                    Componente visual principal
  AppSidebarItem.tsx                Item de navegación simple
  AppSidebarGroup.tsx               Grupo expandible con hijos
  AppSidebarHeader.tsx              Logo, usuario y botón de colapso
  AppSidebarFooter.tsx              Área de acciones globales (logout)
  AppNavbar.tsx                     Wrapper transicional del navbar superior
```

---

## Tipos (`app-sidebar.types.ts`)

```ts
type AppSidebarItem = {
  id: string;
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  badgeCount?: number;
  isVisible?: boolean;
  children?: AppSidebarItem[];
  action?: "logout";
  matchMode?: "exact" | "prefix";
};

type SidebarRoleConfig = {
  roleId: number; // coincide con el campo `role` del JWT
  label: string;
  items: AppSidebarItem[];
};
```

`matchMode` controla cuándo un item se resalta como activo:

| Valor      | Comportamiento                                                                                                 |
| ---------- | -------------------------------------------------------------------------------------------------------------- |
| `'exact'`  | Solo activo cuando `currentPath === href`                                                                      |
| `'prefix'` | Activo cuando `currentPath` empieza por `href` en un límite de segmento (`/content` no activa `/content-otro`) |

Si se omite `matchMode`, el comportamiento es `'exact'`.

---

## Store de UI (`navigation.store.ts`)

Gestiona el estado visual del shell (collapsed/expanded) con persistencia en `localStorage`.

```ts
import { useNavigationStore } from "@/features/navigation/navigation.store";

const { isSidebarCollapsed, toggleSidebarCollapsed } = useNavigationStore();
```

La clave en `localStorage` es `navigation-ui`. Se persiste automáticamente tras cada cambio.

---

## Función de matching activo (`isSidebarItemActive.ts`)

```ts
import { isSidebarItemActive } from "@/features/navigation/utils/isSidebarItemActive";

isSidebarItemActive(item, currentPath); // → boolean
```

Devuelve `true` si el item debe mostrarse como activo dado el path actual. Usa el campo `matchMode` del item. Es una función pura sin efectos secundarios.

---

## Componente visual (`AppSidebar.tsx`)

### Props

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

### Reglas del componente visual

`AppSidebar` y sus subcomponentes son puramente visuales. No deben:

- Llamar `useAuth`
- Llamar servicios o APIs
- Leer `localStorage` directamente
- Calcular badges

Todo dato dinámico (usuario, badges, path actual) debe llegar por props desde un container o página.

### Items de nav vs items de acción

El componente separa internamente los items según si tienen `action`:

- Items con `href` → renderizados en el área de navegación principal
- Items con `action` → renderizados en el `AppSidebarFooter`

---

## Configuración de rol (`app-sidebar.content.config.ts`)

Define el menú del rol `content` como un array declarativo de `AppSidebarItem`. Esta es la única fuente de verdad para qué items ve un usuario de ese rol.

Los badges **no** se calculan aquí. Si un item necesita un badge dinámico, se inyecta a través del selector (ver abajo).

---

## Selector de items (`getContentSidebarItems.ts`)

```ts
import { getContentSidebarItems } from "@/features/navigation/selectors/getContentSidebarItems";

// Sin overrides (caso más común)
const items = getContentSidebarItems();

// Con badges o visibilidad dinámica
const items = getContentSidebarItems({
  courses: { badgeCount: 3 },
  evaluations: { isVisible: false },
});
```

El selector aplica los overrides sobre la config base y devuelve el array final listo para pasar a `AppSidebar`. No llama APIs — quien llama al selector es responsable de haber resuelto los datos dinámicos antes.

---

## Registro de sidebars por rol (`sidebar.registry.ts`)

`AppSidebarContainer` resuelve el rol del usuario desde el JWT y consulta el registro para obtener los items correctos. No hay switch ni lógica condicional en el container.

```ts
import { getSidebarConfigByRole } from "@/features/navigation/sidebar.registry";

const { items } = getSidebarConfigByRole(roleId); // roleId: number del JWT
```

Roles registrados actualmente:

| roleId | label               | config file                     |
| ------ | ------------------- | ------------------------------- |
| 3      | Gestor de Contenido | `app-sidebar.content.config.ts` |

Si no hay config registrada para un roleId, el registry devuelve la config del rol `content` (roleId 3) como fallback.

### Agregar un nuevo rol

1. Crear `features/navigation/app-sidebar.<rol>.config.ts` con el array de `AppSidebarItem[]`.
2. Agregar una llamada `registerSidebarConfig({ roleId, label, items })` al final de `sidebar.registry.ts`.
3. No hay ningún otro archivo que tocar.

---

## Subcomponentes

| Componente         | Cuándo se usa                                                        |
| ------------------ | -------------------------------------------------------------------- |
| `AppSidebarItem`   | Item simple con `href` o `action`, sin hijos                         |
| `AppSidebarGroup`  | Item con `children`. Gestiona su propio estado expand/collapse local |
| `AppSidebarHeader` | Zona superior: logo, nombre de usuario, botón de colapso             |
| `AppSidebarFooter` | Zona inferior: items con `action` (ej. logout)                       |

`AppSidebarGroup` en estado colapsado muestra solo el icono y navega al primer hijo al hacer clic. En PR 1 ningún item del rol `content` tiene hijos, pero el componente ya lo soporta para futuros roles.

---

## AppNavbar (`AppNavbar.tsx`)

Wrapper transicional del componente `Navbar` existente. Normaliza el naming del navbar superior sin modificar su implementación ni los 200+ usos existentes del componente original.

```tsx
import AppNavbar from "@/components/navigation/AppNavbar";

<AppNavbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />;
```

Acepta exactamente las mismas props que `Navbar`. Cuando se decida evolucionar el navbar, `AppNavbar` es el punto de cambio: las páginas migradas no necesitan otra modificación.

---

## Container de integración (`AppSidebarContainer.tsx`)

Capa que conecta los datos del sistema con el componente visual `AppSidebar`. Es el único lugar donde se combinan autenticación, store y routing.

Responsabilidades:

- Lee `logout`, `profileInfo` y `user` desde `useAuth()`
- Lee `isSidebarCollapsed` y `toggleSidebarCollapsed` desde `useNavigationStore()`
- Obtiene el path actual desde `useRouter().pathname`
- Resuelve el `roleId` del usuario y consulta `getSidebarConfigByRole(roleId)` para obtener los items
- Pasa todo como props puras a `AppSidebar`

```tsx
import AppSidebarContainer from "@/features/navigation/AppSidebarContainer";

<AppSidebarContainer />;
```

No recibe props. Toda la lógica de integración está encapsulada dentro.

---

## Layout de una página con sidebar (PR 4)

Desde PR 4, todas las páginas del módulo `content` usan el patrón `AppLayout` + `getLayout`. El layout completo (ProtectedRoute, AppNavbar, AppSidebarContainer, margen dinámico) está encapsulado en `AppLayout` — las páginas solo declaran su contenido.

```tsx
import type { NextPageWithLayout } from "@/types/next";
import AppLayout from "@/components/layouts/AppLayout";

const MiPagina: NextPageWithLayout = () => {
  return <>{/* contenido de la página */}</>;
};

MiPagina.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default MiPagina;
```

`AppLayout` internamente:

- Envuelve en `<ProtectedRoute>`
- Renderiza `<AppNavbar>` con el color corporativo por defecto
- Renderiza `<AppSidebarContainer>`
- Aplica el margen dinámico `ml-16` / `ml-64` según `isSidebarCollapsed`

### Props de `AppLayout`

```ts
type AppLayoutProps = {
  children: ReactNode;
  noPadding?: boolean; // omite el p-6 del <main>, útil para páginas full-bleed
  navbarColor?: string; // color Tailwind del navbar; por defecto: gradiente azul→violeta
};
```

### Patrón legacy (solo referencia histórica)

> ⚠️ El patrón siguiente fue eliminado en PR 4. No debe usarse en páginas nuevas.

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
            {/* contenido de la página */}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
```

---

## Estado de migración (PR 4)

**Migración completada.** Todas las páginas del módulo `content` usan `AppLayout` + `getLayout` (PR 4). El boilerplate manual de PR 3 (AppNavbar + AppSidebarContainer + ProtectedRoute + margen dinámico) ha sido eliminado de las 18 páginas.

### Archivos nuevos en PR 4

| Archivo                            | Descripción                                                 |
| ---------------------------------- | ----------------------------------------------------------- |
| `components/layouts/AppLayout.tsx` | Layout compartido con ProtectedRoute, navbar y sidebar      |
| `types/next.ts`                    | Tipos `NextPageWithLayout` y `AppPropsWithLayout`           |
| `pages/_app.tsx` (actualizado)     | Lee `Component.getLayout` para aplicar el layout por página |

### Páginas migradas (`pages/content/`)

| Página                            | Estado     |
| --------------------------------- | ---------- |
| `index.tsx`                       | ✅ migrada |
| `category.tsx`                    | ✅ migrada |
| `flashcards.tsx`                  | ✅ migrada |
| `professors.tsx`                  | ✅ migrada |
| `module.tsx`                      | ✅ migrada |
| `session.tsx`                     | ✅ migrada |
| `[id].tsx`                        | ✅ migrada |
| `addProfessor.tsx`                | ✅ migrada |
| `addSession.tsx`                  | ✅ migrada |
| `editSession.tsx`                 | ✅ migrada |
| `detailProfessor.tsx`             | ✅ migrada |
| `detailModule.tsx`                | ✅ migrada |
| `detailFlashcard.tsx`             | ✅ migrada |
| `addCourse.tsx`                   | ✅ migrada |
| `editCourse.tsx`                  | ✅ migrada |
| `addFlashcard.tsx`                | ✅ migrada |
| `evaluation/index.tsx`            | ✅ migrada |
| `evaluation/detailEvaluation.tsx` | ✅ migrada |
