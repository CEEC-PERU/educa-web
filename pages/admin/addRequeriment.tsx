import React, { useState } from 'react';
import { createRequirement } from '../../services/requirementService';
import FormField from '../../components/FormField';
import ButtonComponent from '../../components/ButtonDelete';
import Loader from '../../components/Loader';
import AlertComponent from '../../components/AlertComponent';

const RequirementForm = () => {
  const [userId, setUserId] = useState('');
  const [proposedDate, setProposedDate] = useState('');
  const [courseName, setCourseName] = useState('');
  const [message, setMessage] = useState('');
  const [courseDuration, setCourseDuration] = useState('');
  const [materials, setMaterials] = useState<File[][]>([[]]);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newMaterials = [...materials];
      newMaterials[index] = Array.from(e.target.files);
      setMaterials(newMaterials);
    }
  };

  const handleIsActiveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsActive(e.target.checked);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    switch (id) {
      case 'userId':
        setUserId(value);
        break;
      case 'proposedDate':
        setProposedDate(value);
        break;
      case 'courseName':
        setCourseName(value);
        break;
      case 'message':
        setMessage(value);
        break;
      case 'courseDuration':
        setCourseDuration(value);
        break;
      default:
        break;
    }
  };

  const addMaterialField = () => {
    setMaterials([...materials, []]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('proposed_date', proposedDate);
    formData.append('course_name', courseName);
    formData.append('message', message);
    formData.append('course_duration', courseDuration);
    formData.append('is_active', isActive.toString());

    materials.forEach((files, index) => {
      files.forEach((file) => {
        formData.append('materials', file); // Aquí se asegura el nombre del campo
      });
    });

    try {
      const response = await createRequirement(formData);
      setSuccess('Requerimiento creado exitosamente');
    } catch (error) {
      setError('Error creando el requerimiento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {loading && <Loader />}
      {success && <AlertComponent type="success" message={success} onClose={() => setSuccess(null)} />}
      {error && <AlertComponent type="danger" message={error} onClose={() => setError(null)} />}
      <form onSubmit={handleSubmit}>
        <FormField id="userId" label="ID del Usuario" type="text" value={userId} onChange={handleInputChange} />
        <FormField id="proposedDate" label="Fecha Propuesta" type="date" value={proposedDate} onChange={handleInputChange} />
        <FormField id="courseName" label="Nombre del Curso" type="text" value={courseName} onChange={handleInputChange} />
        <FormField id="message" label="Mensaje" type="textarea" value={message} onChange={handleInputChange} />
        <FormField id="courseDuration" label="Duración del Curso" type="text" value={courseDuration} onChange={handleInputChange} />
        {materials.map((_, index) => (
          <div key={index} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-4 mt-4">
            Materiales {index + 1}
          </label>
          <input
            type="file"
            multiple
            onChange={handleFileChange(index)}
            className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
          />
        </div>
        ))}
        <button type="button" onClick={addMaterialField} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">Agregar más materiales</button>
        <div className="mb-4 mt-4">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Enviar Requerimiento</button>
        </div>
        
      </form>
    </div>
  );
};

export default RequirementForm;
