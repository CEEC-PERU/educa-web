import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Admin/SideBarAdmin';
import CardUser from '../../components/Admin/CardUser';
import { useRouter } from 'next/router';
import { getRoles } from '../../services/userService';
import { Role } from '../../interfaces/User/UserAdmin';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';
import {
  ChevronUpIcon,
  PencilIcon,
  CheckCircleIcon,
  ClipboardIcon,
} from '@heroicons/react/24/outline'; // Importar iconos
import './../../app/globals.css';

const iconMapping: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } =
  {
    admin: CheckCircleIcon,
    student: ClipboardIcon,
    corporate: ChevronUpIcon,
    content: PencilIcon,
  };

const Usuarios: React.FC = () => {
  const router = useRouter();
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesData = await getRoles();
        setRoles(rolesData);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    fetchRoles();
  }, []);

  const handleCardClick = (roleId: number) => {
    router.push(`/admin/user-type?roleId=${roleId}`);
  };

  return (
    <ProtectedRoute>
      <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
        <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
        <div className="flex flex-1 pt-16">
          <Sidebar showSidebar={true} setShowSidebar={() => {}} />
          <main className="p-6 flex-grow transition-all duration-300 ease-in-out flex flex-wrap justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {roles.map((role) => {
                const Icon = iconMapping[role.name.toLowerCase()] || PencilIcon;
                return (
                  <CardUser
                    key={role.role_id}
                    Icon={Icon}
                    title={`Usuarios ${role.name}`}
                    buttonLabel="Ver Usuarios"
                    onButtonClick={() => handleCardClick(role.role_id)}
                  />
                );
              })}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Usuarios;
