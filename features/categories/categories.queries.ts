import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "./categories.api";
import { categoriesKeys } from "./categories.query-keys";

export function useCategoriesQuery() {
  return useQuery({
    queryKey: categoriesKeys.list(),
    queryFn: fetchCategories,
  });
}
