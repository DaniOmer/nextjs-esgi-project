import { configureStore } from "@reduxjs/toolkit";
import pokemonReducer from "./pokemons/pokemonSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      pokemons: pokemonReducer,
    },
  });
};

export const store = makeStore();
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
