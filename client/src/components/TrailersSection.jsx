import React, { useState } from "react";
import ReactPlayer from "react-player";
import BlueCircle from "./BlueCircle";
import { dummyTrailers } from "../assets/assets";
import { PlayCircleIcon } from "lucide-react";

const TrailersSection = () => {
  const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0]);

  const handleTrailerClick = (trailer) => {
    setCurrentTrailer(trailer);
  };

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden">
      <p className="text-gray-300 font-medium text-lg max-w-[960px]">
        Highlights
      </p>

      <div className="relative mt-6">
        <BlueCircle top="-100px" right="-100px" />
        <ReactPlayer
          key={currentTrailer.videoUrl}
          url={currentTrailer.videoUrl}
          playing={true}
          controls={true}
          className="mx-auto max-w-full"
          width="960px"
          height="540px"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-8 mt-8 max-w-[960px] mx-auto">
        {dummyTrailers.map((trailer) => (
          <div
            key={trailer.image}
            className={`
              relative rounded-lg overflow-hidden cursor-pointer
              transition-all duration-300 ease-in-out
              ${currentTrailer.videoUrl === trailer.videoUrl
                ? 'scale-105 ring-4 ring-blue-500'
                : 'opacity-60 hover:opacity-100 hover:scale-105'
              }
            `}
            onClick={() => handleTrailerClick(trailer)}
          >
            <img
              src={trailer.image}
              alt="trailer thumbnail"
              className="w-full h-full object-cover brightness-75"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <PlayCircleIcon
                strokeWidth={1.6}
                className="w-8 h-8 text-white opacity-90"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrailersSection