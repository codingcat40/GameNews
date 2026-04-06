import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Spinner } from "./ui/spinner";

import { useDebounce } from "use-debounce";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

type Game = {
  id: number;
  name: string;
  rating?: number;
  genres?: { id: number; name: string }[];
  first_release_date?: number;
  cover?: { id: number; url: string };
  age_ratings?: { id: number; rating: number; category: number }[];
  screenshots?: { id: number; url: string }[];
};

const Games = () => {
  const [InputValue, setInputValue] = useState<string>("");
  const [searchTerm] = useDebounce(InputValue, 1000);
  const [page, setPage] = useState(1);

  const fetchGames = async (): Promise<{
    results: Game[];
    totalPages: number;
  }> => {
    const url = searchTerm
  ? `http://localhost:5000/games?search=${searchTerm}`
  : `http://localhost:5000/games?page=${page}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Network Response was not okay");
    const data = await res.json();
    console.log(data);
    return data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["games", searchTerm, page],
    queryFn: fetchGames,
  });

  if (isLoading)
    return <Spinner className="text-center justify-center size-16 m-auto" />;
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
      </div>

      {/* Content Section */}
      <div className="w-full max-w-6xl">
        <div className="text-lg grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-16">
          {data?.results?.length ? (
            data.results.map((game) => (
              <div
                key={game.id}
                className="relative rounded-xl overflow-hidden group cursor-pointer bg-gray-900 border border-white/10 hover:border-yellow-400/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <img
                  src={game.cover?.url?.replace("t_thumb", "t_cover_big")}
                  alt={game.name}
                  className="w-full h-72 object-cover"
                />
                {game.age_ratings?.some((r) => r.rating >= 5) && (
                  <span className="absolute top-2 right-2 ...">18+</span>
                )}
                <p className="text-white font-semibold text-sm">{game.name}</p>
                {game.genres?.[0]?.name && (
                  <span className="text-yellow-400 ...">
                    {game.genres[0].name}
                  </span>
                )}
                <span className="text-gray-400">
                  {game.first_release_date
                    ? new Date(game.first_release_date * 1000).getFullYear()
                    : "N/A"}
                </span>
                {game.rating != null && (
                  <p className="text-yellow-400 text-xs font-medium">
                    ★ {(game.rating / 10).toFixed(1)}
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="text-red-500 text-3xl">
              No games to show at the momemt, please try again later!
            </p>
          )}
        </div>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className={
                page === 1 ? "pointer-events-none opacity-50 p-2" : "cursor-pointer p-2"
              }
              size={8}
            />
          </PaginationItem>

          {Array.from({ length: data?.totalPages ?? 0 }).map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => setPage(i + 1)}
                isActive={page === i + 1}
                className="cursor-pointer p-2"
                size={8}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() =>
                setPage((p) => Math.min(data?.totalPages ?? 1, p + 1))
              }
              className={
                page === data?.totalPages
                  ? "pointer-events-none opacity-50 p-2"
                  : "cursor-pointer p-2"
              }
              size={8}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default Games;
