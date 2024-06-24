import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { useRouter } from 'next/router';
import './../app/globals.css';

const ProfilePage: React.FC = () => {
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedProfilePicture, setSelectedProfilePicture] = useState<string>("https://res.cloudinary.com/dk2red18f/image/upload/v1718040983/WEB_EDUCA/AVATAR/cagm8f55ydbdsn8ugzss.jpg");
  const { user } = useAuth();
  const { updateProfile, error, isLoading } = useProfile();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  
  //verificar
  if (!user || typeof user !== 'object' || !('role' in user)) return;

  const { role } = user as { role: number };

  
  const handleProfileUpdate = async (event: React.FormEvent) => {

    const redirectToDashboard = (role: number) => {
      switch (role) {
        case 1:
          router.push('/student');
          break;
        case 2:
          router.push('/corporate');
          break;
        case 3:
          router.push('/content');
          break;
        case 4:
          router.push('/admin');
          break;
        default:
          router.push('/');
      }
    };


    event.preventDefault();
    if (!user) return;

    const profileData = {
      first_name,
      last_name,
      phone,
      profile_picture: selectedProfilePicture,
      email,
    };

    try {
      await updateProfile(profileData);
      redirectToDashboard(role); // Redirigir al perfil correspondiente después de la actualización
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage('Error al actualizar el perfil, por favor intente nuevamente.');
    }
  };

  const handleProfilePictureChange = (imageUrl: string) => {
    setSelectedProfilePicture(imageUrl);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300 relative">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://source.unsplash.com/random/1600x900)' }}>
        <div className="absolute inset-0 bg-gradient-to-rfrom-brand-100 via-brand-200 to-brand-300"></div>
      </div>
      <div className="relative z-10 bg-gray-800 bg-opacity-50 p-8 rounded-lg shadow-md max-w-md w-full ml-auto mr-auto lg:ml-16">
        <h1 className="text-3xl font-bold text-center text-gray-200 mb-6">¡Actualiza tus datos!</h1>
        <p className="text-3x text-center text-gray-200 mb-6">Te invitamos a completar tu perfil para disfrutar de una experiencia personalizada</p>
        <form className="space-y-4" onSubmit={handleProfileUpdate}>
          <div>
            <label className="block text-x font-medium text-gray-300" htmlFor="dni">Nombres</label>
            <input id="first_name" type="text" value={first_name} onChange={(e) => setFirstName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-transparent border-b border-white text-white placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-white sm:text-sm" placeholder="Ingresa tus nombres" />
          </div>
          <div className="relative mb-8">
            <label className="block text-x font-medium text-gray-300" htmlFor="password">Apellidos</label>
            <input type="text" id="last_name" value={last_name} onChange={(e) => setLastName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-transparent border-b border-white text-white placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-white sm:text-sm" placeholder="Ingresa tus apellidos" />
          </div>
          <div>
            <label className="block text-x font-medium text-gray-300" htmlFor="dni">Email</label>
            <input id="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-transparent border-b border-white text-white placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-white sm:text-sm" placeholder="Ingresa tu email" />
          </div>
          <div>
            <label className="block text-x font-medium text-gray-300" htmlFor="dni">Celular</label>
            <input id="phone" type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-transparent border-b border-white text-white placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-white sm:text-sm" placeholder="Ingresa tu celular" />
          </div>
          <div className="flex justify-between items-center">
            <div>
              <label className="block text-x font-medium text-gray-300">Selecciona tu avatar:</label>
              <div className="flex items-center mt-2">
                <button type="button" className="mx-1" onClick={() => handleProfilePictureChange("https://res.cloudinary.com/dk2red18f/image/upload/v1718040983/WEB_EDUCA/AVATAR/cagm8f55ydbdsn8ugzss.jpg")}>
                  <img src="https://res.cloudinary.com/dk2red18f/image/upload/v1718040983/WEB_EDUCA/AVATAR/cagm8f55ydbdsn8ugzss.jpg" alt="Profile 1" className="h-16 w-16 rounded-full" />
                </button>
                <button type="button" className="mx-1" onClick={() => handleProfilePictureChange("https://res.cloudinary.com/dk2red18f/image/upload/v1718120214/WEB_EDUCA/AVATAR/tusuov5aganiihzodh7p.jpg")}>
                  <img src="https://res.cloudinary.com/dk2red18f/image/upload/v1718120214/WEB_EDUCA/AVATAR/tusuov5aganiihzodh7p.jpg" alt="Profile 2" className="h-16 w-16 rounded-full" />
                </button>
              </div>
            </div>
            <div>
              <img src={selectedProfilePicture} alt="Selected Profile" className="h-24 w-24 rounded-full" />
            </div>
          </div>
          {errorMessage && (
            <div className="text-red-500 text-center mb-4">
              {errorMessage}
            </div>
          )}
          <div>
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">Continuar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
