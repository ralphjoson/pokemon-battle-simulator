import axios from "axios";
import type { PokemonType, TypeEffectivenessResult } from "../types/pokemon";

// Hook to calculate type effectiveness between two Pokémon
export const useTypeEffectiveness = () => {
  /**
   * Calculates how effective the attacker's types are against the defender's types.
   *
   * @param attackerTypes - Array of the attacker's types (e.g., Fire, Water)
   * @param defenderTypes - Array of the defender's types (e.g., Grass, Rock)
   * @returns An object containing the final damage multiplier and whether it's super effective
   */
  const getTypeEffectiveness = async (
    attackerTypes: PokemonType[],
    defenderTypes: PokemonType[]
  ): Promise<TypeEffectivenessResult> => {
    let multiplier = 1;
    let isSuperEffective = false;

    // Loop through each of the attacker's types
    for (const attackerType of attackerTypes) {
      // Fetch the attacker's type data from PokéAPI
      const res = await axios.get(attackerType.type.url);
      const damageRelations = res.data.damage_relations;

      // Compare against each of the defender's types
      for (const defenderType of defenderTypes) {
        // Double damage (e.g., Fire vs Grass)
        if (
          damageRelations.double_damage_to.some(
            (t: { name: string }) => t.name === defenderType.type.name
          )
        ) {
          multiplier *= 2;
          isSuperEffective = true;
        }

        // Half damage (e.g., Fire vs Water)
        if (
          damageRelations.half_damage_to.some(
            (t: { name: string }) => t.name === defenderType.type.name
          )
        ) {
          multiplier *= 0.5;
        }

        // No damage (e.g., Normal vs Ghost)
        if (
          damageRelations.no_damage_to.some(
            (t: { name: string }) => t.name === defenderType.type.name
          )
        ) {
          multiplier *= 0;
        }
      }
    }

    return { multiplier, isSuperEffective };
  };

  // Return the function as part of the hook
  return { getTypeEffectiveness };
};
