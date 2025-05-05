import { useEffect, useState } from 'react';

const CourseMaterials: React.FC = ({  }) => {
  // URLs de los materiales
  const pptUrl = "https://mentormind-qtech.s3.us-east-1.amazonaws.com/materiales/67a661f3-873c-4e27-bdec-240a5e75a5c1.pptx";
  const pdfUrl = "https://mentormind-qtech.s3.us-east-1.amazonaws.com/materiales/d0a865a5-6680-4c1d-98ec-5d9f0bc076a7.pdf";
  
  const [activeTab, setActiveTab] = useState<'ppt' | 'pdf'>('ppt');
  const [isLoading, setIsLoading] = useState(true);
  const [fileType, setFileType] = useState<'ppt' | 'pdf'>('ppt');

  useEffect(() => {
    // Simular carga
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [activeTab]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-brand-100 p-4 md:p-8">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300 p-4 md:p-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Material del Curso</h2>
          <div className="flex flex-col md:flex-row md:items-center justify-between mt-2">
            <p className="text-blue-100">Documentos de apoyo para tu aprendizaje</p>
            <span className="inline-block bg-white/20 text-white text-xs px-3 py-1 rounded-full mt-2 md:mt-0">
              Estrategias de Comunicación (HE60)
            </span>
          </div>
        </div>

        {/* Document Viewer */}
        <div className="p-4 md:p-6">
          {/* Tabs Navigation */}
          <div className="flex overflow-x-auto pb-2 mb-4 gap-2">
            <button 
              onClick={() => setActiveTab('ppt')}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'ppt' 
                  ? 'bg-brand-200 text-brand-800' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Presentación PPT
            </button>
            <button 
              onClick={() => setActiveTab('pdf')}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'pdf' 
                  ? 'bg-brand-200 text-brand-800' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Ejercicios PDF
            </button>
          </div>

          {/* File Info and Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {activeTab === 'ppt' 
                  ? 'Presentación del Módulo' 
                  : 'Ejercicios de repaso sobre conectores'}
              </h3>
              <p className="text-gray-500 text-sm flex items-center mt-1">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Actualizado el 15/06/2023 • {activeTab === 'ppt' ? '5.2 MB' : '3.8 MB'}
              </p>
            </div>
            <div className="flex gap-2">
              <a 
                href={activeTab === 'ppt' ? pptUrl : pdfUrl}
                download
                className="flex items-center gap-2 bg-white border border-brand-300 text-brand-600 px-3 py-2 rounded-lg hover:bg-brand-50 transition-colors text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Descargar
              </a>
            </div>
          </div>

          {/* Responsive Viewer Container */}
          <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-200" 
              style={{ 
                paddingBottom: '56.25%', // 16:9 aspect ratio
                height: 0,
                minHeight: '500px' 
              }}>
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
              </div>
            ) : (
              <>
                {activeTab === 'pdf' ? (
                  <iframe
                    src={`https://docs.google.com/gview?url=${encodeURIComponent(pdfUrl)}&embedded=true`}
                    className="absolute top-0 left-0 w-full h-full"
                    frameBorder="0"
                    title="PDF Viewer"
                  />
                ) : (
                  <iframe
                    src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(pptUrl)}`}
                    className="absolute top-0 left-0 w-full h-full"
                    frameBorder="0"
                    allowFullScreen
                    title="PPT Viewer"
                  />
                )}
              </>
            )}
          </div>

          {/* Help Text */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
            <div className="flex flex-col md:flex-row md:items-start">
              <svg className="flex-shrink-0 h-5 w-5 mr-2 mb-2 md:mb-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-medium">¿Problemas para visualizar el documento?</p>
                <p className="mt-1">
                  Recomendaciones:
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Para PDFs: Asegúrate de tener conexión a internet</li>
                    <li>Para presentaciones: Descarga el archivo para mejor visualización</li>
                    <li>Si persisten los problemas, actualiza la página</li>
                  </ul>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseMaterials;

// Cómo integrarlo en tu componente CourseDetails:
// Reemplaza el div vacío que tiene el comentario "Material del Curso" con:
// <CourseMaterials />