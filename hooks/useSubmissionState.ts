import { useState, useCallback } from "react";

interface SubmissionState {
  isSubmitting: boolean;
  error: string | null;
}

export const useSubmissionState = () => {
  const [state, setState] = useState<SubmissionState>({
    isSubmitting: false,
    error: null,
  });

  const startSubmission = useCallback(() => {
    setState({ isSubmitting: true, error: null });
  }, []);

  const endSubmission = useCallback(() => {
    setState((prev) => ({ ...prev, isSubmitting: false }));
  }, []);

  const setError = useCallback((error: string) => {
    setState({ isSubmitting: false, error });
  }, []);

  const reset = useCallback(() => {
    setState({ isSubmitting: false, error: null });
  }, []);

  return {
    ...state,
    startSubmission,
    endSubmission,
    setError,
    reset,
  };
};
