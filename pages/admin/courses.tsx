import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowDownTrayIcon, BookOpenIcon, VideoCameraIcon } from '@heroicons/react/24/outline';
import Navbar from '../../components/Navbar';
import SidebarAdmin from '../../components/Admin/SideBarAdmin';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';
import { useAuth } from '../../context/AuthContext';
import { baseURL } from '../../utils/Endpoints';

type AdminModule = {
  module_id: number;
  name: string;
  videos_de_sesion: number;
  videos_interactivos: number;
  total_videos: number;
};

type AdminCourse = {
  course_id: number;
  name: string;
  courseCategory?: { category_id: number; name: string } | null;
  cantidad_modulos: number;
  courseModules: AdminModule[];
  is_active: boolean;
};

type CourseStatusFilter = 'active' | 'inactive' | 'all';
type CourseOriginFilter = 'all' | 'mentormind' | 'claro';

const MENTORMIND_COURSE_IDS = new Set([
  67, 127, 61, 128, 132, 133, 114, 100, 72, 81, 126, 109, 129, 124, 108,
  122, 64, 107, 79, 116, 55, 117, 60, 89, 121, 83, 82, 137, 86, 76, 70,
  63, 113, 115, 65, 119, 123, 120, 118, 136, 62, 87, 71, 110, 84, 134, 66,
  139, 105, 135, 90, 103, 130, 102, 88, 104, 138, 18, 131, 77, 73,
]);

const AdminCoursesPage: React.FC = () => {
  const { user, token } = useAuth();
  const [showSidebar, setShowSidebar] = useState(true);
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [statusFilter, setStatusFilter] = useState<CourseStatusFilter>('active');
  const [originFilter, setOriginFilter] = useState<CourseOriginFilter>('all');
  const [exporting, setExporting] = useState(false);
  const [updatingCourseId, setUpdatingCourseId] = useState<number | null>(null);
  const isSystemAdmin = typeof user === 'object' && user !== null && Number(user.role) === 4;

  useEffect(() => {
    if (!isSystemAdmin || !token) {
      setLoading(false);
      return;
    }

    let active = true;
    const loadCourses = async () => {
      try {
        const response = await axios.get<AdminCourse[]>(`${baseURL}/api/admin/courses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (active) setCourses(response.data);
      } catch {
        if (active) setError('No se pudo cargar la gestión de cursos.');
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadCourses();
    return () => { active = false; };
  }, [isSystemAdmin, token]);

  const toggleCourseStatus = async (course: AdminCourse) => {
    if (!token || updatingCourseId !== null) return;
    setUpdatingCourseId(course.course_id);
    setActionError('');
    try {
      const is_active = !course.is_active;
      const response = await axios.patch<{ course_id: number; is_active: boolean }>(
        `${baseURL}/api/admin/courses/${course.course_id}/status`,
        { is_active },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setCourses((current) => current.map((item) => (
        item.course_id === course.course_id
          ? { ...item, is_active: response.data.is_active }
          : item
      )));
    } catch {
      setActionError(`No se pudo actualizar el estado de “${course.name}”.`);
    } finally {
      setUpdatingCourseId(null);
    }
  };

  const exportCourses = async () => {
    if (!token || exporting) return;
    setExporting(true);
    setActionError('');
    try {
      const query = new URLSearchParams({ status: statusFilter, origin: originFilter });
      const response = await axios.get(`${baseURL}/api/admin/courses/export?${query.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });
      const fileUrl = URL.createObjectURL(new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      }));
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = 'Reporte_Cursos.xlsx';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(fileUrl), 1000);
    } catch {
      setActionError('No se pudo descargar el reporte de cursos.');
    } finally {
      setExporting(false);
    }
  };

  const visibleCourses = courses.filter((course) => {
    const matchesStatus = statusFilter === 'all'
      || (statusFilter === 'active' && course.is_active === true)
      || (statusFilter === 'inactive' && course.is_active === false);
    const isMentorMind = MENTORMIND_COURSE_IDS.has(course.course_id);
    const matchesOrigin = originFilter === 'all'
      || (originFilter === 'mentormind' && isMentorMind)
      || (originFilter === 'claro' && !isMentorMind);
    return matchesStatus && matchesOrigin;
  });

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-95" />
        <div className="flex min-h-screen pt-16">
          {isSystemAdmin && <SidebarAdmin showSidebar={showSidebar} setShowSidebar={setShowSidebar} />}
          <main className={`min-w-0 flex-1 px-5 py-8 transition-all md:px-8 ${isSystemAdmin && showSidebar ? 'ml-16' : ''}`}>
            <div className="mx-auto max-w-7xl">
              <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="rounded-2xl bg-violet-100 p-3 text-violet-700">
                    <BookOpenIcon className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-600">Administración</p>
                    <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Gestión de Cursos</h1>
                    <p className="mt-1 text-slate-600">Cursos, categorías, módulos y cantidad de videos.</p>
                  </div>
                </div>
                {isSystemAdmin && (
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      Estado:
                      <select
                        value={statusFilter}
                        onChange={(event) => setStatusFilter(event.target.value as CourseStatusFilter)}
                        className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200"
                      >
                        <option value="active">Solo Activos</option>
                        <option value="inactive">Solo Inactivos</option>
                        <option value="all">Todos</option>
                      </select>
                    </label>
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      Origen:
                      <select
                        value={originFilter}
                        onChange={(event) => setOriginFilter(event.target.value as CourseOriginFilter)}
                        className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200"
                      >
                        <option value="all">Todos los orígenes</option>
                        <option value="mentormind">MentorMind General</option>
                        <option value="claro">Claro</option>
                      </select>
                    </label>
                    <button
                      type="button"
                      onClick={exportCourses}
                      disabled={exporting}
                      className="inline-flex items-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-800 disabled:cursor-wait disabled:opacity-60"
                    >
                      <ArrowDownTrayIcon className="h-5 w-5" />
                      {exporting ? 'Exportando...' : 'Exportar a Excel'}
                    </button>
                  </div>
                )}
              </div>

              {isSystemAdmin && actionError && (
                <div role="alert" className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">{actionError}</div>
              )}

              {!isSystemAdmin && (
                <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800">
                  No tienes permisos para acceder a esta sección.
                </div>
              )}
              {isSystemAdmin && error && (
                <div role="alert" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800">{error}</div>
              )}
              {isSystemAdmin && loading && <p className="text-slate-600">Cargando cursos...</p>}
              {isSystemAdmin && !loading && !error && visibleCourses.length === 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
                  {courses.length > 0 ? 'No hay cursos que coincidan con los filtros seleccionados.' : 'No hay cursos para mostrar.'}
                </div>
              )}

              {isSystemAdmin && !loading && visibleCourses.length > 0 && (
                <div className="space-y-4">
                  {visibleCourses.map((course) => (
                    <section key={course.course_id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Curso #{course.course_id}</p>
                          <h2 className="mt-1 text-lg font-semibold text-slate-900">{course.name}</h2>
                          <p className="mt-1 text-sm text-slate-600">Categoría: {course.courseCategory?.name || 'Sin categoría'}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                          <span className="rounded-lg bg-violet-50 px-3 py-2 font-medium text-violet-700">{course.cantidad_modulos} módulos</span>
                          <span className="rounded-lg bg-sky-50 px-3 py-2 font-medium text-sky-700">
                            {course.courseModules.reduce((sum, module) => sum + module.total_videos, 0)} videos
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleCourseStatus(course)}
                            disabled={updatingCourseId !== null}
                            aria-label={`${course.is_active ? 'Desactivar' : 'Activar'} curso ${course.name}`}
                            className={`rounded-lg px-3 py-2 font-semibold transition-colors disabled:cursor-wait disabled:opacity-60 ${course.is_active ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'}`}
                          >
                            {updatingCourseId === course.course_id ? 'Guardando...' : course.is_active ? 'Activo' : 'Inactivo'}
                          </button>
                          <span className={`rounded-full px-3 py-2 text-xs font-bold ${MENTORMIND_COURSE_IDS.has(course.course_id) ? 'bg-violet-100 text-violet-800' : 'bg-slate-700 text-white'}`}>
                            {MENTORMIND_COURSE_IDS.has(course.course_id) ? 'MentorMind' : 'Claro'}
                          </span>
                        </div>
                      </header>
                      {course.courseModules.length > 0 ? (
                        <ul className="divide-y divide-slate-100">
                          {course.courseModules.map((module) => (
                            <li key={module.module_id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                              <div>
                                <p className="font-medium text-slate-800">{module.name}</p>
                                <p className="text-xs text-slate-500">Módulo #{module.module_id}</p>
                              </div>
                              <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-sm text-slate-700">
                                <VideoCameraIcon className="h-4 w-4" /> {module.total_videos} videos
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="px-5 py-4 text-sm text-slate-500">Este curso aún no tiene módulos.</p>
                      )}
                    </section>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminCoursesPage;
