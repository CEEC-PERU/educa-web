import { useState, useEffect } from 'react';
import {
  FiDownload,
  FiClock,
  FiAlertCircle,
  FiFile,
  FiFileText,
} from 'react-icons/fi';
import { BsFiletypePdf, BsFiletypePpt } from 'react-icons/bs';
import { motion, AnimatePresence } from 'framer-motion';

interface Material {
  material_id: number;
  material: string;
  course_id: number;
  created_at: string;
  updated_at: string;
}

interface CourseMaterialsProps {
  materials: Material[];
}

const CourseMaterials: React.FC<CourseMaterialsProps> = ({ materials }) => {
  // Filter valid materials (PDF or PPT)
  const validMaterials = materials.filter((material) => {
    const extension = material.material.split('.').pop()?.toLowerCase();
    return extension === 'pdf' || extension === 'ppt' || extension === 'pptx';
  });

  const [activeMaterial, setActiveMaterial] = useState<Material | null>(
    validMaterials[0] || null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [activeMaterial]);

  const getFileType = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase();
    return extension === 'pdf' ? 'pdf' : 'ppt';
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (validMaterials.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-brand-100 p-6">
        <div className="max-w-md w-full bg-brand-100 rounded-xl shadow-sm p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-brand-100 mb-4">
            <FiFile className="h-5 w-5 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay materiales disponibles
          </h3>
          <p className="text-gray-500">
            Este curso no tiene materiales de apoyo disponibles actualmente.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${
        isFullscreen
          ? 'fixed inset-0 z-50  bg-brand-100 p-0'
          : 'relative  bg-brand-100 p-4 md:p-8'
      }`}
    >
      {!isFullscreen && (
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-900 to-indigo-900 rounded-t-xl p-6 text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Material del Curso</h2>
                <p className="text-blue-100 mt-1">
                  Documentos de apoyo para tu aprendizaje
                </p>
              </div>
              {activeMaterial && (
                <span className="inline-flex items-center bg-white/20 text-white text-sm px-3 py-1 rounded-full mt-3 md:mt-0">
                  {getFileType(activeMaterial.material) === 'pdf' ? (
                    <BsFiletypePdf className="mr-1.5" />
                  ) : (
                    <BsFiletypePpt className="mr-1.5" />
                  )}
                  {activeMaterial.material.split('/').pop()}
                </span>
              )}
            </div>
          </div>

          {/* Container */}
          <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Tabs Navigation */}
            {validMaterials.length > 1 && (
              <div className="border-b border-gray-200 px-6">
                <nav className="flex space-x-4 overflow-x-auto py-4">
                  {validMaterials.map((material) => (
                    <button
                      key={material.material_id}
                      onClick={() => setActiveMaterial(material)}
                      className={`whitespace-nowrap px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeMaterial?.material_id === material.material_id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {getFileType(material.material) === 'pdf' ? (
                        <span className="flex items-center">
                          <FiFileText className="mr-2" />
                          Documento PDF
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <FiFile className="mr-2" />
                          Presentación
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>
            )}

            {/* File Info and Actions */}
            {activeMaterial && (
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <p className="flex items-center text-sm text-gray-500 mt-1">
                      <FiClock className="mr-1.5" />
                      Actualizado el{' '}
                      {new Date(activeMaterial.updated_at).toLocaleDateString(
                        'es-ES',
                        {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        }
                      )}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={toggleFullscreen}
                      className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      Pantalla completa
                    </button>
                    <a
                      href={activeMaterial.material}
                      download
                      className="flex items-center gap-2 bg-indigo-900 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <FiDownload className="h-4 w-4" />
                      Descargar
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Viewer Container */}
      <AnimatePresence>
        <motion.div
          key={activeMaterial?.material_id || 'empty'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className={`mt-6 ${
            isFullscreen ? 'h-[calc(100vh-60px)]' : 'max-w-7xl mx-auto'
          }`}
        >
          {isLoading ? (
            <div
              className="flex items-center justify-center bg-gray-100 rounded-lg"
              style={{ height: '600px' }}
            >
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            activeMaterial && (
              <div
                className={`bg-gray-100 rounded-lg overflow-hidden border border-gray-200 ${
                  isFullscreen ? 'h-full' : 'h-[600px]'
                }`}
              >
                {getFileType(activeMaterial.material) === 'pdf' ? (
                  <iframe
                    src={`https://docs.google.com/gview?url=${encodeURIComponent(
                      activeMaterial.material
                    )}&embedded=true`}
                    className="w-full h-full"
                    frameBorder="0"
                    title="PDF Viewer"
                  />
                ) : (
                  <iframe
                    src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                      activeMaterial.material
                    )}`}
                    className="w-full h-full"
                    frameBorder="0"
                    allowFullScreen
                    title="PPT Viewer"
                  />
                )}
              </div>
            )
          )}
        </motion.div>
      </AnimatePresence>

      {/* Help Section */}
      {!isFullscreen && (
        <div className="max-w-7xl mx-auto mt-6">
          <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-800">
            <div className="flex">
              <FiAlertCircle className="flex-shrink-0 h-5 w-5 mr-3 mt-0.5" />
              <div>
                <h4 className="font-medium mb-2">
                  ¿Necesitas ayuda para visualizar los documentos?
                </h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Para PDFs: Asegúrate de tener conexión a internet estable
                  </li>
                  <li>
                    Para presentaciones: Descarga el archivo para mejor
                    visualización
                  </li>
                  <li>
                    Si tienes problemas, intenta actualizar la página o usar
                    otro navegador
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {isFullscreen && (
        <button
          onClick={toggleFullscreen}
          className="fixed top-4 right-4 bg-white p-2 rounded-full shadow-md text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default CourseMaterials;
