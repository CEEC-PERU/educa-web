import React from "react";
import { TrashIcon, CheckCircleIcon } from "@heroicons/react/24/solid";

interface SignatureCanvasSectionProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  handleStartDrawing: (e: React.MouseEvent | React.TouchEvent) => void;
  handleDrawing: (e: React.MouseEvent | React.TouchEvent) => void;
  handleStopDrawing: () => void;
  clearCanvas: () => void;
  confirmSignature: () => void;
  signature: string | null;
}

export default function SignatureCanvasSection({
  canvasRef,
  handleStartDrawing,
  handleDrawing,
  handleStopDrawing,
  clearCanvas,
  confirmSignature,
  signature,
}: SignatureCanvasSectionProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-center">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 mr-3">
          <span className="font-bold">1</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-800">Firma Digital</h3>
      </div>

      <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 bg-gray-50/50">
        <canvas
          ref={canvasRef}
          className="w-full h-48 bg-white rounded-lg shadow-inner"
          width={600}
          height={192}
          onMouseDown={handleStartDrawing}
          onMouseMove={handleDrawing}
          onMouseUp={handleStopDrawing}
          onMouseLeave={handleStopDrawing}
          onTouchStart={handleStartDrawing}
          onTouchMove={handleDrawing}
          onTouchEnd={handleStopDrawing}
          style={{ touchAction: "none", cursor: "crosshair" }}
        />
      </div>

      <div className="flex space-x-4">
        <button
          onClick={clearCanvas}
          className="flex items-center px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200"
        >
          <TrashIcon className="w-5 h-5 mr-2" />
          Limpiar Firma
        </button>
        <button
          onClick={confirmSignature}
          className="flex-1 flex items-center justify-center px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <CheckCircleIcon className="w-5 h-5 mr-2" />
          Confirmar Firma
        </button>
      </div>

      {signature && (
        <div className="p-4 bg-green-50/80 border border-green-200 rounded-xl flex items-center">
          <CheckCircleIcon className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
          <div>
            <p className="font-medium text-green-800">
              Firma registrada correctamente
            </p>
            <p className="text-sm text-green-600">
              Puede continuar con el siguiente paso
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
