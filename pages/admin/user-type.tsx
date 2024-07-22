import React, { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Admin/SideBarAdmin';
import { getCompanies, getUsersByCompanyAndRole, getUsersByRole } from '../../services/userService';
import FormField from '../../components/FormField';
import TableUser from '../../components/TableUser';
import ButtonComponent from '../../components/ButtonDelete';
import UserForm from '../../components/Admin/UserForm';
import Modal from '../../components/Admin/Modal';

import { User } from '../../interfaces/UserAdmin';
import { Enterprise } from '../../interfaces/Enterprise';
import './../../app/globals.css';

const RoleDetail: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const router = useRouter();
  const { roleId } = router.query;
  const [companies, setCompanies] = useState<Enterprise[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const STUDENT_ROLE_ID = 1; // Reemplaza este valor con el ID real del rol de estudiante
  const ADMIN_ROLE_ID = 4; // Reemplaza este valor con el ID real del rol de admin
  const CONTENT_ROLE_ID = 3; // Reemplaza este valor con el ID real del rol de contenido

  const buttonColors = [
    'bg-gradient-purple text-white',
    'bg-gradient-yellow text-white',
    'bg-gradient-blue text-white',
    'bg-gradient-purple text-white',
    'bg-gradient-yellow text-white',
    'bg-gradient-blue text-white',
  ];

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const companiesData = await getCompanies();
        setCompanies(companiesData);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchCompanies();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let usersData: User[] = [];
        if (roleId && (Number(roleId) === ADMIN_ROLE_ID || Number(roleId) === CONTENT_ROLE_ID)) {
          usersData = await getUsersByRole(roleId.toString());
        } else if (selectedCompany && roleId) {
          usersData = await getUsersByCompanyAndRole(selectedCompany, Number(roleId));
        }
        console.log('Users data:', usersData);
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [selectedCompany, roleId]);

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

  const columnsWithProfile = [
    { header: '', accessor: 'userProfile.profile_picture' },
    { header: 'Nombre', accessor: 'userProfile.first_name' },
    { header: 'Apellido', accessor: 'userProfile.last_name' },
    { header: 'DNI', accessor: 'dni' },
    { header: 'Contraseña', accessor: 'password' },
  ];

  const columnsWithoutProfile = [
    { header: 'DNI', accessor: 'dni' },
    { header: 'Contraseña', accessor: 'password' },
  ];

  if (roleId && (Number(roleId) === STUDENT_ROLE_ID)) {
    columnsWithProfile.push({ header: 'Sesiones', accessor: 'session_count' });
    columnsWithoutProfile.push({ header: 'Sesiones', accessor: 'session_count' });
  }

  if (roleId && (Number(roleId) === ADMIN_ROLE_ID || Number(roleId) === CONTENT_ROLE_ID)) {
    columnsWithProfile.push({ header: 'Empresa', accessor: 'enterprise.name' });
    columnsWithoutProfile.push({ header: 'Empresa', accessor: 'enterprise.name' });
  }

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
    if (selectedCompany && roleId) {
      const fetchUsers = async () => {
        try {
          const usersData = await getUsersByCompanyAndRole(selectedCompany, Number(roleId));
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
          <div className="flex space-x-4 mb-4">
            {roleId && Number(roleId) === STUDENT_ROLE_ID && (
              <div>
                <ButtonComponent
                  buttonLabel="Exportar CSV"
                  backgroundColor="bg-gradient-to-r from-green-500 to-green-400"
                  textColor="text-white"
                  fontSize="text-xs"
                  buttonSize="py-2 px-7"
                  onClick={handleExportCSV}
                />
              </div>
            )}
            <div>
              <ButtonComponent
                buttonLabel="Agregar Usuario"
                backgroundColor="bg-gradient-to-r from-green-500 to-green-400"
                textColor="text-white"
                fontSize="text-xs"
                buttonSize="py-2 px-7"
                onClick={handleAddUser}
              />
            </div>
          </div>
          {roleId && Number(roleId) !== ADMIN_ROLE_ID && Number(roleId) !== CONTENT_ROLE_ID && (
            <div className="gap-6 w-full max-w-2xl flex space-x-4 mb-6 mt-8">
              {companies.map((company, index) => (
                <ButtonComponent
                  key={company.enterprise_id}
                  buttonLabel={company.name}
                  backgroundColor={buttonColors[index % buttonColors.length]}
                  buttonSize="py-2 px-4"
                  onClick={() => setSelectedCompany(company.enterprise_id)}
                />
              ))}
            </div>
          )}
          <div className="grid grid-cols-1 gap-6 w-full max-w-4xl">
            <FormField
              id="filter"
              label="Filtrar por nombre, apellido o DNI"
              type="text"
              value={filter}
              onChange={handleFilterChange}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-8xl">
            <div>
              <h2 className="text-lg font-semibold mb-2">Usuarios con Perfil</h2>
              <TableUser
                columns={columnsWithProfile}
                data={usersWithProfile}
                actionLabel="Editar"
                onActionClick={handleActionClick}
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">Usuarios sin Perfil</h2>
              <TableUser
                columns={columnsWithoutProfile}
                data={usersWithoutProfile}
              />
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

export default RoleDetail;
