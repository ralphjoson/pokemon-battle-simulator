"use client";

import { useState, useMemo } from "react";
import { debounce } from "lodash";
import { NamedAPIResource } from "../types/global";

interface Props {
  label: string;
  value: string;
  onChange: (val: string) => void;
  allPokemon: NamedAPIResource[];
  onSelect: (name: string) => void;
}

export default function PokemonSelector({
  label,
  value,
  onChange,
  allPokemon,
  onSelect,
}: Props) {
  const [input, setInput] = useState(value);
  const [suggestions, setSuggestions] = useState<NamedAPIResource[]>([]);

  const handleDebouncedSearch = useMemo(
    () =>
      debounce((search: string) => {
        const filtered = allPokemon.filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase())
        );
        setSuggestions(filtered.slice(0, 10));
      }, 300),
    [allPokemon]
  );

  const handleInput = (val: string) => {
    setInput(val);
    onChange(val);
    handleDebouncedSearch(val);
  };

  return (
    <div className="relative">
      <label className="block mb-1 font-medium text-gray-900">{label}</label>
      <input
        type="text"
        value={input}
        onChange={(e) => handleInput(e.target.value)}
        className="p-2 border rounded w-48 text-gray-900"
        placeholder="e.g., pikachu"
        autoComplete="off"
      />
      {suggestions.length > 0 && (
        <ul className="absolute bg-white border rounded shadow w-full z-10 max-h-40 overflow-y-auto text-gray-900">
          {suggestions.map((p) => (
            <li
              key={p.name}
              className="px-3 py-1 hover:bg-gray-200 cursor-pointer text-left"
              onClick={() => {
                onSelect(p.name);
                setInput(p.name);
                setSuggestions([]);
              }}
            >
              {p.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
