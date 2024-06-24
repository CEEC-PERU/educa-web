// pages/index.tsx
import React, { useState } from 'react';
import Sidebar from '../../../components/SideBarPrueba';
import MainContent from '../../../components/MainContentPrueba';

const courseData = [
  {
    course_id: 1,
    name: "Programación",
    courseModules: [
      {
        name: "Modulo 1",
        is_active: false,
        module_id: 2,
        evaluation_id: 22,
        moduleSessions: [
          {
            session_id: 2,
            name: "Session 2",
            video_enlace: "http://res.cloudinary.com/dk2red18f/video/upload/v1719248534/oxfhjfov4ykgldyrjhil.mp4",
            duracion_minutos: "1:03"
          }
        ],
        moduleEvaluation: {
          evaluation_id: 22,
          name: "testin5",
          description: "testing5",
          questions: [
            {
              question_id: 5,
              question_text: "question1",
              score: 1,
              image: "http://res.cloudinary.com/dk2red18f/image/upload/v1719245631/zkrexhjthg09zfore8hi.jpg",
              evaluation_id: 22,
              type_id: 1,
              questionType: {
                type_id: 1,
                name: "abierto"
              },
              options: [
                {
                  option_id: 36,
                  option_text: "opcion 1",
                  is_correct: true
                },
                {
                  option_id: 37,
                  option_text: "opcion ",
                  is_correct: false
                }
              ]
            },
            {
              question_id: 6,
              question_text: "dfgd",
              score: 2,
              image: "",
              evaluation_id: 22,
              type_id: 2,
              questionType: {
                type_id: 2,
                name: "abierto"
              },
              options: [
                {
                  option_id: 38,
                  option_text: "opcion 1",
                  is_correct: true
                },
                {
                  option_id: 39,
                  option_text: "opcion2",
                  is_correct: false
                }
              ]
            }
          ]
        }
      }
    ]
  }
];

const Home: React.FC = () => {
  const [selectedSession, setSelectedSession] = useState<{ video?: string, questions?: any[] }>({});

  const handleSelect = (sessionName: string, evaluationName: string) => {
    const module = courseData[0].courseModules.find(m => 
      m.moduleSessions.some(s => s.name === sessionName) || m.moduleEvaluation.name === evaluationName);

    if (module) {
      const session = module.moduleSessions.find(s => s.name === sessionName);
      if (session) {
        setSelectedSession({ video: session.video_enlace });
      } else {
        setSelectedSession({ questions: module.moduleEvaluation.questions });
      }
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar courseModules={courseData[0].courseModules} onSelect={handleSelect} />
      <div className="flex-grow p-4">
        <MainContent sessionVideo={selectedSession.video} evaluationQuestions={selectedSession.questions} />
      </div>
    </div>
  );
};

export default Home;
