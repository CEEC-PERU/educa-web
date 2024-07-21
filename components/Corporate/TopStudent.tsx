import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the components in ChartJS
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Student {
  first_name: string;
  last_name: string;
  loginCount: number;
}

interface TopStudentsChartProps {
  students: Student[];
}

const TopStudentsChart: React.FC<TopStudentsChartProps> = ({ students }) => {
  const topStudents = students.sort((a, b) => b.loginCount - a.loginCount).slice(0, 3);

  const data = {
    labels: topStudents.map(student => `${student.first_name} ${student.last_name}`),
    datasets: [{
      label: 'Sesiones Iniciadas',
      data: topStudents.map(student => student.loginCount),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className="w-full md:w-1/2 p-4">
      <Bar data={data} options={options} />
    </div>
  );
};

export default TopStudentsChart;