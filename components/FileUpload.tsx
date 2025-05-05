import React from 'react';

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  onFileRemove: (index: number) => void;
  files: File[];
  title?: string;
  description?: string;
  instructions?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFilesChange,
  onFileRemove,
  files,
  title = 'Click para subir.',
  description = 'Arrastra y suelta o selecciona varios archivos.',
  instructions = 'Archivos .pdf y .ppt son compatibles.',
  icon
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      const validFiles = selectedFiles.filter(file =>
        ['application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'].includes(file.type)
      );
      onFilesChange(validFiles);
    }
  };

  return (
    <div className="flex items-center justify-center w-full">
      {files.length > 0 ? (
        <div className="flex flex-col w-full gap-4">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg bg-gray-50 dark:bg-gray-700 p-4"
            >
              <p className="text-center font-medium text-gray-700 dark:text-gray-200">
                Archivo: "{file.name}" ({(file.size / 1024).toFixed(2)} KB)
              </p>
              <button
                className="mt-2 bg-red-500 text-white py-1 px-3 rounded"
                onClick={() => onFileRemove(index)}
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      ) : (
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
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
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            multiple
            onChange={handleFileChange}
          />
        </label>
      )}
    </div>
  );
};

export default FileUpload;
