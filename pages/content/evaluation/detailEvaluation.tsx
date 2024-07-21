import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/Content/SideBar';
import DetailContainer from './DetailContainer';
import QuestionsContainer from './QuestionsContainer';
import { getEvaluationById, updateEvaluation, deleteEvaluation, getQuestionTypes } from '../../../services/evaluationService';
import { Evaluation, Question, QuestionType, Option } from '../../../interfaces/Evaluation';
import { useRouter } from 'next/router';
import './../../../app/globals.css';

const EvaluationDetail: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionTypes, setQuestionTypes] = useState<QuestionType[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchEvaluation = async () => {
      if (id) {
        const data = await getEvaluationById(Number(id));
        setEvaluation(data.evaluation);
        setQuestions(data.questions.map(question => ({
          ...question,
          options: question.options || [],
        })));
      }
    };
    const fetchQuestionTypes = async () => {
      const types = await getQuestionTypes();
      setQuestionTypes(types);
    };
    fetchEvaluation();
    fetchQuestionTypes();
  }, [id]);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
    localStorage.setItem('sidebarState', JSON.stringify(!showSidebar));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleDelete = async () => {
    if (evaluation) {
      await deleteEvaluation(evaluation.evaluation_id);
      router.push('/content/evaluation/listEvaluations');
    }
  };

  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (evaluation) {
      const updatedEvaluation: Evaluation = {
        ...evaluation,
        name: (document.getElementById('evaluationName') as HTMLInputElement).value,
        description: (document.getElementById('evaluationDescription') as HTMLTextAreaElement).value
      };
      const updatedQuestions: Question[] = questions.map((question, questionIndex) => {
        const updatedOptions: Option[] = (question.options || []).map((option, optIndex) => ({
          ...option,
          option_id: option.option_id ? option.option_id : undefined,
          option_text: (document.getElementById(`optionText${questionIndex}-${optIndex}`) as HTMLInputElement).value,
          is_correct: (document.getElementById(`optionCorrect${questionIndex}-${optIndex}`) as HTMLInputElement).checked,
        }));
        return {
          ...question,
          question_text: (document.getElementById(`questionText${questionIndex}`) as HTMLInputElement).value,
          type_id: parseInt((document.getElementById(`questionType${questionIndex}`) as HTMLSelectElement).value),
          score: parseInt((document.getElementById(`questionScore${questionIndex}`) as HTMLInputElement).value),
          options: updatedOptions,
        };
      });

      try {
        await updateEvaluation(updatedEvaluation, updatedQuestions);
        setEvaluation(updatedEvaluation);
        setQuestions(updatedQuestions);
        setIsEditing(false);
      } catch (error) {
        console.error('Error al guardar la evaluación:', error);
      }
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90"/>
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <main className={`flex-grow p-6 transition-all duration-300 ease-in-out ${showSidebar ? 'ml-5' : ''}`}>
          <div className="grid grid-cols-1 mx-auto">
            <div className="container mx-auto flex">
              <DetailContainer
                evaluation={evaluation}
                isEditing={isEditing}
                onEditToggle={handleEditToggle}
                onSave={handleSave}
                onDelete={handleDelete}
              />
              <QuestionsContainer
                questions={questions}
                isEditing={isEditing}
                questionTypes={questionTypes}
                setQuestions={setQuestions}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EvaluationDetail;
