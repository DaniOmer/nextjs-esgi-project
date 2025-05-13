import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getPokemons } from "@/utils/services/pokemons";

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
  specialAttack: number;
  specialDefense: number;
  special_attack: number;
  special_defense: number;
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
}

interface PokemonState {
  list: Pokemon[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  limit: number;
  page: number;
  total: number;
}

const initialState: PokemonState = {
  list: [],
  status: "idle",
  error: null,
  limit: 50,
  page: 1,
  total: 0,
};

export const getPokemonsThunk = createAsyncThunk(
  "pokemons/getPokemons",
  async (
    params: {
      limit?: number;
      page?: number;
      typeId?: number;
      types?: number[];
      name?: string;
    } = {},
    { getState }
  ) => {
    const state = getState() as { pokemons: PokemonState };
    const {
      limit = state.pokemons.limit,
      page = state.pokemons.page,
      typeId,
      types,
      name,
    } = params;

    const response = await getPokemons({ limit, page, typeId, types, name });
    return {
      pokemons: response,
      limit,
      page: page, // Ensure we're using the page from the request, not from the response
      total: response.length, // This should be updated if the API returns total count
    };
  }
);

const pokemonSlice = createSlice({
  name: "pokemons",
  initialState,
  reducers: {
    setPokemons: (state, action: PayloadAction<Pokemon[]>) => {
      state.list = action.payload;
      state.status = "succeeded";
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.status = action.payload ? "loading" : "idle";
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.status = "failed";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPokemonsThunk.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(getPokemonsThunk.fulfilled, (state, action) => {
      // If it's the first page, replace the list, otherwise append to it
      if (action.payload.page === 1) {
        state.list = action.payload.pokemons;
      } else {
        // Append new pokemons to the existing list, avoiding duplicates
        const existingIds = new Set(
          state.list.map((pokemon: Pokemon) => pokemon.id)
        );
        const newPokemons = action.payload.pokemons.filter(
          (pokemon: Pokemon) => !existingIds.has(pokemon.id)
        );
        state.list = [...state.list, ...newPokemons];
      }

      state.limit = action.payload.limit;
      state.page = action.payload.page;
      state.total = action.payload.total;
      state.status = "succeeded";
    });
    builder.addCase(getPokemonsThunk.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message ?? null;
    });
  },
});

export const { setPokemons, setLoading, setError } = pokemonSlice.actions;
export default pokemonSlice.reducer;
