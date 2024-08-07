import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Admin/SideBarAdmin';
import CardEnterprise from '../../components/Admin/CardEnterprise';
import ButtonContent from '../../components/Content/ButtonContent';
import Modal from '../../components/Admin/Modal';
import ModalConfirmation from '../../components/ModalConfirmation';
import EnterpriseForm from './enterpriseForm';
import { Enterprise } from '../../interfaces/Enterprise';
import { getEnterprises, deleteEnterprise } from '../../services/enterpriseService';
import Alert from '../../components/AlertComponent';
import './../../app/globals.css';

const EnterpriseList: React.FC = () => {
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [selectedEnterprise, setSelectedEnterprise] = useState<Enterprise | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'info' | 'danger'; message: string } | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);

  const router = useRouter();

  useEffect(() => {
    fetchEnterprises();
  }, []);

  const fetchEnterprises = async () => {
    try {
      const data = await getEnterprises();
      setEnterprises(data);
    } catch (error) {
      console.error('Error fetching enterprises:', error);
      setError('Error fetching enterprises');
    }
  };

  const handleAddEnterprise = () => {
    setSelectedEnterprise(null);
    setIsModalOpen(true);
  };

  const handleEditEnterprise = (enterprise: Enterprise) => {
    setSelectedEnterprise(enterprise);
    setIsModalOpen(true);
  };

  const handleDeleteEnterprise = (enterpriseId: number) => {
    setSelectedEnterprise({ enterprise_id: enterpriseId } as Enterprise);
    setIsConfirmationModalOpen(true);
  };

  const confirmDeleteEnterprise = async () => {
    if (selectedEnterprise) {
      try {
        await deleteEnterprise(selectedEnterprise.enterprise_id);
        setAlert({ type: 'danger', message: 'Empresa eliminada exitosamente' });
        fetchEnterprises();
      } catch (error) {
        console.error('Error deleting enterprise:', error);
        setError('Error deleting enterprise');
      } finally {
        setIsConfirmationModalOpen(false);
        setSelectedEnterprise(null);
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedEnterprise(null);
  };

  const handleModalSuccess = () => {
    fetchEnterprises();
    setAlert({ type: selectedEnterprise ? 'info' : 'success', message: selectedEnterprise ? 'Empresa actualizada exitosamente' : 'Empresa agregada exitosamente' });
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <main className={`p-6 flex-grow ${showSidebar ? 'ml-20' : ''} transition-all duration-300 ease-in-out`}>
        {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
          <div className="flex justify-between items-center mb-4">
            <div onClick={handleAddEnterprise}>
              <ButtonContent
                buttonLabel="Añadir Empresa"
                backgroundColor="bg-gradient-to-r from-blue-500 to-blue-400"
                textColor="text-white"
                fontSize="text-xs"
                buttonSize="py-2 px-7"
              />
            </div>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {enterprises.map((enterprise) => (
              <CardEnterprise
                key={enterprise.enterprise_id}
                imageUrl={enterprise.image_log ?? '/placeholder-image.jpg'}
                title={enterprise.name}
                onEdit={() => handleEditEnterprise(enterprise)}
                onDelete={() => handleDeleteEnterprise(enterprise.enterprise_id)}
              />
            ))}
          </div>
        </main>
      </div>
      <Modal show={isModalOpen} onClose={handleModalClose} title={selectedEnterprise ? "" : ""}>
        <EnterpriseForm enterprise={selectedEnterprise ?? undefined} onClose={handleModalClose} onSuccess={handleModalSuccess} />
      </Modal>
      <ModalConfirmation
        show={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onConfirm={confirmDeleteEnterprise}
      />
    </div>
  );
};

export default EnterpriseList;
