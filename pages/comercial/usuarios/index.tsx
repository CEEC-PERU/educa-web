import React, { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/comercial/ComercialSidebar';
import {
  getCompanies,
  getPaginatedUsersByCompanyAndRole,
  getUsersByRole,
} from '../../../services/users/userService';
import FormField from '../../../components/FormField';
import TableUser from '../../../components/TableUser';
import ButtonContent from '../../../components/Content/ButtonContent';
import UserForm from '../../../components/Corporate/UserForm';
import Modal from '../../../components/Admin/Modal';
import { useAuth } from '../../../context/AuthContext';
import { User } from '../../../interfaces/User/UserAdmin';
import { Enterprise } from '../../../interfaces/Enterprise';
import { useUserCount } from '../../../hooks/user/useUserCount';
import ProtectedRoute from '../../../components/Auth/ProtectedRoute';
import './../../../app/globals.css';

const Usuarios: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const router = useRouter();
  const { usercount, isLoading, error } = useUserCount();
  const { logout, user, profileInfo, token } = useAuth();
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [filter, setFilter] = useState('');
  const [debouncedFilter, setDebouncedFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [userCountResult, setUserCountResult] = useState<any>(null);

  const enterpriseId = user
    ? (user as { id: number; role: number; enterprise_id: number })
        .enterprise_id
    : null;
  const STUDENT_ROLE_ID = 1; // Replace this value with the real student role ID
  const ADMIN_ROLE_ID = 4; // Replace this value with the real admin role ID
  const CONTENT_ROLE_ID = 3; // Replace this value with the real content role ID
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
    const timer = setTimeout(() => setDebouncedFilter(filter.trim()), 350);
    return () => clearTimeout(timer);
  }, [filter]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let usersData: User[] = [];
        if (
          roleId &&
          (Number(roleId) === ADMIN_ROLE_ID ||
            Number(roleId) === CONTENT_ROLE_ID)
        ) {
          usersData = await getUsersByRole(roleId.toString());
        } else if (enterpriseId && roleId) {
          const response = await getPaginatedUsersByCompanyAndRole(
            enterpriseId,
            Number(roleId),
            page,
            50,
            debouncedFilter,
          );
          usersData = response.users;
          setTotalCount(response.totalCount);
          setTotalPages(response.totalPages);
        }
        console.log('Users data:', usersData);
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [enterpriseId, roleId, page, debouncedFilter]);

  useEffect(() => {
    if (usercount.length > 0) {
      setUserCountResult(usercount[0]);
    }
  }, [usercount]);

  const handleFilterChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFilter(e.target.value);
    setPage(1);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.userProfile?.first_name
        ?.toLowerCase()
        .includes(filter.toLowerCase()) ||
      user.userProfile?.last_name
        ?.toLowerCase()
        .includes(filter.toLowerCase())
  );

  const usersWithProfile = filteredUsers.filter((user) => user.userProfile);
  const usersWithoutProfile = filteredUsers.filter((user) => !user.userProfile);

  const columnsWithProfile = [
    { header: '', accessor: 'userProfile.profile_picture' },
    { header: 'Nombre', accessor: 'userProfile.first_name' },
    { header: 'Apellido', accessor: 'userProfile.last_name' },
  ];

  const columnsWithoutProfile = [
  ];

  if (roleId && Number(roleId) === STUDENT_ROLE_ID) {
    columnsWithProfile.push({ header: 'Sesiones', accessor: 'session_count' });
    columnsWithoutProfile.push({
      header: 'Sesiones',
      accessor: 'session_count',
    });
  }

  if (
    roleId &&
    (Number(roleId) === ADMIN_ROLE_ID || Number(roleId) === CONTENT_ROLE_ID)
  ) {
    columnsWithProfile.push({ header: 'Empresa', accessor: 'enterprise.name' });
    columnsWithoutProfile.push({
      header: 'Empresa',
      accessor: 'enterprise.name',
    });
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

  const handleUserCreateSuccess = async () => {
    setIsModalOpen(false);
    if (!enterpriseId || !roleId) return;
    try {
      const response = await getPaginatedUsersByCompanyAndRole(enterpriseId, Number(roleId), page, 50, debouncedFilter);
      setUsers(response.users);
      setTotalCount(response.totalCount);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
        <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
        <div className="flex flex-1 pt-16">
          <Sidebar showSidebar={true} setShowSidebar={() => {}} />
          <main
            className={`min-w-0 flex-1 p-6 transition-all duration-300 ease-in-out ${
              showSidebar ? 'ml-20' : ''
            }`}
          >
            <div className="pb-4">
              {userCountResult && (
                <div>
                  <h1 className="font-bold text-2xl text-blue-500">
                    {' '}
                    {userCountResult.UserCount} / {userCountResult.maxUserCount}{' '}
                  </h1>
                  <h1 className="font-bold text-2xl">
                    {' '}
                    {userCountResult.message}{' '}
                  </h1>
                </div>
              )}
            </div>
            <div className="flex space-x-4 mb-4">
              <div>
                <ButtonContent
                  buttonLabel="Agregar Usuario"
                  backgroundColor="bg-yellow-500"
                  textColor="text-white"
                  fontSize="text-xs"
                  buttonSize="py-2 px-7"
                  onClick={handleAddUser}
                />
              </div>
            </div>

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
                <h2 className="text-lg font-semibold mb-2">
                  Datos Actualizados
                </h2>
                <TableUser
                  columns={columnsWithProfile}
                  data={usersWithProfile}
                  actionLabel="Editar"
                  onActionClick={handleActionClick}
                />
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-2">
                  Usuarios sin Perfil
                </h2>
                <TableUser
                  columns={columnsWithoutProfile}
                  data={usersWithoutProfile}
                />
              </div>
            </div>
            {enterpriseId && roleId && (
              <div className="mt-5 flex items-center justify-between gap-3" aria-live="polite">
                <span className="text-sm text-gray-600">{totalCount.toLocaleString()} usuarios</span>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page <= 1} className="rounded border border-gray-300 px-3 py-2 text-sm disabled:opacity-50">Anterior</button>
                  <span className="text-sm text-gray-700">Pagina {page} de {Math.max(totalPages, 1)}</span>
                  <button type="button" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page >= totalPages} className="rounded border border-gray-300 px-3 py-2 text-sm disabled:opacity-50">Siguiente</button>
                </div>
              </div>
            )}
          </main>
        </div>
        <Modal
          show={isModalOpen}
          onClose={handleModalClose}
          title="Registrar nuevo usuario"
        >
          {userCountResult && (
            <UserForm
              roleId={Number(roleId)}
              maxUsersAllowed={
                userCountResult.maxUserCount - userCountResult.UserCount
              }
              onClose={handleModalClose}
              onSuccess={handleUserCreateSuccess}
            />
          )}
        </Modal>
      </div>
    </ProtectedRoute>
  );
};

export default Usuarios;

