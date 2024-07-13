import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getUserById, updateUser } from '../../../services/userService';
import { getEnterprise } from '../../../services/enterpriseService';
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/Admin/SideBarAdmin';
import FormField from '../../../components/FormField';
import ButtonComponent from '../../../components/ButtonDelete';
import Alert from '../../../components/AlertComponent';

import './../../../app/globals.css';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const EditUser: React.FC = () => {
  const router = useRouter();
  const { userId } = router.query;
  const [user, setUser] = useState<any>(null);
  const [enterprise, setEnterprise] = useState<any>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');


  useEffect(() => {
    const fetchUserAndEnterprise = async () => {
      if (userId) {
        try {
          const userData = await getUserById(Number(userId));
          setUser(userData);

          const enterpriseData = await getEnterprise(userData.enterprise_id);
          setEnterprise(enterpriseData);
        } catch (error) {
          setError('Error fetching user or enterprise data');
          console.error('Error fetching user or enterprise data:', error);
        }
      }
    };

    fetchUserAndEnterprise();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    const [field, subField] = id.split('.');

    if (subField) {
      setUser((prevState: any) => ({
        ...prevState,
        [field]: {
          ...prevState[field],
          [subField]: value,
        },
      }));
    } else {
      setUser((prevState: any) => ({
        ...prevState,
        [id]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await updateUser(Number(userId), user);
      setAlertMessage('Usuario editado correctamente');
      setShowAlert(true);
      setIsEditing(false);
  
      // Re-fetch user data to ensure it's updated
      const userData = await getUserById(Number(userId));
      setUser(userData);
  
      // Optionally, you can also re-fetch enterprise data if needed
      // const enterpriseData = await getEnterprise(userData.enterprise_id);
      // setEnterprise(enterpriseData);
  
      // No need to redirect using router.push() to stay on the same page
    } catch (error) {
      setError('Error updating user');
      console.error('Error updating user:', error);
    } finally {
      setFormLoading(false);
    }
  };
  

  if (!user || !enterprise) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={true} setShowSidebar={() => {}} />
        <main className={`p-6 flex-grow transition-all duration-300 ease-in-out ${true ? 'ml-20' : ''}`}>
        {showAlert && (
          <Alert
            type="info"
            message={alertMessage}
            onClose={() => setShowAlert(false)}
          />
        )}
          <div className="relative w-full max-w-full lg:max-w-4xl mx-auto mb-8">
            <img
              src={enterprise.image_fondo}
              className="w-full h-auto"
              alt="Imagen descriptiva"
            />
            <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center lg:justify-start lg:items-start p-4">
              <img
                src={user.userProfile?.profile_picture}
                alt="Profile"
                className="h-40 w-40 rounded-full border-4 border-white"
              />
            </div>
          </div>
          <div className="w-full max-w-full lg:max-w-4xl mx-auto p-4 text-center lg:text-center">
            <h2 className="2xl:text-4xl lg:text-4xl md:text-4xl text-white font-bold mb-3">
              {user.userProfile?.first_name} {user.userProfile?.last_name}
            </h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-brandrosado-800 text-white px-4 py-2 rounded-full hover:bg-brandmorado-700"
            >
              {isEditing ? 'Cancelar' : 'Editar Perfil'}
            </button>
          </div>
          {isEditing ? (
            <form onSubmit={handleSubmit} className="lg:max-w-4xl mx-auto p-4">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="bg-gray-200 p-4 rounded-lg shadow-md">
                <p className="text-lg font-medium text-gray-600">Nombres</p>
                <input
                  id="userProfile.first_name"
                  type="text"
                  value={user.userProfile?.first_name || ''}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  className={`mt-1 block w-full px-3 py-2 bg-transparent border-b ${isEditing ? 'border-gray-400' : 'border-transparent'} text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-gray-400 sm:text-sm`}
                />
              </div>
              <div className="bg-gray-200 p-4 rounded-lg shadow-md">
                <p className="text-lg font-medium text-gray-600">Apellidos</p>
                <input
                  id="userProfile.last_name"
                  type="text"
                  value={user.userProfile?.last_name || ''}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  className={`mt-1 block w-full px-3 py-2 bg-transparent border-b ${isEditing ? 'border-gray-400' : 'border-transparent'} text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-gray-400 sm:text-sm`}
                />
              </div>
              <div className="bg-purple-300 p-4 rounded-lg shadow-md">
                <p className="text-lg font-medium text-white">Email</p>
                <input
                  id="userProfile.email"
                  type="text"
                  value={user.userProfile?.email || ''}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  className={`mt-1 block w-full px-3 py-2 bg-transparent border-b ${isEditing ? 'border-white' : 'border-transparent'} text-white placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-white sm:text-sm`}
                />
              </div>
              <div className="bg-purple-300 p-4 rounded-lg shadow-md">
                <p className="text-lg font-medium text-white">Teléfono</p>
                <input
                  id="userProfile.phone"
                  type="text"
                  value={user.userProfile?.phone || ''}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  className={`mt-1 block w-full px-3 py-2 bg-transparent border-b ${isEditing ? 'border-white' : 'border-transparent'} text-white placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-white sm:text-sm`}
                />
              </div>
              <div className="bg-gray-200 p-4 rounded-lg shadow-md">
                <p className="text-lg font-medium text-gray-600">Empresa</p>
                <input
                  id="enterprise.name"
                  type="text"
                  value={enterprise.name}
                  readOnly
                  className="mt-1 block w-full px-3 py-2 bg-transparent border-b border-gray-400 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-gray-400 sm:text-sm"
                />
              </div>
              <div className="bg-gray-200 p-4 rounded-lg shadow-md">
                <p className="text-lg font-medium text-gray-600">Usuario</p>
                <input
                  id="dni"
                  type="text"
                  value={user.dni}
                  readOnly
                  className="mt-1 block w-full px-3 py-2 bg-transparent border-b border-gray-400 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-gray-400 sm:text-sm"
                />
              </div>
            </div>
            {isEditing && (
              <div className="flex justify-center mt-4">
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full"
                >
                  Guardar Cambios
                </button>
              </div>
            )}
          </form>
          ) : (
            <div className="lg:max-w-4xl mx-auto p-4">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="bg-gray-200 p-4 rounded-lg shadow-md">
                  <p className="text-lg font-medium text-gray-600">Nombres</p>
                  <input
                    id="nombres"
                    type="text"
                    value={user.userProfile?.first_name || ''}
                    readOnly
                    className="mt-1 block w-full px-3 py-2 bg-transparent border-b border-gray-400 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-gray-400 sm:text-sm"
                  />
                </div>
                <div className="bg-gray-200 p-4 rounded-lg shadow-md">
                  <p className="text-lg font-medium text-gray-600">Apellidos</p>
                  <input
                    id="apellidos"
                    type="text"
                    value={user.userProfile?.last_name || ''}
                    readOnly
                    className="mt-1 block w-full px-3 py-2 bg-transparent border-b border-gray-400 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-gray-400 sm:text-sm"
                  />
                </div>
                <div className="bg-purple-300 p-4 rounded-lg shadow-md">
                  <p className="text-lg font-medium text-white">Email</p>
                  <input
                    id="email"
                    type="text"
                    value={user.userProfile?.email || ''}
                    readOnly
                    className="mt-1 block w-full px-3 py-2 bg-transparent border-b border-white text-white placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-white sm:text-sm"
                  />
                </div>
                <div className="bg-purple-300 p-4 rounded-lg shadow-md">
                  <p className="text-lg font-medium text-white">Teléfono</p>
                  <input
                    id="phone"
                    type="text"
                    value={user.userProfile?.phone || ''}
                    readOnly
                    className="mt-1 block w-full px-3 py-2 bg-transparent border-b border-white text-white placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-white sm:text-sm"
                  />
                </div>
                <div className="bg-gray-200 p-4 rounded-lg shadow-md">
                  <p className="text-lg font-medium text-gray-600">Empresa</p>
                  <input
                    id="empresa"
                    type="text"
                    value={enterprise.name}
                    readOnly
                    className="mt-1 block w-full px-3 py-2 bg-transparent border-b border-gray-400 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-gray-400 sm:text-sm"
                  />
                </div>
                <div className="bg-gray-200 p-4 rounded-lg shadow-md">
                  <p className="text-lg font-medium text-gray-600">Usuario</p>
                  <input
                    id="dni"
                    type="text"
                    value={user.dni}
                    readOnly
                    className="mt-1 block w-full px-3 py-2 bg-transparent border-b border-gray-400 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-gray-400 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default EditUser;
