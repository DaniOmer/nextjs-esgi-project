"use client";

import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/utils/store/hooks";
import { getPokemonsThunk } from "@/utils/store/pokemons/pokemonSlice";
import { useState, useEffect, useRef } from "react";

function Header() {
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Track the previous search term to avoid duplicate requests
  const prevSearchTermRef = useRef<string>("");

  // Fonction pour gérer le changement dans l'input de recherche
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Annuler le timeout précédent s'il existe
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Définir un nouveau timeout pour éviter trop de requêtes pendant la frappe
    searchTimeoutRef.current = setTimeout(() => {
      console.log("Recherche:", value);

      // Trim the search value
      const trimmedValue = value.trim();

      // Only dispatch if the trimmed search term is different from the previous one
      if (trimmedValue !== prevSearchTermRef.current) {
        console.log(
          "Search term changed from",
          prevSearchTermRef.current,
          "to",
          trimmedValue
        );

        // Update the previous search term reference
        prevSearchTermRef.current = trimmedValue;

        // Si la recherche est vide, réinitialiser à la première page sans filtre
        if (trimmedValue === "") {
          console.log("Clearing search and loading first page");
          dispatch(getPokemonsThunk({ page: 1 }));
        } else {
          // Sinon, rechercher avec le terme de recherche
          console.log("Searching for:", trimmedValue);
          dispatch(getPokemonsThunk({ page: 1, name: trimmedValue }));
        }
      } else {
        console.log("Search term unchanged, skipping request");
      }
    }, 500); // Délai de 500ms pour éviter trop de requêtes
  };

  // Nettoyer le timeout lors du démontage du composant
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm shadow-sm h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-gray-600 bg-clip-text text-transparent">
            Pokemon
          </h1>
          <div className="w-64 relative">
            <Input
              type="text"
              placeholder="Rechercher un Pokemon..."
              className="w-full rounded-full border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all pr-10"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {searchTerm && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => {
                  console.log("Clearing search");
                  setSearchTerm("");
                  prevSearchTermRef.current = ""; // Reset the previous search term reference
                  dispatch(getPokemonsThunk({ page: 1 }));
                }}
                aria-label="Effacer la recherche"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
