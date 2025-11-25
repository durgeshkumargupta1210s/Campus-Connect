import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Heart, PlayCircleIcon, StarIcon } from "lucide-react";
import timeFormat from "../lib/timeFormat";
import BlueCircle from "../components/BlueCircle";
import DateSelect from "../components/DateSelect";
import MovieCard from "../components/MovieCard";
import Loading from "../components/Loading";
import api from "../lib/api";
import { dummyShowsData, dummyDateTimeData } from "../assets/assets";

const EventsDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [similarEvents, setSimilarEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    try {
      const [eventRes, listRes] = await Promise.all([
        api.get(`/events/${id}`),
        api.get("/events"),
      ]);

      setEvent(eventRes.data);
      const others = (listRes.data || []).filter((e) => e._id !== id);
      setSimilarEvents(others.slice(0, 4));
    } catch (err) {
      console.error("Failed to fetch event, falling back to dummy:", err);
      // fallback – use dummy data if backend data not found
      const foundDummy = dummyShowsData.find((s) => s._id.toString() === id);
      if (foundDummy) {
        setEvent(foundDummy);
        setSimilarEvents(dummyShowsData.slice(0, 4));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  if (!event || loading) return <Loading />;

  const genres =
    event.genres && Array.isArray(event.genres)
      ? event.genres.map((g) => g.name).join(", ")
      : "";

  return (
    <div className="px-6 md:px-16 lg:px-40 pt-30 md:pt-50">
      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
        <img
          src={event.backdrop_path || event.poster_path}
          alt={event.title}
          className="max-md:mx-auto rounded-xl h-104 max-w-70 object-cover"
        />
        <div className="relative flex flex-col gap-3">
          <BlueCircle top="-100px" left="-100px" />
          <p className="text-primary">ENGLISH</p>
          <h1 className="text-4xl font-semibold max-w-96 text-balance">
            {event.title}
          </h1>
          <div className="flex items-center gap-2 text-gray-300">
            <StarIcon className="w-5 h-5 text-primary fill-primary" />
            {typeof event.vote_average === "number"
              ? event.vote_average.toFixed(1)
              : "N/A"}{" "}
            User Rating
          </div>
          <p className="text-gray-400 mt-2 text-sm leading-tight max-w-xl">
            {event.overview}
          </p>
          <p>
            {event.runtime ? timeFormat(event.runtime) : "Duration: NA"} •{" "}
            {genres} •{" "}
            {event.release_date
              ? event.release_date.split("-")[0]
              : "Upcoming"}
          </p>
          <div className="flex items-center flex-wrap gap-4 mt-4">
            <button className="flex items-center gap-2 px-7 py-3 text-sm bg-gray-800 hover:bg-gray-900 transition rounded-md font-medium cursor-pointer active:scale-95">
              <PlayCircleIcon className={`w-5 h-5`} />
              Watch Event
            </button>
            <a
              href="#dateSelect"
              className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer active:scale-95"
            >
              Buy Tickets
            </a>
            <button className="bg-gray-700 p-2.5 rounded-full transition cursor-pointer active:scale-95">
              <Heart className={`w-5 h-5`} />
            </button>
          </div>
        </div>
      </div>

      {/* still using dummyDateTimeData for multiple show timings */}
      <DateSelect dateTime={dummyDateTimeData} id={id} />

      <p className="text-lg font-medium mt-20 mb-8">You May Also Like</p>
      <div className="flex flex-wrap max-sm:justify-center gap-8">
        {similarEvents.length > 0
          ? similarEvents.map((ev) => <MovieCard key={ev._id} event={ev} />)
          : dummyShowsData.slice(0, 4).map((ev, index) => (
              <MovieCard key={index} event={ev} />
            ))}
      </div>
      <div className="flex justify-center mt-20">
        <button
          onClick={() => {
            navigate("/events");
            scrollTo(0, 0);
          }}
          className="px-10 py-3 bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer"
        >
          Show more
        </button>
      </div>
    </div>
  );
};

export default EventsDetails;
