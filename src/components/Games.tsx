import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

type Game = {
  id: number;
  name: string;
  rating?: number;
  genres?: { id: number; name: string }[];
  background_image?: string;
};

type GameResponse = {
  results: Game[];
}

const Games = () => {
  const [InputValue, setInputValue] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const fetchGames = async (): Promise<GameResponse> => {
    
    const url = searchTerm ? `http://localhost:5000/games?search=${searchTerm}` : `
    http://localhost:5000/games`;


    const res = await fetch(url);
    if (!res.ok) throw new Error("Network Response was not okay");
    const data = await res.json();
    return data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["games", searchTerm],
    queryFn: fetchGames,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error instanceof Error) return <p>Error...{error.message}</p>;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-12 space-y-12">
      {/* Search Section */}
      <div className="w-full max-w-4xl flex items-center gap-6">
        <p className="text-lg font-semibold whitespace-nowrap">Search here</p>

        <input
          className="flex-1 p-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
          type="text"
          value={InputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Red Dead Redemption..."
        />

        <button
          onClick={() => setSearchTerm(InputValue)} // 🔥 trigger search
          className="p-2 cursor-pointer text-white bg-black rounded-xl"
        >
          Search
        </button>
      </div>

      {/* Content Section */}
      <div className="w-full max-w-6xl">
        <div className="text-gray-400 text-lg">
          {data?.results?.length ? (
            data.results.map((game) => (
              <div key={game.id}>
                <p>{game.name}</p>
              </div>
            ))
          ) : (
            <p>Nothing to show here</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Games;
