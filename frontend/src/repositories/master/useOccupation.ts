import { fetcher } from "@/libs/api/client";
import type { Occupations } from "@/types/master";
import useSWR from "swr";
import { paths } from "../paths";

export const useGetOccupations = () => {
  const { data, isLoading, error } = useSWR<Occupations>(
    paths.occupation.index,
    fetcher,
  );

  return {
    occupations: data,
    isLoading,
    error,
  };
};
