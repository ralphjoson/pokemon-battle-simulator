import axios from "axios";
import type { Action } from "@/app/types/battle";
import type {
  Pokemon,
  PokemonType,
  TypeEffectivenessResult,
} from "@/app/types/pokemon";

type HandleStartBattleProps = {
  selection: { a: string; b: string };
  getTypeEffectiveness: (
    attackerTypes: PokemonType[],
    defenderTypes: PokemonType[]
  ) => Promise<TypeEffectivenessResult>;
  dispatch: React.Dispatch<Action>;
  simulateTurn: (
    attacker: Pokemon,
    defender: Pokemon,
    effectiveness: TypeEffectivenessResult,
    dispatchLog: (log: string) => void
  ) => Promise<number>;
};

export const handleStartBattle = async ({
  selection,
  getTypeEffectiveness,
  dispatch,
  simulateTurn,
}: HandleStartBattleProps): Promise<void> => {
  return new Promise(async (resolve) => {
    dispatch({ type: "SET_LOADING" });

    try {
      // Fetch Pokémon data from the API
      const [resA, resB] = await Promise.all([
        axios.get<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${selection.a}`),
        axios.get<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${selection.b}`),
      ]);

      const pokemonA = resA.data;
      const pokemonB = resB.data;

      // Calculate type effectiveness in both directions
      const [effectivenessA, effectivenessB] = await Promise.all([
        getTypeEffectiveness(pokemonA.types, pokemonB.types),
        getTypeEffectiveness(pokemonB.types, pokemonA.types),
      ]);

      // Set the Pokémon and initial HP in state
      dispatch({ type: "SET_POKEMON", payload: { pokemonA, pokemonB } });

      let hpA =
        pokemonA.stats.find((s) => s.stat.name === "hp")?.base_stat || 100;
      let hpB =
        pokemonB.stats.find((s) => s.stat.name === "hp")?.base_stat || 100;

      const log = (msg: string) => dispatch({ type: "ADD_LOG", payload: msg });

      // Turn-based battle simulation
      const runTurn = async (turn: number): Promise<void> => {
        // End conditions
        if (hpA <= 0 || hpB <= 0 || turn >= 20) {
          let result: string;
          if (hpA <= 0 && hpB <= 0) result = "It's a tie!";
          else if (hpA <= 0) result = pokemonB.name;
          else if (hpB <= 0) result = pokemonA.name;
          else result = "No winner – both Pokémon are still standing!";
          dispatch({ type: "SET_RESULT", payload: result });
          resolve();
          return;
        }

        // Determine which Pokémon goes first based on speed
        const speedA =
          pokemonA.stats.find((s) => s.stat.name === "speed")?.base_stat || 50;
        const speedB =
          pokemonB.stats.find((s) => s.stat.name === "speed")?.base_stat || 50;

        const attackerFirst = speedA >= speedB ? pokemonA : pokemonB;
        const defenderFirst = speedA >= speedB ? pokemonB : pokemonA;
        const effectivenessFirst =
          speedA >= speedB ? effectivenessA : effectivenessB;
        const effectivenessSecond =
          speedA >= speedB ? effectivenessB : effectivenessA;

        const isAFaster = attackerFirst.name === pokemonA.name;

        // First attack
        const accuracyFirst =
          attackerFirst.stats.find((s) => s.stat.name === "speed")?.base_stat ||
          50;
        const hitChanceFirst = Math.random() * 100;
        const hitFirst = hitChanceFirst < accuracyFirst;
        let damageToFirst = 0;
        if (hitFirst) {
          damageToFirst = await simulateTurn(
            attackerFirst,
            defenderFirst,
            effectivenessFirst,
            log
          );
        } else {
          log(`${attackerFirst.name} tried to attack but missed!`);
        }
        if (isAFaster) {
          hpB -= damageToFirst;
        } else {
          hpA -= damageToFirst;
        }
        dispatch({ type: "UPDATE_HP", payload: { hpA, hpB } });
        log(`${defenderFirst.name} has ${isAFaster ? hpB : hpA} HP remaining.`);

        setTimeout(async () => {
          // Re-check if defender fainted
          if (hpA <= 0 || hpB <= 0) return runTurn(20);

          // Second attack
          const accuracySecond =
            defenderFirst.stats.find((s) => s.stat.name === "speed")
              ?.base_stat || 50;
          const hitChanceSecond = Math.random() * 100;
          const hitSecond = hitChanceSecond < accuracySecond;
          let damageToSecond = 0;
          if (hitSecond) {
            damageToSecond = await simulateTurn(
              defenderFirst,
              attackerFirst,
              effectivenessSecond,
              log
            );
          } else {
            log(`${defenderFirst.name} tried to attack but missed!`);
          }
          if (isAFaster) {
            hpA -= damageToSecond;
          } else {
            hpB -= damageToSecond;
          }
          dispatch({ type: "UPDATE_HP", payload: { hpA, hpB } });
          log(
            `${attackerFirst.name} has ${isAFaster ? hpA : hpB} HP remaining.`
          );

          setTimeout(() => runTurn(turn + 1), 600);
        }, 600);
      };

      // Start the first turn after a slight delay
      setTimeout(() => runTurn(0), 600);
    } catch {
      dispatch({ type: "SET_ERROR" });
      resolve();
    }
  });
};
