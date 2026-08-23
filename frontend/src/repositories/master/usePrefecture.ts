import type { Prefectures } from "@/types/master";
import useSWR from "swr";
import { backendPaths } from "../paths";
import { fetcher } from "@/libs/api/client";

export const useGetPrefectures = () => {
  const { data, isLoading, error } = useSWR<Prefectures>(
    backendPaths.prefecture.index,
    fetcher,
  );

  return {
    prefectures: data,
    isLoading,
    error,
  };
};
