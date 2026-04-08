import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import type { Game } from "./Games";
import { Spinner } from "./ui/spinner";

const GameDetail = () => {
  const {id} = useParams();
  
  const fetchGame = async (): Promise<Game> => {
    const res = await fetch(`http://localhost:5000/games/${id}`)
    if(!res.ok) throw new Error("Network response was not okay")
    return res.json()
  }

  const {data: game, isLoading, error} = useQuery({
    queryKey: ["game", id],
    queryFn: fetchGame,
  })

  if(isLoading) return <Spinner className="text-center justify-center size-16 m-auto"/>
  if(error instanceof Error) return <p className="text-red-500">Error: {error.message}</p>
  if(!game) return null

  const officialSite = game.websites?.find((w) => w.category === 1)?.url;
  const steamPage = game.websites?.find((w) => w.category === 13)?.url;
  const developer = game.involved_companies?.find((c) => c.developer)?.company.name;
  const publisher = game.involved_companies?.find((c) => c.publisher)?.company.name;

  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 md:px-10 lg:px-16 py-8 sm:py-12 max-w-full mx-auto space-y-8 sm:space-y-10">
      
      {/* Hero */}
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-10">
        <img
          src={game.cover?.url?.replace("t_thumb", "t_cover_big")}
          alt={game.name}
          className="w-36 h-48 sm:w-44 sm:h-56 md:w-48 md:h-64 object-cover rounded-xl shrink-0 mx-auto sm:mx-0"
        />
        <div className="flex flex-col justify-center space-y-3 sm:space-y-4 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">{game.name}</h1>

          {/* Genres */}
          <div className="flex gap-2 flex-wrap justify-center sm:justify-start">
            {game.genres?.map((g) => (
              <span key={g.id} className="text-[10px] uppercase tracking-widest text-yellow-400 bg-yellow-400/10 border border-yellow-400/25 px-2 py-0.5 rounded">
                {g.name}
              </span>
            ))}
          </div>

          {/* Ratings */}
          <div className="flex gap-6 justify-center sm:justify-start">
            {game.rating != null && (
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest">User Rating</p>
                <p className="text-xl sm:text-2xl font-bold text-yellow-400">★ {(game.rating / 10).toFixed(1)}</p>
              </div>
            )}
            {game.aggregated_rating != null && (
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest">Critic Score</p>
                <p className="text-xl sm:text-2xl font-bold text-green-400">{game.aggregated_rating.toFixed(0)}</p>
              </div>
            )}
          </div>

          {/* Links */}
          <div className="flex gap-3 justify-center sm:justify-start flex-wrap">
            {officialSite && (
              <a href={officialSite} target="_blank" rel="noreferrer" className="px-3 sm:px-4 py-2 bg-white text-black text-xs sm:text-sm font-semibold rounded-lg hover:bg-gray-200 transition">
                Official Site
              </a>
            )}
            {steamPage && (
              <a href={steamPage} target="_blank" rel="noreferrer" className="px-3 sm:px-4 py-2 bg-zinc-800 text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-zinc-700 transition">
                Steam
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      {game.summary && (
        <div className="space-y-2">
          <h2 className="text-lg sm:text-xl font-semibold">Summary</h2>
          <p className="text-gray-400 leading-relaxed text-sm sm:text-base">{game.summary}</p>
        </div>
      )}

      {/* Details Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
        {game.first_release_date && (
          <div>
            <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest">Release Date</p>
            <p className="text-xs sm:text-sm mt-1">{new Date(game.first_release_date * 1000).toLocaleDateString()}</p>
          </div>
        )}
        {developer && (
          <div>
            <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest">Developer</p>
            <p className="text-xs sm:text-sm mt-1">{developer}</p>
          </div>
        )}
        {publisher && (
          <div>
            <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest">Publisher</p>
            <p className="text-xs sm:text-sm mt-1">{publisher}</p>
          </div>
        )}
        {game.game_modes && (
          <div>
            <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest">Game Modes</p>
            <p className="text-xs sm:text-sm mt-1">{game.game_modes.map((m) => m.name).join(", ")}</p>
          </div>
        )}
        {game.platforms && (
          <div className="col-span-2 sm:col-span-1">
            <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest">Platforms</p>
            <p className="text-xs sm:text-sm mt-1">{game.platforms.map((p) => p.name).join(", ")}</p>
          </div>
        )}
        {game.game_engines && (
          <div>
            <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest">Engine</p>
            <p className="text-xs sm:text-sm mt-1">{game.game_engines.map((e) => e.name).join(", ")}</p>
          </div>
        )}
      </div>

      {/* Screenshots */}
      {game.screenshots?.length && (
        <div className="space-y-3">
          <h2 className="text-lg sm:text-xl font-semibold">Screenshots</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {game.screenshots.map((s) => (
              <img
                key={s.id}
                src={s.url.replace("t_thumb", "t_screenshot_big")}
                alt="screenshot"
                className="rounded-lg w-full object-cover aspect-video"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default GameDetail