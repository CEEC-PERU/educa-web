// components/DetailEnterprise.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getEnterprise, updateEnterprise, deleteEnterprise } from '../../services/enterpriseService';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/SideBar';
import ActionButtons from '../../components/ActionButtons';
import { uploadImage } from '../../services/imageService';
import MediaUploadPreview from '../../components/MediaUploadPreview';
import FormField from '../../components/FormField';
import { Enterprise } from '../../interfaces/Enterprise';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import './../../app/globals.css';

const DetailEnterprise: React.FC = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const [enterprise, setEnterprise] = useState<Enterprise | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchEnterprise = async () => {
        try {
          const enterpriseData = await getEnterprise(Number(id));
          setEnterprise(enterpriseData);
        } catch (error) {
          console.error('Error fetching enterprise details:', error);
        }
      };
      fetchEnterprise();
    }
  }, [id]);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
    localStorage.setItem('sidebarState', JSON.stringify(!showSidebar));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = async () => {
    if (enterprise) {
      try {
        await deleteEnterprise(enterprise.enterprise_id);
        router.push('/enterprise');
      } catch (error) {
        console.error('Error deleting enterprise:', error);
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEnterprise(prevEnterprise => prevEnterprise ? { ...prevEnterprise, [name]: value } : null);
  };

  const handleFileChange = (file: File) => {
    setImageFile(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (enterprise) {
      try {
        let imageUrl = enterprise.image_log;
        if (imageFile) {
          imageUrl = await uploadImage(imageFile, 'Empresas');
          setEnterprise({ ...enterprise, image_log: imageUrl });
        }
        await updateEnterprise(enterprise.enterprise_id, { ...enterprise, image_log: imageUrl });
        setSuccess('Empresa actualizada exitosamente');
        setIsEditing(false);
      } catch (error) {
        console.error('Error updating enterprise:', error);
        setError('Error updating enterprise');
      }
    }
  };

  if (!enterprise) {
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
          <div className="w-1/1 bg-white p-10 rounded-lg shadow-md flex flex-col">
            <div className="flex items-center mb-4">
              <img className="w-40 h-40 rounded-full shadow-lg mr-4" src={enterprise.image_log} alt={`${enterprise.name} image`} />
              <h1 className="text-4xl font-bold">{enterprise.name}</h1>
            </div>
            <hr className="my-4"/>
            {!isEditing ? (
              <div>
              </div>
            ) : (
              <form onSubmit={handleSave}>
                <FormField
                  id="name"
                  label="Nombre"
                  type="text"
                  value={enterprise.name}
                  onChange={handleChange}
                />
                <div className="mb-4">
                  <label className="block text-blue-400 text-sm font-bold mb-4" htmlFor="image">Imagen</label>
                  <MediaUploadPreview onMediaUpload={handleFileChange} accept="image/*" label="Subir Imagen" />
                </div>
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

export default DetailEnterprise;
