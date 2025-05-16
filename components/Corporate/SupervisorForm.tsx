import React, { useState, useEffect } from 'react';
import { User } from '../../interfaces/User/UserAdmin';
import { Enterprise } from '../../interfaces/Enterprise';
import { createIndividualUser, getCompanies } from '../../services/userService';
import FormField from '../../components/FormField';
import Loader from '../../components/Loader';
import AlertComponent from '../../components/AlertComponent';

interface UserFormProps {
  roleId: number;
  initialEnterpriseId: number;
  onClose: () => void;
  onSuccess: (userId: number) => void;
}

const SupervisorForm: React.FC<UserFormProps> = ({
  roleId,
  initialEnterpriseId,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<User>({
    dni: '',
    password: '',
    role_id: roleId,
    enterprise_id: initialEnterpriseId,
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
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
      ...(id === 'dni' && { password: value }), // Set password to match DNI
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setIsSubmitted(true); // Prevents modal closure after submission

    try {
      const createdUser = await createIndividualUser(formData);
      setSuccess('Usuario creado exitosamente');

      setTimeout(() => {
        setSuccess(null);
        if (createdUser && createdUser.user_id) {
          onSuccess(createdUser.user_id);
        }
      }, 700);
    } catch (error) {
      console.error('Error creating user:', error);
      setError('Error creando usuario');
      setIsSubmitted(false); // Allows closing the modal if there is an error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md w-full max-w-md mx-auto">
      {loading && <Loader />}
      <form onSubmit={handleSubmit}>
        {success && (
          <AlertComponent
            type="success"
            message={success}
            onClose={() => setSuccess(null)}
          />
        )}
        {error && (
          <AlertComponent
            type="danger"
            message={error}
            onClose={() => setError(null)}
          />
        )}

        <FormField
          id="dni"
          label="DNI"
          type="text"
          value={formData.dni}
          onChange={handleChange}
        />

        {/* Password field is non-editable and displays a message */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <input
            type="text"
            id="password"
            value={formData.password}
            readOnly
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            La contraseña será igual al DNI.
          </p>
        </div>

        <div className="flex justify-end space-x-4 mt-8">
          {/* Disable the close button if the form is submitted */}
          <button
            type="button"
            onClick={!isSubmitted ? onClose : undefined}
            className={`bg-gray-500 text-white py-2 px-4 rounded ${
              isSubmitted ? 'cursor-not-allowed opacity-50' : ''
            }`}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default SupervisorForm;
