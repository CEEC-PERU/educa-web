import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CheckCircle2, Clock3 } from 'lucide-react';
import Navbar from '../../components/Navbar';
import SidebarAdmin from '../../components/Admin/SideBarAdmin';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';
import { useAuth } from '../../context/AuthContext';
import { getEnterprises } from '../../services/enterpriseService';
import { Enterprise } from '../../interfaces/Enterprise';
import { API_ADMIN_ENTERPRISE_ANALYTICS } from '../../utils/Endpoints';

type AnalyticsData = {
  enterprise: { enterprise_id: number; name: string };
  totalActiveUsers: number;
  loggedInUsers: number;
  totalSessions: number;
  adoptionRate: number;
  topCourses: Array<{
    course_id: number;
    course_name: string;
    users_with_progress: number;
    completed_users: number;
    overallProgressPercentage: number;
    adoptionPercentage: number;
  }>;
  recentLogins: Array<{ user_name: string; logged_in_at: string }>;
};

const numberFormat = new Intl.NumberFormat('es-PE');

const formatLoginDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'Fecha no disponible'
    : new Intl.DateTimeFormat('es-PE', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(date);
};

const AdminAnalyticsPage: React.FC = () => {
  const { token } = useAuth();
  const [showSidebar, setShowSidebar] = useState(true);
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [selectedEnterprise, setSelectedEnterprise] = useState('');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loadingEnterprises, setLoadingEnterprises] = useState(true);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const loadEnterprises = async () => {
      try {
        const result = await getEnterprises();
        if (!active) return;
        setEnterprises(result);
        if (result.length) setSelectedEnterprise(String(result[0].enterprise_id));
      } catch {
        if (active) setError('No se pudo cargar la lista de empresas.');
      } finally {
        if (active) setLoadingEnterprises(false);
      }
    };
    void loadEnterprises();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!selectedEnterprise || !token) return;
    let active = true;
    const loadAnalytics = async () => {
      setLoadingAnalytics(true);
      setError('');
      setAnalytics(null);
      try {
        const response = await axios.get<AnalyticsData>(
          `${API_ADMIN_ENTERPRISE_ANALYTICS}/${selectedEnterprise}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (active) setAnalytics(response.data);
      } catch (requestError) {
        if (!active) return;
        const message = axios.isAxiosError(requestError)
          ? requestError.response?.data?.message
          : null;
        setError(message || 'No se pudo cargar la analítica de esta empresa.');
      } finally {
        if (active) setLoadingAnalytics(false);
      }
    };
    void loadAnalytics();
    return () => { active = false; };
  }, [selectedEnterprise, token]);

  const metricCards = analytics ? [
    { label: 'Usuarios activos', value: analytics.totalActiveUsers, color: 'text-indigo-700', tint: 'bg-indigo-50' },
    { label: 'Han ingresado', value: analytics.loggedInUsers, color: 'text-emerald-700', tint: 'bg-emerald-50' },
    { label: 'Sesiones Totales', value: analytics.totalSessions, color: 'text-sky-700', tint: 'bg-sky-50' },
  ] : [];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-95" />
        <div className="flex min-h-screen pt-16">
          <SidebarAdmin showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
          <main className={`min-w-0 flex-1 px-5 py-8 transition-all md:px-8 ${showSidebar ? 'ml-16' : ''}`}>
            <div className="mx-auto max-w-7xl">
              <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-600">Administración</p>
                  <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Actividad por empresa</h1>
                  <p className="mt-1 text-slate-600">Ingresos a la plataforma y cursos con mayor matrícula activa.</p>
                </div>
                <div className="w-full sm:max-w-xs">
                  <label htmlFor="analytics-enterprise" className="mb-1.5 block text-sm font-semibold text-slate-700">Empresa</label>
                  <select
                    id="analytics-enterprise"
                    value={selectedEnterprise}
                    onChange={(event) => setSelectedEnterprise(event.target.value)}
                    disabled={loadingEnterprises || enterprises.length === 0}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 shadow-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100 disabled:bg-slate-100"
                  >
                    {loadingEnterprises && <option value="">Cargando empresas...</option>}
                    {!loadingEnterprises && !enterprises.length && <option value="">No hay empresas disponibles</option>}
                    {enterprises.map((enterprise) => (
                      <option key={enterprise.enterprise_id} value={enterprise.enterprise_id}>{enterprise.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {error && <div role="alert" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</div>}

              {loadingAnalytics && (
                <div role="status" className="mb-5 rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">
                  Cargando actividad de la empresa...
                </div>
              )}

              {analytics && !loadingAnalytics && (
                <>
                  <p className="mb-3 text-xs text-slate-500">
                    {Number(analytics.enterprise.enterprise_id) === 2
                      ? 'Mostrando actividad desde el lanzamiento (01/11/2026)'
                      : 'Mostrando historial completo'}
                  </p>
                  <section aria-label="Indicadores principales" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {metricCards.map((metric) => (
                      <article key={metric.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm font-medium text-slate-500">{metric.label}</p>
                        <p className={`mt-3 text-3xl font-bold ${metric.color}`}>{numberFormat.format(metric.value)}</p>
                        {metric.label === 'Han ingresado' && (
                          <p className="mt-1 text-xs text-slate-500">
                            {numberFormat.format(analytics.loggedInUsers)} de {numberFormat.format(analytics.totalActiveUsers)} han ingresado ({analytics.adoptionRate.toLocaleString('es-PE', { maximumFractionDigits: 3 })}%)
                          </p>
                        )}
                      </article>
                    ))}
                    <article className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-600 to-indigo-700 p-5 text-white shadow-sm">
                      <p className="text-sm font-medium text-violet-100">Tasa de ingreso</p>
                      <p className="mt-3 text-3xl font-bold">{analytics.adoptionRate.toLocaleString('es-PE', { maximumFractionDigits: 3 })}%</p>
                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/25" aria-label={`Tasa de ingreso ${analytics.adoptionRate}%`}>
                        <div className="h-full rounded-full bg-white" style={{ width: `${Math.min(100, Math.max(0, analytics.adoptionRate))}%` }} />
                      </div>
                    </article>
                  </section>

                  <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                      <div className="mb-5">
                        <h2 className="text-lg font-bold text-slate-900">Cursos con más actividad</h2>
                        <p className="mt-1 text-sm text-slate-500">Ordenados por alumnos activos con progreso mayor que 0%.</p>
                      </div>
                      {analytics.topCourses.length ? (
                        <div className="space-y-5">
                          {analytics.topCourses.map((course, index) => (
                            <div key={course.course_id}>
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex min-w-0 gap-3">
                                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-sm font-bold text-violet-700">{index + 1}</span>
                                  <div className="min-w-0">
                                    <p className="truncate font-semibold text-slate-800">{course.course_name}</p>
                                  </div>
                                </div>
                                <span className="shrink-0 text-right text-sm font-bold text-slate-700">
                                  {numberFormat.format(course.users_with_progress)} usuarios ingresaron al curso ({course.adoptionPercentage.toLocaleString('es-PE', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}%)
                                </span>
                              </div>
                              <div className="ml-11 mt-2 space-y-1.5 text-xs text-slate-500">
                                <p className="flex items-center gap-1.5">
                                  <Clock3 aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                                  <span>
                                    Avance total de {analytics.enterprise.name}: {course.overallProgressPercentage.toLocaleString('es-PE', { minimumFractionDigits: 3, maximumFractionDigits: 6 })}%
                                    <span className="ml-1 text-slate-400">Calculado sobre los {numberFormat.format(analytics.totalActiveUsers)} usuarios activos.</span>
                                  </span>
                                </p>
                                <p className="flex items-center gap-1.5">
                                  <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                                  {numberFormat.format(course.completed_users)} usuario{course.completed_users === 1 ? '' : 's'} finalizado{course.completed_users === 1 ? '' : 's'}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : <p className="rounded-xl bg-slate-50 p-5 text-sm text-slate-500">No hay matrículas activas para esta empresa.</p>}
                    </article>

                    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                      <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
                        <h2 className="text-lg font-bold text-slate-900">Últimos accesos</h2>
                        <p className="mt-1 text-sm text-slate-500">Los 10 ingresos más recientes de usuarios activos.</p>
                      </div>
                      {analytics.recentLogins.length ? (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                              <tr><th className="px-5 py-3 font-semibold">Usuario</th><th className="px-5 py-3 font-semibold">Fecha y hora</th></tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {analytics.recentLogins.map((login, index) => (
                                <tr key={`${login.logged_in_at}-${index}`}>
                                  <td className="px-5 py-3.5 font-medium text-slate-800">{login.user_name}</td>
                                  <td className="whitespace-nowrap px-5 py-3.5 text-slate-500">{formatLoginDate(login.logged_in_at)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : <p className="m-5 rounded-xl bg-slate-50 p-5 text-sm text-slate-500">Todavía no hay ingresos registrados.</p>}
                    </article>
                  </section>
                </>
              )}
              {!loadingAnalytics && !analytics && !error && selectedEnterprise && (
                <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">Preparando indicadores...</div>
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminAnalyticsPage;
