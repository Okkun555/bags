import type { NewProfileRequest } from "@/components/setting/Profile/useNewProfile";
import { postRequest } from "@/libs/api/client";
import type { Profile } from "@/types/user";
import { mutate } from "swr";
import useSWRMutation from "swr/mutation";

export const usePostProfile = () => {
  const { trigger, isMutating } = useSWRMutation<
    Profile,
    Error,
    string,
    NewProfileRequest
  >("/profiles", postRequest, {
    onSuccess: async () => {
      await mutate("/me", undefined, { revalidate: true });
    },
  });

  return { postCreateProfile: trigger, isMutating };
};
