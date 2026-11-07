import useSWR from "swr";
import { backendPaths } from "../paths";
import { fetcher } from "@/libs/api/client";
import type { LifePlan } from "@/types/lifePlan";

/**
 * ライフプランの一覧取得
 */
export const useFetchLifePlans = () => {
  const { data, isLoading } = useSWR<Array<LifePlan>>(
    backendPaths.lifePlan.index,
    fetcher,
  );

  return { lifePlans: data, isLoading };
};
