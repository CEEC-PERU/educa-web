import {
  BookOpenIcon,
  UserGroupIcon,
  ClockIcon,
  AcademicCapIcon,
  TagIcon,
  ClipboardDocumentCheckIcon,
  ArrowRightStartOnRectangleIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import type { AppSidebarItem } from "./app-sidebar.types";

export const supervisorSidebarItems: AppSidebarItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/supervisor",
    icon: HomeIcon,
    matchMode: "exact",
  },
  {
    id: "usuarios",
    label: "Usuarios",
    href: "/supervisor/usuarios",
    icon: UserGroupIcon,
    matchMode: "prefix",
  },
  {
    id: "classrooms",
    label: "Classroom",
    href: "/supervisor/classrooms",
    icon: UserGroupIcon,
    matchMode: "prefix",
  },
  {
    id: "courses",
    label: "Cursos",
    href: "/supervisor/courses",
    icon: BookOpenIcon,
    matchMode: "prefix",
  },
  {
    id: "evaluations",
    label: "Evaluaciones",
    href: "/supervisor/evaluations",
    icon: ClipboardDocumentCheckIcon,
    matchMode: "prefix",
  },
  {
    id: "sesion",
    label: "Sesiones",
    href: "/supervisor/sesion",
    icon: ClockIcon,
    matchMode: "prefix",
  },
  {
    id: "certificates",
    label: "Certificados",
    href: "/supervisor/certificates",
    icon: AcademicCapIcon,
    matchMode: "prefix",
  },
  {
    id: "trainings",
    label: "Programas de Formación",
    href: "/supervisor/trainings",
    icon: TagIcon,
    children: [
      {
        id: "trainings-list",
        label: "Programas",
        href: "/supervisor/trainings",
      },
      {
        id: "trainings-assignments",
        label: "Asignaciones",
        href: "/supervisor/trainings/assignments",
      },
    ],
  },
  {
    id: "materials",
    label: "Material",
    href: "/supervisor/materials",
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
