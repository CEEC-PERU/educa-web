export interface GradeAttempt {
  puntaje?: unknown;
}

export const getHighestAttemptGrade = (
  attempts?: GradeAttempt[] | null,
): number | null => {
  const grades = (attempts ?? [])
    .map(({ puntaje }) => {
      if (puntaje === null || puntaje === undefined || puntaje === "") return null;
      const grade = Number(puntaje);
      return Number.isFinite(grade) ? grade : null;
    })
    .filter((grade): grade is number => grade !== null);

  return grades.length > 0 ? Math.max(...grades) : null;
};
