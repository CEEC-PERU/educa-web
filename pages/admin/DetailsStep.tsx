// components/DetailsStep.tsx
import React from 'react';
import { useRouter } from 'next/router';
import { importUsers } from '../../services/userService';

interface DetailsStepProps {
  file: File;
  enterpriseId: string;
  onBack: () => void;
}

const DetailsStep: React.FC<DetailsStepProps> = ({ file, enterpriseId, onBack }) => {
  const [importName, setImportName] = React.useState(file.name);
  const [createUsers, setCreateUsers] = React.useState(false);
  const [agreeToEmails, setAgreeToEmails] = React.useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!importName || !createUsers || !agreeToEmails) {
      alert('Por favor, completa todos los campos antes de continuar');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('enterprise_id', enterpriseId);

    try {
      const response = await importUsers(formData);
      alert(response.message);
      router.push('/admin');
    } catch (error) {
      console.error('Error subiendo usuarios:', error);
      alert('Error subiendo usuarios');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-center">Detalles Finales</h2>
        <input
          type="text"
          className="mb-4 w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Nombre de la importación"
          value={importName}
          onChange={(e) => setImportName(e.target.value)}
        />
        <div className="flex flex-col mb-8 w-full">
          <label className="flex items-center">
            <input type="checkbox" checked={createUsers} onChange={(e) => setCreateUsers(e.target.checked)} />
            <span className="ml-2">* Crea usuarios a partir de esta importación</span>
          </label>
          <label className="flex items-center mt-4">
            <input type="checkbox" checked={agreeToEmails} onChange={(e) => setAgreeToEmails(e.target.checked)} />
            <span className="ml-2">* Estoy de acuerdo en que todos los usuarios de esta importación esperan recibir noticias de mi organización.</span>
          </label>
        </div>
        <div className="flex justify-between mt-8">
          <button
            className="bg-gray-500 text-white py-2 px-4 rounded"
            onClick={onBack}
          >
            Atrás
          </button>
          <button
            className="bg-purple-500 text-white py-2 px-8 rounded"
            onClick={handleSubmit}
            disabled={!importName || !createUsers || !agreeToEmails}
          >
            Finalizar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailsStep;
