import type { SignupForm } from "@/components/auth/Signup/useSignup";
import { postRequest } from "@/libs/api/client";
import type { AccountCreateResponse } from "@/types/apiResponse";
import useSWRMutation from "swr/mutation";

/**
 * アカウント作成
 */
export const useCreateAccount = () => {
  const { trigger, isMutating } = useSWRMutation<
    AccountCreateResponse,
    Error,
    string,
    SignupForm
  >("/signup", postRequest, {
    onSuccess: () => {
      console.log("自身の情報を取得するAPIへリクエストを投げる");
    },
  });

  return { postCreateAccount: trigger, isMutating };
};
