import {
  HomeIcon,
  ComputerDesktopIcon,
  AcademicCapIcon,
  DocumentArrowUpIcon,
  DocumentIcon,
  PuzzlePieceIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/solid";
import type { AppSidebarItem } from "./app-sidebar.types";

export const studentSidebarItems: AppSidebarItem[] = [
  {
    id: "home",
    label: "Inicio",
    href: "/student",
    icon: HomeIcon,
    matchMode: "exact",
  },
  {
    id: "cursos",
    label: "Mis Cursos",
    icon: ComputerDesktopIcon,
    href: "/student/cursos",
  },
  {
    id: "capacitaciones",
    label: "Capacitaciones",
    icon: AcademicCapIcon,
    href: "/student/capacitaciones",
  },
  // Ocultos del sidebar a pedido: no deben aparecer como navegación para student.
  // Las rutas siguen existiendo, solo se quita el link de acceso.
  // {
  //   id: "evaluaciones",
  //   label: "Evaluaciones",
  //   href: "/student/evaluaciones",
  //   icon: DocumentArrowUpIcon,
  // },
  // {
  //   id: "certificaciones",
  //   label: "Certificaciones",
  //   href: "/student/certificaciones",
  //   icon: DocumentIcon,
  // },
  {
    id: "notas",
    label: "Notas",
    href: "/student/notas",
    icon: DocumentIcon,
  },
  {
    id: "diplomas",
    label: "Mis Diplomas",
    href: "/student/diplomas",
    icon: DocumentArrowUpIcon,
  },
  {
    id: "juegos",
    label: "Juegos Didácticos",
    href: "/student/juegos",
    icon: PuzzlePieceIcon,
  },
  {
    id: "logout",
    label: "Cerrar Sesión",
    icon: ArrowRightStartOnRectangleIcon,
    action: "logout",
  },
];
