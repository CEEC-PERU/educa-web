import {
  HomeIcon,
  ComputerDesktopIcon,
  DocumentArrowUpIcon,
  DocumentIcon,
  PuzzlePieceIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/solid";
import type { AppSidebarItem } from "./app-sidebar.types";

export const studentSidebarItems: AppSidebarItem[] = [
  {
    id: "home",
    label: "Home",
    href: "/student",
    icon: HomeIcon,
    matchMode: "exact",
  },
  {
    id: "cursos",
    label: "Mis Cursos",
    icon: ComputerDesktopIcon,
    href: "/student/cursos",
    children: [
      {
        id: "capacitaciones",
        label: "Capacitaciones",
        href: "/student/capacitaciones",
      },
    ],
  },
  {
    id: "evaluaciones",
    label: "Evaluaciones",
    href: "/student/evaluaciones",
    icon: DocumentArrowUpIcon,
  },
  {
    id: "certificaciones",
    label: "Certificaciones",
    href: "/student/certificaciones",
    icon: DocumentIcon,
  },
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
