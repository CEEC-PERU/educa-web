// src/pages/admin/requirements.tsx
import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Admin/SideBarAdmin';
import { updateRequirement } from '../../services/requirementService';
import Loader from '../../components/Loader';
import AlertComponent from '../../components/AlertComponent';
import RequirementCard from '../../components/Admin/RequirementCard';
import ButtonContent from '../../components/Content/ButtonContent';
import { getAllRequirements } from '../../services/requirementService';
import { Requirement } from '../../interfaces/Requirement';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';
import './../../app/globals.css';

const RequirementsPage: React.FC = () => {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showActive, setShowActive] = useState(true);

  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        const data = await getAllRequirements();
        const normalizedData = data.map((req: Requirement) => ({
          ...req,
          materials: req.materials || [],
          is_active: req.is_active ?? true // Asegurarse de que is_active sea booleano
        }));
        setRequirements(normalizedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching requirements:', error);
        setError('Error fetching requirements');
        setLoading(false);
      }
    };

    fetchRequirements();
  }, []);

  const handleUpdateStatus = async (id: number, isActive: boolean) => {
    try {
      const updatedRequirement = await updateRequirement(id, { is_active: isActive });
      setRequirements(requirements.map(req => req.requirement_id === id ? { ...req, is_active: isActive } : req));
      setSuccess('Estado del requerimiento actualizado correctamente');
      // Disparar el evento personalizado
      window.dispatchEvent(new Event('requirementUpdate'));
      setTimeout(() => setSuccess(null), 5000);
    } catch (error) {
      console.error('Error updating requirement status:', error);
      setError('Error actualizando el estado del requerimiento');
    }
  };

  const filteredRequirements = requirements.filter(req => req.is_active === showActive);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <ProtectedRoute>
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
          <div className="flex justify-between mb-6 space-x-8">
            <ButtonContent
              buttonLabel="Pendiente"
              backgroundColor={showActive ? 'bg-blue-500' : 'bg-gray-300'}
              textColor="text-white"
              fontSize="text-xs"
              buttonSize="py-2 px-4"
              onClick={() => setShowActive(true)}
            />
            <ButtonContent
              buttonLabel="Requerimiento Finalizado"
              backgroundColor={!showActive ? 'bg-blue-500' : 'bg-gray-300'}
              textColor="text-white"
              fontSize="text-xs"
              buttonSize="py-2 px-4"
              onClick={() => setShowActive(false)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRequirements.map((req) => (
              <RequirementCard key={req.requirement_id} requirement={req} onUpdateStatus={handleUpdateStatus} />
            ))}
          </div>
        </main>
      </div>
    </div>
    </ProtectedRoute>
  );
};

export default RequirementsPage;
