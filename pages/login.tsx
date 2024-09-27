import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './../app/globals.css'; // Asegúrate de importar tus estilos globales

const LoginPage: React.FC = () => {
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const { login, error } = useAuth();  // Accedemos al error del AuthContext
  const [showPassword, setShowPassword] = useState(false);
  
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);  // Estado para controlar la alerta

  // Muestra la alerta si hay un error
  useEffect(() => {
    if (error) {
      setErrorMessage(error); // Guardamos el error del contexto
      setShowAlert(true);
    }
  }, [error]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setShowAlert(false); // Limpiamos la alerta anterior

    // Validación: si los campos están vacíos, mostrar alerta
    if (!dni || !password) {
      setErrorMessage('Debes completar todos los campos');
      setShowAlert(true);
      return;
    }

    try {
      await login(dni, password);
      // Aquí puedes manejar el éxito de la autenticación si es necesario
    } catch (error: any) {
      // Si hay un error de autenticación, muestra el mensaje de error
      setErrorMessage('Usuario o contraseña incorrectos');
      setShowAlert(true);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500 relative">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://source.unsplash.com/random/1600x900)' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300"></div>
      </div>
      <div className="relative z-10 bg-gray-800 bg-opacity-50 p-8 rounded-lg shadow-md max-w-md w-full ml-auto mr-auto lg:ml-16">
        <h1 className="text-4xl font-bold text-center text-gray-200 mb-6">¡Nos alegra verte de nuevo por aquí!</h1>
        <p className="text-4xl text-center text-gray-200 mb-6">Inicia sesión para acceder a tu cuenta</p>
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-gray-300" htmlFor="dni">Username</label>
            <input 
              id="dni" 
              type="text" 
              value={dni} 
              onChange={(e) => setDni(e.target.value)} 
              className="mt-1 block w-full px-3 py-2 bg-transparent border-b border-white text-white placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-white sm:text-sm" 
              placeholder="Introduce tu usuario" 
            />
          </div>
          <div className="relative mb-8">
            <label className="block text-sm font-medium text-gray-300" htmlFor="password">Contraseña</label>
            <input 
              type={showPassword ? "text" : "password"} 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="mt-1 block w-full px-3 py-2 bg-transparent border-b border-white text-white placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-white sm:text-sm" 
              placeholder="Introduce tu contraseña" 
            />
            <button 
              type="button" 
              onClick={togglePasswordVisibility} 
              className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="white">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12m0 0a3 3 0 11-6 0 3 3 0 016 0zm0 0c1.104 0 2.149.217 3.134.616m.325 1.585A8.12 8.12 0 0121 12c-1.637-3.134-4.833-6-9-6s-7.363 2.866-9 6c.8 1.529 2.033 2.89 3.541 3.928M15 12a3.009 3.009 0 01-2.166.84m-3.215-1.804C8.252 10.227 9.354 9 12 9m3 3a3 3 0 01-2.166 2.997M3.75 3l16.5 16.5" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="white">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12m0 0a3 3 0 11-6 0 3 3 0 016 0zm0 0c1.104 0 2.149.217 3.134.616m.325 1.585A8.12 8.12 0 0121 12c-1.637-3.134-4.833-6-9-6s-7.363 2.866-9 6c.8 1.529 2.033 2.89 3.541 3.928M15 12a3.009 3.009 0 01-2.166.84m-3.215-1.804C8.252 10.227 9.354 9 12 9m3 3a3 3 0 01-2.166 2.997M3.75 3l16.5 16.5" />
                </svg>
              )}
            </button>
          </div>
          {showAlert && (  // Mostramos mensajes de error
            <div className="text-red-500 text-sm">
              {errorMessage} {/* Muestra el mensaje de error */}
            </div>
          )}
          <div>
            <button 
              type="submit" 
              className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Iniciar sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
