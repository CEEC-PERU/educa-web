import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Corporate/CorporateSideBar';
import { useAuth } from '../../context/AuthContext';
import { Bar, Line, Doughnut, Bubble } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement } from 'chart.js';
import './../../app/globals.css';
import { useMetricaCorporate } from '../../hooks/useMetricaCorporate';
import { Profile } from '../../interfaces/UserInterfaces';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement);

const CorporateDashboard: React.FC = () => {
  const { logout, user, profileInfo } = useAuth();
  const { donutChartData, isLoading } = useMetricaCorporate();
  const enterpriseId = user ? (user as { id: number; role: number; dni: string; enterprise_id: number }).enterprise_id : null;
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('CP Pospago'); 
  let name = '';
  let uri_picture = '';

  if (profileInfo) {
    const profile = profileInfo as Profile;
    name = profile.first_name;
    uri_picture = profile.profile_picture!;
  }

    // Datos de progreso y cantidad de estudiantes
  const courseProgressData = {
    labels: ['CP Pospago', 'Claro Retenciones'],
    datasets: [
      {
        label: 'Estudiantes',
        data: [4, 2], // Ejemplo: 4 estudiantes en "CP Pospago" y 2 en "Claro Retenciones"
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        yAxisID: 'y1',
      },
      {
        label: 'Progreso (%)',
        data: [80, 4], // Ejemplo: Progreso promedio de 80% para "CP Pospago" y 40% para "Claro Retenciones"
        backgroundColor: 'rgba(255, 205, 86, 0.6)',
        borderColor: 'rgba(255, 205, 86, 1)',
        yAxisID: 'y2',
      },
    ],
  };

  const courseTimeData = {
    labels: ['CP Pospago', 'Claro Retenciones'],
    datasets: [
      {
        label: 'Tiempo promedio (minutos)',
        data: [30, 5], // Ejemplo: Tiempo promedio de 90 minutos para "CP Pospago" y 50 minutos para "Claro Retenciones"
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
      },
    ],
  };

  const topAdvisorsData = {
    labels: ['Estrella Zavaleta', 'Erick Zavaleta'],
    datasets: [
      {
        label: 'Calificación de Asesores',
        data: [15, 10], // Ejemplo: Calificación para dos asesores
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
      },
    ],
  };

  const npsData = {
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    datasets: [
      {
        label: 'NPS (¿Qué tanto recomendarías el curso?)',
        data: [0, 0, 0, 0, 0, 1, 0, 1, 0, 2], // Ejemplo: Distribución para 6 usuarios
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
      },
    ],
  };

  const satisfactionSurveyData = {
    labels: ['5 Estrellas', '4 Estrellas', '3 Estrellas', '2 Estrellas', '1 Estrella'],
    datasets: [
      {
        label: 'Encuesta de Satisfacción',
        data: [2, 2, 1, 1, 0], // Ejemplo: Distribución para 6 usuarios
        backgroundColor: [
          'rgba(255, 205, 86, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(153, 102, 255, 1)',
        ],
      },
    ],
  };

  const averageTimePerDayData = {
    labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
    datasets: [
      {
        label: 'Tiempo promedio por día en la plataforma (minutos)',
        data: [46, 20, 35, 30, 25, 27, 36], // Ejemplo para una pequeña cantidad de usuarios
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        fill: false,
      },
    ],
  };

  const courseCompletionData = {
    labels: ['CP Pospago', 'Claro Retenciones'],
    datasets: [
      {
        label: 'Tasa de Finalización (%)',
        data: [70, 0], // Ejemplo: Tasa de finalización para dos cursos
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
      },
    ],
  };

  const dailyParticipationData = {
    labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
    datasets: [
      {
        label: 'Participación Diaria (estudiantes activos)',
        data: [2, 2, 3, 1, 2, 1, 1], // Ejemplo para una pequeña cantidad de usuarios
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
      },
    ],
  };

  const getModuleCompletionData = (course: string) => {
    if (course === 'CP Pospago') {
      return {
        labels: ['Formaciòn Integral de Representantes de Claro', 'Gestión Integral de Contacto y Tipificación',],
        datasets: [
          {
            label: 'Tasa de Compleción de Módulos (%)',
            data: [60, 40,], // Ejemplo para CP Pospago
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
            borderColor: 'rgba(153, 102, 255, 1)',
          },
        ],
      };
    } else if (course === 'Claro Retenciones') {
      return {
        labels: ['Retenciones 1', ],
        datasets: [
          {
            label: 'Tasa de Compleción de Módulos (%)',
            data: [85,], // Ejemplo para Claro Retenciones
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgba(255, 99, 132, 1)',
          },
        ],
      };
    }
    return {
      labels: [],
      datasets: [],
    };
  };
  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar 
        bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90"
        borderColor="border border-stone-300"
        user={user ? { profilePicture: uri_picture } : undefined} 
      />
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={true} setShowSidebar={() => {}} />
        <main className="p-6 flex-grow transition-all duration-300 ease-in-out ml-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* Gráfico de Volumen y % de Progreso por Curso */}
          <div className="bg-white shadow-lg rounded-lg p-4 border-2 h-64">
            <Bar
              data={courseProgressData}
              options={{
                maintainAspectRatio: false,
                scales: {
                  y1: {
                    type: 'linear',
                    position: 'left',
                    beginAtZero: true,
                  },
                  y2: {
                    type: 'linear',
                    position: 'right',
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>

          {/* Gráfico de Tiempo Promedio por Curso */}
          <div className="bg-white shadow-lg rounded-lg p-4 border-2 h-64">
            <Bar data={courseTimeData} options={{ maintainAspectRatio: false }} />
          </div>

          {/* Gráfico de Mejores y Peores Asesores */}
          <div className="bg-white shadow-lg rounded-lg p-4 border-2 h-64">
            <Bar data={topAdvisorsData} options={{ maintainAspectRatio: false }} />
          </div>
 
          {/* Gráfico de NPS */}
          <div className="bg-white shadow-lg rounded-lg p-4 border-2 h-64">
            <Bar data={npsData} options={{ maintainAspectRatio: false }} />
          </div>
          
          {/* Gráfico de Encuesta de Satisfacción */}
          <div className="bg-white shadow-lg rounded-lg p-4 border-2 h-64">
            <Doughnut data={satisfactionSurveyData} options={{ maintainAspectRatio: false }} />
          </div>

          {/* Gráfico de Tiempo Promedio por Día */}
          <div className="bg-white shadow-lg rounded-lg p-4 border-2 h-64">
            <Line data={averageTimePerDayData} options={{ maintainAspectRatio: false }} />
          </div>
          
          {/* Gráfico de Tasa de Finalización de Cursos */}
          <div className="bg-white shadow-lg rounded-lg p-4 border-2 h-64">
            <Bar data={courseCompletionData} options={{ maintainAspectRatio: false }} />
          </div>

          {/* Gráfico de Participación Diaria */}
          <div className="bg-white shadow-lg rounded-lg p-4 border-2 h-64">
            <Line data={dailyParticipationData} options={{ maintainAspectRatio: false }} />
          </div>

         
             {/* Gráfico de Tasa de Compleción de Módulos */}
             <div className="bg-white shadow-lg rounded-lg p-4 border-2 h-auto">
 
  <div className="w-full mt-4 h-40">
  <div className="w-full mt-4">
    <label htmlFor="courseSelect" className="block text-sm font-medium text-gray-700">
      Seleccionar curso:
    </label>
    <select
      id="courseSelect"
      value={selectedCourse}
      onChange={(e) => setSelectedCourse(e.target.value)}
      className="mt-1 block w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
    >
      <option value="CP Pospago">CP Pospago</option>
      <option value="Claro Retenciones">Claro Retenciones</option>
    </select>
  </div>
    <Bar
      data={getModuleCompletionData(selectedCourse)}
      options={{ maintainAspectRatio: false }}
    />
    
  </div>
</div>

          {/* Selección de curso */}
          

        </main>
      </div>
    </div>
  );
};

export default CorporateDashboard;

