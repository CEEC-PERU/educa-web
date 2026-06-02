import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { Profile } from "../../interfaces/User/UserInterfaces";

type UserMenuProps = {
  profileInfo: Profile | null;
  onLogout: () => void;
};

export default function UserMenu({ profileInfo, onLogout }: UserMenuProps) {
  const [open, setOpen] = React.useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const avatarSrc = profileInfo?.profile_picture ?? null;
  const displayName = profileInfo
    ? `${profileInfo.first_name} ${profileInfo.last_name}`.trim()
    : "Usuario";

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center space-x-1 p-1 rounded-full hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Menú de usuario"
      >
        {avatarSrc ? (
          <img
            src={avatarSrc}
            alt={displayName}
            className="h-9 w-9 rounded-full object-cover border-2 border-white"
          />
        ) : (
          <div className="h-9 w-9 rounded-full bg-white/30 flex items-center justify-center border-2 border-white">
            <span className="text-white font-semibold text-sm">
              {displayName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <ChevronDownIcon className="h-4 w-4 text-white" />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50"
          role="menu"
        >
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900 truncate">
              {displayName}
            </p>
            {profileInfo?.email && (
              <p className="text-xs text-gray-500 truncate">
                {profileInfo.email}
              </p>
            )}
          </div>

          <Link
            href="/student/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            Perfil
          </Link>

          <button
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            role="menuitem"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
