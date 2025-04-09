import { FC } from "react";

interface PokemonSelectorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  suggestions: { name: string; url: string }[];
  onSelect: (name: string) => void;
}

const PokemonSelector: FC<PokemonSelectorProps> = ({
  label,
  value,
  onChange,
  suggestions,
  onSelect,
}) => {
  return (
    <div className="relative">
      <label className="block mb-1 font-medium text-gray-900">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="p-2 border rounded w-48 text-gray-900"
        placeholder="e.g., fire or pikachu"
        autoComplete="off"
      />
      {suggestions.length > 0 && (
        <ul className="absolute bg-white border rounded shadow w-full z-10 max-h-40 overflow-y-auto text-gray-900">
          {suggestions.map((pokemon) => (
            <li
              key={pokemon.name}
              className="px-3 py-1 hover:bg-gray-200 cursor-pointer text-left"
              onClick={() => onSelect(pokemon.name)}
            >
              {pokemon.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PokemonSelector;
