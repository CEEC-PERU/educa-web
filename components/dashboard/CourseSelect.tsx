import { CourseStudent } from "../../interfaces/Courses/CourseStudent";

interface CourseSelectProps {
  courses: CourseStudent[];
  isLoading: boolean;
  error: string | null;
  value: number | undefined;
  onChange: (courseId: number | undefined) => void;
}

const CourseSelect = ({
  courses,
  isLoading,
  error,
  value,
  onChange,
}: CourseSelectProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <select
          value={value ?? ""}
          onChange={(e) => onChange(Number(e.target.value) || undefined)}
          disabled={isLoading || !!error || courses.length === 0}
          className={`
            w-full sm:w-72 appearance-none rounded-lg border px-4 py-2.5 pr-10
            text-sm font-medium shadow-sm transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
            disabled:cursor-not-allowed
            ${error
              ? "border-red-300 bg-red-50 text-red-500"
              : isLoading
              ? "border-gray-200 bg-gray-50 text-gray-400"
              : "border-gray-200 bg-white text-gray-800 hover:border-indigo-300"
            }
          `}
        >
          {isLoading && (
            <option value="">Cargando cursos...</option>
          )}
          {!isLoading && error && (
            <option value="">No se pudieron cargar los cursos</option>
          )}
          {!isLoading && !error && courses.length === 0 && (
            <option value="">Sin cursos asignados</option>
          )}
          {!isLoading && !error && courses.length > 0 && (
            <option value="">Seleccione un curso...</option>
          )}
          {!isLoading &&
            !error &&
            courses.map((course) => (
              <option key={course.course_id} value={course.course_id}>
                {course.Course.name}
              </option>
            ))}
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          {isLoading ? (
            <svg
              className="h-4 w-4 animate-spin text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
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
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : (
            <svg
              className={`h-4 w-4 ${error ? "text-red-400" : "text-gray-400"}`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>

      {!isLoading && error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 w-full sm:w-72">
          <svg
            className="h-4 w-4 shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          No se pudieron cargar los cursos. Intenta recargar la página.
        </div>
      )}
    </div>
  );
};

export default CourseSelect;
