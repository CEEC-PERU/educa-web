import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/Corporate/CorporateSideBar';
import useDownloadNotas from '../../../hooks/notas/useDownloadNotas';
import { useClassroom } from '../../../hooks/useClassroom';
import { useNotas, useNotasClassroom } from '../../../hooks/resultado/useNotas';
import { StatCard } from '../../../components/StatCard';
import {
  StudentCardsView,
  StudentTableView,
} from '../../../components/Notas/notaStudentCard';
import { UserNota } from '../../../interfaces/Nota';
import Loader from '../../../components/Loader';
import { useRouter } from 'next/router';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import {
  FiDownload,
  FiUsers,
  FiAward,
  FiCheckCircle,
  FiXCircle,
  FiBarChart2,
  FiClock,
  FiGrid,
  FiList,
} from 'react-icons/fi';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

// Status constants for better maintainability
const STATUS_STYLES = {
  Notable: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Aprobado: 'bg-blue-100 text-blue-800 border-blue-200',
  Refuerzo: 'bg-amber-100 text-amber-800 border-amber-200',
  Desaprobado: 'bg-rose-100 text-rose-800 border-rose-200',
  'En Proceso': 'bg-gray-100 text-gray-800 border-gray-200',
};

const STATUS_THRESHOLDS = {
  Notable: 18,
  Aprobado: 16,
  Refuerzo: 13,
};

// Helper functions
const getStatus = (finalExamGrade: number) => {
  if (finalExamGrade >= STATUS_THRESHOLDS.Notable) return 'Notable';
  if (finalExamGrade >= STATUS_THRESHOLDS.Aprobado) return 'Aprobado';
  if (finalExamGrade >= STATUS_THRESHOLDS.Refuerzo) return 'Refuerzo';
  return 'Desaprobado';
};

const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

// Main component
const NotaCourses: React.FC = () => {
  const router = useRouter();
  const { course_id } = router.query;
  const { classrooms } = useClassroom();

  // State management
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [selectedClassroom, setSelectedClassroom] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Derived state
  const courseIdNumber = Array.isArray(course_id)
    ? parseInt(course_id[0])
    : parseInt(course_id || '');
  const classroomId = Number(selectedClassroom);

  // Data hooks
  const { courseNota, isLoading } = useNotas(courseIdNumber);
  const { courseNotaClassroom, fetchCourseDetail } = useNotasClassroom(
    courseIdNumber,
    classroomId
  );
  const { downloadNotas } = useDownloadNotas();

  // Current data based on classroom selection
  const currentCourseData = selectedClassroom
    ? courseNotaClassroom
    : courseNota;

  // Status count calculation
  const [statusCount, setStatusCount] = useState({
    notable: 0,
    aprobado: 0,
    refuerzo: 0,
    desaprobado: 0,
  });

  // Filter students based on search term
  const filteredStudents = currentCourseData?.filter((user: any) => {
    const fullName = `${user?.userProfile?.first_name || ''} ${
      user?.userProfile?.last_name || ''
    }`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  // Calculate status counts when data changes
  useEffect(() => {
    if (currentCourseData && currentCourseData.length > 0) {
      const counts = { notable: 0, aprobado: 0, refuerzo: 0, desaprobado: 0 };

      currentCourseData.forEach((user) => {
        const examGrade = user.CourseResults?.[0]?.puntaje;
        if (examGrade === null || examGrade === undefined) return;

        const status = getStatus(examGrade);
        if (status === 'Notable') counts.notable++;
        else if (status === 'Aprobado') counts.aprobado++;
        else if (status === 'Refuerzo') counts.refuerzo++;
        else if (status === 'Desaprobado') counts.desaprobado++;
      });

      setStatusCount(counts);
    }
  }, [currentCourseData]);

  const handleClassroomChange = async (value: string) => {
    setSelectedClassroom(value);
    await fetchCourseDetail(Number(value));
  };

  // Chart data
  const performanceChartData = {
    options: {
      chart: { id: 'performance-chart', toolbar: { show: false } },
      xaxis: {
        categories: ['Notables', 'Aprobados', 'Refuerzos', 'Desaprobados'],
        labels: { style: { colors: '#6b7280' } },
      },
      yaxis: { labels: { style: { colors: '#6b7280' } } },
      colors: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'],
      plotOptions: { bar: { distributed: true, borderRadius: 4 } },
    },
    series: [
      {
        name: 'Estudiantes',
        data: [
          statusCount.notable,
          statusCount.aprobado,
          statusCount.refuerzo,
          statusCount.desaprobado,
        ],
      },
    ],
  };

  return (
    <ProtectedRoute>
      <div className="relative min-h-screen flex flex-col bg-gray-50">
        <Navbar bgColor="bg-gradient-to-r from-blue-600 to-indigo-700" />
        <div className="flex flex-1 pt-16">
          <Sidebar showSidebar={true} setShowSidebar={() => {}} />
          <main className="p-4 md:p-6 flex-grow transition-all duration-300 ease-in-out ml-20">
            <div className="max-w-7xl mx-auto">
              {/* Header Section */}
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  Reporte de Notas
                </h1>
                <p className="text-gray-600">
                  Análisis detallado del rendimiento académico
                </p>
              </div>

              {/* Filters and Controls */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <SearchInput
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />

                  <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                    <ClassroomSelect
                      classrooms={classrooms}
                      value={selectedClassroom}
                      onChange={handleClassroomChange}
                    />

                    <ViewModeToggle
                      viewMode={viewMode}
                      onViewModeChange={setViewMode}
                    />

                    <DownloadButton
                      onClick={() => downloadNotas(courseIdNumber)}
                      loading={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Stats Summary */}
              <StatsSummary
                totalStudents={filteredStudents?.length || 0}
                statusCount={statusCount}
              />

              {/* Main Content */}
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader />
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Students View */}
                  {viewMode === 'cards' ? (
                    <StudentCardsView
                      students={filteredStudents}
                      statusStyles={STATUS_STYLES}
                      formatDate={formatDate}
                    />
                  ) : (
                    <StudentTableView
                      students={filteredStudents}
                      statusStyles={STATUS_STYLES}
                      formatDate={formatDate}
                    />
                  )}

                  {/* Charts Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ChartCard
                      title="Rendimiento Académico"
                      icon={<FiBarChart2 className="mr-2 text-blue-500" />}
                    >
                      <Chart
                        type="bar"
                        options={performanceChartData.options}
                        series={performanceChartData.series}
                        height={300}
                      />
                    </ChartCard>

                    <SessionsChart students={filteredStudents} />
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

// Subcomponents for better organization
const SearchInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="flex items-center space-x-2">
    <div className="relative flex-1 md:w-64">
      <input
        type="text"
        placeholder="Buscar estudiante..."
        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        value={value}
        onChange={onChange}
      />
      <div className="absolute left-3 top-2.5 text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>
  </div>
);

const ClassroomSelect = ({
  classrooms,
  value,
  onChange,
}: {
  classrooms: any[];
  value: string;
  onChange: (value: string) => void;
}) => (
  <select
    id="classroom_id"
    value={value || ''}
    onChange={(e) => onChange(e.target.value)}
    className="form-select border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  >
    <option value="" disabled>
      Seleccione un aula
    </option>
    {classrooms.map((classroom) => (
      <option
        key={classroom.shift_id}
        value={classroom.classroom_id.toString()}
      >
        {`${classroom.code} - ${classroom.Shift.name}`}
      </option>
    ))}
  </select>
);

const ViewModeToggle = ({
  viewMode,
  onViewModeChange,
}: {
  viewMode: 'cards' | 'table';
  onViewModeChange: (mode: 'cards' | 'table') => void;
}) => (
  <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
    <button
      onClick={() => onViewModeChange('cards')}
      className={`px-3 py-1 rounded-md flex items-center space-x-1 ${
        viewMode === 'cards'
          ? 'bg-white shadow text-blue-600'
          : 'text-gray-600 hover:text-gray-800'
      }`}
    >
      <FiGrid className="h-4 w-4" />
      <span>Tarjetas</span>
    </button>
    <button
      onClick={() => onViewModeChange('table')}
      className={`px-3 py-1 rounded-md flex items-center space-x-1 ${
        viewMode === 'table'
          ? 'bg-white shadow text-blue-600'
          : 'text-gray-600 hover:text-gray-800'
      }`}
    >
      <FiList className="h-4 w-4" />
      <span>Tabla</span>
    </button>
  </div>
);

const DownloadButton = ({
  onClick,
  loading,
}: {
  onClick: () => void;
  loading: boolean;
}) => (
  <button
    onClick={onClick}
    disabled={loading}
    className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-70"
  >
    <FiDownload className="h-4 w-4" />
    <span>Exportar Reporte</span>
  </button>
);

const StatsSummary = ({
  totalStudents,
  statusCount,
}: {
  totalStudents: number;
  statusCount: {
    notable: number;
    aprobado: number;
    refuerzo: number;
    desaprobado: number;
  };
}) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
    <StatCard
      title="Total Estudiantes"
      value={totalStudents}
      icon={<FiUsers className="h-5 w-5" />}
      bgColor="bg-blue-100"
      textColor="text-blue-600"
    />
    <StatCard
      title="Aprobados"
      value={statusCount.aprobado + statusCount.notable}
      icon={<FiCheckCircle className="h-5 w-5" />}
      bgColor="bg-blue-100"
      textColor="text-blue-600"
    />
    <StatCard
      title="Aprobados Notables "
      value={statusCount.notable}
      icon={<FiAward className="h-5 w-5" />}
      bgColor="bg-emerald-100"
      textColor="text-emerald-600"
    />
    <StatCard
      title="Aprobados < 16"
      value={statusCount.aprobado}
      icon={<FiCheckCircle className="h-5 w-5" />}
      bgColor="bg-blue-100"
      textColor="text-blue-600"
    />
    <StatCard
      title="Desaprobados"
      value={statusCount.desaprobado}
      icon={<FiXCircle className="h-5 w-5" />}
      bgColor="bg-rose-100"
      textColor="text-rose-600"
    />
  </div>
);

const ChartCard = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
    <h3 className="text-lg font-semibold mb-4 flex items-center">
      {icon}
      {title}
    </h3>
    {children}
  </div>
);

const SessionsChart = ({ students }: { students: any[] }) => {
  const [randomSessions, setRandomSessions] = useState<number[]>([]);

  useEffect(() => {
    if (students && students.length > 0) {
      const sessions = students.map(() => Math.floor(Math.random() * 5) + 1);
      setRandomSessions(sessions);
    }
  }, [students]);

  return <p> </p>;
};

export default NotaCourses;
