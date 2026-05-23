import React from "react";
import AppLayout from "../../../components/layouts/AppLayout";
import type { NextPageWithLayout } from "../../../types/next";
import { useEvaluationWizard } from "../../../components/Evaluation/hooks/LogicWizard";
import { EvaluationWizard } from "../../../components/Evaluation/WizardEvaluation";

const CreateEvaluationWizardPage: NextPageWithLayout = () => {
  const wizard = useEvaluationWizard();
  const adaptedCompleteForm = async () => {
    try {
      await wizard.completeForm();
    } catch (error) {
      console.error("Error completing evaluation:", error);
    }
  };

  return (
    <>
      <EvaluationWizard {...wizard} completeForm={adaptedCompleteForm} />
    </>
  );
};

CreateEvaluationWizardPage.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default CreateEvaluationWizardPage;
