import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getProfessor, deleteProfessor, updateProfessor, getLevels } from '../../services/professorService';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Content/SideBar';
import ActionButtons from '../../components/Content/ActionButtons';
import { uploadImage } from '../../services/imageService';
import MediaUploadPreview from '../../components/MediaUploadPreview';
import FormField from '../../components/FormField';
import { Professor, Level } from '../../interfaces/Professor';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import './../../app/globals.css';
import AlertComponent from '../../components/AlertComponent';
import Loader from '../../components/Loader';
import ModalConfirmation from '../../components/ModalConfirmation';
import useModal from '../../hooks/useModal';

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
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const { isVisible, showModal, hideModal } = useModal();

  useEffect(() => {
    if (id) {
      const fetchProfessor = async () => {
        try {
          const professorData = await getProfessor(Number(id));
          setProfessor(professorData);
        } catch (error) {
          console.error('Error fetching professor details:', error);
          setError('Error fetching professor details');
        } finally {
          setLoading(false);
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
      setFormLoading(true);
      try {
        await deleteProfessor(professor.professor_id);
        setSuccess('Registro eliminado correctamente');
        setTimeout(() => setSuccess(null), 5000);
        router.push('/content/professors');
      } catch (error) {
        console.error('Error deleting professor:', error);
        setError('Error deleting professor');
      } finally {
        setFormLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setProfessor(prevProfessor => prevProfessor ? { ...prevProfessor, [id]: value } : null);
  };

  const handleFileChange = (file: File) => {
    setImageFile(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (professor) {
      setFormLoading(true);
      try {
        let imageUrl = professor.image;
        if (imageFile) {
          imageUrl = await uploadImage(imageFile, 'Profesores');
          setProfessor({ ...professor, image: imageUrl });
        }
        await updateProfessor(professor.professor_id, { ...professor, image: imageUrl });
        setSuccess('Profesor actualizado exitosamente');
        setTimeout(() => setSuccess(null), 3000);
        setIsEditing(false);
      } catch (error) {
        console.error('Error updating professor:', error);
        setError('Error updating professor');
      } finally {
        setFormLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!professor) {
    return <p>Error al cargar los detalles del profesor.</p>;
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <main className={`p-6 flex-grow ${showSidebar ? 'ml-20' : ''} transition-all duration-300 ease-in-out`}>
          {success && (
            <AlertComponent
              type="info"
              message={success}
              onClose={() => setSuccess(null)}
            />
          )}
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center text-purple-600 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Volver
          </button>
          <div className="flex flex-col md:flex-row space-y-4 md:space-x-4 md:space-y-0">
            <div className="md:w-1/2 bg-white p-10 rounded-lg shadow-md flex flex-col">
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
                onDelete={showModal}
                onSave={isEditing ? handleSave : undefined}
                isEditing={isEditing}
              />
            </div>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </main>
      </div>
      {formLoading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <Loader />
        </div>
      )}
      <ModalConfirmation
        show={isVisible}
        onClose={hideModal}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default DetailProfessor;
