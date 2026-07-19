import { fetcher } from "@/libs/api/client";
import type { MeResponse } from "@/types/apiResponse";
import useSWR from "swr";

export const useMe = () => {
  const { data, isLoading, error } = useSWR<MeResponse>("/me", fetcher, {
    shouldRetryOnError: false,
  });

  return {
    data,
    isLoading,
    error,
  };
};
