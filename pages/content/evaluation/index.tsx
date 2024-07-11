import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/Content/SideBar';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
import StepSummary from './StepSummary';
import Wizard from '../../../components/Wizard';
import { addEvaluation, addQuestion, addOption, getEvaluations } from '../../../services/evaluationService';
import { Evaluation, Question, Option } from '../../../interfaces/Evaluation';
import './../../../app/globals.css';

const CreateEvaluationWizard: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [step, setStep] = useState(1);
  const [evaluationData, setEvaluationData] = useState<Omit<Evaluation, 'evaluation_id'>>({ name: '', description: '' });
  const [questionsData, setQuestionsData] = useState<Omit<Question, 'question_id'>[]>([]);
  const [optionsData, setOptionsData] = useState<{ [key: number]: Omit<Option, 'option_id'>[] }>({});
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        const data = await getEvaluations();
        setEvaluations(data);
      } catch (error) {
        setError('Error fetching evaluations');
        console.error('Error fetching evaluations:', error);
      }
    };

    fetchEvaluations();
  }, []);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
    localStorage.setItem('sidebarState', JSON.stringify(!showSidebar));
  };

  const resetForm = () => {
    setEvaluationData({ name: '', description: '' });
    setQuestionsData([]);
    setOptionsData({});
    setStep(1);
  };

  const completeForm = async () => {
    console.log("Questions Data:", questionsData);
    console.log("Options Data:", optionsData);

    try {
      const newEvaluation = await addEvaluation(evaluationData);
      const evaluationId = newEvaluation.evaluation_id;

      for (const question of questionsData) {
        if (question.question_text && question.type_id !== undefined && question.score !== undefined) {
          const newQuestion = await addQuestion({ ...question, evaluation_id: evaluationId });
          const questionId = newQuestion.question_id;
          const questionOptions = optionsData[questionsData.indexOf(question)] || [];

          for (const option of questionOptions) {
            await addOption({ ...option, question_id: questionId });
          }
        } else {
          console.error('Question data is incomplete:', question);
        }
      }

      alert('Evaluación creada exitosamente');
      resetForm(); // Reinicia el formulario después de completarlo
    } catch (error) {
      console.error('Error creating evaluation:', error);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <main className={`flex-grow p-6 transition-all duration-300 ease-in-out ${showSidebar ? 'ml-64' : 'ml-0'}`}>
            <div className="container bg-gradient-to-b rounded-lg">
              <Wizard currentStep={step} />
              {step === 1 && <StepOne nextStep={nextStep} setEvaluationData={setEvaluationData} evaluationData={evaluationData} />}
              {step === 2 && <StepTwo nextStep={nextStep} prevStep={prevStep} setQuestionsData={setQuestionsData} initialQuestions={questionsData} />}
              {step === 3 && (
                <StepThree
                  prevStep={prevStep}
                  nextStep={nextStep}
                  questionsData={questionsData}
                  setOptionsData={setOptionsData}
                  optionsData={optionsData}
                />
              )}
              {step === 4 && (
                <StepSummary
                  prevStep={prevStep}
                  completeForm={completeForm}
                  questionsData={questionsData}
                  optionsData={optionsData}
                />
              )}
            </div>
        </main>
      </div>
    </div>
  );
};

export default CreateEvaluationWizard;
