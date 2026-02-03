import React from "react";
import { useRouter } from "next/router";
//import { useAuth } from '@/context/AuthContext';
import Navbar from "@/components/Navbar";
import SidebarDrawer from "@/components/student/DrawerNavigation";
import { useEvaluationUI } from "@/hooks/ui/useEvaluationUI";
import { useContentProgress } from "@/hooks/useContentProgress";
import ContentHeader from "@/components/Training/ContentNavigation/ContentHeader";
import { baseURL } from "@/utils/Endpoints";
import dynamic from "next/dynamic";

const PDFViewer = dynamic(
  () => import("@/components/Training/ContentViewer/PDFViewer"),
  {
    loading: () => (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p>Cargando visor PDF...</p>
        </div>
      </div>
    ),
    ssr: false,
  },
);

const AudioPlayer = dynamic(
  () => import("@/components/Training/ContentViewer/AudioPlayer"),
  {
    loading: () => (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p>Cargando reproductor de audio...</p>
        </div>
      </div>
    ),
    ssr: false,
  },
);

const VideoPlayer = dynamic(
  () => import("@/components/Training/ContentViewer/VideoPlayer"),
  {
    loading: () => (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p>Cargando reproductor de video...</p>
        </div>
      </div>
    ),
    ssr: false,
  },
);

const ScormPlayer = dynamic(
  () => import("@/components/Training/ContentViewer/ScormPlayer"),
  {
    loading: () => (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p>Cargando contenido SCORM...</p>
        </div>
      </div>
    ),
    ssr: false,
  },
);

const ContentViewerPage: React.FC = () => {
  const router = useRouter();
  const { programId, dayId, contentId } = router.query;
  //const { token } = useAuth();
  const { isDrawerOpen, toggleSidebar, userProfile } = useEvaluationUI();

  const { content, loading, error, updateProgress, markAsCompleted } =
    useContentProgress(Number(programId), Number(dayId), Number(contentId));

  if (!router.isReady) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  const handleBack = () => {
    router.push(`/student/trainings/${programId}`);
  };

  const renderContentViewer = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen bg-gray-900">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-lg">Cargando contenido...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-screen bg-gray-900">
          <div className="text-center text-white">
            <p className="text-xl mb-4 text-red-400">{error}</p>
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Volver al programa
            </button>
          </div>
        </div>
      );
    }

    if (!content) {
      return (
        <div className="flex items-center justify-center h-screen bg-gray-900">
          <div className="text-center text-white">
            <p className="text-xl mb-4">Contenido no encontrado</p>
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Volver al programa
            </button>
          </div>
        </div>
      );
    }

    switch (content.content_type) {
      case "pdf":
        return (
          <div className="h-[calc(100vh-12rem)] bg-gray-800">
            <PDFViewer url={content.content_url} onComplete={markAsCompleted} />
          </div>
        );

      case "video":
        return (
          <div className="h-[calc(100vh-12rem)] bg-black flex items-center justify-center">
            <VideoPlayer
              url={content.content_url}
              onProgress={(progress) => {
                updateProgress(
                  progress.played,
                  Math.floor(progress.playedSeconds),
                );
              }}
              onEnded={markAsCompleted}
            />
          </div>
        );

      case "audio":
        return (
          <div className="h-[calc(100vh-12rem)] bg-gradient-to-br from-gray-900 to-gray-800">
            <AudioPlayer
              url={content.content_url}
              onProgress={(progress) => {
                // progress.played ya viene en porcentaje (0-100)
                updateProgress(
                  progress.played,
                  Math.floor(progress.playedSeconds),
                );
              }}
              onEnded={markAsCompleted}
            />
          </div>
        );

      case "scorm":
        return (
          <div className="h-[calc(100vh-8rem)]">
            <ScormPlayer
              scormUrl={content.content_url}
              contentId={content.content_id}
              onProgress={(progress) => {
                updateProgress(progress, 0);
              }}
              onComplete={markAsCompleted}
            />
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-screen bg-gray-900">
            <div className="text-center text-white">
              <p className="text-xl mb-4">
                Tipo de contenido no soportado: {content.content_type}
              </p>
              <button
                onClick={handleBack}
                className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Volver al programa
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="relative z-10">
        <Navbar
          bgColor="bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300"
          borderColor="border border-stone-300"
          user={
            userProfile.uri_picture
              ? { profilePicture: userProfile.uri_picture }
              : undefined
          }
          toggleSidebar={toggleSidebar}
        />
        <SidebarDrawer
          isDrawerOpen={isDrawerOpen}
          toggleSidebar={toggleSidebar}
        />
      </div>

      <div className="pt-16">
        <div
          className={`transition-all duration-300 ${
            isDrawerOpen ? "lg:ml-64" : "lg:ml-16"
          }`}
        >
          {content && (
            <ContentHeader
              programTitle={content.title}
              dayNumber={content.day_number}
              onBack={handleBack}
              content={content}
            />
          )}

          {renderContentViewer()}
        </div>
      </div>
    </div>
  );
};

export default ContentViewerPage;
