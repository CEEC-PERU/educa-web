import React, { useState, useEffect } from 'react';
import { User } from '../../interfaces/UserAdmin';
import { Enterprise } from '../../interfaces/Enterprise';
import { createIndividualUser, getCompanies } from '../../services/userService';
import FormField from '../../components/FormField';
import Loader from '../../components/Loader';
import AlertComponent from '../../components/AlertComponent';

interface UserFormProps {
  roleId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const SupervisorForm: React.FC<UserFormProps> = ({ roleId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<User>({
    dni: '',
    password: '',
    role_id: roleId,
    enterprise_id: 0,
    user_name: '',
    expired_at: undefined,
    failed_login_attempts: 0,
    last_failed_login: undefined,
    created_at: undefined,
    updated_at: undefined,
  });
  const [companies, setCompanies] = useState<Enterprise[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const companiesData = await getCompanies();
        setCompanies(companiesData);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchCompanies();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prevData => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createIndividualUser(formData);
      setSuccess('Usuario creado exitosamente');
      setTimeout(() => {
        setSuccess(null);
        onSuccess();
      }, 4000);
    } catch (error) {
      console.error('Error creating user:', error);
      setError('Error creando usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md w-full max-w-md mx-auto">
      {loading && <Loader />}
      <form onSubmit={handleSubmit}>
        {success && <AlertComponent type="success" message={success} onClose={() => setSuccess(null)} />}
        {error && <AlertComponent type="danger" message={error} onClose={() => setError(null)} />}

        <FormField id="dni" label="DNI" type="text" value={formData.dni} onChange={handleChange} />
        <FormField id="password" label="Contraseña" type="password" value={formData.password} onChange={handleChange} />

        <FormField 
          id="enterprise_id" 
          label="Empresa" 
          type="select" 
          value={formData.enterprise_id} 
          onChange={handleChange} 
          options={[{ value: '', label: 'Seleccione una empresa' }, ...companies.map(company => ({ value: company.enterprise_id.toString(), label: company.name }))]}
        />
        
        <div className="flex justify-end space-x-4 mt-8">
          <button type="button" onClick={onClose} className="bg-gray-500 text-white py-2 px-4 rounded">
            Cancelar
          </button>
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default SupervisorForm;
