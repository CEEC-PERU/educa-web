import React, { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/supervisor/SibebarSupervisor';
import { getUsersByCompanyAndRole, getUsersByRole , getUsersByClassroom } from '../../../services/userService';
import FormField from '../../../components/FormField';
import TableUser from '../../../components/TableUser';
import ButtonContent from '../../../components/Content/ButtonContent';
import UserForm from '../../../components/supervisor/UserForm';
import Modal from '../../../components/Admin/Modal';
import {StudentData} from '../../../interfaces/UsuariosSupervisor';
import { useAuth } from '../../../context/AuthContext';
import { User } from '../../../interfaces/UserAdmin';
import { useUserCount } from '../../../hooks/useUserCount';
import { useDeleteUser } from '../../../hooks/useDeleteUser';
import './../../../app/globals.css';


const Usuarios: React.FC = () => {
  const { deleteUser } = useDeleteUser(); 
  const { usercount, isLoading, error  } = useUserCount();
  const [showSidebar, setShowSidebar] = useState(true);
  const router = useRouter();
  const { logout, user, profileInfo } = useAuth();
  const [studentsData, setStudentsData] = useState<StudentData | null>(null); // Ahora manejamos el objeto completo
  const [filter, setFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userInfor = user as { id: number , enterprise_id :number  , role :number};
  const roleId = 1;
  const [userCountResult, setUserCountResult] = useState<any>(null);
  const enterpriseId = user ? (user as { id: number; role: number; dni: string; enterprise_id: number }).enterprise_id : null;
  const [users, setUsers] = useState<User[]>([]);
  // Llamada a la API para obtener los datos de estudiantes y aulas
  useEffect(() => {
    const fetchStudents = async () => {
      try {

        const storedUserInfo = localStorage.getItem('userInfo');
        if (!storedUserInfo) {
          throw new Error('No se encontró información del usuario en el localStorage.');
        }
  
       const { id , enterprise_id} = JSON.parse(storedUserInfo) as { id: number; enterprise_id: number };
        const data: StudentData = await getUsersByClassroom(id, enterprise_id); // Supongamos que esto devuelve el objeto con supervisor, classrooms y students
        setStudentsData(data);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchStudents();
  }, []);

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFilter(e.target.value);
  };


  
  useEffect(() => {
    if (usercount.length > 0) {
      setUserCountResult(usercount[0]);
    }
  }, [usercount]);

  // Si studentsData no es null, aplicamos los filtros
  const filteredStudents = studentsData?.students?.filter(student =>
    (student.User.userProfile?.first_name?.toLowerCase().includes(filter.toLowerCase()) ||
     student.User.userProfile?.last_name?.toLowerCase().includes(filter.toLowerCase())) ||
    student.User.dni.includes(filter)
  ) || [];

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
      router.reload();
    }
  };

  const handleDeleteClick = async (row: any) => {
    const confirmDelete = window.confirm(`¿Estás seguro de que deseas eliminar al usuario ?`);
    if (confirmDelete) {
      try {
        await deleteUser(row.user_id);
        console.log('Usuario eliminado:', row.user_id);
        alert('Usuario eliminado correctamente.');
       router.reload();
        setUsers(users.filter(user => user.user_id !== row.user_id)); // Actualizar la lista local de usuarios
      } catch (error) {
        alert('Error al eliminar el usuario.');
      }
    }
  };

  
  // Usuarios con perfil
  const studentsWithProfile = filteredStudents.filter(student => student.User.userProfile);

  // Usuarios sin perfil
  const studentsWithoutProfile = filteredStudents.filter(student => !student.User.userProfile);

  const columnsWithProfile = [
   
    { header: ' ', accessor: 'User.userProfile.profile_picture' },
    { header: 'Nombre', accessor: 'User.userProfile.first_name' },
    { header: 'Apellido', accessor: 'User.userProfile.last_name' },
    { header: 'DNI', accessor: 'User.dni' }
  ];

  const columnsWithoutProfile = [
    { header: 'DNI', accessor: 'User.dni' }
  ];

  const handleActionClick = (row: any) => {
    router.push(`/supervisor/usuarios/editUser/${row.user_id}`);
  };

  const handleAddUser = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={true} setShowSidebar={() => {}} />
        <main className={`flex-grow p-6 transition-all duration-300 ease-in-out ${showSidebar ? 'ml-20' : ''}`}>
        <div className='pb-4'>
            {userCountResult && (
              <div>
                <h1 className='font-bold text-2xl text-blue-500'> {userCountResult.UserCount} / {userCountResult.maxUserCount} </h1>
                <h1 className='font-bold text-2xl'> {userCountResult.message} </h1>
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
              <h2 className="text-lg font-semibold mb-2">Usuarios con Perfil</h2>
            <TableUser
            columns={columnsWithProfile}
            data={studentsWithProfile}
            actionLabel="Editar"
            onActionClick={handleActionClick}
            onDeleteClick={handleDeleteClick}
            />

            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">Usuarios sin Perfil</h2>
              <TableUser
                columns={columnsWithoutProfile}
                data={studentsWithoutProfile}
                onDeleteClick={handleDeleteClick}
              />
            </div>
          </div>
        </main>
      </div>
      <Modal show={isModalOpen} onClose={handleModalClose} title="Registrar nuevo usuario"  >
        {userCountResult && (
          <UserForm
            roleId={Number(roleId)}
            maxUsersAllowed={userCountResult.maxUserCount - userCountResult.UserCount}
            onClose={handleModalClose}
            onSuccess={handleUserCreateSuccess}
          />
        )}
      </Modal>
    </div>
  );
};

export default Usuarios;
