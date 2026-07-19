import type { SignupForm } from "@/components/auth/Signup/useSignup";
import { postRequest } from "@/libs/api/client";
import type { AccountCreateResponse } from "@/types/apiResponse";
import { mutate } from "swr";
import useSWRMutation from "swr/mutation";

/**
 * アカウント作成
 */
export const usePostAccount = () => {
  const { trigger, isMutating } = useSWRMutation<
    AccountCreateResponse,
    Error,
    string,
    SignupForm
  >("/signup", postRequest, {
    onSuccess: async () => {
      await mutate("/me", undefined, { revalidate: true });
    },
  });

  return { postCreateAccount: trigger, isMutating };
};

/**
 * ログイン
 */
export const usePostLogin = () => {
  const { trigger, isMutating } = useSWRMutation("/login", postRequest, {
    onSuccess: async () => {
      await mutate("/me", undefined, { revalidate: true });
    },
  });

  return { postLogin: trigger, isMutating };
};
