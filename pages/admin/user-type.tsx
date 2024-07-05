import React, { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/SideBarAdmin';
import { getCompanies, getUsersByCompanyAndRole } from '../../services/userService';
import FormField from '../../components/FormField';
import TableUser from '../../components/TableUser'; // Importar la tabla reutilizable
import ButtonComponent from '../../components/ButtonDelete'; // Importar el componente ButtonComponent

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

  const buttonColors = [
    'bg-gradient-purple text-white',
    'bg-gradient-yellow text-white',
    'bg-gradient-green text-white',
    'bg-gradient-purple text-white',
    'bg-gradient-yellow text-white',
    'bg-gradient-green text-white',
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
    if (selectedCompany && roleId) {
      const fetchUsers = async () => {
        try {
          const usersData = await getUsersByCompanyAndRole(selectedCompany, Number(roleId));
          console.log(usersData);
          setUsers(usersData);
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };

      fetchUsers();
    }
  }, [selectedCompany, roleId]);

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFilter(e.target.value);
  };

  const filteredUsers = users.filter(user => 
    user.profile.first_name.includes(filter) || user.profile.last_name.includes(filter)
  );

  const columns = [
    { header: '', accessor: 'profile_picture' },
    { header: 'Nombre', accessor: 'first_name' },
    { header: 'Apellido', accessor: 'last_name' },
    { header: 'DNI', accessor: 'dni' },
    { header: 'Contraseña', accessor: 'password' },
  ];

  const handleActionClick = (row: any) => {
    console.log('Action clicked for row:', row);
    // Aquí puedes manejar la lógica de la acción, como redirigir a una página de edición
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={true} setShowSidebar={() => {}} />
        <main className={`flex-grow p-6 transition-all duration-300 ease-in-out ${showSidebar ? 'ml-64' : ''}`}>
          <div className="gap-6 w-full max-w-2xl flex space-x-4 mb-6">
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
          <div className="grid grid-cols-1 gap-6 w-full max-w-4xl">
            <FormField
              id="filter"
              label="Filtrar por nombre o apellido"
              type="text"
              value={filter}
              onChange={handleFilterChange}
            />
          </div>
          <div className="grid grid-cols-1 gap-6 w-full max-w-4xl">
            <TableUser
              columns={columns}
              data={filteredUsers}
              actionLabel="Editar"
              onActionClick={handleActionClick}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default RoleDetail;
