export interface PokemonType {
  type: {
    name: string;
    url: string;
  };
}

export interface TypeEffectivenessResult {
  multiplier: number;
  isSuperEffective: boolean;
}

export interface Pokemon {
  name: string;
  sprites: {
    front_default: string;
  };
  types: PokemonType[];
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
  moves: {
    move: {
      name: string;
      url: string;
    };
    version_group_details: {
      level_learned_at: number;
    }[];
  }[];
}
