import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic'; // Import dynamic from next/dynamic
import Navbar from '../../components/Navbar';
import ChartCard from '../../components/dashboard/ChartCard';
import Sidebar from '../../components/comercial/ComercialSidebar';
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
    ? (user as { id: number; role: number; enterprise_id: number })
        .enterprise_id
    : null;
  // const [selectedCourse, setSelectedCourse] = useState('CP Pospago');
  const { courseStudent } = useCourseStudent();

  const [selectedCourse, setSelectedCourse] = useState<number | undefined>(
    undefined
  );
  //const { courseProgressData, loading, error } = useCourseProgress(selectedCourse);
  const { topRanking } = useTop(selectedCourse);
  const { averagetime } = useAverageTime();
  const { activeuser } = useAUserActive();
  //const { npsData } = useNPS(1, selectedCourse);
  const { satisData } = useSatisfaccion(2, selectedCourse);
  console.log(selectedCourse);

  // Datos de ejemplo
  // const courseProgressData = [
  //   { course: 'CP Pospago', Estudiantes: 4, Progreso: 80 },
  //  { course: 'Formacion Continua', Estudiantes: 2, Progreso: 40 },
  //];

  const courseTimeData = [{ course: 'Productividad Agil', Tiempo: 40 }];
  const npsData = [0, 0, 0, 0, 0, 0, 6, 5, 6, 10]; // Valores en porcentaje para cada estrella
  //averageTimeData
  const averageTimePerDayData = [
    { day: 'Lunes', time: 46 },
    { day: 'Martes', time: 20 },
    { day: 'Miercoles', time: 35 },
    { day: 'Jueves', time: 30 },
    { day: 'Viernes', time: 25 },
    { day: 'Sabado', time: 27 },
    { day: 'Domingo', time: 36 },
  ];

  const courseProgressData = [
    {
      course: 'Productividad Agil',
      Estudiantes: 20,
      Progreso: 50,
    },
  ];

  const topAdvisorsData = [
    { name: 'Valeria Flores', Calificacion: 20 },
    { name: 'Carla Mendoza', Calificacion: 20 },
    { name: 'Ariana Rojas', Calificacion: 20 },
    { name: 'Alvaro Guzman', Calificacion: 15 },
    { name: 'Maria Lopez', Calificacion: 15 },
  ];

  //Curso completados al 100%
  const courseCompletionData = [
    { course: 'Productividad Agil', completion: 2 },
    { course: 'Gestion de Talento Milenial', completion: 24 },
  ];

  //Participantes en la semana
  const dailyParticipationData = [
    { day: 'Lunes', active: 2 },
    { day: 'Martes', active: 4 },
    { day: 'Miercoles', active: 2 },
    { day: 'Jueves', active: 3 },
    { day: 'Viernes', active: 2 },
    { day: 'Sabado', active: 1 },
    { day: 'Domingo', active: 0 },
  ];

  //Lista de modulos por curso
  const moduleCompletionData = (course: string) => {
    if (course === 'CP Pospago') {
      return [
        {
          module: 'Fidelizacion del Talento',
          completion: 70,
        },
        {
          module: 'Colaboradores Clave',
          completion: 40,
        },
        {
          module: 'Comunicacion Activa ',
          completion: 35,
        },
      ];
    } else if (course === 'Formacion Continua') {
      return [{ module: 'Retenciones 1', completion: 85 }];
    }
    return [];
  };

  const satisfactionSurveyData = (course: string) => {
    if (course === 'CP Pospago') {
      return [0, 0, 0, 1, 0, 33]; // Valores en porcentaje para cada estrella
    } else if (course === 'Formacion Continua') {
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
        <main className="min-w-0 flex-1 overflow-x-hidden p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pl-20">
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

          {/* Grafico de Barras de Progreso */}
          <ChartCard
            title="Progreso del Curso"
            subtitle="Comparacion entre estudiantes inscritos y progreso completado"
            type="bar"
            series={[
              {
                name: 'Estudiantes Inscritos',
                data: courseProgressData.map((item) => item.Estudiantes),
              },
              {
                name: 'Progreso Completado',
                data: courseProgressData.map((item) => item.Progreso),
              },
            ]}
            options={{
              xaxis: {
                categories: courseProgressData.map((item) => item.course),
                title: {
                  text: 'Cursos',
                  style: {
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#4B5563',
                  },
                },
                axisBorder: {
                  show: true,
                  color: '#E5E7EB',
                },
                axisTicks: {
                  color: '#E5E7EB',
                },
                labels: {
                  style: {
                    fontSize: '12px',
                    colors: '#6B7280',
                  },
                },
              },
              yaxis: {
                title: {
                  text: 'Cantidad',
                  style: {
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#4B5563',
                  },
                },
                labels: {
                  formatter: (val: number) => Math.round(val).toString(),
                  style: {
                    colors: '#6B7280',
                    fontSize: '12px',
                  },
                },
                min: 0,
                forceNiceScale: true,
              },
              colors: ['#3B82F6', '#10B981'],
              fill: {
                opacity: 0.9,
              },
              plotOptions: {
                bar: {
                  horizontal: false,
                  borderRadius: 4,
                  columnWidth: '70%',
                  dataLabels: {
                    position: 'top',
                  },
                },
              },
              dataLabels: {
                enabled: true,
                formatter: (val: number) => Math.round(val).toString(),
                style: {
                  fontSize: '11px',
                  fontWeight: 500,
                  colors: ['#1F2937'],
                },
                offsetY: -20,
              },
              legend: {
                position: 'bottom', // Cambiado de 'top' a 'bottom'
                horizontalAlign: 'center', // Centrado para mejor apariencia
                fontSize: '13px',
                fontWeight: 500,
                markers: {
                  size: 10,
                  strokeWidth: 0,
                },
                itemMargin: {
                  horizontal: 16,
                  vertical: 8, // Anadido espacio vertical
                },
                onItemClick: {
                  toggleDataSeries: true,
                },
                onItemHover: {
                  highlightDataSeries: true,
                },
              },
              tooltip: {
                y: {
                  formatter: (val: number) => `${Math.round(val)}`,
                },
              },
              grid: {
                borderColor: '#F3F4F6',
                strokeDashArray: 4,
                padding: {
                  top: 20,
                  bottom: 40, // Aumentado para acomodar la leyenda
                },
              },
            }}
            height={400}
            badgeText="Datos actualizados"
            className="mt-6"
          />

          {/* Grafico de Tiempo promedio por curso (minutos) */}
          <ChartCard
            title="Tiempo Promedio por Curso"
            subtitle="Duracion media de interaccion por curso (minutos)"
            type="bar"
            series={[
              {
                name: 'Tiempo Promedio',
                data: courseTimeData.map((item) => item.Tiempo),
              },
            ]}
            options={{
              chart: {
                toolbar: {
                  tools: {
                    download: true,
                  },
                },
              },
              xaxis: {
                categories: courseTimeData.map((item) => item.course),
                title: {
                  text: 'Cursos',
                  style: {
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#4B5563',
                  },
                },
                axisBorder: {
                  show: true,
                  color: '#E5E7EB',
                },
                axisTicks: {
                  color: '#E5E7EB',
                },
                labels: {
                  style: {
                    fontSize: '12px',
                    colors: '#6B7280',
                  },
                  rotate: -45,
                  hideOverlappingLabels: true,
                },
              },
              yaxis: {
                title: {
                  text: 'Tiempo (minutos)',
                  style: {
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#4B5563',
                  },
                },
                labels: {
                  formatter: (val: number) => `${Math.round(val)} min`,
                  style: {
                    colors: '#6B7280',
                    fontSize: '12px',
                  },
                },
                min: 0,
                forceNiceScale: true,
              },
              colors: ['#3B82F6'],
              fill: {
                opacity: 0.9,
                type: 'gradient',
                gradient: {
                  shade: 'light',
                  type: 'vertical',
                  shadeIntensity: 0.25,
                  gradientToColors: ['#1D4ED8'],
                  inverseColors: false,
                  opacityFrom: 0.85,
                  opacityTo: 0.85,
                  stops: [0, 100],
                },
              },
              plotOptions: {
                bar: {
                  borderRadius: 6,
                  columnWidth: '60%',
                  dataLabels: {
                    position: 'top',
                  },
                  distributed: false,
                },
              },
              dataLabels: {
                enabled: true,
                formatter: (val: number) => `${Math.round(val)} min`,
                style: {
                  fontSize: '11px',
                  fontWeight: 500,
                  colors: ['#1F2937'],
                },
                offsetY: -20,
                background: {
                  enabled: false,
                },
              },
              legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontSize: '13px',
                fontWeight: 500,
                markers: {
                  size: 10,
                  strokeWidth: 0,
                },
              },
              tooltip: {
                y: {
                  formatter: (val: number) => `${val.toFixed(1)} minutos`,
                },
              },
              grid: {
                borderColor: '#F3F4F6',
                strokeDashArray: 4,
                padding: {
                  top: 20,
                  bottom: 40,
                },
              },
              responsive: [
                {
                  breakpoint: 768,
                  options: {
                    plotOptions: {
                      bar: {
                        columnWidth: '80%',
                      },
                    },
                    dataLabels: {
                      style: {
                        fontSize: '10px',
                      },
                    },
                  },
                },
              ],
            }}
            height={400}
            badgeText="Ultima semana"
            showUpdateDate={true}
            className="mt-6"
          />
          {/* Calificaciones de Asesores */}
          {/* Top 5 de Asesores - Version Mejorada */}
          <ChartCard
            title="Top 5 de Asesores"
            subtitle="Mejores evaluaciones segun satisfaccion de estudiantes"
            type="bar"
            series={[
              {
                name: 'Puntaje de Satisfaccion',
                data: topAdvisorsData.map((item) => item.Calificacion),
              },
            ]}
            options={{
              chart: {
                toolbar: {
                  tools: {
                    download: '<i class="fas fa-download text-gray-500"></i>',
                  },
                },
              },
              plotOptions: {
                bar: {
                  borderRadius: 6,
                  columnWidth: '50%',
                  dataLabels: {
                    position: 'top',
                  },
                },
              },
              xaxis: {
                categories: topAdvisorsData.map((item) => item.name),
                labels: {
                  style: {
                    fontSize: '12px',
                    colors: '#6B7280',
                    fontFamily: 'Inter, sans-serif',
                  },
                  formatter: (value) => {
                    const maxLength = window.innerWidth > 768 ? 20 : 12;
                    return value.length > maxLength
                      ? `${value.substring(0, maxLength)}...`
                      : value;
                  },
                },
                axisBorder: {
                  show: true,
                  color: '#E5E7EB',
                },
                axisTicks: {
                  color: '#E5E7EB',
                },
              },
              yaxis: {
                max: 20,
                min: 0,
                tickAmount: 4,
                labels: {
                  formatter: (val) => `${val} pts`,
                  style: {
                    colors: '#6B7280',
                    fontSize: '12px',
                  },
                },
                title: {
                  text: 'Puntaje',
                  style: {
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#4B5563',
                  },
                },
              },
              colors: ['#6366F1'],
              fill: {
                opacity: 0.9,
                type: 'gradient',
                gradient: {
                  shade: 'light',
                  type: 'vertical',
                  gradientToColors: ['#8B5CF6'],
                  stops: [0, 100],
                },
              },
              dataLabels: {
                enabled: true,
                formatter: (val) => `${val} pts`,
                style: {
                  fontSize: '11px',
                  fontWeight: 500,
                  colors: ['#1F2937'],
                },
                offsetY: -20,
              },
              tooltip: {
                y: {
                  formatter: (val) => `${val} puntos de satisfaccion`,
                },
              },
              responsive: [
                {
                  breakpoint: 768,
                  options: {
                    plotOptions: {
                      bar: {
                        columnWidth: '60%',
                      },
                    },
                    dataLabels: {
                      style: {
                        fontSize: '10px',
                      },
                    },
                  },
                },
              ],
            }}
            height={350}
            badgeText="Evaluacion 2025"
            showUpdateDate={true}
            className="mt-6"
          />

          {/* Grafico de Tiempo promedio por dia */}
          <div className="chart-container border border-gray-300 p-4 rounded-lg bg-white shadow-md">
            <h2 className="text-lg font-semibold mb-2">
              Tiempo promedio por dia en la plataforma
            </h2>
            <Chart
              type="line"
              series={[
                {
                  name: 'Tiempo',
                  data: averageTimePerDayData.map((item) => item.time),
                },
              ]} // Assuming `averagetime` has objects with `time` property
              options={{
                chart: { type: 'line' },
                xaxis: {
                  categories: averageTimePerDayData.map((item) => item.day),
                  title: { text: 'Dias' },
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

          {/* Grafico de Participacion Diaria */}
          <div className="chart-container border border-gray-300 p-4 rounded-lg bg-white shadow-md">
            <h2 className="text-lg font-semibold mb-2">
              Participacion Diaria (estudiantes activos)
            </h2>
            <Chart
              type="line"
              series={[
                {
                  name: 'Cantidad',
                  data: dailyParticipationData.map((item) => item.active),
                },
              ]}
              options={{
                chart: { type: 'line' },
                xaxis: {
                  categories: dailyParticipationData.map((item) => item.day),
                  title: { text: 'Dia' },
                },
                yaxis: { title: { text: 'Cantidad Estudiantes' } },
                colors: ['#33b2df'],
                stroke: { curve: 'smooth' },
                dataLabels: { enabled: true },
              }}
              height={300}
            />
          </div>

          {/* Tasa de Finalizacion de Cursos */}
          <ChartCard
            title="Tasa de Finalizacion de Cursos"
            subtitle="Porcentaje de estudiantes que completaron cada curso"
            type="bar"
            series={[
              {
                name: 'Tasa de Finalizacion',
                data: courseCompletionData.map((item) => item.completion),
              },
            ]}
            options={{
              chart: {
                toolbar: {
                  tools: {
                    download: true,
                  },
                },
              },
              plotOptions: {
                bar: {
                  borderRadius: 6,
                  columnWidth: '50%',
                  dataLabels: {
                    position: 'top',
                  },
                },
              },
              xaxis: {
                categories: courseCompletionData.map((item) => item.course),
                title: {
                  text: 'Cursos',
                  style: {
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#4B5563',
                  },
                },
                labels: {
                  style: {
                    fontSize: '12px',
                    colors: '#6B7280',
                  },
                  trim: true,
                },
              },
              yaxis: {
                min: 0,
                max: 100,
                title: {
                  text: 'Porcentaje de Finalizacion',
                  style: {
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#4B5563',
                  },
                },
                labels: {
                  formatter: (val: number) => `${val}%`,
                },
              },
              colors: ['#3B82F6'],
              dataLabels: {
                enabled: true,
                formatter: (val: number) => `${Math.round(val)}%`,
                style: {
                  fontSize: '11px',
                  fontWeight: 500,
                },
              },
              tooltip: {
                y: {
                  formatter: (val: number) => `${val.toFixed(1)}% completado`,
                },
              },
            }}
            height={350}
            badgeText="Ultimo semestre"
            showUpdateDate={true}
            className="mt-4"
          />

          {/* Grafico de Complecion de Modulos */}

          <ChartCard
            title="Complecion de Modulos"
            type="bar"
            series={[
              {
                name: 'Porcentaje de Complecion',
                data: moduleCompletionData('CP Pospago').map(
                  (item) => item.completion
                ),
              },
            ]}
            options={{
              xaxis: {
                categories: moduleCompletionData('CP Pospago').map(
                  (item) => item.module
                ),
                labels: {
                  style: {
                    fontSize: '12px',
                    fontWeight: 600,
                  },
                },
              },
              yaxis: {
                title: {
                  text: 'Porcentaje de Finalizacion',
                  style: {
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#374151',
                  },
                },
                min: 0,
                max: 100,
                labels: {
                  formatter: (value) => `${value}%`,
                },
              },
              plotOptions: {
                bar: {
                  borderRadius: 4,
                  columnWidth: '60%',
                  dataLabels: {
                    position: 'top',
                  },
                },
              },
              tooltip: {
                y: {
                  formatter: (value) => `${value}% completado`,
                },
              },
            }}
            height={300}
            badgeText="Ultimos 30 dias"
            className="mb-6"
          />

          {/* Grafico de Dona Encuesta de Satisfaccion */}
          <ChartCard
            title="Encuesta de Satisfaccion"
            subtitle="Distribucion de votos por calificacion"
            type="bar"
            series={[
              {
                name: 'Votos',
                data: [0, 0, 2, 4, 7], // satisData
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
            height={350}
            showUpdateDate={true}
            className="mb-7"
          />
          {/* CORREGIR 2 , TOTAL DE VOTOS*/}
          {/* Grafico de NPS */}
          <ChartCard
            title="Del 1 al 10 ¿Que tanto recomendarias este curso?"
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
                  text: 'Puntuacion',
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
                  text: 'Numero de respuestas',
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

