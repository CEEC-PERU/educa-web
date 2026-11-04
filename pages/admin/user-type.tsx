import React, { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Admin/SideBarAdmin';
import {
  getCompanies,
  getPaginatedUsersByCompanyAndRole,
  getUsersByRole,
} from '../../services/users/userService';
import FormField from '../../components/FormField';
import TableUser from '../../components/TableUser';
import ButtonContent from '../../components/Content/ButtonContent';
import UserForm from '../../components/Admin/UserForm';
import Modal from '../../components/Admin/Modal';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';
import { User } from '../../interfaces/User/UserAdmin';
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
  const [debouncedFilter, setDebouncedFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const STUDENT_ROLE_ID = 1; // Reemplaza este valor con el ID real del rol de estudiante
  const ADMIN_ROLE_ID = 4; // Reemplaza este valor con el ID real del rol de admin
  const CONTENT_ROLE_ID = 3; // Reemplaza este valor con el ID real del rol de contenido
  const PAGE_SIZE = 50;
  const isCompanyScopedList = Boolean(
    roleId && Number(roleId) !== ADMIN_ROLE_ID && Number(roleId) !== CONTENT_ROLE_ID
  );
  const showProductColumn = Number(selectedCompany) === 2;

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedFilter(filter.trim()), 350);
    return () => clearTimeout(timer);
  }, [filter]);

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
    let active = true;
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        if (
          roleId &&
          (Number(roleId) === ADMIN_ROLE_ID ||
            Number(roleId) === CONTENT_ROLE_ID)
        ) {
          const usersData: User[] = await getUsersByRole(roleId.toString());
          if (!active) return;
          setUsers(usersData);
          setTotalCount(usersData.length);
          setTotalPages(1);
        } else if (selectedCompany && roleId) {
          const response = await getPaginatedUsersByCompanyAndRole(
            selectedCompany,
            Number(roleId),
            page,
            PAGE_SIZE,
            debouncedFilter,
          );
          if (!active) return;
          setUsers(response.users);
          setTotalCount(response.totalCount);
          setTotalPages(response.totalPages);
        } else {
          if (!active) return;
          setUsers([]);
          setTotalCount(0);
          setTotalPages(0);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        if (active) setLoadingUsers(false);
      }
    };

    fetchUsers();
    return () => { active = false; };
  }, [selectedCompany, roleId, page, debouncedFilter]);

  const handleFilterChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFilter(e.target.value);
  };

  const filteredUsers = users.filter(
    (user) => isCompanyScopedList || (
      user.userProfile?.first_name
        ?.toLowerCase()
        .includes(filter.toLowerCase()) ||
      user.userProfile?.last_name
        ?.toLowerCase()
        .includes(filter.toLowerCase())
    )
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
    columnsWithProfile.push({ header: 'Producto', accessor: 'product' });
    columnsWithoutProfile.push({ header: 'Producto', accessor: 'product' });
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
    if (!roleId) return;
    try {
      if (Number(roleId) === ADMIN_ROLE_ID || Number(roleId) === CONTENT_ROLE_ID) {
        const usersData: User[] = await getUsersByRole(roleId.toString());
        setUsers(usersData);
        setTotalCount(usersData.length);
        setTotalPages(1);
      } else if (selectedCompany) {
        const response = await getPaginatedUsersByCompanyAndRole(
          selectedCompany,
          Number(roleId),
          page,
          PAGE_SIZE,
          debouncedFilter,
        );
        setUsers(response.users);
        setTotalCount(response.totalCount);
        setTotalPages(response.totalPages);
      }
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
            <div className="flex space-x-4 mb-4">
              {roleId && Number(roleId) === STUDENT_ROLE_ID && (
                <div>
                  <ButtonContent
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
                <ButtonContent
                  buttonLabel="Agregar Usuario"
                  backgroundColor="bg-gradient-to-r from-green-500 to-green-400"
                  textColor="text-white"
                  fontSize="text-xs"
                  buttonSize="py-2 px-7"
                  onClick={handleAddUser}
                />
              </div>
            </div>
            {roleId &&
              Number(roleId) !== ADMIN_ROLE_ID &&
              Number(roleId) !== CONTENT_ROLE_ID && (
                <div className="gap-6 w-full max-w-2xl flex space-x-4 mb-6 mt-8">
                  {companies.map((company, index) => (
                    <ButtonContent
                      key={company.enterprise_id}
                      buttonLabel={company.name}
                      backgroundColor={
                        buttonColors[index % buttonColors.length]
                      }
                      buttonSize="py-2 px-4"
                      onClick={() => { setSelectedCompany(company.enterprise_id); setPage(1); }}
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
                onChange={(event) => { handleFilterChange(event); setPage(1); }}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-8xl">
              <div>
                <h2 className="text-lg font-semibold mb-2">
                  Usuarios con Perfil
                </h2>
                <TableUser
                  columns={columnsWithProfile}
                  data={usersWithProfile}
                  showProductColumn={showProductColumn}
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
                  showProductColumn={showProductColumn}
                />
              </div>
            </div>
            {isCompanyScopedList && selectedCompany && (
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3" aria-live="polite">
                <span className="text-sm text-gray-600">
                  {loadingUsers ? 'Cargando usuarios...' : `${totalCount.toLocaleString()} usuarios`}
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    disabled={loadingUsers || page <= 1}
                    className="rounded border border-gray-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                  >Anterior</button>
                  <span className="text-sm text-gray-700">Pagina {page} de {Math.max(totalPages, 1)}</span>
                  <button
                    type="button"
                    onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                    disabled={loadingUsers || page >= totalPages}
                    className="rounded border border-gray-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                  >Siguiente</button>
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
          <UserForm
            roleId={Number(roleId)}
            onClose={handleModalClose}
            onSuccess={handleUserCreateSuccess}
          />
        </Modal>
      </div>
    </ProtectedRoute>
  );
};

export default RoleDetail;

