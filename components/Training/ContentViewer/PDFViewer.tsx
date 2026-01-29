// components/Training/ContentViewer/PDFViewer.tsx
import React from 'react';

interface PDFViewerProps {
  url: string;
  onComplete: () => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ url, onComplete }) => {
  return (
    <div className="flex flex-col h-full bg-gray-800">
      <div className="flex-1 relative">
        <iframe
          src={`${url}#toolbar=0`}
          className="w-full h-full border-none"
          title="Visor PDF"
        />
      </div>
      <div className="bg-gray-900 p-4 flex justify-between items-center border-t border-gray-700">
        <p className="text-gray-400 text-xs">
          Al finalizar la lectura, presiona el botón para marcar como
          completado.
        </p>
        <button
          onClick={onComplete}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-lg transition-colors shadow-lg"
        >
          Marcar como leído
        </button>
      </div>
    </div>
  );
};

export default PDFViewer;
