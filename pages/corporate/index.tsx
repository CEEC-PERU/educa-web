import React, { useState } from 'react';
import dynamic from 'next/dynamic'; // Import dynamic from next/dynamic
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Corporate/CorporateSideBar';
import { useAuth } from '../../context/AuthContext';
import './../../app/globals.css';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';
import { useMetricaCorporate } from '../../hooks/useMetricaCorporate';
import { useCourseStudent } from '../../hooks/useCourseStudents';
import { useCourseProgress } from '../../hooks/useProgressCurso';
import { useTop , useAverageTime , useAUserActive} from '../../hooks/useTopRankingCorporative';
// Dynamically import Chart with no SSR
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });


const CorporateDashboard: React.FC = () => {
  const { logout, user, profileInfo } = useAuth();
  const { donutChartData, isLoading } = useMetricaCorporate();
  const enterpriseId = user ? (user as { id: number; role: number; dni: string; enterprise_id: number }).enterprise_id : null;
 // const [selectedCourse, setSelectedCourse] = useState('CP Pospago');
  const { courseStudent } = useCourseStudent();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');  
  const [selectedCourse, setSelectedCourse] = useState<number | undefined>(undefined);
  const { courseProgressData, loading, error } = useCourseProgress(selectedCourse);
  const { topRanking } = useTop(selectedCourse);
  const { averagetime } = useAverageTime();
  const { activeuser } = useAUserActive();
console.log(selectedCourse)
  

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
      return [0, 0, 0, 1, 0,33]; // Valores en porcentaje para cada estrella
    } else if (course === 'Formación Continua') {
      return [0, 0, 0, 1, 0 ,33];
    }
    return [];
  };

  const npsData = (course: string) => {
    if (course === 'Consulta Previa Prepago') {
      return [0, 0, 0, 0, 0,0 , 2, 2, 4, 10]; // Valores de NPS
    } else if (course === 'Contactados') {
      return [0, 0, 0, 0, 0, 0, 0, 0, 1, 0];
    }
    return [];
  };

  return (
 
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" borderColor="border border-stone-300" />
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
      <option key={course.course_id} value={course.course_id} className="text-gray-700">
        {course.Course.name}
      </option>
    ))
  ) : (
    <option disabled className="text-gray-600">No hay cursos asignados</option>
  )}
</select>



</div>

{/* Gráfico de Barras de Progreso */}
<div className="chart-container border border-gray-300 p-4 rounded-lg bg-white shadow-md">

 
<h2 className="text-lg font-semibold mb-2">Progreso del curso</h2>

<Chart
          type="bar"
          series={[
            { name: 'Estudiantes', data: courseProgressData.map((item) => item.Estudiantes) },
            { name: 'Progreso', data: courseProgressData.map((item) => item.Progreso) },
          ]}
          options={{
            chart: { type: 'bar' },
            xaxis: { categories: courseProgressData.map((item) => item.course), title: { text: 'Cursos' } },
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
          <h2 className="text-lg font-semibold mb-2">Tiempo Promedio por Curso</h2>
            <Chart
              type="bar"
              series={[{ name: 'Tiempo', data: courseTimeData.map(item => item.Tiempo) }]}
              options={{
                chart: { type: 'bar' },
                xaxis: { categories: courseTimeData.map(item => item.course)  , title: { text: 'Cursos' }},
                yaxis: { title: { text: 'Tiempo(minutos)' } },
                colors: ['#3274C1'],
                dataLabels: { enabled: true },
                legend: { position: 'top' },
              }}
              height={300}
            />
        </div>
        

          {/* Calificaciones de Asesores */}
          <div className="chart-container border border-gray-300 p-4 rounded-lg bg-white shadow-md">
          <h2 className="text-lg font-semibold mb-2">Top 5  de Asesores</h2>
            <Chart
              type="bar"
              series={[{ name: 'Calificación', data: topRanking.map(item => item.puntaje) }]}
              options={{
                chart: { type: 'bar' },
                xaxis: { categories: topRanking.map(item => item.name) , title: { text: 'Asesores' }},
                yaxis: { title: { text: 'Calificaciòn' } },
                colors: ['#6158D3'],
                dataLabels: { enabled: true },
                legend: { position: 'top' },
              }}
              height={300}
            />
          </div>

          

          {/* Gráfico de Tiempo promedio por día */}
<div className="chart-container border border-gray-300 p-4 rounded-lg bg-white shadow-md">
  <h2 className="text-lg font-semibold mb-2">Tiempo promedio por día en la plataforma</h2>
  <Chart
    type="line"
    series={[{ name: 'Tiempo', data: averagetime.map(item => item.time) }]} // Assuming `averagetime` has objects with `time` property
    options={{
      chart: { type: 'line' },
      xaxis: { categories: averagetime.map(item => item.day), title: { text: 'Días' } },
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
            <h2 className="text-lg font-semibold mb-2">Participación Diaria (estudiantes activos)</h2>
            <Chart
              type="line"
              series={[{ name: 'Cantidad', data: activeuser.map(item => item.active) }]}
              options={{
                chart: { type: 'line' },
                xaxis: { categories: activeuser.map(item => item.day), title: { text: 'Día' } },
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
          <h2 className="text-lg font-semibold mb-2">Tasa de Finalización de Cursos</h2>
            
            <Chart
              type="bar"
              series={[{ name: 'Finalización', data: courseCompletionData.map(item => item.completion) }]}
              options={{
                chart: { type: 'bar' },
                yaxis: { title: { text: 'Finalizaciòn (%)' } },
                xaxis: { categories: courseCompletionData.map(item => item.course) , title: { text: 'Curso' } },
                colors: ['#3274C1'],
                dataLabels: { enabled: true },
              }}
              height={300}
            />
          </div>

            {/* Gráfico de Compleción de Módulos */}
            <div className="chart-container border border-gray-300 p-4 rounded-lg bg-white shadow-md">
            <h2 className="text-lg font-semibold mb-2">Compleción de Módulos</h2>
            <select value={selectedCourse} onChange={(e) => setSelectedCourse(Number(e.target.value))} className="mt-2 block w-full">
              <option value="CP Pospago">Consulta Previa Prepago</option>
              <option value="Formación Continua">Contactados</option>
            </select>
            <Chart
              type="bar"
              series={[{ name: 'Compleción', data: moduleCompletionData('CP Pospago').map(item => item.completion) }]}
              options={{
                chart: { type: 'bar' },
                yaxis: { title: { text: 'Finalizaciòn (%)' } },
                xaxis: { categories: moduleCompletionData('CP Pospago').map(item => item.module) , title: { text: 'Curso' }},
                colors: ['#3274C1'],
                dataLabels: { enabled: true },
              }}
              height={300}
            />
          </div>


          {/* Gráfico de Dona Encuesta de Satisfacción */}
          <div className="chart-container border border-gray-300 p-4 rounded-lg bg-white shadow-md">
          <h2 className="text-lg font-semibold mb-2">Encuesta de Satisfacción</h2>
            {/*  satisfactionSurveyData('CP Pospago') selectedCourse */}
            <Chart
              type="donut"
              series={satisfactionSurveyData('CP Pospago')} 
              options={{
                chart: { type: 'donut' },
                labels: ['⭐', '⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐⭐⭐' , 'N/A'],
                colors: ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5'],
                legend: { position: 'bottom' },
                dataLabels: { enabled: true },
              }}
              height={300}
            />
          </div>

          {/* Gráfico de NPS */}
          <div className="chart-container border border-gray-300 p-4 rounded-lg bg-white shadow-md">
          <h2 className="text-lg font-semibold mb-2">Del 1 al 10 ¿Què tanto recomendarías este curso?</h2>
            
            <Chart
              type="bar"
              series={[{ name: 'NPS', data: npsData('Consulta Previa Prepago') }]}
              options={{
                chart: { type: 'bar' },
                xaxis: { categories: Array.from({ length: 10 }, (_, i) => i.toString())  , title: { text: 'Valores' }},
                yaxis: { title: { text: 'Cantidad Estudiantes'  } },
                colors: ['#33b2df'],
                dataLabels: { enabled: true },
              }}
              height={300}
            />
          </div>

        </main>
      </div>
    </div>
  );
};

export default CorporateDashboard;
