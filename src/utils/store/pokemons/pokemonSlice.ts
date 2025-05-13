import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getPokemons } from "@/utils/services/pokemons";

interface Pokemon {
  id: number;
  name: string;
  url: string;
}

interface PokemonState {
  list: Pokemon[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: PokemonState = {
  list: [],
  status: "idle",
  error: null,
};

export const getPokemonsThunk = createAsyncThunk(
  "pokemons/getPokemons",
  async () => {
    const response = await getPokemons();
    return response;
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
      state.list = action.payload;
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
