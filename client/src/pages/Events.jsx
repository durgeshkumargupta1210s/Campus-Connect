import React from 'react'
import { dummyShowsData } from '../assets/assets' 
import MovieCard from '../components/MovieCard'
import BlueCircle from '../components/BlueCircle'

const Events = () => {
  return dummyShowsData.length > 0 ?(
      <div className='relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]'>
        <BlueCircle top="150px" left="0px"/>
        <BlueCircle bottom="50px" right="50px"/>

        <h1 className='text-lg font-medium my-4'>Now Showing</h1>
        <div className='flex flex-wrap max-sm:justify-center gap-8'>
        {dummyShowsData.map((event)=>(
          <MovieCard event={event} key={event._id}/>
        ))}
      </div>
    </div>

  ):
  (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-3xl font-bold text-center'>No events available</h1>

    </div>

  )
}

export default Events