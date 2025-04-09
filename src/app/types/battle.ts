import { simulateTurn } from "../utils/battle/simulateTurn";
import type { Pokemon, PokemonType, TypeEffectivenessResult } from "./pokemon";

export interface State {
  pokemonA: Pokemon | null;
  pokemonB: Pokemon | null;
  log: string[];
  result: string | null;
  error: string;
  loading: boolean;
  hpA: number;
  hpB: number;
  maxHpA: number;
  maxHpB: number;
}

export type Action =
  | { type: "SET_POKEMON"; payload: { pokemonA: Pokemon; pokemonB: Pokemon } }
  | { type: "ADD_LOG"; payload: string }
  | { type: "SET_RESULT"; payload: string }
  | { type: "SET_ERROR" }
  | { type: "SET_LOADING" }
  | { type: "UPDATE_HP"; payload: { hpA: number; hpB: number } };

export type HandleStartBattleProps = {
  selection: { a: string; b: string };
  getTypeEffectiveness: (
    attackerTypes: PokemonType[],
    defenderTypes: PokemonType[]
  ) => Promise<TypeEffectivenessResult>;
  dispatch: React.Dispatch<Action>;
  simulateTurn: typeof simulateTurn;
};
