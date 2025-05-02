// components/FileUpload.tsx
import React from 'react';

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  onFileRemove: () => void;
  fileName?: string;
  fileSize?: number;
  title?: string;
  description?: string;
  instructions?: string;
  icon?: React.ReactNode;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileChange,
  onFileRemove,
  fileName,
  fileSize,
  title = 'Click to upload',
  description = 'or drag and drop',
  instructions = 'SVG, PNG, JPG or GIF (MAX. 800x400px)',
  icon
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      onFileChange(event.target.files[0]);
    } else {
      onFileChange(null);
    }
  };

  return (
    <div className="flex items-center justify-center w-full">
      {fileName ? (
        <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 dark:bg-gray-700">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
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
            <strong className="font-bold text-center align-center">Archivo seleccionado y con el nombre cambiado a "{fileName}".</strong>
            <span className="block sm:inline"> {fileSize} KB</span>
            <button
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
              onClick={onFileRemove}
            >
              Eliminar archivo
            </button>
          </div>
        </div>
      ) : (
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {icon || (
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
            )}
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 text-center">
              <span className="font-semibold">{title}</span> {description}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{instructions}</p>
          </div>
          <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} />
        </label>
      )}
    </div>
  );
};

export default FileUpload;
