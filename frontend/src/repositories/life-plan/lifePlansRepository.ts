import useSWR, { mutate } from "swr";
import useSWRMutation from "swr/mutation";
import { backendPaths } from "../paths";
import {
  deleteRequest,
  fetcher,
  postRequest,
  putRequest,
} from "@/libs/api/client";
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

/**
 * ライフプランの詳細取得
 */
export const useFetchLifePlan = (id: number) => {
  const { data, isLoading, error } = useSWR<LifePlan>(
    backendPaths.lifePlan.show(id),
    fetcher,
  );

  return { lifePlan: data, isLoading, error };
};

/** ライフプラン作成・更新APIのリクエスト */
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

/**
 * ライフプランの更新
 */
export const usePutLifePlan = (id: number) => {
  const { trigger, isMutating } = useSWRMutation<
    LifePlan,
    Error,
    string,
    CreateLifePlanParams
  >(backendPaths.lifePlan.update(id), putRequest, {
    onSuccess: () => mutate(backendPaths.lifePlan.index),
  });

  return { updateLifePlan: trigger, isMutating };
};

/**
 * ライフプランの削除
 */
export const useDeleteLifePlan = (id: number) => {
  const { trigger, isMutating } = useSWRMutation<LifePlan, Error, string>(
    backendPaths.lifePlan.delete(id),
    deleteRequest,
    {
      onSuccess: () => mutate(backendPaths.lifePlan.index),
    },
  );

  return { deleteLifePlan: trigger, isMutating };
};
