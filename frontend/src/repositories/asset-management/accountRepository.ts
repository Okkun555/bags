import useSWR, { mutate } from "swr";
import { backendPaths } from "../paths";
import { fetcher, postRequest } from "@/libs/api/client";
import type { Account } from "@/types/assetManagement";
import useSWRMutation from "swr/mutation";
import type { AddAccountForm } from "@/components/asset-management/AccountMaster/AddAccountDialog/useAddAccountDialog";

/**
 * 口座の一覧取得
 */
export const useFetchAccounts = () => {
  const { data, isLoading } = useSWR<Array<Account>>(
    backendPaths.assetManagement.account.index,
    fetcher,
  );

  return { accounts: data, isLoading };
};

/**
 * 口座の追加
 */
export const usePostAccount = () => {
  const { trigger, isMutating } = useSWRMutation<
    Account,
    Error,
    string,
    AddAccountForm
  >(backendPaths.assetManagement.account.create, postRequest, {
    onSuccess: () => mutate(backendPaths.assetManagement.account.index),
  });

  return { postAccount: trigger, isMutating };
};
