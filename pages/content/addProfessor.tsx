import React, { useState, useRef } from "react";
import { useRouter } from "next/router";
import AppLayout from "../../components/layouts/AppLayout";
import type { NextPageWithLayout } from "../../types/next";
import { Professor } from "../../interfaces/Professor";
import { useLevelsQuery } from "@/features/professors/professors.queries";
import { useCreateProfessorMutation } from "@/features/professors/professors.mutations";
import { getUserFacingMessage } from "@/lib/http/error";
import MediaUploadPreview from "../../components/MediaUploadPreview";
import FormField from "../../components/FormField";
import ActionButtons from "../../components/Content/ActionButtons";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import AlertComponent from "../../components/AlertComponent";
import Loader from "../../components/Loader";

const AddProfessors: NextPageWithLayout = () => {
  const [profesor, setProfesor] = useState<
    Omit<Professor, "professor_id" | "created_at" | "updated_at">
  >({
    full_name: "",
    image: "",
    especialitation: "",
    description: "",
    level_id: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [clearMediaPreview, setClearMediaPreview] = useState(false);
  const [touchedFields, setTouchedFields] = useState<{
    [key: string]: boolean;
  }>({});

  const router = useRouter();
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const levelsQuery = useLevelsQuery();
  const createProfessorMutation = useCreateProfessorMutation();

  const levels = levelsQuery.data ?? [];
  const loading = levelsQuery.isLoading;
  const formLoading = createProfessorMutation.isPending;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { id, value } = e.target;
    setProfesor((prevProfesor) => ({ ...prevProfesor, [id]: value }));
    setTouchedFields((prevTouched) => ({ ...prevTouched, [id]: true }));
  };

  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { id } = e.target;
    setTouchedFields((prevTouched) => ({ ...prevTouched, [id]: true }));
  };

  const handleFileChange = (file: File) => {
    setImageFile(file);
    setTouchedFields((prevTouched) => ({ ...prevTouched, image: true }));
  };

  const validateFields = () => {
    const requiredFields = [
      "full_name",
      "especialitation",
      "description",
      "level_id",
    ];
    const newTouchedFields: { [key: string]: boolean } = {};
    requiredFields.forEach((field) => {
      if (!profesor[field as keyof typeof profesor]) {
        newTouchedFields[field] = true;
      }
    });

    const newErrors: { [key: string]: boolean } = {};
    requiredFields.forEach((field) => {
      if (!profesor[field as keyof typeof profesor]) {
        newErrors[field] = true;
      }
    });

    if (!imageFile) {
      newTouchedFields["image"] = true;
      newErrors["image"] = true;
    }

    setTouchedFields((prev) => ({ ...prev, ...newTouchedFields }));
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFields()) {
      setError("Todos los campos son obligatorios.");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      return;
    }
    try {
      await createProfessorMutation.mutateAsync({
        professor: profesor,
        imageFile: imageFile!,
      });
      setProfesor({
        full_name: "",
        image: "",
        especialitation: "",
        description: "",
        level_id: 0,
      });
      setImageFile(null);
      setTouchedFields({});
      setClearMediaPreview(true);
      setTimeout(() => setClearMediaPreview(false), 500);
      setError(null);
      setShowAlert(true);
      setSuccess("Profesor agregado exitosamente");
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    } catch (err) {
      console.error("Error adding professor:", err);
      setError(getUserFacingMessage(err));
      setShowAlert(true);
    }
  };

  const handleCancel = () => {
    setProfesor({
      full_name: "",
      image: "",
      especialitation: "",
      description: "",
      level_id: 0,
    });
    setImageFile(null);
    setTouchedFields({});
    setClearMediaPreview(true);
    setTimeout(() => setClearMediaPreview(false), 500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 max-w-2xl rounded-lg flex-grow"
      >
        {showAlert && (
          <AlertComponent
            type={error ? "danger" : "success"}
            message={error || "Profesor agregado exitosamente."}
            onClose={() => setShowAlert(false)}
          />
        )}
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center text-purple-600 mb-6"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Volver
        </button>
        <FormField
          id="full_name"
          label="Nombre Completo"
          type="text"
          value={profesor.full_name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={!profesor.full_name && touchedFields["full_name"]}
          touched={touchedFields["full_name"]}
          required
        />
        <div className="mb-4">
          <label htmlFor="image" className="block text-blue-400 mb-2">
            Imagen
          </label>
          <MediaUploadPreview
            onMediaUpload={handleFileChange}
            accept="image/*"
            label="Subir Imagen"
            inputRef={imageInputRef}
            clearMediaPreview={clearMediaPreview}
            error={!imageFile && touchedFields["image"]}
            touched={touchedFields["image"]}
          />
        </div>
        <FormField
          id="especialitation"
          label="Especialización"
          type="text"
          value={profesor.especialitation}
          onChange={handleChange}
          onBlur={handleBlur}
          error={!profesor.especialitation && touchedFields["especialitation"]}
          touched={touchedFields["especialitation"]}
          required
        />
        <FormField
          id="description"
          label="Descripción"
          type="textarea"
          value={profesor.description}
          onChange={handleChange}
          onBlur={handleBlur}
          rows={4}
          error={!profesor.description && touchedFields["description"]}
          touched={touchedFields["description"]}
          required
        />
        <FormField
          id="level_id"
          label="Nivel"
          type="select"
          value={profesor.level_id.toString()}
          onChange={handleChange}
          onBlur={handleBlur}
          options={[
            { value: "", label: "Seleccionar Nivel" },
            ...levels.map((level) => ({
              value: level.level_id.toString(),
              label: level.name,
            })),
          ]}
          error={profesor.level_id === 0 && touchedFields["level_id"]}
          touched={touchedFields["level_id"]}
          required
        />
      </form>
      <div className="mt-4 md:mt-0 md:ml-4 flex-shrink-0">
        <ActionButtons
          onSave={handleSubmit}
          onCancel={handleCancel}
          isEditing={true}
          customSize={true}
        />
      </div>
      {formLoading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <Loader />
        </div>
      )}
    </>
  );
};

AddProfessors.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default AddProfessors;
