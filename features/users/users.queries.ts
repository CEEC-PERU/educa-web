import { useQuery } from "@tanstack/react-query";
import { fetchClassroomStudents, fetchUserCount } from "./users.api";
import { usersKeys } from "./users.query-keys";

export function useClassroomStudentsQuery(
  userId: number | undefined,
  enterpriseId: number | undefined,
) {
  return useQuery({
    queryKey: usersKeys.classroom(userId ?? 0, enterpriseId ?? 0),
    queryFn: () =>
      fetchClassroomStudents(userId as number, enterpriseId as number),
    enabled: typeof userId === "number" && typeof enterpriseId === "number",
  });
}

export function useUserCountQuery(enterpriseId: number | undefined) {
  return useQuery({
    queryKey: usersKeys.count(enterpriseId ?? 0),
    queryFn: () => fetchUserCount(enterpriseId as number),
    enabled: typeof enterpriseId === "number",
  });
}
