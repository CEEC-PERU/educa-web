import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { importUsers } from '../../../services/userService';
import Alert from '../../../components/AlertComponent';
import Loader from '../../../components/Loader';

interface DetailsStepProps {
  file: File;
  enterpriseId: string;
  onBack: () => void;
}

const DetailsStep: React.FC<DetailsStepProps> = ({ file, enterpriseId, onBack }) => {
  const [importName, setImportName] = useState(file.name || '');
  const [createUsers, setCreateUsers] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'info' | 'danger' | 'success' | 'warning' | 'dark', message: string } | null>(null);
  const router = useRouter();

  if (!file) {
    return <p>No file provided</p>; // Manejo de error si 'file' no está definido
  }

  const handleSubmit = async () => {
    if (!importName || !createUsers) {
      setAlert({ type: 'danger', message: 'Por favor, completa todos los campos antes de continuar' });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('enterprise_id', enterpriseId);

    setLoading(true);
    try {
      await importUsers(formData);
      setAlert({ type: 'success', message: 'Usuarios creados exitosamente' });
      setTimeout(() => {
        router.push('/admin');
      }, 4000);
    } catch (error) {
      console.error('Error subiendo usuarios:', error);
      setAlert({ type: 'danger', message: 'Error subiendo usuarios' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-center">Detalles Finales</h2>
        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}
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
        </div>
        <div className="flex justify-between mt-8">
          <button
            className="bg-gray-500 text-white py-2 px-4 rounded"
            onClick={onBack}
          >
            Atrás
          </button>
          <button
            className={`bg-purple-500 text-white py-2 px-8 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleSubmit}
            disabled={loading || !importName || !createUsers}
          >
            {loading ? <Loader size="w-4 h-4" /> : 'Finalizar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailsStep;
