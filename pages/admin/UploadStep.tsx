// components/UploadStep.tsx
import React, { useState, useEffect } from 'react';
import FileUpload from '../../components/FileUpload';

interface UploadStepProps {
  initialFile: File | null;
  onNext: (file: File) => void;
}

const UploadStep: React.FC<UploadStepProps> = ({ initialFile, onNext }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(initialFile);

  useEffect(() => {
    setSelectedFile(initialFile);
  }, [initialFile]);

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-center">Sube tus archivos</h2>
        <p className="mb-6 mt-6 text-center">Antes de subir los archivos en la sección de abajo, asegúrate de que el archivo está listo para importarse</p>
        <FileUpload
          onFileChange={handleFileChange}
          onFileRemove={handleFileRemove}
          fileName={selectedFile?.name}
          fileSize={selectedFile ? Number((selectedFile.size / 1024).toFixed(2)) : undefined}
          title="Click to upload."
          description="Aquí puedes arrastrar y soltar o elegir un archivo para subir tu lista de Usuarios."
          instructions="Todos los tipos de archivos .csv y .xlsx son compatibles."
          icon={
            <svg
              className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
          }
        />
        <div className="flex justify-end mt-4">
          <button
            className={`bg-purple-500 text-white py-2 px-4 rounded ${!selectedFile ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => selectedFile && onNext(selectedFile)}
            disabled={!selectedFile}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadStep;
