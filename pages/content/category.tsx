import React, { useState } from "react";
import AppLayout from "../../components/layouts/AppLayout";
import type { NextPageWithLayout } from "../../types/next";
import { useCategoriesQuery } from "@/features/categories/categories.queries";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/features/categories/categories.mutations";
import { getUserFacingMessage } from "@/lib/http/error";
import { Category } from "../../interfaces/Category";
import FormField from "../../components/FormField";
import Table from "../../components/Table";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import ModalConfirmation from "../../components/ModalConfirmation";
import useModal from "../../hooks/ui/useModal";
import { toast } from "sonner";

const CategoryPage: NextPageWithLayout = () => {
  const [category, setCategory] = useState<Category | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [touchedFields, setTouchedFields] = useState<{
    [key: string]: boolean;
  }>({});

  const formModal = useModal();
  const deleteModal = useModal();

  const categoriesQuery = useCategoriesQuery();
  const createCategoryMutation = useCreateCategoryMutation();
  const updateCategoryMutation = useUpdateCategoryMutation();
  const deleteCategoryMutation = useDeleteCategoryMutation();

  const categories = categoriesQuery.data ?? [];
  const loading = categoriesQuery.isLoading;
  const queryError = categoriesQuery.isError;
  const formLoading =
    createCategoryMutation.isPending ||
    updateCategoryMutation.isPending ||
    deleteCategoryMutation.isPending;

  const openAddModal = () => {
    setCategory(null);
    setIsEditing(false);
    setTouchedFields({});
    formModal.showModal();
  };

  const openEditModal = (cat: Category) => {
    setCategory(cat);
    setIsEditing(true);
    setTouchedFields({});
    formModal.showModal();
  };

  const closeFormModal = () => {
    formModal.hideModal();
    setCategory(null);
    setIsEditing(false);
    setTouchedFields({});
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setCategory((prev) =>
      prev ? { ...prev, [name]: value } : { category_id: 0, name: value },
    );
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
  };

  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name } = e.target;
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category?.name) {
      setTouchedFields({ name: true });
      return;
    }
    try {
      if (isEditing) {
        await updateCategoryMutation.mutateAsync({
          categoryId: category.category_id,
          category,
        });
        toast.success("Categoría actualizada exitosamente");
      } else {
        await createCategoryMutation.mutateAsync(category.name);
        toast.success("Categoría agregada exitosamente");
      }
      closeFormModal();
    } catch (err) {
      toast.error(getUserFacingMessage(err) ?? "Error al guardar la categoría");
    }
  };

  const handleDelete = async () => {
    if (categoryToDelete === null) return;
    try {
      await deleteCategoryMutation.mutateAsync(categoryToDelete);
      toast.success("Categoría eliminada exitosamente");
    } catch (err) {
      toast.error(
        getUserFacingMessage(err) ?? "Error al eliminar la categoría",
      );
    } finally {
      deleteModal.hideModal();
    }
  };

  const columns = [
    { label: "Nombre", key: "name" },
    { label: "Acciones", key: "actions" },
  ];

  const rows = categories.map((cat) => ({
    name: <span>{cat.name}</span>,
    actions: (
      <div className="flex justify-center space-x-2">
        <button
          onClick={() => openEditModal(cat)}
          className="text-blue-500 py-1 px-2 rounded flex items-center hover:bg-blue-50 transition-colors"
          aria-label={`Editar ${cat.name}`}
        >
          <PencilIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => {
            setCategoryToDelete(cat.category_id);
            deleteModal.showModal();
          }}
          className="text-red-500 py-1 px-2 rounded flex items-center hover:bg-red-50 transition-colors"
          aria-label={`Eliminar ${cat.name}`}
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    ),
  }));

  if (loading) return null;

  if (queryError) {
    return (
      <p className="text-gray-500 text-center mt-20">
        Error al cargar las categorías. Intenta de nuevo.
      </p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Categorías</h1>
        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors"
        >
          <PlusIcon className="h-4 w-4" />
          Agregar categoría
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <Table columns={columns} rows={rows} />
      </div>

      {formModal.isVisible && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeFormModal();
          }}
        >
          <div className="w-full max-w-md mx-4 bg-white rounded-2xl shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">
                {isEditing ? "Editar categoría" : "Nueva categoría"}
              </h2>
              <button
                type="button"
                onClick={closeFormModal}
                className="flex items-center justify-center h-8 w-8 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label="Cerrar"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              <FormField
                id="name"
                label="Nombre de la categoría"
                type="text"
                name="name"
                value={category?.name ?? ""}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!category?.name && touchedFields["name"]}
                touched={touchedFields["name"]}
                required
              />

              <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex items-center justify-center gap-2 flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {formLoading && (
                    <svg
                      className="animate-spin h-4 w-4 text-white"
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
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                  )}
                  {formLoading
                    ? "Guardando..."
                    : isEditing
                      ? "Guardar cambios"
                      : "Agregar"}
                </button>
                <button
                  type="button"
                  onClick={closeFormModal}
                  className="text-sm font-medium text-gray-500 hover:text-gray-800 px-4 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ModalConfirmation
        show={deleteModal.isVisible}
        onClose={deleteModal.hideModal}
        onConfirm={handleDelete}
      />
    </div>
  );
};

CategoryPage.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default CategoryPage;
