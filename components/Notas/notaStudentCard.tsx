import React from 'react';
import { FiCalendar, FiClock, FiUsers } from 'react-icons/fi';

interface NotasViewProps {
  students: any[];
  statusStyles: Record<string, string>;
  formatDate: (dateString: string) => string;
}

export const StudentCardsView: React.FC<NotasViewProps> = ({
  students,
  statusStyles,
  formatDate,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
    {students?.map((user: any, userIndex: number) => {
      const finalGrade = Math.max(
        user.CourseResults?.[0]?.puntaje || 0,
        user.CourseResults?.[1]?.puntaje || 0
      );
      const status =
        user.CourseResults?.length > 0 ? getStatus(finalGrade) : 'En Proceso';

      return (
        <div
          key={userIndex}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer transform hover:-translate-y-1"
        >
          <div className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {user?.userProfile?.first_name} {user?.userProfile?.last_name}
                </h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full border ${statusStyles[status]}`}
                >
                  {status}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-700">
                {finalGrade || '-'}
              </div>
            </div>

            <ProgressBar
              progress={user.CourseStudents?.[0]?.progress}
              status={status}
            />

            <div className="space-y-3">
              {user.ModuleResults?.map((module: any, moduleIndex: number) => (
                <ModuleResultItem key={moduleIndex} module={module} />
              ))}
            </div>

            <CourseDates
              startDate={user.CourseStudents?.[0]?.created_at}
              endDate={user.CourseStudents?.[0]?.finished_date}
            />
          </div>
        </div>
      );
    })}
  </div>
);

export const StudentTableView: React.FC<NotasViewProps> = ({
  students,
  statusStyles,
  formatDate,
}) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <TableHeader>Estudiantes</TableHeader>
          {students?.[0]?.ModuleResults?.map((module: any, index: number) => (
            <TableHeader key={`module-${index}`}>
              {module?.module_name || 'Módulo'}
            </TableHeader>
          ))}
          <TableHeader>Nota Final</TableHeader>
          <TableHeader>Estado</TableHeader>
          <TableHeader icon={<FiCalendar className="inline mr-1" />}>
            Inicio
          </TableHeader>
          <TableHeader icon={<FiCalendar className="inline mr-1" />}>
            Fin
          </TableHeader>
          <TableHeader icon={<FiClock className="inline mr-1" />}>
            Sesiones
          </TableHeader>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {students?.map((user: any, userIndex: number) => (
          <TableRow
            key={userIndex}
            user={user}
            statusStyles={statusStyles}
            formatDate={formatDate}
            moduleResults={students?.[0]?.ModuleResults}
          />
        ))}
      </tbody>
    </table>
  </div>
);

// Helper components for the views
const ProgressBar = ({
  progress,
  status,
}: {
  progress: number;
  status: string;
}) => (
  <div className="mb-4">
    <div className="flex justify-between text-sm text-gray-600 mb-1">
      <span>Progreso</span>
      <span>{progress} %</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className={`h-2 rounded-full ${
          status === 'Notable'
            ? 'bg-emerald-500'
            : status === 'Aprobado'
            ? 'bg-blue-500'
            : status === 'Refuerzo'
            ? 'bg-amber-500'
            : 'bg-rose-500'
        }`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  </div>
);

const ModuleResultItem = ({ module }: { module: any }) => {
  const highestScore = Math.max(
    ...module.results.map((result: any) => result.puntaje)
  );
  return (
    <div className="flex justify-between items-center">
      <span
        className="text-sm text-gray-600 truncate"
        title={module.module_name}
      >
        {module.module_name}
      </span>
      <span className="text-sm font-medium text-gray-800">
        {highestScore || '-'}
      </span>
    </div>
  );
};

const CourseDates = ({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) => (
  <div className="flex justify-between mt-4 text-sm text-gray-500">
    <DateItem
      date={startDate}
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      }
    />
    <DateItem
      date={endDate}
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      }
      isEndDate
    />
  </div>
);

const DateItem = ({
  date,
  icon,
  isEndDate = false,
}: {
  date: string;
  icon: React.ReactNode;
  isEndDate?: boolean;
}) => (
  <div className="flex items-center">
    {icon}
    {date
      ? new Date(date).toLocaleDateString('es-ES')
      : isEndDate
      ? 'En progreso'
      : '-'}
  </div>
);

const TableHeader = ({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
}) => (
  <th
    scope="col"
    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
  >
    {icon}
    {icon ? children : children}
  </th>
);

const TableRow = ({
  user,
  statusStyles,
  formatDate,
  moduleResults,
}: {
  user: any;
  statusStyles: Record<string, string>;
  formatDate: (date: string) => string;
  moduleResults: any[];
}) => {
  const finalGrade = Math.max(
    user.CourseResults?.[0]?.puntaje || 0,
    user.CourseResults?.[1]?.puntaje || 0
  );
  const status =
    user.CourseResults?.length > 0 ? getStatus(finalGrade) : 'En Proceso';

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
            <FiUsers className="h-5 w-5" />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {user?.userProfile?.first_name || '-'}{' '}
              {user?.userProfile?.last_name || '-'}
            </div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      </td>

      {moduleResults?.map((module: any, moduleIndex: number) => {
        const moduleResult = user.ModuleResults?.find(
          (mod: any) => mod.module_name === module.module_name
        );
        const highestScore = moduleResult
          ? Math.max(
              ...moduleResult.results.map((result: any) => result.puntaje)
            )
          : '-';
        return (
          <td
            key={`module-${moduleIndex}`}
            className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
          >
            {highestScore}
          </td>
        );
      })}

      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {finalGrade || '-'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[status]}`}
        >
          {status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(user.CourseStudents?.[0]?.created_at)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {user.CourseStudents?.[0]?.finished_date
          ? formatDate(user.CourseStudents[0].finished_date)
          : 'En progreso'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {Math.floor(Math.random() * 5) + 1}
      </td>
    </tr>
  );
};

// Reuse the same getStatus function
const getStatus = (finalExamGrade: number) => {
  if (finalExamGrade >= 18) return 'Notable';
  if (finalExamGrade >= 16) return 'Aprobado';
  if (finalExamGrade >= 13) return 'Refuerzo';
  return 'Desaprobado';
};
