import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../hooks/user/useProfile';
import { useRouter } from 'next/router';

const ROLE_ROUTES: Record<number, string> = {
  1: '/student',
  2: '/corporate',
  3: '/content',
  4: '/admin',
  5: '/admincorporative',
  6: '/supervisor',
  7: '/calidad',
  8: '/comercial',
};

const AVATARS = [
  {
    id: 1,
    url: 'https://res.cloudinary.com/dk2red18f/image/upload/v1718040983/WEB_EDUCA/AVATAR/cagm8f55ydbdsn8ugzss.jpg',
    alt: 'Avatar 1',
  },
  {
    id: 2,
    url: 'https://res.cloudinary.com/dk2red18f/image/upload/v1718120214/WEB_EDUCA/AVATAR/tusuov5aganiihzodh7p.jpg',
    alt: 'Avatar 2',
  },
];

function getPasswordError(password: string, confirmPassword: string): string {
  if (!password || !confirmPassword) return '';
  if (password !== confirmPassword) return 'Las contraseñas no coinciden';
  if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
  if (!/[A-Z]/.test(password)) return 'La contraseña debe contener al menos una mayúscula';
  if (!/\d/.test(password)) return 'La contraseña debe contener al menos un número';
  return '';
}

const ProfilePage: React.FC = () => {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [selectedProfilePicture, setSelectedProfilePicture] = useState(AVATARS[0].url);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);

  const { user, token, refreshProfile } = useAuth();
  const { updateProfile } = useProfile();
  const router = useRouter();

  const passwordError = getPasswordError(form.password, form.confirmPassword);

  if (!user || typeof user !== 'object' || !('role' in user)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando usuario...
      </div>
    );
  }

  const { role } = user as { role: number };
  const { id } = user as { id: number };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submittingRef.current) return;

    const { first_name, last_name, email, phone, password, confirmPassword } = form;

    if (!first_name || !last_name || !email || !phone || !password || !confirmPassword) {
      setErrorMessage('Por favor, completa todos los campos obligatorios.');
      return;
    }

    if (passwordError) {
      setErrorMessage('Por favor, corrige los errores en la contraseña.');
      return;
    }

    submittingRef.current = true;
    setIsSubmitting(true);

    try {
      await updateProfile({
        first_name,
        last_name,
        phone,
        profile_picture: selectedProfilePicture,
        email,
        password,
      });
      await refreshProfile(token as string, id);
      router.push(ROLE_ROUTES[role] ?? '/');
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage('Error al actualizar el perfil, por favor intente nuevamente.');
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300 relative p-4">
      <div className="relative z-10 bg-gray-800 bg-opacity-80 p-6 md:p-8 rounded-lg shadow-xl max-w-md w-full mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-100 mb-4">
          ¡Actualiza tus datos!
        </h1>
        <p className="text-center text-gray-200 mb-6">
          Completa tu perfil para disfrutar de una experiencia personalizada
        </p>

        <form className="space-y-4" onSubmit={handleProfileUpdate}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="first_name">
                Nombres *
              </label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                value={form.first_name}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 bg-opacity-50 border-b border-gray-400 text-white placeholder-gray-400 focus:outline-none focus:border-white focus:ring-0 rounded-t"
                placeholder="Ingresa tus nombres"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="last_name">
                Apellidos *
              </label>
              <input
                id="last_name"
                name="last_name"
                type="text"
                value={form.last_name}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 bg-opacity-50 border-b border-gray-400 text-white placeholder-gray-400 focus:outline-none focus:border-white focus:ring-0 rounded-t"
                placeholder="Ingresa tus apellidos"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="email">
              Email *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 bg-opacity-50 border-b border-gray-400 text-white placeholder-gray-400 focus:outline-none focus:border-white focus:ring-0 rounded-t"
              placeholder="Ingresa tu email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="phone">
              Celular *
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 bg-opacity-50 border-b border-gray-400 text-white placeholder-gray-400 focus:outline-none focus:border-white focus:ring-0 rounded-t"
              placeholder="Ingresa tu celular"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="password">
                Nueva Contraseña *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 bg-opacity-50 border-b border-gray-400 text-white placeholder-gray-400 focus:outline-none focus:border-white focus:ring-0 rounded-t"
                placeholder="Mínimo 8 caracteres"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="confirmPassword">
                Confirmar Contraseña *
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 bg-opacity-50 border-b border-gray-400 text-white placeholder-gray-400 focus:outline-none focus:border-white focus:ring-0 rounded-t"
                placeholder="Repite tu contraseña"
                required
              />
            </div>
          </div>

          {passwordError && (
            <div className="text-yellow-400 text-sm mt-1">{passwordError}</div>
          )}

          <div className="flex flex-col md:flex-row justify-between items-center mt-6">
            <div className="w-full md:w-1/2 mb-4 md:mb-0">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Selecciona tu avatar:
              </label>
              <div className="flex space-x-2">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => setSelectedProfilePicture(avatar.url)}
                    className={`p-1 rounded-full ${selectedProfilePicture === avatar.url ? 'ring-2 ring-blue-400' : ''}`}
                  >
                    <img src={avatar.url} alt={avatar.alt} className="h-12 w-12 rounded-full" />
                  </button>
                ))}
              </div>
            </div>
            <div className="w-full md:w-1/2 flex justify-center md:justify-end">
              <div className="relative">
                <img
                  src={selectedProfilePicture}
                  alt="Selected Profile"
                  className="h-20 w-20 rounded-full border-2 border-white"
                />
                <span className="absolute bottom-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  ✓
                </span>
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="text-red-400 text-center py-2 px-4 rounded bg-red-900 bg-opacity-50">
              {errorMessage}
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Procesando...
                </div>
              ) : (
                'Actualizar Perfil'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
