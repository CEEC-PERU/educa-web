// components/EvaluationWizard/EvaluationWizard.tsx
import Wizard from '../../components/Wizard';
import StepOne from '../../pages/content/evaluation/StepOne';
import StepTwo from '../../pages/content/evaluation/StepTwo';
import StepThree from '../../pages/content/evaluation/StepThree';
import StepSummary from '../../pages/content/evaluation/StepSummary';


interface EvaluationWizardProps {
  step: number;
  evaluationData: any;
  questionsData: any;
  optionsData: any;
  nextStep: () => void;
  prevStep: () => void;
  setEvaluationData: (data: any) => void;
  setQuestionsData: (data: any) => void;
  setOptionsData: (data: any) => void;
  completeForm: () => Promise<void>;
}

export const EvaluationWizard = ({
  step,
  evaluationData,
  questionsData,
  optionsData,
  nextStep,
  prevStep,
  setEvaluationData,
  setQuestionsData,
  setOptionsData,
  completeForm,
}: EvaluationWizardProps) => {
  return (
    <div className="container bg-gradient-to-b rounded-lg">
      <Wizard currentStep={step} />
      {step === 1 && (
        <StepOne
          nextStep={nextStep}
          setEvaluationData={setEvaluationData}
          evaluationData={evaluationData}
        />
      )}
      {step === 2 && (
        <StepTwo
          nextStep={nextStep}
          prevStep={prevStep}
          setQuestionsData={setQuestionsData}
          initialQuestions={questionsData}
        />
      )}
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
  );
};
