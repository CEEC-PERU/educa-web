import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import {
  DocumentTextIcon,
  InformationCircleIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/solid";
import { useStudentVerificationFlow } from "@/hooks/student/useStudentVerificationFlow";
import SignatureCanvasSection from "./verification/SignatureCanvasSection";
import IdentityCaptureSection from "./verification/IdentityCaptureSection";
import ConsentSection from "./verification/ConsentSection";

const LoadingSpinner = () => (
  <div className="text-center" role="status">
    <svg
      aria-hidden="true"
      className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
      viewBox="0 0 100 101"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
        fill="currentColor"
      />
      <path
        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
        fill="currentFill"
      />
    </svg>
    <span className="sr-only">Loading...</span>
  </div>
);

export default function StudentVerificationModal() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const {
    isOpen,
    loading,
    signature,
    photo,
    consentGiven,
    setConsentGiven,
    canvasRef,
    videoRef,
    cameraStream,
    handleStartDrawing,
    handleDrawing,
    handleStopDrawing,
    clearCanvas,
    confirmSignature,
    startCamera,
    capturePhoto,
    submit,
  } = useStudentVerificationFlow();

  const canSubmit = Boolean(photo && signature && consentGiven);

  if (!isDesktop) return null;

  return (
    <Modal
      isOpen={isOpen}
      overlayClassName="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl my-auto outline-none"
    >
      {loading ? (
        <div className="min-h-[500px] flex items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="space-y-8 p-8">
          <div className="text-center">
            <div className="mx-auto w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4 mt-4">
              <DocumentTextIcon className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Autorización de Tratamiento de Datos
            </h2>
            <p className="text-lg text-gray-500 mt-2">
              Complete su información de verificación
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <InformationCircleIcon className="w-6 h-6 text-blue-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  Declaración de Consentimiento
                </h3>
                <p className="text-gray-700">
                  "Autorizo el tratamiento de mis datos personales (incluyendo
                  imagen y firma) para efectos de registro de asistencia y
                  control de ingreso, conforme a lo dispuesto en la Ley N.º
                  29733 - Ley de Protección de Datos Personales."
                </p>
              </div>
            </div>
          </div>

          <SignatureCanvasSection
            canvasRef={canvasRef}
            handleStartDrawing={handleStartDrawing}
            handleDrawing={handleDrawing}
            handleStopDrawing={handleStopDrawing}
            clearCanvas={clearCanvas}
            confirmSignature={confirmSignature}
            signature={signature}
          />

          <IdentityCaptureSection
            videoRef={videoRef}
            cameraStream={cameraStream}
            photo={photo}
            startCamera={startCamera}
            capturePhoto={capturePhoto}
          />

          <ConsentSection
            consentGiven={consentGiven}
            onConsentChange={setConsentGiven}
          />

          <div className="pt-2">
            <button
              onClick={submit}
              disabled={!canSubmit}
              className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center ${
                !canSubmit
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl"
              }`}
            >
              <PaperAirplaneIcon className="w-5 h-5 mr-2" />
              Enviar y Finalizar Registro
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
