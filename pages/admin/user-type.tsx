import React, { useState, useEffect, ChangeEvent, useRef } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Admin/SideBarAdmin';
import {
  getCompanies,
  getPaginatedUsersByCompanyAndRole,
  getUsersByRole,
  resetUserPassword,
} from '../../services/users/userService';
import { KeyIcon } from '@heroicons/react/24/outline';
import FormField from '../../components/FormField';
import TableUser from '../../components/TableUser';
import ButtonContent from '../../components/Content/ButtonContent';
import UserForm from '../../components/Admin/UserForm';
import Modal from '../../components/Admin/Modal';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';
import { User } from '../../interfaces/User/UserAdmin';
import { Enterprise } from '../../interfaces/Enterprise';
import './../../app/globals.css';
import { API_ADMIN_RIMAC_SYNC } from '../../utils/Endpoints';

const RoleDetail: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const router = useRouter();
  const { user, token } = useAuth();
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
  const [temporaryPassword, setTemporaryPassword] = useState<string | null>(null);
  const [resettingUser, setResettingUser] = useState(false);
  const [userToReset, setUserToReset] = useState<User | null>(null);
  const [rimacSyncing, setRimacSyncing] = useState(false);
  const rimacFileInput = useRef<HTMLInputElement>(null);

  const STUDENT_ROLE_ID = 1; // Reemplaza este valor con el ID real del rol de estudiante
  const ADMIN_ROLE_ID = 4; // Reemplaza este valor con el ID real del rol de admin
  const CONTENT_ROLE_ID = 3; // Reemplaza este valor con el ID real del rol de contenido
  const PAGE_SIZE = 50;
  const isCompanyScopedList = Boolean(
    roleId && Number(roleId) !== ADMIN_ROLE_ID && Number(roleId) !== CONTENT_ROLE_ID
  );
  const showProductColumn = Number(selectedCompany) === 2;
  const isSystemAdmin = typeof user === 'object' && user !== null && Number(user.role) === 4;
  const canSyncRimac = isSystemAdmin && Number(roleId) === STUDENT_ROLE_ID && Number(selectedCompany) === 2;

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

  const handleResetPassword = (row: User) => {
    setUserToReset(row);
  };

  const confirmResetPassword = async () => {
    if (!userToReset) return;
    if (userToReset.user_id == null) {
      setUserToReset(null);
      window.alert('No se encontró el identificador del usuario.');
      return;
    }
    setResettingUser(true);
    try {
      const result = await resetUserPassword(userToReset.user_id);
      setTemporaryPassword(result.temporaryPassword);
      setUserToReset(null);
    } catch (error) {
      console.error('Error generando clave temporal:', error);
      window.alert('No se pudo generar la clave temporal. Inténtalo nuevamente.');
    } finally {
      setResettingUser(false);
    }
  };

  const handleExportCSV = () => {
    router.push('/admin/student/exportCsv');
  };

  const handleRimacFileSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Permite seleccionar de nuevo el mismo archivo tras corregir un error.
    event.target.value = '';
    if (!file) return;
    if (!/\.(xlsx|csv)$/i.test(file.name)) {
      toast.error('Selecciona un archivo .xlsx o .csv.');
      return;
    }
    if (!token) {
      toast.error('Tu sesión expiró. Inicia sesión nuevamente.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('enterprise_id', '2');
    setRimacSyncing(true);
    const toastId = toast.loading('Procesando archivo Rimac. Puede tardar varios minutos; no cierres esta página.');
    try {
      const response = await axios.post(API_ADMIN_RIMAC_SYNC, formData, {
        headers: { Authorization: `Bearer ${token}` },
        // Sin timeout del cliente; el servidor o proxy de despliegue aún puede imponer uno.
        timeout: 0,
      });
      const summary = response.data;
      toast.success(
        `Sincronización completada: ${summary.creados ?? 0} creados, ${summary.mantenidos ?? 0} mantenidos, ${summary.reactivados ?? 0} reactivados y ${summary.desactivados ?? 0} desactivados.`,
        { id: toastId, duration: 12000, description: summary.advertenciaSeguridad },
      );
      if (roleId) {
        try {
          const refreshed = await getPaginatedUsersByCompanyAndRole(2, Number(roleId), page, PAGE_SIZE, debouncedFilter);
          setUsers(refreshed.users);
          setTotalCount(refreshed.totalCount);
          setTotalPages(refreshed.totalPages);
        } catch (refreshError) {
          console.error('Sincronización completada, pero no se pudo actualizar la tabla:', refreshError);
        }
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'No se pudo completar la sincronización.';
      toast.error(message, { id: toastId, duration: 12000 });
    } finally {
      setRimacSyncing(false);
    }
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
              {canSyncRimac && (
                <>
                  <input
                    ref={rimacFileInput}
                    type="file"
                    accept=".xlsx,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
                    className="hidden"
                    onChange={handleRimacFileSelected}
                    disabled={rimacSyncing}
                  />
                  <button
                    type="button"
                    onClick={() => rimacFileInput.current?.click()}
                    disabled={rimacSyncing}
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md transition hover:from-blue-700 hover:to-violet-700 disabled:cursor-wait disabled:opacity-70"
                  >
                    {rimacSyncing && <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
                    {rimacSyncing ? 'Procesando archivo...' : 'Sincronizar Excel Rimac'}
                  </button>
                </>
              )}
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
                  onResetPassword={handleResetPassword}
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
                  onResetPassword={handleResetPassword}
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
        {userToReset && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget && !resettingUser) setUserToReset(null); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="reset-password-title" className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-5 text-white"><div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white/15"><KeyIcon className="h-6 w-6" /></div><h2 id="reset-password-title" className="text-xl font-semibold">Generar clave temporal</h2><p className="mt-1 text-sm text-white/80">Confirma el restablecimiento de acceso</p></div>
            <div className="px-6 py-5"><p className="text-sm leading-6 text-gray-700">Se generará una clave temporal para <strong className="text-gray-900">{userToReset.userProfile?.first_name || userToReset.user_name || 'este usuario'}</strong>.</p><div className="mt-4 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3.5"><span className="text-amber-600" aria-hidden="true">●</span><p className="text-sm leading-5 text-amber-900">La clave actual dejará de funcionar. El usuario deberá crear una nueva al iniciar sesión.</p></div></div>
            <div className="flex justify-end gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4"><button type="button" disabled={resettingUser} onClick={() => setUserToReset(null)} className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50">Cancelar</button><button type="button" disabled={resettingUser} onClick={confirmResetPassword} className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-700 disabled:cursor-wait disabled:opacity-70">{resettingUser ? 'Generando…' : <><KeyIcon className="h-4 w-4" /> Generar clave</>}</button></div>
          </section>
        </div>}
        {temporaryPassword && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"><section role="dialog" aria-modal="true" aria-labelledby="temporary-password-title" className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"><div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-5 text-white"><div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white/15"><KeyIcon className="h-6 w-6" /></div><h2 id="temporary-password-title" className="text-xl font-semibold">Clave temporal lista</h2><p className="mt-1 text-sm text-white/85">Compártela con el usuario de forma segura</p></div><div className="px-6 py-5"><p className="mb-3 text-sm leading-5 text-gray-600">Esta clave solo se mostrará ahora. Al iniciar sesión, deberá elegir una nueva.</p><div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 p-3"><code className="min-w-0 flex-1 break-all font-mono text-base font-semibold tracking-wide text-gray-900">{temporaryPassword}</code><button type="button" onClick={async () => { try { await navigator.clipboard?.writeText(temporaryPassword); } catch { /* La selección manual sigue disponible. */ } }} className="shrink-0 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">Copiar</button></div><p className="mt-3 text-xs text-gray-500">Guárdala antes de cerrar esta ventana.</p></div><div className="flex justify-end border-t border-gray-100 bg-gray-50 px-6 py-4"><button type="button" onClick={() => setTemporaryPassword(null)} className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700">Listo</button></div></section></div>}
      </div>
    </ProtectedRoute>
  );
};

export default RoleDetail;

