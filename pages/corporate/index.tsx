import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Corporate/CorporateSideBar';
import { useAuth } from '../../context/AuthContext';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveLine } from '@nivo/line';
import { ResponsivePie } from '@nivo/pie';

import './../../app/globals.css';
import { useMetricaCorporate } from '../../hooks/useMetricaCorporate';

const CorporateDashboard: React.FC = () => {
  const { logout, user, profileInfo } = useAuth();
  const { donutChartData, isLoading } = useMetricaCorporate();
  const enterpriseId = user ? (user as { id: number; role: number; dni: string; enterprise_id: number }).enterprise_id : null;
  const [selectedCourse, setSelectedCourse] = useState('CP Pospago'); 

  const satisfactionSurveyData = (course: string) => {
    if (course === 'CP Pospago') {
      return [
        { rating: '1 Estrellas', value: 0 },
        { rating: '2 Estrellas', value: 0 },
        { rating: '3 Estrellas', value: 1 },
        { rating: '4 Estrellas', value: 2 },
        { rating: '5 Estrellas', value: 2 },
      ];
    } else if (course === 'Formación Continua') {
      return [
        { rating: '1 Estrellas', value: 0 },
        { rating: '2 Estrellas', value: 1 },
        { rating: '3 Estrellas', value: 1 },
        { rating: '4 Estrellas', value: 1 },
        { rating: '5 Estrellas', value: 1 },
      ];
    }
    return [];
  };

  const npsData = (course: string) => {
    if (course === 'CP Pospago') {
      return [
        { nps: '1', count: 0 },
        { nps: '2', count: 0 },
        { nps: '3', count: 0 },
        { nps: '4', count: 0 },
        { nps: '5', count: 1 },
        { nps: '6', count: 0 },
        { nps: '7', count: 1 },
        { nps: '8', count: 0 },
        { nps: '9', count: 1 },
        { nps: '10', count: 2 },
      ];
    } else if (course === 'Formación Continua') {
      return [
        { nps: '1', count: 0 },
        { nps: '2', count: 1 },
        { nps: '3', count: 1 },
        { nps: '4', count: 1 },
        { nps: '5', count: 0 },
        { nps: '6', count: 0 },
        { nps: '7', count: 0 },
        { nps: '8', count: 1 },
        { nps: '9', count: 0 },
        { nps: '10', count: 1 },
      ];
    }
    return [];
  };

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
    { name: 'Estrella Zavaleta', Calificación: 15 },
    { name: 'Erick Zavaleta', Calificación: 10 },
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
        { module: 'Formación Integral de Representantes', completion: 60 },
        { module: 'Gestión Integral de Contacto', completion: 40 },
      ];
    } else if (course === 'Formación Continua') {
      return [{ module: 'Retenciones 1', completion: 85 }];
    }
    return [];
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" borderColor="border border-stone-300" />
      <div className="flex flex-1 pt-16 ">
        <Sidebar showSidebar={true} setShowSidebar={() => {}} />
        <main className="p-6 flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pl-40">
          
          {/* Gráfico de Barras de Progreso */}
          <div className="chart-container h-64 border border-gray-300 p-4 rounded-lg">
            <h2>Progreso del curso</h2>
            <ResponsiveBar
              data={courseProgressData}
              keys={['Estudiantes', 'Progreso']}
              indexBy="course"
              margin={{ top: 20, right: 50, bottom: 50, left: 60 }}
              padding={0.3}
              colors={{ scheme: 'set2' }}
              axisBottom={{ tickSize: 5, tickPadding: 5, tickRotation: 0, legend: 'Curso', legendPosition: 'middle', legendOffset: 32 }}
              axisLeft={{ tickSize: 5, tickPadding: 5, tickRotation: 0, legend: 'Cantidad', legendPosition: 'middle', legendOffset: -40 }}
            />
          </div>

          {/* Gráfico de Tiempo promedio por curso (minutos) */}
          <div className="chart-container h-64 border border-gray-300 p-4 rounded-lg">
            <h2>Tiempo Promedio por Curso</h2>
            <ResponsiveBar
              data={courseTimeData}
              keys={['Tiempo']}
              indexBy="course"
              margin={{ top: 20, right: 50, bottom: 50, left: 60 }}
              padding={0.3}
              colors={{ scheme: 'set2' }}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Curso',
                legendPosition: 'middle',
                legendOffset: 32,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Tiempo (minutos)',
                legendPosition: 'middle',
                legendOffset: -40,
              }}
            />
          </div>

          {/* Calificaciones de Asesores */}
          <div className="chart-container h-64 border border-gray-300 p-4 rounded-lg">
            <h2>Calificaciones de Asesores</h2>
            <ResponsiveBar
              data={topAdvisorsData}
              keys={['Calificación']}
              indexBy="name"
              margin={{ top: 20, right: 50, bottom: 50, left: 60 }}
              padding={0.3}
              colors={{ scheme: 'set2' }}
              axisBottom={{ tickSize: 5, tickPadding: 5, tickRotation: 0, legend: 'Asesor', legendPosition: 'middle', legendOffset: 32 }}
              axisLeft={{ tickSize: 5, tickPadding: 5, tickRotation: 0, legend: 'Calificación', legendPosition: 'middle', legendOffset: -40 }}
            />
          </div>

          {/* NPS (Net Promoter Score) */}
          <div className="chart-container h-64 border border-gray-300 p-4 rounded-lg">
            <h2>NPS (¿Qué tanto recomendarías el curso?)</h2>
            <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} className="mt-2 block w-full">
              <option value="CP Pospago">CP Pospago</option>
              <option value="Formación Continua">Formación Continua</option>
            </select>
            <ResponsiveBar
              data={npsData(selectedCourse)}
              keys={['count']}
              indexBy="nps"
              margin={{ top: 20, right: 50, bottom: 50, left: 60 }}
              padding={0.3}
              colors={{ scheme: 'set2' }}
              axisBottom={{ tickSize: 5, tickPadding: 5, tickRotation: 0, legend: 'NPS', legendPosition: 'middle', legendOffset: 32 }}
              axisLeft={{ tickSize: 5, tickPadding: 5, tickRotation: 0, legend: 'Cantidad', legendPosition: 'middle', legendOffset: -40 }}
            />
          </div>

          {/* Gráfico de Dona Encuesta de Satisfacción */}
          <div className="chart-container h-64 border border-gray-300 p-4 rounded-lg">
            <h2>Encuesta de Satisfacción</h2>
            <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} className="mt-2 block w-full">
              <option value="CP Pospago">CP Pospago</option>
              <option value="Formación Continua">Formación Continua</option>
            </select>
            <ResponsivePie
              data={satisfactionSurveyData(selectedCourse).map(item => ({ id: item.rating, value: item.value }))}
              margin={{ top: 20, right: 50, bottom: 50, left: 60 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              colors={{ scheme: 'set1' }}
              borderWidth={1}
              borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor="#333333"
              arcLabelsRadiusOffset={0.5}
            />
          </div>

          {/* Gráfico de Líneas de Tiempo Promedio */}
          <div className="chart-container h-64 border border-gray-300 p-4 rounded-lg">
            <h2>Tiempo promedio por día en la plataforma</h2>
            <ResponsiveLine
              data={[{
                id: 'Tiempo promedio por día',
                data: averageTimePerDayData.map(item => ({ x: item.day, y: item.time }))
              }]}
              margin={{ top: 20, right: 50, bottom: 50, left: 60 }}
              axisBottom={{ tickSize: 5, tickPadding: 5, tickRotation: 0, legend: 'Día', legendPosition: 'middle', legendOffset: 32 }}
              axisLeft={{ tickSize: 5, tickPadding: 5, tickRotation: 0, legend: 'Tiempo (minutos)', legendPosition: 'middle', legendOffset: -40 }}
              colors={{ scheme: 'set1' }}
              pointSize={10}
              pointBorderWidth={2}
              useMesh={true}
            />
          </div>

          {/* Gráfico de Finalización de Cursos */}
          <div className="chart-container h-64 border border-gray-300 p-4 rounded-lg">
            <h2>Tasa de Finalización de Cursos</h2>
            <ResponsiveBar
              data={courseCompletionData}
              keys={['completion']}
              indexBy="course"
              margin={{ top: 20, right: 50, bottom: 50, left: 60 }}
              padding={0.3}
              colors={{ scheme: 'nivo' }}
              axisBottom={{ tickSize: 5, tickPadding: 5, tickRotation: 0, legend: 'Curso', legendPosition: 'middle', legendOffset: 32 }}
              axisLeft={{ tickSize: 5, tickPadding: 5, tickRotation: 0, legend: 'Finalización (%)', legendPosition: 'middle', legendOffset: -40 }}
            />
          </div>

          {/* Gráfico de Participación Diaria */}
          <div className="chart-container h-64 border border-gray-300 p-4 rounded-lg">
            <h2>Participación Diaria (estudiantes activos)</h2>
            <ResponsiveLine
              data={[{
                id: 'Participación Diaria',
                data: dailyParticipationData.map(item => ({ x: item.day, y: item.active }))
              }]}
              margin={{ top: 20, right: 50, bottom: 50, left: 60 }}
              axisBottom={{ tickSize: 5, tickPadding: 5, tickRotation: 0, legend: 'Día', legendPosition: 'middle', legendOffset: 32 }}
              axisLeft={{ tickSize: 5, tickPadding: 5, tickRotation: 0, legend: 'Estudiantes Activos', legendPosition: 'middle', legendOffset: -40 }}
              colors={{ scheme: 'set1' }}
              pointSize={10}
              pointBorderWidth={2}
              useMesh={true}
            />
          </div>

          {/* Completar Módulos */}
          <div className="chart-container h-64 border border-gray-300 p-4 rounded-lg">
            <label>Seleccionar curso:</label>
            <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} className="mt-2 block w-full">
              <option value="CP Pospago">CP Pospago</option>
              <option value="Formación Continua">Formación Continua</option>
            </select>
            <ResponsiveBar
              data={moduleCompletionData(selectedCourse)}
              keys={['completion']}
              indexBy="module"
              margin={{ top: 20, right: 50, bottom: 50, left: 60 }}
              padding={0.3}
              colors={{ scheme: 'nivo' }}
              axisBottom={{ tickSize: 5, tickPadding: 5, tickRotation: 0, legend: 'Módulo', legendPosition: 'middle', legendOffset: 32 }}
              axisLeft={{ tickSize: 5, tickPadding: 5, tickRotation: 0, legend: 'Finalización (%)', legendPosition: 'middle', legendOffset: -40 }}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default CorporateDashboard;
