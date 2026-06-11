import React from "react";

interface SectionCardProps {
  title?: string;
  children: React.ReactNode;
}

export default function SectionCard({ title, children }: SectionCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      {title && (
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
            {title}
          </h2>
        </div>
      )}
      <div className="p-6 flex flex-col gap-5">{children}</div>
    </div>
  );
}
