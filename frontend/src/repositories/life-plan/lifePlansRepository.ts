import useSWR, { mutate } from "swr";
import useSWRMutation from "swr/mutation";
import { backendPaths } from "../paths";
import { fetcher, postRequest } from "@/libs/api/client";
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

/** ライフプラン作成APIのリクエスト */
export type CreateLifePlanParams = {
  lifePlan: {
    name: string;
    startFrom: number;
    endTo: number | null;
  };
};

/**
 * ライフプランの新規作成
 */
export const usePostLifePlan = () => {
  const { trigger, isMutating } = useSWRMutation<
    LifePlan,
    Error,
    string,
    CreateLifePlanParams
  >(backendPaths.lifePlan.create, postRequest, {
    onSuccess: () => mutate(backendPaths.lifePlan.index),
  });

  return { createLifePlan: trigger, isMutating };
};
