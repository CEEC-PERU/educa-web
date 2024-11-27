import React, { useState } from 'react';
import { useProfile2 } from '../../hooks/useProfile';
import Loader from '@/components/Loader';
import { useRouter } from 'next/router';

import Alert from '../../components/AlertComponent';
interface ProfileFormProps {
  userId: number;
  onSuccess: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ userId, onSuccess }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [selectedProfilePicture, setSelectedProfilePicture] = useState<string>('https://res.cloudinary.com/dk2red18f/image/upload/v1718040983/WEB_EDUCA/AVATAR/cagm8f55ydbdsn8ugzss.jpg');
  const { updateProfile2, isLoading, error } = useProfile2(userId);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false); 
  const handleProfileUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Profile",userId)

    const profileData = {
      user_id: userId,
      first_name: firstName,
      last_name: lastName,
      phone,
      profile_picture: selectedProfilePicture,
      email,
    };

    try {
      await updateProfile2(profileData);
      onSuccess(); // Llama a onSuccess para cerrar el modal
      router.reload();
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage('Error al actualizar el perfil, por favor intente nuevamente.');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
       {showAlert && (
        <Alert
          type="warning"
          message="Debe completar su perfil antes de cerrar."
          onClose={() => setShowAlert(false)}
        />
      )}
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Completa el Perfil</h2>
      <form onSubmit={handleProfileUpdate} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombres</label>
          <input
            type="text"
            placeholder="Ingresa tus nombres"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Apellidos</label>
          <input
            type="text"
            placeholder="Ingresa tus apellidos"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            placeholder="Ingresa tu correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Celular</label>
          <input
            type="text"
            placeholder="Ingresa tu número de celular"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Selecciona tu avatar:</label>
          <div className="flex items-center space-x-4">
            <button type="button" onClick={() => setSelectedProfilePicture("https://res.cloudinary.com/dk2red18f/image/upload/v1718040983/WEB_EDUCA/AVATAR/cagm8f55ydbdsn8ugzss.jpg")} className={`p-1 rounded-full ${selectedProfilePicture === "https://res.cloudinary.com/dk2red18f/image/upload/v1718040983/WEB_EDUCA/AVATAR/cagm8f55ydbdsn8ugzss.jpg" ? "ring-4 ring-blue-500" : "ring-2 ring-gray-300"} transition`}>
              <img src="https://res.cloudinary.com/dk2red18f/image/upload/v1718040983/WEB_EDUCA/AVATAR/cagm8f55ydbdsn8ugzss.jpg" alt="Avatar 1" className="h-16 w-16 rounded-full" />
            </button>
            <button type="button" onClick={() => setSelectedProfilePicture("https://res.cloudinary.com/dk2red18f/image/upload/v1718120214/WEB_EDUCA/AVATAR/tusuov5aganiihzodh7p.jpg")} className={`p-1 rounded-full ${selectedProfilePicture === "https://res.cloudinary.com/dk2red18f/image/upload/v1718120214/WEB_EDUCA/AVATAR/tusuov5aganiihzodh7p.jpg" ? "ring-4 ring-blue-500" : "ring-2 ring-gray-300"} transition`}>
              <img src="https://res.cloudinary.com/dk2red18f/image/upload/v1718120214/WEB_EDUCA/AVATAR/tusuov5aganiihzodh7p.jpg" alt="Avatar 2" className="h-16 w-16 rounded-full" />
            </button>
          </div>
        </div>

        {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
        
        <div className="text-center mt-6">
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isLoading ? <Loader /> : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
