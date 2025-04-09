import React, { useState , useEffect } from 'react';
import dynamic from 'next/dynamic'; // Import dynamic 
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/calidad/SibebarCalidad';
import { useAuth } from '../../context/AuthContext';
import './../../app/globals.css';
import { useMetricaCorporate } from '../../hooks/useMetricaCorporate';
import { useCourseStudent } from '../../hooks/useCourseStudents';
import { useCourseProgress } from '../../hooks/useProgressCurso';
import { useAnswerTemplate} from '../../hooks/useAnswerTemplate';
import { useTop , useAverageTime} from '../../hooks/useTopRankingCorporative';

import { Template , QuestionTemplate } from '../../interfaces/Template';
import { useTemplates} from '../../hooks/useTemplate';
// Dynamically import Chart with no SSR
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const CorporateDashboard: React.FC = () => {
  const { logout, user, profileInfo } = useAuth();
  const { donutChartData, isLoading } = useMetricaCorporate();
  const enterpriseId = user ? (user as { id: number; role: number; dni: string; enterprise_id: number }).enterprise_id : null;
    const { courseStudent } = useCourseStudent();
  const [selectedCourse, setSelectedCourse] = useState<number | undefined>(undefined);
  const { courseProgressData, loading, error } = useCourseProgress(selectedCourse);
  const { topRanking } = useTop(selectedCourse);
  const { averagetime} = useAverageTime();
  const { templates} = useTemplates();
  const [showPopup, setShowPopup] = useState(false);
  const [responses, setResponses] = useState<{ [key: number]: string }>({});
  const [error2, setError2] = useState<string | null>(null);
console.log(templates);
const { createAnswerTemplateUser } = useAnswerTemplate();
const [submitSuccess, setSubmitSuccess] = useState(false);  
 // Filtrar las plantillas activas
 const activeTemplate = templates.find((template) => template.is_active);




  const userInfo = user as { id: number };

 

 

  

  const moduleCompletionData = (course: string) => {
    if (course === 'CP Pospago') {
      return [
        { module: 'Formación Integral ', completion: 0 },
        { module: 'Gestión Integral ', completion: 0 },
      ];
    } else if (course === 'Formación Continua') {
      return [{ module: 'Retenciones 1', completion: 0 }];
    }
    return [];
  };

  const satisfactionSurveyData = (course: string) => {
    if (course === 'CP Pospago') {
      return [0, 0, 0, 0, 0,33]; // Valores en porcentaje para cada estrella
    } else if (course === 'Formación Continua') {
      return [0, 0, 0, 0, 2];
    }
    return [];
  };

  const npsData = (course: string) => {
    if (course === 'CP Pospago') {
      return [0, 0, 0, 0, 0, 0, 0, 0, 2, 0]; // Valores de NPS
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

 


        </main>
      </div>
    </div>
  );
};

export default CorporateDashboard;
