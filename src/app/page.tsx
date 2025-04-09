"use client";

import { useReducer, useState } from "react";
import { useTypeEffectiveness } from "./hooks/useTypeEffectiveness";
import { simulateTurn } from "./utils/battle/simulateTurn";
import type { State, Action } from "./types/battle";
import { handleStartBattle } from "./utils/battle/handleStartBattle";
import PokemonCard from "./components/PokemonCard";
import PokemonSelector from "./components/PokemonSelector";
import { useAllPokemon } from "./hooks/useAllPokemon";

const initialState: State = {
  pokemonA: null,
  pokemonB: null,
  log: [],
  result: null,
  error: "",
  loading: false,
  hpA: 0,
  hpB: 0,
  maxHpA: 0,
  maxHpB: 0,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_POKEMON": {
      const maxHpA =
        action.payload.pokemonA.stats.find((s) => s.stat.name === "hp")
          ?.base_stat || 100;
      const maxHpB =
        action.payload.pokemonB.stats.find((s) => s.stat.name === "hp")
          ?.base_stat || 100;
      return {
        ...state,
        pokemonA: action.payload.pokemonA,
        pokemonB: action.payload.pokemonB,
        log: [],
        loading: false,
        result: null,
        hpA: maxHpA,
        hpB: maxHpB,
        maxHpA,
        maxHpB,
      };
    }
    case "ADD_LOG":
      return { ...state, log: [...state.log, action.payload] };
    case "SET_RESULT":
      return { ...state, result: action.payload };
    case "SET_ERROR":
      return { ...state, error: "Failed to fetch Pokémon.", loading: false };
    case "SET_LOADING":
      return { ...state, loading: true, result: null };
    case "UPDATE_HP":
      return { ...state, hpA: action.payload.hpA, hpB: action.payload.hpB };
    default:
      return state;
  }
}

export default function Home() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [selection, setSelection] = useState({ a: "pikachu", b: "charmander" });
  const { getTypeEffectiveness } = useTypeEffectiveness();
  const [isSimulating, setIsSimulating] = useState(false);

  const { data: allPokemon = [] } = useAllPokemon();

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-center">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">
        Pokémon Battle Simulator
      </h1>

      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
        <PokemonSelector
          label="Select Pokémon A"
          value={selection.a}
          onChange={(val) => setSelection({ ...selection, a: val })}
          onSelect={(name) => setSelection({ ...selection, a: name })}
          allPokemon={allPokemon}
        />

        <PokemonSelector
          label="Select Pokémon B"
          value={selection.b}
          onChange={(val) => setSelection({ ...selection, b: val })}
          onSelect={(name) => setSelection({ ...selection, b: name })}
          allPokemon={allPokemon}
        />
      </div>

      <button
        onClick={async () => {
          setIsSimulating(true);
          await handleStartBattle({
            selection,
            getTypeEffectiveness,
            dispatch,
            simulateTurn,
          });
          setIsSimulating(false);
        }}
        disabled={isSimulating}
        className={`px-4 py-2 rounded mb-6 font-semibold text-white ${
          isSimulating
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isSimulating ? "Simulating..." : "Begin Simulation"}
      </button>

      {state.loading && <p>Loading Pokémon...</p>}
      {state.error && <p className="text-red-500">{state.error}</p>}

      {state.pokemonA && state.pokemonB && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 max-w-[780px] mx-auto">
          {[
            { id: "A", p: state.pokemonA, hp: state.hpA, maxHp: state.maxHpA },
            { id: "B", p: state.pokemonB, hp: state.hpB, maxHp: state.maxHpB },
          ].map(({ id, p, hp, maxHp }) => (
            <PokemonCard key={`${p.name}-${id}`} p={p} hp={hp} maxHp={maxHp} />
          ))}
        </div>
      )}

      {state.log.length > 0 && (
        <div className="mt-6 text-left max-w-xl mx-auto">
          <h3 className="text-xl font-semibold mb-2 text-gray-900">
            Battle Log:
          </h3>
          <ul className="bg-white rounded-lg shadow p-4 space-y-1 text-sm text-gray-700">
            {state.log.map((entry, idx) => (
              <li key={idx}>{entry}</li>
            ))}
          </ul>
        </div>
      )}

      {state.result && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold text-green-500">
            Winner: <span className="capitalize">{state.result}</span>
          </h2>
        </div>
      )}
    </div>
  );
}
