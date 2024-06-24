import React from 'react';

interface ActionButtonsProps {
  onEdit?: () => void;
  onCancel?: () => void;
  onDelete?: () => void;
  onSave?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isEditing?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onEdit, onCancel, onDelete, onSave, isEditing }) => {
  return (
    <div className="p-4 bg-gradient-to-br from-gray-200 to-gray-400 rounded-lg shadow-md w-64">
      <div className="flex flex-col items-start space-y-2">
        {!isEditing && onEdit && (
          <button onClick={onEdit} className="w-full relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 group-hover:from-red-200 group-hover:via-red-300 group-hover:to-yellow-200 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400">
            <span className="w-full relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              Editar
            </span>
          </button>
        )}
        {isEditing && onSave && (
          <button onClick={onSave} className="w-full relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
            <span className="w-full relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              Guardar
            </span>
          </button>
        )}
        {onCancel && (
          <button onClick={onCancel} className="w-full relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-gray-400 to-gray-600 group-hover:from-gray-400 group-hover:to-gray-600 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-700">
            <span className="w-full relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              Cancelar
            </span>
          </button>
        )}
        {!isEditing && onDelete && (
          <button onClick={onDelete} className="w-full relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-red-500 to-red-700 group-hover:from-red-500 group-hover:to-red-700 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800">
            <span className="w-full relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              Eliminar
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ActionButtons;
