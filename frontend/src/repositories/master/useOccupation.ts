import { fetcher } from "@/libs/api/client";
import type { Occupations } from "@/types/master";
import useSWR from "swr";
import { backendPaths } from "../paths";

export const useGetOccupations = () => {
  const { data, isLoading, error } = useSWR<Occupations>(
    backendPaths.occupation.index,
    fetcher,
  );

  return {
    occupations: data,
    isLoading,
    error,
  };
};
