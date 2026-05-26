import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Navbar from "../../components/Navbar";
import ChartCard from "../../components/dashboard/ChartCard";
import Sidebar from "../../components/supervisor/SibebarSupervisor";
import { useAuth } from "../../context/AuthContext";
import "./../../app/globals.css";
import { useMetricaCorporate } from "../../hooks/dashboard/useMetricaCorporate";
import { useCourseStudent } from "../../hooks/useCourseStudents";
import { useCourseProgress } from "../../hooks/useProgressCurso";
import { useAnswerTemplate } from "../../hooks/useAnswerTemplate";
import {
  useTop,
  useAverageTime,
  useNPS,
} from "../../hooks/dashboard/useDashboardCorporative";

import { QuestionTemplate } from "../../interfaces/Template";
import { useTemplates } from "../../hooks/useTemplate";
// Dynamically import Chart with no SSR
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const CorporateDashboard: React.FC = () => {
  const { logout, user, profileInfo } = useAuth();
  const { donutChartData, isLoading } = useMetricaCorporate();
  const enterpriseId = user
    ? (user as { id: number; role: number; dni: string; enterprise_id: number })
        .enterprise_id
    : null;
  const { courseStudent } = useCourseStudent();
  const [selectedCourse, setSelectedCourse] = useState<number | undefined>(
    undefined,
  );
  const { courseProgressData, loading, error } =
    useCourseProgress(selectedCourse);
  const { topRanking } = useTop(selectedCourse);
  const { averagetime } = useAverageTime();
  const { templates } = useTemplates();
  const [showPopup, setShowPopup] = useState(false);
  const [responses, setResponses] = useState<{ [key: number]: string }>({});
  const [error2, setError2] = useState<string | null>(null);
  console.log(templates);
  const { createAnswerTemplateUser } = useAnswerTemplate();
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const activeTemplate = templates.find((template) => template.is_active);

  const generateSatisfactionData = () => [
    Math.floor(Math.random() * 10) + 2,
    Math.floor(Math.random() * 15) + 5,
    Math.floor(Math.random() * 20) + 10,
    Math.floor(Math.random() * 25) + 15,
    Math.floor(Math.random() * 30) + 20,
    Math.floor(Math.random() * 8) + 1,
  ];

  const [satisfactionData, setSatisfactionData] = useState(
    generateSatisfactionData,
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setSatisfactionData(generateSatisfactionData());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {}, [templates]);

  const handleResponseChange = (questionId: number, answer: string) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [questionId]: answer,
    }));
  };

  const userInfo = user as { id: number };

  const handleSubmit = async () => {
    const unansweredQuestions = activeTemplate?.QuestionTemplates.filter(
      (question) => !responses[question.quest_temp_id],
    );

    if (unansweredQuestions && unansweredQuestions.length > 0) {
      setError2("Please answer all the questions.");
      return;
    }

    const answerTemplates = activeTemplate?.QuestionTemplates.map(
      (question) => {
        const response = responses[question.quest_temp_id];

        if (question.type === "closed") {
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
      },
    );

    if (answerTemplates && answerTemplates.length > 0) {
      try {
        console.log(answerTemplates);

        await createAnswerTemplateUser(answerTemplates);

        setShowPopup(false);
        setSubmitSuccess(true);

        setResponses({});
        setError2(null);

        setTimeout(() => {
          setSubmitSuccess(false);
        }, 2000);
      } catch (error) {
        console.error("Error submitting answer template:", error);
        setError2("An error occurred while submitting your answer.");
      }
    }
  };

  const handleIconClick = () => {
    setShowPopup(true);
  };

  const courseTimeData = [
    { course: "Protocolo de Atención al Cliente", Tiempo: 42 },
    { course: "CP Pospago", Tiempo: 67 },
    { course: "Formación Continua", Tiempo: 35 },
    { course: "Gestión Integral", Tiempo: 55 },
    { course: "Retenciones", Tiempo: 28 },
  ];

  const averageTimePerDayData = [
    { day: "Lunes", time: 46 },
    { day: "Martes", time: 20 },
    { day: "Miércoles", time: 35 },
    { day: "Jueves", time: 30 },
    { day: "Viernes", time: 25 },
    { day: "Sábado", time: 27 },
    { day: "Domingo", time: 36 },
  ];

  const courseCompletionData = [
    { course: "CP Pospago", completion: 1 },
    { course: "Formación Continua", completion: 0 },
  ];

  const dailyParticipationData = [
    { day: "Lunes", active: 2 },
    { day: "Martes", active: 5 },
    { day: "Miércoles", active: 1 },
    { day: "Jueves", active: 1 },
    { day: "Viernes", active: 2 },
    { day: "Sábado", active: 0 },
    { day: "Domingo", active: 0 },
  ];

  const moduleCompletionData = (course: string) => {
    if (course === "CP Pospago") {
      return [
        { module: "Formación Integral ", completion: 0 },
        { module: "Gestión Integral ", completion: 0 },
      ];
    } else if (course === "Formación Continua") {
      return [{ module: "Retenciones 1", completion: 0 }];
    }
    return [];
  };

  const satisfactionSurveyData = (course: string) => {
    if (course === "CP Pospago") {
      return [0, 0, 0, 0, 0, 0];
    } else if (course === "Formación Continua") {
      return [0, 0, 0, 0, 0];
    }
    return [];
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar
        bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90"
        borderColor="border border-stone-300"
      />
      <div className="flex flex-1 pt-16 ">
        <Sidebar showSidebar={true} setShowSidebar={() => {}} />
        <main className="p-6 flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pl-20">
          <div
            className="absolute top-5 right-5 cursor-pointer z-50"
            onClick={handleIconClick}
          >
            <div className="bg-red-500 rounded-full p-3 text-white relative">
              <span className="text-2xl">🔔</span>
              {activeTemplate && (
                <div className="absolute top-0 right-0 bg-white text-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  1
                </div>
              )}
            </div>
          </div>

          {showPopup && activeTemplate && (
            <div className="fixed top-0 right-0 bg-white p-8 shadow-lg rounded-lg z-50 w-1/2 max-w-lg animate__animated animate__fadeIn border-2 border-indigo-500">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-indigo-700">
                  Formulario de Encuesta
                </h2>
                <button
                  onClick={() => setShowPopup(false)}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <span className="text-xl">✕</span>
                </button>
              </div>
              <form className="mt-6 max-h-96 overflow-y-auto">
                {activeTemplate.QuestionTemplates.map(
                  (question: QuestionTemplate) => (
                    <div key={question.quest_temp_id} className="mb-6">
                      <label className="block text-sm font-medium text-indigo-600 pt-4 mb-3">
                        {question.question}
                      </label>
                      {question.type === "closed" ? (
                        <select
                          value={responses[question.quest_temp_id] || ""}
                          onChange={(e) =>
                            handleResponseChange(
                              question.quest_temp_id,
                              e.target.value,
                            )
                          }
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
                          value={responses[question.quest_temp_id] || ""}
                          onChange={(e) =>
                            handleResponseChange(
                              question.quest_temp_id,
                              e.target.value,
                            )
                          }
                          className="block w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Escriba su respuesta"
                        />
                      )}
                    </div>
                  ),
                )}
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

          {submitSuccess && (
            <div className="fixed top-0 left-0 right-0 bg-green-500 text-white p-4 text-center z-50">
              <p>
                Encuesta enviada satisfactoriamente. ¡Gracias por responder!
              </p>
            </div>
          )}

          <div className="mr-2 col-span-full">
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(Number(e.target.value))}
              className="block border-4 p-2 mr-4 text-black"
            >
              {courseStudent.length > 0 ? (
                courseStudent.map((course) => (
                  <option
                    key={course.course_id}
                    value={course.course_id}
                    className="text-black"
                  >
                    {course.Course.name}
                  </option>
                ))
              ) : (
                <option disabled className="text-gray-600">
                  No hay cursos asignados
                </option>
              )}
            </select>
          </div>
          <div className="chart-container border border-gray-300 p-4 rounded-lg bg-white shadow-md">
            <h2 className="text-lg font-semibold   text-black mb-2  ">
              Progreso del curso
            </h2>

            <Chart
              type="bar"
              series={[
                {
                  name: "Estudiantes",
                  data: courseProgressData.map((item) => item.Estudiantes),
                },
                {
                  name: "Progreso",
                  data: courseProgressData.map((item) => item.Progreso),
                },
              ]}
              options={{
                chart: { type: "bar" },
                xaxis: {
                  categories: courseProgressData.map((item) => item.course),
                  title: { text: "Cursos" },
                },
                yaxis: { title: { text: "Cantidad" } },
                colors: ["#3274C1", "#BCB623"],
                dataLabels: { enabled: true },
                legend: { position: "top" },
              }}
              height={300}
            />
          </div>

          <div className="chart-container border border-gray-300 p-4 rounded-lg bg-white shadow-md">
            <h2 className="text-lg font-semibold   text-black mb-2">
              Tiempo Promedio por Curso
            </h2>
            <Chart
              type="bar"
              series={[
                {
                  name: "Tiempo",
                  data: courseTimeData.map((item) => item.Tiempo),
                },
              ]}
              options={{
                chart: { type: "bar" },
                xaxis: {
                  categories: courseTimeData.map((item) => item.course),
                  title: { text: "Cursos" },
                },
                yaxis: { title: { text: "Tiempo(minutos)" } },
                colors: ["#3274C1"],
                dataLabels: { enabled: true },
                legend: { position: "top" },
              }}
              height={300}
            />
          </div>

          {/* Calificaciones de Asesores */}
          {/* Top 5 de Asesores - Versión Mejorada */}
          <ChartCard
            title="Top 5 de Asesores"
            type="bar"
            series={[
              {
                name: "Puntaje",
                data: topRanking.map((item) => item.puntaje),
              },
            ]}
            options={{
              plotOptions: {
                bar: {
                  borderRadius: 6,
                  columnWidth: "60%",
                },
              },
              xaxis: {
                categories: topRanking.map((item) => item.name),
                labels: {
                  formatter: (value) =>
                    value.length > 15 ? `${value.substring(0, 15)}...` : value,
                },
              },
              yaxis: {
                max: 20,
                min: 0,
                tickAmount: 5,
              },
            }}
            badgeText="Puntaje "
          />

          {/* Gráfico de Tiempo promedio por día */}
          <div className="chart-container border border-gray-300 p-4 rounded-lg bg-white shadow-md">
            <h2 className="text-lg font-semibold   text-black mb-2">
              Tiempo promedio por día en la plataforma
            </h2>
            <Chart
              type="line"
              series={[
                { name: "Tiempo", data: averagetime.map((item) => item.time) },
              ]}
              options={{
                chart: { type: "line" },
                xaxis: {
                  categories: averagetime.map((item) => item.day),
                  title: { text: "Días" },
                },
                yaxis: { title: { text: "Tiempo (minutos)" } },
                colors: ["#1D4ED8"], // Set a line color
                stroke: { curve: "smooth" },
                dataLabels: { enabled: true },
                legend: { position: "top" },
              }}
              height={300}
            />
          </div>

          {/* Gráfico de Participación Diaria */}
          <div className="chart-container border border-gray-300 p-4 rounded-lg bg-white shadow-md">
            <h2 className="text-lg font-semibold  text-black mb-2">
              Participación Diaria (estudiantes activos)
            </h2>
            <Chart
              type="line"
              series={[
                {
                  name: "Tiempo",
                  data: dailyParticipationData.map((item) => item.active),
                },
              ]}
              options={{
                chart: { type: "line" },
                xaxis: {
                  categories: dailyParticipationData.map((item) => item.day),
                  title: { text: "Día" },
                },
                yaxis: { title: { text: "Cantidad Estudiantes" } },
                colors: ["#33b2df"],
                stroke: { curve: "smooth" },
                dataLabels: { enabled: true },
              }}
              height={300}
            />
          </div>

          {/* Gráfico de Dona Encuesta de Satisfacción */}
          <div className="chart-container border border-gray-300 p-4 rounded-lg bg-white shadow-md">
            <h2 className="text-lg font-semibold mb-2 text-black">
              Encuesta de Satisfacción
            </h2>
            {/*  satisfactionSurveyData('CP Pospago') selectedCourse */}
            <Chart
              type="donut"
              series={satisfactionData}
              options={{
                chart: { type: "donut" },
                labels: [
                  "⭐",
                  "⭐⭐",
                  "⭐⭐⭐",
                  "⭐⭐⭐⭐",
                  "⭐⭐⭐⭐⭐",
                  "N/A",
                ],
                colors: ["#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5"],
                legend: { position: "bottom" },
                dataLabels: { enabled: true },
              }}
              height={300}
            />
          </div>

          {/* Gráfico de NPS */}
          <ChartCard
            title="Del 1 al 10 ¿Qué tanto recomendarías este curso?"
            subtitle="Net Promoter Score (NPS)"
            type="bar"
            series={[
              { name: "Respuestas", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
            ]}
            options={{
              plotOptions: {
                bar: {
                  borderRadius: 4,
                  columnWidth: "70%",
                  distributed: true,
                },
              },
              colors: [
                "#EF4444", // 1-6 Rojo (Detractores)
                "#EF4444",
                "#EF4444",
                "#EF4444",
                "#EF4444",
                "#F59E0B", // 7-8 Amarillo (Neutrales)
                "#F59E0B",
                "#10B981", // 9-10 Verde (Promotores)
                "#10B981",
                "#10B981",
              ],
              xaxis: {
                categories: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
                title: {
                  text: "Puntuación",
                  style: {
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#4B5563",
                  },
                },
                axisBorder: {
                  show: false,
                },
                axisTicks: {
                  show: false,
                },
              },
              yaxis: {
                title: {
                  text: "Número de respuestas",
                  style: {
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#4B5563",
                  },
                },
                min: 0,
                forceNiceScale: true,
              },
              tooltip: {
                y: {
                  formatter: (val: number) =>
                    `${val} ${val === 1 ? "persona" : "personas"}`,
                },
              },
              dataLabels: {
                formatter: (val: number) => (val > 0 ? val.toString() : ""),
              },
            }}
            badgeText="NPS"
            height={350}
          />
        </main>
      </div>
    </div>
  );
};

export default CorporateDashboard;
