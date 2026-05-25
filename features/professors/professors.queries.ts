import { useQuery } from "@tanstack/react-query";
import { fetchProfessors, fetchProfessor, fetchLevels } from "./professors.api";
import { professorsKeys, levelsKeys } from "./professors.query-keys";

export function useProfessorsQuery() {
  return useQuery({
    queryKey: professorsKeys.list(),
    queryFn: fetchProfessors,
  });
}

export function useProfessorQuery(professorId: number | undefined) {
  return useQuery({
    queryKey: professorsKeys.detail(professorId ?? "missing"),
    queryFn: () => fetchProfessor(professorId as number),
    enabled: typeof professorId === "number" && Number.isFinite(professorId),
  });
}

export function useLevelsQuery() {
  return useQuery({
    queryKey: levelsKeys.list(),
    queryFn: fetchLevels,
  });
}
