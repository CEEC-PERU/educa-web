# Propuesta técnica: separación entre `PublicNavbar` y `AppNavbar`

## Objetivo

Definir una estrategia clara para separar la navegación superior pública de la navegación superior de la aplicación autenticada.

La meta no es solo renombrar componentes. La meta es corregir una mezcla de responsabilidades que hoy hace que un mismo navbar resuelva contextos distintos:

- landing pública
- acceso al login
- avatar y estado autenticado
- integración con sidebar móvil
- accesos a dashboard interno

La propuesta busca dejar una base más predecible, modular y fácil de mantener sin exigir una reescritura masiva inmediata.

---

## Problema actual

Hoy `components/Navbar.tsx` funciona como un componente híbrido.

Resuelve al mismo tiempo:

1. navegación pública para la landing
2. render de links opcionales de marketing
3. botón de login
4. avatar de usuario autenticado
5. acceso a `/student`
6. botón de menú móvil vía `toggleSidebar`

Eso genera varios problemas:

1. la API del componente es ambigua
2. hay props que solo tienen sentido en un contexto específico
3. el componente mezcla shell público y shell autenticado
4. el flujo por rol no está explícito
5. `components/navigation/AppNavbar.tsx` hoy no abstrae nada: solo reexporta el navbar legacy
6. cualquier cambio visual o funcional en la landing arriesga romper pantallas internas, y viceversa

En términos de arquitectura, el problema real es este: **la decisión de qué navbar renderizar no está modelada explícitamente**.

---

## Decisión propuesta

Separar el sistema en dos componentes con responsabilidades explícitas:

1. `PublicNavbar`
2. `AppNavbar`

### `PublicNavbar`

Debe representar exclusivamente la navegación superior del sitio público o pre-login.

Responsabilidades:

- logo / marca
- links públicos
- CTA o acceso a login
- comportamiento responsive de la landing

No debe:

- conocer usuario autenticado
- recibir `toggleSidebar`
- resolver logout
- decidir rutas por rol
- mostrar avatar o menú de cuenta

### `AppNavbar`

Debe representar exclusivamente la navegación superior de la aplicación autenticada.

Responsabilidades:

- branding de app interna
- botón para abrir/cerrar sidebar móvil o drawer
- avatar y acciones de usuario
- integración con el shell autenticado
- acceso consistente a perfil, dashboard o logout
- lectura del usuario autenticado desde `AuthContext`

No debe:

- renderizar navegación pública de marketing
- mezclar CTA de landing con avatar autenticado
- asumir que todos los usuarios autenticados son `student`

---

## Principios de diseño

1. La página o layout debe decidir qué navbar usar.
2. Los componentes deben tener APIs pequeñas y semánticas.
3. El navbar autenticado debe modelar la app interna, no la landing.
4. El navbar público no debe depender del contexto de autenticación.
5. La migración debe ser incremental para no romper páginas legacy.

---

## Estado actual relevante

Superficies ya identificadas:

- `components/Navbar.tsx`
- `components/navigation/AppNavbar.tsx`
- `app/page.tsx`
- múltiples pantallas internas que usan el navbar actual con props como `user`, `toggleSidebar` o `showMenuButton`

Esto indica que la separación no debe empezar por una búsqueda estética, sino por la extracción de responsabilidades.

---

## Estructura objetivo

```text
components/
  navigation/
    AppNavbar.tsx
    PublicNavbar.tsx
    UserMenu.tsx

components/
  Navbar.tsx            Wrapper transicional o alias temporal
```

### Rol de cada archivo

#### `components/navigation/PublicNavbar.tsx`

Componente principal del navbar público.

#### `components/navigation/AppNavbar.tsx`

Componente principal del navbar autenticado.

#### `components/navigation/UserMenu.tsx`

Subcomponente del navbar autenticado para avatar y acciones de cuenta.

#### `components/Navbar.tsx`

Wrapper transicional.

Opciones de transición:

1. dejarlo apuntando temporalmente a `PublicNavbar`
2. marcarlo como legacy y migrar imports progresivamente
3. eliminarlo cuando no haya consumidores

La mejor estrategia depende del ritmo de migración que se quiera asumir.

---

## Diseño propuesto por componente

## `PublicNavbar`

### Props sugeridas

```ts
type PublicNavbarLink = {
  href: string;
  label: string;
};

type PublicNavbarProps = {
  links?: PublicNavbarLink[];
  loginHref?: string;
  className?: string;
  variant?: "landing" | "minimal";
};
```

### Comportamiento esperado

- render del logo
- render opcional de links públicos
- acceso a login
- posibilidad de variante visual `landing` o `minimal`

### Reglas

- no recibe `user`
- no recibe `toggleSidebar`
- no conoce `AuthContext`
- no debería renderizar iconos de cuenta

---

## `AppNavbar`

### Props sugeridas

```ts
type AppNavbarProps = {
  onToggleSidebar?: () => void;
  showMenuButton?: boolean;
  title?: string;
};
```

El usuario autenticado no se pasa por props en la propuesta base.

`AppNavbar` debe leerlo desde `AuthContext` para evitar plumbing innecesario en cada layout o página.

### Comportamiento esperado

- render del logo
- render del botón móvil de menú cuando aplique
- render de avatar o fallback de usuario
- render de dropdown de cuenta
- integración con el shell autenticado
- lectura del perfil autenticado desde contexto

### Reglas

- no renderiza links de marketing
- no asume `LOGIN` como CTA principal
- no hardcodea `/student` para todos los contextos
- el destino principal del usuario debe resolverse por config declarativa de navegación

---

## Subcomponentes propuestos

## `UserMenu`

Responsabilidad:

- renderizar avatar
- abrir dropdown o panel de acciones
- exponer acciones como perfil y logout

Beneficio:

- desacopla el navbar autenticado del detalle de cuenta

---

## Estrategia de migración

La migración debe ser incremental.

No conviene reemplazar todos los usos del navbar en una sola pasada porque hoy el componente actual está presente en varias superficies internas y públicas.

### Fase 1. Extracción sin ruptura

Objetivo:

- introducir `PublicNavbar` y `AppNavbar`
- mantener compatibilidad temporal

Acciones:

1. crear `PublicNavbar.tsx` extrayendo la parte pública del navbar actual
2. crear `AppNavbar.tsx` extrayendo la parte autenticada del navbar actual
3. introducir contrato de branding por tenant para público y autenticado
4. extraer `UserMenu.tsx` con dropdown de `Perfil` y `Cerrar sesión`
5. dejar `components/Navbar.tsx` como wrapper temporal

### Fase 2. Migración de puntos de entrada principales

Objetivo:

- explicitar qué shell usa cada superficie principal

Acciones:

1. cambiar `app/page.tsx` para usar `PublicNavbar`
2. cambiar `components/navigation/AppNavbar.tsx` para que sea el navbar autenticado real y no un alias legacy
3. validar las áreas autenticadas que ya consumen navbar con `user` y `toggleSidebar`

### Fase 3. Limpieza y retiro de legacy

Objetivo:

- eliminar ambigüedad y deuda residual

Acciones:

1. migrar imports restantes desde `components/Navbar.tsx`
2. revisar props legacy que ya no tengan sentido
3. eliminar hardcodes de rutas como `/student` cuando correspondan a lógica de rol
4. retirar wrapper legacy si ya no tiene consumidores

---

## Checklist detallado de tareas

## Preparación

- [ ] identificar todos los consumidores actuales de `components/Navbar.tsx`
- [ ] clasificar esos consumidores en públicos vs autenticados
- [ ] identificar qué props usa cada grupo (`user`, `toggleSidebar`, `links`, `showMenuButton`, etc.)
- [ ] confirmar si el landing principal seguirá siendo `app/page.tsx`
- [ ] validar si `AppNavbar` debe convivir temporalmente con el navbar legacy en algunas pantallas

## Diseño de API

- [ ] definir contrato final de `PublicNavbarProps`
- [ ] definir contrato final de `AppNavbarProps`
- [x] `AppNavbar` leerá el usuario desde `AuthContext`
- [x] `UserMenu` será un dropdown real
- [ ] definir si el navbar autenticado mostrará título de sección o solo marca + acciones

## Implementación de `PublicNavbar`

- [ ] crear `components/navigation/PublicNavbar.tsx`
- [ ] mover los links públicos actuales a una API explícita
- [ ] aislar el CTA/login público
- [ ] asegurar responsive móvil sin dependencias de sidebar autenticado
- [ ] validar visualmente la landing principal

## Implementación de `AppNavbar`

- [ ] convertir `components/navigation/AppNavbar.tsx` en componente real
- [ ] leer el usuario autenticado desde `AuthContext`
- [ ] extraer la lógica del avatar a `UserMenu.tsx`
- [ ] implementar dropdown con acciones `Perfil` y `Cerrar sesión`
- [ ] aislar el botón de menú móvil para integración con sidebar
- [ ] reemplazar hardcodes de `/student` por config declarativa de navegación
- [ ] definir fallback visual cuando no exista `profilePicture`
- [ ] validar que el navbar autenticado no renderice enlaces públicos por error

## Integración con shell autenticado

- [ ] identificar layouts o páginas que hoy usan `toggleSidebar`
- [ ] validar compatibilidad del nuevo `AppNavbar` con sidebars existentes
- [ ] normalizar el nombre del callback (`toggleSidebar` vs `onToggleSidebar`)
- [ ] revisar si `showMenuButton` sigue siendo necesario o debe derivarse del layout
- [ ] comprobar que el navbar autenticado se comporte bien en mobile y desktop

## Migración de consumidores

- [ ] migrar `app/page.tsx` a `PublicNavbar`
- [ ] migrar los puntos de entrada autenticados prioritarios a `AppNavbar`
- [ ] verificar pantallas de `student`
- [ ] verificar pantallas de `content`
- [ ] verificar pantallas de `admin`
- [ ] verificar pantallas de `supervisor`
- [ ] verificar pantallas especiales que hoy usan `user` con shapes distintas

## Compatibilidad temporal

- [ ] decidir si `components/Navbar.tsx` quedará como alias temporal a `PublicNavbar`
- [ ] en caso de mantener wrapper, documentar que es legacy
- [ ] evitar agregar nuevas dependencias sobre el wrapper legacy
- [ ] planificar el retiro del wrapper una vez migrados los consumidores

## Endurecimiento técnico

- [ ] tipar de forma consistente la entidad `user` consumida por `AppNavbar`
- [ ] definir contrato de navegación declarativa para destino principal, perfil y acciones por rol si aplica
- [ ] revisar accesibilidad del menú de usuario
- [ ] revisar estados hover/focus/keyboard del navbar público y autenticado
- [ ] validar que ninguna pantalla autenticada dependa implícitamente del navbar público

## Limpieza final

- [ ] eliminar props que ya no existan en la API final
- [ ] eliminar rutas hardcodeadas incorrectas
- [ ] eliminar imports legacy restantes
- [ ] retirar `components/Navbar.tsx` si ya no tiene uso real
- [ ] actualizar documentación técnica del sistema de navegación

---

## Riesgos a controlar

1. intentar resolver navbar, sidebar, perfil y logout en un solo refactor
2. dejar que `AppNavbar` siga dependiendo de contratos de usuario inconsistentes entre roles
3. mantener rutas hardcodeadas que solo sirven para `student`
4. seguir usando `components/Navbar.tsx` como componente ambiguo demasiado tiempo

---

## Decisiones abiertas

Estas son las decisiones que siguen abiertas después de fijar los criterios principales.

### 1. Fuente de datos del usuario en `AppNavbar`

Decisión tomada:

- `AppNavbar` leerá el usuario desde `AuthContext`

Pendiente por definir:

- qué shape mínima expondrá el contexto al navbar
- si conviene crear un selector o adapter para no acoplar el componente a estructuras legacy del perfil

### 2. Naturaleza del `UserMenu`

Decisión tomada:

- `UserMenu` será un dropdown con `Perfil` y `Cerrar sesión`

Pendiente por definir:

- si el dropdown mostrará además nombre, rol o email
- si debe cerrarse con click outside y tecla `Escape` en la primera iteración

### 3. Resolución de ruta principal autenticada

Decisión tomada:

- la navegación autenticada debe resolverse mediante config declarativa

Pendiente por definir:

- dónde vivirá esa config (`features/navigation` es la opción más coherente)
- si el perfil y logout estarán también modelados en esa config o solo los destinos principales

### 4. Wrapper legacy `components/Navbar.tsx`

Decisión tomada:

- `components/Navbar.tsx` se mantiene por ahora
- se eliminará una vez migrados todos los consumidores

Pendiente por definir:

- si se mantiene como alias directo a `PublicNavbar` o como wrapper legacy transitorio

---

## Recomendación inicial

Para minimizar riesgo y mantener claridad:

1. `PublicNavbar` como navbar exclusivo de landing y pre-login
2. `AppNavbar` como navbar exclusivo de aplicación autenticada
3. `AppNavbar` leyendo usuario desde `AuthContext`
4. `UserMenu` con dropdown de `Perfil` y `Cerrar sesión`
5. navegación autenticada resuelta con config declarativa
6. `components/Navbar.tsx` se mantiene durante la migración

---

## FASES POSTERIORES / EXTENSIONES FUTURAS

### Branding desacoplado por tenant

Esta sección documenta funcionalidad que está explícitamente **FUERA DEL ALCANCE INMEDIATO** de esta propuesta y se reserva para fases posteriores.

**Contexto:**

Una promesa futura del producto es el branding por tenant, donde la identidad visual de la landing pública puede ser distinta de la identidad del shell autenticado, y ambas pueden cambiar según el tenant.

**Por qué se defiere:**

La separación de navbares (`PublicNavbar`, `AppNavbar`) es la base necesaria para permitir branding independiente después. Resolver branding ahora mismo añadiría complejidad innecesaria a la Fase 1.

**Qué sería en Fase 2+:**

1. `PublicNavbar` podría resolver colores, logo y marca desde una configuración por tenant
2. `AppNavbar` podría resolver colores, logo y marca desde una configuración distinta por tenant
3. ambas configuraciones vivirían en `features/branding/`
4. la fuente de verdad sería el endpoint `/me` de auth, que expondría perfiles de branding

**Modelo conceptual sugerido (no implementar aún):**

```ts
type TenantNavbarBrand = {
  logoSrc: string;
  alt: string;
  homeHref: string;
  colors?: {
    background: string;
    foreground: string;
    accent?: string;
    border?: string;
  };
};

type TenantBrandConfig = {
  tenantId: string | number;
  publicBrand: TenantNavbarBrand;
  appBrand: TenantNavbarBrand;
};
```

**Beneficio de la estructura Fase 1:**

Al separar `PublicNavbar` y `AppNavbar` ahora mismo, la futura adición de branding por tenant será una extensión, no una refactorización.

**Acciones para Fase 2+ (cuando se reabra el trabajo):**

- [ ] crear `features/branding/` con tipos y selectores de branding
- [ ] actualizar respuesta de `/me` para exponer branding por tenant
- [ ] actualizar `PublicNavbar` para consumir branding público
- [ ] actualizar `AppNavbar` para consumir branding autenticado
- [ ] soportar colores del navbar personalizados por tenant
- [ ] validar fallbacks cuando branding no esté disponible

---

## Resultado esperado

Si esta propuesta se ejecuta bien, el sistema de navegación superior debería quedar con estas propiedades:

1. intención explícita en cada superficie
2. menor mezcla entre marketing y shell interno
3. APIs de componentes más pequeñas
4. menos riesgo de regresión al tocar navbar público o autenticado
5. mejor base para seguir modularizando la navegación del producto
6. **fundación sólida para agregar branding por tenant en fases posteriores**
