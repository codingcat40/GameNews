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
import { useNavigate } from "react-router-dom";

export type Game = {
  id: number;
  name: string;
  rating?: number;
  rating_count?: number;
  aggregated_rating?: number;
  aggregated_rating_count?: number;
  summary?: string;
  storyline?: string;
  status?: number;
  category?: number;
  slug?: string;
  first_release_date?: number;
  genres?: { id: number; name: string }[];
  themes?: { id: number; name: string }[];
  platforms?: { id: number; name: string }[];
  game_modes?: { id: number; name: string }[];
  player_perspectives?: { id: number; name: string }[];
  game_engines?: { id: number; name: string }[];
  involved_companies?: {
    id: number;
    developer: boolean;
    publisher: boolean;
    company: { id: number; name: string };
  }[];
  cover?: { id: number; url: string };
  screenshots?: { id: number; url: string }[];
  videos?: { id: number; video_id: string }[];
  websites?: { id: number; url: string; category: number }[];
  age_ratings?: { id: number; rating: number; category: number }[];
};

const Games = () => {
  const [InputValue, setInputValue] = useState<string>("");
  const [searchTerm] = useDebounce(InputValue, 1000);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-black text-white flex flex-col items-center px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 space-y-8 sm:space-y-12">
  
  {/* Search Section */}
  <div className="w-full max-w-4xl flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-6">
    <p className="text-base sm:text-lg font-semibold whitespace-nowrap">Search here</p>
    <input
      className="flex-1 p-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 text-sm sm:text-base"
      type="text"
      value={InputValue}
      onChange={(e) => setInputValue(e.target.value)}
      placeholder="Red Dead Redemption..."
    />
  </div>

  {/* Content Section */}
  <div className="w-full max-w-6xl">
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
      {data?.results?.length ? (
        data.results.map((game) => (
          <div
            key={game.id}
            onClick={() => navigate(`/games/game/${game.id}`)}
            className="relative rounded-xl overflow-hidden group cursor-pointer bg-gray-900 border border-white/10 hover:border-yellow-400/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
          >
            <img
              src={game.cover?.url?.replace("t_thumb", "t_cover_big")}
              alt={game.name}
              className="w-full h-48 sm:h-56 md:h-64 lg:h-72 object-cover"
            />
            {game.age_ratings?.some((r) => r.rating >= 5) && (
              <span className="absolute top-2 right-2 text-[10px] font-bold uppercase tracking-widest bg-red-500 text-white px-2 py-0.5 rounded">
                18+
              </span>
            )}
            <div className="p-2 sm:p-3 space-y-1">
              <p className="text-white font-semibold text-xs sm:text-sm leading-tight line-clamp-1">
                {game.name}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {game.genres?.[0]?.name && (
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-yellow-400 bg-yellow-400/10 border border-yellow-400/25 px-2 py-0.5 rounded">
                    {game.genres[0].name}
                  </span>
                )}
                <span className="text-[10px] sm:text-[11px] text-gray-400">
                  {game.first_release_date
                    ? new Date(game.first_release_date * 1000).getFullYear()
                    : "N/A"}
                </span>
              </div>
              {game.rating != null && (
                <p className="text-yellow-400 text-[10px] sm:text-xs font-medium">
                  ★ {(game.rating / 10).toFixed(1)}
                </p>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="col-span-full text-red-500 text-lg sm:text-2xl lg:text-3xl text-center py-12">
          No games to show at the moment, please try again later!
        </p>
      )}
    </div>
  </div>

  {/* Pagination */}
  <Pagination>
    <PaginationContent className="flex-wrap justify-center gap-1">
      <PaginationItem>
        <PaginationPrevious
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className={
            page === 1
              ? "pointer-events-none opacity-50 p-2 text-xs sm:text-sm"
              : "cursor-pointer p-2 text-xs sm:text-sm"
          }
          size={8}
        />
      </PaginationItem>

      {Array.from({ length: data?.totalPages ?? 0 }).map((_, i) => (
        <PaginationItem key={i} className="hidden sm:block">
          <PaginationLink
            onClick={() => setPage(i + 1)}
            isActive={page === i + 1}
            className="cursor-pointer p-2 text-xs sm:text-sm"
            size={8}
          >
            {i + 1}
          </PaginationLink>
        </PaginationItem>
      ))}

      {/* Mobile: show current page indicator instead of all page buttons */}
      <PaginationItem className="sm:hidden">
        <span className="px-3 py-2 text-xs text-gray-400">
          Page {page} of {data?.totalPages ?? 0}
        </span>
      </PaginationItem>

      <PaginationItem>
        <PaginationNext
          onClick={() => setPage((p) => Math.min(data?.totalPages ?? 1, p + 1))}
          className={
            page === data?.totalPages
              ? "pointer-events-none opacity-50 p-2 text-xs sm:text-sm"
              : "cursor-pointer p-2 text-xs sm:text-sm"
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
