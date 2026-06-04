import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AppError } from "@/lib/http/error";
import { createUser, deleteUser, reactivateUser } from "./users.api";
import { usersKeys } from "./users.query-keys";

export function useCreateUserMutation(
  userId: number | undefined,
  enterpriseId: number | undefined,
) {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, Record<string, unknown>>({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: usersKeys.classroom(userId ?? 0, enterpriseId ?? 0),
      });
      queryClient.invalidateQueries({
        queryKey: usersKeys.count(enterpriseId ?? 0),
      });
    },
  });
}

export function useDeleteUserMutation(
  userId: number | undefined,
  enterpriseId: number | undefined,
) {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, number>({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: usersKeys.classroom(userId ?? 0, enterpriseId ?? 0),
      });
      queryClient.invalidateQueries({
        queryKey: usersKeys.count(enterpriseId ?? 0),
      });
    },
  });
}

export function useReactivateUserMutation(
  userId: number | undefined,
  enterpriseId: number | undefined,
) {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, number>({
    mutationFn: reactivateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: usersKeys.classroom(userId ?? 0, enterpriseId ?? 0),
      });
      queryClient.invalidateQueries({
        queryKey: usersKeys.count(enterpriseId ?? 0),
      });
    },
  });
}
