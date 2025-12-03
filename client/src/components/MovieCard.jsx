import React from "react";
import { useNavigate } from "react-router-dom";
import { StarIcon } from "lucide-react";
import timeFormat from "../lib/timeFormat";

const MovieCard = ({ event }) => {
  const navigate = useNavigate();

  const runtime = event.runtime || 0;
  const genres =
    event.genres && Array.isArray(event.genres)
      ? event.genres.map((g) => g.name).join(", ")
      : "";

  return (
    <div
      className="flex flex-col justify-between p-3 bg-gray-800 rounded-2xl 
                 hover:-translate-y-1 transition duration-300 w-[264px]"
    >
      {/* Poster */}
      <div
        onClick={() => navigate(`/events/${event._id}`)}
        className="cursor-pointer"
      >
        <img
          src={event.poster_path}
          alt={event.title}
          className="rounded-xl w-full h-80 object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex flex-col gap-2 mt-3">
        <h2 className="font-semibold text-lg leading-tight line-clamp-2">
          {event.title}
        </h2>
        <p className="text-xs text-gray-400 line-clamp-2">{genres}</p>
        <p className="text-xs text-gray-400">
          {runtime ? timeFormat(runtime) : "Duration: NA"}
        </p>
      </div>

      {/* Footer Button */}
      <div className="flex items-center justify-between mt-3">
        <button
          onClick={() => navigate(`/events/${event._id}`)}
          className="bg-primary text-white text-xs px-3 py-2 rounded-lg hover:bg-primary/80 transition"
        >
          Buy Tickets
        </button>

        {/* Star Rating */}
        <p className="flex items-center gap-1 text-sm text-gray-400 pr-1">
          <StarIcon className="w-4 h-4 text-primary fill-primary" />
          {typeof event.vote_average === "number"
            ? event.vote_average.toFixed(1)
            : "N/A"}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
