import { Input } from "@/components/ui/input";

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm shadow-sm h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-gray-600 bg-clip-text text-transparent">
            Pokemon
          </h1>
          <div className="w-64">
            <Input
              type="text"
              placeholder="Rechercher un Pokemon..."
              className="w-full rounded-full border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
