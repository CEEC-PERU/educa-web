import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Admin/SideBarAdmin';
import { getAllRequirements, deleteRequirement } from '../../services/requirementService';
import Loader from '../../components/Loader';
import AlertComponent from '../../components/AlertComponent';
import RequirementCard from '../../components/Admin/RequirementCard';
import './../../app/globals.css';

interface UserProfile {
  first_name: string;
  last_name: string;
  profile_picture: string;
}

interface Enterprise {
  name: string;
}

interface User {
  userProfile?: UserProfile;
  enterprise: Enterprise;
}

interface Requirement {
  requirement_id: number;
  proposed_date: string;
  course_name: string;
  material: string;
  message: string;
  course_duration: string;
  user: User;
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requirements.map((req) => (
              <RequirementCard key={req.requirement_id} requirement={req} onDelete={handleDelete} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default RequirementsPage;
