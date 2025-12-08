import React from "react";
import { useNavigate } from "react-router-dom";
import { StarIcon } from "lucide-react";
import timeFormat from "../lib/timeFormat";

const MovieCard = ({ event }) => {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col justify-between p-3 bg-gray-800 rounded-2xl 
                 hover:-translate-y-1 transition duration-300 w-[264px]"
    >
      {/* Poster */}
      <div onClick={() => navigate(`/events/${event._id}`)} className="cursor-pointer">
        <img src={event.poster_path} alt={event.title} />
        <h2>{event.title}</h2>
      </div>

      {/* Title */}
      <p className="font-semibold mt-2 truncate">{event.title}</p>

      {/* Release info */}
      <p className="text-sm text-gray-400 mt-2">
        {new Date(event.release_date).getFullYear()} ·{" "}
        {event.genres?.slice(0, 2).map((genre) => genre.name).join(" | ")} ·{timeFormat(event.runtime)}
       
      </p>

      {/* Actions */}
      {/* button for buying tickets */}
      <div className="flex items-center justify-between mt-4 pb-2">
        <button
          onClick={() => {
            navigate(`/events/${event._id}`);
            window.scrollTo(0, 0);
          }}
          className="px-4 py-2 text-xs bg-primary hover:bg-primary-dull transition 
                     rounded-full font-medium cursor-pointer"
        >
          Buy Tickets
        </button>

          {/* Star Rating */}
        <p className="flex items-center gap-1 text-sm text-gray-400 pr-1">
          <StarIcon className="w-4 h-4 text-primary fill-primary" />
          {event.vote_average ? event.vote_average.toFixed(1) : "N/A"}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
