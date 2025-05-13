// Centralized Pokemon type definitions

export interface PokemonType {
  id: number;
  name: string;
  image: string;
}

export interface PokemonEvolution {
  name: string;
  pokedexId: number;
}

export interface PokemonStats {
  HP: number;
  speed: number;
  attack: number;
  defense: number;
  specialAttack?: number;
  specialDefense?: number;
  special_attack?: number;
  special_defense?: number;
}

export interface Pokemon {
  id: number;
  pokedexId: number;
  name: string;
  image: string;
  sprite: string;
  stats: PokemonStats;
  generation: number;
  evolutions: PokemonEvolution[];
  types: PokemonType[];
  height?: number;
  weight?: number;
  abilities?: string[];
  description?: string;
}

export interface PokemonParams {
  page?: number;
  limit?: number;
  typeId?: number;
  types?: number[];
  name?: string;
}

// Type colors mapping
export const typeColors: Record<string, string> = {
  Normal: "bg-gray-400",
  Feu: "bg-red-500",
  Eau: "bg-blue-500",
  Plante: "bg-green-500",
  Électrik: "bg-yellow-400",
  Glace: "bg-blue-300",
  Combat: "bg-red-700",
  Poison: "bg-purple-500",
  Sol: "bg-yellow-600",
  Vol: "bg-indigo-300",
  Psy: "bg-pink-500",
  Insecte: "bg-lime-500",
  Roche: "bg-yellow-800",
  Spectre: "bg-purple-700",
  Dragon: "bg-indigo-600",
  Ténèbres: "bg-gray-800",
  Acier: "bg-gray-500",
  Fée: "bg-pink-300",
  default: "bg-gray-400",
};
