"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch } from "@/utils/store/hooks";
import { getTypesThunk } from "@/utils/store/pokemons/pokemonSlice";
import { getPokemonByPokedexId } from "@/utils/services/pokemons";

// Define interfaces
interface PokemonType {
  id: number;
  name: string;
  image: string;
}

interface PokemonEvolution {
  name: string;
  pokedexId: number;
}

interface PokemonStats {
  HP: number;
  speed: number;
  attack: number;
  defense: number;
  specialAttack?: number;
  specialDefense?: number;
  special_attack?: number;
  special_defense?: number;
}

interface Pokemon {
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

const typeColors: Record<string, string> = {
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

export default function PokemonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get the pokedexId from the URL
  const pokedexId = params.pokedexId as string;

  // Fetch Pokemon data
  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        setLoading(true);
        // Ensure types are loaded
        dispatch(getTypesThunk());

        // Fetch the Pokemon by pokedexId
        const data = await getPokemonByPokedexId(pokedexId);
        setPokemon(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching Pokemon:", err);
        setError("Impossible de charger les données du Pokémon");
      } finally {
        setLoading(false);
      }
    };

    if (pokedexId) {
      fetchPokemon();
    }
  }, [pokedexId, dispatch]);

  // Helper function to get the correct stat value
  const getStat = (statName: string): number => {
    if (!pokemon || !pokemon.stats) return 0;

    const stats = pokemon.stats;
    switch (statName) {
      case "HP":
        return stats.HP;
      case "Attack":
        return stats.attack;
      case "Defense":
        return stats.defense;
      case "Special Attack":
        return stats.specialAttack || stats.special_attack || 0;
      case "Special Defense":
        return stats.specialDefense || stats.special_defense || 0;
      case "Speed":
        return stats.speed;
      default:
        return 0;
    }
  };

  // Calculate the percentage for stat bars (max stat value is typically 255)
  const getStatPercentage = (value: number): string => {
    const maxStat = 255;
    const percentage = Math.min((value / maxStat) * 100, 100);
    return `${percentage}%`;
  };

  // Get color based on stat value
  const getStatColor = (value: number): string => {
    if (value < 50) return "bg-red-500";
    if (value < 100) return "bg-orange-500";
    if (value < 150) return "bg-yellow-500";
    return "bg-green-500";
  };

  // Handle back button click
  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="pt-28 pb-10 px-4 md:px-8 max-w-7xl mx-auto min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className="pt-28 pb-10 px-4 md:px-8 max-w-7xl mx-auto min-h-screen flex flex-col items-center justify-center">
        <div className="text-red-500 text-xl mb-4">
          {error || "Pokémon non trouvé"}
        </div>
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retour
        </button>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-10 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Back button */}
      <button
        onClick={handleBack}
        className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        Retour au Pokédex
      </button>

      {/* Pokemon Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10">
        <div className="w-full md:w-1/3 lg:w-1/4">
          {/* Pokemon Image */}
          <div className="relative w-full aspect-square bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg overflow-hidden flex items-center justify-center p-4 shadow-lg">
            <Image
              src={pokemon.image}
              alt={pokemon.name}
              width={300}
              height={300}
              className="object-contain transition-transform duration-300 hover:scale-110"
              priority
            />
          </div>

          {/* Pokemon ID Badge */}
          <div className="absolute top-32 right-8 bg-gray-800 dark:bg-gray-700 text-white px-3 py-1 rounded-full text-sm font-bold">
            #{pokemon.pokedexId.toString().padStart(3, "0")}
          </div>
        </div>

        <div className="w-full md:w-2/3 lg:w-3/4">
          {/* Pokemon Name */}
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            {pokemon.name}
          </h1>

          {/* Pokemon Types */}
          <div className="flex flex-wrap gap-2 mb-6">
            {pokemon.types.map((type) => (
              <span
                key={type.id}
                className={`${
                  typeColors[type.name] || typeColors.default
                } text-white px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2`}
              >
                <img src={type.image} alt={type.name} className="w-5 h-5" />
                {type.name}
              </span>
            ))}
          </div>

          {/* Pokemon Description */}
          {pokemon.description && (
            <div className="mb-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-gray-700 dark:text-gray-300">
                {pokemon.description}
              </p>
            </div>
          )}

          {/* Pokemon Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* Generation */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Génération
              </h3>
              <p className="text-lg font-semibold text-gray-800 dark:text-white">
                {pokemon.generation}
              </p>
            </div>

            {/* Height */}
            {pokemon.height && (
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Taille
                </h3>
                <p className="text-lg font-semibold text-gray-800 dark:text-white">
                  {pokemon.height} m
                </p>
              </div>
            )}

            {/* Weight */}
            {pokemon.weight && (
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Poids
                </h3>
                <p className="text-lg font-semibold text-gray-800 dark:text-white">
                  {pokemon.weight} kg
                </p>
              </div>
            )}
          </div>

          {/* Abilities */}
          {pokemon.abilities && pokemon.abilities.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                Capacités
              </h2>
              <div className="flex flex-wrap gap-2">
                {pokemon.abilities.map((ability, index) => (
                  <span
                    key={index}
                    className="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full"
                  >
                    {ability}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Section */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Statistiques
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            "HP",
            "Attack",
            "Defense",
            "Special Attack",
            "Special Defense",
            "Speed",
          ].map((statName) => {
            const statValue = getStat(statName);
            return (
              <div
                key={statName}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {statName}
                  </span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {statValue}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${getStatColor(statValue)}`}
                    style={{ width: getStatPercentage(statValue) }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Evolutions Section */}
      {pokemon.evolutions && pokemon.evolutions.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Évolutions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {pokemon.evolutions.map((evolution) => (
              <div
                key={evolution.pokedexId}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => router.push(`/pokemons/${evolution.pokedexId}`)}
              >
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-2">
                  <span className="text-sm font-medium">
                    #{evolution.pokedexId.toString().padStart(3, "0")}
                  </span>
                </div>
                <span className="text-center font-medium">
                  {evolution.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
