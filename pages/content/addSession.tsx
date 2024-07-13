import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Content/SideBar';
import MediaUploadPreview from '../../components/MediaUploadPreview';
import { addSession } from '../../services/sessionService';
import { uploadVideo } from '../../services/videoService';
import { Session } from '../../interfaces/Session';
import FormField from '../../components/FormField';
import ActionButtons from '../../components/ActionButtons';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import './../../app/globals.css';
import AlertComponent from '../../components/AlertComponent'; 
import Loader from '../../components/Loader'; 

const AddSession: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [session, setSession] = useState<Omit<Session, 'session_id'>>({
    video_enlace: '',
    duracion_minutos: 0,
    name: '',
    module_id: 0
  });
  const [error, setError] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false); 
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [clearMediaPreview, setClearMediaPreview] = useState(false); 
  const [loading, setLoading] = useState(true); 
  const [formLoading, setFormLoading] = useState(false); 
  const [touchedFields, setTouchedFields] = useState<{ [key: string]: boolean }>({});
  const router = useRouter();
  const { moduleId } = router.query; 
  const videoInputRef = useRef<{ clear: () => void }>(null);

  useEffect(() => {
    if (moduleId) {
      setSession(prevSession => ({ ...prevSession, module_id: Number(moduleId) }));
      setLoading(false); 
    }
  }, [moduleId]);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
    localStorage.setItem('sidebarState', JSON.stringify(!showSidebar));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value, type, checked } = e.target as HTMLInputElement;
    setSession(prevSession => ({
      ...prevSession,
      [id]: type === 'checkbox' ? checked : value
    }));
    setTouchedFields(prev => ({ ...prev, [id]: true }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id } = e.target;
    setTouchedFields(prev => ({ ...prev, [id]: true }));
  };

  const handleVideoUpload = (file: File) => {
    setVideoFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    const requiredFields = ['name', 'duracion_minutos', 'video_enlace'];
    const newTouchedFields: { [key: string]: boolean } = {};
    requiredFields.forEach(field => {
      if (!session[field as keyof typeof session]) {
        newTouchedFields[field] = true;
      }
    });

    const hasEmptyFields = requiredFields.some((field) => !session[field as keyof typeof session]);

    if (hasEmptyFields) {
      setTouchedFields(prev => ({ ...prev, ...newTouchedFields }));
      setError('Por favor, complete todos los campos requeridos.');
      setShowAlert(true);
      setFormLoading(false);
      return;
    }

    try {
      if (videoFile) {
        const videoUrl = await uploadVideo(videoFile, 'Sesiones'); 
        await addSession({ ...session, video_enlace: videoUrl, module_id: Number(moduleId) });
        setShowAlert(true); 
        setSession({ video_enlace: '', duracion_minutos: 0, name: '', module_id: Number(moduleId) });
        setVideoFile(null);
        setClearMediaPreview(true);
        if (videoInputRef.current) {
          videoInputRef.current.clear();
        }
        setTimeout(() => setClearMediaPreview(false), 500);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      } else {
        setError('Video file is required');
      }
    } catch (error) {
      console.error('Error adding session:', error);
      setError('Error adding session');
    } finally {
      setFormLoading(false);
    }
  };

  const handleCancel = () => {
    setSession({ video_enlace: '', duracion_minutos: 0, name: '', module_id: Number(moduleId) });
    setVideoFile(null);
    setClearMediaPreview(true);
    if (videoInputRef.current) {
      videoInputRef.current.clear();
    }
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
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90"/>
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <main className={`p-6 flex-grow transition-all duration-300 ease-in-out ${showSidebar ? 'ml-20' : ''} flex`}>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl rounded-lg flex-grow mr-4">
            {showAlert && (
              <AlertComponent
                type="danger"
                message={error || "Sesión agregada exitosamente."}
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
              id="name"
              label="Nombre"
              type="text"
              value={session.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!session.name && touchedFields['name']}
              touched={touchedFields['name']}
              required
            />
            <FormField
              id="duracion_minutos"
              label="Duración (minutos)"
              type="text"
              value={session.duracion_minutos.toString()}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!session.duracion_minutos && touchedFields['duracion_minutos']}
              touched={touchedFields['duracion_minutos']}
              required
            />
            <div className="mb-4">
              <label htmlFor="video_enlace" className="block text-gray-700 mb-2">Video</label>
              <MediaUploadPreview onMediaUpload={handleVideoUpload} accept="video/*" label="Subir video" ref={videoInputRef} clearMediaPreview={clearMediaPreview} />
            </div>
          </form>
          <div className="ml-4 flex-shrink-0">
            <ActionButtons onSave={handleSubmit} onCancel={handleCancel} isEditing={true} />
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

export default AddSession;
