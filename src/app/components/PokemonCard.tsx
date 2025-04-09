"use client";

import Image from "next/image";

import { FC } from "react";
import { Pokemon } from "../types/pokemon";

interface PokemonCardProps {
  p: Pokemon;
  hp: number;
  maxHp: number;
}

const PokemonCard: FC<PokemonCardProps> = ({ p, hp, maxHp }) => {
  return (
    <div
      key={p.name}
      className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
    >
      <Image
        src={p.sprites.front_default}
        alt={p.name}
        width={96}
        height={96}
        className="mx-auto mb-2"
      />
      <h2 className="text-xl font-semibold capitalize mb-1 text-gray-900">
        {p.name}
      </h2>
      <div className="w-full bg-gray-300 rounded-full h-4 mb-2">
        <div
          className="h-4 rounded-full transition-all duration-500"
          style={{
            width: `${Math.max(0, (hp / maxHp) * 100)}%`,
            backgroundColor:
              hp / maxHp > 0.5
                ? "#4ade80"
                : hp / maxHp > 0.25
                ? "#facc15"
                : "#f87171",
          }}
        ></div>
      </div>
      <p className="text-sm text-gray-400">
        Type: {p.types.map((t) => t.type.name).join(", ")}
      </p>
    </div>
  );
};

export default PokemonCard;
