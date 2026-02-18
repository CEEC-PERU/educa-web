import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface MultipleImageUploadProps {
  label: string;
  onImagesUpload: (files: File[]) => void;
  // prop para limitar el número de imágenes que se pueden subir
  maxImages?: number;
  // prop para mostrar previsualización de las imágenes actuales
  currentImages: File[];
}

const MultipleImageUpload: React.FC<MultipleImageUploadProps> = ({
  label,
  onImagesUpload,
  maxImages = 3,
  currentImages,
}) => {
  const [previews, setPreviews] = useState<string[]>([]);

  // handler para eliminar una imagen de la previsualización
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // constante que almacena los archivos seleccionados
    const files = Array.from(event.target.files || []);
    const remainingSlots = maxImages - currentImages.length;
    const filesToUpload = files.slice(0, remainingSlots);

    if (filesToUpload.length > 0) {
      const newImages = [...currentImages, ...filesToUpload];
      onImagesUpload(newImages);

      // generar previsualizaciones para las nuevas imágenes
      filesToUpload.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = currentImages.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    onImagesUpload(newImages);
    setPreviews(newPreviews);
  };

  return (
    <div className="space-y-2">
      <label className="block text-gray-700 mb-2">{label}</label>

      {/* Grid de previews */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {previews.map((preview, index) => (
          <div key={index} className="relative group">
            <img
              src={preview}
              alt={`Preview ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg border-2 border-gray-300"
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Input de archivo */}
      {currentImages.length < maxImages && (
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-violet-50 file:text-violet-700
              hover:file:bg-violet-100"
        />
      )}

      <p className="text-sm text-gray-500">
        {currentImages.length} de {maxImages} imágenes seleccionadas
      </p>
    </div>
  );
};

export default MultipleImageUpload;
