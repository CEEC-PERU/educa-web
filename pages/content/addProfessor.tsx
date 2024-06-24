import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/SideBar';
import { Professor, Level } from '../../interfaces/Professor';
import axios from '../../services/axios';
import { uploadImage } from '../../services/imageService';
import MediaUploadPreview from '../../components/MediaUploadPreview';
import FormField from '../../components/FormField';
import ActionButtons from '../../components/ActionButtons';
import ButtonComponent from '../../components/ButtonDelete';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import './../../app/globals.css';

const AddProfessors: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [profesor, setProfesor] = useState<Omit<Professor, 'professor_id' | 'created_at' | 'updated_at'>>({
    full_name: '',
    image: '',
    especialitation: '',
    description: '',
    level_id: 0,
  });
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const router = useRouter();

  useEffect(() => {
    axios.get<Professor[]>('/professors/')
      .then(response => {
        setProfessors(response.data);
      })
      .catch(error => {
        console.error('Error fetching professors:', error);
        setError('Error fetching professors');
      });

    axios.get<Level[]>('/professors/levels')
      .then(response => {
        setLevels(response.data);
      })
      .catch(error => {
        console.error('Error fetching levels:', error);
        setError('Error fetching levels');
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfesor(prevProfesor => ({ ...prevProfesor, [name]: value }));
  };

  const handleFileChange = (file: File) => {
    setImageFile(file);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
    localStorage.setItem('sidebarState', JSON.stringify(!showSidebar));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = profesor.image;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, 'Profesores');
      }
      const response = await axios.post('/professors', { ...profesor, image: imageUrl });
      setProfessors([...professors, response.data]);
      setProfesor({
        full_name: '',
        image: '',
        especialitation: '',
        description: '',
        level_id: 0,
      });
      setSuccess('Profesor agregado exitosamente');
    } catch (error) {
      console.error('Error adding professor:', error);
      setError('Error adding professor');
    }
  };

  const handleCancel = () => {
    setProfesor({
      full_name: '',
      image: '',
      especialitation: '',
      description: '',
      level_id: 0,
    });
    setImageFile(null);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" toggleSidebar={toggleSidebar} />
      <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <main className={`p-6 flex-grow ${showSidebar ? 'ml-64' : ''} transition-all duration-300 ease-in-out pt-16`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-white p-6 rounded w-full">
            <form onSubmit={handleSubmit}>
              <button
                type="button"
                onClick={() => router.back()}
                className="flex items-center text-purple-600 mb-6"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Volver
              </button>
              <FormField
                id="full_name"
                label="Nombre Completo"
                type="text"
                value={profesor.full_name}
                onChange={handleChange}
              />
              <div className="mb-4">
                <label htmlFor="image" className="block text-blue-400 mb-2">Imagen</label>
                <MediaUploadPreview onMediaUpload={handleFileChange} accept="image/*" label="Subir Imagen" />
              </div>
              <FormField
                id="especialitation"
                label="Especialización"
                type="text"
                value={profesor.especialitation}
                onChange={handleChange}
              />
              <FormField
                id="description"
                label="Descripción"
                type="textarea"
                value={profesor.description}
                onChange={handleChange}
                rows={4}
              />
              <FormField
                id="level_id"
                label="Nivel"
                type="select"
                value={profesor.level_id.toString()}
                onChange={handleChange}
                options={[{ value: '', label: 'Seleccionar Nivel' }, ...levels.map(level => ({ value: level.level_id.toString(), label: level.name }))]}
              />
              <div className="flex justify-end space-x-2 mt-4">
                <ButtonComponent buttonLabel="Guardar" onClick={handleSubmit} backgroundColor="bg-purple-500" textColor="text-white" fontSize="text-sm" buttonSize="py-3 px-4" />
              </div>
            </form>
          </div>
          <div className="items-center">
            <ActionButtons onSave={handleSubmit} onCancel={handleCancel} isEditing={true} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddProfessors;
