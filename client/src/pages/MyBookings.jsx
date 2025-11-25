import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";
import BlueCircle from "../components/BlueCircle";
import dateFormat from "../lib/dateFormat";
import api from "../lib/api";
import { useUser } from "@clerk/clerk-react";

const MyBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const { user } = useUser();

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getMyBookings = async () => {
    try {
      const email = user?.primaryEmailAddress?.emailAddress;
      const query = email ? `?email=${encodeURIComponent(email)}` : "";
      const res = await api.get(`/bookings${query}`);
      setBookings(res.data || []);
    } catch (err) {
      console.error("Failed to load bookings:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getMyBookings();
  }, [user]);

  if (isLoading) return <Loading />;

  return bookings.length > 0 ? (
    <div className="relative my-24 px-6 md:px-16 lg:px-40 xl:px-44 min-h-[80vh]">
      <BlueCircle top="150px" left="0px" />
      <BlueCircle bottom="50px" right="50px" />

      <h1 className="text-lg font-medium my-4">My Bookings</h1>

      {bookings.map((item) => (
        <div
          key={item._id}
          className="border border-gray-700 rounded-lg p-4 mb-4"
        >
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">
                {item.event?.title || "Event"}
              </h2>
              <p className="text-gray-400">
                {dateFormat(item.date)} •{" "}
                {new Date(item.time).toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-gray-400">
                Seat Number: {item.bookedSeats.join(", ")}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold">
                {currency} {item.amount}
              </p>
              <p className="text-gray-400 text-sm">
                Status: {item.isPaid ? "Paid" : "Unpaid"}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="flex items-center justify-center h-[60vh]">
      <p>No bookings found</p>
    </div>
  );
};

export default MyBookings;
