import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';
import SidebarDrawer from '../../components/DrawerNavigation';
import { HomeIcon } from '@heroicons/react/24/solid';
import Navbar from '../../components/Navbar';
import { Profile } from '../../interfaces/UserInterfaces';

const StudentIndex: React.FC = () => {
  const { logout, user, profileInfo } = useAuth();
  let name = '';
  let uri_picture = '';
  if (profileInfo) {
    const profile = profileInfo as Profile;
    name = profile.first_name;
    uri_picture = profile.profile_picture!;
  }

  console.log("Profile", profileInfo);

  return (
    <ProtectedRoute>
      <Navbar
        bgColor="bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300"
        user={user ? { profilePicture: uri_picture } : undefined}
      />
      <SidebarDrawer />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300 p-4">
        <div className="flex flex-col lg:flex-row items-center p-8 rounded-lg shadow-md w-full max-w-screen-lg">
          <div className="lg:w-1/2 lg:pr-8 mb-8 lg:mb-0 p-10">
            <p className="text-4xl lg:text-5xl font-bold mb-4 text-brandrosado-800">Hola, {name}</p>
            <p className="mb-4 text-4xl lg:text-5xl text-white">¡Qué bueno verte!</p>
            <p className="mb-4 text-base lg:text-base text-white py-8">
              Este es tu portal de aprendizaje, explora tus cursos y potencia tu desarrollo profesional llevándolo al siguiente nivel con Educaweb.
            </p>
            <div className='bg-brandazul-600 border-2 border-white p-4 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className="bg-brandazul-700 p-2 rounded-lg text-center">
                <p className="text-brandfucsia-900 text-4xl lg:text-7xl">3</p>
                <p className="text-white p-3">Cursos inscritos</p>
              </div>
              <div className="bg-brandazul-700 p-2 rounded-lg text-center">
                <p className="text-brandfucsia-900 text-4xl lg:text-7xl">2</p>
                <p className="text-white p-3">Cursos completados</p>
              </div>
              <div className="bg-brandazul-700 p-2 rounded-lg text-center">
                <p className="text-brandfucsia-900 text-4xl lg:text-7xl">2</p>
                <p className="text-white p-3">Diplomas Obtenidos</p>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2">
            <img
              src='https://res.cloudinary.com/dk2red18f/image/upload/v1718309183/WEB_EDUCA/WEB-IMAGENES/j9c5gcol2t4ejjyq16zy.png'
              className="w-full h-auto max-w-xs lg:max-w-sm mx-auto"
              alt="Imagen descriptiva"
            />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default StudentIndex;
