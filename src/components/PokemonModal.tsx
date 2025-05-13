import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { Pokemon, typeColors } from "@/utils/types/pokemon";

interface PokemonModalProps {
  pokemon: Pokemon | null;
  isOpen: boolean;
  onClose: () => void;
}

const PokemonModal: React.FC<PokemonModalProps> = ({
  pokemon,
  isOpen,
  onClose,
}) => {
  const router = useRouter();

  if (!pokemon) return null;

  const handleViewFullDetails = () => {
    router.push(`/pokemons/${pokemon.pokedexId}`);
    onClose(); // Close the modal when navigating
  };

  // Helper function to get the correct stat value
  const getStat = (statName: string): number => {
    const stats = pokemon.stats;
    switch (statName) {
      case "HP":
        return stats.HP;
      case "Attack":
        return stats.attack;
      case "Defense":
        return stats.defense;
      case "Special Attack":
        return stats.specialAttack || stats.special_attack || 0;
      case "Special Defense":
        return stats.specialDefense || stats.special_defense || 0;
      case "Speed":
        return stats.speed;
      default:
        return 0;
    }
  };

  // Calculate the percentage for stat bars (max stat value is typically 255)
  const getStatPercentage = (value: number): string => {
    const maxStat = 255;
    const percentage = Math.min((value / maxStat) * 100, 100);
    return `${percentage}%`;
  };

  // Get color based on stat value
  const getStatColor = (value: number): string => {
    if (value < 50) return "bg-red-500";
    if (value < 100) return "bg-orange-500";
    if (value < 150) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${pokemon.name} #${pokemon.pokedexId
        .toString()
        .padStart(3, "0")}`}
      className="w-full max-w-2xl"
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* Pokemon Image Section */}
        <div className="flex-shrink-0 w-full md:w-1/3">
          <div className="relative w-full aspect-square bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg overflow-hidden flex items-center justify-center p-4">
            <Image
              src={pokemon.image}
              alt={pokemon.name}
              width={200}
              height={200}
              className="object-contain transition-transform duration-300 hover:scale-110"
              priority
            />
          </div>

          {/* Pokemon Types */}
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
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

          {/* Generation */}
          <div className="mt-4 text-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Génération {pokemon.generation}
            </span>
          </div>

          {/* View Full Details Button */}
          <div className="mt-4">
            <button
              onClick={handleViewFullDetails}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              Voir la fiche complète
            </button>
          </div>
        </div>

        {/* Pokemon Details Section */}
        <div className="flex-grow w-full md:w-2/3">
          {/* Stats */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
              Statistiques
            </h3>
            <div className="space-y-3">
              {[
                "HP",
                "Attack",
                "Defense",
                "Special Attack",
                "Special Defense",
                "Speed",
              ].map((statName) => {
                const statValue = getStat(statName);
                return (
                  <div key={statName}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {statName}
                      </span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {statValue}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${getStatColor(
                          statValue
                        )}`}
                        style={{ width: getStatPercentage(statValue) }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Evolutions */}
          {pokemon.evolutions && pokemon.evolutions.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
                Évolutions
              </h3>
              <div className="flex flex-wrap gap-4">
                {pokemon.evolutions.map((evolution) => (
                  <div
                    key={evolution.pokedexId}
                    className="flex flex-col items-center"
                  >
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium">
                        #{evolution.pokedexId.toString().padStart(3, "0")}
                      </span>
                    </div>
                    <span className="text-sm mt-1">{evolution.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default PokemonModal;
