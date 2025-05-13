import httpClient from "../http/api";

export const getPokemons = async () => {
  const response = await httpClient.get("/pokemons");
  console.log(response.data);
  return response.data;
};
