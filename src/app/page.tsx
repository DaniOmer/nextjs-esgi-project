"use client";

import { useAppDispatch, useAppSelector } from "@/utils/store/hooks";
import { useEffect, useState } from "react";
import { getPokemonsThunk } from "@/utils/store/pokemons/pokemonSlice";
import PokemonCard from "@/components/PokemonCard";

export default function Home() {
  const dispatch = useAppDispatch();
  const {
    list: pokemons,
    status,
    limit,
    page,
    total,
  } = useAppSelector((state) => state.pokemons);

  useEffect(() => {
    dispatch(getPokemonsThunk({}));
  }, [dispatch]);

  const loadMore = () => {
    // Ensure page is a number before incrementing
    const currentPage = typeof page === "number" ? page : 1;
    const nextPage = currentPage + 1;
    console.log("Loading page:", nextPage);
    dispatch(getPokemonsThunk({ page: nextPage }));
  };

  const isLoading = status === "loading";

  return (
    <div className="py-10 px-4 md:px-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Pokédex</h1>

      {isLoading && pokemons.length === 0 ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {pokemons.map((pokemon) => (
              <PokemonCard key={pokemon.id} pokemon={pokemon} />
            ))}
          </div>

          {pokemons.length > 0 && (
            <div className="mt-10 flex justify-center">
              <button
                onClick={loadMore}
                disabled={isLoading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                    Chargement...
                  </>
                ) : (
                  "Charger plus de Pokémon"
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
