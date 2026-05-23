# MentorMind Frontend

Frontend principal de la plataforma educativa MentorMind. Este repositorio contiene la experiencia web para usuarios con distintos roles operativos, incluyendo estudiante, corporate, supervisor, content, admin y variantes corporativas.

## Estado actual

El proyecto está en una etapa funcional, pero todavía en transición hacia una arquitectura frontend más enterprise. Hoy combina una base Next.js con múltiples módulos de negocio, capa de servicios propia, autenticación en cliente y rutas por rol.

Situación actual relevante:

- La aplicación utiliza Next.js 14 con coexistencia de `app/` y `pages/`.
- La mayor parte del producto operativo vive actualmente en `pages/`.
- Existen hooks y servicios personalizados para el consumo de APIs.
- La base necesita normalización progresiva para quedar alineada con estándares enterprise.

Este README documenta el estado real del proyecto para facilitar onboarding, mantenimiento y evolución arquitectónica.

## Stack principal

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Axios
- Chart.js / ApexCharts
- Socket.IO Client
- PDF utilities (`pdf-lib`, `jspdf`)

## Scripts disponibles

```bash
npm run dev
npm run build
npm run start
npm run lint
```

Descripción:

- `npm run dev`: inicia el entorno local de desarrollo.
- `npm run build`: genera el build de producción.
- `npm run start`: levanta la aplicación compilada en el puerto `8080`.
- `npm run lint`: ejecuta el lint de Next.js.

## Requisitos locales

Antes de ejecutar el proyecto, validar lo siguiente:

- Node.js 18 o superior.
- npm 9 o superior.
- Backend/API accesible desde el entorno local.
- Variables o configuración de endpoints ajustadas al entorno activo.

## Instalación

```bash
npm install
```

Luego iniciar el entorno:

```bash
npm run dev
```

Por defecto Next.js expone la aplicación en:

```bash
http://localhost:3000
```

## Configuración de entorno

Actualmente parte de la configuración del proyecto sigue hardcodeada en utilidades de endpoints. En particular, la URL base de la API está definida en:

- `utils/Endpoints.ts`

Estado actual:

- La `baseURL` está apuntando a `http://localhost:4100`.
- La URL de socket está configurada por separado.
- Todavía no existe una estrategia completa y tipada de variables de entorno.

Recomendación de trabajo:

- No agregar nuevos endpoints hardcodeados.
- Toda nueva configuración debe tender a moverse a variables de entorno.
- Si se cambia el backend local o remoto, revisar primero `utils/Endpoints.ts`.

## Estructura del proyecto

Resumen de carpetas principales:

```text
app/           Shell parcial con App Router
pages/         Superficie principal actual de rutas y módulos
components/    Componentes compartidos y por dominio/rol
context/       Contextos globales, principalmente autenticación
hooks/         Hooks de datos, UI y lógica de negocio acoplada
services/      Consumo de APIs y helpers de acceso remoto
interfaces/    Contratos y tipos de negocio
helpers/       Helpers utilitarios puntuales
utils/         Constantes y endpoints
public/        Assets públicos
```

## Módulos funcionales principales

La aplicación contiene flujos para:

- autenticación y perfil
- estudiantes
- contenido/cursos
- evaluaciones
- certificaciones
- trainings/capacitaciones
- dashboards por rol
- administración de usuarios y aulas
- materiales y recursos

Roles principales identificados en la base actual:

- estudiante
- corporate
- content
- admin
- admin corporative
- supervisor
- calidad
- comercial

## Routing actual

La base convive con dos modelos de routing:

- `app/`: usado de forma parcial para layout y landing.
- `pages/`: usado como superficie principal de la aplicación operativa.

Implicancias:

- La mayoría de cambios funcionales actuales siguen entrando por `pages/`.
- El target de evolución es migrar progresivamente hacia un modelo más consistente con App Router.
- No se debe asumir todavía que el proyecto está completamente alineado al modelo moderno de Next.js.

## Autenticación y sesión

La autenticación actual está implementada principalmente desde el cliente.

Piezas relevantes:

- `context/AuthContext.tsx`
- `components/Auth/ProtectedRoute.tsx`
- `helpers/helper-token.ts`

Notas importantes:

- Hay rutas protegidas mediante validación del lado cliente.
- La sesión utiliza almacenamiento local para persistencia.
- Existen oportunidades claras de consolidación y endurecimiento de seguridad.

Para mantenimiento:

- Evitar nuevas lecturas directas de token dispersas en páginas o hooks.
- Priorizar wrappers o adapters cuando se toque autenticación.

## Calidad y testing

Situación actual:

- No hay una suite de testing automatizado consolidada en este repositorio.
- El proyecto cuenta con TypeScript y lint de Next.js.
- No hay todavía una configuración explícita de Prettier ni una estrategia de testing por capas.

Lineamiento recomendado para nuevas contribuciones:

- mantener cambios pequeños y aislados
- no ampliar hardcodes
- evitar duplicar lógica de fetch o auth
- preferir reutilización sobre nuevas variantes por rol cuando sea posible

## Limitaciones conocidas

Aspectos a tener presentes antes de modificar la base:

- coexistencia de `app/` y `pages/`
- endpoints aún centralizados por constantes hardcodeadas
- protección de rutas principalmente client-side
- páginas grandes con lógica de negocio y UI mezcladas
- ausencia de testing automatizado base

## Objetivo arquitectónico

La dirección objetivo del proyecto es evolucionar progresivamente hacia una base frontend enterprise con estas características:

- arquitectura modular por dominio/feature
- menor acoplamiento entre UI, auth y capa HTTP
- mejor mantenibilidad para múltiples desarrolladores
- estructura preparada para crecimiento funcional
- mejor performance y uso más correcto de Next.js moderno
- mayor estandarización para calidad, testing y observabilidad

Esta evolución será incremental. No se considera recomendable un rewrite total de una sola vez.

## Recomendaciones para nuevas contribuciones

Si vas a agregar o modificar código en esta base:

1. Revisa primero si la lógica ya existe en `hooks/`, `services/` o `components/`.
2. Evita crear nuevos hardcodes de endpoints o tokens.
3. Mantén separación mínima entre UI y fetch incluso si el módulo todavía vive en `pages/`.
4. Si agregas código nuevo transversal, intenta dejarlo listo para una futura estructura `src/features`, `src/shared` o `src/platform`.
5. No asumas que todas las rutas usan el mismo modelo de rendering.

## Archivos relevantes para arrancar

Si recién entras al proyecto, estos archivos ayudan a entender la base:

- `package.json`
- `tsconfig.json`
- `next.config.mjs`
- `app/layout.tsx`
- `app/page.tsx`
- `pages/_app.tsx`
- `context/AuthContext.tsx`
- `utils/Endpoints.ts`
- `services/api.ts`

## Próximos pasos sugeridos

Las mejoras de menor riesgo y mayor retorno para acercar la base a un estándar enterprise son:

1. formalizar variables de entorno
2. unificar cliente HTTP
3. normalizar manejo de sesión
4. agregar documentación operativa real
5. incorporar estándares de calidad y testing mínimo

## Nota final

Este README busca reflejar el estado real del repositorio, no un estado ideal. Si se modifica arquitectura, setup o estrategia de ejecución, este documento debe actualizarse en la misma iteración.
