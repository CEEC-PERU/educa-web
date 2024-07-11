import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Content/SideBar';
import { Professor, Level } from '../../interfaces/Professor';
import axios from '../../services/axios';
import { uploadImage } from '../../services/imageService';
import MediaUploadPreview from '../../components/MediaUploadPreview';
import FormField from '../../components/FormField';
import ActionButtons from '../../components/ActionButtons';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import './../../app/globals.css';
import AlertComponent from '../../components/AlertComponent';
import Loader from '../../components/Loader';

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
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [professorsRes, levelsRes] = await Promise.all([
          axios.get<Professor[]>('/professors/'),
          axios.get<Level[]>('/professors/levels'),
        ]);
        setProfessors(professorsRes.data);
        setLevels(levelsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setProfesor(prevProfesor => ({ ...prevProfesor, [id]: value }));
  };

  const handleFileChange = (file: File) => {
    setImageFile(file);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
    localStorage.setItem('sidebarState', JSON.stringify(!showSidebar));
  };

  const validateFields = () => {
    const { full_name, especialitation, description, level_id } = profesor;
    if (!full_name || !especialitation || !description || level_id === 0) {
      setError('Todos los campos son obligatorios.');
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFields()) {
      return;
    }
    setFormLoading(true);
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
      setImageFile(null);
      setShowAlert(true);
      setSuccess('Profesor agregado exitosamente');
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    } catch (error) {
      console.error('Error adding professor:', error);
      setError('Error adding professor');
    } finally {
      setFormLoading(false);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90"/>
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <main className={`p-6 flex-grow ${showSidebar ? 'ml-20' : ''} transition-all duration-300 ease-in-out`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded w-full">
              <form onSubmit={handleSubmit}>
                {showAlert && (
                  <AlertComponent
                    type={error ? "danger" : "success"}
                    message={error || "Profesor agregado exitosamente."}
                    onClose={() => setShowAlert(false)}
                  />
                )}
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
              </form>
            </div>
            <div className="items-center">
              <ActionButtons onSave={handleSubmit} onCancel={handleCancel} isEditing={true} />
            </div>
          </div>
        </main>
      </div>
      {formLoading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default AddProfessors;
