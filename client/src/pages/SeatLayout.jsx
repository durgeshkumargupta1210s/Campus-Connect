import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets, dummyDateTimeData } from "../assets/assets";
import Loading from "../components/Loading";
import { ArrowRightIcon, ClockIcon } from "lucide-react";
import isoTimeFormat from "../lib/isoTimeFormat";
import BlueCircle from "../components/BlueCircle";
import { toast } from "react-hot-toast";
import api from "../lib/api";
import { useUser } from "@clerk/clerk-react";

const SeatLayout = () => {
  // Grouping rows for seat layout
  const groupRows = [
    ["A", "B"],
    ["C", "D"],
    ["E", "F"],
    ["G", "H"],
    ["I", "J"],
  ];

  const { id, date } = useParams();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { user } = useUser();

  const getEvent = async () => {
    try {
      const res = await api.get(`/events/${id}`);
      setEvent(res.data);
    } catch (err) {
      console.error("Failed to load event:", err);
      toast.error("Failed to load event details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEvent();
  }, [id]);

  // Handle seat selection
  const handleSeatClick = (seatId) => {
    if (!selectedTime) {
      return toast("Please select time first");
    }

    if (!selectedSeats.includes(seatId) && selectedSeats.length >= 5) {
      return toast("You can only select 5 seats");
    }

    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((seat) => seat !== seatId)
        : [...prev, seatId]
    );
  };

  // Render seats for a given row
  const renderSeats = (row, count = 9) => (
    <div key={row} className="flex gap-2 mt-2">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {Array.from({ length: count }, (_, i) => {
          const seatId = `${row}${i + 1}`;
          const isSelected = selectedSeats.includes(seatId);
          return (
            <button
              key={seatId}
              onClick={() => handleSeatClick(seatId)}
              className={`h-8 w-8 rounded border border-primary/60 cursor-pointer transition 
                ${
                  isSelected ? "bg-primary text-white" : "hover:bg-primary/20"
                }`}
            >
              {seatId}
            </button>
          );
        })}
      </div>
    </div>
  );

  const handleProceed = async () => {
    if (!selectedTime) return toast("Please select time first");
    if (selectedSeats.length === 0)
      return toast("Please select at least one seat");

    try {
      const email = user?.primaryEmailAddress?.emailAddress;
      const name = user?.fullName || user?.firstName || "Guest";

      const payload = {
        eventId: id,
        userName: name,
        userEmail: email,
        date,
        time: selectedTime.time, // ISO string from dummyDateTimeData
        seats: selectedSeats,
        amount: selectedSeats.length * 100, // simple pricing
      };

      await api.post("/bookings", payload);
      toast.success("Booking successful!");
      navigate("/my-bookings");
    } catch (err) {
      console.error("Failed to create booking:", err);
      toast.error("Failed to create booking");
    }
  };

  return !loading && event ? (
    <div className="px-6 md:px-16 lg:px-40 pt-30 md:pt-50 flex flex-col md:flex-row gap-10">
      {/* Left Side - Event Poster & Info */}
      <div className="flex-1 max-w-md">
        <div className="flex gap-4">
          <img
            src={event.poster_path}
            alt={event.title}
            className="rounded-xl h-64 w-44 object-cover"
          />
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-2xl font-semibold">{event.title}</h1>
              <p className="text-gray-400 mt-2 text-sm">{event.overview}</p>
            </div>
            <p className="text-gray-400 mt-2 text-sm">
              {date} • Choose a show time
            </p>
          </div>
        </div>

        {/* Date & Time Selection */}
        <div className="mt-10">
          <h2 className="text-lg font-semibold mb-4">Select Time</h2>
          <div className="flex flex-wrap gap-4">
            {(dummyDateTimeData[date] || []).map((item) => (
              <div
                key={item.showId}
                onClick={() => setSelectedTime(item)}
                className={`flex items-center gap-2 border px-4 py-2 rounded cursor-pointer transition ${
                  selectedTime?.showId === item.showId
                    ? "bg-primary text-white"
                    : "hover:bg-primary/10"
                }`}
              >
                <ClockIcon className="w-4 h-4" />
                <p className="text-sm">{isoTimeFormat(item.time)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Seats Layout */}
      <div className="relative flex-1 flex flex-col items-center max-md:mt-16">
        <BlueCircle top="-100px" left="-100px" />
        <BlueCircle bottom="0" right="0" />
        <h1 className="text-2xl font-semibold mb-4">Select your seat</h1>
        <img src={assets.screenImage} alt="screen" />
        <p className="text-gray-400 text-sm">SCREEN SIDE</p>

        <div className="flex flex-col items-center mt-10 text-xs text-gray-300">
          {/* First group (A & B) */}
          <div className="grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6">
            {groupRows[0].map((row) => renderSeats(row))}
          </div>

          {/* Remaining groups */}
          <div className="grid grid-cols-2 gap-11">
            {groupRows.slice(1).map((group, idx) => (
              <div key={idx}>
                {group.map((row) => renderSeats(row))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-6 mt-8 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded border border-primary/60" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded bg-primary" />
            <span>Selected</span>
          </div>
        </div>

        {/* Proceed Button */}
        <button
          onClick={handleProceed}
          className="mt-10 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/80 transition flex items-center gap-2"
        >
          Proceed to Checkout ({selectedSeats.length} Seat
          {selectedSeats.length !== 1 ? "s" : ""})
          <ArrowRightIcon strokeWidth={3} className="w-4 h-4" />
        </button>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default SeatLayout;
