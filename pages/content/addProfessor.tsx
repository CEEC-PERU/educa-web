import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Content/SideBar';
import { Professor, Level } from '../../interfaces/Professor';
import { getLevels, addProfessor } from '../../services/professorService';
import MediaUploadPreview from '../../components/MediaUploadPreview';
import FormField from '../../components/FormField';
import ActionButtons from '../../components/Content/ActionButtons';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import './../../app/globals.css';
import AlertComponent from '../../components/AlertComponent';
import Loader from '../../components/Loader';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';

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
  const [clearMediaPreview, setClearMediaPreview] = useState(false);
  const [touchedFields, setTouchedFields] = useState<{ [key: string]: boolean }>({});

  const router = useRouter();
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [levelsRes] = await Promise.all([
          getLevels(),
        ]);
        setLevels(levelsRes);
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
    setTouchedFields(prevTouched => ({ ...prevTouched, [id]: true }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id } = e.target;
    setTouchedFields(prevTouched => ({ ...prevTouched, [id]: true }));
  };

  const handleFileChange = (file: File) => {
    setImageFile(file);
    setTouchedFields(prevTouched => ({ ...prevTouched, image: true }));
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
    localStorage.setItem('sidebarState', JSON.stringify(!showSidebar));
  };

  const validateFields = () => {
    const requiredFields = ['full_name', 'especialitation', 'description', 'level_id'];
    const newTouchedFields: { [key: string]: boolean } = {};
    requiredFields.forEach(field => {
      if (!profesor[field as keyof typeof profesor]) {
        newTouchedFields[field] = true;
      }
    });

    const newErrors: { [key: string]: boolean } = {};
    requiredFields.forEach(field => {
      if (!profesor[field as keyof typeof profesor]) {
        newErrors[field] = true;
      }
    });

    if (!imageFile) {
      newTouchedFields['image'] = true;
      newErrors['image'] = true;
    }

    setTouchedFields(prev => ({ ...prev, ...newTouchedFields }));
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFields()) {
      setError('Todos los campos son obligatorios.');
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      return;
    }
    setFormLoading(true);
    try {
      const response = await addProfessor(profesor, imageFile!);
      setProfessors([...professors, response]);
      setProfesor({
        full_name: '',
        image: '',
        especialitation: '',
        description: '',
        level_id: 0,
      });
      setImageFile(null);
      setTouchedFields({});
      setClearMediaPreview(true);
      setTimeout(() => setClearMediaPreview(false), 500);
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
    setTouchedFields({});
    setClearMediaPreview(true);
    setTimeout(() => setClearMediaPreview(false), 500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <ProtectedRoute>
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90"/>
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <main className={`p-6 flex-grow ${showSidebar ? 'ml-20' : ''} transition-all duration-300 ease-in-out flex flex-col md:flex-row md:space-x-4`}>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl rounded-lg flex-grow">
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
              onBlur={handleBlur}
              error={!profesor.full_name && touchedFields['full_name']}
              touched={touchedFields['full_name']}
              required
            />
            <div className="mb-4">
              <label htmlFor="image" className="block text-blue-400 mb-2">Imagen</label>
              <MediaUploadPreview
                onMediaUpload={handleFileChange}
                accept="image/*"
                label="Subir Imagen"
                inputRef={imageInputRef}
                clearMediaPreview={clearMediaPreview}
                error={!imageFile && touchedFields['image']}
                touched={touchedFields['image']}
              />
            </div>
            <FormField
              id="especialitation"
              label="Especialización"
              type="text"
              value={profesor.especialitation}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!profesor.especialitation && touchedFields['especialitation']}
              touched={touchedFields['especialitation']}
              required
            />
            <FormField
              id="description"
              label="Descripción"
              type="textarea"
              value={profesor.description}
              onChange={handleChange}
              onBlur={handleBlur}
              rows={4}
              error={!profesor.description && touchedFields['description']}
              touched={touchedFields['description']}
              required
            />
            <FormField
              id="level_id"
              label="Nivel"
              type="select"
              value={profesor.level_id.toString()}
              onChange={handleChange}
              onBlur={handleBlur}
              options={[{ value: '', label: 'Seleccionar Nivel' }, ...levels.map(level => ({ value: level.level_id.toString(), label: level.name }))]}
              error={profesor.level_id === 0 && touchedFields['level_id']}
              touched={touchedFields['level_id']}
              required
            />
          </form>
          <div className="mt-4 md:mt-0 md:ml-4 flex-shrink-0">
            <ActionButtons onSave={handleSubmit} onCancel={handleCancel} isEditing={true} customSize={true} />
          </div>
        </main>
      </div>
      {formLoading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <Loader />
        </div>
      )}
    </div>
    </ProtectedRoute>
  );
};

export default AddProfessors;
