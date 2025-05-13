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
    // Assurez-vous que le nom est correctement formaté pour la recherche
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
    console.log("API Response:", response);
    console.log("API Response Data:", response.data);
    console.log("API Response Data Type:", typeof response.data);
    console.log("Is Array:", Array.isArray(response.data));

    // Si la réponse n'est pas un tableau, essayons de trouver le tableau de Pokémon
    if (!Array.isArray(response.data)) {
      console.log("Response is not an array, trying to find the Pokemon array");
      // Si la réponse est un objet avec une propriété qui est un tableau, utilisons ce tableau
      const possibleArrayProps = Object.keys(response.data).filter((key) =>
        Array.isArray(response.data[key])
      );

      if (possibleArrayProps.length > 0) {
        console.log("Found possible array properties:", possibleArrayProps);
        // Utiliser la première propriété qui est un tableau
        return response.data[possibleArrayProps[0]];
      }
    }

    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
