import React, { useState } from "react";
import { useRouter } from "next/router";

type Route = {
  path: string;
  label: string;
  icon?: React.ReactNode;
  suffix?: React.ReactNode;
};

type DrawerNavigationProps = {
  routes: Route[];
  drawerClassName?: string; // Define la prop drawerClassName
  overlayClassName?: string; // Define la prop overlayClassName
  listItemClassName?: string; // Define la prop listItemClassName
  listItemIconClassName?: string; // Define la prop listItemIconClassName
};

export function DrawerNavigation({ routes, drawerClassName, overlayClassName, listItemClassName, listItemIconClassName }: DrawerNavigationProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  
  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  const handleNavigation = (path: string) => {
    router.push(path);
    closeDrawer();
  };

  return (
    <>
      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={openDrawer}>Open Drawer</button>
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={closeDrawer}></div>
      )}
      <div
        className={`fixed bg-white h-full w-64 shadow-lg top-0 left-0 transform transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'} ${drawerClassName}`} 
        onMouseEnter={openDrawer}
        onMouseLeave={closeDrawer}
      >
        <div className="p-4">
          <h1 className="text-lg font-semibold mb-4">Material Tailwind</h1>
          <ul>
            {routes.map((route, index) => (
              <li key={index} className={`flex items-center cursor-pointer mb-2 ${listItemClassName}`} onClick={() => handleNavigation(route.path)}> {/* Añade la clase del listItem si está definida */}
                {open && route.icon && <span className={`mr-2 ${listItemIconClassName}`}>{route.icon}</span>} {/* Añade la clase del ícono del listItem si está definida */}
                {open && <span>{route.label}</span>}
                {route.suffix && open && <span className="ml-auto">{route.suffix}</span>}
              </li>
            ))}
          </ul>
          <button className="mt-4 text-blue-500" onClick={() => handleNavigation("/documentation")}>
            Documentation
          </button>
        </div>
      </div>
    </>
  );
}

export default DrawerNavigation;
