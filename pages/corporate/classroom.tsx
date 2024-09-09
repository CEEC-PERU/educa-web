import React, { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Corporate/CorporateSideBar';
import {  getUsersByCompanyAndRole} from '../../services/userService';
import ButtonContent from '../../components/Content/ButtonContent';
import ClassroomForm from '../../components/Corporate/ClassromForm';
import Modal from '../../components/Admin/Modal';
import { useAuth } from '../../context/AuthContext';
import {  UserGroupIcon} from '@heroicons/react/24/outline';

import { useClassroom} from '../../hooks/useClassroom';
import './../../app/globals.css';

const Classroom: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const router = useRouter();
  const { classrooms, isLoading, error } = useClassroom();
  const { logout, user, profileInfo } = useAuth();
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
  const [filter, setFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);




  const enterpriseId = user ? (user as { id: number; role: number; dni: string; enterprise_id: number }).enterprise_id : null;
  const STUDENT_ROLE_ID = 1; // Reemplaza este valor con el ID real del rol de estudiante
  const ADMIN_ROLE_ID = 4; // Reemplaza este valor con el ID real del rol de admin
  const CONTENT_ROLE_ID = 3; // Reemplaza este valor con el ID real del rol de contenido
 const roleId = 1;
  const buttonColors = [
    'bg-gradient-purple text-white',
    'bg-gradient-yellow text-white',
    'bg-gradient-blue text-white',
    'bg-gradient-purple text-white',
    'bg-gradient-yellow text-white',
    'bg-gradient-blue text-white',
  ];

 

  

  const handleActionClick = (row: any) => {
    router.push(`/admin/editUser/${row.user_id}`);
  };

  const handleExportCSV = () => {
    router.push('/admin/student/exportCsv');
  };

  const handleAddUser = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleUserCreateSuccess = () => {
    setIsModalOpen(false);
    router.reload();
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={true} setShowSidebar={() => {}} />
        <main className={`flex-grow p-6 transition-all duration-300 ease-in-out ${showSidebar ? 'ml-20' : ''}`}>
        <div className='pb-4'>
          
            </div>
          <div className="flex space-x-4 mb-4">
            
            <div>
              <ButtonContent
                buttonLabel="Registrar Aula"
                backgroundColor="bg-gradient-to-r from-green-500 to-green-400"
                textColor="text-white"
                fontSize="text-xs"
                buttonSize="py-2 px-7"
                onClick={handleAddUser}
              />
            </div>
            
          </div>
          
          <div className="grid grid-cols-1 gap-6 w-full max-w-4xl">
            <p> </p>
          </div>
          <div className="grid grid-cols-1 gap-6 w-full max-w-4xl">
            <h2 className="text-lg font-semibold mb-2">Aulas</h2>
            <div className="grid grid-cols-1 gap-6">
              {!isLoading && classrooms && classrooms.length > 0 ? (
                classrooms.map((classroom) => (
                  <div key={classroom.classroom_id} className="flex items-center p-4 bg-white shadow rounded-md">
                    <div className="mr-4">
                      <UserGroupIcon className="h-10 w-10 text-blue-500" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold text-lg">{classroom.code}</h3>
                      <p className="text-gray-600">Empresa: {classroom.Enterprise.name}</p>
                      <p className="text-gray-600">Turno: {classroom.Shift.name}</p>
                      <p className="text-gray-600">Creado el: {new Date(classroom.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No hay aulas disponibles</p>
              )}
            </div>
          </div>
        </main>
      </div>
      <Modal show={isModalOpen} onClose={handleModalClose} title="Registrar nuevo usuario">
        <ClassroomForm  onClose={handleModalClose} onSuccess={handleUserCreateSuccess} />
      </Modal>
    </div>
  );
};

export default Classroom;
