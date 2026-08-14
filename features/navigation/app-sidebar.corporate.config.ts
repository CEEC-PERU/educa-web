import {
  BookOpenIcon,
  UserGroupIcon,
  TagIcon,
  AcademicCapIcon,
  ClockIcon,
  ClipboardDocumentCheckIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import type { AppSidebarItem } from "./app-sidebar.types";

export const corporateSidebarItems: AppSidebarItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/corporate",
    icon: BookOpenIcon,
    matchMode: "exact",
  },
  {
    id: "usuarios",
    label: "Usuarios",
    href: "/corporate/usuarios",
    icon: UserGroupIcon,
    matchMode: "prefix",
  },
  {
    id: "classroom",
    label: "Classroom",
    href: "/corporate/classroom",
    icon: UserGroupIcon,
    matchMode: "prefix",
  },
  {
    id: "courses",
    label: "Cursos",
    href: "/corporate/courses",
    icon: BookOpenIcon,
    matchMode: "prefix",
  },
  // Ocultos del sidebar a pedido: no deben aparecer como navegación para corporate.
  // Las rutas siguen existiendo, solo se quita el link de acceso.
  // {
  //   id: "certificates",
  //   label: "Certificaciones",
  //   href: "/corporate/certificates",
  //   icon: TagIcon,
  //   matchMode: "prefix",
  // },
  // {
  //   id: "qualification",
  //   label: "Calificaciones",
  //   href: "/corporate/qualification/progress",
  //   icon: AcademicCapIcon,
  //   matchMode: "prefix",
  // },
  {
    id: "sesion",
    label: "Sesiones",
    href: "/corporate/sesion",
    icon: ClockIcon,
    matchMode: "prefix",
  },
  {
    id: "addRequeriment",
    label: "Nuevo Requerimiento",
    href: "/corporate/addRequeriment",
    icon: ClipboardDocumentCheckIcon,
    matchMode: "prefix",
  },
  {
    id: "logout",
    label: "Cerrar Sesión",
    icon: ArrowRightStartOnRectangleIcon,
    action: "logout",
  },
];
