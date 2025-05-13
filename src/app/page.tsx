"use client";

import { useAppDispatch, useAppSelector } from "@/utils/store/hooks";
import { useEffect } from "react";
import {
  setPokemons,
  getPokemonsThunk,
} from "@/utils/store/pokemons/pokemonSlice";

export default function Home() {
  const dispatch = useAppDispatch();
  const pokemons = useAppSelector((state) => state.pokemons.list);

  useEffect(() => {
    dispatch(getPokemonsThunk());
  }, [dispatch]);

  return (
    <div className="py-10 items-center justify-items-center gap-16 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div>
          {pokemons.map((pokemon) => (
            <div key={pokemon.id}>{pokemon.name}</div>
          ))}
        </div>
      </main>
    </div>
  );
}
