import React, { useState } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import { useCourseStudent } from "../../hooks/useCourseStudents";
import { useNotas } from "../../hooks/resultado/useNotasUserId";
import type {
  ModuleResult,
  ModuleResultDetails,
  CourseResult,
} from "../../interfaces/Nota";

const NotasIndex = () => {
  const { courseStudent, isLoading: loadingCourses } = useCourseStudent();
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const { courseNota, isLoading, error } = useNotas(selectedCourseId ?? 0);

  const userNota = courseNota?.[0] ?? null;
  const hasNotas =
    userNota &&
    (userNota.ModuleResults?.length > 0 || userNota.CourseResults?.length > 0);

  if (loadingCourses) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-student-bg-start via-student-bg-mid to-student-bg-end">
        <p className="text-white">Cargando cursos...</p>
      </div>
    );
  }

  if (courseStudent.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-student-bg-start via-student-bg-mid to-student-bg-end">
        <p className="text-white">No tienes cursos asignados.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-student-bg-start via-student-bg-mid to-student-bg-end px-4 py-10 sm:px-8 sm:py-14">
      <div className="w-full max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-white">Mis Notas</h1>
        <div>
          <label
            htmlFor="course-select"
            className="block text-sm font-medium text-white mb-1.5"
          >
            Curso
          </label>
          <select
            id="course-select"
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            value={selectedCourseId ?? ""}
            onChange={(e) =>
              setSelectedCourseId(
                e.target.value ? Number(e.target.value) : null,
              )
            }
          >
            <option value="">Selecciona un curso</option>
            {courseStudent.map((item) => (
              <option key={item.Course.course_id} value={item.Course.course_id}>
                {item.Course.name}
              </option>
            ))}
          </select>
        </div>

        {!selectedCourseId ? (
          <div className="bg-white rounded-xl p-10 text-center text-gray-400 shadow">
            Selecciona un curso para ver tus notas.
          </div>
        ) : isLoading ? (
          <div className="bg-white rounded-xl p-10 text-center text-gray-500 shadow">
            Cargando notas...
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl p-10 text-center text-red-500 shadow">
            {error}
          </div>
        ) : !hasNotas ? (
          <div className="bg-white rounded-xl p-10 text-center text-gray-400 shadow">
            Sin notas disponibles para este curso.
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            {userNota.ModuleResults?.length > 0 && (
              <div>
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="text-base font-semibold text-gray-700">
                    Módulos
                  </h2>
                </div>

                <table className="hidden sm:table w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Módulo
                      </th>
                      <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Puntaje
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {userNota.ModuleResults.map((mod: ModuleResult) =>
                      mod.results.map(
                        (result: ModuleResultDetails, i: number) => (
                          <tr
                            key={`${mod.module_id}-${i}`}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-3 text-gray-800">
                              {mod.module_name}
                            </td>
                            <td className="px-6 py-3 text-right font-medium text-gray-900">
                              {result.puntaje}
                            </td>
                          </tr>
                        ),
                      ),
                    )}
                  </tbody>
                </table>

                <ul className="sm:hidden divide-y divide-gray-100">
                  {userNota.ModuleResults.map((mod: ModuleResult) =>
                    mod.results.map(
                      (result: ModuleResultDetails, i: number) => (
                        <li
                          key={`${mod.module_id}-${i}`}
                          className="px-4 py-3 flex justify-between items-center"
                        >
                          <span className="text-sm text-gray-700">
                            {mod.module_name}
                          </span>
                          <span className="text-sm font-semibold text-gray-900">
                            {result.puntaje}
                          </span>
                        </li>
                      ),
                    ),
                  )}
                </ul>
              </div>
            )}

            {userNota.CourseResults?.length > 0 && (
              <div className="border-t-2 border-indigo-100 bg-indigo-50">
                {userNota.CourseResults.map((courseResult: CourseResult) => (
                  <div
                    key={courseResult.course_result_id}
                    className="px-6 py-4 flex justify-between items-center"
                  >
                    <span className="font-semibold text-indigo-800">
                      Nota Final
                    </span>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-indigo-700">
                        {courseResult.puntaje}
                      </span>
                      <span className="block text-xs text-indigo-400 mt-0.5">
                        {new Date(courseResult.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

NotasIndex.getLayout = (page: React.ReactNode) => (
  <AppLayout noPadding>{page}</AppLayout>
);

export default NotasIndex;
