import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateMatchArgs, Match } from "../backend.d";
import { useActor } from "./useActor";

export function useGetAllMatches() {
  const { actor, isFetching } = useActor();
  return useQuery<Match[]>({
    queryKey: ["matches"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMatches();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMatch(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Match>({
    queryKey: ["match", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) throw new Error("No actor or id");
      return actor.getMatch(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useCreateMatch() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (args: CreateMatchArgs) => {
      if (!actor) throw new Error("No actor");
      return actor.createMatch(args);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matches"] });
    },
  });
}
