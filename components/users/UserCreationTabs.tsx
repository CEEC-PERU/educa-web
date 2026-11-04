import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { UserCreationInput, userCreationSchema } from "@/features/users/user-creation.schema";
import { useDocumentAvailability } from "@/features/users/useDocumentAvailability";
import { getCompanies, getRoles } from "@/services/users/userService";
import { API_PRODUCTS, API_USERS_BULK, API_USERS_CREATE_MANUAL, API_USERS_SYNC_CONFIRM, API_USERS_SYNC_PREVIEW } from "@/utils/Endpoints";
import { toast } from "sonner";

type Option = { id: number; label: string };
type CourseOption = { id: number; name: string; image?: string | null };
type Tab = "manual" | "bulk";
type SyncCounts = { created: number; maintained: number; reactivated: number; deactivated: number };
type SyncUser = { document_type: "DNI" | "CE"; document_number: string; first_name: string; last_name: string; email: string; product_name: string };
type ProductOption = { id: number; name: string };
type AdditiveBulkProgress = { status: string; total: number; processed: number; created: number; reactivated?: number; errorCount: number; failureMessage?: string };

interface UserCreationTabsProps {
  roleId: number;
  enterpriseId?: number;
  canSelectRole?: boolean;
  canSelectEnterprise?: boolean;
  maxUsersAllowed?: number;
  classrooms?: Option[];
  courses?: CourseOption[];
  onClose?: () => void;
  onSuccess?: () => void | Promise<void>;
}

function getErrorMessage(payload: unknown, fallback: string) {
  if (payload && typeof payload === "object" && "message" in payload) {
    return String((payload as { message: unknown }).message);
  }
  return fallback;
}

const UserCreationTabs: React.FC<UserCreationTabsProps> = ({
  roleId,
  enterpriseId,
  canSelectRole = false,
  canSelectEnterprise = false,
  maxUsersAllowed,
  classrooms,
  courses,
  onClose,
  onSuccess,
}) => {
  const { token, user } = useAuth();
  const authenticatedRole = typeof user === "object" && user !== null && "role" in user
    ? Number(user.role)
    : Number.NaN;
  const isAdmin = authenticatedRole === 4;
  const isSupervisor = authenticatedRole === 6;
  const canSyncUsers = isAdmin || isSupervisor;
  const router = useRouter();
  const routeRoleParam = Array.isArray(router.query.roleId) ? router.query.roleId[0] : router.query.roleId;
  const routeRoleNumber = Number(routeRoleParam);
  const hasFixedRole = router.isReady && typeof routeRoleParam === "string" && Number.isSafeInteger(routeRoleNumber) && routeRoleNumber > 0;
  const [tab, setTab] = useState<Tab>(isSupervisor ? "bulk" : "manual");
  const [selectedRole, setSelectedRole] = useState(String(roleId || 1));
  const [selectedEnterprise, setSelectedEnterprise] = useState(String(enterpriseId || ""));
  const canAssignProduct = isAdmin && Number(selectedEnterprise) === 2;
  const availableTabs: Array<{ id: Tab; label: string }> = isSupervisor
    ? [{ id: "bulk", label: "Carga masiva (Excel)" }, { id: "manual", label: "Registro manual" }]
    : isAdmin
    ? [{ id: "manual", label: "Creacion Manual" }, { id: "bulk", label: "Sincronizacion" }]
    : [{ id: "manual", label: "Creacion Manual" }];
  const [selectedProduct, setSelectedProduct] = useState("");
  const [roles, setRoles] = useState<Array<{ role_id: number; name?: string; description?: string }>>([]);
  const [enterprises, setEnterprises] = useState<Array<{ enterprise_id: number; name: string }>>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [form, setForm] = useState<UserCreationInput>({
    document_type: "DNI",
    dni: "",
    first_name: "",
    last_name: "",
    email: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [fileRowCount, setFileRowCount] = useState(0);
  const [selectedClassroom, setSelectedClassroom] = useState("");
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const [deadline, setDeadline] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [syncUsers, setSyncUsers] = useState<SyncUser[]>([]);
  const [preview, setPreview] = useState<SyncCounts | null>(null);
  const [additiveBulkProgress, setAdditiveBulkProgress] = useState<AdditiveBulkProgress | null>(null);
  const { isCheckingDocument, documentExists, verificationFailed } = useDocumentAvailability(
    form.document_type,
    form.dni,
    tab === "manual",
  );

  useEffect(() => {
    if (isSupervisor) setTab("bulk");
    else if (!canSyncUsers) setTab("manual");
  }, [canSyncUsers, isSupervisor]);

  useEffect(() => {
    if (hasFixedRole) setSelectedRole(String(routeRoleNumber));
    else setSelectedRole(String(roleId || 1));
  }, [hasFixedRole, roleId, routeRoleNumber]);

  useEffect(() => {
    if (enterpriseId) setSelectedEnterprise(String(enterpriseId));
  }, [enterpriseId]);

  useEffect(() => {
    let active = true;
    setProducts([]);
    setSelectedProduct("");
    if (!isAdmin || !canAssignProduct || !token || !selectedEnterprise) {
      setProductsLoading(false);
      return () => { active = false; };
    }

    setProductsLoading(true);
    const query = new URLSearchParams({ enterprise_id: selectedEnterprise });
    fetch(`${API_PRODUCTS}?${query.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(getErrorMessage(payload, "No se pudieron cargar los productos."));
        return payload as ProductOption[];
      })
      .then((data) => { if (active) setProducts(Array.isArray(data) ? data : []); })
      .catch((loadError) => {
        if (active) setError(loadError instanceof Error ? loadError.message : "No se pudieron cargar los productos.");
      })
      .finally(() => { if (active) setProductsLoading(false); });

    return () => { active = false; };
  }, [canAssignProduct, isAdmin, selectedEnterprise, token]);

  useEffect(() => {
    let active = true;
    if (canSelectRole) {
      getRoles()
        .then((data) => { if (active) setRoles(data); })
        .catch(() => { if (active) setError("No se pudieron cargar los roles."); });
    }
    if (canSelectEnterprise) {
      getCompanies()
        .then((data) => { if (active) setEnterprises(data); })
        .catch(() => { if (active) setError("No se pudieron cargar las empresas."); });
    }
    return () => { active = false; };
  }, [canSelectEnterprise, canSelectRole]);

  const updateForm = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value } as UserCreationInput));
    setError("");
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null;
    setFile(null);
    setFileRowCount(0);
    setSyncUsers([]);
    setPreview(null);
    setAdditiveBulkProgress(null);
    setError("");
    if (!nextFile) return;

    try {
      const workbook = XLSX.read(await nextFile.arrayBuffer(), { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      if (!sheet) throw new Error("El archivo no contiene hojas.");

      const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: "", raw: false });
      const headers = (rows[0] ?? []).map((value) => {
        const header = String(value).trim().toLowerCase();
        return header === "dni" ? "document_number" : header;
      });
      const requiredHeaders = ["document_type", "document_number", "first_name", "last_name", "email"];
      const missingHeaders = requiredHeaders.filter((header) => !headers.includes(header));
      const productHeaderIndex = headers.indexOf("producto") >= 0 ? headers.indexOf("producto") : headers.indexOf("productos");
      if (canAssignProduct && productHeaderIndex < 0) missingHeaders.push("producto");
      if (missingHeaders.length) throw new Error(`Faltan columnas: ${missingHeaders.join(", ")}.`);

      const columnIndex = Object.fromEntries(requiredHeaders.map((header) => [header, headers.indexOf(header)]));
      const parsedUsers = rows.slice(1)
        .filter((row) => requiredHeaders.some((header) => String(row[columnIndex[header]] ?? "").trim() !== ""))
        .map((row): SyncUser => ({
          document_type: String(row[columnIndex.document_type] ?? "").trim().toUpperCase() as SyncUser["document_type"],
          document_number: String(row[columnIndex.document_number] ?? "").trim().replace(/\.0$/, "").toUpperCase(),
          first_name: String(row[columnIndex.first_name] ?? "").trim(),
          last_name: String(row[columnIndex.last_name] ?? "").trim(),
          email: String(row[columnIndex.email] ?? "").trim(),
          product_name: canAssignProduct && productHeaderIndex >= 0
            ? String(row[productHeaderIndex] ?? "").trim()
            : "",
        }));

      if (parsedUsers.length === 0) throw new Error("El archivo no contiene filas de usuarios.");
      const invalidIndex = parsedUsers.findIndex((user) => {
        const validDni = user.document_type === "DNI" && /^\d{8}$/.test(user.document_number);
        const validCe = user.document_type === "CE" && /^[A-Z0-9]{8,12}$/.test(user.document_number);
        const validEmail = !user.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email);
        return (!validDni && !validCe) || !user.first_name || !user.last_name || !validEmail || (canAssignProduct && !user.product_name);
      });
      if (invalidIndex !== -1) throw new Error(`Revisa el tipo y numero de documento, nombre, apellido y correo de la fila ${invalidIndex + 2}.`);

      const documents = parsedUsers.map((user) => user.document_number);
      if (new Set(documents).size !== documents.length) throw new Error("El archivo contiene documentos duplicados.");

      setFile(nextFile);
      setSyncUsers(parsedUsers);
      setFileRowCount(parsedUsers.length);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "No se pudo leer el archivo.");
      event.target.value = "";
    }
  };
  const assignmentPayload = () => ({
    classroom_id: selectedClassroom || "",
    course_ids: JSON.stringify(selectedCourses),
    deadline,
  });

  const checkContext = () => {
    if (!token) return "Tu sesion expiro. Inicia sesion nuevamente.";
    if (!selectedEnterprise) return "Selecciona una empresa.";
    if (products.length > 0 && !selectedProduct) return "Selecciona un producto.";
    if (maxUsersAllowed !== undefined && maxUsersAllowed < 1) return "La empresa alcanzo el maximo de usuarios permitidos.";
    if (classrooms && courses && selectedCourses.length === 0) return "Selecciona al menos un curso para asignar.";
    return "";
  };

  const submitManual = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    const contextError = checkContext();
    if (contextError) { setError(contextError); return; }

    const parsed = userCreationSchema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Revisa los datos ingresados.");
      return;
    }
    if (documentExists) {
      setError("Este documento ya esta registrado.");
      return;
    }
    if (isCheckingDocument) return;

    setBusy(true);
    try {
      const response = await fetch(API_USERS_CREATE_MANUAL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...parsed.data,
          role_id: Number(selectedRole),
          enterprise_id: Number(selectedEnterprise),
          product_id: selectedProduct ? Number(selectedProduct) : null,
          ...(classrooms && courses ? assignmentPayload() : {}),
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(getErrorMessage(payload, "No se pudo crear el usuario."));
      const documentNumber = parsed.data.dni;
      setForm({ document_type: "DNI", dni: "", first_name: "", last_name: "", email: "" });
      await onSuccess?.();
      toast.success("Usuario creado exitosamente!", {
        description: `La contrasena inicial es su numero de documento (${documentNumber}). Se le solicitara cambiarla en su primer inicio de sesion.`,
        duration: 10000,
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "No se pudo crear el usuario.");
    } finally {
      setBusy(false);
    }
  };

  const downloadTemplate = () => {
    const csv = isSupervisor
      ? "document_type,dni,first_name,last_name,email\nDNI,12345678,Juan,Perez,juan@test.com\n"
      : canAssignProduct
      ? "document_type,document_number,first_name,last_name,email,producto\nDNI,12345678,Juan,Perez,juan@test.com,Producto Demo\n"
      : "document_type,document_number,first_name,last_name,email\nDNI,12345678,Juan,Perez,juan@test.com\n";
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "plantilla_usuarios.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const submitAdditiveBulk = async () => {
    setError("");
    if (!token) { setError("Tu sesion expiro. Inicia sesion nuevamente."); return; }
    if (!file || syncUsers.length === 0) { setError("Selecciona un archivo con usuarios validos."); return; }
    if (isSupervisor && !selectedClassroom) { setError("Selecciona el aula donde se agregaran los usuarios."); return; }
    if (isSupervisor && selectedCourses.length === 0) { setError("Selecciona al menos un curso."); return; }

    setBusy(true);
    setAdditiveBulkProgress(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("role_id", String(Number(selectedRole || roleId || 1)));
      if (classrooms && courses) {
        formData.append("classroom_id", selectedClassroom);
        formData.append("course_ids", JSON.stringify(selectedCourses));
        formData.append("deadline", deadline);
      }

      const startResponse = await fetch(API_USERS_BULK, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const startPayload = await startResponse.json();
      if (!startResponse.ok) throw new Error(getErrorMessage(startPayload, "No se pudo iniciar la carga masiva."));
      if (!startPayload.jobId) throw new Error("El servidor no devolvio el identificador de la carga.");

      let progress: AdditiveBulkProgress = {
        status: startPayload.status ?? "queued",
        total: startPayload.total ?? fileRowCount,
        processed: 0,
        created: 0,
        reactivated: 0,
        errorCount: 0,
      };
      setAdditiveBulkProgress(progress);

      while (progress.status === "queued" || progress.status === "processing") {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const statusResponse = await fetch(`${API_USERS_BULK}/${encodeURIComponent(startPayload.jobId)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const statusPayload = await statusResponse.json();
        if (!statusResponse.ok) throw new Error(getErrorMessage(statusPayload, "No se pudo consultar el avance de la carga."));
        progress = statusPayload as AdditiveBulkProgress;
        setAdditiveBulkProgress(progress);
      }

      if (progress.status !== "completed") {
        throw new Error(progress.failureMessage || "La carga masiva no pudo completarse.");
      }

      await onSuccess?.();
      const reactivated = progress.reactivated ?? 0;
      if (progress.errorCount > 0) {
        toast.warning(`Carga completada: ${progress.created} usuarios agregados, ${reactivated} reactivados y ${progress.errorCount} filas omitidas.`);
      } else {
        toast.success(`Carga completada: ${progress.created} usuarios agregados y ${reactivated} reactivados.`);
      }
      onClose?.();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "No se pudo completar la carga masiva.");
    } finally {
      setBusy(false);
    }
  };

  const submitPreview = async () => {
    if (isSupervisor) return;
    setError("");
    if (!token) { setError("Tu sesion expiro. Inicia sesion nuevamente."); return; }
    if (!selectedEnterprise) { setError("Selecciona una empresa antes de generar el preview."); return; }
    if (!file || syncUsers.length === 0) { setError("Selecciona un archivo con usuarios validos."); return; }

    setBusy(true);
    setPreview(null);
    try {
      const response = await fetch(API_USERS_SYNC_PREVIEW, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...(isAdmin ? { enterprise_id: Number(selectedEnterprise) } : {}),
          users: syncUsers,
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(getErrorMessage(payload, "No se pudo generar el preview."));
      setPreview(payload as SyncCounts);
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "No se pudo generar el preview.";
      const displayMessage = message.includes("Algunos documentos pertenecen a otra empresa")
        ? "Error: Uno o mas DNIs ya estan registrados en otra empresa. No se pueden mover."
        : message;
      setError(displayMessage);
      if (displayMessage !== message) toast.error(displayMessage);
    } finally {
      setBusy(false);
    }
  };

  const confirmSync = async () => {
    if (isSupervisor) return;
    if (!token || !preview || !selectedEnterprise) return;
    setError("");
    setBusy(true);
    try {
      const response = await fetch(API_USERS_SYNC_CONFIRM, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...(isAdmin ? { enterprise_id: Number(selectedEnterprise) } : {}),
          users: syncUsers,
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(getErrorMessage(payload, "No se pudo confirmar la sincronizacion."));
      await onSuccess?.();
      toast.success("Sincronizacion completada", { description: "La lista de usuarios de la empresa fue actualizada." });
      onClose?.();
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "No se pudo confirmar la sincronizacion.";
      const displayMessage = message.includes("Algunos documentos pertenecen a otra empresa")
        ? "Error: Uno o mas DNIs ya estan registrados en otra empresa. No se pueden mover."
        : message;
      setError(displayMessage);
      if (displayMessage !== message) toast.error(displayMessage);
    } finally {
      setBusy(false);
    }
  };
  const toggleCourse = (courseId: number) => {
    setSelectedCourses((selected) => selected.includes(courseId)
      ? selected.filter((id) => id !== courseId)
      : [...selected, courseId]);
  };

  return (
    <section className="w-full max-w-2xl space-y-5">
      <div className="flex gap-2 rounded-lg bg-gray-100 p-1" role="tablist" aria-label="Modo de creacion">
        {availableTabs.map(({ id, label }) => (
          <button key={id} type="button" role="tab" aria-selected={tab === id}
            onClick={() => { setTab(id); setError(""); }}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium ${tab === id ? "bg-white text-blue-700 shadow" : "text-gray-600 hover:text-gray-900"}`}>
            {label}
          </button>
        ))}
      </div>

      {((tab === "manual" && (canSelectRole || canSelectEnterprise)) || (tab === "bulk" && canSelectEnterprise)) && (
        <div className="grid gap-4 sm:grid-cols-2">
          {tab === "manual" && canSelectRole && <label className="space-y-1 text-sm font-medium text-gray-700">Rol
            {hasFixedRole ? (
              <div className="rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-gray-700">
                Rol seleccionado: {roles.find((role) => role.role_id === routeRoleNumber)?.description || roles.find((role) => role.role_id === routeRoleNumber)?.name || (routeRoleNumber === 1 ? "Usuario Estudiante" : `Rol ${routeRoleNumber}`)}
              </div>
            ) : (
              <select value={selectedRole} onChange={(event) => setSelectedRole(event.target.value)} className="w-full rounded-md border border-gray-300 p-2">
                {roles.map((role) => <option key={role.role_id} value={role.role_id}>{role.description || role.name || `Rol ${role.role_id}`}</option>)}
              </select>
            )}
          </label>}
          {canSelectEnterprise && <label className="space-y-1 text-sm font-medium text-gray-700">Empresa
            <select value={selectedEnterprise} onChange={(event) => { setSelectedEnterprise(event.target.value); setSelectedProduct(""); setPreview(null); }} className="w-full rounded-md border border-gray-300 p-2">
              <option value="">Selecciona una empresa</option>
              {enterprises.map((enterprise) => <option key={enterprise.enterprise_id} value={enterprise.enterprise_id}>{enterprise.name}</option>)}
            </select>
          </label>}
        </div>
      )}

      {tab === "manual" ? (
        <form onSubmit={submitManual} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {canAssignProduct && <label className="space-y-1 text-sm font-medium text-gray-700">Producto
              <select value={selectedProduct} onChange={(event) => setSelectedProduct(event.target.value)} disabled={!selectedEnterprise || productsLoading || products.length === 0} required={products.length > 0} className="w-full rounded-md border border-gray-300 p-2 disabled:bg-gray-100">
                <option value="">{productsLoading ? "Cargando productos..." : products.length ? "Selecciona un producto" : "No hay productos disponibles"}</option>
                {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
              </select>
            </label>}
            <label className="space-y-1 text-sm font-medium text-gray-700">Tipo de Documento
              <select name="document_type" value={form.document_type} onChange={updateForm} className="w-full rounded-md border border-gray-300 p-2">
                <option value="DNI">DNI</option><option value="CE">CE</option><option value="PA">PA (Pasaporte)</option>
              </select>
            </label>
            <label className="space-y-1 text-sm font-medium text-gray-700">Numero de Documento
              <input name="dni" value={form.dni} onChange={updateForm} autoComplete="off" className="w-full rounded-md border border-gray-300 p-2" placeholder={form.document_type === "DNI" ? "8 digitos" : form.document_type === "CE" ? "8 a 12 caracteres" : "Hasta 12 caracteres alfanumericos"} />
              {isCheckingDocument && <span className="mt-1 flex items-center gap-2 text-xs text-gray-500"><span className="h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />Verificando documento...</span>}
              {documentExists && <span role="alert" className="mt-1 block text-xs text-red-600">Este documento ya esta registrado.</span>}
              {verificationFailed && !documentExists && <span className="mt-1 block text-xs text-amber-700">No se pudo verificar ahora; se comprobara al guardar.</span>}
            </label>
            <label className="space-y-1 text-sm font-medium text-gray-700">Nombre
              <input name="first_name" value={form.first_name} onChange={updateForm} className="w-full rounded-md border border-gray-300 p-2" />
            </label>
            <label className="space-y-1 text-sm font-medium text-gray-700">Apellido
              <input name="last_name" value={form.last_name} onChange={updateForm} className="w-full rounded-md border border-gray-300 p-2" />
            </label>
            <label className="space-y-1 text-sm font-medium text-gray-700 sm:col-span-2">Correo (opcional)
              <input type="email" name="email" value={form.email ?? ""} onChange={updateForm} className="w-full rounded-md border border-gray-300 p-2" />
            </label>
          </div>
          {classrooms && courses && <AssignmentFields classrooms={classrooms} courses={courses} selectedClassroom={selectedClassroom} setSelectedClassroom={setSelectedClassroom} selectedCourses={selectedCourses} toggleCourse={toggleCourse} deadline={deadline} setDeadline={setDeadline} />}
          <div className="flex justify-end gap-2">
            {onClose && <button type="button" disabled={busy} onClick={onClose} className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 disabled:opacity-50">Cancelar</button>}
            <button disabled={busy || isCheckingDocument || documentExists === true} className="rounded-md bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50">{busy ? "Creando..." : isCheckingDocument ? "Verificando..." : "Crear Usuario"}</button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-600">{isSupervisor ? "Carga un Excel o CSV con el tipo y numero de documento, nombre, apellido y correo opcional. Se agregaran los usuarios nuevos y se reactivaran los inactivos de tu empresa, asignandolos al aula y cursos seleccionados. Los usuarios que no esten en el archivo no se desactivaran." : `Excel o CSV con las columnas: Tipo de Documento, Numero de Documento, Nombre, Apellido, Correo (opcional)${canAssignProduct ? " y Producto." : "."}`}</p>
            <button type="button" onClick={downloadTemplate} className="rounded-md border border-blue-600 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50">Descargar Plantilla</button>
          </div>
          <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileChange} className="block w-full rounded-md border border-gray-300 p-2 text-sm" />
          {isSupervisor && classrooms && courses && <AssignmentFields classrooms={classrooms} courses={courses} selectedClassroom={selectedClassroom} setSelectedClassroom={setSelectedClassroom} selectedCourses={selectedCourses} toggleCourse={toggleCourse} deadline={deadline} setDeadline={setDeadline} required />}
          {file && <p className="text-sm text-gray-600">{file.name}: {fileRowCount} usuarios listos para {isSupervisor ? "agregar" : "sincronizar"}.</p>}
          <button type="button" disabled={busy || !file || !selectedEnterprise} onClick={isSupervisor ? submitAdditiveBulk : submitPreview} className="rounded-md bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50">{busy ? (isSupervisor ? "Agregando usuarios..." : "Calculando...") : (isSupervisor ? "Registrar" : "Generar Preview")}</button>
          {isSupervisor && additiveBulkProgress && <div className="space-y-2 rounded-lg border border-blue-200 bg-blue-50 p-4" aria-live="polite">
            <p className="text-sm text-gray-700">Procesados: {additiveBulkProgress.processed} de {additiveBulkProgress.total}</p>
            <progress className="w-full" value={additiveBulkProgress.processed} max={Math.max(additiveBulkProgress.total, 1)} />
            <p className="text-sm text-gray-700">Agregados: {additiveBulkProgress.created} · Reactivados: {additiveBulkProgress.reactivated ?? 0} · Filas omitidas: {additiveBulkProgress.errorCount}</p>
          </div>}
          {!isSupervisor && preview && <div className="space-y-2 rounded-lg border border-blue-200 bg-blue-50 p-4" aria-live="polite">
            <h3 className="font-semibold text-gray-900">Resumen de sincronizacion</h3>
            <p className="text-sm text-gray-700">Se crearan: <strong>{preview.created}</strong> usuarios</p>
            <p className="text-sm text-gray-700">Se reactivaran: <strong>{preview.reactivated}</strong> usuarios</p>
            <p className="text-sm text-gray-700">Se mantendran: <strong>{preview.maintained}</strong> usuarios</p>
            <p className="text-sm text-gray-700">Se desactivaran: <strong>{preview.deactivated}</strong> usuarios (no estan en el Excel)</p>
          </div>}
          {!isSupervisor && preview && <button type="button" disabled={busy} onClick={confirmSync} className="rounded-md bg-green-700 px-5 py-2 font-medium text-white disabled:opacity-50">{busy ? "Sincronizando..." : "Confirmar Sincronizacion"}</button>}
          {onClose && !busy && <button type="button" onClick={onClose} className="ml-2 rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700">Cancelar</button>}
        </div>
      )}

      {error && <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    </section>
  );
};

interface AssignmentFieldsProps {
  classrooms: Option[];
  courses: CourseOption[];
  selectedClassroom: string;
  setSelectedClassroom: (value: string) => void;
  selectedCourses: number[];
  toggleCourse: (id: number) => void;
  deadline: string;
  setDeadline: (value: string) => void;
  required?: boolean;
}

const AssignmentFields: React.FC<AssignmentFieldsProps> = ({ classrooms, courses, selectedClassroom, setSelectedClassroom, selectedCourses, toggleCourse, deadline, setDeadline, required = false }) => (
  <div className="space-y-3 rounded-lg border border-gray-200 p-4">
    <h3 className="text-sm font-semibold text-gray-800">Aula y cursos</h3>
    <label className="block space-y-1 text-sm text-gray-700">Aula
      <select value={selectedClassroom} onChange={(event) => setSelectedClassroom(event.target.value)} required={required} className="w-full rounded-md border border-gray-300 p-2">
        <option value="">Selecciona un aula</option>{classrooms.map((classroom) => <option key={classroom.id} value={classroom.id}>{classroom.label}</option>)}
      </select>
    </label>
    {courses.length > 0 && <fieldset className="space-y-2"><legend className="text-sm text-gray-700">Cursos {required && <span className="text-gray-500">(selecciona uno o mas)</span>}</legend>
      {courses.map((course) => <label key={course.id} className="flex cursor-pointer items-center gap-3 rounded border border-gray-200 p-3 text-sm text-gray-700">
        <input type="checkbox" checked={selectedCourses.includes(course.id)} onChange={() => toggleCourse(course.id)} />
        {course.image && <img src={course.image} alt="" className="h-9 w-9 rounded object-cover" />}
        <span>{course.name}</span>
      </label>)}
    </fieldset>}
    <label className="block space-y-1 text-sm text-gray-700">Fecha limite{required ? "" : " (opcional)"}
      <input type="date" value={deadline} onChange={(event) => setDeadline(event.target.value)} className="w-full rounded-md border border-gray-300 p-2" />
    </label>
  </div>
);

export default UserCreationTabs;
