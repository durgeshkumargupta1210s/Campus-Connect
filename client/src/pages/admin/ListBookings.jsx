import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import dateFormat from "../../lib/dateFormat";
import api from "../../lib/api";

const ListBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY;

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getAllBookings = async () => {
    try {
      const res = await api.get("/bookings");
      setBookings(res.data || []);
    } catch (err) {
      console.error("Failed to load bookings:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllBookings();
  }, []);

  return !isLoading ? (
    <>
      <Title text1="All" text2="Bookings" />
      <div className="max-w-4xl mt-6 overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
          <thead>
            <tr className="bg-primary/20 text-left text-white">
              <th className="p-2 font-medium pl-5">Event</th>
              <th className="p-2 font-medium">User</th>
              <th className="p-2 font-medium">Date</th>
              <th className="p-2 font-medium">Seats</th>
              <th className="p-2 font-medium">Amount</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {bookings.map((item) => (
              <tr key={item._id} className="border-b border-gray-700/60">
                <td className="p-2 min-w-45 pl-5">
                  {item.event?.title || "Event"}
                </td>
                <td className="p-2">
                  {item.userName || "Guest"}
                  <br />
                  <span className="text-xs text-gray-400">
                    {item.userEmail}
                  </span>
                </td>
                <td className="p-2">
                  {dateFormat(item.date)}{" "}
                  {new Date(item.time).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="p-2">{item.bookedSeats.join(", ")}</td>
                <td className="p-2">
                  {currency}
                  {item.amount}
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

export default ListBookings;
