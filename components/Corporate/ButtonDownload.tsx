import React from 'react';
import { FiFileText, FiDownload } from 'react-icons/fi';

interface DownloadWordButtonProps {
  onClick: () => void;
  loading: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

const DownloadWordButton: React.FC<DownloadWordButtonProps> = ({
  onClick,
  loading,
  disabled = false,
  variant = 'secondary',
}) => {
  const baseClasses =
    'flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-green-600 hover:bg-green-700 text-white',
  };

  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>Descargando...</span>
        </>
      ) : (
        <>
          <FiFileText className="h-4 w-4" />
          <span>Descargar Informe</span>
        </>
      )}
    </button>
  );
};

export default DownloadWordButton;
