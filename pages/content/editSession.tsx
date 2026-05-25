import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AppLayout from "../../components/layouts/AppLayout";
import type { NextPageWithLayout } from "../../types/next";
import { getSession, updateSession } from "../../services/sessionService";
import { Session } from "../../interfaces/Session";
import SectionCard from "@components/ui/SectionCard";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { getUserFacingMessage } from "@/lib/http/error";
import { toast } from "sonner";

const EditSession: NextPageWithLayout = () => {
  const router = useRouter();
  const id = router.isReady ? (router.query.id as string) : undefined;

  const [session, setSession] = useState<Omit<Session, "session_id">>({
    duracion_minutos: 0,
    name: "",
    module_id: 0,
    video_enlace: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [touched, setTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    getSession(id)
      .then((data) => {
        setSession({
          duracion_minutos: data.duracion_minutos,
          name: data.name,
          video_enlace: data.video_enlace,
          module_id: data.module_id,
        });
      })
      .catch((err: unknown) => {
        toast.error(getUserFacingMessage(err) ?? "Error al cargar la sesión");
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSession((prev) => ({ ...prev, name: e.target.value }));
  };

  const handleDuracionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      setSession((prev) => ({
        ...prev,
        duracion_minutos: val === "" ? 0 : Number(val),
      }));
    }
  };

  const isValid =
    session.name.trim().length > 0 && session.duracion_minutos > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!isValid || !id) return;

    setIsSubmitting(true);
    try {
      await updateSession(id, session);
      toast.success("Sesión actualizada exitosamente");
      router.back();
    } catch (err: unknown) {
      toast.error(getUserFacingMessage(err) ?? "Error al actualizar la sesión");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500 text-sm">
        Cargando...
      </div>
    );
  }

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

      <SectionCard title="Editar Sesión">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="name"
              className="text-xs font-semibold text-gray-500 uppercase tracking-wider"
            >
              Nombre
            </label>
            <input
              id="name"
              type="text"
              value={session.name}
              onChange={handleNameChange}
              className={`block w-full rounded-lg border px-3 py-2 text-sm text-gray-900 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors ${
                touched && !session.name.trim()
                  ? "border-red-400"
                  : "border-gray-200"
              }`}
            />
            {touched && !session.name.trim() && (
              <p className="text-xs text-red-500">El nombre es requerido</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="duracion_minutos"
              className="text-xs font-semibold text-gray-500 uppercase tracking-wider"
            >
              Duración (minutos)
            </label>
            <input
              id="duracion_minutos"
              type="text"
              inputMode="numeric"
              value={
                session.duracion_minutos === 0
                  ? ""
                  : session.duracion_minutos.toString()
              }
              onChange={handleDuracionChange}
              className={`block w-full rounded-lg border px-3 py-2 text-sm text-gray-900 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors ${
                touched && session.duracion_minutos === 0
                  ? "border-red-400"
                  : "border-gray-200"
              }`}
            />
            {touched && session.duracion_minutos === 0 && (
              <p className="text-xs text-red-500">La duración es requerida</p>
            )}
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
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

EditSession.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default EditSession;
