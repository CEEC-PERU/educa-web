import React from 'react';
import { Evaluation } from '../../../interfaces/Evaluation';
import ActionButtons from '../../../components/Content/ActionButtons';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import './../../../app/globals.css';

interface DetailContainerProps {
  evaluation: Evaluation | null;
  isEditing: boolean;
  onEditToggle: () => void;
  onSave: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onDelete: () => void;
}

const DetailContainer: React.FC<DetailContainerProps> = ({ evaluation, isEditing, onEditToggle, onSave, onDelete }) => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-start space-y-4">
      <div className="w-2/2 mr-2 p-4 bg-white rounded-md border-2 border-purple-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-500">Detalles de la Evaluación</h2>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center text-purple-600"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Volver
          </button>
        </div>
        <hr />
        {evaluation ? (
          <div className="space-y-4">
            {isEditing ? (
              <div>
                <input
                  id="evaluationName"
                  type="text"
                  defaultValue={evaluation.name}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
                />
                <label className="block text-blue-500 text-sm font-bold mb-2">Descripción</label>
                <textarea
                  id="evaluationDescription"
                  defaultValue={evaluation.description}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <p>{evaluation.name}</p>
                <p><strong className="text-blue-500">Descripción</strong></p>
                <p>{evaluation.description}</p>
              </div>
            )}
          </div>
        ) : (
          <p>Cargando...</p>
        )}
      </div>
      <div className="mt-4">
        <ActionButtons
          onEdit={onEditToggle}
          onDelete={onDelete}
          onSave={onSave}
          isEditing={isEditing}
          onCancel={isEditing ? onEditToggle : undefined}
        />
      </div>
    </div>
  );
};

export default DetailContainer;
