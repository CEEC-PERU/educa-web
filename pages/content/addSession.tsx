import React, { useState, useRef } from "react";
import { useRouter } from "next/router";
import AppLayout from "../../components/layouts/AppLayout";
import type { NextPageWithLayout } from "../../types/next";
import MediaUploadPreview from "../../components/MediaUploadPreview";
import { addSession } from "../../services/sessionService";
import { uploadVideo } from "../../services/videoService";
import FormField from "../../components/FormField";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { getUserFacingMessage } from "@/lib/http/error";
import SectionCard from "@components/ui/SectionCard";
import { toast } from "sonner";

const AddSession: NextPageWithLayout = () => {
  const router = useRouter();
  const moduleId = router.isReady ? Number(router.query.moduleId) : undefined;

  const [name, setName] = useState("");
  const [duracion, setDuracion] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [touched, setTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const videoInputRef = useRef<{ clear: () => void }>(null);

  const isNameValid = name.trim().length > 0;
  const isDuracionValid = Number(duracion) > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!isNameValid || !isDuracionValid || !videoFile || !moduleId) return;

    setIsSubmitting(true);
    try {
      const videoUrl = await uploadVideo(videoFile, "Sesiones");
      await addSession({
        name,
        duracion_minutos: Number(duracion),
        video_enlace: videoUrl,
        module_id: moduleId,
      });
      toast.success("Sesión creada exitosamente");
      router.back();
    } catch (err: unknown) {
      toast.error(getUserFacingMessage(err) ?? "Error al crear la sesión");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Volver
      </button>

      <SectionCard title="Nueva Sesión">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            id="name"
            label="Nombre"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={touched && !isNameValid}
            touched={touched}
            required
          />
          <FormField
            id="duracion_minutos"
            label="Duración (minutos)"
            type="text"
            value={duracion}
            onChange={(e) => {
              const val = e.target.value;
              if (/^\d*$/.test(val)) setDuracion(val);
            }}
            error={touched && !isDuracionValid}
            touched={touched}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Video
            </label>
            <MediaUploadPreview
              onMediaUpload={(file) => setVideoFile(file)}
              accept="video/*"
              label="Subir video"
              ref={videoInputRef}
            />
            {touched && !videoFile && (
              <p className="text-xs text-red-500 mt-1">El video es requerido</p>
            )}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting && (
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
              )}
              {isSubmitting ? "Guardando..." : "Guardar sesión"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="text-sm font-medium text-gray-500 hover:text-gray-800 disabled:opacity-50 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </SectionCard>
    </div>
  );
};

AddSession.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default AddSession;
