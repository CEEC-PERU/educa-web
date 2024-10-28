import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_USERS_CREATE } from '../../utils/Endpoints';
import AlertComponent from '../../components/AlertComponent';
import * as XLSX from 'xlsx';

//usuarios formulario para registrar
const UserForm: React.FC<{ roleId: number; onClose: () => void; onSuccess: () => void; maxUsersAllowed: number }> = ({ roleId, onClose, onSuccess, maxUsersAllowed }) => {
  
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { user, token } = useAuth();
  const userInfo = user as { id: number, enterprise_id: number };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const newUsers = jsonData.slice(1).map((row) => ({
        dni: row[0]?.toString(),
        password: row[0]?.toString(),
        is_active: true,
        role_id: roleId,
        enterprise_id: userInfo.enterprise_id,
      }));

      if (newUsers.length > maxUsersAllowed) {
        setError(`Excede el límite permitido. Solo puede registrar ${maxUsersAllowed} usuarios.`);
        return;
      }

      setUsers(newUsers);
      setError(null); // Limpiar errores si la carga es exitosa
    };

    reader.readAsArrayBuffer(file);
  };

  const handleRegister = async () => {
    try {
      if (users.length > maxUsersAllowed) {
        setError(`Excede el límite permitido. Solo puede registrar ${maxUsersAllowed} usuarios.`);
        return;
      }

      const response = await fetch(API_USERS_CREATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Añadir el token de autenticación
        },
        body: JSON.stringify(users),
      });

      if (!response.ok) {
        throw new Error('Error al registrar usuarios');
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
          type="file"
          accept=".xlsx, .xls"
          className="w-48 p-2 border rounded-lg shadow-sm"
          onChange={handleFileUpload}
        />
      </div>

      {success && <AlertComponent type="success" message={success} onClose={() => setSuccess(null)} />}
      {error && <AlertComponent type="danger" message={error} onClose={() => setError(null)} />}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b bg-gray-100 text-left text-gray-600 font-semibold">Usuario</th>
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
          className="bg-yellow-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-600 transition duration-300"
        >
          Registrar
        </button>
      </div>
    </div>
  );
};

export default UserForm;
