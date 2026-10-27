import { LogoutIcon } from "../../components/icons/LogoutIcon";
import type { AppSidebarItem } from "./app-sidebar.types";

export const studentSidebarItems: AppSidebarItem[] = [
  { id: "home", label: "Inicio", href: "/student", icon: "/sidebar/icon-inicio.png", matchMode: "exact" },
  { id: "cursos", label: "Mis Cursos", href: "/student/cursos", icon: "/sidebar/icon-cursos.png" },
  { id: "capacitaciones", label: "Capacitaciones", href: "/student/capacitaciones", icon: "/sidebar/icon-computadora.png" },
  { id: "notas", label: "Notas", href: "/student/notas", icon: "/sidebar/icon-documento.png" },
  { id: "diplomas", label: "Mis Diplomas", href: "/student/diplomas", icon: "/sidebar/icon-certificado.png" },
  { id: "juegos", label: "Juegos Did\u00e1cticos", href: "/student/juegos", icon: "/sidebar/icon-puzzle.png" },
  { id: "logout", label: "Cerrar Sesi\u00f3n", icon: LogoutIcon, action: "logout" },
];
