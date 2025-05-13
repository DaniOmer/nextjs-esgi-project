import httpClient from "../http/api";

interface PokemonParams {
  page?: number;
  limit?: number;
  typeId?: number;
  types?: number[];
  name?: string;
}

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
    queryParams.append("name", name);
  }

  const response = await httpClient.get(`/pokemons?${queryParams.toString()}`);
  return response.data;
};
