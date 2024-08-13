import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/admincorporative/CorporativeSideBar';
import { useAuth } from '../../context/AuthContext';
import './../../app/globals.css';
import { Profile } from '../../interfaces/UserInterfaces';
import { Bar, Line, Doughnut, Bubble } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement } from 'chart.js';
import { ChartOptions  } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement);
const Admincorporative: React.FC = () => {
  const { logout, user, profileInfo } = useAuth();

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

  const donutChartData = {
    labels: ['Curso A', 'Curso B', 'Curso C', 'Curso D', 'Curso E'],
    datasets: [{
      data: [100, 200, 150, 250, 300],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
    }],
  };
  

  const donutChartOptions: ChartOptions<'doughnut'> = {
    plugins: {
      legend: {
        position: 'right', // Asegura que el tipo sea compatible con los valores permitidos
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
    labels: ['Día 1', 'Día 2', 'Día 3', 'Día 4', 'Día 5'],
    datasets: [{
      label: 'Tiempo de Conexión (min)',
      data: [30, 45, 35, 50, 60],
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
      bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90 "
      borderColor="border border-stone-300"
      user={user ? { profilePicture: uri_picture } : undefined} />
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={true} setShowSidebar={() => {}} />
        <main className="p-6 flex-grow transition-all duration-300 ease-in-out ml-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="border border-black p-4 h-auto">
            <Line data={lineChartData} />
          </div>
          <div className="border border-black p-4 h-auto">
            <Bar data={barChartData} options={barChartOptions}  />
          </div>
          <div className="border border-black p-4 h-auto">
            <Bubble data={bubbleChartData} />
          </div>
         
          <div className="border border-black p-4 h-auto">
            <Bar data={satisfactionChartData} />
          </div>
          <div className="border border-black p-4 h-auto">
            <Doughnut data={donutChartData} options={donutChartOptions} />
          </div>
          <div className="border border-black p-4 h-auto">
            <Bar data={npsChartData} />
          </div>
          <div className="border border-black p-4 h-auto">
            <Line data={lineChartTimeData} />
          </div>
          <div className="border border-black p-4 h-auto">
            <Bubble data={bubbleChartData} />
          </div>
          <div className="border border-black p-4 h-auto">
            <Bar data={horizontalBarChartData} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admincorporative;
