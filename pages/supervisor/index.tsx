import React, { useState , useEffect } from 'react';
import dynamic from 'next/dynamic'; // Import dynamic 
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/supervisor/SibebarSupervisor';
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

 useEffect(() => {
   // Ya no abrimos el pop-up automáticamente, solo se abre cuando el ícono es clickeado
 }, [templates]);

 // Función para manejar el cambio de respuestas
 const handleResponseChange = (questionId: number, answer: string) => {
   setResponses((prevResponses) => ({
     ...prevResponses,
     [questionId]: answer,
   }));
 };

  const userInfo = user as { id: number };

 

const handleSubmit = async () => {
  // Ensure all questions are answered
  const unansweredQuestions = activeTemplate?.QuestionTemplates.filter(
    (question) => !responses[question.quest_temp_id]
  );

  if (unansweredQuestions && unansweredQuestions.length > 0) {
    setError2("Please answer all the questions.");
    return;
  }

  // Prepare the answer templates (array of objects)
  const answerTemplates = activeTemplate?.QuestionTemplates.map((question) => {
    const response = responses[question.quest_temp_id];

    if (question.type === 'closed') {
      return {
        quest_temp_id: question.quest_temp_id,
        user_id: userInfo.id,
        selectedOption: response || null,
        openResponse: null,
      };
    } else {
      return {
        quest_temp_id: question.quest_temp_id,
        user_id: userInfo.id,
        selectedOption: null,
        openResponse: response || null,
      };
    }
  });

  if (answerTemplates && answerTemplates.length > 0) {
    try {
      console.log(answerTemplates)
      // Send the answer templates to the backend
      await createAnswerTemplateUser(answerTemplates);
// Hide the popup and reset the form after submission
setShowPopup(false); // Close the popup after submission
setSubmitSuccess(true);

// Reset responses and error messages
setResponses({}); // Clear form responses
setError2(null);

// Hide success message after 2 seconds
setTimeout(() => {
  setSubmitSuccess(false); // Hide the success message
}, 2000);
      
    } catch (error) {
      console.error('Error submitting answer template:', error);
      setError2("An error occurred while submitting your answer.");
    }
  }
};

 // Función que abre el pop-up cuando el ícono de notificación es clickeado
 const handleIconClick = () => {
   setShowPopup(true); // Mostrar el pop-up cuando se hace clic en el ícono
 };

  const courseTimeData = [
    { course: 'CP Pospago', Tiempo: 20 },
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
    { course: 'CP Pospago', completion: 1 },
    { course: 'Formación Continua', completion: 0 },
  ];

  const dailyParticipationData = [
    { day: 'Lunes', active: 0},
    { day: 'Martes', active: 0 },
    { day: 'Miércoles', active: 0 },
    { day: 'Jueves', active: 0 },
    { day: 'Viernes', active: 0 },
    { day: 'Sabado', active: 0 },
    { day: 'Domingo', active: 0},
  ];

  

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

 {/* Ícono de notificación para mostrar el cuestionario */}
 <div className="absolute top-5 right-5 cursor-pointer z-50" onClick={handleIconClick}>
            <div className="bg-red-500 rounded-full p-3 text-white relative">
              <span className="text-2xl">🔔</span>
              {/* Si existe una plantilla activa, mostrar el número "1" encima del ícono */}
              {activeTemplate && (
                <div className="absolute top-0 right-0 bg-white text-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  1
                </div>
              )}
            </div>
          </div>

          {/* Mostrar el pop-up de encuesta si hay una plantilla activa */}
          {showPopup && activeTemplate && (
            <div className="fixed top-0 right-0 bg-white p-8 shadow-lg rounded-lg z-50 w-1/2 max-w-lg animate__animated animate__fadeIn border-2 border-indigo-500">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-indigo-700">Formulario de Encuesta</h2>
                <button
                  onClick={() => setShowPopup(false)}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <span className="text-xl">✕</span>
                </button>
              </div>
              <form className="mt-6 max-h-96 overflow-y-auto">
                {activeTemplate.QuestionTemplates.map((question: QuestionTemplate) => (
                  <div key={question.quest_temp_id} className="mb-6">
                    <label className="block text-sm font-medium text-indigo-600 pt-4 mb-3">
                      {question.question}
                    </label>
                    {question.type === 'closed' ? (
                      <select
                        value={responses[question.quest_temp_id] || ''}
                        onChange={(e) => handleResponseChange(question.quest_temp_id, e.target.value)}
                        className="block w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="" disabled>
                          Seleccione una opción
                        </option>
                        {question.options?.map((option, index) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={responses[question.quest_temp_id] || ''}
                        onChange={(e) => handleResponseChange(question.quest_temp_id, e.target.value)}
                        className="block w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Escriba su respuesta"
                      />
                    )}
                  </div>
                ))}
                {error2 && <p className="text-red-500 text-sm">{error2}</p>}
                <div className="flex justify-end mt-6 space-x-4">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    Enviar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Mostrar mensaje de éxito */}
          {submitSuccess && (
            <div className="fixed top-0 left-0 right-0 bg-green-500 text-white p-4 text-center z-50">
              <p>Encuesta enviada satisfactoriamente. ¡Gracias por responder!</p>
            </div>
          )}

 {/* Dropdown Selector for Courses */}
 <div className="mr-2 col-span-full">

  {/* Resto del contenido */}
  
         

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
  className="block border-4 p-2 mr-4 text-black"
>
  {courseStudent.length > 0 ? (
    courseStudent.map((course) => (
      <option key={course.course_id} value={course.course_id} className="text-black">
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

 
<h2 className="text-lg font-semibold   text-black mb-2  " >Progreso del curso</h2>

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
          <h2 className="text-lg font-semibold   text-black mb-2">Tiempo Promedio por Curso</h2>
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
          <h2 className="text-lg font-semibold   text-black mb-2">Top 5  de Asesores</h2>
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
  <h2 className="text-lg font-semibold   text-black mb-2">Tiempo promedio por día en la plataforma</h2>
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
            <h2 className="text-lg font-semibold  text-black mb-2">Participación Diaria (estudiantes activos)</h2>
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
          <h2 className="text-lg font-semibold  text-black mb-2">Tasa de Finalización de Cursos</h2>
            
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
            <h2 className="text-lg font-semibold text-black mb-2">Compleción de Módulos</h2>
            <select value={selectedCourse} onChange={(e) => setSelectedCourse(Number(e.target.value))} className="mt-2 block w-full">
              <option value="CP Pospago">CP Pospago</option>
              <option value="Formación Continua">Formación Continua</option>
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
          <h2 className="text-lg font-semibold mb-2 text-black">Encuesta de Satisfacción</h2>
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
          <h2 className="text-lg font-semibold mb-2 text-black">Del 1 al 10 ¿Què tanto recomendarías este curso?</h2>
            
            <Chart
              type="bar"
              series={[{ name: 'NPS', data: npsData('CP Pospago') }]}
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
