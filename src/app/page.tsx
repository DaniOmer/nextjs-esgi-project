"use client";

import { useAppDispatch, useAppSelector } from "@/utils/store/hooks";
import { useEffect, useRef, useCallback, useState } from "react";
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

  // Reference to the element to observe
  const observerRef = useRef<HTMLDivElement>(null);
  // Reference to the observer instance
  const observerInstance = useRef<IntersectionObserver | null>(null);

  // Initial loading of Pokémon
  useEffect(() => {
    dispatch(getPokemonsThunk({}));
  }, [dispatch]);

  // Get searchTerm from the store
  const { searchTerm } = useAppSelector((state) => state.pokemons);

  // Function to load more Pokémon
  const loadMore = useCallback(() => {
    if (status !== "loading") {
      const currentPage = typeof page === "number" ? page : 1;
      const nextPage = currentPage + 1;

      console.log(
        "Loading page:",
        nextPage,
        searchTerm ? `with search: ${searchTerm}` : ""
      );

      // Si une recherche est active, inclure le terme de recherche dans la requête
      if (searchTerm) {
        dispatch(getPokemonsThunk({ page: nextPage, name: searchTerm }));
      } else {
        dispatch(getPokemonsThunk({ page: nextPage }));
      }
    }
  }, [dispatch, page, status, searchTerm]);

  // Track if all results have been loaded
  const [allLoaded, setAllLoaded] = useState(false);

  // Update allLoaded state when pokemons or total changes
  useEffect(() => {
    // If we received fewer items than the limit, we've loaded all available results
    if (pokemons.length > 0 && pokemons.length < page * limit) {
      console.log("All Pokémon loaded, no more to fetch");
      setAllLoaded(true);
    } else {
      setAllLoaded(false);
    }
  }, [pokemons.length, page, limit]);

  useEffect(() => {
    if (observerInstance.current) {
      observerInstance.current.disconnect();
    }

    observerInstance.current = new IntersectionObserver(
      (entries) => {
        // Only load more if:
        // 1. The element is intersecting
        // 2. We're not currently loading
        // 3. We haven't loaded all available results
        if (entries[0].isIntersecting && status !== "loading" && !allLoaded) {
          console.log("Loading more Pokémon");
          loadMore();
        }
      },
      {
        rootMargin: "50px",
        threshold: 0.1,
      }
    );

    if (observerRef.current) {
      observerInstance.current.observe(observerRef.current);
    }

    return () => {
      if (observerInstance.current) {
        observerInstance.current.disconnect();
      }
    };
  }, [loadMore, status, allLoaded]);

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

          {/* Observed element for infinite scroll */}
          <div
            ref={observerRef}
            className="h-10 w-full flex justify-center items-center my-8"
          >
            {isLoading && (
              <div className="flex items-center gap-2">
                <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
                <span className="text-gray-500">Chargement...</span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
