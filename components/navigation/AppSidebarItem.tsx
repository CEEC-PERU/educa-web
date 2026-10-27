"use client";
import Link from "next/link";
import React from "react";
import type { AppSidebarItem as AppSidebarItemType } from "../../features/navigation/app-sidebar.types";

type AppSidebarItemProps = {
  item: AppSidebarItemType;
  isCollapsed: boolean;
  isActive?: boolean;
  onCloseMobile?: () => void;
};

export default function AppSidebarItem({
  item,
  isCollapsed,
  isActive = false,
  onCloseMobile,
}: AppSidebarItemProps) {
  const isImageIcon = typeof item.icon === "string";
  const linkClassName = "relative flex items-center h-[56px] w-full mb-2 rounded-2xl overflow-hidden group cursor-pointer border transition-all duration-300 " +
    (isActive
      ? "bg-[#7435c0] text-white border-transparent"
      : "bg-[#1A0630] text-gray-400 hover:bg-[#2D0B4A] hover:text-white border-white/10");
  const iconBoxClassName = "flex items-center justify-center w-[38px] h-[38px] rounded-lg shrink-0 transition-colors " +
    (isCollapsed ? "mr-0 " : "mr-3 ") +
    (isActive ? "bg-white/15" : "bg-[#2D0B4A]");
  const labelClassName = "text-[15px] font-medium transition-colors truncate flex-1 " +
    (isActive ? "text-white" : "text-gray-400 group-hover:text-white");

  return (
    <li>
      <Link
        href={item.href || "#"}
        onClick={() => onCloseMobile?.()}
        title={isCollapsed ? item.label : undefined}
        aria-current={isActive ? "page" : undefined}
        className={linkClassName}
      >
        <div className={isCollapsed ? "relative z-10 flex w-full items-center justify-center px-0" : "relative z-10 flex w-full items-center px-5"}>
          <div className={iconBoxClassName}>
            {isImageIcon ? (
              <img
                src={item.icon as string}
                alt={item.label}
                className="h-[20px] w-[20px] object-contain"
              />
            ) : item.icon ? (
              React.createElement(item.icon as React.ElementType, {
                className: "h-[20px] w-[20px] transition-colors " +
                  (isActive ? "text-white" : "text-gray-400 group-hover:text-white"),
              })
            ) : null}
          </div>

          {!isCollapsed && (
            <span className={labelClassName}>{item.label}</span>
          )}

          {!isCollapsed && item.badgeCount != null && item.badgeCount > 0 && (
            <span className="ml-2 rounded-full bg-white px-1.5 py-0.5 text-center text-xs font-bold text-purple-800">
              {item.badgeCount}
            </span>
          )}

          {isCollapsed && item.badgeCount != null && item.badgeCount > 0 && (
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-400" />
          )}

          {!isCollapsed && (
            <svg
              className={"ml-auto h-5 w-5 transition-transform group-hover:translate-x-1 " +
                (isActive ? "text-white/80" : "text-gray-600 group-hover:text-white")}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
        </div>

        {isActive && !isCollapsed && (
          <svg
            className="absolute inset-0 h-full w-full pointer-events-none z-0"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            <path
              d="M 80,0 C 70,5 66,70 58,100 L 100,100 L 100,0 Z"
              fill="#5b27ad"
            />
          </svg>
        )}
      </Link>
    </li>
  );
}
