import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Admin/SideBarAdmin';
import { getAllRequirements, deleteRequirement } from '../../services/requirementService';
import Loader from '../../components/Loader';
import './../../app/globals.css';
import AlertComponent from '../../components/AlertComponent';

interface Requirement {
  requirement_id: number;
  user: {
    name: string;
  };
  proposed_date: string;
  course_name: string;
  material: string;
  message: string;
  course_duration: string;
}

const RequirementsPage: React.FC = () => {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        const data = await getAllRequirements();
        setRequirements(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching requirements:', error);
        setError('Error fetching requirements');
        setLoading(false);
      }
    };

    fetchRequirements();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteRequirement(id);
      setRequirements(requirements.filter((req) => req.requirement_id !== id));
      setSuccess('Registro eliminado correctamente');
      setTimeout(() => setSuccess(null), 5000);
    } catch (error) {
      console.error('Error deleting requirement:', error);
      setError('Error deleting requirement');
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    };
    return new Date(dateTimeString).toLocaleDateString('es-ES', options);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <main className={`p-6 flex-grow transition-all duration-300 ease-in-out ${showSidebar ? 'ml-20' : ''}`}>
          {success && (
            <AlertComponent
              type="success"
              message={success}
              onClose={() => setSuccess(null)}
            />
          )}
          {error && <AlertComponent type="danger" message={error} onClose={() => setError(null)} />}
          <h2 className="text-2xl font-bold mb-6">Requerimientos</h2>
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Usuario</th>
                <th className="py-2 px-4 border-b">Fecha Propuesta</th>
                <th className="py-2 px-4 border-b">Nombre del Curso</th>
                <th className="py-2 px-4 border-b">Material</th>
                <th className="py-2 px-4 border-b">Mensaje</th>
                <th className="py-2 px-4 border-b">Duración del Curso</th>
                <th className="py-2 px-4 border-b">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {requirements.map((req) => (
                <tr key={req.requirement_id}>
                  <td className="py-2 px-4 border-b">{req.user?.name}</td>
                  <td className="py-2 px-4 border-b">{formatDateTime(req.proposed_date)}</td>
                  <td className="py-2 px-4 border-b">{req.course_name}</td>
                  <td className="py-2 px-4 border-b">{req.material}</td>
                  <td className="py-2 px-4 border-b">{req.message}</td>
                  <td className="py-2 px-4 border-b">{req.course_duration}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleDelete(req.requirement_id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
};

export default RequirementsPage;
