// EditButtons.tsx
import React from 'react';

interface EditButtonsProps {
  isEditing: boolean;
  onEditToggle: () => void;
  onSave: () => Promise<void>;
  onDelete: () => Promise<void>;
}

const EditButtons: React.FC<EditButtonsProps> = ({ isEditing, onEditToggle, onSave, onDelete }) => {
  return (
    <div className="mt-8 flex justify-end">
      {isEditing ? (
        <button onClick={onSave} className="py-2 px-4 bg-green-600 text-white rounded-md mr-4">Guardar</button>
      ) : (
        <button onClick={onEditToggle} className="py-2 px-4 bg-yellow-600 text-white rounded-md mr-4">Editar</button>
      )}
      <button onClick={onDelete} className="py-2 px-4 bg-red-600 text-white rounded-md">Eliminar</button>
    </div>
  );
};

export default EditButtons;
