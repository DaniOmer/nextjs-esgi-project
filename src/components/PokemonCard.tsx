import React, { useState } from "react";
import Image from "next/image";
import PokemonModal from "./PokemonModal";
import { Pokemon, typeColors } from "@/utils/types/pokemon";

interface PokemonCardProps {
  pokemon: Pokemon;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div
        className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 cursor-pointer"
        onClick={openModal}
      >
        {/* Pokemon ID Badge */}
        <div className="absolute top-2 left-2 bg-gray-800 dark:bg-gray-700 text-white px-2 py-1 rounded-full text-xs font-bold z-10">
          #{pokemon.pokedexId.toString().padStart(3, "0")}
        </div>

        {/* Pokemon Image */}
        <div className="relative w-full h-48 bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center p-4">
          <Image
            src={pokemon.image}
            alt={pokemon.name}
            width={150}
            height={150}
            className="object-contain transition-transform duration-300 hover:scale-110"
            priority
          />
        </div>

        {/* Pokemon Info */}
        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2 truncate">
            {pokemon.name}
          </h2>

          {/* Pokemon Types */}
          <div className="flex flex-wrap gap-2">
            {pokemon.types.map((type) => (
              <span
                key={type.id}
                className={`${
                  typeColors[type.name] || typeColors.default
                } text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1`}
              >
                <img src={type.image} alt={type.name} className="w-4 h-4" />
                {type.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Pokemon Modal */}
      <PokemonModal
        pokemon={pokemon}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </>
  );
};

export default PokemonCard;
