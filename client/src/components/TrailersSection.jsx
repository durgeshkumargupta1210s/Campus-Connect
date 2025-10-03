import React, { useState } from "react";
import ReactPlayer from "react-player";

import BlueCircle from "./BlueCircle";
import { dummyTrailers } from "../assets/assets";
import { PlayCircleIcon } from "lucide-react";
// import ReactPlayer from "react-player/youtube";


const TrailersSection = () => {
  const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0]);

  // const handleTrailerClick = (trailer) => {
  //   setCurrentTrailer(trailer);
  // };

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden">
      <p className="text-gray-300 font-medium text-lg max-w-[960px]">
        Highlights
      </p>

      <div className="relative mt-6">
        <BlueCircle top="-100px" right="-100px" />
        {currentTrailer?.videoUrl && (
          <ReactPlayer
            key={currentTrailer.videoUrl}
            url={currentTrailer.videoUrl}
            //playing={true}
            muted={true}
            controls={true}
            width="960px"
            height="540px"
            className="mx-auto"
          />
        )}
      </div>

      <div className="group grid grid-cols-4 gap-4 md:gap-8 mt-8 max-w-3xl mx-auto">
        {dummyTrailers.map((trailer) => (
          <div
            key={trailer.image}
            className='relative group-hover:not-hover:opacity-50 hover:-translate-y-1 duration-300 transition max-md:h-60 md:max-h-60 cursor-pointer'
        
            onClick={() => setCurrentTrailer(trailer)}
            // ${currentTrailer.videoUrl === trailer.videoUrl
            //     ? 'scale-105 ring-4 ring-blue-500'
            //     : 'opacity-60 hover:opacity-100 hover:scale-105'
            //   }
            // `}
          >
            <img
              src={trailer.image}
              alt="trailer thumbnail"
              className="rounded-lg w-full h-full object-cover brightness-75"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <PlayCircleIcon
                strokeWidth={1.6}
                className="absolute top-1/2 left-1/2 w-5 md:w-8 h-5 md:h-12 transform -translate-x-1/2 -translate-y-1/2"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrailersSection