import React, { FormEvent, useState } from "react";
import { createIndividualUser } from "../../services/users/userService";
import { userCreationSchema, UserCreationInput } from "../../features/users/user-creation.schema";
import { useDocumentAvailability } from "../../features/users/useDocumentAvailability";

interface SupervisorFormProps {
  roleId: number;
  initialEnterpriseId: number;
  onClose: () => void;
  onSuccess: (userId: number) => void;
}

const SupervisorForm: React.FC<SupervisorFormProps> = ({ roleId, initialEnterpriseId, onClose, onSuccess }) => {
  const [form, setForm] = useState<UserCreationInput>({
    document_type: "DNI",
    dni: "",
    first_name: "",
    last_name: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { isCheckingDocument, documentExists, verificationFailed } = useDocumentAvailability(
    form.document_type,
    form.dni,
  );

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    const parsed = userCreationSchema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Revisa los datos ingresados.");
      return;
    }
    if (documentExists === true) {
      setError("Este documento ya esta registrado.");
      return;
    }
    if (isCheckingDocument) return;

    setLoading(true);
    try {
      const response = await createIndividualUser({
        ...parsed.data,
        role_id: roleId,
        enterprise_id: initialEnterpriseId,
      });
      const userId = Number(response?.user?.user_id);
      if (!userId) throw new Error("La respuesta no incluyo el usuario creado.");
      onSuccess(userId);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "No se pudo crear el supervisor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 rounded bg-white p-6 shadow-md">
      <label className="block text-sm font-medium text-gray-700">Tipo de Documento
        <select name="document_type" value={form.document_type} onChange={(event) => setForm((previous) => ({ ...previous, document_type: event.target.value as "DNI" | "CE" }))} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2">
          <option value="DNI">DNI</option><option value="CE">CE</option>
        </select>
      </label>
      <label className="block text-sm font-medium text-gray-700">Numero de Documento
        <input value={form.dni} onChange={(event) => setForm((previous) => ({ ...previous, dni: event.target.value }))} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" autoComplete="off" />
        {isCheckingDocument && <span className="mt-1 flex items-center gap-2 text-xs text-gray-500"><span className="h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />Verificando documento...</span>}
        {documentExists && <span role="alert" className="mt-1 block text-xs text-red-600">Este documento ya esta registrado.</span>}
        {verificationFailed && !documentExists && <span className="mt-1 block text-xs text-amber-700">No se pudo verificar ahora; se comprobara al guardar.</span>}
      </label>
      <label className="block text-sm font-medium text-gray-700">Nombre
        <input value={form.first_name} onChange={(event) => setForm((previous) => ({ ...previous, first_name: event.target.value }))} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
      </label>
      <label className="block text-sm font-medium text-gray-700">Apellido
        <input value={form.last_name} onChange={(event) => setForm((previous) => ({ ...previous, last_name: event.target.value }))} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
      </label>
      <label className="block text-sm font-medium text-gray-700">Correo (opcional)
        <input type="email" value={form.email ?? ""} onChange={(event) => setForm((previous) => ({ ...previous, email: event.target.value }))} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
      </label>
      {error && <p role="alert" className="rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" disabled={loading} onClick={onClose} className="rounded bg-gray-500 px-4 py-2 text-white disabled:opacity-50">Cancelar</button>
        <button type="submit" disabled={loading || isCheckingDocument || documentExists === true} className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50">{loading ? "Guardando..." : isCheckingDocument ? "Verificando..." : "Guardar"}</button>
      </div>
    </form>
  );
};

export default SupervisorForm;
