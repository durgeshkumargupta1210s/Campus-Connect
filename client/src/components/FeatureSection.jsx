import React from 'react'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import BlueCircle from './BlueCircle'
import { dummyShowsData } from '../assets/assets'
import MovieCard from './MovieCard'

const FeatureSection = () => {
  const navigate = useNavigate();

  return (
    <div className="relative px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden">

      {/* Decorative Circle */}
      <BlueCircle top="0px" right="-80px" />

      {/* Header */}
      <div className="flex items-center justify-between relative z-10">
        <p className="text-gray-300 font-medium text-lg">Now Showing</p>
        <button 
          onClick={() => navigate('/events')} 
          className="group flex items-center gap-2 text-sm text-gray-300 cursor-pointer"
        >
          View All 
          <ArrowRight className="group-hover:translate-x-0.5 transition w-4 h-4"/>
        </button>
      </div>


      {/* Event Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        {dummyShowsData.slice(0,4).map((show) => (
          <MovieCard key={show._id} event={show} />
        ))}
      </div> 


      {/* Show More Button */}
      <div className="flex justify-center mt-20">
        <button 
          onClick={() => { navigate('/events'); window.scrollTo(0,0); }} 
          className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
        >
          Show more
        </button>
      </div>

      
    </div>
  )
}

export default FeatureSection
