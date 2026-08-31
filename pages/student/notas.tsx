import React, { useState } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import { useCourseStudent } from "../../hooks/useCourseStudents";
import { useAllNotas } from "../../hooks/resultado/useAllNotas";
import CourseCard from "../../components/student/CourseCard";
import type {
  ModuleResult,
  ModuleResultDetails,
  CourseResult,
} from "../../interfaces/Nota";

const NotasIndex = () => {
  const { courseStudent, isLoading: loadingCourses } = useCourseStudent();
  const courseIds = courseStudent.map((item) => item.Course.course_id);
  const { notasByCourse, isLoading: loadingNotas } = useAllNotas(courseIds);
  const [expandedCourseId, setExpandedCourseId] = useState<number | null>(null);

  const isLoading = loadingCourses || loadingNotas;

  const coursesWithNotas = courseStudent.filter((item) => {
    const nota = notasByCourse[item.Course.course_id];
    return (
      nota &&
      ((nota.ModuleResults?.length ?? 0) > 0 ||
        (nota.CourseResults?.length ?? 0) > 0)
    );
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-student-bg-start via-student-bg-mid to-student-bg-end">
        <p className="text-white">Cargando notas...</p>
      </div>
    );
  }

  if (coursesWithNotas.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-student-bg-start via-student-bg-mid to-student-bg-end">
        <p className="text-white">Aún no tienes notas registradas.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-student-bg-start via-student-bg-mid to-student-bg-end px-4 py-10 sm:px-8 sm:py-14">
      <div className="w-full max-w-screen-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-white">Mis Notas</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {coursesWithNotas.map((item) => {
            const courseId = item.Course.course_id;
            const userNota = notasByCourse[courseId];
            const isExpanded = expandedCourseId === courseId;

            return (
              <div key={courseId}>
                <CourseCard
                  course_id={courseId}
                  name={item.Course.name}
                  description={item.Course.description_short}
                  image={item.Course.image}
                  profesor={item.Course.courseProfessor.full_name}
                  categoria={item.Course.courseCategory.name}
                  buttonLabel={isExpanded ? "Ocultar notas" : "Ver notas"}
                  onClick={() =>
                    setExpandedCourseId(isExpanded ? null : courseId)
                  }
                />

                {isExpanded && userNota && (
                  <div className="bg-white rounded-xl shadow overflow-hidden mt-3">
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
                                      {mod.results.length > 1 && (
                                        <span className="ml-2 text-xs font-medium text-gray-400">
                                          (Intento {i + 1})
                                        </span>
                                      )}
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
                                    {mod.results.length > 1 && (
                                      <span className="ml-2 text-xs font-medium text-gray-400">
                                        (Intento {i + 1})
                                      </span>
                                    )}
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
                        {userNota.CourseResults.map(
                          (courseResult: CourseResult) => (
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
                                  {new Date(
                                    courseResult.created_at,
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

NotasIndex.getLayout = (page: React.ReactNode) => (
  <AppLayout noPadding>{page}</AppLayout>
);

export default NotasIndex;
