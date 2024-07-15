import React, { useState, useEffect } from 'react';
import { Enterprise } from '../../interfaces/Enterprise';
import axios from '../../services/axios';
import { uploadImage } from '../../services/imageService';
import MediaUploadPreview from '../../components/MediaUploadPreview';
import FormField from '../../components/FormField';
import Loader from '../../components/Loader';
import AlertComponent from '../../components/AlertComponent';

interface EnterpriseFormProps {
  enterprise?: Enterprise;
  onClose: () => void;
  onSuccess: () => void;
}

const EnterpriseForm: React.FC<EnterpriseFormProps> = ({ enterprise, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<Omit<Enterprise, 'enterprise_id'>>({
    name: '',
    image_log: '',
    image_fondo: '',
  });
  const [imageLogFile, setImageLogFile] = useState<File | null>(null);
  const [imageFondoFile, setImageFondoFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (enterprise) {
      setFormData({
        name: enterprise.name,
        image_log: enterprise.image_log,
        image_fondo: enterprise.image_fondo,
      });
    }
  }, [enterprise]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prevData => ({ ...prevData, [id]: value }));
  };

  const handleFileChange = (file: File, type: 'log' | 'fondo') => {
    if (type === 'log') {
      setImageLogFile(file);
    } else {
      setImageFondoFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageLogUrl = formData.image_log;
      let imageFondoUrl = formData.image_fondo;

      if (imageLogFile) {
        imageLogUrl = await uploadImage(imageLogFile, 'Empresas/Logos');
      }

      if (imageFondoFile) {
        imageFondoUrl = await uploadImage(imageFondoFile, 'Empresas/Fondos');
      }

      const requestMethod = enterprise ? 'put' : 'post';
      const url = enterprise ? `/enterprises/${enterprise.enterprise_id}` : '/enterprises';
      await axios[requestMethod](url, { ...formData, image_log: imageLogUrl, image_fondo: imageFondoUrl });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving enterprise:', error);
      setError('Error saving enterprise');
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

        <FormField id="name" label="Nombre" type="text" value={formData.name} onChange={handleChange} />
        <div className="mb-4">
          <label htmlFor="image_log" className="block text-blue-400 mb-2">Imagen Logo</label>
          <MediaUploadPreview onMediaUpload={(file) => handleFileChange(file, 'log')} accept="image/*" label="Subir Imagen Logo" initialPreview={formData.image_log} />
        </div>
        <div className="mb-4">
          <label htmlFor="image_fondo" className="block text-blue-400 mb-2">Imagen Fondo</label>
          <MediaUploadPreview onMediaUpload={(file) => handleFileChange(file, 'fondo')} accept="image/*" label="Subir Imagen Fondo" initialPreview={formData.image_fondo} />
        </div>
        <div className="flex justify-end space-x-4">
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

export default EnterpriseForm;
