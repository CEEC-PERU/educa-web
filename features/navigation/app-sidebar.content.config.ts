import {
  BookOpenIcon,
  TagIcon,
  UserGroupIcon,
  CubeIcon,
  DocumentTextIcon,
  RectangleStackIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import type { AppSidebarItem } from "./app-sidebar.types";

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
    label: "Categorías",
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
    icon: RectangleStackIcon,
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
