import React,{useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import { dummyDateTimeData, dummyShowsData } from '../assets/assets'
import { Heart, PlayCircleIcon, StarIcon } from 'lucide-react'
import timeFormat from '../lib/timeFormat'
import Header from '../components/Navbar';
import Footer from '../components/Footer'
import BlueCircle from '../components/BlueCircle';


const EventsDetails = () => {
  const {id}=useParams()
  const [show,setShow]=useState(null)

  // const getShow=async ()=>{
  //   const show=dummyShowsData.find(show=>show._id===id)
  //   setShow({
  //     event:show,
  //     dateTime:dummyDateTimeData
  //   })
  // }

  // useEffect(()=>{
  //   getShow()
  // },[id])

  useEffect(() => {
    const foundShow = dummyShowsData.find((s) => s._id === id);
    if (foundShow) {
      setShow({
        event: foundShow,
        dateTime: dummyDateTimeData
      });
    }
  }, [id]);

  if (!show) return <div>Loading...</div>;
  
  return (
    <div className='px-6 md:px-16 lg:px-40 pt-30 md:pt-50'>
      <div className='flex flex-col md:flex-row gap-8 max-w-6xl mx-auto'>
        <img src={show.event.poster_path} alt=""
         className='max-md:mx-auto rounded-xl h-104 max-w-70 object-cover'/>
         <div className='relative flex flex-col gap-3'>
          <BlueCircle top="-100px" left="-100px"/>
          <p className='text-primary'>ENGLISH</p>
          <h1 className='text-4xl font-semibold max-w-96 text-balance'>{show.event.title}</h1>
          <div className='flex items-center gap-2 text-gray-300'>
            <StarIcon className='w-5 h-5 text-primary fill-primary'/>
            {show.event.vote_average.toFixed(1)}User Rating
          </div>
          <p className='text-gray-400 mt-2 text-sm leading-tight max-w-xl'>{show.event.overview}</p>
          <p>
            {timeFormat(show.event.runtime)} • {show.event.genres.map(genre=>genre.name).join(",")} • {show.event.release_date.split("-")[0]}
          </p>
          <div className='flex items-center flex-wrap gap-4 mt-4'>
            <button className='flex items-center gap-2 px-7 py-3 text-sm bg-gray-800 hover:bg-gray-900 
            transition rounded-md font-medium cursor-pointer active:scale-95'>
              <PlayCircleIcon className={`w-5 h-5`}/>
              Watch Event
            </button>
            <a href="#dateSelect" className='px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition 
            rounded-md font-medium cursor-pointer active:scale-95'>
              Buy Tickets</a>
            <button className='bg-gray-700 p-2.5 rounded-full transition cursor-pointer active:scale-95'>
              <Heart className={`w-5 h-5`}/>
            </button>
          </div>
        </div>
      </div>

      <p className='text-lg font-medium mt-20'>Your favorite Cast</p>
      <div className='overflow-x-auto no-scrollbar mt-8 pb-4'>
        <div className='flex items-center gap-4 w-max px-4'>
          {show.event.casts.slice(0,12).map((cast,index)=>(
            <div key={index} className='flex flex-col items-center text-center'>
              <img src={cast.profile_path} alt="" className='rounded-full h-20 md:h-20 aspect-square object-cover' />
              <p>{cast.name}</p>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default EventsDetails