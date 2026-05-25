import React, { useEffect, useState } from "react";
import AppLayout from "../../../components/layouts/AppLayout";
import type { NextPageWithLayout } from "../../../types/next";
import DetailContainer from "./DetailContainer";
import QuestionsContainer from "./QuestionsContainer";
import {
  useEvaluationByIdQuery,
  useQuestionTypesQuery,
} from "@/features/evaluations/evaluations.queries";
import {
  useUpdateEvaluationMutation,
  useDeleteEvaluationMutation,
} from "@/features/evaluations/evaluations.mutations";
import { getUserFacingMessage } from "@/lib/http/error";
import { Evaluation, Question, Option } from "../../../interfaces/Evaluation";
import { useRouter } from "next/router";

const EvaluationDetail: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;
  const evaluationId = id ? Number(id) : undefined;

  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const evaluationQuery = useEvaluationByIdQuery(evaluationId);
  const questionTypesQuery = useQuestionTypesQuery();
  const updateEvaluationMutation = useUpdateEvaluationMutation();
  const deleteEvaluationMutation = useDeleteEvaluationMutation();

  const questionTypes = questionTypesQuery.data ?? [];

  useEffect(() => {
    if (evaluationQuery.data) {
      setEvaluation(evaluationQuery.data.evaluation);
      setQuestions(
        evaluationQuery.data.questions.map((question) => ({
          ...question,
          options: question.options || [],
        })),
      );
    }
  }, [evaluationQuery.data]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleDelete = async () => {
    if (evaluation) {
      try {
        await deleteEvaluationMutation.mutateAsync(evaluation.evaluation_id);
        router.push("/content/evaluation/listEvaluations");
      } catch (err) {
        console.error("Error deleting evaluation:", getUserFacingMessage(err));
      }
    }
  };

  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (evaluation) {
      const updatedEvaluation: Evaluation = {
        ...evaluation,
        name: (document.getElementById("evaluationName") as HTMLInputElement)
          .value,
        description: (
          document.getElementById(
            "evaluationDescription",
          ) as HTMLTextAreaElement
        ).value,
      };
      const updatedQuestions: Question[] = questions.map(
        (question, questionIndex) => {
          const updatedOptions: Option[] = (question.options || []).map(
            (option, optIndex) => ({
              ...option,
              option_id: option.option_id ? option.option_id : undefined,
              option_text: (
                document.getElementById(
                  `optionText${questionIndex}-${optIndex}`,
                ) as HTMLInputElement
              ).value,
              is_correct: (
                document.getElementById(
                  `optionCorrect${questionIndex}-${optIndex}`,
                ) as HTMLInputElement
              ).checked,
            }),
          );
          return {
            ...question,
            question_text: (
              document.getElementById(
                `questionText${questionIndex}`,
              ) as HTMLInputElement
            ).value,
            type_id: parseInt(
              (
                document.getElementById(
                  `questionType${questionIndex}`,
                ) as HTMLSelectElement
              ).value,
            ),
            score: parseInt(
              (
                document.getElementById(
                  `questionScore${questionIndex}`,
                ) as HTMLInputElement
              ).value,
            ),
            options: updatedOptions,
          };
        },
      );

      try {
        await updateEvaluationMutation.mutateAsync({
          evaluation: updatedEvaluation,
          questions: updatedQuestions,
        });
        setEvaluation(updatedEvaluation);
        setQuestions(updatedQuestions);
        setIsEditing(false);
      } catch (err) {
        console.error(
          "Error al guardar la evaluación:",
          getUserFacingMessage(err),
        );
      }
    }
  };

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="w-full max-w-5xl flex flex-col md:flex-row justify-center space-y-6 md:space-y-0 md:space-x-6">
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
    </>
  );
};

EvaluationDetail.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default EvaluationDetail;
