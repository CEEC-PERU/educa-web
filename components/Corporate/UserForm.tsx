import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_USERS_CREATE } from '../../utils/Endpoints';
import AlertComponent from '../../components/AlertComponent';

const UserForm: React.FC<{ roleId: number; onClose: () => void; onSuccess: () => void; maxUsersAllowed: number }> = ({ roleId, onClose, onSuccess, maxUsersAllowed }) => {
  const [userCount, setUserCount] = useState<number>(0);
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { user, token } = useAuth();
  const userInfo = user as { id: number, enterprise_id: number };

  const handleUserCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserCount(Number(e.target.value));
  };

  const generateDNI = () => {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
  };

  const generateUsers = () => {
    if (userCount > maxUsersAllowed) {
      setError(`Excede de los usuarios designados. Solo puede registrar ${maxUsersAllowed} usuarios o menos.`);
      return;
    }
    const newUsers = [];
    for (let i = 0; i < userCount; i++) {
      const dni = generateDNI();
      newUsers.push({
        dni,
        password: dni,
        is_active: true,
        role_id: 1,
        enterprise_id: userInfo.enterprise_id,
      });
    }
    setUsers(newUsers);
    setError(null);  // Clear error message if users are generated successfully
  };

  const handleRegister = async () => {
    try {
      if (userCount > maxUsersAllowed) {
        setError(`Excede de los usuarios designados. Solo puede registrar ${maxUsersAllowed} usuarios o menos.`);
        return;
      }

      const response = await fetch(API_USERS_CREATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Add authorization header if needed
        },
        body: JSON.stringify(users),
      });

      if (!response.ok) {
        throw new Error('Failed to register users');
      }

      setSuccess('Usuarios registrados correctamente');
      onSuccess();
    } catch (error) {
      setError('Error al registrar usuarios');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="font-bold text-3xl text-center mb-6">Registrar nuevos usuarios</h1>
      <div className="mb-4 flex items-center justify-center">
        <input
          type="number"
          className="w-48 p-2 border rounded-lg shadow-sm focus:ring focus:outline-none focus:border-blue-500"
          value={userCount}
          onChange={handleUserCountChange}
          placeholder={`Número de usuarios (máximo ${maxUsersAllowed})`}
        />
        <button
          onClick={generateUsers}
          className="ml-4 bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Generar Usuarios
        </button>
      </div>

      {success && <AlertComponent type="success" message={success} onClose={() => setSuccess(null)} />}
      {error && <AlertComponent type="danger" message={error} onClose={() => setError(null)} />}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b bg-gray-100 text-left text-gray-600 font-semibold">Ususario</th>
              <th className="py-2 px-4 border-b bg-gray-100 text-left text-gray-600 font-semibold">Contraseña</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{user.dni}</td>
                <td className="py-2 px-4">{user.password}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={handleRegister}
          className="bg-green-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-600 transition duration-300"
        >
          Registrar
        </button>
      </div>
    </div>
  );
};

export default UserForm;
