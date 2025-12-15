import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import { useCertificationUser } from "@/hooks/resultado/useCertificationUser";
import Sidebar from "@/components/supervisor/SibebarSupervisor";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";

const CertificationStudents: React.FC = () => {
  const router = useRouter();
  const { certificationId } = router.query;
  const [showSideBar] = useState(true);

  const [certificationInfo, setCertificationInfo] = useState<any>(null);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    getCertificationAssignmentDetails,
    getCertificationStudentsProgress,
    loading: hookLoading,
    error: hookError,
  } = useCertificationUser();

  // Estados para filtros
  const [selectedClassroom, setSelectedClassroom] = useState<number | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Cargar datos
  useEffect(() => {
    const fetchData = async () => {
      if (!certificationId) return;

      try {
        setLoading(true);
        setError(null);

        const id = Number(certificationId);

        // Cargar detalles de la certificación y estudiantes
        const [detailsData, progressData] = await Promise.all([
          getCertificationAssignmentDetails(id),
          getCertificationStudentsProgress(id),
        ]);

        setCertificationInfo(detailsData.data.certification);
        setAssignments(detailsData.data.assignments);
        setStudents(progressData.data.students);
      } catch (err: any) {
        console.error("Error loading data:", err);
        setError(err.message || "Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    certificationId,
    getCertificationAssignmentDetails,
    getCertificationStudentsProgress,
  ]);

  // Filtros
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.classroom_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || student.status === statusFilter;

    const matchesClassroom =
      selectedClassroom === null ||
      assignments.find((a) => a.classroom_id === selectedClassroom)
        ?.classroom_name === student.classroom_name;

    return matchesSearch && matchesStatus && matchesClassroom;
  });

  // Función para badges de estado
  const getStatusBadge = (status: string) => {
    const styles: any = {
      in_progress: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      abandoned: "bg-red-100 text-red-800",
      time_expired: "bg-yellow-100 text-yellow-800",
      not_started: "bg-gray-100 text-gray-800",
    };

    const labels: any = {
      in_progress: "En progreso",
      completed: "Completado",
      abandoned: "Abandonado",
      time_expired: "Tiempo expirado",
      not_started: "No iniciado",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs ${
          styles[status] || "bg-gray-100"
        }`}
      >
        {labels[status] || status}
      </span>
    );
  };

  // Loading state
  if (loading || hookLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
          <div className="flex flex-1 pt-16">
            <Sidebar showSidebar={showSideBar} setShowSidebar={() => {}} />
            <main className="p-6 flex-grow transition-all duration-300 ease-in-out ml-20">
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            </main>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Error state
  if (error || hookError) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
          <div className="flex flex-1 pt-16">
            <Sidebar showSidebar={showSideBar} setShowSidebar={() => {}} />
            <main className="p-6 flex-grow transition-all duration-300 ease-in-out ml-20">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error || hookError}
              </div>
            </main>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
        <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
        <div className="flex flex-1 pt-16">
          <Sidebar showSidebar={showSideBar} setShowSidebar={() => {}} />
          <main className="p-6 flex-grow transition-all duration-300 ease-in-out ml-20">
            {/* Header */}
            <div className="mb-6">
              <button
                onClick={() => router.back()}
                className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
              >
                ← Volver a Certificados
              </button>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-black mb-2">
                    {certificationInfo?.title || "Estudiantes de Certificación"}
                  </h2>
                  <p className="text-gray-600">
                    Total estudiantes: {students.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="text-2xl font-bold text-blue-600">
                  {students.length}
                </div>
                <div className="text-sm text-gray-600">Total Estudiantes</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="text-2xl font-bold text-green-600">
                  {students.filter((s) => s.status === "completed").length}
                </div>
                <div className="text-sm text-gray-600">Completados</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="text-2xl font-bold text-yellow-600">
                  {students.filter((s) => s.status === "in_progress").length}
                </div>
                <div className="text-sm text-gray-600">En Progreso</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="text-2xl font-bold text-purple-600">
                  {students.filter((s) => s.passed).length}
                </div>
                <div className="text-sm text-gray-600">Aprobados</div>
              </div>
            </div>

            {/* Filtros */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Buscar estudiante
                  </label>
                  <input
                    type="text"
                    placeholder="Nombre, email o aula..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Filtrar por aula
                  </label>
                  <select
                    value={selectedClassroom || ""}
                    onChange={(e) =>
                      setSelectedClassroom(
                        e.target.value ? Number(e.target.value) : null
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Todas las aulas</option>
                    {assignments.map((assignment) => (
                      <option
                        key={assignment.classroom_id}
                        value={assignment.classroom_id}
                      >
                        {assignment.classroom_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Filtrar por estado
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="in_progress">En progreso</option>
                    <option value="completed">Completado</option>
                    <option value="abandoned">Abandonado</option>
                    <option value="time_expired">Tiempo expirado</option>
                    <option value="not_started">No iniciado</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tabla de estudiantes */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {filteredStudents.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estudiante
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Aula
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Puntuación
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Porcentaje para aprobar
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Intentos
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tiempo (min)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Último intento
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredStudents.map((student) => (
                        <tr key={student.user_id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {student.full_name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {student.email}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {student.classroom_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(student.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {student.score !== null ? (
                              <span
                                className={`font-bold ${
                                  student.passed
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {student.score}
                                {student.passed
                                  ? " (Aprobado)"
                                  : " (Reprobado)"}
                              </span>
                            ) : (
                              <span className="text-gray-500">N/A</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {certificationInfo?.passing_score || "N/A"}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {student.attempts_count}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {student.time_spent_minutes !== null
                              ? `${student.time_spent_minutes} min`
                              : "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.last_attempt_date
                              ? new Date(
                                  student.last_attempt_date
                                ).toLocaleDateString("es-ES")
                              : "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    {students.length === 0
                      ? "No hay estudiantes registrados para esta certificación."
                      : "No se encontraron estudiantes con los filtros aplicados."}
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default CertificationStudents;
