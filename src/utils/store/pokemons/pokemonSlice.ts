import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getPokemons, getTypes } from "@/utils/services/pokemons";

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
  searchTerm: string | null;
  types: PokemonType[];
  selectedTypes: number[];
  typesStatus: "idle" | "loading" | "succeeded" | "failed";
  typesError: string | null;
}

const initialState: PokemonState = {
  list: [],
  status: "idle",
  error: null,
  limit: 50,
  page: 1,
  total: 0,
  searchTerm: null,
  types: [],
  selectedTypes: [],
  typesStatus: "idle",
  typesError: null,
};

export const getTypesThunk = createAsyncThunk("pokemons/getTypes", async () => {
  const response = await getTypes();
  return response;
});

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
      types = state.pokemons.selectedTypes.length > 0
        ? state.pokemons.selectedTypes
        : undefined,
      name,
    } = params;

    console.log("Fetching pokemons with params:", {
      limit,
      page,
      typeId,
      types,
      name,
    });

    // Check if we're trying to load a page beyond what we already have for the same search term
    const isLoadingMore = page > 1;
    const isSameSearch = (name || null) === state.pokemons.searchTerm;

    // If we're loading more for the same search and we already have fewer items than expected,
    // it means we've loaded all available results
    if (
      isLoadingMore &&
      isSameSearch &&
      state.pokemons.list.length < (page - 1) * limit
    ) {
      console.log("All results already loaded, skipping request");
      return {
        pokemons: [], // Return empty array to indicate no new results
        limit,
        page: page - 1, // Stay on the current page
        total: state.pokemons.list.length,
        searchTerm: name || null,
      };
    }

    const response = await getPokemons({ limit, page, typeId, types, name });
    return {
      pokemons: response,
      limit,
      page: page, // Ensure we're using the page from the request, not from the response
      total: response.length, // This should be updated if the API returns total count
      searchTerm: name || null, // Track if this is a search request
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
    setSelectedTypes: (state, action: PayloadAction<number[]>) => {
      state.selectedTypes = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Types reducers
    builder.addCase(getTypesThunk.pending, (state) => {
      state.typesStatus = "loading";
    });
    builder.addCase(getTypesThunk.fulfilled, (state, action) => {
      state.types = action.payload;
      state.typesStatus = "succeeded";
    });
    builder.addCase(getTypesThunk.rejected, (state, action) => {
      state.typesStatus = "failed";
      state.typesError = action.error.message ?? null;
    });

    // Pokemons reducers
    builder.addCase(getPokemonsThunk.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(getPokemonsThunk.fulfilled, (state, action) => {
      // Déterminer si c'est une recherche et/ou la première page
      const isSearch = action.payload.searchTerm !== null;
      const isFirstPage = action.payload.page === 1;
      const isNewSearch =
        isSearch && state.searchTerm !== action.payload.searchTerm;

      // Vérifier si la réponse est vide
      if (!action.payload.pokemons || action.payload.pokemons.length === 0) {
        console.log("Empty response, keeping current list");
        // Ne rien faire, garder la liste actuelle
      }
      // Cas 1: Nouvelle recherche - remplacer complètement la liste
      else if (isNewSearch) {
        console.log("CASE 1: New search - Replacing list with search results");
        state.list = [...action.payload.pokemons];
      }
      // Cas 2: Première page d'une recherche existante - remplacer la liste
      else if (isSearch && isFirstPage) {
        console.log("CASE 2: First page of existing search - Replacing list");
        state.list = [...action.payload.pokemons];
      }
      // Cas 3: Page suivante d'une recherche - ajouter à la liste existante
      else if (isSearch && !isFirstPage) {
        console.log("CASE 3: Next page of search - Adding to existing list");
        const existingIds = new Set(
          state.list.map((pokemon: Pokemon) => pokemon.id)
        );
        const newPokemons = action.payload.pokemons.filter(
          (pokemon: Pokemon) => !existingIds.has(pokemon.id)
        );
        state.list = [...state.list, ...newPokemons];
      }
      // Cas 4: Première page sans recherche - remplacer la liste
      else if (!isSearch && isFirstPage) {
        console.log("CASE 4: First page without search - Replacing list");
        state.list = [...action.payload.pokemons];
      }
      // Cas 5: Page suivante sans recherche - ajouter à la liste existante
      else {
        console.log(
          "CASE 5: Next page without search - Adding to existing list"
        );
        const existingIds = new Set(
          state.list.map((pokemon: Pokemon) => pokemon.id)
        );
        const newPokemons = action.payload.pokemons.filter(
          (pokemon: Pokemon) => !existingIds.has(pokemon.id)
        );
        state.list = [...state.list, ...newPokemons];
      }

      // Vérification finale pour s'assurer que la liste est correcte
      console.log("Final list length:", state.list.length);

      state.limit = action.payload.limit;
      state.page = action.payload.page;
      state.total = action.payload.total;
      state.searchTerm = action.payload.searchTerm;
      state.status = "succeeded";
    });
    builder.addCase(getPokemonsThunk.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message ?? null;
    });
  },
});

export const { setPokemons, setLoading, setError, setSelectedTypes } =
  pokemonSlice.actions;
export default pokemonSlice.reducer;
