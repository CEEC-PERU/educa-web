import React from "react";
import {
  CameraIcon,
  VideoCameraIcon,
  CheckCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";

interface IdentityCaptureSectionProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  cameraStream: MediaStream | null;
  photo: string | null;
  startCamera: () => void;
  capturePhoto: () => void;
}

const IMAGE_REQUIREMENTS = [
  "Rostro completamente visible y bien iluminado",
  "Sin accesorios que cubran el rostro",
  "Fondo neutro preferiblemente",
];

export default function IdentityCaptureSection({
  videoRef,
  cameraStream,
  photo,
  startCamera,
  capturePhoto,
}: IdentityCaptureSectionProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-center">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 mr-3">
          <span className="font-bold">2</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-800">
          Verificación de Identidad
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Video preview */}
        <div className="relative rounded-xl overflow-hidden bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-auto min-h-[250px] object-cover"
          />
          {!cameraStream && (
            <div className="absolute inset-0 bg-gray-900/80 flex flex-col items-center justify-center text-white p-6 text-center">
              <CameraIcon className="w-10 h-10 mb-3 opacity-70" />
              <p>Haga clic en "Activar Cámara" para comenzar</p>
            </div>
          )}
        </div>

        {/* Requirements + button */}
        <div className="space-y-4">
          <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
            <h4 className="font-medium text-gray-800 mb-3 flex items-center">
              <InformationCircleIcon className="w-5 h-5 text-blue-500 mr-2" />
              Requisitos para la imagen
            </h4>
            <ul className="space-y-2.5">
              {IMAGE_REQUIREMENTS.map((req) => (
                <li key={req} className="flex items-start">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={!cameraStream ? startCamera : capturePhoto}
            className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg ${
              !cameraStream
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {!cameraStream ? (
              <>
                <VideoCameraIcon className="w-5 h-5 mr-2" />
                Activar Cámara
              </>
            ) : (
              <>
                <CameraIcon className="w-5 h-5 mr-2" />
                Capturar Imagen
              </>
            )}
          </button>
        </div>
      </div>

      {photo && (
        <div className="p-4 bg-green-50/80 border border-green-200 rounded-xl flex items-center">
          <CheckCircleIcon className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
          <div>
            <p className="font-medium text-green-800">
              Imagen verificada correctamente
            </p>
            <p className="text-sm text-green-600">
              Su identidad ha sido registrada
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
