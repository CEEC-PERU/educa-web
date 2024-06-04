// pages/login.tsx

import React from 'react';
import './../app/globals.css'; // Asegúrate de importar tus estilos globales

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500 relative">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://source.unsplash.com/random/1600x900)' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-cyan-900 opacity-90"></div>
      </div>
      <div className="relative z-10 bg-gray-800 bg-opacity-50 p-8 rounded-lg shadow-md max-w-md w-full ml-auto mr-auto lg:ml-16">
        <h1 className="text-3xl font-bold text-center text-gray-200 mb-6">Inicio de Sesión</h1>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300" htmlFor="email">Correo Electrónico</label>
            <input type="email" id="email" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300" htmlFor="password">Contraseña</label>
            <input type="password" id="password" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">Recordarme</label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-blue-400 hover:text-blue-500">¿Olvidaste tu contraseña?</a>
            </div>
          </div>
          <div>
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">Iniciar Sesión</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
