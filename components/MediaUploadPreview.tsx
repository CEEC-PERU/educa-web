import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';

interface MediaUploadPreviewProps {
  onMediaUpload: (file: File) => void;
  accept: string;
  label: string;
  initialPreview?: string;
  inputRef?: React.RefObject<HTMLInputElement>;
  clearMediaPreview?: boolean;
}

const MediaUploadPreview = forwardRef<{ clear: () => void }, MediaUploadPreviewProps>(({ onMediaUpload, accept, label, initialPreview, inputRef, clearMediaPreview }, ref) => {
  const [mediaPreview, setMediaPreview] = useState<string | null>(initialPreview || null);

  const handleMediaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onMediaUpload(file);
    }
  };

  useEffect(() => {
    setMediaPreview(initialPreview || null);
  }, [initialPreview]);

  useEffect(() => {
    if (clearMediaPreview) {
      setMediaPreview(null);
    }
  }, [clearMediaPreview]);

  useImperativeHandle(ref, () => ({
    clear: () => {
      if (inputRef?.current) {
        inputRef.current.value = '';
        setMediaPreview(null);
      }
    }
  }));

  const isImage = accept.startsWith('image/');

  return (
    <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
      <div className="flex items-center justify-between px-3 py-2 border-b dark:border-gray-600">
        <div className="flex items-center space-x-1 rtl:space-x-reverse sm:pe-4">
          <label htmlFor={`mediaUpload-${label}`} className="p-2 text-blue-700 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-blue-500 dark:hover:text-white dark:hover:bg-gray-600 mb-2">
            {isImage ? (
              <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z"/>
              </svg>
            ) : (
              <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M1 6v8a5 5 0 1 0 10 0V4.5a3.5 3.5 0 1 0-7 0V13a2 2 0 0 0 4 0V6"/>
              </svg>
            )}
            <span className="sr-only">{label}</span>
          </label>
          <input
            id={`mediaUpload-${label}`}
            type="file"
            accept={accept}
            onChange={handleMediaChange}
            className="hidden"
            ref={inputRef}
          />
        </div>
      </div>
      <div className="px-4 py-2 bg-white rounded-b-lg dark:bg-gray-800 h-64">
        {mediaPreview && (
          isImage ? (
            <img src={mediaPreview} alt="Preview" className="w-full h-full object-contain mb-4 rounded-md" />
          ) : (
            <video controls className="w-full h-full object-contain mb-4 rounded-md">
              <source src={mediaPreview} type={accept} />
              Your browser does not support the video tag.
            </video>
          )
        )}
      </div>
    </div>
  );
});

export default MediaUploadPreview;
