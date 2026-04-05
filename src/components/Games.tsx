import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

type Game = {
  id: number;
  name: string;
  rating?: number;
  genre?: string;
  year: number;
  image?: string;
  adult_only?: boolean;
  screenshots?: [];
};

type GameResponse = {
  results: Game[];
};

const Games = () => {
  const [InputValue, setInputValue] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const fetchGames = async (): Promise<GameResponse> => {
    const url = searchTerm
      ? `http://localhost:5000/games?search=${searchTerm}`
      : `
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
        <div className=" text-lg grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-16">
          {data?.results?.length ? (
            data.results.map((game) => (
              <div
                key={game.id}
                className="relative rounded-xl overflow-hidden group cursor-pointer bg-gray-900 border border-white/10 hover:border-yellow-400/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <img
                  src={game.image}
                  alt={game.name}
                  className="w-full h-72 object-cover brightness-75 group-hover:brightness-50 group-hover:scale-105 transition-all duration-300"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />
                {game.adult_only && (
                  <span className="absolute top-2 right-2 text-[10px] font-bold uppercase tracking-widest bg-red-500 text-white px-2 py-0.5 rounded">
                    18+
                  </span>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-3 flex flex-col gap-1.5">
                  <p className="text-white font-semibold text-sm leading-tight">
                    {game.name}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {game.genre && (
                      <span className="text-[10px] uppercase tracking-widest text-yellow-400 bg-yellow-400/10 border border-yellow-400/25 px-2 py-0.5 rounded">
                        {game.genre}
                      </span>
                    )}
                    <span className="text-[11px] text-gray-400">
                      {game.year}
                    </span>
                  </div>
                  {game.rating != null && (
                    <p className="text-yellow-400 text-xs font-medium">
                      ★ {game.rating}
                    </p>
                  )}
                </div>
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
