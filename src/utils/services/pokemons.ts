import httpClient from "../http/api";
import { PokemonParams } from "@/utils/types/pokemon";

export const getPokemonByPokedexId = async (pokedexId: number | string) => {
  try {
    const response = await httpClient.get(`/pokemons/${pokedexId}`);
    return response.data;
  } catch (error) {
    console.error(
      `API Error fetching Pokemon with pokedexId ${pokedexId}:`,
      error
    );
    throw error;
  }
};

export const getTypes = async () => {
  try {
    const response = await httpClient.get("/types");
    return response.data;
  } catch (error) {
    console.error("API Error fetching types:", error);
    throw error;
  }
};

export const getPokemons = async (
  params: PokemonParams = { page: 1, limit: 50 }
) => {
  const { page = 1, limit = 50, typeId, types, name } = params;

  // Build query parameters
  const queryParams = new URLSearchParams();
  queryParams.append("page", page.toString());
  queryParams.append("limit", limit.toString());

  if (typeId) {
    queryParams.append("typeId", typeId.toString());
  }

  if (types && types.length > 0) {
    types.forEach((type) => queryParams.append("types", type.toString()));
  }

  if (name) {
    const trimmedName = name.trim();
    if (trimmedName.length > 0) {
      console.log("Adding name parameter:", trimmedName);
      queryParams.append("name", trimmedName);
    }
  }

  console.log("API Request URL:", `/pokemons?${queryParams.toString()}`);

  try {
    const response = await httpClient.get(
      `/pokemons?${queryParams.toString()}`
    );

    if (!Array.isArray(response.data)) {
      const possibleArrayProps = Object.keys(response.data).filter((key) =>
        Array.isArray(response.data[key])
      );

      if (possibleArrayProps.length > 0) {
        console.log("Found possible array properties:", possibleArrayProps);
        return response.data[possibleArrayProps[0]];
      }
    }

    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
