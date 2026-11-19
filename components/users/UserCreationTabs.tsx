import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { UserCreationInput, userCreationSchema } from "@/features/users/user-creation.schema";
import { useDocumentAvailability } from "@/features/users/useDocumentAvailability";
import { getCompanies, getRoles } from "@/services/users/userService";
import { API_CAMPAIGNS, API_USERS_CREATE_MANUAL, API_USERS_SYNC_CONFIRM, API_USERS_SYNC_PREVIEW } from "@/utils/Endpoints";
import {
  getCampaignLabel,
  getCampaignLabelLower,
  getCampaignLabelPluralLower,
} from "@/utils/campaigns";
import { toast } from "sonner";

type Option = { id: number; label: string };
type CourseOption = { id: number; name: string; image?: string | null };
type Tab = "manual" | "bulk";
type SyncCounts = {
  creados: number;
  actualizados: number;
  reactivados: number;
  desactivados: number;
  desactivacionesOmitidas?: boolean;
  usuariosAusentesSinDesactivar?: number;
  advertenciaSeguridad?: string | null;
  advertenciaCampana?: string | null;
};
type SyncUser = { document_type: "DNI" | "CE"; document_number: string; first_name: string; last_name: string; email: string; external_supervisor: string; product_name: string; ceco: string };
type ProductOption = { id: number; name: string };
// Reporte de conflictos: usuarios del archivo que ya estan registrados en otra empresa.
type SyncConflict = {
  dni: string;
  name: string;
  currentEnterprise: string;
  reason?: string;
};

// Respuesta del preview (HTTP 200): no escribe nada, solo informa.
type SyncPreview = {
  message: string;
  validCount: number;
  skippedCount: number;
  conflicts: SyncConflict[];
  validDnis: string[];
  creados: number;
  actualizados: number;
  reactivados: number;
  desactivados: number;
  advertenciaSeguridad?: string | null;
  advertenciaCampana?: string | null;
};

// Normaliza la respuesta del preview: acepta el backend nuevo y el anterior.
function readSyncPreview(payload: unknown): SyncPreview | null {
  if (!payload || typeof payload !== "object") return null;
  const candidate = payload as Partial<SyncPreview>;
  if (!Array.isArray(candidate.conflicts)) return null;
  return {
    message: String(candidate.message ?? "Preview generado exitosamente."),
    validCount: Number(candidate.validCount ?? 0),
    skippedCount: Number(candidate.skippedCount ?? candidate.conflicts.length),
    conflicts: candidate.conflicts.map((row) => {
      const record = (row ?? {}) as Record<string, unknown>;
      const firstName = String(record.first_name ?? "").trim();
      const lastName = String(record.last_name ?? "").trim();
      const composedName = [firstName, lastName].filter(Boolean).join(" ").trim();
      return {
        dni: String(record.dni ?? record.document_number ?? record.numero_documento ?? "").trim(),
        name: String(record.name ?? record.full_name ?? record.fullName ?? record.user_name ?? composedName ?? "").trim(),
        currentEnterprise: String(
          record.currentEnterprise ?? record.enterprise_name ?? record.enterprise ?? record.empresa ?? "",
        ).trim(),
        reason: String(record.reason ?? ""),
      };
    }),
    validDnis: Array.isArray(candidate.validDnis)
      ? candidate.validDnis.map((dni) => String(dni ?? ""))
      : [],
    creados: Number(candidate.creados ?? 0),
    actualizados: Number(candidate.actualizados ?? 0),
    reactivados: Number(candidate.reactivados ?? 0),
    desactivados: Number(candidate.desactivados ?? 0),
    advertenciaSeguridad: candidate.advertenciaSeguridad ?? null,
    advertenciaCampana: candidate.advertenciaCampana ?? null,
  };
}

interface UserCreationTabsProps {
  roleId: number;
  enterpriseId?: number;
  manualEnterpriseId?: number;
  manualEnterpriseName?: string;
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
  manualEnterpriseId,
  manualEnterpriseName,
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
  const isCorporateAdmin = authenticatedRole === 5;
  const isSupervisor = authenticatedRole === 6;
  const canSyncUsers = isAdmin || isSupervisor;
  const router = useRouter();
  const routeRoleParam = Array.isArray(router.query.roleId) ? router.query.roleId[0] : router.query.roleId;
  const routeRoleNumber = Number(routeRoleParam);
  const hasFixedRole = router.isReady && typeof routeRoleParam === "string" && Number.isSafeInteger(routeRoleNumber) && routeRoleNumber > 0;
  const [tab, setTab] = useState<Tab>(isSupervisor ? "bulk" : "manual");
  const [selectedRole, setSelectedRole] = useState(String(roleId || 1));
  const [selectedEnterprise, setSelectedEnterprise] = useState(String(enterpriseId || ""));
  const hasPinnedManualEnterprise = Number.isSafeInteger(manualEnterpriseId) && Number(manualEnterpriseId) > 0;
  const manualSelectedEnterprise = hasPinnedManualEnterprise ? String(manualEnterpriseId) : selectedEnterprise;
  const availableTabs: Array<{ id: Tab; label: string }> = isSupervisor
    ? [{ id: "bulk", label: "Carga masiva (Excel)" }, { id: "manual", label: "Registro manual" }]
    : isAdmin
    ? [{ id: "manual", label: "Creacion Manual" }, { id: "bulk", label: "Sincronizacion" }]
    : [{ id: "manual", label: "Creacion Manual" }];
  const [selectedProduct, setSelectedProduct] = useState("");
  const [newProductName, setNewProductName] = useState("");
  const [ceco, setCeco] = useState("");
  // Si el archivo de origen traia la columna de campaña: se lo informamos al backend
  // para que el aviso sea preciso.
  const [campaignColumnPresent, setCampaignColumnPresent] = useState<boolean | null>(null);
  const [roles, setRoles] = useState<Array<{ role_id: number; name?: string; description?: string }>>([]);
  const [enterprises, setEnterprises] = useState<Array<{ enterprise_id: number; name: string }>>([]);
  const selectedEnterpriseInfo = enterprises.find(
    (enterprise) => String(enterprise.enterprise_id) === manualSelectedEnterprise,
  );
  // RIMAC usa enterprise_id=2 (la misma regla aplicada al flujo de productos y sincronización).
  const isRimacSelected = Number(manualSelectedEnterprise) === 2
    || manualEnterpriseName?.trim().toLocaleUpperCase().includes("RIMAC") === true
    || selectedEnterpriseInfo?.name.trim().toLocaleUpperCase().includes("RIMAC") === true;
  // Nissan no tiene un enterprise_id fijo: se detecta por el nombre del select.
  const isNissanSelected = manualEnterpriseName?.trim().toLocaleUpperCase().includes("NISSAN") === true
    || selectedEnterpriseInfo?.name.trim().toLocaleUpperCase().includes("NISSAN") === true;
  // Nissan y Rimac no usan Supervisor de Campo: el campo se oculta y su valor se limpia.
  const hidesExternalSupervisor = isRimacSelected || isNissanSelected;
  // Regla de NEGOCIO: solo los roles administradores asignan campañas (decisión D1).
  // No confundir con useRimacRosterUpload, que es el modo TÉCNICO de envío.
  const canAssignCampaign = isAdmin || isCorporateAdmin;
  // Modo TÉCNICO de envío: el padrón de Rimac se sube como archivo porque el backend
  // lo delega a su flujo exclusivo (rimacSyncService). El resto de empresas usa JSON.
  const useRimacRosterUpload = isRimacSelected;
  const campaignLabel = getCampaignLabel(manualSelectedEnterprise);
  const campaignLabelLower = getCampaignLabelLower(manualSelectedEnterprise);
  const campaignLabelPluralLower = getCampaignLabelPluralLower(manualSelectedEnterprise);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const shouldLoadManualCampaigns = canAssignCampaign && tab === "manual"
    && Boolean(manualSelectedEnterprise);
  const [form, setForm] = useState<UserCreationInput>({
    document_type: "DNI",
    dni: "",
    first_name: "",
    last_name: "",
    email: "",
    external_supervisor: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [fileRowCount, setFileRowCount] = useState(0);
  const [selectedClassroom, setSelectedClassroom] = useState("");
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const [deadline, setDeadline] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  // Preview de la carga masiva: paso 1, no escribe nada en la base.
  const [previewData, setPreviewData] = useState<SyncPreview | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [syncUsers, setSyncUsers] = useState<SyncUser[]>([]);
  const [preview, setPreview] = useState<SyncCounts | null>(null);
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
    // Al cambiar a Nissan o Rimac el campo deja de existir: se limpia el valor para
    // que no se envíe un supervisor de una empresa anterior.
    if (hidesExternalSupervisor) {
      setForm((previous) => previous.external_supervisor
        ? { ...previous, external_supervisor: "" }
        : previous);
    }
  }, [hidesExternalSupervisor]);

  useEffect(() => {
    setSelectedProduct("");
    setNewProductName("");
    setCeco("");
  }, [manualSelectedEnterprise]);

  useEffect(() => {
    let active = true;
    setProducts([]);
    setSelectedProduct("");
    if (!shouldLoadManualCampaigns || !token) {
      setProductsLoading(false);
      return () => { active = false; };
    }

    setProductsLoading(true);
    const query = new URLSearchParams({ enterprise_id: manualSelectedEnterprise });
    fetch(`${API_CAMPAIGNS}?${query.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(getErrorMessage(payload, `No se pudieron cargar ${campaignLabelPluralLower}.`));
        return payload as ProductOption[];
      })
      .then((data) => { if (active) setProducts(Array.isArray(data) ? data : []); })
      .catch((loadError) => {
        if (active) setError(loadError instanceof Error ? loadError.message : `No se pudieron cargar ${campaignLabelPluralLower}.`);
      })
      .finally(() => { if (active) setProductsLoading(false); });

    return () => { active = false; };
  }, [manualSelectedEnterprise, shouldLoadManualCampaigns, token, campaignLabelPluralLower]);

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
      // La columna de campaña admite ambos nombres: "campaña"/"producto".
      const campaignHeaderIndex = ["campaña", "campana", "producto", "productos"]
        .map((name) => headers.indexOf(name))
        .find((index) => index >= 0) ?? -1;
      const cecoHeaderIndex = ["ceco", "centro_costo", "centro de costo"]
        .map((name) => headers.indexOf(name))
        .find((index) => index >= 0) ?? -1;
      setCampaignColumnPresent(campaignHeaderIndex >= 0);
      // En el padrón de Rimac la columna sigue siendo obligatoria; en el resto es opcional
      // para no romper los archivos actuales (decisión D2).
      if (useRimacRosterUpload && campaignHeaderIndex < 0) missingHeaders.push(campaignLabelLower);
      if (missingHeaders.length) throw new Error(`Faltan columnas: ${missingHeaders.join(", ")}.`);

      const columnIndex = Object.fromEntries(requiredHeaders.map((header) => [header, headers.indexOf(header)]));
      const externalSupervisorIndex = headers.indexOf("external_supervisor");
      const parsedUsers = rows.slice(1)
        .filter((row) => requiredHeaders.some((header) => String(row[columnIndex[header]] ?? "").trim() !== ""))
        .map((row): SyncUser => {
          const document_type = String(row[columnIndex.document_type] ?? "").trim().toUpperCase() as SyncUser["document_type"];
          let document_number = String(row[columnIndex.document_number] ?? "").trim().replace(/\.0$/, "").toUpperCase();
          if (/^\d{1,8}$/.test(document_number)) {
            // Los documentos se guardan con 8 digitos: "1714950" y "01714950" son
            // el mismo. Excel muestra la celda numerica sin los ceros a la izquierda.
            document_number = document_number.padStart(8, "0");
          }
          return {
            document_type,
            document_number,
            first_name: String(row[columnIndex.first_name] ?? "").trim(),
            last_name: String(row[columnIndex.last_name] ?? "").trim(),
            email: String(row[columnIndex.email] ?? "").trim(),
            external_supervisor: externalSupervisorIndex >= 0 ? String(row[externalSupervisorIndex] ?? "").trim() : "",
            product_name: canAssignCampaign && campaignHeaderIndex >= 0
              ? String(row[campaignHeaderIndex] ?? "").trim()
              : "",
            ceco: canAssignCampaign && cecoHeaderIndex >= 0
              ? String(row[cecoHeaderIndex] ?? "").trim().slice(0, 150)
              : "",
          };
        });

      if (parsedUsers.length === 0) throw new Error("El archivo no contiene filas de usuarios.");
      const invalidIndex = parsedUsers.findIndex((user) => {
        const validDni = user.document_type === "DNI" && /^\d{8}$/.test(user.document_number);
        const validCe = user.document_type === "CE" && /^[A-Z0-9]{8,12}$/.test(user.document_number);
        const validEmail = !user.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email);
        return (!validDni && !validCe) || !user.first_name || !user.last_name || !validEmail
          || user.external_supervisor.length > 150 || (useRimacRosterUpload && !user.product_name);
      });
      if (invalidIndex !== -1) throw new Error(`Revisa el tipo y numero de documento, nombre, apellido y correo de la fila ${invalidIndex + 2}.`);

      const documents = parsedUsers.map((user) => user.document_number);
      if (new Set(documents).size !== documents.length) throw new Error("El archivo contiene documentos duplicados.");

      setFile(nextFile);
      // Un archivo nuevo invalida el preview anterior.
      setPreviewData(null);
      setPreview(null);
      setSyncMessage(null);
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

  const sendSyncRequest = (endpoint: string, extraBody: Record<string, unknown> = {}) => {
    // El padrón de Rimac se envía como archivo porque el backend lo delega a su flujo
    // exclusivo. El resto de empresas viaja como JSON con los usuarios ya parseados.
    if (useRimacRosterUpload) {
      const formData = new FormData();
      formData.append("enterprise_id", selectedEnterprise);
      if (file) formData.append("file", file);
      return fetch(endpoint, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
    }
    return fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        ...(isAdmin ? { enterprise_id: Number(selectedEnterprise) } : {}),
        ...(campaignColumnPresent === null ? {} : { campaign_column_present: campaignColumnPresent }),
        users: syncUsers,
        ...(isSupervisor ? assignmentPayload() : {}),
        ...extraBody,
      }),
    });
  };

  const checkContext = () => {
    if (!token) return "Tu sesion expiro. Inicia sesion nuevamente.";
    if (!manualSelectedEnterprise) return "Selecciona una empresa.";
    if (shouldLoadManualCampaigns && productsLoading) return `Espera mientras se cargan ${campaignLabelPluralLower} de la empresa.`;
    if (shouldLoadManualCampaigns && products.length > 0 && !selectedProduct && !newProductName.trim()) {
      return `Selecciona ${campaignLabelLower} o ingresa una nueva.`;
    }
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
          enterprise_id: Number(manualSelectedEnterprise),
          product_id: canAssignCampaign && selectedProduct ? Number(selectedProduct) : null,
          product_name: canAssignCampaign
            ? newProductName.trim()
              || products.find((product) => String(product.id) === selectedProduct)?.name
              || ""
            : "",
          ceco: canAssignCampaign ? ceco.trim() : "",
          ...(classrooms && courses ? assignmentPayload() : {}),
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(getErrorMessage(payload, "No se pudo crear el usuario."));
      const documentNumber = parsed.data.dni;
      setForm({ document_type: "DNI", dni: "", first_name: "", last_name: "", email: "", external_supervisor: "" });
      setSelectedProduct("");
      setNewProductName("");
      setCeco("");
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
      ? "document_type,dni,first_name,last_name,email,external_supervisor\nDNI,12345678,Juan,Perez,juan@test.com,Fernando Chiroque\n"
      : canAssignCampaign
      ? `document_type,document_number,first_name,last_name,email,${campaignLabelLower},ceco\nDNI,12345678,Juan,Perez,juan@test.com,${campaignLabel} Demo,CC-0001\n`
      : "document_type,document_number,first_name,last_name,email,external_supervisor\nDNI,12345678,Juan,Perez,juan@test.com,Fernando Chiroque\n";
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "plantilla_usuarios.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const submitPreview = async () => {
    setError("");
    if (!token) { setError("Tu sesion expiro. Inicia sesion nuevamente."); return; }
    if (!selectedEnterprise) { setError("Selecciona una empresa antes de generar el preview."); return; }
    if (!file || syncUsers.length === 0) { setError("Selecciona un archivo con usuarios validos."); return; }
    if (isSupervisor && (!selectedClassroom || selectedCourses.length === 0)) {
      setError("Selecciona el aula y los cursos asignados a tu equipo.");
      return;
    }

    setBusy(true);
    setPreview(null);
    setSyncMessage(null);
    try {
      // PASO 1: el preview solo informa, NO guarda nada en la base de datos.
      const response = await sendSyncRequest(API_USERS_SYNC_PREVIEW);
      const payload = await response.json();
      if (!response.ok) throw new Error(getErrorMessage(payload, "No se pudo generar el preview."));
      const preview = readSyncPreview(payload);
      if (!preview) throw new Error("El servidor no devolvio un preview valido.");
      setPreviewData(preview);
      setPreview(payload as SyncCounts);
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "No se pudo generar el preview.";
      setError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  };

  const confirmSync = async () => {
    if (!token || !previewData || !selectedEnterprise) return;
    setError("");
    setSyncMessage(null);
    setSyncing(true);
    try {
      // PASO 2: el humano confirmo los DNIs validos; recien ahora se guardan.
      const response = await sendSyncRequest(API_USERS_SYNC_CONFIRM, {
        validDnis: previewData.validDnis,
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(getErrorMessage(payload, "No se pudo confirmar la sincronizacion."));
      const created = Number(payload.createdCount ?? 0);
      const ignored = Number(payload.skippedCount ?? previewData.skippedCount);
      const message = `Se crearon ${created} usuarios. Se ignoraron ${ignored} duplicados.`;
      setSyncMessage(message);
      await onSuccess?.();
      toast.success("¡Sincronización completada!", {
        description: `${message}${payload.advertenciaSeguridad ? ` ${payload.advertenciaSeguridad}` : ""}`,
        duration: 10000,
      });
      // Limpieza del formulario.
      setPreviewData(null);
      setPreview(null);
      setFile(null);
      setSyncUsers([]);
      setFileRowCount(0);
      onClose?.();
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "No se pudo confirmar la sincronizacion.";
      setError(message);
      toast.error(message);
    } finally {
      setSyncing(false);
      setBusy(false);
    }
  };
  const toggleCourse = (courseId: number) => {
    setSelectedCourses((selected) => selected.includes(courseId)
      ? selected.filter((id) => id !== courseId)
      : [...selected, courseId]);
  };

  return (
    <section className="flex max-h-[80vh] min-h-0 w-full max-w-2xl flex-col gap-3">
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
            <select value={tab === "manual" ? manualSelectedEnterprise : selectedEnterprise} disabled={tab === "manual" && hasPinnedManualEnterprise} onChange={(event) => {
              const nextEnterprise = event.target.value;
              const nextEnterpriseInfo = enterprises.find(
                (enterprise) => String(enterprise.enterprise_id) === nextEnterprise,
              );
              const nextIsRimac = Number(nextEnterprise) === 2
                || nextEnterpriseInfo?.name.trim().toLocaleUpperCase().includes("RIMAC") === true;
              const nextIsNissan = nextEnterpriseInfo?.name.trim().toLocaleUpperCase().includes("NISSAN") === true;
              setSelectedEnterprise(nextEnterprise);
              setSelectedProduct("");
              setNewProductName("");
              setCeco("");
              setPreview(null);
              if (nextIsRimac || nextIsNissan) {
                setForm((previous) => ({ ...previous, external_supervisor: "" }));
              }
            }} className="w-full rounded-md border border-gray-300 p-2 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-600">
              <option value="">Selecciona una empresa</option>
              {hasPinnedManualEnterprise && tab === "manual" && !enterprises.some((enterprise) => String(enterprise.enterprise_id) === manualSelectedEnterprise) && (
                <option value={manualSelectedEnterprise}>{manualEnterpriseName || `Empresa ${manualSelectedEnterprise}`}</option>
              )}
              {enterprises.map((enterprise) => <option key={enterprise.enterprise_id} value={enterprise.enterprise_id}>{enterprise.name}</option>)}
            </select>
          </label>}
        </div>
      )}

      {tab === "manual" ? (
        <form onSubmit={submitManual} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
          <div className="grid gap-4 sm:grid-cols-2">
            {shouldLoadManualCampaigns && <div className="space-y-2 sm:col-span-2">
              <label className="block space-y-1 text-sm font-medium text-gray-700">{campaignLabel} existente
                <select value={selectedProduct} onChange={(event) => {
                  setSelectedProduct(event.target.value);
                  if (event.target.value) setNewProductName("");
                }} disabled={productsLoading} className="w-full rounded-md border border-gray-300 p-2 disabled:bg-gray-100">
                  <option value="">{productsLoading ? `Cargando ${campaignLabelPluralLower} de la empresa...` : products.length ? `Selecciona ${campaignLabelLower}` : `No hay ${campaignLabelPluralLower} para esta empresa`}</option>
                  {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
                </select>
              </label>
              <label className="block space-y-1 text-sm font-medium text-gray-700">Nombre de {campaignLabelLower}
                <input value={newProductName} onChange={(event) => {
                  setNewProductName(event.target.value);
                  if (event.target.value.trim()) setSelectedProduct("");
                }} maxLength={150} className="w-full rounded-md border border-gray-300 p-2" placeholder={`Nombre de ${campaignLabelLower}`} />
              </label>
              <label className="block space-y-1 text-sm font-medium text-gray-700">CECO (opcional)
                <input value={ceco} onChange={(event) => setCeco(event.target.value)} maxLength={150} className="w-full rounded-md border border-gray-300 p-2" placeholder="Codigo de centro de costo" />
              </label>
            </div>}
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
            {!hidesExternalSupervisor && <label className="space-y-1 text-sm font-medium text-gray-700 sm:col-span-2">Supervisor de Campo (Opcional)
              <input name="external_supervisor" value={form.external_supervisor ?? ""} onChange={updateForm} maxLength={150} className="w-full rounded-md border border-gray-300 p-2" placeholder="Nombre del supervisor de campo" />
            </label>}
          </div>
          {classrooms && courses && <AssignmentFields classrooms={classrooms} courses={courses} selectedClassroom={selectedClassroom} setSelectedClassroom={setSelectedClassroom} selectedCourses={selectedCourses} toggleCourse={toggleCourse} deadline={deadline} setDeadline={setDeadline} />}
          </div>
          <div className="flex shrink-0 justify-end gap-2 border-t border-gray-200 bg-white pt-3">
            {onClose && <button type="button" disabled={busy} onClick={onClose} className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 disabled:opacity-50">Cancelar</button>}
            <button disabled={busy || isCheckingDocument || documentExists === true} className="rounded-md bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50">{busy ? "Creando..." : isCheckingDocument ? "Verificando..." : "Crear Usuario"}</button>
          </div>
        </form>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-600">{isSupervisor ? "Carga el padrón completo de tu equipo con external_supervisor. La vista previa mostrará altas, actualizaciones, reactivaciones y bajas. Solo afecta a la empresa 22. El archivo tiene menos del 80% de los usuarios activos. Se procesarán las altas y reactivaciones, pero se omitirán las desactivaciones de ausentes para evitar bajas masivas por error." : `Excel o CSV con las columnas: Tipo de Documento, Numero de Documento, Nombre, Apellido, Correo (opcional)${canAssignCampaign ? ` y ${campaignLabel}, CECO (opcional).` : "."}`}</p>
            <button type="button" onClick={downloadTemplate} className="rounded-md border border-blue-600 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50">Descargar Plantilla</button>
          </div>
          <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileChange} className="block w-full rounded-md border border-gray-300 p-2 text-sm" />
          {isSupervisor && classrooms && courses && <AssignmentFields classrooms={classrooms} courses={courses} selectedClassroom={selectedClassroom} setSelectedClassroom={setSelectedClassroom} selectedCourses={selectedCourses} toggleCourse={toggleCourse} deadline={deadline} setDeadline={setDeadline} required />}
          {file && <p className="text-sm text-gray-600">{file.name}: {fileRowCount} usuarios listos para sincronizar.</p>}
          {previewData && previewData.conflicts.length > 0 && (
            <div role="alert" className="rounded-lg border border-red-300 bg-red-50 p-4">
              <p className="text-sm font-semibold text-red-800">{previewData.message}</p>
              <p className="mt-1 text-sm font-medium text-green-700">
                ✅ {previewData.validCount} {previewData.validCount === 1 ? "usuario listo" : "usuarios listos"} para sincronizar.
              </p>
              <p className="mt-1 text-sm text-red-700">
                ❌ Los siguientes {previewData.conflicts.length} {previewData.conflicts.length === 1 ? "usuario ya está" : "usuarios ya están"} en otra empresa y no se moverán:
              </p>
              <div className="mt-2 max-h-56 overflow-y-auto rounded border border-red-200 bg-white">
                <table className="min-w-full text-left text-xs">
                  <thead className="sticky top-0 bg-red-50 text-red-800">
                    <tr>
                      <th scope="col" className="px-3 py-2 font-semibold">DNI</th>
                      <th scope="col" className="px-3 py-2 font-semibold">Nombre</th>
                      <th scope="col" className="px-3 py-2 font-semibold">Empresa actual</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.conflicts.map((row, index) => (
                      <tr key={row.dni || index} className="border-t border-red-100">
                        <td className="px-3 py-1.5 font-mono">{row.dni || "-"}</td>
                        <td className="px-3 py-1.5">{row.name || "-"}</td>
                        <td className="px-3 py-1.5">{row.currentEnterprise || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {syncMessage && (
            <p role="status" className="rounded-md border border-green-300 bg-green-50 p-3 text-sm font-medium text-green-800">
              {syncMessage}
            </p>
          )}
          {previewData && previewData.validCount > 0 && (
            <button
              type="button"
              onClick={confirmSync}
              disabled={syncing || busy}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {syncing && <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
              {syncing ? "Sincronizando..." : `Continuar y crear ${previewData.validCount} usuarios`}
            </button>
          )}
          {preview && <div className="space-y-2 rounded-lg border border-blue-200 bg-blue-50 p-4" aria-live="polite">
            <h3 className="font-semibold text-gray-900">Resumen de sincronizacion</h3>
            <p className="text-sm text-gray-700">Usuarios nuevos a crear: <strong>{preview.creados}</strong></p>
            <p className="text-sm text-gray-700">Usuarios existentes (se mantienen activos y se actualiza su supervisor): <strong>{preview.actualizados}</strong></p>
            <p className="text-sm text-gray-700">Usuarios inactivos a reactivar: <strong>{preview.reactivados}</strong></p>
            <p className="text-sm text-gray-700">Usuarios a desactivar (no vienen en el Excel): <strong>{preview.desactivados}</strong></p>
            {preview.advertenciaSeguridad && <p role="status" className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm font-medium text-amber-900">{preview.advertenciaSeguridad}</p>}
            {preview.advertenciaCampana && <p role="status" className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm font-medium text-amber-900">{preview.advertenciaCampana}</p>}
            {isSupervisor && <p className="border-t border-blue-200 pt-2 text-xs text-blue-900">Solo afecta a la empresa de tu sesión (22). La confirmación vuelve a validar el candado del 80% dentro de una transacción.</p>}
          </div>}
          </div>
          <div className="flex shrink-0 flex-wrap justify-end gap-2 border-t border-gray-200 bg-white pt-3">
            <button type="button" disabled={busy || syncing || !file || !selectedEnterprise} onClick={submitPreview} className="rounded-md bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50">{busy ? "Calculando..." : "Generar Preview"}</button>
            {onClose && !busy && !syncing && <button type="button" onClick={onClose} className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700">Cancelar</button>}
          </div>
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
