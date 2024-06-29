import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getProfessor, deleteProfessor, updateProfessor, getLevels } from '../../services/professorService';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/SideBar';
import ActionButtons from '../../components/ActionButtons';
import { uploadImage } from '../../services/imageService';
import MediaUploadPreview from '../../components/MediaUploadPreview';
import FormField from '../../components/FormField';
import { Professor, Level } from '../../interfaces/Professor';
import ButtonComponent from '../../components/ButtonDelete';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import './../../app/globals.css';

const DetailProfessor: React.FC = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [levels, setLevels] = useState<Level[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchProfessor = async () => {
        try {
          const professorData = await getProfessor(Number(id));
          setProfessor(professorData);
        } catch (error) {
          console.error('Error fetching professor details:', error);
        }
      };
      fetchProfessor();
    }
  }, [id]);

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const levelsData = await getLevels();
        setLevels(levelsData);
      } catch (error) {
        console.error('Error fetching levels:', error);
        setError('Error fetching levels');
      }
    };
    fetchLevels();
  }, []);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
    localStorage.setItem('sidebarState', JSON.stringify(!showSidebar));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = async () => {
    if (professor) {
      try {
        await deleteProfessor(professor.professor_id);
        router.push('/content/professors');
      } catch (error) {
        console.error('Error deleting professor:', error);
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfessor(prevProfessor => prevProfessor ? { ...prevProfessor, [name]: value } : null);
  };

  const handleFileChange = (file: File) => {
    setImageFile(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (professor) {
      try {
        let imageUrl = professor.image;
        if (imageFile) {
          imageUrl = await uploadImage(imageFile, 'Profesores');
          setProfessor({ ...professor, image: imageUrl });
        }
        await updateProfessor(professor.professor_id, { ...professor, image: imageUrl });
        setSuccess('Profesor actualizado exitosamente');
        setIsEditing(false);
      } catch (error) {
        console.error('Error updating professor:', error);
        setError('Error updating professor');
      }
    }
  };

  if (!professor) {
    return <p>Loading...</p>;
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90"/>
      <div className="flex flex-1 pt-16">
      <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <main className={`p-6 flex-grow ${showSidebar ? 'ml-64' : ''} transition-all duration-300 ease-in-out`}>
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center text-purple-600 mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Volver
        </button>
        <div className="flex space-x-4">
          <div className="w-1/2 bg-white p-10 rounded-lg shadow-md flex flex-col">
            <div className="flex items-center mb-4">
              <img className="w-40 h-40 rounded-full shadow-lg mr-4" src={professor.image} alt={`${professor.full_name} image`} />
              <h1 className="text-4xl font-bold">{professor.full_name}</h1>
            </div>
            <hr className="my-4"/>
            {!isEditing ? (
              <div>
                <p className="mb-4 text-lg"><strong>Especialización:</strong> {professor.especialitation}</p>
                <p className="mb-4 text-lg">{professor.description}</p>
                <p className="mb-4 text-lg"><strong>Nivel:</strong> {levels.find(level => level.level_id === professor.level_id)?.name || 'N/A'}</p>
              </div>
            ) : (
              <form onSubmit={handleSave}>
                <FormField
                  id="full_name"
                  label="Nombre Completo"
                  type="text"
                  value={professor.full_name}
                  onChange={handleChange}
                />
                <div className="mb-4">
                  <label className="block text-blue-400 text-sm font-bold mb-4" htmlFor="image">Imagen</label>
                  <MediaUploadPreview onMediaUpload={handleFileChange} accept="image/*" label="Subir Imagen" />
                </div>
                <FormField
                  id="especialitation"
                  label="Especialización"
                  type="text"
                  value={professor.especialitation}
                  onChange={handleChange}
                />
                <FormField
                  id="description"
                  label="Descripción"
                  type="textarea"
                  value={professor.description}
                  onChange={handleChange}
                />
                <FormField
                  id="level_id"
                  label="Nivel"
                  type="select"
                  value={professor.level_id.toString()}
                  onChange={handleChange}
                  options={levels.map(level => ({ value: level.level_id.toString(), label: level.name }))}
                />
              </form>
            )}
          </div>
          <div className="bg-white rounded-lg">
            <ActionButtons
              onEdit={handleEdit}
              onCancel={isEditing ? handleCancel : undefined}
              onDelete={handleDelete}
              onSave={isEditing ? handleSave : undefined}
              isEditing={isEditing}
            />
          </div>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {success && <p className="text-green-500 mt-2">{success}</p>}
      </main>
      </div>
    </div>
  );
};

export default DetailProfessor;
