import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { API_USERS_COURSE_CREATE } from "../../utils/Endpoints";
import * as XLSX from "xlsx";
import { useClassroomBySupervisor } from "../../hooks/useClassroom";
import { useCourseStudent } from "../../hooks/useCourseStudents";
import { toast } from "sonner";

type Mode = "excel" | "manual";

interface UserPayload {
  dni: string;
  password: string;
  is_active: boolean;
  role_id: number;
  enterprise_id: number;
}

interface Props {
  roleId: number;
  onClose: () => void;
  onSuccess: () => void;
  maxUsersAllowed: number;
}

const UserForm: React.FC<Props> = ({
  roleId,
  onClose,
  onSuccess,
  maxUsersAllowed,
}) => {
  const { user, token } = useAuth();
  const userInfo = user as { id: number; enterprise_id: number };

  const { classrooms, isLoading: loadingClassrooms } =
    useClassroomBySupervisor();
  const { courseStudent, isLoading: loadingCourses } = useCourseStudent();
  const [mode, setMode] = useState<Mode>("excel");
  const [excelUsers, setExcelUsers] = useState<UserPayload[]>([]);
  const [manualDni, setManualDni] = useState("");

  const [selectedClassroom, setSelectedClassroom] = useState<number | "">("");
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const [deadline, setDeadline] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleModeChange = (next: Mode) => {
    setMode(next);
    setExcelUsers([]);
    setManualDni("");
    setSelectedClassroom("");
    setSelectedCourses([]);
    setDeadline("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<(string | number | null)[]>(
        worksheet,
        { header: 1 },
      );

      const parsed: UserPayload[] = rows
        .slice(1)
        .filter((row) => row[0] != null && String(row[0]).trim() !== "")
        .map((row) => ({
          dni: String(row[0]),
          password: String(row[0]),
          is_active: true,
          role_id: roleId,
          enterprise_id: userInfo.enterprise_id,
        }));

      if (parsed.length > maxUsersAllowed) {
        toast.error(
          `Excede el límite permitido. Solo puede registrar ${maxUsersAllowed} usuarios.`,
        );
        return;
      }

      setExcelUsers(parsed);
    };
    reader.readAsArrayBuffer(file);
  };

  const toggleCourse = (courseId: number) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId],
    );
  };

  const buildUsers = (): UserPayload[] => {
    if (mode === "excel") return excelUsers;
    return [
      {
        dni: manualDni.trim(),
        password: manualDni.trim(),
        is_active: true,
        role_id: roleId,
        enterprise_id: userInfo.enterprise_id,
      },
    ];
  };

  const validate = (): string | null => {
    if (mode === "excel" && excelUsers.length === 0)
      return "Debe cargar un archivo con usuarios.";
    if (mode === "manual" && !manualDni.trim()) return "Debe ingresar un DNI.";
    if (!selectedClassroom) return "Debe seleccionar un aula.";
    if (selectedCourses.length === 0)
      return "Debe seleccionar al menos un curso.";
    if (!deadline) return "Debe indicar una fecha límite.";
    return null;
  };

  const handleRegister = async () => {
    const validationError = validate();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    const users = buildUsers();
    if (users.length > maxUsersAllowed) {
      toast.error(
        `Excede el límite permitido. Solo puede registrar ${maxUsersAllowed} usuarios.`,
      );
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(API_USERS_COURSE_CREATE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          users,
          course_id: selectedCourses,
          classroom_id: selectedClassroom,
          deadline,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      onSuccess();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Ocurrió un error inesperado.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-h-[70vh] overflow-y-auto pr-1">
      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit">
        {(["excel", "manual"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => handleModeChange(m)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              mode === m
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {m === "excel" ? "Carga masiva (Excel)" : "Registro manual"}
          </button>
        ))}
      </div>

      {mode === "excel" && (
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-gray-700">
            Archivo Excel
            <span className="ml-1 text-xs text-gray-400 font-normal">
              (columna A: DNI)
            </span>
          </label>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {excelUsers.length > 0 && (
            <p className="text-sm text-green-600 font-medium">
              {excelUsers.length} usuario{excelUsers.length !== 1 ? "s" : ""}{" "}
              reconocido{excelUsers.length !== 1 ? "s" : ""}
            </p>
          )}
          {excelUsers.length > 0 && (
            <div className="border border-gray-200 rounded-lg overflow-hidden max-h-40 overflow-y-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      DNI
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {excelUsers.map((u, i) => (
                    <tr key={i}>
                      <td className="px-3 py-2 text-gray-700 font-mono">
                        {u.dni}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {mode === "manual" && (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            DNI del usuario
            <span className="ml-1 text-xs text-gray-400 font-normal">
              (la contraseña inicial será el mismo DNI)
            </span>
          </label>
          <input
            type="text"
            value={manualDni}
            onChange={(e) => setManualDni(e.target.value)}
            placeholder="Ej: 12345678"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Aula</label>
        <select
          value={selectedClassroom}
          onChange={(e) => {
            setSelectedClassroom(Number(e.target.value) || "");
            setSelectedCourses([]);
          }}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="" disabled>
            Seleccione un aula
          </option>
          {loadingClassrooms ? (
            <option disabled>Cargando aulas...</option>
          ) : (
            classrooms.map((c) => (
              <option key={c.classroom_id} value={c.classroom_id}>
                {c.code} — {c.Shift.name} — {c.User.userProfile.first_name}{" "}
                {c.User.userProfile.last_name}
              </option>
            ))
          )}
        </select>
      </div>

      {selectedClassroom !== "" && (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            Cursos
            <span className="ml-1 text-xs text-gray-400 font-normal">
              (selecciona uno o más)
            </span>
          </label>
          {loadingCourses ? (
            <p className="text-sm text-gray-400">Cargando cursos...</p>
          ) : courseStudent.length === 0 ? (
            <p className="text-sm text-gray-400">No hay cursos asignados.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {courseStudent.map((cs) => {
                const selected = selectedCourses.includes(cs.course_id);
                return (
                  <button
                    key={cs.course_id}
                    type="button"
                    onClick={() => toggleCourse(cs.course_id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-colors ${
                      selected
                        ? "border-blue-500 bg-blue-50 text-blue-900"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <img
                      src={cs.Course.image || "/default-course-image.jpg"}
                      alt={cs.Course.name}
                      className="h-9 w-9 rounded-full object-cover shrink-0"
                    />
                    <span className="text-sm font-medium">
                      {cs.Course.name}
                    </span>
                    {selected && (
                      <span className="ml-auto text-blue-500 text-xs font-semibold">
                        Seleccionado
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">
          Fecha límite
        </label>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          onClick={handleRegister}
          disabled={isLoading}
          className="inline-flex items-center px-5 py-2 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-4 w-4 mr-2"
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
              Registrando...
            </>
          ) : (
            "Registrar"
          )}
        </button>
      </div>
    </div>
  );
};

export default UserForm;
