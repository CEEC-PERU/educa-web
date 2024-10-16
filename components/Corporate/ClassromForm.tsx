import React, { useState, useEffect } from 'react';
import { ClassroomRequest, Shift } from '../../interfaces/Classroom'; 
import { createClassroom } from '../../services/classroomService';
import { getShifts } from '../../services/shiftService';
import FormField from '../../components/FormField';
import Loader from '../../components/Loader';
import AlertComponent from '../../components/AlertComponent';
import { useAuth } from '../../context/AuthContext';
import { User } from '../../interfaces/UserAdmin';
import { getCompanies, getUsersByCompanyAndRole, getUsersByRole } from '../../services/userService';
interface ClassroomFormProps {
  onClose: () => void;
  onSuccess: () => void;
}


const ClassroomForm: React.FC<ClassroomFormProps> = ({ onClose, onSuccess }) => {
  const { user } = useAuth();
  const userInfo = user as { id: number; enterprise_id: number };

  const [formData, setFormData] = useState<ClassroomRequest>({
    code: '',
    enterprise_id: userInfo.enterprise_id,
    shift_id: 0,
    user_id: 0,
  });

  const [users, setUsers] = useState<User[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const shiftsData = await getShifts();
        setShifts(shiftsData);
      } catch (error) {
        console.error('Error fetching shifts:', error);
      }
    };

    const fetchUsers = async () => {
      try {
        const usersData = await getUsersByCompanyAndRole(userInfo.enterprise_id , 6 );
        setUsers(usersData);
        
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();

    fetchShifts();
  }, []);

  
      
     
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prevData => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createClassroom(formData);
      setSuccess('Aula creada exitosamente');
      setTimeout(() => {
        setSuccess(null);
        onSuccess(); // Trigger success callback
      }, 4000);
    } catch (error) {
      console.error('Error creating classroom:', error);
      setError('Error creando aula');
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

        <FormField id="code" label="Código" type="text" value={formData.code} onChange={handleChange} />

        <FormField 
          id="shift_id" 
          label="Turno" 
          type="select" 
          value={formData.shift_id} 
          onChange={handleChange} 
          options={[{ value: '', label: 'Seleccione un turno' }, ...shifts.map(shift => ({ value: shift.shift_id.toString(), label: shift.name }))]}
        />

<FormField 
  id="user_id" 
  label="Profesor" 
  type="select" 
  value={formData.user_id?.toString() || ''}  // Garantiza que sea un string o cadena vacía
  onChange={handleChange} 
  options={[
    { value: '', label: 'Seleccione un profesor' }, 
    ...users.map(user => ({
      value: user.user_id?.toString() || '',  // Verifica si user_id es undefined y usa cadena vacía
      label: user.userProfile?.first_name || 'Sin nombre'  // Proporciona un valor predeterminado
    }))
  ]}
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

export default ClassroomForm;
