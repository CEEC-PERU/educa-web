import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Corporate/CorporateSideBar';
import { useAuth } from '../../context/AuthContext';
import { Bar, Line, Doughnut, Bubble } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
} from 'chart.js';
import { ChartOptions } from 'chart.js';
import './../../app/globals.css';
import { useMetricaCorporate } from '../../hooks/dashboard/useMetricaCorporate';
import { Profile } from '../../interfaces/User/UserInterfaces';
import SidebarAdminCorporate from '@/components/admincorporative/CorporativeSideBar';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
);

const AdminCorporative: React.FC = () => {
  const { logout, user, profileInfo } = useAuth();
  const { donutChartData, isLoading } = useMetricaCorporate();
  const enterpriseId = user
    ? (user as { id: number; role: number; dni: string; enterprise_id: number })
        .enterprise_id
    : null;
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  let name = '';
  let uri_picture = '';

  if (profileInfo) {
    const profile = profileInfo as Profile;
    name = profile.first_name;
    uri_picture = profile.profile_picture!;
  }

  // Example data for the charts
  const lineChartData = {
    labels: [
      'Lunes',
      'Martes',
      'Miercoles',
      'Jueves',
      'Viernes',
      'Sabado',
      'Domingo',
    ],
    datasets: [
      {
        label: 'Usuarios que se suman a la plataforma',
        data: [3, 2, 1, 2, 3, 1, 0],
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
      },
    ],
  };

  const barChartData = {
    labels: [
      'Soft Skills',
      'Ciencias de la Comunicaciòn',
      'Programacion2',
      'Lideres Transformacionales',
      'Gestion del Cambio',
    ],
    datasets: [
      {
        label: 'Vistas',
        text: 'Month',
        data: [5, 1, 1, 2, 1],
        backgroundColor: 'rgba(75, 192, 192, 1)',
      },
    ],
  };

  const barChartOptions: ChartOptions<'bar'> = {
    indexAxis: 'y' as 'y',
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: 20, // Adjust padding as needed
    },
  };

  const donutChartData2 = {
    labels: donutChartData?.labels,
    datasets: [
      {
        data: donutChartData?.datasets.data,
        backgroundColor: donutChartData?.datasets.backgroundColor,
        hoverBackgroundColor: donutChartData?.datasets.hoverBackgroundColor,
      },
    ],
  };

  const donutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: {
            size: 14,
          },
        },
      },
    },
    layout: {
      padding: 20, // Adjust padding as needed
    },
  };

  const bubbleChartData = {
    datasets: [
      {
        label: 'Progreso por Curso',
        data: [
          { x: 1, y: 75, r: 12, curso: 'Matemáticas' },
          { x: 2, y: 85, r: 18, curso: 'Ciencias' },
          { x: 3, y: 65, r: 10, curso: 'Historia' },
          { x: 4, y: 90, r: 20, curso: 'Lenguaje' },
          { x: 5, y: 70, r: 14, curso: 'Arte' },
        ],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
      },
    ],
  };

  const lineChartTimeData = {
    labels: [
      'Lunes',
      'Martes',
      'Miercoles',
      'Jueves',
      'Viernes',
      'Sabado',
      'Domingo',
    ],
    datasets: [
      {
        label: 'Tiempo de Conexión (min)',
        data: [26, 25, 15, 30, 20, 5, 8],
        borderColor: 'rgba(54, 162, 235, 1)',
        fill: false,
      },
    ],
  };

  const npsChartData = {
    labels: [
      'Soft Skills',
      'Comunicaciòn',
      'Programacion2',
      'Lideres',
      'Gestion del Cambio',
    ],
    datasets: [
      {
        label: 'NPS',
        data: [50, 60, 70, 80, 90],
        backgroundColor: 'rgba(255, 159, 64, 1)',
      },
    ],
  };

  const satisfactionChartData = {
    labels: [
      '5 Estrellas',
      '4 Estrellas',
      '3 Estrellas',
      '2 Estrellas',
      '1 Estrella',
    ],
    datasets: [
      {
        label: 'Encuesta de Satisfacción',
        data: [6, 3, 1, 0, 0],
        backgroundColor: 'rgba(255, 205, 86, 1)',
      },
    ],
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
          <div className="bg-white shadow-lg rounded-lg p-4 border-2 h-64">
            <Line
              data={lineChartData}
              options={{ maintainAspectRatio: false, layout: { padding: 20 } }}
            />
          </div>
          <div className="bg-white shadow-lg rounded-lg p-4 border-2 h-64">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
          <div className="bg-white shadow-lg rounded-lg p-4 border-2 h-64">
            <Bubble
              data={bubbleChartData}
              options={{ maintainAspectRatio: false, layout: { padding: 20 } }}
            />
          </div>
          <div className="bg-white shadow-lg rounded-lg p-4 border-2 h-64">
            <Bar
              data={satisfactionChartData}
              options={{ maintainAspectRatio: false, layout: { padding: 20 } }}
            />
          </div>
          <div className="bg-white shadow-lg rounded-lg p-4 border-2 h-64">
            <h2 className="text-xl text-center font-bold mb-2">
              Cantidad de Estudiantes
            </h2>
            <Doughnut data={donutChartData2} options={donutChartOptions} />
          </div>
          <div className="bg-white shadow-lg rounded-lg p-4 border-2 h-64">
            <Bar
              data={npsChartData}
              options={{ maintainAspectRatio: false, layout: { padding: 20 } }}
            />
          </div>
          <div className="bg-white shadow-lg rounded-lg p-4 border-2 h-64">
            <Line
              data={lineChartTimeData}
              options={{ maintainAspectRatio: false, layout: { padding: 20 } }}
            />
          </div>
          <div className="bg-white shadow-lg rounded-lg p-4 border-2 h-64">
            <Bubble
              data={bubbleChartData}
              options={{ maintainAspectRatio: false, layout: { padding: 20 } }}
            />
          </div>
          <div className="bg-white shadow-lg rounded-lg p-4 border-2 h-64">
            <Bar
              data={npsChartData}
              options={{ maintainAspectRatio: false, layout: { padding: 20 } }}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SidebarAdminCorporate;
