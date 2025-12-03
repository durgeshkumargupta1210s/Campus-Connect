import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import api from "../../lib/api";

const ListEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllEvents = async () => {
    try {
      const res = await api.get("/events");
      setEvents(res.data || []);
    } catch (err) {
      console.error("Failed to load events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllEvents();
  }, []);

  return !loading ? (
    <>
      <Title text1="List" text2="Events" />
      <div className="max-w-4xl mt-6 overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
          <thead>
            <tr className="bg-primary/20 text-left text-white">
              <th className="p-2 font-medium pl-5">Event Name</th>
              <th className="p-2 font-medium">Date</th>
              <th className="p-2 font-medium">Runtime</th>
              <th className="p-2 font-medium">Rating</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {events.map((event) => (
              <tr key={event._id} className="border-b border-gray-700/60">
                <td className="p-2 min-w-45 pl-5">{event.title}</td>
                <td className="p-2">
                  {event.release_date || "Not set"}
                </td>
                <td className="p-2">
                  {event.runtime ? `${event.runtime} min` : "NA"}
                </td>
                <td className="p-2">
                  {typeof event.vote_average === "number"
                    ? event.vote_average.toFixed(1)
                    : "NA"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  ) : (
    <Loading />
  );
};

export default ListEvents;
