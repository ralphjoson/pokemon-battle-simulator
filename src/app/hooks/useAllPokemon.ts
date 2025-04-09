import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useAllPokemon = () => {
  return useQuery({
    queryKey: ["all-pokemon"],
    queryFn: async () => {
      const res = await axios.get(
        "https://pokeapi.co/api/v2/pokemon?limit=1000"
      );
      return res.data.results; // [{ name, url }]
    },
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 60 * 24,
  });
};
