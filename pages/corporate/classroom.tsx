import React, { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Corporate/CorporateSideBar';
import { getCompanies, getUsersByCompanyAndRole, getUsersByRole  } from '../../services/userService';
import FormField from '../../components/FormField';
import TableUser from '../../components/TableUser';
import ButtonContent from '../../components/Content/ButtonContent';
import UserForm from '../../components/Admin/UserForm';
import Modal from '../../components/Admin/Modal';
import { useAuth } from '../../context/AuthContext';
import { User } from '../../interfaces/UserAdmin';
import { Enterprise } from '../../interfaces/Enterprise';
import { useUserCount } from '../../hooks/useUserCount';
import './../../app/globals.css';

const Classroom: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const router = useRouter();
  const { usercount, isLoading, error } = useUserCount();
  const { logout, user, profileInfo } = useAuth();
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>([]);
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

  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let usersData: User[] = [];
        if (roleId && (Number(roleId) === ADMIN_ROLE_ID || Number(roleId) === CONTENT_ROLE_ID)) {
          usersData = await getUsersByRole(roleId.toString());
        } else if (enterpriseId && roleId) {
          usersData = await getUsersByCompanyAndRole(enterpriseId, Number(roleId));
        }
        console.log('Users data:', usersData);
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [enterpriseId, roleId]);

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFilter(e.target.value);
  };

  const filteredUsers = users.filter(user =>
    (user.userProfile?.first_name?.toLowerCase().includes(filter.toLowerCase()) ||
      user.userProfile?.last_name?.toLowerCase().includes(filter.toLowerCase())) ||
    user.dni.includes(filter)
  );

  const usersWithProfile = filteredUsers.filter(user => user.userProfile);
  const usersWithoutProfile = filteredUsers.filter(user => !user.userProfile);

  

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
    if (enterpriseId && roleId) {
      const fetchUsers = async () => {
        try {
          const usersData = await getUsersByCompanyAndRole(enterpriseId, Number(roleId));
          setUsers(usersData);
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };

      fetchUsers();
    }
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
            <p>k</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-8xl">
            <div>
              <h2 className="text-lg font-semibold mb-2">Aulas</h2>
           <div className='curso'>

           </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2"></h2>
              
            </div>
          </div>
        </main>
      </div>
      <Modal show={isModalOpen} onClose={handleModalClose} title="Registrar nuevo usuario">
        <UserForm roleId={Number(roleId)} onClose={handleModalClose} onSuccess={handleUserCreateSuccess} />
      </Modal>
    </div>
  );
};

export default Classroom;
