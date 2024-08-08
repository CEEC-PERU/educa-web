import React from 'react';
import Link from 'next/link';

interface FloatingButtonProps {
  link?: string;
  label: string;
  onClick?: () => void;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({ link, label, onClick }) => {
  const ButtonContent = (
    <button
      type="button"
      className="flex items-center justify-center text-white bg-blue-700 rounded-full w-10 h-10 bg-gradient-to-r from-blue-500 to-violet-500 opacity-90"
      onClick={onClick}
    >
      <svg
        className="w-3 h-4 transition-transform group-hover:rotate-45"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 18 18"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 1v16M1 9h16"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </button>
  );

  if (link) {
    return (
      <div className="group">
        <Link href={link} legacyBehavior>
          {ButtonContent}
        </Link>
      </div>
    );
  }

  return <div className="group">{ButtonContent}</div>;
};

export default FloatingButton;
