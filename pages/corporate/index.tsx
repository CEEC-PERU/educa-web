import React, { useState } from 'react';
import dynamic from 'next/dynamic'; // Import dynamic from next/dynamic
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Corporate/CorporateSideBar';
import { useAuth } from '../../context/AuthContext';
import './../../app/globals.css';
import { useMetricaCorporate } from '../../hooks/useMetricaCorporate';

// Dynamically import Chart with no SSR
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const CorporateDashboard: React.FC = () => {
  const { logout, user, profileInfo } = useAuth();
  const { donutChartData, isLoading } = useMetricaCorporate();
  const enterpriseId = user ? (user as { id: number; role: number; dni: string; enterprise_id: number }).enterprise_id : null;
  const [selectedCourse, setSelectedCourse] = useState('CP Pospago');

  // Datos de ejemplo
  const courseProgressData = [
    { course: 'CP Pospago', Estudiantes: 4, Progreso: 80 },
    { course: 'Formación Continua', Estudiantes: 2, Progreso: 40 },
  ];

  const courseTimeData = [
    { course: 'CP Pospago', Tiempo: 30 },
    { course: 'Formación Continua', Tiempo: 5 },
  ];

  const topAdvisorsData = [
    { name: 'Estrella Zavaleta', Calificación: 20 },
    { name: 'Erick Zavaleta', Calificación: 20 },
    { name: 'Estrella Zavaleta', Calificación: 20 },
    { name: 'Erick Zavaleta', Calificación: 15 },
    { name: 'Estrella Zavaleta', Calificación: 15 },
  ];

  const averageTimePerDayData = [
    { day: 'Lunes', time: 46 },
    { day: 'Martes', time: 20 },
    { day: 'Miércoles', time: 35 },
    { day: 'Jueves', time: 30 },
    { day: 'Viernes', time: 25 },
    { day: 'Sábado', time: 27 },
    { day: 'Domingo', time: 36 },
  ];

  const courseCompletionData = [
    { course: 'CP Pospago', completion: 70 },
    { course: 'Formación Continua', completion: 0 },
  ];

  const dailyParticipationData = [
    { day: 'Lunes', active: 2 },
    { day: 'Martes', active: 4 },
    { day: 'Miércoles', active: 2 },
    { day: 'Jueves', active: 3 },
    { day: 'Viernes', active: 2 },
    { day: 'Sabado', active: 1 },
    { day: 'Domingo', active: 0 },
  ];

  

  const moduleCompletionData = (course: string) => {
    if (course === 'CP Pospago') {
      return [
        { module: 'Formación Integral ', completion: 60 },
        { module: 'Gestión Integral ', completion: 40 },
      ];
    } else if (course === 'Formación Continua') {
      return [{ module: 'Retenciones 1', completion: 85 }];
    }
    return [];
  };

  const satisfactionSurveyData = (course: string) => {
    if (course === 'CP Pospago') {
      return [0, 0, 0, 1, 2]; // Valores en porcentaje para cada estrella
    } else if (course === 'Formación Continua') {
      return [0, 1, 1, 0, 2];
    }
    return [];
  };

  const npsData = (course: string) => {
    if (course === 'CP Pospago') {
      return [0, 0, 0, 0, 0, 0, 1, 2, 0, 3]; // Valores de NPS
    } else if (course === 'Formación Continua') {
      return [0, 0, 0, 1, 0, 0, 2, 0, 1, 2];
    }
    return [];
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" borderColor="border border-stone-300" />
      <div className="flex flex-1 pt-16 ">
        <Sidebar showSidebar={true} setShowSidebar={() => {}} />
        <main className="p-6 flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pl-20">

{/* Gráfico de Barras de Progreso */}
<div className="chart-container border border-gray-300 p-4 rounded-lg bg-white shadow-md">
<h2 className="text-lg font-semibold mb-2">Progreso del curso</h2>
            <Chart
              type="bar"
              series={[{ name: 'Estudiantes', data: courseProgressData.map(item => item.Estudiantes) }, { name: 'Progreso', data: courseProgressData.map(item => item.Progreso) }]}
              options={{
                chart: { type: 'bar' },
                xaxis: { categories: courseProgressData.map(item => item.course) , title: { text: 'Cursos' }},
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
              series={[{ name: 'Calificación', data: topAdvisorsData.map(item => item.Calificación) }]}
              options={{
                chart: { type: 'bar' },
                xaxis: { categories: topAdvisorsData.map(item => item.name) , title: { text: 'Asesores' }},
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
              series={[{ name: 'Tiempo', data: averageTimePerDayData.map(item => item.time) }]}
              options={{
                chart: { type: 'line' },
                yaxis: { title: { text: 'Tiempo(minutos)' } },
                xaxis: { categories: averageTimePerDayData.map(item => item.day) , title: { text: 'Dìas' }},
                colors: ['#33b2df'],
                stroke: { curve: 'smooth' },
                dataLabels: { enabled: true },
              }}
              height={300}
            />
          </div>

            {/* Gráfico de Participación Diaria */}
            <div className="chart-container border border-gray-300 p-4 rounded-lg bg-white shadow-md">
            <h2 className="text-lg font-semibold mb-2">Participación Diaria (estudiantes activos)</h2>
            <Chart
              type="line"
              series={[{ name: 'Tiempo', data: dailyParticipationData.map(item => item.active) }]}
              options={{
                chart: { type: 'line' },
                xaxis: { categories: dailyParticipationData.map(item => item.day), title: { text: 'Día' } },
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
            <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} className="mt-2 block w-full">
              <option value="CP Pospago">CP Pospago</option>
              <option value="Formación Continua">Formación Continua</option>
            </select>
            <Chart
              type="bar"
              series={[{ name: 'Compleción', data: moduleCompletionData(selectedCourse).map(item => item.completion) }]}
              options={{
                chart: { type: 'bar' },
                yaxis: { title: { text: 'Finalizaciòn (%)' } },
                xaxis: { categories: moduleCompletionData(selectedCourse).map(item => item.module) , title: { text: 'Curso' }},
                colors: ['#3274C1'],
                dataLabels: { enabled: true },
              }}
              height={300}
            />
          </div>


          {/* Gráfico de Dona Encuesta de Satisfacción */}
          <div className="chart-container border border-gray-300 p-4 rounded-lg bg-white shadow-md">
          <h2 className="text-lg font-semibold mb-2">Encuesta de Satisfacción</h2>
            <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} className="mt-2 block w-full">
              <option value="CP Pospago">CP Pospago</option>
              <option value="Formación Continua">Formación Continua</option>
            </select>
            <Chart
              type="donut"
              series={satisfactionSurveyData(selectedCourse)}
              options={{
                chart: { type: 'donut' },
                labels: ['⭐', '⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐⭐⭐'],
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
            <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} className="mt-2 block w-full">
              <option value="CP Pospago">CP Pospago</option>
              <option value="Formación Continua">Formación Continua</option>
            </select>
            <Chart
              type="bar"
              series={[{ name: 'NPS', data: npsData(selectedCourse) }]}
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
