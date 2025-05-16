import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic'; // Import dynamic from next/dynamic
import Navbar from '../../components/Navbar';
import ChartCard from '../../components/dashboard/ChartCard';
import Sidebar from '../../components/Corporate/CorporateSideBar';
import { useAuth } from '../../context/AuthContext';
import './../../app/globals.css';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';
import { useMetricaCorporate } from '../../hooks/dashboard/useMetricaCorporate';
import { useCourseStudent } from '../../hooks/useCourseStudents';
import { useCourseProgress } from '../../hooks/useProgressCurso';

import {
  useTop,
  useAverageTime,
  useAUserActive,
  useNPS,
  useSatisfaccion,
} from '../../hooks/dashboard/useDashboardCorporative';

// Dynamically import Chart with no SSR
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const CorporateDashboard: React.FC = () => {
  const { logout, user, profileInfo } = useAuth();
  const { donutChartData, isLoading } = useMetricaCorporate();
  const enterpriseId = user
    ? (user as { id: number; role: number; dni: string; enterprise_id: number })
        .enterprise_id
    : null;
  // const [selectedCourse, setSelectedCourse] = useState('CP Pospago');
  const { courseStudent } = useCourseStudent();

  const [selectedCourse, setSelectedCourse] = useState<number | undefined>(
    undefined
  );
  const { courseProgressData, loading, error } =
    useCourseProgress(selectedCourse);
  const { topRanking } = useTop(selectedCourse);
  const { averagetime } = useAverageTime();
  const { activeuser } = useAUserActive();
  const { npsData } = useNPS(1, selectedCourse);
  const { satisData } = useSatisfaccion(2, selectedCourse);
  console.log(selectedCourse);

  // Datos de ejemplo
  // const courseProgressData = [
  //   { course: 'CP Pospago', Estudiantes: 4, Progreso: 80 },
  //  { course: 'Formación Continua', Estudiantes: 2, Progreso: 40 },
  //];

  const courseTimeData = [
    { course: 'Contctados', Tiempo: 10 },
    { course: 'Consulta Previa Prepago', Tiempo: 40 },
  ];

  //averageTimeData
  const averageTimePerDayData = [
    { day: 'Lunes', time: 46 },
    { day: 'Martes', time: 20 },
    { day: 'Miércoles', time: 35 },
    { day: 'Jueves', time: 30 },
    { day: 'Viernes', time: 25 },
    { day: 'Sábado', time: 27 },
    { day: 'Domingo', time: 36 },
  ];

  //Curso completados al 100%
  const courseCompletionData = [
    { course: 'Contactados', completion: 0 },
    { course: 'Consulta Previa Prepago', completion: 24 },
  ];

  //Participantes en la semana
  const dailyParticipationData = [
    { day: 'Lunes', active: 2 },
    { day: 'Martes', active: 4 },
    { day: 'Miércoles', active: 2 },
    { day: 'Jueves', active: 3 },
    { day: 'Viernes', active: 2 },
    { day: 'Sabado', active: 1 },
    { day: 'Domingo', active: 0 },
  ];

  //Lista de modulos por curso
  const moduleCompletionData = (course: string) => {
    if (course === 'CP Pospago') {
      return [
        { module: 'Formación Integral ', completion: 50 },
        { module: 'Gestión Integral ', completion: 40 },
        { module: 'Gestión De Contacto ', completion: 35 },
      ];
    } else if (course === 'Formación Continua') {
      return [{ module: 'Retenciones 1', completion: 85 }];
    }
    return [];
  };

  const satisfactionSurveyData = (course: string) => {
    if (course === 'CP Pospago') {
      return [0, 0, 0, 1, 0, 33]; // Valores en porcentaje para cada estrella
    } else if (course === 'Formación Continua') {
      return [0, 0, 0, 1, 0, 33];
    }
    return [];
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar
        bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90"
        borderColor="border border-stone-300"
      />
      <div className="flex flex-1 pt-16 ">
        <Sidebar showSidebar={true} setShowSidebar={() => {}} />
        <main className="p-6 flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pl-20">
          {/* Dropdown Selector for Courses */}
          <div className="mr-2 col-span-full">
            {/*<select 
    value={selectedCourse} 
    onChange={(e) => setSelectedCourse(e.target.value)} 
    className="block border-4 p-2 mr-4"
  >
    {courseStudent.length > 0 ? (
      courseStudent.map((course) => (
        <option key={course.course_id} value={course.Course.name} className="text-gray-700">
          {course.Course.name}
        </option>
      ))
    ) : (
      <option disabled className="text-gray-600">No hay cursos asignados</option>
    )}
  </select>*/}

            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(Number(e.target.value))}
              className="block border-4 p-2 mr-4"
            >
              {courseStudent.length > 0 ? (
                courseStudent.map((course) => (
                  <option
                    key={course.course_id}
                    value={course.course_id}
                    className="text-gray-700"
                  >
                    {course.Course.name}
                  </option>
                ))
              ) : (
                <option disabled className="text-gray-600">
                  No hay cursos asignados
                </option>
              )}
            </select>
          </div>

          {/* Gráfico de Barras de Progreso */}
          <div className="chart-container border border-gray-300 p-4 rounded-lg bg-white shadow-md">
            <h2 className="text-lg font-semibold mb-2">Progreso del curso</h2>

            <Chart
              type="bar"
              series={[
                {
                  name: 'Estudiantes',
                  data: courseProgressData.map((item) => item.Estudiantes),
                },
                {
                  name: 'Progreso',
                  data: courseProgressData.map((item) => item.Progreso),
                },
              ]}
              options={{
                chart: { type: 'bar' },
                xaxis: {
                  categories: courseProgressData.map((item) => item.course),
                  title: { text: 'Cursos' },
                },
                yaxis: { title: { text: 'Cantidad' } },
                colors: ['#3274C1', '#BCB623'],
                dataLabels: { enabled: true },
                legend: { position: 'top' },
              }}
              height={300}
            />
          </div>

          {/* Gráfico de Tiempo promedio por curso (minutos) */}
          <div className="chart-container border border-gray-300 p-4 rounded-lg bg-white shadow-md">
            <h2 className="text-lg font-semibold mb-2">
              Tiempo Promedio por Curso
            </h2>
            <Chart
              type="bar"
              series={[
                {
                  name: 'Tiempo',
                  data: courseTimeData.map((item) => item.Tiempo),
                },
              ]}
              options={{
                chart: { type: 'bar' },
                xaxis: {
                  categories: courseTimeData.map((item) => item.course),
                  title: { text: 'Cursos' },
                },
                yaxis: { title: { text: 'Tiempo(minutos)' } },
                colors: ['#3274C1'],
                dataLabels: { enabled: true },
                legend: { position: 'top' },
              }}
              height={300}
            />
          </div>

          {/* Calificaciones de Asesores */}
          {/* Top 5 de Asesores - Versión Mejorada */}
          <ChartCard
            title="Top 5 de Asesores"
            type="bar"
            series={[
              {
                name: 'Puntaje',
                data: topRanking.map((item) => item.puntaje),
              },
            ]}
            options={{
              plotOptions: {
                bar: {
                  borderRadius: 6,
                  columnWidth: '60%',
                },
              },
              xaxis: {
                categories: topRanking.map((item) => item.name),
                labels: {
                  formatter: (value) =>
                    value.length > 15 ? `${value.substring(0, 15)}...` : value,
                },
              },
              yaxis: {
                max: 20,
                min: 0,
                tickAmount: 5,
              },
            }}
            badgeText="Puntaje "
          />

          {/* Gráfico de Tiempo promedio por día */}
          <div className="chart-container border border-gray-300 p-4 rounded-lg bg-white shadow-md">
            <h2 className="text-lg font-semibold mb-2">
              Tiempo promedio por día en la plataforma
            </h2>
            <Chart
              type="line"
              series={[
                { name: 'Tiempo', data: averagetime.map((item) => item.time) },
              ]} // Assuming `averagetime` has objects with `time` property
              options={{
                chart: { type: 'line' },
                xaxis: {
                  categories: averagetime.map((item) => item.day),
                  title: { text: 'Días' },
                },
                yaxis: { title: { text: 'Tiempo (minutos)' } },
                colors: ['#1D4ED8'], // Set a line color
                stroke: { curve: 'smooth' },
                dataLabels: { enabled: true },
                legend: { position: 'top' },
              }}
              height={300}
            />
          </div>

          {/* Gráfico de Participación Diaria */}
          <div className="chart-container border border-gray-300 p-4 rounded-lg bg-white shadow-md">
            <h2 className="text-lg font-semibold mb-2">
              Participación Diaria (estudiantes activos)
            </h2>
            <Chart
              type="line"
              series={[
                {
                  name: 'Cantidad',
                  data: activeuser.map((item) => item.active),
                },
              ]}
              options={{
                chart: { type: 'line' },
                xaxis: {
                  categories: activeuser.map((item) => item.day),
                  title: { text: 'Día' },
                },
                yaxis: { title: { text: 'Cantidad Estudiantes' } },
                colors: ['#33b2df'],
                stroke: { curve: 'smooth' },
                dataLabels: { enabled: true },
              }}
              height={300}
            />
          </div>

          {/* Tasa de Finalización de Cursos */}
          <div className="chart-container border border-gray-300 p-4 rounded-lg bg-white shadow-md">
            <h2 className="text-lg font-semibold mb-2">
              Tasa de Finalización de Cursos
            </h2>

            <Chart
              type="bar"
              series={[
                {
                  name: 'Finalización',
                  data: courseCompletionData.map((item) => item.completion),
                },
              ]}
              options={{
                chart: { type: 'bar' },
                yaxis: { title: { text: 'Finalizaciòn (%)' } },
                xaxis: {
                  categories: courseCompletionData.map((item) => item.course),
                  title: { text: 'Curso' },
                },
                colors: ['#3274C1'],
                dataLabels: { enabled: true },
              }}
              height={300}
            />
          </div>

          {/* Gráfico de Compleción de Módulos */}
          <div className="chart-container border border-gray-300 p-4 rounded-lg bg-white shadow-md">
            <h2 className="text-lg font-semibold mb-2">
              Compleción de Módulos
            </h2>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(Number(e.target.value))}
              className="mt-2 block w-full"
            >
              <option value="CP Pospago">Consulta Previa Prepago</option>
              <option value="Formación Continua">Contactados</option>
            </select>
            <Chart
              type="bar"
              series={[
                {
                  name: 'Compleción',
                  data: moduleCompletionData('CP Pospago').map(
                    (item) => item.completion
                  ),
                },
              ]}
              options={{
                chart: { type: 'bar' },
                yaxis: { title: { text: 'Finalizaciòn (%)' } },
                xaxis: {
                  categories: moduleCompletionData('CP Pospago').map(
                    (item) => item.module
                  ),
                  title: { text: 'Curso' },
                },
                colors: ['#3274C1'],
                dataLabels: { enabled: true },
              }}
              height={300}
            />
          </div>

          {/* Gráfico de Dona Encuesta de Satisfacción */}
          <ChartCard
            title="Encuesta de Satisfacción"
            subtitle="Distribución de votos por calificación"
            type="bar"
            series={[
              {
                name: 'Votos',
                data: satisData, // [0, 0, 6, 4, 7]
              },
            ]}
            options={{
              chart: {
                toolbar: {
                  show: false, // Ocultamos toolbar para simplificar
                },
              },
              plotOptions: {
                bar: {
                  horizontal: true,
                  barHeight: '60%',
                  borderRadius: 4,
                  distributed: true,
                },
              },
              colors: ['#EF4444', '#F59E0B', '#FBBF24', '#10B981', '#3B82F6'],
              dataLabels: {
                enabled: true,
                formatter: (val: number) => (val > 0 ? `${val}` : ''),
                style: {
                  fontSize: '12px',
                  colors: ['#1F2937'],
                },
              },
              xaxis: {
                categories: ['1 ⭐', '2 ⭐', '3 ⭐', '4 ⭐', '5 ⭐'],
                axisBorder: {
                  show: false,
                },
                axisTicks: {
                  show: false,
                },
              },
              yaxis: {
                labels: {
                  style: {
                    fontSize: '14px',
                  },
                },
              },
              tooltip: {
                y: {
                  formatter: (val: number) => `${val} votos`,
                },
              },
              grid: {
                borderColor: '#E5E7EB',
                xaxis: {
                  lines: {
                    show: false,
                  },
                },
              },
            }}
            height={300}
            badgeText={`Total: ${satisData.reduce((a, b) => 2, 0)} votos`}
            showUpdateDate={true}
            className="mt-4"
          />
          {/* CORREGIR 2 , TOTAL DE VOTOS*/}
          {/* Gráfico de NPS */}
          <ChartCard
            title="Del 1 al 10 ¿Qué tanto recomendarías este curso?"
            subtitle="Net Promoter Score (NPS)"
            type="bar"
            series={[{ name: 'Respuestas', data: npsData }]}
            options={{
              plotOptions: {
                bar: {
                  borderRadius: 4,
                  columnWidth: '70%',
                  distributed: true, // Para que cada barra tenga color independiente
                },
              },
              colors: [
                '#EF4444', // 1-6 Rojo (Detractores)
                '#EF4444',
                '#EF4444',
                '#EF4444',
                '#EF4444',
                '#F59E0B', // 7-8 Amarillo (Neutrales)
                '#F59E0B',
                '#10B981', // 9-10 Verde (Promotores)
                '#10B981',
                '#10B981',
              ],
              xaxis: {
                categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
                title: {
                  text: 'Puntuación',
                  style: {
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#4B5563',
                  },
                },
                axisBorder: {
                  show: false,
                },
                axisTicks: {
                  show: false,
                },
              },
              yaxis: {
                title: {
                  text: 'Número de respuestas',
                  style: {
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#4B5563',
                  },
                },
                min: 0,
                forceNiceScale: true,
              },
              tooltip: {
                y: {
                  formatter: (val: number) =>
                    `${val} ${val === 1 ? 'persona' : 'personas'}`,
                },
              },
              dataLabels: {
                formatter: (val: number) => (val > 0 ? val.toString() : ''),
              },
            }}
            badgeText="NPS"
            height={350}
          />
        </main>
      </div>
    </div>
  );
};

export default CorporateDashboard;
