import useSWR, { mutate } from "swr";
import useSWRMutation from "swr/mutation";
import { backendPaths } from "../paths";
import {
  deleteRequest,
  fetcher,
  postRequest,
  putRequest,
} from "@/libs/api/client";
import type { FamilyMember, Relationship } from "@/types/familyMember";

/**
 * 家族メンバーの一覧取得
 */
export const useFetchFamilyMembers = (lifePlanId: number) => {
  const { data, isLoading } = useSWR<Array<FamilyMember>>(
    backendPaths.lifePlan.familyMember.index(lifePlanId),
    fetcher,
  );

  return { familyMembers: data, isLoading };
};

/** 家族メンバー作成APIのリクエスト */
export type CreateFamilyMemberParams = {
  familyMember: {
    name: string;
    relationship: Relationship;
    birthday: string;
  };
};

/**
 * 家族メンバーの登録
 */
export const usePostFamilyMember = (lifePlanId: number) => {
  const { trigger, isMutating } = useSWRMutation<
    FamilyMember,
    Error,
    string,
    CreateFamilyMemberParams
  >(backendPaths.lifePlan.familyMember.create(lifePlanId), postRequest, {
    onSuccess: () =>
      mutate(backendPaths.lifePlan.familyMember.index(lifePlanId)),
  });

  return { createFamilyMember: trigger, isMutating };
};

/**
 * 家族メンバーの更新
 */
export const usePutFamilyMember = (lifePlanId: number, id: number) => {
  const { trigger, isMutating } = useSWRMutation<
    FamilyMember,
    Error,
    string,
    CreateFamilyMemberParams
  >(backendPaths.lifePlan.familyMember.update(lifePlanId, id), putRequest, {
    onSuccess: () =>
      mutate(backendPaths.lifePlan.familyMember.index(lifePlanId)),
  });

  return { updateFamilyMember: trigger, isMutating };
};

/**
 * 家族メンバーの削除
 */
export const useDeleteFamilyMember = (lifePlanId: number, id: number) => {
  const { trigger, isMutating } = useSWRMutation<FamilyMember, Error, string>(
    backendPaths.lifePlan.familyMember.delete(lifePlanId, id),
    deleteRequest,
    {
      onSuccess: () =>
        mutate(backendPaths.lifePlan.familyMember.index(lifePlanId)),
    },
  );

  return { deleteFamilyMember: trigger, isMutating };
};
