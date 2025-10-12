import React, { useState } from "react";
import ReactPlayer from "react-player";
import { PlayCircleIcon } from "lucide-react";

import BlueCircle from "./BlueCircle";
import { dummyTrailers } from "../assets/assets";

const TrailersSection = () => {
  const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0]);

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden">
      {/* Section Heading */}
      <p className="text-gray-300 font-medium text-lg max-w-[960px]">
        Highlights
      </p>

      {/* Main Trailer Player */}
      <div className="relative mt-6 flex justify-center">
        <BlueCircle top="-100px" right="-100px" />
        {currentTrailer?.videoUrl && (
          <div className="w-full max-w-4xl aspect-video">
            <ReactPlayer
              key={currentTrailer.videoUrl}  // ✅ Forces reload when URL changes
              url={currentTrailer.videoUrl}
              controls={true}
              playing={true}
              muted={true}
              width="100%"
              height="100%"
              className="rounded-lg overflow-hidden"
            />
          </div>
        )}
      </div>

      {/* Trailer Thumbnails */}
      <div className="group grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-8 mt-8 max-w-3xl mx-auto">
        {dummyTrailers.map((trailer) => {
          const isActive = currentTrailer.videoUrl === trailer.videoUrl;
          return (
            <div
              key={trailer.image}
              onClick={() => setCurrentTrailer(trailer)}
              className={`
                relative cursor-pointer rounded-lg overflow-hidden transition-transform duration-300
                ${isActive ? "scale-105 ring-4 ring-blue-500" : "hover:scale-105 opacity-80 hover:opacity-100"}
              `}
            >
              <img
                src={trailer.image}
                alt="trailer thumbnail"
                className="w-full h-full object-cover brightness-75"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <PlayCircleIcon
                  strokeWidth={1.6}
                  className="w-8 h-8 md:w-10 md:h-10 text-white drop-shadow-lg"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrailersSection;
