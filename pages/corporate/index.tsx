import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Corporate/CorporateSideBar';
import { useAuth } from '../../context/AuthContext';
import { Bar, Line, Doughnut, Bubble } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement } from 'chart.js';
import { ChartOptions  } from 'chart.js';
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

  let name = '';
  let uri_picture = '';

  if (profileInfo) {
    const profile = profileInfo as Profile;
    name = profile.first_name;
    uri_picture = profile.profile_picture!;
  }

  // Example data for the charts
  const lineChartData = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    datasets: [{
      label: 'Usuarios que se suman a la plataforma',
      data: [10, 20, 30, 40, 50, 60, 70],
      borderColor: 'rgba(75, 192, 192, 1)',
      fill: false,
    }],
  };

  const barChartData = {
    labels: ['Curso A', 'Curso B', 'Curso C', 'Curso D', 'Curso E'],
    datasets: [{
      label: 'Vistas',
      text: 'Month',
      data: [150, 300, 100, 250, 400],
      backgroundColor: 'rgba(75, 192, 192, 1)',
    }],
  };
  const barChartOptions = {
    indexAxis: 'y' as 'y', // Especifica el tipo correcto de indexAxis
  };
//comentario2
const donutChartData2 = {
  labels: donutChartData?.labels,
  datasets: [{
    data: donutChartData?.datasets.data,
    backgroundColor: donutChartData?.datasets.backgroundColor,
    hoverBackgroundColor: donutChartData?.datasets.hoverBackgroundColor,
  }],
};


  

const donutChartOptions: ChartOptions<'doughnut'> = {
  plugins: {
    legend: {
      position: 'right',
      labels: {
        font: {
          size: 14, // Ajusta el tamaño de la fuente para que quepa más texto
        },
      },
    },
  },
};


  const bubbleChartData = {
    datasets: [
      {
        label: 'Progreso Individual',
        data: [
          { x: 1, y: 50, r: 10 },
          { x: 2, y: 60, r: 15 },
          { x: 3, y: 70, r: 20 },
          { x: 4, y: 80, r: 25 },
          { x: 5, y: 90, r: 30 },
        ],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
      },
    ],
  };

  const horizontalBarChartData = {
    labels: ['Curso A', 'Curso B', 'Curso C', 'Curso D', 'Curso E'],
    datasets: [{
      label: 'Estudiantes',
      data: [300, 200, 150, 400, 350],
      backgroundColor: 'rgba(153, 102, 255, 1)',
    }],
  };

  const lineChartTimeData = {
    labels: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes' ,'Sabado '  , 'Domingo' ],
    datasets: [{
      label: 'Tiempo de Conexión (min)',
      data: [30, 45, 35, 50, 60,20,40],
      borderColor: 'rgba(54, 162, 235, 1)',
      fill: false,
    }],
  };

  const npsChartData = {
    labels: ['Curso A', 'Curso B', 'Curso C', 'Curso D', 'Curso E'],
    datasets: [{
      label: 'NPS',
      data: [50, 60, 70, 80, 90],
      backgroundColor: 'rgba(255, 159, 64, 1)',
    }],
  };

  const satisfactionChartData = {
    labels: ['5 Estrellas', '4 Estrellas', '3 Estrellas', '2 Estrellas', '1 Estrella'],
    datasets: [{
      label: 'Encuesta de Satisfacción',
      data: [200, 150, 100, 50, 25],
      backgroundColor: 'rgba(255, 205, 86, 1)',
    }],
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
          <div className="bg-white shadow-lg rounded-lg p-4 border-2">
            <Line data={lineChartData} />
          </div>
          <div className="bg-white shadow-lg rounded-lg p-4 border-2">
            <Bar data={barChartData} options={barChartOptions}  />
          </div>
          <div className="bg-white shadow-lg rounded-lg p-4 border-2">
            <Bubble data={bubbleChartData} />
          </div>
         
          <div className="bg-white shadow-lg rounded-lg p-4 border-2">
            <Bar data={satisfactionChartData} />
          </div>
          <div className="bg-white shadow-lg rounded-lg p-4 border-2" >
            <h2 className="text-xl text-center font-bold mb-2 text-">Cantidad de Estudiantes</h2>
            <Doughnut data={donutChartData2} options={donutChartOptions} />
          </div>
          <div className="bg-white shadow-lg rounded-lg p-4 border-2">
            <Bar data={npsChartData} />
          </div>
          <div className="bg-white shadow-lg rounded-lg p-4 border-2">
            <Line data={lineChartTimeData} />
          </div>
          <div className="bg-white shadow-lg rounded-lg p-4 border-2">
            <Bubble data={bubbleChartData} />
          </div>
          <div className="bg-white shadow-lg rounded-lg p-4 border-2">
            <Bar data={horizontalBarChartData} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default CorporateDashboard;
